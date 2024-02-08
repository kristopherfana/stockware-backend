import { IsNotEmpty } from "class-validator";

export class CreateAttributeDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    value: string;
    description: string;

}
