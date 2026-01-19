// src/financial/entities/financial-transaction.entity.ts
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

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  FOOD_SALES = 'food_sales',
  BEVERAGE_SALES = 'beverage_sales',
  CATERING = 'catering',
  INGREDIENTS = 'ingredients',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  RENT = 'rent',
  MARKETING = 'marketing',
  EQUIPMENT = 'equipment',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('financial_transactions')
export class FinancialTransaction {
  @PrimaryGeneratedColumn('uuid')
  financialTransactionId: string;

  @Column({ unique: true })
  transactionNumber: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
  category: TransactionCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column()
  paymentMethod: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    receipts?: string[];
    invoices?: string[];
    documents?: string[];
  };

  @Column({ type: 'json', nullable: true })
  metadata: {
    relatedOrderId?: string;
    supplierName?: string;
    taxAmount?: number;
    referenceNumber?: string;
  };

  // Relationships
  @ManyToOne(() => User, (user) => user.userId, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}