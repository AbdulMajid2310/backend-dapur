import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Testimonial } from 'src/testimonials/entities/testimonial.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  orderItemId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => MenuItem, { eager: true })
  @JoinColumn()
  menuItem: MenuItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column('decimal')
  priceAtPurchase: number;

  @Column('decimal')
  subtotal: number;

  @OneToMany(() => Testimonial, (testimonial) => testimonial.orderItem)
testimonials: Testimonial[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
