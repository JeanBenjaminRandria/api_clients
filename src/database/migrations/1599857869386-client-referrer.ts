import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientReferrer1599857869386 implements MigrationInterface {
  name = 'clientReferrer1599857869386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "rif" character varying(15) NOT NULL, "referrerId" integer NOT NULL, CONSTRAINT "UQ_25194b1743ec208a958f7564a64" UNIQUE ("rif"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_e1284059a0b034221ea26287d98" FOREIGN KEY ("referrerId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_e1284059a0b034221ea26287d98"`,
    );
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
