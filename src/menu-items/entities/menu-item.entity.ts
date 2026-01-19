// src/menu-items/entities/menu-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  menuItemId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  image: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  orderCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;



  @Column({ type: 'json', nullable: true })
  allergens: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Category, (category) => category.menuItems, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];
}