import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthController } from "./controllers/auth/auth.controller";
import { AuthService } from "./services/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./services/JwtStrategy";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SharedModule } from "src/shared/shared.module";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        UsersModule,
        SharedModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({

                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,],
    exports: [
        PassportModule,
        JwtModule,
    ],
})
export class AuthModule { }