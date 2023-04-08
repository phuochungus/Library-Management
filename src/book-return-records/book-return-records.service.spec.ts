import { Test, TestingModule } from '@nestjs/testing';
import { BookReturnRecordsService } from './book-return-records.service';

describe('BookReturnRecordsService', () => {
  let service: BookReturnRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookReturnRecordsService],
    }).compile();

    service = module.get<BookReturnRecordsService>(BookReturnRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
