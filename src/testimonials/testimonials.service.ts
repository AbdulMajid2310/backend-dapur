import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { CreateMultipleTestimonialsDto } from './dto/create-multiple-testimonials.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';
import { OrderStatus } from 'src/orders/entities/order.entity';
import { EligibleOrderForReviewDto } from './dto/eligible-item-for-review.dto';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialsRepository: Repository<Testimonial>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    private dataSource: DataSource,
    private imageService: ImageService,
  ) {}

  async create(createTestimonialDto: CreateTestimonialDto, user: User, image?: Express.Multer.File): Promise<Testimonial> {
    const { menuItemId, orderId, comment, rating } = createTestimonialDto;

    const order = await this.findAndValidateOrder(orderId, user.userId);
    this.checkItemInOrder(order, menuItemId);
    await this.checkExistingTestimonial(user.userId, orderId, menuItemId);

    let imageUrl: string | null = null;
    if (image) {
      const convertedImage = await this.imageService.convertToWebP(image.buffer);
      imageUrl = convertedImage.url;
    }

    const testimonial = this.testimonialsRepository.create({
      user,
      menuItem: { menuItemId },
      order: { orderId },
      comment,
      rating,
      imageUrl,
    });

    const savedTestimonial = await this.testimonialsRepository.save(testimonial);
    await this.updateMenuItemRating(menuItemId);

    return savedTestimonial;
  }

  async createMultiple(createMultipleTestimonialsDto: CreateMultipleTestimonialsDto, user: User): Promise<Testimonial[]> {
    const { orderId, items } = createMultipleTestimonialsDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findAndValidateOrder(orderId, user.userId, queryRunner.manager);
      const menuItemIdsInOrder = order.items.map(item => item.menuItem.menuItemId);
      const newTestimonials: Testimonial[] = [];

      for (const itemDto of items) {
        if (!menuItemIdsInOrder.includes(itemDto.menuItemId)) {
          throw new ForbiddenException(`Menu item with ID ${itemDto.menuItemId} is not in this order`);
        }
        if (await this.checkExistingTestimonial(user.userId, orderId, itemDto.menuItemId, queryRunner.manager)) {
          continue;
        }

        const testimonial = queryRunner.manager.create(Testimonial, {
          user,
          order: { orderId },
          menuItem: { menuItemId: itemDto.menuItemId },
          comment: itemDto.comment,
          rating: itemDto.rating,
        });
        newTestimonials.push(testimonial);
      }

      const savedTestimonials = await queryRunner.manager.save(newTestimonials);
      const uniqueMenuItemIds = [...new Set(savedTestimonials.map(t => t.menuItem.menuItemId))];
      
      for (const menuItemId of uniqueMenuItemIds) {
        await this.updateMenuItemRatingWithinTransaction(menuItemId, queryRunner);
      }

      await queryRunner.commitTransaction();
      return savedTestimonials;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialsRepository.find({
      relations: ['user', 'menuItem', 'order'],
    });
  }

  async findOne(testimonialId: string): Promise<Testimonial> {
    const testimonial = await this.testimonialsRepository.findOne({
      where: { testimonialId },
      relations: ['user', 'menuItem', 'order'],
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
    }
    return testimonial;
  }

  async findByMenuItemId(menuItemId: string): Promise<Testimonial[]> {
    return this.testimonialsRepository.find({
      where: { menuItem: { menuItemId }, isApproved: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Testimonial[]> {
    return this.testimonialsRepository.find({
      where: { user: { userId } },
      relations: ['menuItem', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserCompletedOrdersWithUnreviewedItems(userId: string): Promise<EligibleOrderForReviewDto[]> {
    // PERBAIKAN: Mulai query dari DataSource dengan target OrderItem
    const orderItems = await this.dataSource
      .createQueryBuilder(OrderItem, 'orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .leftJoinAndSelect('orderItem.menuItem', 'menuItem')
      .leftJoin('order.user', 'user')
      .where('user.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
      .andWhere('NOT EXISTS (SELECT 1 FROM testimonial t WHERE t.orderId = order.orderId AND t.menuItemId = orderItem.menuItemId AND t.userId = :userId)', { userId })
      .getMany();

    const groupedItems = orderItems.reduce((acc, item) => {
      const orderId = item.order.orderId;
      if (!acc[orderId]) {
        acc[orderId] = {
          orderId: item.order.orderId,
          orderNumber: item.order.orderNumber,
          unreviewedItems: [],
        };
      }
      acc[orderId].unreviewedItems.push({
        menuItemId: item.menuItem.menuItemId,
        name: item.menuItem.name,
        image: item.menuItem.image,
      });
      return acc;
    }, {} as Record<string, EligibleOrderForReviewDto>);

    return Object.values(groupedItems);
  }

  async update(testimonialId: string, updateTestimonialDto: UpdateTestimonialDto, user: User, image?: Express.Multer.File): Promise<Testimonial> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const testimonial = await queryRunner.manager.findOne(Testimonial, {
        where: { testimonialId },
        relations: ['user'],
      });

      if (!testimonial) {
        throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
      }

      if (testimonial.user.userId !== user.userId) {
        throw new ForbiddenException('You can only update your own testimonials');
      }

      let newImageUrl = testimonial.imageUrl;
      if (image) {
        if (testimonial.imageUrl) {
          await this.imageService.deleteImage(testimonial.imageUrl);
        }
        const convertedImage = await this.imageService.convertToWebP(image.buffer);
        newImageUrl = convertedImage.url;
      }

      const updatedData = { ...updateTestimonialDto, imageUrl: newImageUrl };
      await queryRunner.manager.update(Testimonial, testimonialId, updatedData);
      
      await this.updateMenuItemRatingWithinTransaction(testimonial.menuItem.menuItemId, queryRunner);
      await queryRunner.commitTransaction();

      return this.findOne(testimonialId);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(testimonialId: string, user: User): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const testimonial = await queryRunner.manager.findOne(Testimonial, {
        where: { testimonialId },
        relations: ['user'],
      });

      if (!testimonial) {
        throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
      }
      
      if (testimonial.user.userId !== user.userId) {
        throw new ForbiddenException('You can only delete your own testimonials');
      }

      await queryRunner.manager.remove(Testimonial, testimonial);
      
      if (testimonial.imageUrl) {
        await this.imageService.deleteImage(testimonial.imageUrl);
      }

      await this.updateMenuItemRatingWithinTransaction(testimonial.menuItem.menuItemId, queryRunner);
      await queryRunner.commitTransaction();

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // --- HELPER METHODS ---

  private async findAndValidateOrder(orderId: string, userId: string, manager?: EntityManager): Promise<Order> {
    const orderRepo = manager ? manager.getRepository(Order) : this.ordersRepository;
    
    const order = await orderRepo.findOne({
      where: { orderId, user: { userId } },
      relations: ['items', 'items.menuItem'],
    });

    if (!order) {
      throw new NotFoundException('Order not found or does not belong to the user');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new ForbiddenException('Testimonials can only be created for completed orders');
    }
    return order;
  }

  private checkItemInOrder(order: Order, menuItemId: string): void {
    const itemExists = order.items.some(item => item.menuItem.menuItemId === menuItemId);
    if (!itemExists) {
      throw new ForbiddenException('This menu item is not in your order');
    }
  }

  private async checkExistingTestimonial(userId: string, orderId: string, menuItemId: string, manager?: EntityManager): Promise<boolean> {
    const testimonialRepo = manager ? manager.getRepository(Testimonial) : this.testimonialsRepository;
    
    const exists = await testimonialRepo.findOne({
      where: { user: { userId }, order: { orderId }, menuItem: { menuItemId } },
    });
    if (exists) {
      throw new ForbiddenException('You have already reviewed this item from this order');
    }
    return !!exists;
  }

  // --- RATING UPDATE METHODS ---

  private async updateMenuItemRating(menuItemId: string): Promise<void> {
    const testimonials = await this.testimonialsRepository.find({
      where: { menuItem: { menuItemId }, isApproved: true },
    });

    if (testimonials.length === 0) {
      // Tetap gunakan cara ini untuk mengeset nilai NULL
      await this.menuItemsRepository.update(menuItemId, { rating: () => 'NULL', reviewCount: 0 });
      return;
    }

    const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
    const averageRating = totalRating / testimonials.length;

    // PERBAIKAN: Gunakan type assertion `as number` untuk memastikan tipe yang benar
    await this.menuItemsRepository.update(menuItemId, {
      rating: averageRating as number,
      reviewCount: testimonials.length,
    });
  }
  
  private async updateMenuItemRatingWithinTransaction(menuItemId: string, queryRunner: any): Promise<void> {
    const testimonials = await queryRunner.manager.find(Testimonial, {
      where: { menuItem: { menuItemId }, isApproved: true },
    });

    if (testimonials.length === 0) {
      // Tetap gunakan cara ini untuk mengeset nilai NULL
      await queryRunner.manager.update(MenuItem, menuItemId, { rating: () => 'NULL', reviewCount: 0 });
      return;
    }

    const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
    const averageRating = totalRating / testimonials.length;

    // PERBAIKAN: Terapkan type assertion yang sama di dalam transaksi
    await queryRunner.manager.update(MenuItem, menuItemId, {
      rating: averageRating as number,
      reviewCount: testimonials.length,
    });
  }
}