import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Rule {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column()
  about: string;

  @Column()
  value: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
