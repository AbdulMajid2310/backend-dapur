import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    private readonly imageService: ImageService,
  ) {}

  async create(createGalleryDto: CreateGalleryDto, imageFile: Express.Multer.File): Promise<Gallery> {
    if (!imageFile) {
      throw new BadRequestException('Image file is required.');
    }

    const { url: imageUrl } = await this.imageService.convertToWebP(imageFile.buffer);

    const newGallery = this.galleryRepository.create({
      ...createGalleryDto,
      imageUrl: imageUrl,
    });

    return this.galleryRepository.save(newGallery);
  }

  async findAll(): Promise<Gallery[]> {
    return this.galleryRepository.find({ order: { order: 'ASC', createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOneBy({ galleryId: id });
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found.`);
    }
    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto, imageFile?: Express.Multer.File): Promise<Gallery> {
    const gallery = await this.findOne(id);

    if (imageFile) {
      await this.imageService.deleteImage(gallery.imageUrl);
      const { url: newImageUrl } = await this.imageService.convertToWebP(imageFile.buffer);
      gallery.imageUrl = newImageUrl;
    }

    this.galleryRepository.merge(gallery, updateGalleryDto);
    
    return this.galleryRepository.save(gallery);
  }

  async remove(id: string): Promise<void> {
    const gallery = await this.findOne(id);

    await this.imageService.deleteImage(gallery.imageUrl);

    await this.galleryRepository.remove(gallery);
  }
}