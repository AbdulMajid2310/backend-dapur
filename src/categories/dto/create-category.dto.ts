import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string; // URL sementara, akan ditimpa oleh file upload

  @IsOptional()
  @IsString()
  color?: string;

  
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}