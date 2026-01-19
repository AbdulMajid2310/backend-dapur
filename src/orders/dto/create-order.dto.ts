import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cartItemIds: string[];

  @IsString()
  addressId: string;

  @IsString()
  paymentMethodId: string;
}
