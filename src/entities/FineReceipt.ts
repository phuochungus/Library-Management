import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import MongoEntity from './MongoEntity';

@Entity()
export default class FineReceipt implements MongoEntity {
  @ObjectIdColumn()
  _id: ObjectID;

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
