import { Test, TestingModule } from '@nestjs/testing';
import { BookReturnRecordsController } from './book-return-records.controller';
import { BookReturnRecordsService } from './book-return-records.service';

describe('BookReturnRecordsController', () => {
  let controller: BookReturnRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReturnRecordsController],
      providers: [BookReturnRecordsService],
    }).compile();

    controller = module.get<BookReturnRecordsController>(BookReturnRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
