import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ImageService } from 'src/shared/services/image/image.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Injectable()
export class UsersService {
  usersRelations: FindOptionsRelations<User> = {
    products: true,
    categories: true
  }
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private imageService: ImageService
  ) { }

  async create(createUserDto: CreateUserDto, file?: any) {
    if (await this.userRepository.existsBy({ email: createUserDto.email })) {
      throw new HttpException(`Email ${createUserDto.email} is already taken.`, HttpStatus.CONFLICT)
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    if (file) {
      return this.imageService.uploadPicture(file).pipe(
        map((response) => {
          console.log("Here now");
          return this.userRepository.save({ ...createUserDto, image_url: response?.data.data.url });
        }
        )
      );
    }
    return await this.userRepository.save({ ...createUserDto });
  }

  findAll() {
    return this.userRepository.find({
      relations: this.usersRelations
    });
  }

  async findOne(id: number) {
    if (!(await this.userRepository.existsBy({ id: id })))
      throw new HttpException(`User with Id:${id}not found.`, HttpStatus.NOT_FOUND);
    return this.userRepository.findOne({
      where: { id: id },
      relations: this.usersRelations
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, { ...updateUserDto });
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ relations: this.usersRelations, where: { email } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords 
    const areEqual = await user.validatePassword(password);
    console.log(areEqual);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
  async findByPayload({ email }: any): Promise<UserDto> {
    return await this.userRepository.findOne({
      relations: this.usersRelations,
      where: { email }
    });
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

}
