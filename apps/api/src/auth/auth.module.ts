import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { GoogleStrategy } from 'src/auth/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
