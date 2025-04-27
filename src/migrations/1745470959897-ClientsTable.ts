import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientsTable1745470959897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE clients (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                client_name VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_no VARCHAR(20),
                company VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ); 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE clients;`)
    }

}
