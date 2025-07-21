import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { Match } from '../entities/match.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  // Thêm điểm cho một set mới
  async addSetScore(matchId: number, setNumber: number, team1Score: number, team2Score: number, notes?: string) {
    // Kiểm tra xem set này đã tồn tại chưa
    const existingScore = await this.scoresRepository.findOne({
      where: { matchId, setNumber },
    });

    if (existingScore) {
      // Nếu set đã tồn tại, cập nhật điểm
      return this.update(existingScore.id, {
        team1Score,
        team2Score,
        notes,
      });
    } else {
      // Nếu set chưa tồn tại, tạo mới
      const scoreData = {
        matchId,
        setNumber,
        team1Score,
        team2Score,
        notes,
      };
      return this.create(scoreData);
    }
  }

  // Thêm điểm cho một set mới (cho athlete - với kiểm tra quyền)
  async addSetScoreForAthlete(matchId: number, setNumber: number, team1Score: number, team2Score: number, notes: string | undefined, athleteId: number) {
    // Kiểm tra xem athlete có tham gia trận đấu này không
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Lấy thông tin athlete
    const athlete = await this.userRepository.findOne({
      where: { id: athleteId },
    });

    if (!athlete) {
      throw new Error('Athlete not found');
    }

    const athleteFullName = `${athlete.firstName} ${athlete.lastName}`;

    // Kiểm tra xem athlete có phải là player1 hoặc player2 trong trận đấu này không
    if (match.player1Name !== athleteFullName && match.player2Name !== athleteFullName) {
      throw new Error('Athlete is not participating in this match');
    }

    // Kiểm tra xem set này đã tồn tại chưa
    const existingScore = await this.scoresRepository.findOne({
      where: { matchId, setNumber },
    });

    if (existingScore) {
      // Nếu set đã tồn tại, cập nhật điểm
      return this.update(existingScore.id, {
        team1Score,
        team2Score,
        notes,
      });
    } else {
      // Nếu set chưa tồn tại, tạo mới
      const scoreData = {
        matchId,
        setNumber,
        team1Score,
        team2Score,
        notes,
      };
      return this.create(scoreData);
    }
  }

  // Cập nhật điểm của một set
  async updateSetScore(scoreId: number, team1Score: number, team2Score: number, notes?: string) {
    return this.update(scoreId, {
      team1Score,
      team2Score,
      notes,
    });
  }

  // Cập nhật điểm của một set (cho athlete - với kiểm tra quyền)
  async updateSetScoreForAthlete(scoreId: number, team1Score: number, team2Score: number, notes: string | undefined, athleteId: number) {
    // Lấy thông tin score
    const score = await this.findOne(scoreId);
    if (!score) {
      throw new Error('Score not found');
    }

    // Lấy thông tin match
    const match = await this.matchRepository.findOne({
      where: { id: score.matchId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Lấy thông tin athlete
    const athlete = await this.userRepository.findOne({
      where: { id: athleteId },
    });

    if (!athlete) {
      throw new Error('Athlete not found');
    }

    const athleteFullName = `${athlete.firstName} ${athlete.lastName}`;

    // Kiểm tra xem athlete có phải là player1 hoặc player2 trong trận đấu này không
    if (match.player1Name !== athleteFullName && match.player2Name !== athleteFullName) {
      throw new Error('Athlete is not participating in this match');
    }

    // Nếu có quyền, cập nhật điểm
    return this.update(scoreId, {
      team1Score,
      team2Score,
      notes,
    });
  }

  // Lấy tổng điểm của một trận đấu
  async getMatchTotalScore(matchId: number) {
    const scores = await this.findByMatch(matchId);
    
    const totalScore = scores.reduce((acc, score) => {
      acc.team1Total += score.team1Score;
      acc.team2Total += score.team2Score;
      return acc;
    }, { team1Total: 0, team2Total: 0 });

    return {
      ...totalScore,
      sets: scores.length,
      scores: scores,
    };
  }

  // Xóa tất cả điểm của một trận đấu
  async removeAllMatchScores(matchId: number) {
    return this.scoresRepository.delete({ matchId });
  }
} 