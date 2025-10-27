import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private usersClient: ClientProxy) {}
  getUsers() {
    return this.usersClient.send('users.getUsers', {});
  }
  findUserById(id: number): Observable<User | undefined> {
    return this.getUsers().pipe(
      map((users: User[]) => users.find((user: User) => user.id === id)),
    );
  }
  createUser(user: User): Observable<User> {
    return this.usersClient.send('users.createUser', user);
  }
}
