import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtPayload } from 'src/auth/dto/JwtPayload';
import { RegistrationStatus } from 'src/auth/dto/registration-status.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/services/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login.dto';
import { mkdirSync } from 'node:fs';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService:
        AuthService) { }

    @Post('register')
    @Public()
    @UseInterceptors(FileInterceptor(
        'file',
    ))
    create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: any) {
        return this.authService.register(createUserDto, file);
    }

    @Public()
    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<RegistrationStatus> {
        return await this.authService.login(loginUserDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(req.user)
    }

    @Post('validate-user')
    @Public()
    validateUser(@Body() jwtPayLoad: JwtPayload) {
        return this.authService.validateUser(jwtPayLoad);
    }
}
