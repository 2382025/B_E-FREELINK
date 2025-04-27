import { Injectable } from '@nestjs/common';
import { Project } from './projects.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../clients/clients.entity'; 

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
  ) {}

  async save(project: Project): Promise<Project> {
    return this.projectsRepository.save(project);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
      relations: ['client'], // <-- Perbaiki: Pastikan join relasi client
    });
  }

  async findByUserIdAndProjectId(userId: number, projectId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        user_id: userId,
        id: projectId,
      },
      relations: ['client'], // <-- Perbaiki: Pastikan join relasi client
    });
    if (!project) {
      return new Project();
    }
    return project;
  }

  async deleteById(projectId: number) {
    await this.projectsRepository.delete({ id: projectId });
  }
}
