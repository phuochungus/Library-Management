import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import MongoEntity from './MongoEntity';
import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity()
export default class BookReturnRecord implements MongoEntity {
  @Column()
  @IsNotEmpty()
  bookId: string;

  @Column()
  userId: string;

  @Column()
  fine: number = 0;

  @Column()
  passDue: number = 0;

  @Column()
  returnSessionId: ObjectID;

  @Column()
  bookName: string;

  @Column()
  authorName: string;

  @Column()
  genreNames: string[];

  @CreateDateColumn()
  createdDate: Date;

  @ObjectIdColumn()
  _id: ObjectID;
}
