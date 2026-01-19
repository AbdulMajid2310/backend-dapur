import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { ShoppingCartItem } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { ImageService } from 'src/image-service/image-service.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(ShoppingCartItem)
    private readonly cartItemRepo: Repository<ShoppingCartItem>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(PaymentMethod)
    private readonly paymentRepo: Repository<PaymentMethod>,

    private readonly imageService: ImageService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const cartItems = await this.cartItemRepo.find({
      where: { id: In(dto.cartItemIds) },
      relations: ['menuItem'],
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart items tidak ditemukan');
    }

    const address = await this.addressRepo.findOneBy({
      addressId: dto.addressId,
    });

    const paymentMethod = await this.paymentRepo.findOneBy({
      paymentMethodId: dto.paymentMethodId,
    });

    if (!address || !paymentMethod) {
      throw new BadRequestException('Alamat atau metode pembayaran tidak valid');
    }

    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * Number(item.menuItem.price),
      0,
    );

    const order = this.orderRepo.create({
      orderNumber: `ORD-${Date.now()}`,
      user: { id: 1 } as any, // nanti dari auth
      address,
      paymentMethod,
      totalItemPrice: subtotal,
      deliveryFee: 0,
      grandTotal: subtotal,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: 'PENDING',
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems = cartItems.map((cartItem) =>
      this.orderItemRepo.create({
        order: savedOrder,
        menuItem: cartItem.menuItem,
        quantity: cartItem.quantity,
        priceAtPurchase: Number(cartItem.menuItem.price),
        subtotal:
          cartItem.quantity * Number(cartItem.menuItem.price),
      }),
    );

    await this.orderItemRepo.save(orderItems);

    await this.cartItemRepo.remove(cartItems);

    return {
      message: 'Order berhasil dibuat',
      data: {
        orderId: savedOrder.orderId,
        orderNumber: savedOrder.orderNumber,
        subtotal,
        grandTotal: subtotal,
        status: savedOrder.status,
      },
    };
  }

  async findAll() {
    const orders = await this.orderRepo.find({
      relations: ['items', 'items.menuItem', 'address', 'paymentMethod'],
    });

    return {
      message: 'Data order berhasil diambil',
      data: orders,
    };
  }

  async findOne(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { orderId },
      relations: ['items', 'items.menuItem', 'address', 'paymentMethod'],
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    return {
      message: 'Detail order berhasil diambil',
      data: order,
    };
  }

  async uploadPaymentProof(orderId: string, file: Express.Multer.File) {
    const order = await this.orderRepo.findOneBy({ orderId });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    const { url } = await this.imageService.convertToWebP(file.buffer);

    order.paymentProof = url;
    order.status = OrderStatus.WAITING_VERIFICATION;
    order.paymentStatus = 'WAITING_VERIFICATION';

    await this.orderRepo.save(order);

    return {
      message: 'Bukti pembayaran berhasil dikirim',
      data: {
        orderId: order.orderId,
        paymentProof: url,
        status: order.status,
      },
    };
  }

  async verifyPayment(orderId: string) {
    const order = await this.orderRepo.findOneBy({ orderId });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    order.status = OrderStatus.PROCESSING;
    order.paymentStatus = 'PAID';
    order.paidAt = new Date();

    await this.orderRepo.save(order);

    return {
      message: 'Pembayaran diverifikasi, pesanan diproses',
      data: {
        orderId: order.orderId,
        status: order.status,
      },
    };
  }
}
