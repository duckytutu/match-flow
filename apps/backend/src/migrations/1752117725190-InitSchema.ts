import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1752117725190 implements MigrationInterface {
    name = 'InitSchema1752117725190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_registrations_status_enum" AS ENUM('pending', 'approved', 'rejected', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "event_registrations" ("id" SERIAL NOT NULL, "status" "public"."event_registrations_status_enum" NOT NULL DEFAULT 'pending', "teamName" character varying, "notes" character varying, "paidAmount" numeric(10,2) NOT NULL DEFAULT '0', "isPaid" boolean NOT NULL DEFAULT false, "teammateId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_953d3b862c2487289a92b2356e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scores" ("id" SERIAL NOT NULL, "setNumber" integer NOT NULL, "team1Score" integer NOT NULL, "team2Score" integer NOT NULL, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "matchId" integer NOT NULL, CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."matches_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."matches_type_enum" AS ENUM('singles', 'doubles', 'mixed')`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "matchNumber" integer NOT NULL, "status" "public"."matches_status_enum" NOT NULL DEFAULT 'scheduled', "type" "public"."matches_type_enum" NOT NULL DEFAULT 'singles', "scheduledTime" TIMESTAMP, "courtNumber" integer, "player1Name" character varying, "player2Name" character varying, "player3Name" character varying, "player4Name" character varying, "winner" character varying, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, "refereeId" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tournament_events_type_enum" AS ENUM('singles_male', 'singles_female', 'doubles_male', 'doubles_female', 'doubles_mixed')`);
        await queryRunner.query(`CREATE TABLE "tournament_events" ("id" SERIAL NOT NULL, "type" "public"."tournament_events_type_enum" NOT NULL, "maxTeams" integer NOT NULL DEFAULT '0', "currentTeams" integer NOT NULL DEFAULT '0', "entryFee" numeric(10,2) NOT NULL DEFAULT '0', "prizes" character varying, "groupStagePoints" integer NOT NULL DEFAULT '11', "groupStageWinBy" integer NOT NULL DEFAULT '1', "groupStageMaxPoints" integer, "groupStageBo" integer NOT NULL DEFAULT '1', "knockoutStagePoints" integer NOT NULL DEFAULT '11', "knockoutStageWinBy" integer NOT NULL DEFAULT '1', "knockoutStageMaxPoints" integer, "knockoutStageBo" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tournamentId" integer NOT NULL, CONSTRAINT "PK_5c9f48727b4ecc11dc246a88207" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tournaments_status_enum" AS ENUM('draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "tournaments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "location" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "status" "public"."tournaments_status_enum" NOT NULL DEFAULT 'draft', "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizerId" integer NOT NULL, CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'organizer', 'referee', 'athlete', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'guest', "isApproved" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "dateOfBirth" TIMESTAMP, "levelPoint" numeric(6,3), "pointSource" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_7a072346484fe1d7ee0fb9dfaa8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_de8325236709e604cfeb89f2767" FOREIGN KEY ("teammateId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_e4e6dce237a527e4515f3d430f1" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_9012285dd168d361368836fa967" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_8ddca333705212c040b3c5a9329" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_a340edef01c63f37ddc66e3d3ec" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD CONSTRAINT "FK_6ba432b3e70752ee36ca7b60030" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_56d61850223447c3b8900979dec" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_56d61850223447c3b8900979dec"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP CONSTRAINT "FK_6ba432b3e70752ee36ca7b60030"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_a340edef01c63f37ddc66e3d3ec"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_8ddca333705212c040b3c5a9329"`);
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_9012285dd168d361368836fa967"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_e4e6dce237a527e4515f3d430f1"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_de8325236709e604cfeb89f2767"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_7a072346484fe1d7ee0fb9dfaa8"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "tournaments"`);
        await queryRunner.query(`DROP TYPE "public"."tournaments_status_enum"`);
        await queryRunner.query(`DROP TABLE "tournament_events"`);
        await queryRunner.query(`DROP TYPE "public"."tournament_events_type_enum"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TYPE "public"."matches_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."matches_status_enum"`);
        await queryRunner.query(`DROP TABLE "scores"`);
        await queryRunner.query(`DROP TABLE "event_registrations"`);
        await queryRunner.query(`DROP TYPE "public"."event_registrations_status_enum"`);
    }

}
