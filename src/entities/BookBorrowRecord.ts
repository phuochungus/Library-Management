import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { ObjectId } from 'mongodb';

@Entity()
export default class BookBorrowRecord implements MongoEntity {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  bookId: string;

  @Column()
  userId: string;

  @ObjectIdColumn()
  borrowSessionId: ObjectId;

  @Column()
  bookName: string;

  @Column()
  authorName: string;

  @Column()
  genreNames: string[];

  @CreateDateColumn()
  createdDate: Date;
}
