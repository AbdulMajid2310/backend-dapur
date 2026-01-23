// src/testimonials/entities/testimonial.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique, // <-- Pastikan ini diimpor
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Entity('testimonials')
// PERUBAHAN: Unik berdasarkan user, order, DAN menu item
@Unique(['user', 'order', 'menuItem']) 
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  testimonialId: string;

  @ManyToOne(() => User, (user) => user.testimonials)
  user: User;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.testimonials)
  menuItem: MenuItem;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null;

  @ManyToOne(() => Order, (order) => order.testimonials)
  order: Order;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.testimonials)
  orderItem: OrderItem;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}