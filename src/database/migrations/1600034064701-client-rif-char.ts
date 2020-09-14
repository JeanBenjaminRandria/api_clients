import {MigrationInterface, QueryRunner} from "typeorm";

export class clientRifChar1600034064701 implements MigrationInterface {
    name = 'clientRifChar1600034064701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_25194b1743ec208a958f7564a64"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "rif"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "rif" character(13) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_25194b1743ec208a958f7564a64"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "rif"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "rif" character varying(13) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif")`);
    }

}
