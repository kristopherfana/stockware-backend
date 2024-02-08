import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Attribute } from './attributes/entities/attribute.entity';
import { AttributesModule } from './attributes/attributes.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Image } from './shared/entities/image.entity';
import { Module } from '@nestjs/common';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'kris',
      password: 'Azertyu1*',
      database: 'warehouse',
      entities: [
        User, Product, Category, Attribute, Image
      ],
      synchronize: true,
      dropSchema: true
    }),
    UsersModule,
    ProductsModule,
    AttributesModule,
    CategoriesModule,
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: 'Config/.env'
      }
    ),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) { }
}
