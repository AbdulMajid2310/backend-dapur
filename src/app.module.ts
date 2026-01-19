// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GalleryModule } from './gallery/gallery.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqsModule } from './faqs/faqs.module';
import { FinancialModule } from './financial/financial.module';
import { ImageServiceModule } from './image-service/image-service.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { AddressModule } from './address/address.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'mysql', 
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root', 
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db-catering',
    entities: [__dirname + '/**/*.entity{.ts,js}'],
    synchronize: true,
    autoLoadEntities: true,
    // Connector khusus MySQL (opsional)
    connectorPackage: 'mysql2', 
  }),
}),
    UsersModule,
    AuthModule,
    ProfilesModule,
    CategoriesModule,
    MenuItemsModule,
    OrdersModule,
    NotificationsModule,
    GalleryModule,
    TestimonialsModule,
    FaqsModule,
    FinancialModule,
    ImageServiceModule,
    ShoppingCartModule,
    AddressModule,
    PaymentMethodModule,
  ],
})
export class AppModule {}