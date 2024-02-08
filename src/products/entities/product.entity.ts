import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Attribute } from "src/attributes/entities/attribute.entity";
import { Category } from "src/categories/entities/category.entity";
import { Image } from "src/shared/entities/image.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    marketing_text: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    profit: number;

    @OneToMany(
        () => Image,
        image => image.product,
        { cascade: true }
    )
    default_images: Image[];

    @ManyToOne(() => User, user => user.products)
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

    @ManyToMany(() => Attribute, { cascade: true })
    @JoinTable({ name: "products_attributes" })
    attributes: Attribute[];

    @ManyToMany(() => Category)
    @JoinTable({ name: "products_categories" })
    categories: Category[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
