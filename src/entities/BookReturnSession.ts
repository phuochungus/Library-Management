import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { ObjectId } from 'mongodb';

@Entity()
export default class BookReturnSession implements MongoEntity {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  quantity: number;

  @Column()
  fine: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: string;
}
