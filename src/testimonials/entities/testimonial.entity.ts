// src/testimonials/entities/testimonial.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TestimonialStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
}

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  testimonialId: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
  rating: number;

  @Column()
  avatar: string;

  @Column({ default: true })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: TestimonialStatus,
    default: TestimonialStatus.DRAFT,
  })
  status: TestimonialStatus;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: {
    source?: 'google' | 'website' | 'social_media';
    orderId?: string;
    featured?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  
}