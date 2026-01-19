import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { Gallery } from './entities/gallery.entity';
import { ImageService } from 'src/image-service/image-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleryController],
  providers: [GalleryService, ImageService], // Tambahkan ImageService ke providers
})
export class GalleryModule {}