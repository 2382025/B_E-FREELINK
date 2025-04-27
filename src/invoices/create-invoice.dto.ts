import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsPositive } from "class-validator";

export class CreateInvoiceDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  project_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  client_id: number;

  @IsNumber()
  @IsPositive() 
  @ApiProperty()
  amount: number;  

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  payment_status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  payment_method: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  issue_date: string;
}
