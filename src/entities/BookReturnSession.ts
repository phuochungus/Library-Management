import {
  Column,
  CreateDateColumn,
  Entity,
  MongoClient,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import MongoEntity from './MongoEntity';
import { Collection } from 'mongoose';

@Entity()
export default class BookReturnSession implements MongoEntity {
  @ObjectIdColumn()
  _id: ObjectID;

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
