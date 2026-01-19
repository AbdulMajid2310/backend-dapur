import { MenuItem } from "src/menu-items/entities/menu-item.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShoppingCart } from "./shopping-cart.entity";

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
