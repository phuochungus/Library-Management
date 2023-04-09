import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export default class BookBorrowReturnHistory {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  userId: string;

  @Column()
  bookId: string;

  @Column()
  bookName: string;

  @Column()
  author: string;

  @Column()
  borrowDate: Date;

  @Column()
  borrowSessionId: ObjectID;

  @Column({ default: null })
  returnDate: Date | null;

  @Column({ default: null })
  returnSessionId: ObjectID | null;

  @Column({ default: null })
  fine: number | null;

  @Column({ default: null })
  numberOfPassDueDays: number | null;
}
