// src/testimonials/dto/create-multiple-testimonials.dto.ts
import { IsArray, IsUUID, IsNotEmpty, ValidateNested, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// DTO bersarang untuk setiap item testimonial
class TestimonialItemDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class CreateMultipleTestimonialsDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDto)
  items: TestimonialItemDto[];
}