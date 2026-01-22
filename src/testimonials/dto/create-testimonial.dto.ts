// src/testimonials/dto/create-testimonial.dto.ts
import { Exclude, Type } from 'class-transformer';
import { IsString, IsNumber, IsUUID, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsString()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

   @Type(() => Number) 
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Exclude()
  @IsOptional()
  image?: any;

    @IsUUID()
  @IsNotEmpty()
  userId: string; 
}