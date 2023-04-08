import { Column } from 'typeorm';

export abstract class Person {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  birth: Date;

  @Column()
  address: string;
}
