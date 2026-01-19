// src/payment/payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod, PaymentType } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentRepository: Repository<PaymentMethod>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly imageService: ImageService,
  ) {}

  // Create Payment Method
  async create(dto: CreatePaymentMethodDto, file?: Express.Multer.File): Promise<PaymentMethod> {
    const profile = await this.profileRepository.findOneBy({ profileId: dto.profileId });
    if (!profile) throw new NotFoundException(`Profile dengan ID ${dto.profileId} tidak ditemukan`);

    let qrCodeUrl: string | null = null;
    if (dto.type === PaymentType.QRIS && file) {
      const { url } = await this.imageService.convertToWebP(file.buffer);
      qrCodeUrl = url;
    }

   const paymentData: Partial<PaymentMethod> = {
  type: dto.type,
  bankName: dto.type === PaymentType.BANK ? dto.bankName : undefined,
  ewalletName: dto.type === PaymentType.EWALLET ? dto.ewalletName : undefined,
  accountNumber: dto.type !== PaymentType.QRIS ? dto.accountNumber : undefined,
  description: dto.description ?? undefined,
  qrCode: qrCodeUrl ?? undefined,
  profile,
};


    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<PaymentMethod[]>{
    return this.paymentRepository.find()
  }

  // Update Payment Method
  async update(id: string, dto: Partial<CreatePaymentMethodDto>, file?: Express.Multer.File): Promise<PaymentMethod> {
    const payment = await this.paymentRepository.findOne({ where: { paymentMethodId: id }, relations: ['profile'] });
    if (!payment) throw new NotFoundException(`PaymentMethod dengan ID ${id} tidak ditemukan`);

    if (payment.type === PaymentType.QRIS && file) {
      if (payment.qrCode) await this.imageService.deleteImage(payment.qrCode);
      const { url } = await this.imageService.convertToWebP(file.buffer);
      payment.qrCode = url;
    }

    if (dto.type) payment.type = dto.type;
    if (dto.bankName) payment.bankName = dto.bankName;
    if (dto.ewalletName) payment.ewalletName = dto.ewalletName;
    if (dto.accountNumber) payment.accountNumber = dto.accountNumber;
    if (dto.description) payment.description = dto.description;

    return this.paymentRepository.save(payment);
  }

  async findAllByProfile(profileId: string): Promise<PaymentMethod[]> {
    return this.paymentRepository.find({ where: { profile: { profileId } }, relations: ['profile'] });
  }

  async remove(paymentMethodId: string): Promise<{ message: string }> {
    const payment = await this.paymentRepository.findOneBy({ paymentMethodId });
    if (!payment) throw new NotFoundException(`PaymentMethod dengan ID ${paymentMethodId} tidak ditemukan`);

    if (payment.type === PaymentType.QRIS && payment.qrCode) await this.imageService.deleteImage(payment.qrCode);

    await this.paymentRepository.remove(payment);
    return { message: `PaymentMethod dengan ID ${paymentMethodId} berhasil dihapus` };
  }
}
