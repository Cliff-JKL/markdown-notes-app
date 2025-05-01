import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotesService } from 'src/notes/notes.service';

@Injectable()
export class TagsService {
  constructor(
    private notesService: NotesService,
    @InjectRepository(Tag)
    private tagRepository: MongoRepository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagRepository.save(createTagDto);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findOne(id: string): Promise<Tag> {
    return this.tagRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const fields = {};
    console.log(id);

    if (updateTagDto?.fields) {
      if (updateTagDto.fields?.name) {
        fields['name'] = updateTagDto.fields.name;
      }
    }

    if (Object.keys(fields).length) {
      return await this.tagRepository.updateOne(
        { _id: new ObjectId(id) },
        { $set: fields },
      );
    } else {
      return { message: 'Nothing to update' };
    }
  }

  async remove(id: string): Promise<any> {
    const item = await this.tagRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!item) {
      console.log(item);
      throw new NotFoundException();
    }

    await this.notesService.deleteTagMany(item.id.toHexString());

    return await this.tagRepository.delete(item);
  }
}
