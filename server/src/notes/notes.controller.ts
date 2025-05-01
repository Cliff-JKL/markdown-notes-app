import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNoteDto } from './dto';
import { PageDto, PageOptionsDto } from 'src/common/dto';
import { Response } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GetNoteDto>> {
    return this.notesService.findAll(pageOptionsDto, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetNoteDto> {
    return this.notesService.findOne(id);
  }

  // TODO: create a files module ?
  @Get('static/:filename')
  findImage(@Param('filename') filename: string, @Res() response: Response) {
    if (filename === '') {
      response.status(HttpStatus.BAD_REQUEST);
      return {};
    } else {
      const rootPath = 'src/static/notes/';
      response.sendFile(filename, { root: rootPath });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
