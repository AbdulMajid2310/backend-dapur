import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.CUSTOMER;
}
