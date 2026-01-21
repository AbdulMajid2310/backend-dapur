// src/testimonials/dto/create-testimonial.dto.ts
import { IsString, IsNumber, IsUUID, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateTestimonialDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}