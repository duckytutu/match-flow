import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentEvent } from '../entities/tournament-event.entity';

@Injectable()
export class TournamentEventsService {
  constructor(
    @InjectRepository(TournamentEvent)
    private tournamentEventsRepository: Repository<TournamentEvent>,
  ) {}

  create(data: Partial<TournamentEvent>) {
    const event = this.tournamentEventsRepository.create(data);
    return this.tournamentEventsRepository.save(event);
  }

  findAll() {
    return this.tournamentEventsRepository.find({ relations: ['tournament'] });
  }

  findOne(id: number) {
    return this.tournamentEventsRepository.findOne({ 
      where: { id }, 
      relations: ['tournament', 'registrations', 'registrations.user', 'registrations.teammate'] 
    });
  }

  findByTournament(tournamentId: number) {
    return this.tournamentEventsRepository.find({ 
      where: { tournamentId }, 
      relations: ['registrations', 'registrations.user', 'registrations.teammate'] 
    });
  }



  update(id: number, data: Partial<TournamentEvent>) {
    return this.tournamentEventsRepository.update(id, data);
  }

  remove(id: number) {
    return this.tournamentEventsRepository.delete(id);
  }

  async updateCurrentTeams(eventId: number) {
    // Đếm số đăng ký đã được phê duyệt cho event này
    const approvedRegistrations = await this.tournamentEventsRepository
      .createQueryBuilder('event')
      .leftJoin('event.registrations', 'registration')
      .where('event.id = :eventId', { eventId })
      .andWhere('registration.status = :status', { status: 'approved' })
      .getCount();

    // Cập nhật currentTeams
    await this.tournamentEventsRepository.update(eventId, { currentTeams: approvedRegistrations });
    

    return this.findOne(eventId);
  }
} 