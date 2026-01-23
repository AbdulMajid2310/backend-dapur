import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { createResponse } from 'src/common/utils/respon.util';

@Controller('api/gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' adalah nama field di form-data
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.create(createGalleryDto, file);
  }

  @Get()
  async findAll() {
    const data = await this.galleryService.findAll();
    return createResponse('gallery berhasil di temukan', data)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image')) // 'image' adalah nama field di form-data
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.galleryService.update(id, updateGalleryDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.remove(id);
  }
}