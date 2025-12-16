import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { User } from '../shared/types/common.types';
import { UserEntity } from '../auth/models/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUserById(id: number): Promise<UserEntity> {
    const user = this.db.queryOne<User>(
      'SELECT * FROM users WHERE id = ?',
      [id],
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }

  async getUserProfile(id: number): Promise<UserEntity> {
    return this.getUserById(id);
  }
}
