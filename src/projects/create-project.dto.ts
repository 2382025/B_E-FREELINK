import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  project_name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  client_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  due_date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  project_status: string;
}
