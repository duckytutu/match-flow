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
      relations: ['tournament', 'registrations'] 
    });
  }

  findByTournament(tournamentId: number) {
    return this.tournamentEventsRepository.find({ 
      where: { tournamentId }, 
      relations: ['registrations'] 
    });
  }

  update(id: number, data: Partial<TournamentEvent>) {
    return this.tournamentEventsRepository.update(id, data);
  }

  remove(id: number) {
    return this.tournamentEventsRepository.delete(id);
  }
} 