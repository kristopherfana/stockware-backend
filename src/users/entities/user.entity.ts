import * as bcrypt from 'bcrypt';

import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Category } from 'src/categories/entities/category.entity';
import { Product } from "src/products/entities/product.entity";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['user', 'cashier', 'admin'],
        default: 'user',
    })
    role: Role;

    @Column({ default: null })
    token: string | null;

    @Column({ default: null })
    tokenExpiry: Date | null;

    @Column({ default: null, name: "last_login" })
    lastLogin: Date;

    @Column({ default: null })
    image_url?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({
        default: null
    })
    updated_at: Date;

    @OneToMany(() => Product, product => product.createdBy, { cascade: true })
    products: Product[];

    @OneToMany(() => Category, category => category.createdBy, { cascade: true })
    categories: Category[];

    async validatePassword(password: string) {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    }
}

export enum Role {
    User = 'user',
    Cashier = 'cashier',
    Admin = 'admin',
}
