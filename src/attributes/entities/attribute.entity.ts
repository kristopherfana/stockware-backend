import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Image } from "src/shared/entities/image.entity";

@Entity({ name: "attributes" })
export class Attribute {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        unique: true
    })
    name: string;
    @Column()
    value: string;
    @Column()
    description: string;
    @OneToMany(() => Image, image => image.attribute, { cascade: true })
    images?: Image[]

}
