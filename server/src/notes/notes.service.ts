import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { MongoRepository } from 'typeorm';
import { createFile, updateFile } from './common';
import { ObjectId, AggregationCursor } from 'mongodb';
import { GetNoteDto } from './dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dto';
import { Order } from 'src/common/constants/order.constant';
import { removeFile } from 'src/common/other';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: MongoRepository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const fileName = await createFile(createNoteDto.text);

    const res = {
      title: createNoteDto.title,
      file: fileName,
      tags: createNoteDto.tags.map((t: string) => new ObjectId(t)),
      lastUpdated: new Date(createNoteDto.lastUpdated),
    };

    return await this.noteRepository.save(res);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search?: string,
  ): Promise<PageDto<GetNoteDto>> {
    let items: Note[] = [],
      itemsAggregation: AggregationCursor<Note>,
      itemCount = 0;

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'tag',
          localField: 'tags',
          foreignField: '_id',
          as: 'tags_info',
        },
      },
      {
        // $sort: { _id: pageOptionsDto.order === Order.ASC ? 1 : -1 },
        $sort: { lastUpdated: pageOptionsDto.order === Order.ASC ? 1 : -1 },
      },
      {
        $skip: pageOptionsDto.skip,
      },
      {
        $limit: pageOptionsDto.take,
      },
    ];

    if (search) {
      const regex = new RegExp(search, 'gi');
      const regexMatch = [
        {
          $match: {
            $or: [
              {
                title: {
                  $regex: regex,
                },
              },
              {
                tags_info: {
                  name: {
                    $regex: regex,
                  },
                },
              },
            ],
          },
        },
      ];

      itemsAggregation = this.noteRepository.aggregate(regexMatch);
      // // TODO: redo
      itemCount = (await itemsAggregation.clone().toArray()).length;

      itemsAggregation.pipeline.push(...aggregationPipeline);
    } else {
      itemsAggregation = this.noteRepository.aggregate(aggregationPipeline);
      itemCount = await this.noteRepository.count();
    }

    items = await itemsAggregation.toArray();

    const notes = items.map((item) => {
      return {
        id: item._id.toHexString(),
        title: item.title,
        file: item.file,
        tags: item.tags_info,
      };
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(notes, pageMetaDto);
  }

  async findOne(id: string): Promise<GetNoteDto> {
    const item = await this.noteRepository
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'tag',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags_info',
          },
        },
      ])
      .toArray();

    if (!item.length) {
      throw new NotFoundException();
    }

    return new GetNoteDto(
      item[0]._id.toHexString(),
      item[0].title,
      // item[0].text,
      item[0].file,
      item[0].tags_info,
    );
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    if (updateNoteDto?.text) {
      const note = await this.noteRepository.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (note === null) {
        throw new NotFoundException('note not found');
      } else {
        await updateFile(`src/static/notes/${note.file}`, updateNoteDto.text);
      }
    }

    // TODO: redo
    if (updateNoteDto.fields) {
      const fields = {};
      if (updateNoteDto.fields.title)
        fields['title'] = updateNoteDto.fields.title;
      if (updateNoteDto.fields.tags) {
        const tags = updateNoteDto.fields.tags.map(
          (t: string) => new ObjectId(t),
        );
        fields['tags'] = tags;
      }
      fields['lastUpdated'] = new Date(updateNoteDto.lastUpdated);
      return await this.noteRepository.updateOne(
        { _id: new ObjectId(id) },
        { $set: fields },
      );
    } else {
      return await this.noteRepository.updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastUpdated: new Date(updateNoteDto.lastUpdated) } },
      );
    }
  }

  // TODO: create type for this type of response
  async remove(id: string): Promise<any> {
    const item = await this.noteRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!item) {
      throw new NotFoundException();
    }

    removeFile(`src/static/notes/${item.file}`);

    return await this.noteRepository.deleteOne(item);
  }

  async findByTags(tags: string[]): Promise<GetNoteDto[]> {
    const tagsObjIds = tags.map((t) => new ObjectId(t));

    const items = await this.noteRepository
      .aggregate([
        {
          $match: {
            tags: {
              $all: tagsObjIds,
            },
          },
        },
        {
          $lookup: {
            from: 'tag',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags_info',
          },
        },
      ])
      .toArray();

    return items.map((item) => {
      return {
        id: item._id.toHexString(),
        title: item.title,
        file: item.file,
        tags: item.tags_info,
        tagsIds: item.tags,
      };
    });
  }

  // TODO: redo
  async deleteTagMany(tagId: string): Promise<boolean> {
    const notesToUpdate = await this.findByTags([tagId]);

    if (!notesToUpdate.length) {
      return true;
    }

    await this.noteRepository.updateMany(
      { _id: { $in: notesToUpdate.map((b) => new ObjectId(b.id)) } },
      {
        $pull: { tags: new ObjectId(tagId) as never },
      },
    );
  }
}
