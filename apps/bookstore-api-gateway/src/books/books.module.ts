import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksController } from '../books/books.controller';
import { BooksService } from '../books/books.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigService } from '../client-config/client-config.service';
import { BOOKS_CLIENT } from './constant';

@Module({
  imports: [ConfigModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    ClientConfigService,
    {
      provide: BOOKS_CLIENT,
      useFactory: (clientConfigService: ClientConfigService) => {
        const clientOptions = clientConfigService.booksClientOptions();
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class BooksModule {}
