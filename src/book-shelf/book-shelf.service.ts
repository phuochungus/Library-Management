import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import _ from 'lodash';
import BusinessValidateService from 'src/business-validate/business-validate.service';
import { RulesService } from 'src/rules/rules.service';
import { RemoveBookShelfDto } from './dto/remove-book-shelf.dto';

@Injectable()
export class BookShelfService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private businessValidateService: BusinessValidateService,
    private rulesService: RulesService,
  ) {}

  async addBookToUserShelf(createBookShelfDto: CreateBookShelfDto) {
    let user = await this.usersRepository.findOneBy({
      userId: createBookShelfDto.userId,
    });
    let book = await this.booksRepository.findOneBy({
      bookId: createBookShelfDto.bookId,
    });

    if (!user || !book)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (
      await this.businessValidateService.IsUserAbleToMakeBorrowRequest(user)
    ) {
      let userBookShelf = await user.bookShelf;
      user.bookShelf = Promise.resolve([...userBookShelf, book]);
      await this.usersRepository.save(user);
    } else
      throw new HttpException(
        'User not able to perform action',
        HttpStatus.CONFLICT,
      );
  }

  async findAllFromUser(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return await user.bookShelf;
  }

  async remove(removeBookShelfDto: RemoveBookShelfDto) {
    let user = await this.usersRepository.findOneBy({
      userId: removeBookShelfDto.userId,
    });
    let book = await this.booksRepository.findOneBy({
      bookId: removeBookShelfDto.bookId,
    });

    if (!user || !book)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    let userBookShelf = await user.bookShelf;
    for (const i in userBookShelf) {
      if (userBookShelf[i].bookId == book.bookId) {
        userBookShelf.splice(parseInt(i), 1);
        user.bookShelf = Promise.resolve(userBookShelf);
        await this.usersRepository.save(user);
        break;
      }
    }
  }
}
