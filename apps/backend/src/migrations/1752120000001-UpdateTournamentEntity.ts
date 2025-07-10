import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTournamentEntity1752120000001 implements MigrationInterface {
    name = 'UpdateTournamentEntity1752120000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop columns that are no longer needed
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN IF EXISTS "currentParticipants"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN IF EXISTS "maxParticipants"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN IF EXISTS "entryFee"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN IF EXISTS "type"`);
        
        // Drop teamName column from event_registrations
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP COLUMN IF EXISTS "teamName"`);
        
        // Keep only endDate column (already exists from previous migration)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore columns if needed to rollback
        await queryRunner.query(`ALTER TABLE "tournaments" ADD COLUMN "currentParticipants" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD COLUMN "maxParticipants" integer`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD COLUMN "entryFee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD COLUMN "type" character varying`);
        
        // Restore teamName column to event_registrations
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD COLUMN "teamName" character varying`);
    }
} 