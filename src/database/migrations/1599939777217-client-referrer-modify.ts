import {MigrationInterface, QueryRunner} from "typeorm";

export class clientReferrerModify1599939777217 implements MigrationInterface {
    name = 'clientReferrerModify1599939777217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e1284059a0b034221ea26287d98"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "referrersId" integer`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_9591e8377235e9d87c5df410706" FOREIGN KEY ("referrersId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_9591e8377235e9d87c5df410706"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "referrersId"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e1284059a0b034221ea26287d98" FOREIGN KEY ("referrerId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
