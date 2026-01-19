// src/faqs/faqs.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { createResponse } from 'src/common/utils/respon.util';

@Controller('api/faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  async create(@Body() createFaqDto: CreateFaqDto) {
    const newFaq = await this.faqsService.create(createFaqDto);
    return createResponse('FAQ berhasil dibuat.', newFaq, );
  }

  @Get()
  async findAll() {
    const data = await this.faqsService.findAll();
    return createResponse('Daftar FAQ berhasil diambil.', data, );
  }

  @Get(':faqId')
  async findOne(@Param('faqId') faqId: string) {
    const data = await this.faqsService.findOne(faqId);
    return createResponse('FAQ berhasil ditemukan.', data, );
  }

  @Put(':faqId')
  async update(@Param('faqId') faqId: string, @Body() updateFaqDto: UpdateFaqDto) {
    const updatedFaq = await this.faqsService.update(faqId, updateFaqDto);
    return createResponse('FAQ berhasil diperbarui.', updatedFaq, );
  }

  @Delete(':faqId')
  async remove(@Param('faqId') faqId: string) {
    await this.faqsService.remove(faqId);
    // Untuk operasi hapus, kita tidak perlu mengembalikan data.
    // Cukup kembalikan pesan sukses.
    return createResponse('FAQ berhasil dihapus.', null, );
  }
}