import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from 'src/auth/dto/JwtPayload';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login.dto';
import { RegistrationStatus } from '../../dto/registration-status.dto';
import { User } from 'src/users/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/services/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from 'src/shared/services/image/image.service';
import { finalize, firstValueFrom, map, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, @InjectRepository(User) private userRepository: Repository<User>, private imageService: ImageService) { }

    async register(createUserDto: CreateUserDto, file?: any) {
        let status: RegistrationStatus = {
            success: true,
            message: `Registered as ${createUserDto.email}`,
        };
        if (await this.userRepository.existsBy({ email: createUserDto.email })) {
            throw new HttpException(`Email ${createUserDto.email} is already taken.`, HttpStatus.CONFLICT)
        }
        createUserDto.password = await this.usersService.hashPassword(createUserDto.password);
        if (file) {
            return this.imageService.uploadPicture(file).pipe(
                map(async (response) => {
                    await this.userRepository.save({ ...createUserDto, image_url: response?.data.data.url });
                    return status;
                })
            )
        }
        await this.userRepository.save({ ...createUserDto });
        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        let user = await this.usersService.findByLogin(loginUserDto);
        let status: RegistrationStatus = {
            success: true,
            message: `Authenticated as ${user.email}`,
        };
        const token = await this._createToken(user);
        this.usersService.update(user.id, { token: token, lastLogin: new Date(), tokenExpiry: this.getExpiryDate(token) })
        return {
            token,
            user: { ...user },
            status
        };
    }

    private async _createToken({ email, role }: UserDto): Promise<string> {
        const user: JwtPayload = { email, role };
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        if ((new Date()) > user.tokenExpiry) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    getExpiryDate(token: string): Date {
        const decoded = this.jwtService.decode(token) as { exp: number };
        if (decoded && decoded.exp) {
            return new Date(decoded.exp * 1000);
        }
        throw new Error('Invalid token or token does not contain an expiration date.');
    }
}
