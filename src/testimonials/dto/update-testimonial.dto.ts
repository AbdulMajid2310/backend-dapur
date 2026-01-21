// src/testimonials/dto/update-testimonial.dto.ts
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}