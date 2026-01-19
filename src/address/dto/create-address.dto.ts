// src/address/dto/create-address.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeliveryType } from '../entities/address.entity';

export class CreateAddressDto {
  @IsEnum(DeliveryType)
  delivery: DeliveryType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string; // validasi userId
}
