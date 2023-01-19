import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    /***/
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleOAuthLogin(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }
}
