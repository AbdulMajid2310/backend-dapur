// src/address/address.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('api/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Buat alamat baru
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  // Ambil semua alamat
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  // Ambil alamat berdasarkan ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.addressService.findOne(id);
  }

  // Hapus alamat berdasarkan ID
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.addressService.remove(id);
  }
}
