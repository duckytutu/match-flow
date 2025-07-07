import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from '../entities/registration.entity';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    private tournamentsService: TournamentsService,
  ) {}

  create(data: Partial<Registration>) {
    const registration = this.registrationsRepository.create(data);
    return this.registrationsRepository.save(registration);
  }

  findAll() {
    return this.registrationsRepository.find({
      relations: ['user', 'tournament'],
    });
  }

  findOne(id: number) {
    return this.registrationsRepository.findOne({
      where: { id },
      relations: ['user', 'tournament'],
    });
  }

  findByTournament(tournamentId: number) {
    return this.registrationsRepository.find({
      where: { tournamentId },
      relations: ['user'],
    });
  }

  findByUser(userId: number) {
    return this.registrationsRepository.find({
      where: { userId },
      relations: ['tournament'],
    });
  }

  update(id: number, data: Partial<Registration>) {
    return this.registrationsRepository.update(id, data);
  }

  remove(id: number) {
    return this.registrationsRepository.delete(id);
  }

  async registerForTournament(data: Partial<Registration>) {
    const registration = await this.create(data);
    if (data.tournamentId) {
      await this.tournamentsService.updateParticipantCount(data.tournamentId);
    }
    return registration;
  }
} 