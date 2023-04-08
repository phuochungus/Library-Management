import { Module } from '@nestjs/common';
import { FineReceiptsService } from './fine-receipts.service';
import { FineReceiptsController } from './fine-receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/User';
import FineReceipt from 'src/entities/FineReceipt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([FineReceipt], 'mongoDB'),
  ],
  controllers: [FineReceiptsController],
  providers: [FineReceiptsService],
  exports: [FineReceiptsService],
})
export class FineReceiptsModule {}
