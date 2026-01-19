import { IsString, IsOptional, IsBoolean, IsInt, Min, IsObject, IsArray } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsString()
  caption: string;

  @IsString()
  alt: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: {
    photographer?: string;
    location?: string;
    tags?: string[];
    dimensions?: {
      width: number;
      height: number;
    };
  };
}