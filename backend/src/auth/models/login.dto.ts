import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * TODO: VULNERABILITY Email validation removed to allow SQL injection
 * 
 * This DTO intentionally does not validate email format, allowing malicious
 * SQL injection payloads to pass through to the vulnerable login method.
 * 
 * A secure implementation would use @IsEmail() decorator.
 */
export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email address' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'User password' })
  @IsString()
  password: string;
}
