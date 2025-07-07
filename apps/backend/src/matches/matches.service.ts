import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  create(data: Partial<Match>) {
    const match = this.matchesRepository.create(data);
    return this.matchesRepository.save(match);
  }

  findAll() {
    return this.matchesRepository.find({
      relations: ['tournament', 'referee', 'scores'],
    });
  }

  findOne(id: number) {
    return this.matchesRepository.findOne({
      where: { id },
      relations: ['tournament', 'referee', 'scores'],
    });
  }

  findByTournament(tournamentId: number) {
    return this.matchesRepository.find({
      where: { tournamentId },
      relations: ['referee', 'scores'],
      order: { matchNumber: 'ASC' },
    });
  }

  findByReferee(refereeId: number) {
    return this.matchesRepository.find({
      where: { refereeId },
      relations: ['tournament', 'scores'],
    });
  }

  update(id: number, data: Partial<Match>) {
    return this.matchesRepository.update(id, data);
  }

  remove(id: number) {
    return this.matchesRepository.delete(id);
  }

  async assignReferee(matchId: number, refereeId: number) {
    return this.update(matchId, { refereeId });
  }

  async updateMatchStatus(matchId: number, status: any) {
    return this.update(matchId, { status });
  }
} 