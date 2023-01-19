import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {
  googleLogin(req: Request) {
    return Promise.resolve();
  }
}
