import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupIdToMatch1752000000002 implements MigrationInterface {
    name = 'AddGroupIdToMatch1752000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_matches_group" FOREIGN KEY ("groupId") REFERENCES "tournament_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_group"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "groupId"`);
    }
} 