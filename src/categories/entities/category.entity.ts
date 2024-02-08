import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Image } from "src/shared/entities/image.entity";
import { Product } from "src/products/entities/product.entity";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Image, image => image.category)
    images: Image[];

    @ManyToMany(() => Product)
    products: Product[];
}
