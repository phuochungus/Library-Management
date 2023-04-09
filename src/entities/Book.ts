import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Genre from './Genre';
import TimeStampImp from './TimeStamp';
import User from './User';
@Entity()
export default class Book implements TimeStampImp {
  @PrimaryColumn()
  bookId: string;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  publishYear: number;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.books, {
    nullable: true,
    cascade: true,
  })
  user: User | null;

  @ManyToMany(() => Genre, (Genre) => Genre.books, {
    eager: true,
  })
  @JoinTable({
    name: 'book_genre',
    joinColumn: { name: 'bookId', referencedColumnName: 'bookId' },
    inverseJoinColumn: { name: 'genreId', referencedColumnName: 'genreId' },
  })
  genres: Genre[];

  @ManyToMany(() => User, (user) => user.bookShelf, {
    lazy: true,
  })
  users: Promise<User[]>;

  @Column({ type: 'datetime', nullable: true })
  borrowedDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  reservedDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deleteDate?: Date;
}
