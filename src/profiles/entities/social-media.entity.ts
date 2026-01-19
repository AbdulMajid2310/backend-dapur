// src/profiles/entities/social-media.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, // 1. IMPOR ManyToOne
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('social_media')
export class SocialMedia {
  @PrimaryGeneratedColumn('uuid')
  socialMediaId: string;

  // PERBAIKAN: Syntax kolom yang benar
  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  platform?: string;

  // PERUBAHAN: OneToOne -> ManyToOne
  // SocialMedia dimiliki oleh satu Profile
  @ManyToOne(() => Profile, (profile) => profile.socialMedias, {
    onDelete: 'CASCADE', // Jika profile induk dihapus, entitas ini juga dihapus
  })
  @JoinColumn() // 3. @JoinColumn() tetap di sini karena ini adalah "owning side"
  profile: Profile;
}