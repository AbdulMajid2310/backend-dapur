// src/testimonials/testimonials.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { CreateMultipleTestimonialsDto } from './dto/create-multiple-testimonials.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/testimonials')
// @UseGuards(JwtAuthGuard)
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

 @Post()
@UseInterceptors(FileInterceptor('image'))
create(
  @Body() createTestimonialDto: CreateTestimonialDto,
  @UploadedFile() image: Express.Multer.File,
) {
  return this.testimonialsService.create(createTestimonialDto, image);
}


  @Post('batch')
  createMultiple(@Body() createMultipleTestimonialsDto: CreateMultipleTestimonialsDto, @Request() req) {
    return this.testimonialsService.createMultiple(createMultipleTestimonialsDto, req.user);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get('menu-item/:menuItemId')
  findByMenuItemId(@Param('menuItemId') menuItemId: string) {
    return this.testimonialsService.findByMenuItemId(menuItemId);
  }

  @Get('user')
  findByUser(@Request() req) {
    return this.testimonialsService.findByUserId(req.user.userId);
  }

  @Get('eligible-orders')
  findEligibleOrders(@Request() req) {
    return this.testimonialsService.findUserCompletedOrdersWithUnreviewedItems(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto, req.user, image);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.testimonialsService.remove(id, req.user);
  }
}