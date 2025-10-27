import { NestFactory } from '@nestjs/core';
import { BookstoreApiGatewayModule } from './bookstore-api-gateway.module';

async function bootstrap() {
  const port = parseInt(process.env.API_GATEWAY_PORT || '3001', 10);
  const app = await NestFactory.create(BookstoreApiGatewayModule);
  await app.listen(port);
  console.log(`API Gateway is running on http://localhost:${port}`);
}
bootstrap();
