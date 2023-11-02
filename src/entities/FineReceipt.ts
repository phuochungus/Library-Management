import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import MongoEntity from './MongoEntity';
import { ObjectId } from 'mongodb';

@Entity()
export default class FineReceipt implements MongoEntity {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  userId: string;
  @Column()
  totalDebt: number;

  @Column()
  pay: number;

  @Column()
  remain: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
