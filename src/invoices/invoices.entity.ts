import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../projects/projects.entity';
import { Client } from '../clients/clients.entity';

@Entity('invoices')
export class Invoices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: false })
  project_id: number;

  @Column({ nullable: false })
  client_id: number;

  @Column()
  amount: number;

  @Column()
  payment_status: string;

  @Column()
  payment_method: string;

  @Column()
  issue_date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relasi ke Project
  @ManyToOne(() => Project, project => project.invoices, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    eager: true
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // Relasi ke Client
  @ManyToOne(() => Client, client => client.invoices, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    eager: true
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}