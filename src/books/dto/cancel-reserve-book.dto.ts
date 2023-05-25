import { IsUUID } from 'class-validator';

export class CancelReserveDTO {
  @IsUUID('4', { each: true })
  bookIds: string[];
}
