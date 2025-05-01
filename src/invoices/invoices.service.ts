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
    console.log('Menyimpan invoice dengan data:', {
      project_id: invoice.project_id,
      client_id: invoice.client_id,
      amount: invoice.amount,
      payment_status: invoice.payment_status,
      payment_method: invoice.payment_method,
      issue_date: invoice.issue_date
    });

    // Pastikan project_id dan client_id adalah number
    invoice.project_id = Number(invoice.project_id);
    invoice.client_id = Number(invoice.client_id);

    const savedInvoice = await this.invoicesRepository.save(invoice);
    
    // Reload invoice dengan relasi
    const reloadedInvoice = await this.invoicesRepository.findOne({
      where: { id: savedInvoice.id },
      relations: ['project', 'client']
    });

    if (reloadedInvoice) {
      console.log('Invoice setelah disimpan:', {
        id: reloadedInvoice.id,
        project_id: reloadedInvoice.project_id,
        client_id: reloadedInvoice.client_id,
        project: reloadedInvoice.project ? {
          id: reloadedInvoice.project.id,
          name: reloadedInvoice.project.project_name
        } : null,
        client: reloadedInvoice.client ? {
          id: reloadedInvoice.client.id,
          name: reloadedInvoice.client.client_name
        } : null
      });
      return reloadedInvoice;
    }

    console.log('Invoice tidak ditemukan setelah disimpan, mengembalikan data yang disimpan');
    return savedInvoice;
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Invoices[]> {
    console.log("Mengambil invoice untuk user:", userId);
    
    const invoices = await this.invoicesRepository.find({
      where: { user_id: userId },
      relations: ['project', 'client'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    console.log("Jumlah invoice ditemukan:", invoices.length);
    invoices.forEach(invoice => {
      console.log("Detail invoice:", {
        id: invoice.id,
        client: invoice.client ? {
          id: invoice.client.id,
          name: invoice.client.client_name
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
    console.log("Mencari invoice dengan ID:", invoiceId, "untuk user:", userId);
    
    const invoice = await this.invoicesRepository.findOne({
      where: {
        user_id: userId,
        id: invoiceId,
      },
      relations: ['project', 'client'],
    });

    if (!invoice) {
      console.log("Invoice tidak ditemukan");
      return new Invoices();
    }

    console.log("Invoice ditemukan:", {
      id: invoice.id,
      project_id: invoice.project_id,
      client_id: invoice.client_id,
      project: invoice.project ? {
        id: invoice.project.id,
        name: invoice.project.project_name
      } : null,
      client: invoice.client ? {
        id: invoice.client.id,
        name: invoice.client.client_name
      } : null
    });

    return invoice;
  }

  async deleteById(invoiceId: number) {
    console.log("Menghapus invoice dengan ID:", invoiceId);
    await this.invoicesRepository.delete({ id: invoiceId });
  }
}
