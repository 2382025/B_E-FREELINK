import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateClientDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  client_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone_no: string;  

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  company: string;
}
