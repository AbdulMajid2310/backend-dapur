import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ImageServiceModule } from 'src/image-service/image-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ImageServiceModule, 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}