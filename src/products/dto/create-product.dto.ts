import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;
    description?: string;
    marketing_text?: string;
    @IsNumberString()
    price?: number;
    @IsNumberString()
    cost?: number;
    @IsNotEmpty()
    createdById: number;
    quantity: number;
    @IsNotEmpty()
    categoryId: number;
}
