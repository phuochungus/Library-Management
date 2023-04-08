import { Controller, Get, Query } from '@nestjs/common';
import { ParseMonthPipe } from 'src/pipes/parse-month.pipe';
import { ParseYearPipe } from 'src/pipes/parse-year.pipe';
import { ReportsService } from './reports.service';
import QueryReportDTO from './dto/query-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/borrow_by_genres')
  async findAll(@Query() queryReportDto: QueryReportDTO) {
    return await this.reportsService.getReportBorrowByGenres(
      queryReportDto.month,
      queryReportDto.year,
    );
  }

  @Get('/pass_due')
  async findOne(@Query() queryReportDto: QueryReportDTO) {
    return await this.reportsService.getReportLateReturn(
      queryReportDto.month,
      queryReportDto.year,
    );
  }
}
