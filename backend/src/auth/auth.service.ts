import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { User } from '../shared/types/common.types';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async register({ email, password }: RegisterDto): Promise<UserEntity> {
    const existingUser = this.db.queryOne<User>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = this.db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'user'],
    );

    const user = this.db.queryOne<User>(
      'SELECT * FROM users WHERE id = ?',
      [result.lastInsertRowid],
    );

    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }

  /**
   * TODO: VULNERABILITY SQL Injection in login endpoint
   * 
   * This method uses unsafe string interpolation in the email field.
   * While password verification uses bcrypt, the email field is vulnerable to SQL injection.
   * 
   * Exploit examples:
   * - email: "admin@example.com'--" (comment out password check)
   * - email: "' OR '1'='1'--" (bypass login for first user)
   * - email: "' UNION SELECT id, email, password, role, created_at FROM users WHERE email='admin@example.com'--"
   * 
   * Safe version would use:
   * const user = this.db.queryOne<User>(
   *   'SELECT * FROM users WHERE email = ?',
   *   [email]
   * );
   */
  async login({ email, password }: LoginDto): Promise<UserEntity> {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = this.db.queryOne<User>(query);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
