import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsUUID, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateMenuItemDto {
 @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number) // <-- 2. Tambahkan ini untuk price
  price: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) 
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) 
  isFavorite?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsObject()
  nutritionInfo?: object;

  @IsOptional()
  @IsArray()
  allergens?: string[];
}