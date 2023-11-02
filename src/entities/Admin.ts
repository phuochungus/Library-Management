import {
  BeforeInsert,
  BeforeUpdate,
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
@Index(['username', 'isActive', 'email'], { unique: true })
export default class Admin extends Person implements TimeStampImp {
  @PrimaryColumn()
  adminId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleteDate' })
  deleteDate?: Date;

  @Column()
  isActive: boolean = true;

  @BeforeInsert()
  @BeforeUpdate()
  checkIsActive() {
    if (!this.deleteDate) this.isActive = true;
    this.isActive = false;
  }
}
