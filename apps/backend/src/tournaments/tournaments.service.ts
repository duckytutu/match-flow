import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  create(data: Partial<Tournament>) {
    const tournament = this.tournamentsRepository.create(data);
    return this.tournamentsRepository.save(tournament);
  }

  findAll() {
    return this.tournamentsRepository.find({
      where: { isApproved: true },
      relations: ['organizer'],
    });
  }

  findPendingApproval() {
    return this.tournamentsRepository.find({
      where: { isApproved: false },
      relations: ['organizer'],
    });
  }

  findOne(id: number) {
    return this.tournamentsRepository.findOne({
      where: { id },
      relations: ['organizer', 'registrations', 'matches'],
    });
  }

  findByOrganizer(organizerId: number) {
    return this.tournamentsRepository.find({
      where: { organizerId },
      relations: ['organizer', 'registrations'],
    });
  }

  update(id: number, data: Partial<Tournament>) {
    return this.tournamentsRepository.update(id, data);
  }

  remove(id: number) {
    return this.tournamentsRepository.delete(id);
  }

  async updateParticipantCount(id: number) {
    const tournament = await this.findOne(id);
    if (tournament) {
      const count = tournament.registrations?.length || 0;
      await this.update(id, { currentParticipants: count });
    }
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