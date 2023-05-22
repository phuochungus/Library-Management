import { IsUUID } from 'class-validator';

export class CreateBookShelfDto {
  @IsUUID()
  bookId: string;
}
