import { Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookDto } from 'apps/bookstore-api-gateway/src/books/dto/create-book.dto';
import { BookDto } from 'apps/bookstore-api-gateway/src/books/dto/book.dto';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('books.create')
  create(@Payload() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @MessagePattern('books.findAll')
  findAll(): BookDto[] {
    return this.bookService.findAll();
  }

  @MessagePattern('books.findOne')
  findOne(@Payload() id: number): BookDto | undefined {
    return this.bookService.findOne(id);
  }

  @MessagePattern('books.update')
  update(
    @Payload() updateBookData: { id: number } & Partial<BookDto>,
  ): BookDto | undefined {
    return this.bookService.update(updateBookData.id, updateBookData);
  }

  @MessagePattern('books.remove')
  remove(@Payload() id: number): boolean {
    return this.bookService.remove(id);
  }
}
