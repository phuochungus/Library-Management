import { Collection, ObjectId } from 'mongoose';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { NIL } from 'uuid';

@Entity()
export default class BookBorrowReturnHistory {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @Column({ default: null })
  returnDate: Date | null;

  @Column({ default: null })
  returnSessionId: string | null;

  @Column({ default: null })
  fine: number | null;

  @Column({ default: null })
  numberOfPassDueDays: number | null;
}
