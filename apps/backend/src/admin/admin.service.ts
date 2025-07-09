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
    const [tournaments, users, eventRegistrations, events, pendingUsers, pendingTournaments] = await Promise.all([
      this.tournamentsRepository.count(),
      this.usersRepository.count(),
      this.eventRegistrationsRepository.count(),
      this.tournamentEventsRepository.count(),
      this.usersRepository.count({ where: { isApproved: false } }),
      this.tournamentsRepository.count({ where: { isApproved: false } }),
    ]);

    return {
      tournaments,
      users,
      eventRegistrations,
      events,
      pendingUsers,
      pendingTournaments,
    };
  }

  async getPendingApprovals() {
    const [pendingTournaments, pendingUsers] = await Promise.all([
      this.tournamentsRepository.find({
        where: { isApproved: false },
        relations: ['organizer'],
      }),
      this.usersRepository.find({
        where: { isApproved: false },
      }),
    ]);

    return {
      tournaments: pendingTournaments,
      users: pendingUsers,
    };
  }

  async getPendingUsers() {
    return await this.usersRepository.find({
      where: { isApproved: false },
      order: { createdAt: 'DESC' },
    });
  }

  async approveUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    user.isApproved = true;
    return await this.usersRepository.save(user);
  }

  async rejectUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Optionally, you could delete the user or mark them as rejected
    // For now, we'll just delete the user
    return await this.usersRepository.remove(user);
  }
} 