import { Column } from 'typeorm';

export abstract class Person {
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  birth: Date;

  @Column()
  address: string;
}
