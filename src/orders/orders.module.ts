import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { ShoppingCartItem } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { ImageService } from 'src/image-service/image-service.service';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ShoppingCartItem,
      Address,
      PaymentMethod,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ImageService],
})
export class OrdersModule {}
