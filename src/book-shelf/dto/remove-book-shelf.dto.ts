import { IsUUID } from 'class-validator';

export class RemoveBookShelfDto {
  @IsUUID('4', { each: true })
  bookIds: string[];
}
