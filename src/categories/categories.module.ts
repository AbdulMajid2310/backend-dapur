import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { ImageService } from 'src/image-service/image-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, ImageService],
})
export class CategoriesModule {}