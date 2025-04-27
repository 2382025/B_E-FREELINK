import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoicesTable1745470989278 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE TABLE invoices (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'unpaid',
      payment_method VARCHAR(50) DEFAULT 'bank_transfer',
      
      issue_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `);

  await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  await queryRunner.query(`
    CREATE TRIGGER update_invoice_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `);
}

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_invoice_updated_at ON invoices;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column;`);
    await queryRunner.query(`DROP TABLE invoices;`);
  }

}
