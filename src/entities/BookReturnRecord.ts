import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

@Entity()
export default class BookReturnRecord implements MongoEntity {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  @IsNotEmpty()
  bookId: string;

  @Column()
  userId: string;

  @Column()
  fine: number = 0;

  @Column()
  passDue: number = 0;

  @ObjectIdColumn()
  returnSessionId: ObjectId;

  @Column()
  bookName: string;

  @Column()
  authorName: string;

  @Column()
  genreNames: string[];

  @CreateDateColumn()
  createdDate: Date;
}
