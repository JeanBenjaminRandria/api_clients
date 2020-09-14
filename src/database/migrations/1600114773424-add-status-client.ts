import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusClient1600114773424 implements MigrationInterface {
    name = 'addStatusClient1600114773424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_9591e8377235e9d87c5df410706"`);
        await queryRunner.query(`ALTER TABLE "clients" RENAME COLUMN "referrersId" TO "status"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "status" character varying(8) NOT NULL DEFAULT 'Active'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e1284059a0b034221ea26287d98" FOREIGN KEY ("referrerId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e1284059a0b034221ea26287d98"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "status" integer`);
        await queryRunner.query(`ALTER TABLE "clients" RENAME COLUMN "status" TO "referrersId"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_9591e8377235e9d87c5df410706" FOREIGN KEY ("referrersId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
