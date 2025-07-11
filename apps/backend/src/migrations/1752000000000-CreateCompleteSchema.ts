import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompleteSchema1752000000000 implements MigrationInterface {
    name = 'CreateCompleteSchema1752000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enums
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'organizer', 'referee', 'athlete', 'guest')`);
        await queryRunner.query(`CREATE TYPE "public"."tournaments_status_enum" AS ENUM('draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."tournament_events_type_enum" AS ENUM('singles_male', 'singles_female', 'doubles_male', 'doubles_female', 'doubles_mixed')`);
        await queryRunner.query(`CREATE TYPE "public"."tournament_events_status_enum" AS ENUM('not_started', 'in_progress', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."event_registrations_status_enum" AS ENUM('pending', 'approved', 'rejected', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."matches_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."matches_type_enum" AS ENUM('singles', 'doubles', 'mixed')`);

        // Create users table
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'guest', "isApproved" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "dateOfBirth" TIMESTAMP, "levelPoint" numeric(6,3), "pointSource" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);

        // Create tournaments table
        await queryRunner.query(`CREATE TABLE "tournaments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "location" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "status" "public"."tournaments_status_enum" NOT NULL DEFAULT 'draft', "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizerId" integer NOT NULL, CONSTRAINT "PK_3a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create tournament_events table
        await queryRunner.query(`CREATE TABLE "tournament_events" ("id" SERIAL NOT NULL, "type" "public"."tournament_events_type_enum" NOT NULL, "status" "public"."tournament_events_status_enum" NOT NULL DEFAULT 'not_started', "maxTeams" integer NOT NULL DEFAULT '0', "currentTeams" integer NOT NULL DEFAULT '0', "entryFee" numeric(10,2) NOT NULL DEFAULT '0', "prizes" character varying, "groupStagePoints" integer NOT NULL DEFAULT '11', "groupStageWinBy" integer NOT NULL DEFAULT '1', "groupStageMaxPoints" integer, "groupStageBo" integer NOT NULL DEFAULT '1', "knockoutStagePoints" integer NOT NULL DEFAULT '11', "knockoutStageWinBy" integer NOT NULL DEFAULT '1', "knockoutStageMaxPoints" integer, "knockoutStageBo" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tournamentId" integer NOT NULL, CONSTRAINT "PK_4a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create event_registrations table
        await queryRunner.query(`CREATE TABLE "event_registrations" ("id" SERIAL NOT NULL, "status" "public"."event_registrations_status_enum" NOT NULL DEFAULT 'pending', "notes" character varying, "paidAmount" numeric(10,2) NOT NULL DEFAULT '0', "isPaid" boolean NOT NULL DEFAULT false, "teammateId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_5a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create tournament_groups table
        await queryRunner.query(`CREATE TABLE "tournament_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "eventId" integer NOT NULL, "maxTeams" integer NOT NULL DEFAULT '0', "currentTeams" integer NOT NULL DEFAULT '0', "isCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create tournament_group_teams table
        await queryRunner.query(`CREATE TABLE "tournament_group_teams" ("id" SERIAL NOT NULL, "groupId" integer NOT NULL, "registrationId" integer NOT NULL, "matchesPlayed" integer NOT NULL DEFAULT '0', "matchesWon" integer NOT NULL DEFAULT '0', "matchesLost" integer NOT NULL DEFAULT '0', "points" integer NOT NULL DEFAULT '0', "setsWon" integer NOT NULL DEFAULT '0', "setsLost" integer NOT NULL DEFAULT '0', "gamesWon" integer NOT NULL DEFAULT '0', "gamesLost" integer NOT NULL DEFAULT '0', "position" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create matches table
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "matchNumber" integer NOT NULL, "status" "public"."matches_status_enum" NOT NULL DEFAULT 'scheduled', "type" "public"."matches_type_enum" NOT NULL DEFAULT 'singles', "scheduledTime" TIMESTAMP, "courtNumber" integer, "player1Name" character varying, "player2Name" character varying, "winner" character varying, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, "refereeId" integer, CONSTRAINT "PK_8a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Create scores table
        await queryRunner.query(`CREATE TABLE "scores" ("id" SERIAL NOT NULL, "setNumber" integer NOT NULL, "team1Score" integer NOT NULL, "team2Score" integer NOT NULL, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "matchId" integer NOT NULL, CONSTRAINT "PK_9a8c9c3b3b3b3b3b3b3b3b3b3b" PRIMARY KEY ("id"))`);

        // Add foreign key constraints
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_tournaments_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD CONSTRAINT "FK_tournament_events_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_teammate" FOREIGN KEY ("teammateId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_event" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_groups" ADD CONSTRAINT "FK_tournament_groups_event" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_group_teams" ADD CONSTRAINT "FK_tournament_group_teams_group" FOREIGN KEY ("groupId") REFERENCES "tournament_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_group_teams" ADD CONSTRAINT "FK_tournament_group_teams_registration" FOREIGN KEY ("registrationId") REFERENCES "event_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_matches_event" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_matches_referee" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_scores_match" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_scores_match"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_referee"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_event"`);
        await queryRunner.query(`ALTER TABLE "tournament_group_teams" DROP CONSTRAINT "FK_tournament_group_teams_registration"`);
        await queryRunner.query(`ALTER TABLE "tournament_group_teams" DROP CONSTRAINT "FK_tournament_group_teams_group"`);
        await queryRunner.query(`ALTER TABLE "tournament_groups" DROP CONSTRAINT "FK_tournament_groups_event"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_event"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_teammate"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_user"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP CONSTRAINT "FK_tournament_events_tournament"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_tournaments_organizer"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "scores"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TABLE "tournament_group_teams"`);
        await queryRunner.query(`DROP TABLE "tournament_groups"`);
        await queryRunner.query(`DROP TABLE "event_registrations"`);
        await queryRunner.query(`DROP TABLE "tournament_events"`);
        await queryRunner.query(`DROP TABLE "tournaments"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE "public"."matches_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."matches_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."event_registrations_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tournament_events_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tournament_events_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tournaments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
} 