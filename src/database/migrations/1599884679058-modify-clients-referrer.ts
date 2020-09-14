import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyClientsReferrer1599884679058 implements MigrationInterface {
  name = 'modifyClientsReferrer1599884679058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_e1284059a0b034221ea26287d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ALTER COLUMN "referrerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_e1284059a0b034221ea26287d98" FOREIGN KEY ("referrerId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_e1284059a0b034221ea26287d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ALTER COLUMN "referrerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_e1284059a0b034221ea26287d98" FOREIGN KEY ("referrerId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
