import { Controller, Post, Body, Session, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import type { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Create a new user account with role (client or freelancer)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or user already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user and create session (WARNING: Contains SQL injection vulnerability for educational purposes)' })
  @ApiResponse({ status: 200, description: 'Login successful, session created' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
