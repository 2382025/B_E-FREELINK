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
import { CreateInvoiceDTO } from './create-invoice.dto';
import { InvoicesService } from './invoices.service';
import { Invoices } from './invoices.entity';
import { ApiParam, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Client } from '../clients/clients.entity';

@ApiTags('invoices')
@Controller('invoice')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() request: Request, @Body() createInvoiceDTO: CreateInvoiceDTO) {
    console.log('Membuat invoice baru dengan data:', createInvoiceDTO);
    
    const invoice: Invoices = new Invoices();
    const userJwtPayload: JwtPayloadDto = request['user'];
    invoice.user_id = userJwtPayload.sub;
    invoice.project_id = createInvoiceDTO.project_id;
    invoice.client_id = createInvoiceDTO.client_id;
    invoice.amount = createInvoiceDTO.amount;
    invoice.payment_status = createInvoiceDTO.payment_status;
    invoice.payment_method = createInvoiceDTO.payment_method;
    invoice.issue_date = createInvoiceDTO.issue_date;
    
    const savedInvoice = await this.invoicesService.save(invoice);
    console.log('Invoice berhasil dibuat:', savedInvoice);
    return savedInvoice;
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Invoices[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.invoicesService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Invoices> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const invoice = await this.invoicesService.findByUserIdAndInvoiceId(userJwtPayload.sub, id);
    if (!invoice) {
      throw new NotFoundException(`Invoice dengan ID ${id} tidak ditemukan`);
    }
    return invoice;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createInvoiceDTO: CreateInvoiceDTO,
  ) {
    console.log('Mengupdate invoice dengan ID:', id, 'dengan data:', createInvoiceDTO);
    
    const userJwtPayload: JwtPayloadDto = request['user'];
    const invoice = await this.invoicesService.findByUserIdAndInvoiceId(
      userJwtPayload.sub,
      id,
    );
    
    if (!invoice) {
      throw new NotFoundException(`Invoice dengan ID ${id} tidak ditemukan`);
    }

    invoice.project_id = createInvoiceDTO.project_id;
    invoice.client_id = createInvoiceDTO.client_id;
    invoice.amount = createInvoiceDTO.amount;
    invoice.payment_status = createInvoiceDTO.payment_status;
    invoice.payment_method = createInvoiceDTO.payment_method;
    invoice.issue_date = createInvoiceDTO.issue_date;

    const updatedInvoice = await this.invoicesService.save(invoice);
    console.log('Invoice berhasil diupdate:', updatedInvoice);
    return updatedInvoice;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    console.log('Menghapus invoice dengan ID:', id);
    
    const userJwtPayload: JwtPayloadDto = request['user'];
    const invoice = await this.invoicesService.findByUserIdAndInvoiceId(
      userJwtPayload.sub,
      id,
    );
    
    if (!invoice) {
      throw new NotFoundException(`Invoice dengan ID ${id} tidak ditemukan`);
    }
    
    await this.invoicesService.deleteById(id);
    return { message: 'Invoice berhasil dihapus' };
  }
}
