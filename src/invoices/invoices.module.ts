import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoices } from "./invoices.entity";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

@Module({
  imports: [TypeOrmModule.forFeature([Invoices])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
