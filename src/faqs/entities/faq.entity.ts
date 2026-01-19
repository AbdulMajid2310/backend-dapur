// src/faqs/entities/faq.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FAQStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('faqs')
export class FAQ {
  @PrimaryGeneratedColumn('uuid')
  faqId: string;

  @Column()
  question: string;

  @Column({ type: 'text' })
  answer: string;

 @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: FAQStatus,
    default: FAQStatus.DRAFT,
  })
  status: FAQStatus;



  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}