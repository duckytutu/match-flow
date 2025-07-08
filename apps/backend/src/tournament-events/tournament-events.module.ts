import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEventsService } from './tournament-events.service';
import { TournamentEventsController } from './tournament-events.controller';
import { TournamentEvent } from '../entities/tournament-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEvent])],
  providers: [TournamentEventsService],
  controllers: [TournamentEventsController],
  exports: [TournamentEventsService],
})
export class TournamentEventsModule {} 