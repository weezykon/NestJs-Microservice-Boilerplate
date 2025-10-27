import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigService } from '../client-config/client-config.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { USERS_CLIENT } from './constant';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ClientConfigService,
    {
      provide: USERS_CLIENT,
      useFactory: (clientConfigService: ClientConfigService) => {
        const clientOptions = clientConfigService.usersClientOptions();
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class UsersModule {}
