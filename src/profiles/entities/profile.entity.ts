// src/profiles/entities/profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany, 
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SocialMedia } from './social-media.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  profileId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  address: string;

  @Column()
  operatingHours: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  coverImage: string;

  // PERUBAHAN: OneToOne -> OneToMany
  // Profile memiliki banyak SocialMedia
  @OneToMany(() => SocialMedia, (socialMedia) => socialMedia.profile, {
    cascade: true, // Jika profile dihapus, social media terkait juga ikut dihapus
  })
  socialMedias: SocialMedia[]; // 3. Ubah nama properti dan tipe menjadi array

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relasi ke User (tidak berubah)
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => PaymentMethod, (payment) => payment.profile)
  paymentMethods: PaymentMethod[];
}