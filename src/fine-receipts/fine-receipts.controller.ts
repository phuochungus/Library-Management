import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FineReceiptsService } from './fine-receipts.service';
import { CreateFineReceiptDto } from './dto/create-fine-receipt.dto';
import ParseObjectIDStringPipe from 'src/pipes/parse-objectID-string.pipe';

@Controller('fine_receipts')
export class FineReceiptsController {
  constructor(private readonly fineReceiptsService: FineReceiptsService) {}

  @Post()
  async create(@Body() createFineReceiptDto: CreateFineReceiptDto) {
    return await this.fineReceiptsService.create(createFineReceiptDto);
  }

  @Get()
  async findAll() {
    return await this.fineReceiptsService.findAll();
  }

  @Get('/receipt/:id')
  findOne(@Param('id', ParseObjectIDStringPipe) id: string) {
    return this.fineReceiptsService.findOne(id);
  }

  @Get('/user/:userId')
  async findAllReceiptsRecords(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.fineReceiptsService.findAllFromUser(userId);
  }
}
