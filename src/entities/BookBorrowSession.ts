import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { ObjectId } from 'mongodb';

@Entity({ engine: 'mongodb' })
export default class BookBorrowSession implements MongoEntity {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  quantity: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: Date;
}
