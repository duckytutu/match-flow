import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from '../entities/tournament.entity';
import { TournamentEvent } from '../entities/tournament-event.entity';
import { TournamentEventsModule } from '../tournament-events/tournament-events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentEvent]),
    TournamentEventsModule,
  ],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService],
})
export class TournamentsModule {} 