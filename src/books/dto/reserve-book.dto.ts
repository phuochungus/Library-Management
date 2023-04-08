import { IsUUID } from 'class-validator';

export class ReserveBookDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}
