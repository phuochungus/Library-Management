import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowRecordsService } from './book-borrow-records.service';

describe('BookBorrowRecordsService', () => {
  let service: BookBorrowRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBorrowRecordsService],
    }).compile();

    service = module.get<BookBorrowRecordsService>(BookBorrowRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
