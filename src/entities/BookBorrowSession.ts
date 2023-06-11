import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { ObjectID } from 'mongodb';

@Entity()
export default class BookBorrowSession implements MongoEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  quantity: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: Date;
}
