import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['user', 'cashier', 'admin'],
        default: 'user',
    })
    role: Role;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({
        default: null
    })
    updated_at: Date;

    @OneToMany(() => Product, product => product.createdBy)
    products: Product[];
}

export type Role = 'user' | 'cashier' | 'admin';
