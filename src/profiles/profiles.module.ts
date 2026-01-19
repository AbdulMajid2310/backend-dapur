import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';
import { ImageService } from 'src/image-service/image-service.service';
import { SocialMedia } from './entities/social-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User, SocialMedia])],
  controllers: [ProfilesController],
  providers: [ProfilesService, ImageService],
})
export class ProfilesModule {}
