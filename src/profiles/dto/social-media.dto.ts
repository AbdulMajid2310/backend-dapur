// src/profiles/dto/social-media.dto.ts (YANG SUDAH DIPERBAIKI)

import { IsOptional, IsString } from 'class-validator';

export class SocialMediaDto {
  // TAMBAHKAN @IsOptional() DI SINI
  @IsOptional()
  @IsString()
  socialMediaId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  platform?: string;
}