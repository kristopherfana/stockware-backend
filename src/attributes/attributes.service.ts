import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Repository } from 'typeorm';
import { Image } from 'src/shared/entities/image.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>
  ) { }
  create(createAttributeDto: CreateAttributeDto, file: Express.Multer.File) {
    let attribute = new Attribute();
    attribute = { ...createAttributeDto }
    if (file) {
      const image = new Image();
      image.name = file.filename;
      image.url = file.destination;
      attribute.images = [image];
    }
    return this.attributeRepository.save(attribute);
  }

  findAll() {
    return `This action returns all attributes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribute`;
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return `This action updates a #${id} attribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }
}
