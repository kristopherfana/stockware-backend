import { Product } from "src/products/entities/product.entity";
import { Role } from "../entities/user.entity";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    lastLogin?: Date;
    created_at: Date;
    updated_at: Date;
    products?: Product[];
    token: string;
    tokenExpiry: Date;
}
