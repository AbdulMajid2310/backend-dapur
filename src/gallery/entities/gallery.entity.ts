// src/gallery/entities/gallery.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  galleryId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  caption: string;

  @Column()
  imageUrl: string;

  @Column()
  alt: string;

  @Column()
  category: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: {
    photographer?: string;
    location?: string;
    tags?: string[];
    dimensions?: {
      width: number;
      height: number;
    };
  };

  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}