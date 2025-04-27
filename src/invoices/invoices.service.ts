import { Injectable } from '@nestjs/common';
import { Invoices } from './invoices.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoices) private invoicesRepository: Repository<Invoices>,
  ) {}

  async save(invoice: Invoices): Promise<Invoices> {
    return this.invoicesRepository.save(invoice);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Invoices[]> {
    console.log("Fetching invoices for user:", userId);
    
    const invoices = await this.invoicesRepository.find({
      where: { user_id: userId },
      relations: ['project', 'client'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    console.log("Found invoices:", invoices.length);
    invoices.forEach(invoice => {
      console.log("Invoice details:", {
        id: invoice.id,
        client: invoice.client ? {
          id: invoice.client.id,
          name: invoice.client.client_name,
          raw: invoice.client // Log raw client data
        } : null,
        project: invoice.project ? {
          id: invoice.project.id,
          name: invoice.project.project_name
        } : null
      });
    });

    return invoices;
  }

  async findByUserIdAndInvoiceId(userId: number, invoiceId: number): Promise<Invoices> {
    const invoice = await this.invoicesRepository.findOne({
      where: {
        user_id: userId,
        id: invoiceId,
      },
      relations: ['project', 'client'],
    });
    if (!invoice) {
      return new Invoices();
    }
    return invoice;
  }

  async deleteById(invoiceId: number) {
    await this.invoicesRepository.delete({ id: invoiceId });
  }
}
