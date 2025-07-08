import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTournamentEvents1700000000000 implements MigrationInterface {
  name = 'AddTournamentEvents1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tournament_events table
    await queryRunner.query(`
      CREATE TYPE "public"."tournament_events_type_enum" AS ENUM(
        'singles_male', 'singles_female', 'doubles_male', 'doubles_female', 'doubles_mixed', 'team'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."tournament_events_status_enum" AS ENUM(
        'draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tournament_events" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "type" "public"."tournament_events_type_enum" NOT NULL,
        "status" "public"."tournament_events_status_enum" NOT NULL DEFAULT 'draft',
        "maxParticipants" integer NOT NULL DEFAULT '0',
        "currentParticipants" integer NOT NULL DEFAULT '0',
        "entryFee" decimal(10,2) NOT NULL DEFAULT '0',
        "rules" character varying,
        "prizes" character varying,
        "startDate" TIMESTAMP,
        "endDate" TIMESTAMP,
        "minTeamSize" integer NOT NULL DEFAULT '1',
        "maxTeamSize" integer NOT NULL DEFAULT '2',
        "isApproved" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "tournamentId" integer NOT NULL,
        CONSTRAINT "PK_tournament_events" PRIMARY KEY ("id")
      )
    `);

    // Create event_registrations table
    await queryRunner.query(`
      CREATE TYPE "public"."event_registrations_status_enum" AS ENUM(
        'pending', 'approved', 'rejected', 'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "event_registrations" (
        "id" SERIAL NOT NULL,
        "status" "public"."event_registrations_status_enum" NOT NULL DEFAULT 'pending',
        "teamName" character varying,
        "notes" character varying,
        "paidAmount" decimal(10,2) NOT NULL DEFAULT '0',
        "isPaid" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer NOT NULL,
        "eventId" integer NOT NULL,
        "teamMembers" text,
        CONSTRAINT "PK_event_registrations" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "tournament_events" 
      ADD CONSTRAINT "FK_tournament_events_tournament" 
      FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "event_registrations" 
      ADD CONSTRAINT "FK_event_registrations_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "event_registrations" 
      ADD CONSTRAINT "FK_event_registrations_event" 
      FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Update matches table to reference events instead of tournaments
    // await queryRunner.query(`
    //   ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_tournament"
    // `);

    await queryRunner.query(`
      ALTER TABLE "matches" DROP COLUMN "tournamentId"
    `);

    await queryRunner.query(`
      ALTER TABLE "matches" ADD "eventId" integer NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "matches" 
      ADD CONSTRAINT "FK_matches_event" 
      FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Remove type column from tournaments table
    await queryRunner.query(`
      ALTER TABLE "tournaments" DROP COLUMN "type"
    `);

    // Drop old enum
    await queryRunner.query(`
      DROP TYPE "public"."tournaments_type_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert matches table changes
    await queryRunner.query(`
      ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_event"
    `);

    await queryRunner.query(`
      ALTER TABLE "matches" DROP COLUMN "eventId"
    `);

    await queryRunner.query(`
      ALTER TABLE "matches" ADD "tournamentId" integer NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "matches" 
      ADD CONSTRAINT "FK_matches_tournament" 
      FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Recreate tournaments type enum and column
    await queryRunner.query(`
      CREATE TYPE "public"."tournaments_type_enum" AS ENUM('singles', 'doubles', 'mixed')
    `);

    await queryRunner.query(`
      ALTER TABLE "tournaments" ADD "type" "public"."tournaments_type_enum" NOT NULL DEFAULT 'singles'
    `);

    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_event"
    `);

    await queryRunner.query(`
      ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_events" DROP CONSTRAINT "FK_tournament_events_tournament"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "event_registrations"`);
    await queryRunner.query(`DROP TABLE "tournament_events"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "public"."event_registrations_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tournament_events_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tournament_events_type_enum"`);
  }
} 