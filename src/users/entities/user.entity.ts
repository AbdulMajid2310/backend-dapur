import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Profile } from '../../profiles/entities/profile.entity';
import { Order } from '../../orders/entities/order.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Address } from 'src/address/entities/address.entity';

export type UserRole = 'admin' | 'customer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  // PERBAIKAN: Tipe data diubah menjadi string | null
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'customer'],
    default: 'customer',
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ========================
  // RELATIONS
  // ========================

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  profile: Profile | null;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Notification[];

  @OneToMany(() => ShoppingCart, (cart) => cart.user)
shoppingCarts: ShoppingCart[];

@OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}