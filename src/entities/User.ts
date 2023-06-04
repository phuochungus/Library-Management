import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Book from './Book';
import { Person } from './Person';
import TimeStampImp from './TimeStamp';

export enum UserClass {
  X = 'X',
  Y = 'Y',
}

@Entity()
@Index(['username', 'isActive', 'email'], { unique: true })
export default class User extends Person implements TimeStampImp {
  @PrimaryColumn()
  userId: string;

  @Column({
    type: 'enum',
    enum: UserClass,
    default: UserClass.X,
  })
  type: UserClass;

  @Column()
  validUntil: Date;

  @Column({ default: 0 })
  totalDebt: number;

  @OneToMany(() => Book, (book) => book.user, { lazy: true })
  books: Promise<Book[]>;

  @ManyToMany(() => Book, (book) => book.users, { lazy: true })
  @JoinTable({
    name: 'book_shelf',
    joinColumn: { name: 'userId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'bookId', referencedColumnName: 'bookId' },
  })
  bookShelf: Promise<Book[]>;

  @Column({
    generatedType: 'VIRTUAL',
    asExpression: 'IF(deleteDate IS NULL, true, false)',
  })
  isActive: boolean = true;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deleteDate?: Date;
}
