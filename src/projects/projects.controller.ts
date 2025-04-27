import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { CreateProjectDTO } from './create-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './projects.entity';
import { ApiParam, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() request: Request, @Body() createProjectDTO: CreateProjectDTO) {
    const project: Project = new Project();
    const userJwtPayload: JwtPayloadDto = request['user'];
    project.user_id = userJwtPayload.sub;
    project.project_name = createProjectDTO.project_name;
    project.client_id = createProjectDTO.client_id;
    project.due_date = createProjectDTO.due_date;
    project.project_status = createProjectDTO.project_status;
    return await this.projectsService.save(project);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Project[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.projectsService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Project> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.projectsService.findByUserIdAndProjectId(userJwtPayload.sub, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createProjectDTO: CreateProjectDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const project: Project = await this.projectsService.findByUserIdAndProjectId(
      userJwtPayload.sub,
      id,
    );
    if (project.id == null) {
      throw new NotFoundException();
    }
    project.project_name = createProjectDTO.project_name;
    project.client_id = createProjectDTO.client_id;
    project.due_date = createProjectDTO.due_date;
    project.project_status = createProjectDTO.project_status;
    return await this.projectsService.save(project);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const project: Project = await this.projectsService.findByUserIdAndProjectId(
      userJwtPayload.sub,
      id,
    );
    if (project.id == null) {
      throw new NotFoundException();
    }
    return await this.projectsService.deleteById(id);
  }
}
