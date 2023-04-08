import { Test, TestingModule } from '@nestjs/testing';
import { BookShelfService } from './book-shelf.service';

describe('BookShelfService', () => {
  let service: BookShelfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookShelfService],
    }).compile();

    service = module.get<BookShelfService>(BookShelfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
