import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart, ShoppingCartItem } from './entities/shopping-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ShoppingCart, ShoppingCartItem, User, MenuItem])],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
