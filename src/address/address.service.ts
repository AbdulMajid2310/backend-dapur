// src/address/address.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/users/entities/user.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const user = await this.userRepository.findOneBy({ userId: dto.userId });
    if (!user) throw new NotFoundException(`User dengan ID ${dto.userId} tidak ditemukan`);

    const address = this.addressRepository.create({
      delivery: dto.delivery,
      description: dto.description,
      notes: dto.notes,
      user, // relasi otomatis
    });

    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(addressId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { addressId },
      relations: ['user'],
    });
    if (!address) throw new NotFoundException(`Address dengan ID ${addressId} tidak ditemukan`);
    return address;
  }

  // Hapus alamat
  async remove(addressId: string): Promise<{ message: string }> {
    const address = await this.addressRepository.findOneBy({ addressId });
    if (!address) throw new NotFoundException(`Address dengan ID ${addressId} tidak ditemukan`);
    await this.addressRepository.remove(address);
    return { message: `Address dengan ID ${addressId} berhasil dihapus` };
  }
}
