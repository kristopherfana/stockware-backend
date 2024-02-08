import { Attribute } from './entities/attribute.entity';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService],
  imports: [TypeOrmModule.forFeature([Attribute]), SharedModule]
})
export class AttributesModule { }
