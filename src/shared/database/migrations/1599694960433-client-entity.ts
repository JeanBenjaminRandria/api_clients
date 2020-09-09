import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientEntity1599694960433 implements MigrationInterface {
  name = 'clientEntity1599694960433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "rif" character varying(15) NOT NULL, CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
