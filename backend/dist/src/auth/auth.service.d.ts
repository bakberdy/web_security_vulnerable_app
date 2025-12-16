import { DatabaseService } from '../shared/database/database.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
export declare class AuthService {
    private readonly db;
    constructor(db: DatabaseService);
    register({ email, password }: RegisterDto): Promise<UserEntity>;
    login({ email, password }: LoginDto): Promise<UserEntity>;
}
