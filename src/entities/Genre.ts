import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Book from './Book';
import TimeStampImp from './TimeStamp';

@Entity()
export default class Genre implements TimeStampImp {
  @PrimaryColumn()
  genreId: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Book, (Book) => Book.genres, { lazy: true })
  books: Promise<Book[]>;
  
  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deleteDate?: Date;
}
