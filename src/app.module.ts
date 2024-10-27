import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { JwtAuthGuard } from './auth/services/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: ['.env'],
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User, Product, Category,
        ],
        synchronize: configService.get('SYNCHRONIZE_DB'),
        ssl: {
          rejectUnauthorized: false,
          cert: configService.get('DATABASE_CA_CERTIFICATE')
        },
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
})
export class AppModule {
}
