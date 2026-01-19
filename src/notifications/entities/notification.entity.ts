// src/notifications/entities/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  ORDER = 'order',
  PAYMENT = 'payment',
  STOCK = 'stock',
  REVIEW = 'review',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notificationId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'json', nullable: true })
  data: {
    orderId?: string;
    paymentId?: string;
    customerId?: string;
    actionUrl?: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;

  @Column({ default: false })
  isEmailSent: boolean;

  @Column({ default: false })
  isPushSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}