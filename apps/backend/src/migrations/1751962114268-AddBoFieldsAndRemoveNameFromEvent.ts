import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBoFieldsAndRemoveNameFromEvent1751962114268 implements MigrationInterface {
    name = 'AddBoFieldsAndRemoveNameFromEvent1751962114268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "isApproved"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "groupStageBo" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "knockoutStageBo" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "knockoutStageBo"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "groupStageBo"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "isApproved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "name" character varying NOT NULL`);
    }

}
