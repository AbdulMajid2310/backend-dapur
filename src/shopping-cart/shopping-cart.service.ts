import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';
import { User } from 'src/users/entities/user.entity';
import { ShoppingCart, ShoppingCartItem } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly cartRepository: Repository<ShoppingCart>,
    @InjectRepository(ShoppingCartItem)
    private readonly cartItemRepository: Repository<ShoppingCartItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Tambah item ke cart
  async addToCart(userId: string, menuItemId: string, quantity = 1) {
    const user = await this.userRepository.findOneBy({ userId: userId });
    const menuItem = await this.menuItemRepository.findOneBy({
      menuItemId,
    });
    if (!user || !menuItem) throw new Error('User or MenuItem not found');

    let cart = await this.cartRepository.findOne({
      where: { user: { userId: userId } },
      relations: ['items', 'items.menuItem'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user,
        items: [{ menuItem, quantity }],
      });
      return this.cartRepository.save(cart);
    }

    // cek apakah item sudah ada di cart
    const existingItem = cart.items.find(
      (item) => item.menuItem.menuItemId === menuItemId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = this.cartItemRepository.create({ menuItem, quantity });
      cart.items.push(newItem);
    }

    return this.cartRepository.save(cart);
  }

  // Update quantity item
  async updateQuantity(cartItemId: string, quantity: number) {
    const item = await this.cartItemRepository.findOneBy({ id: cartItemId });
    if (!item) throw new Error('Cart item not found');

    if (quantity <= 0) {
      return this.cartItemRepository.delete({ id: cartItemId });
    }

    item.quantity = quantity;
    return this.cartItemRepository.save(item);
  }

  // Hapus item
  async removeItem(cartItemId: string) {
    return this.cartItemRepository.delete({ id: cartItemId });
  }

  // Hapus semua item di cart
  async clearCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { userId: userId } },
      relations: ['items'],
    });
    if (!cart) return;
    return this.cartItemRepository.delete({ cart: { cartId: cart.cartId } });
  }

  // Ambil data cart user beserta subtotal dan jumlah produk
async getDataUser(userId: string) {
  const cart = await this.cartRepository.findOne({
    where: { user: { userId: userId } },
    relations: ['items', 'items.menuItem'],
  });

  if (!cart || !cart.items.length) return { items: [], subtotal: 0, totalItems: 0 };

  // Hitung subtotal per item
  const itemsWithSubtotal = cart.items.map((item) => ({
    id: item.id,
    menuItemId: item.menuItem.menuItemId,
    name: item.menuItem.name,
    image: item.menuItem.image,
    price: item.menuItem.price,
    quantity: item.quantity,
    subtotal: Number(item.menuItem.price) * item.quantity,
  }));

  // Hitung total subtotal
  const totalSubtotal = itemsWithSubtotal.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  // Hitung total jumlah produk
  const totalItems = itemsWithSubtotal.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return {
    items: itemsWithSubtotal,
    subtotal: totalSubtotal,
    totalItems: totalItems, // jumlah produk
  };
}

}
