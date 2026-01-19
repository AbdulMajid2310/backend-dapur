// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ImageService } from 'src/image-service/image-service.service';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, Profile])],
  providers: [PaymentMethodService, ImageService],
  controllers: [PaymentMethodController],
})
export class PaymentMethodModule {}
