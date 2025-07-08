import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTournamentEventStatus1751951168333 implements MigrationInterface {
    name = 'UpdateTournamentEventStatus1751951168333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_user"`);
        // await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_event"`);
        // await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_matches_event"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP CONSTRAINT "FK_tournament_events_tournament"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tournament_events_status_enum"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "maxParticipants"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "currentParticipants"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "rules"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "startDate"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "endDate"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "minTeamSize"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "maxTeamSize"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "isApproved"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "endDate"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "maxParticipants"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "currentParticipants"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "entryFee"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "rules"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "prizes"`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "maxTeams" integer NOT NULL DEFAULT '0'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "currentTeams" integer NOT NULL DEFAULT '0'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "groupStagePoints" integer NOT NULL DEFAULT '11'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "groupStageWinBy" integer NOT NULL DEFAULT '1'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "groupStageMaxPoints" integer`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "knockoutStagePoints" integer NOT NULL DEFAULT '11'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "knockoutStageWinBy" integer NOT NULL DEFAULT '1'`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD "knockoutStageMaxPoints" integer`);
        // await queryRunner.query(`ALTER TYPE "public"."tournament_events_type_enum" RENAME TO "tournament_events_type_enum_old"`);
        // await queryRunner.query(`CREATE TYPE "public"."tournament_events_type_enum" AS ENUM('singles_male', 'singles_female', 'doubles_male', 'doubles_female', 'doubles_mixed')`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ALTER COLUMN "type" TYPE "public"."tournament_events_type_enum" USING "type"::"text"::"public"."tournament_events_type_enum"`);
        // await queryRunner.query(`DROP TYPE "public"."tournament_events_type_enum_old"`);
        // await queryRunner.query(`ALTER TABLE "tournaments" ALTER COLUMN "description" DROP NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_7a072346484fe1d7ee0fb9dfaa8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_e4e6dce237a527e4515f3d430f1" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_8ddca333705212c040b3c5a9329" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "tournament_events" ADD CONSTRAINT "FK_6ba432b3e70752ee36ca7b60030" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP CONSTRAINT "FK_6ba432b3e70752ee36ca7b60030"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_8ddca333705212c040b3c5a9329"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_e4e6dce237a527e4515f3d430f1"`);
        await queryRunner.query(`ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_7a072346484fe1d7ee0fb9dfaa8"`);
        await queryRunner.query(`ALTER TABLE "tournaments" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."tournament_events_type_enum_old" AS ENUM('singles_male', 'singles_female', 'doubles_male', 'doubles_female', 'doubles_mixed', 'team')`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ALTER COLUMN "type" TYPE "public"."tournament_events_type_enum_old" USING "type"::"text"::"public"."tournament_events_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."tournament_events_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tournament_events_type_enum_old" RENAME TO "tournament_events_type_enum"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "knockoutStageMaxPoints"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "knockoutStageWinBy"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "knockoutStagePoints"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "groupStageMaxPoints"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "groupStageWinBy"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "groupStagePoints"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "currentTeams"`);
        await queryRunner.query(`ALTER TABLE "tournament_events" DROP COLUMN "maxTeams"`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "prizes" character varying`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "rules" character varying`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "entryFee" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "currentParticipants" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "maxParticipants" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "isApproved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "maxTeamSize" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "minTeamSize" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "endDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "rules" character varying`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "currentParticipants" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "maxParticipants" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."tournament_events_status_enum" AS ENUM('draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD "status" "public"."tournament_events_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "tournament_events" ADD CONSTRAINT "FK_tournament_events_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_matches_event" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_event" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
