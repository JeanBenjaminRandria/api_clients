import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyClientsReferrer1599925961151 implements MigrationInterface {
  name = 'modifyClientsReferrer1599925961151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "UQ_25194b1743ec208a958f7564a64"`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "rif"`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "rif" character varying(12) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "UQ_25194b1743ec208a958f7564a64"`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "rif"`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "rif" character varying(15) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif")`,
    );
  }
}
