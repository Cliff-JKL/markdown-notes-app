import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
