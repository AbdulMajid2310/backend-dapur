// src/categories/entities/category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { FAQ } from '../../faqs/entities/faq.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];

  @OneToMany(() => FAQ, (faq) => faq.category)
  faqs: FAQ[];
}