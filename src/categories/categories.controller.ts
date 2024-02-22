import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @Roles(Role.Admin, Role.Cashier)
  @UseInterceptors(FileInterceptor(
    'file',
  ))
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: any) {
    return this.categoriesService.create(createCategoryDto, file);
  }

  @Get()
  @Public()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Cashier)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
