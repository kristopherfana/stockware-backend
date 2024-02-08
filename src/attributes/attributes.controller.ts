import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) { }

  @Post()
  @UseInterceptors(FileInterceptor(
    'file',
    {
      storage: diskStorage({
        destination: "C:/Users/Kris/Desktop/Matogen Internship/images",
        filename(req, file, cb) {
          let extArray = file.mimetype.split("/");
          let extension = extArray[extArray.length - 1];
          cb(null, `${req.body?.name}_${req.body?.value}_${Date.now()}.${extension}`)
        },
      })
    }
  ))
  create(@Body() createAttributeDto: CreateAttributeDto, @UploadedFile() file: Express.Multer.File) {
    return this.attributesService.create(createAttributeDto, file);
  }

  @Get()
  findAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(+id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(+id);
  }
}
