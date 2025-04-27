import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Invoices } from '../invoices/invoices.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  project_name: string;

  @Column()
  client_id: number;

  @Column()
  due_date: string;

  @Column()
  project_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relasi ke Client
  @ManyToOne(() => Client, client => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  // Relasi ke Invoice
  @OneToMany(() => Invoices, invoice => invoice.project)
  invoices: Invoices[];
}