import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTeamColumnFromScores1752000000001 implements MigrationInterface {
    name = 'RemoveTeamColumnFromScores1752000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove the team column from scores table if it exists
        await queryRunner.query(`ALTER TABLE "scores" DROP COLUMN IF EXISTS "team"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add the team column back if needed (though we don't want it)
        // This is just for migration rollback purposes
        await queryRunner.query(`ALTER TABLE "scores" ADD COLUMN IF NOT EXISTS "team" character varying`);
    }
} 