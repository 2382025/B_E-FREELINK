import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity'; 
import { ClientController } from './clients.controller'; 
import { ClientsService } from './clients.service'; 

@Module({
  imports: [TypeOrmModule.forFeature([Client])], 
  controllers: [ClientController], 
  providers: [ClientsService], 
})
export class ClientModule {} 
