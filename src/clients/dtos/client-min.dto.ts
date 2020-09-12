import { IsString, MaxLength, IsNumber, } from "class-validator";
import { Expose, Exclude } from "class-transformer";

@Exclude()
export class ClientMinDto {

  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @MaxLength(100)
  name: string;

}