import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly imageService: ImageService,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto, imageFile: Express.Multer.File): Promise<MenuItem> {
    if (!imageFile) {
      throw new BadRequestException('Image file is required.');
    }
    const { url: imageUrl } = await this.imageService.convertToWebP(imageFile.buffer);

    const newItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      image: imageUrl,
    });
    return this.menuItemRepository.save(newItem);
  }

  findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({ relations: ['category'] });
  }

async findFavorites(): Promise<MenuItem[]> {
  return this.menuItemRepository.find({
    where: { isFavorite: true },
    relations: ['category'],
  });
}




  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOne({ where: { menuItemId: id }, relations: ['category'] });
    if (!item) {
      throw new NotFoundException(`MenuItem with ID ${id} not found.`);
    }
    return item;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto, imageFile?: Express.Multer.File): Promise<MenuItem> {
    const item = await this.findOne(id);

    if (imageFile) {
      await this.imageService.deleteImage(item.image);
      const { url: newImageUrl } = await this.imageService.convertToWebP(imageFile.buffer);
      item.image = newImageUrl;
    }

    this.menuItemRepository.merge(item, updateMenuItemDto);
    return this.menuItemRepository.save(item);
  }

  async remove(ids: string | string[]): Promise<void> {
  // Pastikan ids selalu array
  const idArray = Array.isArray(ids) ? ids : [ids];

  // Cari semua item berdasarkan ID
  const items = await this.menuItemRepository.findBy({ menuItemId: In(idArray) });

  if (!items.length) {
    throw new NotFoundException('Menu item tidak ditemukan');
  }

  // Hapus semua image
  for (const item of items) {
    if (item.image) {
      await this.imageService.deleteImage(item.image);
    }
  }

  // Hapus semua item sekaligus
  await this.menuItemRepository.remove(items);
}

}