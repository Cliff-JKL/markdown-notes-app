import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId as objId } from 'mongodb';

@Entity()
export class Token {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  value: string;

  // TODO: store userId as string ?
  @ObjectIdColumn()
  userId: objId;

  // @Column((type) => Tag)
  // @Column()
  // tokens: ObjectId[];
}
