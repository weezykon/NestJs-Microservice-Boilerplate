import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor(private configService: ConfigService) {}

  getBooksServicePort(): number {
    return this.configService.get<number>('BOOKS_CLIENT_PORT') as number;
  }

  getUsersServicePort(): number {
    return this.configService.get<number>('USERS_CLIENT_PORT') as number;
  }

  usersClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getUsersServicePort(),
      },
    };
  }

  booksClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getBooksServicePort(),
      },
    };
  }
}
