import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;
    @IsNumberString()
    createdById: number;
}
