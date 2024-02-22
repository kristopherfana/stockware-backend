import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column('text')
    description?: string;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    profit?: number | null;

    @Column({ default: null })
    image_url?: string;

    @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'createdBy' })
    createdBy?: User;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category?: Category;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}
