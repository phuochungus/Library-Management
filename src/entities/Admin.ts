import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from './Person';
import TimeStampImp from './TimeStamp';

@Entity()
@Index(['username', 'isActive'], { unique: true })
export default class Admin extends Person implements TimeStampImp {
  @PrimaryColumn()
  adminId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deleteDate?: Date;

  @Column({
    generatedType: 'VIRTUAL',
    asExpression: 'IF(deleteDate IS NULL, true, false)',
  })
  isActive: boolean = true;
}
