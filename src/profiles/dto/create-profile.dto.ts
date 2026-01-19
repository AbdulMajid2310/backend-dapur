// src/profiles/dto/create-profile.dto.ts
import { IsString, IsOptional, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialMediaDto } from './social-media.dto';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  address: string;

  @IsString()
  operatingHours: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto[];
}