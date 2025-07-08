import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { TournamentEvent } from '../entities/tournament-event.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(TournamentEvent)
    private tournamentEventsRepository: Repository<TournamentEvent>,
  ) {}

  async create(data: Partial<Tournament> & { events?: Partial<TournamentEvent>[] }) {
    const { events, ...tournamentData } = data;
    
    // Tạo giải đấu
    const tournament = this.tournamentsRepository.create(tournamentData);
    const savedTournament = await this.tournamentsRepository.save(tournament);
    
    // Tạo các nội dung thi đấu nếu có
    if (events && events.length > 0) {
      const tournamentEvents = events.map(eventData => 
        this.tournamentEventsRepository.create({
          ...eventData,
          tournamentId: savedTournament.id,
        })
      );
      await this.tournamentEventsRepository.save(tournamentEvents);
    }
    
    return this.findOne(savedTournament.id);
  }

  findAll() {
    return this.tournamentsRepository.find({
      where: { isApproved: true },
      relations: ['organizer', 'events'],
    });
  }

  findPendingApproval() {
    return this.tournamentsRepository.find({
      where: { isApproved: false },
      relations: ['organizer', 'events'],
    });
  }

  findOne(id: number) {
    return this.tournamentsRepository.findOne({
      where: { id },
      relations: ['organizer', 'events', 'events.registrations'],
    });
  }

  findByOrganizer(organizerId: number) {
    return this.tournamentsRepository.find({
      where: { organizerId },
      relations: ['organizer', 'events'],
    });
  }

  update(id: number, data: Partial<Tournament>) {
    return this.tournamentsRepository.update(id, data);
  }

  remove(id: number) {
    return this.tournamentsRepository.delete(id);
  }

  async approve(id: number) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    return this.tournamentsRepository.update(id, {
      isApproved: true,
      status: 'published' as any,
    });
  }

  async reject(id: number, reason?: string) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    return this.tournamentsRepository.update(id, {
      isApproved: false,
      status: 'rejected' as any,
    });
  }

  async requestMoreInfo(id: number, message?: string) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    return this.tournamentsRepository.update(id, {
      status: 'needs_info' as any,
    });
  }
} 