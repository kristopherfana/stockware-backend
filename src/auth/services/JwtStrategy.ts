import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/JwtPayload';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<String>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: JwtPayload): Promise<UserDto> {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}