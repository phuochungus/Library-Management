import {
  BadGatewayException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import { Brackets, In, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { v4 as uuidv4 } from 'uuid';
import Genre from 'src/entities/Genre';
import BusinessValidateService from 'src/business-validate/business-validate.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(Genre) private genresRepository: Repository<Genre>,
    private readonly businessValidateService: BusinessValidateService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { genreIds, ...rest } = createBookDto;
    const bookId = uuidv4();
    const bookProfile = {
      ...rest,
      bookId,
    };
    if (
      !this.businessValidateService.isBookPublicationYearValid(
        createBookDto.publishYear,
      )
    )
      throw new ConflictException('Book publish year not available');
      
    await this.booksRepository.insert(bookProfile);
    const genres: Genre[] = await this.genresRepository.findBy({
      genreId: In(genreIds),
    });
    let book = await this.booksRepository.findOneBy({ bookId });
    if (!book) throw new BadGatewayException();
    book.genres = genres;
    await this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    let books: Book[] = await this.booksRepository.find({
      relations: { user: true, genres: true },
    });
    books.sort((b1, b2) => {
      return b2.createdDate.getTime() - b1.createdDate.getTime();
    });
    return books.map((e) => {
      return {
        ...e,
        isAvailable: this.businessValidateService.isBookAvailable(e),
      };
    });
  }

  async findAllWithQueryParams(
    keywords: string | undefined,
    name: string | undefined,
    author: string | undefined,
    genre: string | undefined,
    page: string = '0',
    status: string | undefined,
  ) {
    const RESULT_IN_A_PAGE = 15;
    let queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genres', 'genre')
      .leftJoinAndSelect('book.user', 'user');

    if (keywords)
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('book.bookId LIKE :keywords', {
            keywords: `%${keywords}%`,
          })
            .orWhere('book.name LIKE :keywords')
            .orWhere('book.author LIKE :keywords');
        }),
      );
    if (name)
      queryBuilder.andWhere('book.name LIKE :name', { name: `%${name}%` });
    if (author)
      queryBuilder.andWhere('book.author LIKE :author', {
        author: `%${author}%`,
      });

    queryBuilder = queryBuilder
      .take(RESULT_IN_A_PAGE)
      .skip(RESULT_IN_A_PAGE * parseInt(page));

    if (genre)
      queryBuilder.andWhere('genre.name LIKE :genre', { genre: `%${genre}%` });

    switch (status) {
      case undefined:
        break;

      case 'AVAILABLE':
        queryBuilder.andWhere('book.user IS NULL OR book.dueDate < NOW()');
        break;

      case 'UNAVAILABLE':
        queryBuilder.andWhere(
          'book.user IS NOT NULL AND book.dueDate >= NOW()',
        );
        break;

      default:
        break;
    }
    let result = await queryBuilder.getMany();
    return result.map((e: Book) => {
      return {
        ...e,
        isAvailable: this.businessValidateService.isBookAvailable(e),
      };
    });
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne({
      where: { bookId: id },
      relations: { user: true, genres: true },
    });
    if (book) return book;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    let book = await this.findOne(id);
    if (!book) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    if (updateBookDto.genreIds) {
      const genres: Genre[] = await this.genresRepository.findBy({
        genreId: In(updateBookDto.genreIds),
      });
      book.genres = genres;
    }
    const { genreIds, ...rest } = updateBookDto;
    book = { ...book, ...rest };
    return await this.booksRepository.save(book);
  }

  async remove(id: string) {
    await this.booksRepository.softDelete({ bookId: id });
  }

  async updateBookGenre(bookId: string, updateGenreNamesDto: string[]) {
    let book = await this.booksRepository.findOne({
      where: { bookId },
      relations: { genres: true },
    });
    if (!book) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const genresWillBeResolve: Genre[] = await this.genresRepository.findBy({
      name: In(updateGenreNamesDto),
    });

    book.genres = genresWillBeResolve;
    await this.booksRepository.save(book);
  }
}
