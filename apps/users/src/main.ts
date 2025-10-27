import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.USERS_SERVICE_PORT || '3002', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port,
      },
    },
  );
  await app.listen();
  console.log(`Users microservice is listening on port ${port}`);
}
bootstrap();
