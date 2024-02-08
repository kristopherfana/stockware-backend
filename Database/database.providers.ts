import { ConfigService } from '@nestjs/config';
import { Attribute } from 'src/attributes/entities/attribute.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'kris',
                password: 'Azertyu1*',
                database: 'warehouse',
                entities: [
                    User, Product, Category, Attribute
                ],
                dropSchema: true,
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];