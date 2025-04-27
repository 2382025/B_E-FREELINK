import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../projects/projects.entity';
import { Invoices } from '../invoices/invoices.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  client_name: string;

  @Column()
  email: string;

  @Column()
  phone_no: string;

  @Column()
  company: string;

  // Relasi ke Project
  @OneToMany(() => Project, project => project.client)
  projects: Project[];

  // Relasi ke Invoice
  @OneToMany(() => Invoices, invoice => invoice.client)
  invoices: Invoices[];
}