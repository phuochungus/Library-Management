import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import QueryReportDTO from './dto/query-report.dto';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/roles.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/borrow_by_genres')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() queryReportDto: QueryReportDTO) {
    return await this.reportsService.getReportBorrowByGenres(
      queryReportDto.month,
      queryReportDto.year,
    );
  }

  @Get('/pass_due')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Query() queryReportDto: QueryReportDTO) {
    return await this.reportsService.getReportLateReturn(
      queryReportDto.month,
      queryReportDto.year,
    );
  }
}
