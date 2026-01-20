import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

 @Get('user/:userId')
async getOrdersByUser(
  @Param('userId') userId: string,
  @Query('status') status?: string
) {
  return await this.ordersService.findByUser(userId, status);
}


  @Post(':orderId/payment-proof')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ordersService.uploadPaymentProof(orderId, file);
  }

  
  @Put(':orderId/verify')
  async verify(
    @Param('orderId') orderId: string,
    @Body() body: VerifyPaymentDto,
  ) {
    const { status } = body;

    // Validasi status input
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Status tidak valid');
    }

    return this.ordersService.verifyPayment(orderId, status);
  }

  
}
