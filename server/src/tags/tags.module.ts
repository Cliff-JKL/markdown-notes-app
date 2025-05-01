import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), NotesModule], // FIXME: mongoose
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
