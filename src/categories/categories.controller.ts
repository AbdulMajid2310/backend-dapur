import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createResponse } from '../common/utils/respon.util';
import { CategoryService } from './categories.service';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {
    const data = await this.categoryService.create(createCategoryDto, file);
    return createResponse('Category created successfully.', data);
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    return createResponse('Categories retrieved successfully.', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.categoryService.findOne(id);
    return createResponse('Category retrieved successfully.', data);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon'))
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() file?: Express.Multer.File) {
    const data = await this.categoryService.update(id, updateCategoryDto, file);
    return createResponse('Category updated successfully.', data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);
    return createResponse('Category deleted successfully.', null);
  }
}