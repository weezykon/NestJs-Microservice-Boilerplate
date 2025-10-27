import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookModule,
    {
      transport: Transport.TCP,
      options: {
        port: Number(process.env.port) || 3000,
      },
    },
  );
  await app.listen();
}
bootstrap();
