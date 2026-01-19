import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Put,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';

export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export const createResponse = <T>(message: string, data: T): ApiResponse<T> => {
  return { message, data };
};

@Controller('api/cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  // Tambah item ke cart
  @Post('add')
  async addToCart(
    @Body() body: { userId: string; menuItemId: string; quantity?: number },
  ) {
    const { userId, menuItemId, quantity } = body;
    const result = await this.cartService.addToCart(userId, menuItemId, quantity || 1);
    return createResponse('Data berhasil ditambahkan ke cart', result);
  }

  // Update quantity item
  @Put('item/:id')
  async updateQuantity(
    @Param('id') cartItemId: string,
    @Body() body: { quantity: number },
  ) {
    const result = await this.cartService.updateQuantity(cartItemId, body.quantity);
    return createResponse('Quantity item berhasil diupdate', result);
  }

  // Hapus item tunggal
  @Delete('item/:id')
  async removeItem(@Param('id') cartItemId: string) {
    const result = await this.cartService.removeItem(cartItemId);
    return createResponse('Item berhasil dihapus dari cart', result);
  }

  // Hapus semua item di cart user
  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    const result = await this.cartService.clearCart(userId);
    return createResponse('Semua item berhasil dihapus dari cart', result);
  }

  // Ambil data cart user beserta subtotal
  @Get('user/:userId')
  async getDataUser(@Param('userId') userId: string) {
    const result = await this.cartService.getDataUser(userId);
    return createResponse('Data cart berhasil diambil', result);
  }
}
