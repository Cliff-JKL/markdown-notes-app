import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto {
  text?: string;
  fields?: {
    title?: string;
    tags?: string[];
  };
  // ISO date format
  lastUpdated: string;
}
