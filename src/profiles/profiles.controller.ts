// src/profiles/profiles.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

 
@Post(':userId')
@UseInterceptors(
  FilesInterceptor('images', 2) 
)
create(
  @Param('userId') userId: string,
  @Body() dto: CreateProfileDto,
  @UploadedFiles() files?: Express.Multer.File[],
) {
  const logo = files?.[0];
  const cover = files?.[1];

  return this.profilesService.create(userId, dto, logo, cover);
}

  @Get('user/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 2))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const logo = files?.[0];
    const cover = files?.[1];

    return this.profilesService.update(id, dto, logo, cover);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
