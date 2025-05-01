import { Tag } from 'src/tags/entities/tag.entity';

export class GetNoteDto {
  id: string;
  title: string;
  // text: string;
  file: string;
  tags: Tag[];

  constructor(
    id: string,
    title: string,
    // text: string,
    file: string,
    tags: Tag[],
  ) {
    this.id = id;
    this.title = title;
    // this.text = text;
    this.file = file;
    this.tags = tags;
  }
}
