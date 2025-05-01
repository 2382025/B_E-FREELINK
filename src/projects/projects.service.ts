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
    console.log('Menyimpan project dengan data:', {
      id: project.id,
      client_id: project.client_id,
      client_id_type: typeof project.client_id,
      project_name: project.project_name,
      due_date: project.due_date,
      project_status: project.project_status
    });
    
    // Pastikan client_id adalah number
    if (project.client_id) {
      project.client_id = Number(project.client_id);
      console.log('client_id setelah konversi:', {
        value: project.client_id,
        type: typeof project.client_id
      });
    }

    let savedProject: Project;

    if (project.id) {
      // Update project yang sudah ada
      await this.projectsRepository
        .createQueryBuilder()
        .update(Project)
        .set({
          project_name: project.project_name,
          client_id: project.client_id,
          due_date: project.due_date,
          project_status: project.project_status
        })
        .where("id = :id", { id: project.id })
        .execute();

      savedProject = project;
    } else {
      // Buat project baru
      savedProject = await this.projectsRepository.save(project);
    }

    // Reload project dengan relasi client
    const reloadedProject = await this.projectsRepository.findOne({
      where: { id: savedProject.id },
      relations: ['client']
    });

    if (!reloadedProject) {
      console.log('Project tidak ditemukan setelah disimpan');
      return savedProject;
    }

    console.log('Project setelah reload:', {
      id: reloadedProject.id,
      client_id: reloadedProject.client_id,
      client_id_type: typeof reloadedProject.client_id,
      project_name: reloadedProject.project_name,
      due_date: reloadedProject.due_date,
      project_status: reloadedProject.project_status,
      client: reloadedProject.client ? {
        id: reloadedProject.client.id,
        name: reloadedProject.client.client_name
      } : null
    });

    return reloadedProject;
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
      relations: ['client'],
      cache: false // Force refresh
    });
  }

  async findByUserIdAndProjectId(userId: number, projectId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        user_id: userId,
        id: projectId,
      },
      relations: ['client'],
      cache: false // Force refresh
    });

    if (!project) {
      console.log('Project tidak ditemukan:', { userId, projectId });
      return new Project();
    }

    console.log('Project ditemukan:', {
      id: project.id,
      client_id: project.client_id,
      client: project.client ? {
        id: project.client.id,
        name: project.client.client_name
      } : null
    });

    return project;
  }

  async deleteById(projectId: number) {
    await this.projectsRepository.delete({ id: projectId });
  }
}
