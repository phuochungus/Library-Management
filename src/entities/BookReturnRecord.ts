import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import MongoEntity from './MongoEntity';

@Entity()
export default class BookReturnRecord implements MongoEntity {
  @Column()
  bookId: string;

  @Column()
  userId: string;

  @Column()
  fine: number = 0;

  @Column()
  passDue: number = 0;

  @Column()
  sessionId: string;

  @CreateDateColumn()
  createdDate: Date;

  @ObjectIdColumn()
  _id: ObjectID;
}
