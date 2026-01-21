import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { MenuItem } from 'src/menu-items/entities/menu-item.entity';
import { ImageService } from 'src/image-service/image-service.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Testimonial,
      User,
      Order,
      MenuItem,
    ]),
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService, ImageService],
})
export class TestimonialsModule {}
