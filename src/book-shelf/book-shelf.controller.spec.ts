import { Test, TestingModule } from '@nestjs/testing';
import { BookShelfController } from './book-shelf.controller';
import { BookShelfService } from './book-shelf.service';

describe('BookShelfController', () => {
  let controller: BookShelfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookShelfController],
      providers: [BookShelfService],
    }).compile();

    controller = module.get<BookShelfController>(BookShelfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
