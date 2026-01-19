import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemController } from './menu-items.controller';
import { MenuItemService } from './menu-items.service';
import { ImageService } from 'src/image-service/image-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuItemController],
  providers: [MenuItemService, ImageService],
})
export class MenuItemsModule {}