import { IsUUID } from 'class-validator';

export class ReserveBookDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}

export class ReserveBookDTOV2 {
  @IsUUID(4, { each: true })
  bookIds: string[];
}
