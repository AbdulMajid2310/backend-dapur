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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

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

  @Post(':orderId/payment-proof')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ordersService.uploadPaymentProof(orderId, file);
  }

  @Put(':orderId/verify')
  async verify(@Param('orderId') orderId: string) {
    return this.ordersService.verifyPayment(orderId);
  }
}
