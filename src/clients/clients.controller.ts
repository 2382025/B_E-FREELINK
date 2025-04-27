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
import { CreateClientDTO } from './create-client.dto';
import { ClientsService } from './clients.service';
import { Client } from './clients.entity';
import { ApiParam, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() request: Request, @Body() createClientDTO: CreateClientDTO) {
    const client: Client = new Client();
    const userJwtPayload: JwtPayloadDto = request['user'];
    client.client_name = createClientDTO.client_name;
    client.email = createClientDTO.email;
    client.phone_no = createClientDTO.phone_no;
    client.company = createClientDTO.company;
    client.user_id = userJwtPayload.sub;
    return await this.clientService.save(client);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Client[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.clientService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the client' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Client> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const client = await this.clientService.findByUserIdAndClientId(userJwtPayload.sub, id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createClientDTO: CreateClientDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const client = await this.clientService.findByUserIdAndClientId(
      userJwtPayload.sub,
      id,
    );
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    client.client_name = createClientDTO.client_name;
    client.email = createClientDTO.email;
    client.phone_no = createClientDTO.phone_no;
    client.company = createClientDTO.company;
    return await this.clientService.save(client);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const client = await this.clientService.findByUserIdAndClientId(
      userJwtPayload.sub,
      id,
    );
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return await this.clientService.deleteById(id);
  }
}
