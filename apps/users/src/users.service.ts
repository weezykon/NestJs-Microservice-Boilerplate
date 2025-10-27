import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World!';
  }

  getUsers(): User[] {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
  }
}
