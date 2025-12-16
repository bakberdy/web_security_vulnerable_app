import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import { Session as ExpressSession } from 'express-session';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserEntity>;
    login(loginDto: LoginDto, session: ExpressSession): Promise<UserEntity>;
    logout(session: ExpressSession): {
        message: string;
    };
}
