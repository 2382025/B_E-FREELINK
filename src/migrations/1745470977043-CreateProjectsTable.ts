import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectsTable1745470977043 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                project_name VARCHAR(255) NOT NULL,
                client_id INTEGER NOT NULL,
                due_date DATE,
                project_status VARCHAR(50) DEFAULT 'In Progress',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ); 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE projects;`)
    }

}
