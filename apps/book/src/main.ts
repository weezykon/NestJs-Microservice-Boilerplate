import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.BOOKS_SERVICE_PORT || '3003', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookModule,
    {
      transport: Transport.TCP,
      options: {
        port,
      },
    },
  );
  await app.listen();
  console.log(`Book microservice is listening on port ${port}`);
}
bootstrap();
