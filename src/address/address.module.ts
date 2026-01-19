// src/address/address.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { User } from 'src/users/entities/user.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])], // import Address & User entity
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
