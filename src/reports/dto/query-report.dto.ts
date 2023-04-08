import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export default class QueryReportDTO {
  @IsNumber()
  @Max(12)
  @Min(1)
  @Type(() => Number)
  month: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  year: number;
}
