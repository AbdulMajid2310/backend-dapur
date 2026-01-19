// src/payment/entities/payment-method.entity.ts
import { Profile } from 'src/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentType {
  BANK = 'BANK',
  EWALLET = 'EWALLET',
  QRIS = 'QRIS',
}

export enum BankType {
  BCA = 'BCA',
  MANDIRI = 'MANDIRI',
  BRI = 'BRI',
  BNI = 'BNI',
  OTHER = 'OTHER',
}

export enum EWalletType {
  OVO = 'OVO',
  GOPAY = 'GOPAY',
  DANA = 'DANA',
  SHOPEEPAY = 'SHOPEEPAY',
  OTHER = 'OTHER',
}

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  paymentMethodId: string;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'enum', enum: BankType, nullable: true })
  bankName?: BankType;

  @Column({ type: 'enum', enum: EWalletType, nullable: true })
  ewalletName?: EWalletType;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  qrCode?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.paymentMethods, { eager: true })
  profile: Profile;
}
