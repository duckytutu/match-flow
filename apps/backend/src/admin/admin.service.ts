import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Tournament } from '../entities/tournament.entity';
import { Registration } from '../entities/registration.entity';
import { Match } from '../entities/match.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async getStats() {
    const [
      totalUsers,
      totalTournaments,
      totalRegistrations,
      totalMatches,
      pendingApprovals,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.tournamentsRepository.count(),
      this.registrationsRepository.count(),
      this.matchesRepository.count(),
      this.usersRepository.count({ where: { isApproved: false } }),
    ]);

    return {
      totalUsers,
      totalTournaments,
      totalRegistrations,
      totalMatches,
      pendingApprovals,
    };
  }
} 