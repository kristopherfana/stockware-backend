import { Role } from "src/users/entities/user.entity";

export interface JwtPayload {
    email: string;
    role: Role;
}