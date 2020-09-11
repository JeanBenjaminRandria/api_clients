import { IsString, Matches, MaxLength, IsNumber, IsOptional, } from "class-validator";
import { Expose, Exclude, Type } from "class-transformer";
import { ClientMinDto } from "./client-min.dto";

@Exclude()
export class ClientReadDto {

    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsString()
    @MaxLength(100)
    name: string;

    @Expose()
    @MaxLength(15)
    @Matches(/^[JGVEP][-][0-9]{9}[-][0-9]{1}$/)
    rif: string;

    @Expose()
    @IsOptional()
    @Type(() => ClientMinDto)
    referrerId?: ClientMinDto;
}