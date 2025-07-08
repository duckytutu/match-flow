import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { User } from '../entities/user.entity';
// import { Registration } from '../entities/registration.entity';
import { EventRegistration } from '../entities/event-registration.entity';
import { TournamentEvent } from '../entities/tournament-event.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // @InjectRepository(Registration)
    // private registrationsRepository: Repository<Registration>,
    @InjectRepository(EventRegistration)
    private eventRegistrationsRepository: Repository<EventRegistration>,
    @InjectRepository(TournamentEvent)
    private tournamentEventsRepository: Repository<TournamentEvent>,
  ) {}

  async getDashboardStats() {
    const [tournaments, users, eventRegistrations, events] = await Promise.all([
      this.tournamentsRepository.count(),
      this.usersRepository.count(),
      this.eventRegistrationsRepository.count(),
      this.tournamentEventsRepository.count(),
    ]);

    return {
      tournaments,
      users,
      eventRegistrations,
      events,
    };
  }

  async getPendingApprovals() {
    const pendingTournaments = await this.tournamentsRepository.find({
      where: { isApproved: false },
      relations: ['organizer'],
    });

    return {
      tournaments: pendingTournaments,
    };
  }
} 