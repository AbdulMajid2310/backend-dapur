// src/profiles/profiles.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { SocialMedia } from './entities/social-media.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageService } from 'src/image-service/image-service.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(SocialMedia)
    private readonly socialRepo: Repository<SocialMedia>,

    private readonly imageService: ImageService,
  ) {}

 // src/profiles/profiles.service.ts
async create(
  userId: string,
  dto: CreateProfileDto,
  logoFile?: Express.Multer.File,
  coverFile?: Express.Multer.File,
) {
  const existingProfile = await this.profileRepo.findOne({
    where: { user: { userId } },
    relations: ['socialMedias'],
  });

  if (existingProfile) {
    return {
      message: 'Profile untuk user ini sudah ada',
      data: existingProfile,
    };
  }

  const profile = this.profileRepo.create({
    ...dto,
    user: { userId } as any,
  });

  // PERBAIKAN: Proses social media dengan benar
  if (dto.socialMedia && dto.socialMedia.length > 0) {
    profile.socialMedias = dto.socialMedia.map(smDto => 
      this.socialRepo.create(smDto)
    );
  }

  if (logoFile) {
    const { url } = await this.imageService.convertToWebP(logoFile.buffer);
    profile.logo = url;
  }

  if (coverFile) {
    const { url } = await this.imageService.convertToWebP(coverFile.buffer);
    profile.coverImage = url;
  }

  const savedProfile = await this.profileRepo.save(profile);

  return {
    message: 'Profile berhasil dibuat',
    data: savedProfile,
  };
}

  async findByUserId(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { user: { userId } },
      relations: ['socialMedias'],
    });

    if (!profile) {
      return {
        message: 'Profile untuk user ini tidak ditemukan',
        data: null,
      };
    }

    return {
      message: 'Profile berhasil ditemukan',
      data: profile,
    };
  }

  async findAll() {
    return this.profileRepo.find({
      relations: ['socialMedias', 'user'],
    });
  }

  async findOne(id: string) {
    const profile = await this.profileRepo.findOne({
      where: { profileId: id },
      relations: ['socialMedias', 'user'],
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

 /**
 * Memperbarui data profil.
 * Jika ada file gambar baru yang diupload, gambar lama akan dihapus dari storage.
 */
async update(
  id: string,
  dto: UpdateProfileDto,
  logoFile?: Express.Multer.File,
  coverFile?: Express.Multer.File,
) {
  // PERBAIKAN: Ubah 'socialMedia' menjadi 'socialMedias' pada relasi
  const profile = await this.profileRepo.findOne({
    where: { profileId: id },
    relations: ['socialMedias'], // Sebelumnya: 'socialMedia'
  });

  if (!profile) {
    throw new NotFoundException('Profile not found');
  }

  // Update data profile utama
  Object.assign(profile, dto);

  // --- PERBAIKAN: LOGIKA PENGAhapUSAN GAMBAR LAMA ---
  // Jika ada file logo baru diupload
  if (logoFile) {
    // Hapus logo lama dari storage jika ada
    if (profile.logo) {
      await this.imageService.deleteImage(profile.logo);
    }
    // Upload logo baru dan simpan URL-nya
    const { url } = await this.imageService.convertToWebP(logoFile.buffer);
    profile.logo = url;
  }

  // Jika ada file cover image baru diupload
  if (coverFile) {
    // Hapus cover image lama dari storage jika ada
    if (profile.coverImage) {
      await this.imageService.deleteImage(profile.coverImage);
    }
    // Upload cover image baru dan simpan URL-nya
    const { url } = await this.imageService.convertToWebP(coverFile.buffer);
    profile.coverImage = url;
  }

  // PERBAIKAN: Proses Social Media dengan benar
  if (dto.socialMedia) {
    // Hapus semua social media yang ada
    await this.socialRepo.delete({ profile: { profileId: id } });
    
    // Tambahkan social media baru
    if (dto.socialMedia.length > 0) {
      const newSocialMedias = dto.socialMedia.map(smDto => 
        this.socialRepo.create({
          ...smDto,
          profile: profile
        })
      );
      profile.socialMedias = newSocialMedias;
    } else {
      profile.socialMedias = [];
    }
  }

  await this.profileRepo.save(profile);

  return this.findOne(id);
}

  /**
   * Menghapus data profil beserta semua gambar terkait dari storage.
   */
  async remove(id: string) {
    const profile = await this.findOne(id); // findOne sudah memuat relasi

    // --- PERBAIKAN: LOGIKA PENGAhapUSAN GAMBAR ---
    // Hapus logo dari storage jika ada
    if (profile.logo) {
      await this.imageService.deleteImage(profile.logo);
    }
    // Hapus cover image dari storage jika ada
    if (profile.coverImage) {
      await this.imageService.deleteImage(profile.coverImage);
    }

    // Karena ada 'onDelete: 'CASCADE' di entitas, menghapus profile
    // akan otomatis menghapus semua social media terkait dari database.
    return this.profileRepo.remove(profile);
  }
}