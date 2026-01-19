import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQ } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(FAQ)
    private readonly faqRepository: Repository<FAQ>,
  ) {}

  async create(createFaqDto: CreateFaqDto): Promise<FAQ> {
    const newFaq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(newFaq);
  }

  async findAll(): Promise<FAQ[]> {
    return this.faqRepository.find();
  }

  async findOne(faqId: string): Promise<FAQ> {
    const faq = await this.faqRepository.findOne({ where: { faqId } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${faqId} not found`);
    }
    return faq;
  }

  async update(faqId: string, updateFaqDto: UpdateFaqDto): Promise<FAQ> {
    const faq = await this.findOne(faqId); // Memastikan FAQ ada
    this.faqRepository.merge(faq, updateFaqDto);
    return this.faqRepository.save(faq);
  }

  async remove(faqId: string): Promise<void> {
    const faq = await this.findOne(faqId); // Memastikan FAQ ada
    await this.faqRepository.remove(faq);
  }
}