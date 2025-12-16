import { Controller, Post, Body, Session, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<UserEntity> {
    const user = await this.authService.login(loginDto);
    
    if (request.session) {
      request.session.userId = user.id;
      request.session.userEmail = user.email;
      request.session.userRole = user.role;
    }

    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: Request): { message: string } {
    if (request.session) {
      request.session.destroy(() => {});
    }
    return { message: 'Logged out successfully' };
  }
}
