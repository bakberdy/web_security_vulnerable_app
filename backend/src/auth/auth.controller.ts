import { Controller, Post, Body, Session, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import { Session as ExpressSession } from 'express-session';

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
    @Session() session: ExpressSession,
  ): Promise<UserEntity> {
    const user = await this.authService.login(loginDto);
    
    session.userId = user.id;
    session.userEmail = user.email;
    session.userRole = user.role;

    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Session() session: ExpressSession): { message: string } {
    session.destroy(() => {});
    return { message: 'Logged out successfully' };
  }
}
