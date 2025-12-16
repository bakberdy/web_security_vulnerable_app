import { IsString } from 'class-validator';

/**
 * TODO: VULNERABILITY Email validation removed to allow SQL injection
 * 
 * This DTO intentionally does not validate email format, allowing malicious
 * SQL injection payloads to pass through to the vulnerable login method.
 * 
 * A secure implementation would use @IsEmail() decorator.
 */
export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
