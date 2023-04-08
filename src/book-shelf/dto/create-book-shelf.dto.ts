import { IsUUID } from 'class-validator';

export class CreateBookShelfDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}
