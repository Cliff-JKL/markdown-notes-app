import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Tag {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;
}
