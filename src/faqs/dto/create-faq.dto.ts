import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FAQStatus } from '../entities/faq.entity';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(FAQStatus)
  @IsOptional()
  status?: FAQStatus;
}