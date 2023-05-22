import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveBookShelfDto {
  @IsNotEmpty()
  @IsUUID()
  bookId: string;
}
