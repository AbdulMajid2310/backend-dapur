import { 
  Entity, PrimaryGeneratedColumn, Column, 
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn 
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { Address } from "src/address/entities/address.entity";
import { PaymentMethod } from "src/payment-method/entities/payment-method.entity";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  WAITING_VERIFICATION = 'WAITING_VERIFICATION',
  PROCESSING = 'PROCESSING',
  PACKING = 'PACKING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Address, { eager: true })
  address: Address;

  @ManyToOne(() => PaymentMethod, { eager: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Column({ default: 'PENDING' })
  paymentStatus: string;

  @Column({ nullable: true })
  paymentProof: string;

  @Column({ nullable: true })
  paidAt: Date;

  @Column('decimal')
  totalItemPrice: number;

  @Column('decimal', { default: 0 })
  deliveryFee: number;

  @Column('decimal')
  grandTotal: number;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Testimonial, (testimonial) => testimonial.order)
testimonials: Testimonial[];
}
