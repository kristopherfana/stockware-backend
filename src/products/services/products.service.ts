import { UpdateProductDto } from './../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { UsersService } from 'src/users/services/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { ImageService } from 'src/shared/services/image/image.service';
import { map } from 'rxjs';

@Injectable()
export class ProductsService {
  productRelations: FindOptionsRelations<Product> = {
    createdBy: true,
    category: true
  };
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private userService: UsersService,
    private categoryService: CategoriesService,
    private imageService: ImageService
  ) { }
  async create(createProductDto: CreateProductDto, file: any) {
    let product = new Product();
    //Gets the createdBy user
    const user = await this.userService.findOne(createProductDto.createdById);
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    product = {
      ...createProductDto,
      profit: this.calculateProfitPercentage(createProductDto.cost, createProductDto.price),
      createdBy: user,
      category
    }
    if (file) {
      return this.imageService.uploadPicture(file).pipe(
        map((response) => {
          return this.productRepository.save({ ...product, image_url: response?.data.data.url });
        }
        )
      )
    }
    return this.productRepository.save({ ...product });
  }

  findAll() {
    return this.productRepository.find({
      relations: this.productRelations
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      relations: this.productRelations,
      where: { id: id }
    });
    if (!product) throw new HttpException(`Product with Id ${id} not found`, HttpStatus.NOT_FOUND);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, image: any) {
    let category = new Category();
    if (updateProductDto?.categoryId) {
      category = await this.categoryService.findOne(updateProductDto?.categoryId);
      await this.productRepository.update(id, { category: category });
    }
    if (image) {
      let imageUploaded: any;
      this.imageService.uploadPicture(image).subscribe({
        next: (response) => imageUploaded = response?.data?.url
      })
      return this.productRepository.save({ ...updateProductDto, image_url: imageUploaded });
    }
    await this.productRepository.update(id, { ...updateProductDto });
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  async existsById(id: number) {
    return await this.productRepository.existsBy({ id: id })
  }

  calculateProfitPercentage(cost: number, price: number): number {
    if (cost != null && price != null) {
      if (cost == 0) return 100;
      return (((price - cost) / cost) * 100);
    }
    return 0;
  }
}
