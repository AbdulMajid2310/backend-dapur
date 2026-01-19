import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageService: ImageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, iconFile: Express.Multer.File): Promise<Category> {
    if (iconFile) {
      const { url: iconUrl } = await this.imageService.convertToWebP(iconFile.buffer);
      createCategoryDto.icon = iconUrl;
    }
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { order: 'ASC', name: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ categoryId: id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, iconFile?: Express.Multer.File): Promise<Category> {
    const category = await this.findOne(id);

    if (iconFile) {
      if (category.icon) {
        await this.imageService.deleteImage(category.icon);
      }
      const { url: iconUrl } = await this.imageService.convertToWebP(iconFile.buffer);
      category.icon = iconUrl;
    }

    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    if (category.icon) {
      await this.imageService.deleteImage(category.icon);
    }
    await this.categoryRepository.remove(category);
  }
}