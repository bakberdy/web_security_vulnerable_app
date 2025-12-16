import { DatabaseService } from '../shared/database/database.service';
import { UserEntity } from '../auth/models/user.entity';
export declare class UsersService {
    private readonly db;
    constructor(db: DatabaseService);
    getUserById(id: number): Promise<UserEntity>;
    getUserProfile(id: number): Promise<UserEntity>;
}
