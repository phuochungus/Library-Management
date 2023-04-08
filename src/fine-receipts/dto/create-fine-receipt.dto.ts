import { IsNumber, IsUUID } from 'class-validator';

export class CreateFineReceiptDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  pay: number;
}
