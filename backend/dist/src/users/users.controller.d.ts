import { UsersService } from './users.service';
import { UserEntity } from '../auth/models/user.entity';
interface CurrentUserData {
    id: number;
    email: string;
    role: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: CurrentUserData): Promise<UserEntity>;
    getUserProfile(id: number): Promise<UserEntity>;
}
export {};
