import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Attribute } from "src/attributes/entities/attribute.entity";
import { Category } from "src/categories/entities/category.entity";
import { Product } from "src/products/entities/product.entity";

@Entity({ name: "images" })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    url: string;
    @Column()
    name: string;
    @ManyToOne(() => Attribute, attribute => attribute.images)
    attribute: Attribute;
    @ManyToOne(() => Category, category => category.images)
    category: Category;
    @ManyToOne(() => Product, product => product.images)
    product: Product;
}