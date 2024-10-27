import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsService } from '../services/products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { mkdirSync } from 'node:fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Roles(Role.Admin, Role.Cashier)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: any) {
    return this.productsService.create(createProductDto, file);
  }

  @Get()
  @Public()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Cashier)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.update(+id, updateProductDto, file);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
