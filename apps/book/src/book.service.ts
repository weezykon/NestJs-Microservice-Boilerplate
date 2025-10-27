import { Injectable } from '@nestjs/common';
import { BookDto } from 'apps/bookstore-api-gateway/src/books/dto/book.dto';

@Injectable()
export class BookService {
  private books: BookDto[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      rating: 5,
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      rating: 5,
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      rating: 5,
    },
  ];

  findAll() {
    return this.books;
  }

  findOne(id: number): BookDto | undefined {
    return this.books.find((book: BookDto) => book.id === id);
  }

  create(bookData: Partial<BookDto>): BookDto {
    const newBook: BookDto = {
      id:
        this.books.length > 0
          ? Math.max(...this.books.map((b) => b.id)) + 1
          : 1,
      title: bookData.title || '',
      author: bookData.author || '',
      rating: bookData.rating || 0,
    };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, bookData: Partial<BookDto>): BookDto | undefined {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return undefined;
    }
    this.books[bookIndex] = { ...this.books[bookIndex], ...bookData, id };
    return this.books[bookIndex];
  }

  remove(id: number): boolean {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return false;
    }
    this.books.splice(bookIndex, 1);
    return true;
  }
}
