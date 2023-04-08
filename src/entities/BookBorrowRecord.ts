import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import MongoEntity from './MongoEntity';

@Entity()
export default class BookBorrowRecord implements MongoEntity {
  @Column()
  bookId: string;

  @Column()
  userId: string;

  @Column()
  sessionId: string;

  @CreateDateColumn()
  createdDate: Date;

  @ObjectIdColumn()
  _id: ObjectID;
}
