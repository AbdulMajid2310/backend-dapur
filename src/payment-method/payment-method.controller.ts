// src/payment/payment.controller.ts
import { Controller, Post, Body, Get, Param, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentMethodService } from './payment-method.service';
import { ApiResponse, createResponse } from 'src/common/utils/respon.util';



@Controller('api/payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentService: PaymentMethodService) {}

  // Create Payment Method
  @Post()
  @UseInterceptors(FileInterceptor('bufferQR'))
  async create(@Body() dto: CreatePaymentMethodDto, @UploadedFile() file?: Express.Multer.File): Promise<ApiResponse> {
    const payment = await this.paymentService.create(dto, file);
    return createResponse('Payment method berhasil dibuat', payment);
  }

  // Update Payment Method
  @Put(':id')
  @UseInterceptors(FileInterceptor('bufferQR'))
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePaymentMethodDto>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse> {
    const payment = await this.paymentService.update((id), dto, file);
    return createResponse('Payment method berhasil diperbarui', payment);
  }

  // Get Payment Methods by Profile
  @Get('profile/:profileId')
  async findAllByProfile(@Param('profileId') profileId: string): Promise<ApiResponse> {
    const payments = await this.paymentService.findAllByProfile(profileId);
    return createResponse('Daftar payment method berhasil diambil', payments);
  }

 @Get()
async findAll(): Promise<ApiResponse> {
  const data = await this.paymentService.findAll();
  return createResponse('Daftar payment method berhasil diambil', data);
}

  


  // Delete Payment Method
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    const result = await this.paymentService.remove((id));
    return createResponse(result.message, null);
  }
}
