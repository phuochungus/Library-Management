import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity({ engine: 'mongodb' })
export default class BookBorrowReturnHistory {
  @ObjectIdColumn({ primary: true })
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

  @ObjectIdColumn({ nullable: true })
  returnSessionId?: ObjectId;

  @ObjectIdColumn()
  borrowSessionId: ObjectId;

  @Column({ default: null })
  returnDate: Date | null;

  @Column({ default: null })
  fine: number | null;

  @Column({ default: null })
  numberOfPassDueDays: number | null;
}
