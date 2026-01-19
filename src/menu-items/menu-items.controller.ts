import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemService } from './menu-items.service';
import { createResponse } from 'src/common/utils/respon.util';

@Controller('api/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFile() file: Express.Multer.File) {
    const data = this.menuItemService.create(createMenuItemDto, file);
    return createResponse('create a menu items retrieved successfully', data)
  }

  @Get()
 async findAll() {
    const data = await this.menuItemService.findAll();
    return createResponse('menu items retrieved successfully', data)
  }

   @Get('favorites') // Ini akan membuat endpoint GET /menu-items/favorites
  async findFavoriteItems(){
    const data = await this.menuItemService.findFavorites();
    return createResponse('menu items retrieved successfully', data)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.menuItemService.findOne(id);
    return createResponse('menu detail ', data)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
 async  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMenuItemDto: UpdateMenuItemDto, @UploadedFile() file?: Express.Multer.File) {
    const data = this.menuItemService.update(id, updateMenuItemDto, file);
      return createResponse('menu items update successfully', data)
  }

  @Delete()
removeMultiple(@Query('ids') ids: string) {
  const idArray = ids.split(','); // misal ?ids=id1,id2,id3
  return this.menuItemService.remove(idArray);
}

}