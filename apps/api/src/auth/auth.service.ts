import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signIn(user?: UserDocument) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    console.log(user);
    return this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });
  }
}
