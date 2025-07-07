import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  create(data: Partial<Score>) {
    const score = this.scoresRepository.create(data);
    return this.scoresRepository.save(score);
  }

  findAll() {
    return this.scoresRepository.find({
      relations: ['match'],
    });
  }

  findOne(id: number) {
    return this.scoresRepository.findOne({
      where: { id },
      relations: ['match'],
    });
  }

  findByMatch(matchId: number) {
    return this.scoresRepository.find({
      where: { matchId },
      order: { setNumber: 'ASC' },
    });
  }

  update(id: number, data: Partial<Score>) {
    return this.scoresRepository.update(id, data);
  }

  remove(id: number) {
    return this.scoresRepository.delete(id);
  }

  async addScore(data: Partial<Score>) {
    return this.create(data);
  }

  async updateScore(id: number, data: Partial<Score>) {
    return this.update(id, data);
  }
} 