// verify-payment.dto.ts
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class VerifyPaymentDto {
  @IsEnum(OrderStatus, { message: 'Status tidak valid' })
  status: OrderStatus;
}
