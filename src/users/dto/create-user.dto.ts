import { IsEmail, IsNotEmpty } from "class-validator";

import { Role } from "../entities/user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    password: string;
    role: Role;
    token: string;
    lastLogin: Date;
    tokenExpiry: Date;

}
