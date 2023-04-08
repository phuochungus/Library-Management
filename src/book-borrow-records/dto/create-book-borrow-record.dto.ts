import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateBookBorrowRecordDto {
  @IsUUID()
  userId: string;

  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  bookIds: string[];
}
