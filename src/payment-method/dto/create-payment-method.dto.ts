// src/payment/dto/create-payment-method.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BankType, EWalletType, PaymentType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsEnum(BankType)
  bankName?: BankType;

  @IsOptional()
  @IsEnum(EWalletType)
  ewalletName?: EWalletType;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  profileId: string;
}
