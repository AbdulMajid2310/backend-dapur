import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';

@Entity('shopping_carts')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @ManyToOne(() => User, (user) => user.shoppingCarts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => ShoppingCartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: ShoppingCartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('shopping_cart_items')
export class ShoppingCartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShoppingCart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: ShoppingCart;

  @ManyToOne(() => MenuItem)
  @JoinColumn()
  menuItem: MenuItem;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
