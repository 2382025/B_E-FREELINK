import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./projects.entity";
import { ProjectController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { Client } from "../clients/clients.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Client])],
  controllers: [ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
