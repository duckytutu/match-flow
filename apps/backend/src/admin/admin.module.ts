import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Tournament } from '../entities/tournament.entity';
import { User } from '../entities/user.entity';
// import { Registration } from '../entities/registration.entity';
import { EventRegistration } from '../entities/event-registration.entity';
import { TournamentEvent } from '../entities/tournament-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, User, EventRegistration, TournamentEvent])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {} 