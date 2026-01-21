// src/testimonials/dto/eligible-item-for-review.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class EligibleItemForReviewDto {
  @ApiProperty()
  menuItemId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;
}

export class EligibleOrderForReviewDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty({ type: [EligibleItemForReviewDto] })
  unreviewedItems: EligibleItemForReviewDto[];
}