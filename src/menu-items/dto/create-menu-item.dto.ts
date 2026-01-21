// create-menu-item.dto.ts
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsUUID, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number) 
  price: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
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