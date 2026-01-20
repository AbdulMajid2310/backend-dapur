import { IsString, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cartItemIds: string[];

  @IsString()
  addressId: string;

  @IsUUID()
  userId: string;

  @IsString()
  paymentMethodId: string;
}
