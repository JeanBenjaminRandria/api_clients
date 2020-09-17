import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";

@Exclude()
export class PaginationInDto {

    @ApiProperty()
    @Expose()
    @IsNumber()
    take: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    skip: number;

}

export const paginationIntDefault: PaginationInDto = {
    take: 10, 
    skip: 0
}