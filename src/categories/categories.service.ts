import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { ImageService } from 'src/shared/services/image/image.service';
import { map } from 'rxjs';

@Injectable()
export class CategoriesService {
  categoryRelations: FindOptionsRelations<Category> = {
    createdBy: true,
    products: true
  };

  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>, private userService: UsersService, private imageService: ImageService) { }

  async create(createCategoryDto: CreateCategoryDto, file?: any) {
    const user = await this.userService.findOne(createCategoryDto.createdById);
    let category = new Category();
    category = { ...createCategoryDto, createdBy: user }
    if (file) {
      return this.imageService.uploadPicture(file).pipe(
        map((response) => {
          console.log("hey")
          return this.categoryRepository.save({ ...category, image_url: response?.data.data.url });
        }
        )
      )
    }
    return await this.categoryRepository.save({ ...category });
  }

  findAll() {
    return this.categoryRepository.find({
      relations: this.categoryRelations
    })
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      relations: this.categoryRelations,
      where: { id: id }
    })
    if (!category) {
      throw new HttpException(`Category Id:${id} not found`, HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, { ...updateCategoryDto })
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
