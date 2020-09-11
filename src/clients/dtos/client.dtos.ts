import { IsString, Matches, MaxLength, } from "class-validator";
import { Expose, Exclude } from "class-transformer";

@Exclude()
export class ClientDto {
  @Expose()
  @IsString()
  @MaxLength(100)
  name: string;

  @Expose()
  @MaxLength(15)
  @Matches(/^[JGVEP][-][0-9]{9}[-][0-9]{1}$/)
  rif: string;
}