import { IsOptional, IsString } from 'class-validator';
import { UserRole } from './create-user.dto';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  role?: UserRole;

  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;
}
