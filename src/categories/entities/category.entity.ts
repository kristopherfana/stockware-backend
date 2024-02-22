import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    name: string;
    @Column({ default: null })
    image_url?: string;
    @OneToMany(() => Product, product => product.category, { cascade: true, })
    products?: Product[];
    @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'createdBy' })
    createdBy?: User;
}
