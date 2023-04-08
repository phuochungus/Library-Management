import { IsUUID } from 'class-validator';

export class RemoveBookShelfDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}
