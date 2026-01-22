import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { ImageService } from 'src/image-service/image-service.service';

/**
 * Tipe aman untuk response (tanpa password)
 */
type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly imageService: ImageService,
  ) {}

  /** ========= UTILITY METHODS ========= */

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private excludePassword(user: User): UserWithoutPassword {
    const { password, ...result } = user;
    return result;
  }

   /** ========= AUTHENTICATION METHODS ========= */

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user || !user.refreshToken) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  /** ========= CREATE USER ========= */

 async create(
  createUserDto: CreateUserDto,
  file?: Express.Multer.File,
): Promise<{ message: string; data: UserWithoutPassword }> {
  try {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    let avatarUrl: string | undefined;
    if (file) {
      const image = await this.imageService.convertToWebP(file.buffer);
      avatarUrl = image.url;
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      message: 'User created successfully',
      data: this.excludePassword(savedUser),
    };
  } catch (error: any) {
    // ✅ MYSQL DUPLICATE ENTRY
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      if (error.sqlMessage?.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      if (error.sqlMessage?.includes('phone')) {
        throw new BadRequestException('Phone number already exists');
      }

      throw new BadRequestException('Email or phone already exists');
    }

    throw error;
  }
}



  /** ========= GET ALL USERS ========= */

  async findAll(
    queryDto: QueryUserDto,
  ): Promise<{ message: string; data: UserWithoutPassword[]; total: number }> {
    const { page = 1, limit = 10, search, role } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    const usersWithoutPassword = users.map((user) =>
      this.excludePassword(user),
    );

    return {
      message: 'Users retrieved successfully',
      data: usersWithoutPassword,
      total,
    };
  }

  /** ========= GET ONE USER ========= */

  async findOne(
    id: string,
  ): Promise<{ message: string; data: UserWithoutPassword }> {
    const user = await this.userRepository.findOneBy({ userId: id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      message: 'User retrieved successfully',
      data: this.excludePassword(user),
    };
  }

  /** ========= UPDATE USER ========= */

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<{ message: string; data: UserWithoutPassword }> {
    const user = await this.userRepository.findOneBy({ userId: id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let newAvatarUrl = user.avatar;

    // Jika ada file baru, hapus avatar lama lalu upload baru
    if (file) {
      if (user.avatar) {
        await this.imageService.deleteImage(user.avatar);
      }

      const image = await this.imageService.convertToWebP(file.buffer);
      newAvatarUrl = image.url;
    }

    // Hash password jika ada di DTO
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(
        updateUserDto.password,
      );
    }

    // Merge data lama + baru
    const updatedData = {
      ...updateUserDto,
      avatar: newAvatarUrl,
    };

    this.userRepository.merge(user, updatedData);

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User updated successfully',
      data: this.excludePassword(savedUser),
    };
  }

  /** ========= DELETE USER ========= */

  async remove(id: string): Promise<{ message: string; data: null }> {
    const user = await this.userRepository.findOneBy({ userId: id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Hapus avatar jika ada
    if (user.avatar) {
      await this.imageService.deleteImage(user.avatar);
    }

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
