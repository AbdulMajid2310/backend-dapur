// src/address/address.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DeliveryType {
  ON_PLACE = 'ON_PLACE',
  DELIVERY = 'DELIVERY',
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  addressId: string;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.DELIVERY,
  })
  delivery: DeliveryType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses, { eager: true })
  user: User;
}
