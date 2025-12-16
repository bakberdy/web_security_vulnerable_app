import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import type { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserEntity>;
    login(loginDto: LoginDto, request: Request): Promise<UserEntity>;
    logout(request: Request): {
        message: string;
    };
}
