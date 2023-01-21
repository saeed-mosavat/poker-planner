import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user?: User) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const currentUser = await this.userService.findByEmail(user.email);

    if (!currentUser) {
      return this.registerUser(user);
    }

    await this.userService.update(currentUser.id, user);

    return this.jwtService.sign({
      sub: currentUser.id,
      email: currentUser.email,
    });
  }

  async registerUser(user: CreateUserDto) {
    try {
      const newUser = await this.userService.create(user);

      return this.jwtService.sign({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
