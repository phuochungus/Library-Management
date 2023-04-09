import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export default class QueryBookBorrowSessionDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsDateString({ strict: true})
  createdDate?: string;
}
