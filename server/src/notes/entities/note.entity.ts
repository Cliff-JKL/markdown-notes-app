import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Note {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  file: string;

  // @Column((type) => Tag)
  @Column()
  tags: ObjectId[];

  @Column()
  lastUpdated: Date;

  // TODO: delete this field from entity and create aggregations for this
  // @Column()
  tags_info?: any;
}
