import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { ClientReadDto } from "../clients/client-read.dto";

@Exclude()
export class PaginationOutClientsDto {
    @ApiProperty()
    @Expose()
    @IsNumber()
    count: number;
    
    @ApiProperty()
    @Expose()
    @Type(() => ClientReadDto)
    clients: ClientReadDto[]

}