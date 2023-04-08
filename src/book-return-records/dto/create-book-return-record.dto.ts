import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateBookReturnRecordDto {
  @IsUUID()
  userId: string;

  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  bookIds: string[];
}
