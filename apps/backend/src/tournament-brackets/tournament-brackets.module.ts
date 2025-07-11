import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentBracketsService } from './tournament-brackets.service';
import { TournamentBracketsController } from './tournament-brackets.controller';
import { TournamentEvent } from '../entities/tournament-event.entity';
import { TournamentGroup } from '../entities/tournament-group.entity';
import { TournamentGroupTeam } from '../entities/tournament-group-team.entity';
import { EventRegistration } from '../entities/event-registration.entity';
import { Match } from '../entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TournamentEvent,
      TournamentGroup,
      TournamentGroupTeam,
      EventRegistration,
      Match,
    ]),
  ],
  providers: [TournamentBracketsService],
  controllers: [TournamentBracketsController],
  exports: [TournamentBracketsService],
})
export class TournamentBracketsModule {} 