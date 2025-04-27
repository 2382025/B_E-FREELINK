import { Injectable } from '@nestjs/common';
import { Client } from './clients.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async save(client: Client): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async findByUserId(userId: number, page: number, limit: number): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        client_name: 'ASC', // Bisa disesuaikan jika ingin urut berdasarkan field lain
      },
    });
  }

  async findByUserIdAndClientId(userId: number, clientId: number): Promise<Client | null> {
    return await this.clientRepository.findOne({
      where: {
        user_id: userId,
        id: clientId,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.clientRepository.delete({ id });
  }
}
