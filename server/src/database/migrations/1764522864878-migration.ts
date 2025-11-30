import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764522864878 implements MigrationInterface {
  name = 'Migration1764522864878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "store_products_product" ("storeId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_6a70b6d390b9b7de517e663daee" PRIMARY KEY ("storeId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd9295b4d48527fba940ec6d78" ON "store_products_product" ("storeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38a7d9de2649a18e9ea5d4d730" ON "store_products_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "store_products_product" ADD CONSTRAINT "FK_cd9295b4d48527fba940ec6d784" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_products_product" ADD CONSTRAINT "FK_38a7d9de2649a18e9ea5d4d7301" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store_products_product" DROP CONSTRAINT "FK_38a7d9de2649a18e9ea5d4d7301"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_products_product" DROP CONSTRAINT "FK_cd9295b4d48527fba940ec6d784"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38a7d9de2649a18e9ea5d4d730"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd9295b4d48527fba940ec6d78"`,
    );
    await queryRunner.query(`DROP TABLE "store_products_product"`);
  }
}
