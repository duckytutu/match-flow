import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from '../entities/match.entity';
import { TournamentEvent } from '../entities/tournament-event.entity';
import { User, UserRole } from '../entities/user.entity';
import { TournamentGroup } from '../entities/tournament-group.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(TournamentEvent)
    private eventRepository: Repository<TournamentEvent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(data: Partial<Match>) {
    const match = this.matchesRepository.create(data);
    return this.matchesRepository.save(match);
  }

  findAll() {
    return this.matchesRepository.find({
      relations: ['event', 'event.tournament', 'referee', 'scores'],
    });
  }

  findOne(id: number) {
    return this.matchesRepository.findOne({
      where: { id },
      relations: ['event', 'event.tournament', 'referee', 'scores'],
    });
  }

  findByTournament(tournamentId: number) {
    return this.matchesRepository.find({
      where: { event: { tournamentId } },
      relations: ['event', 'referee', 'scores'],
      order: { matchNumber: 'ASC' },
    });
  }

  findByEvent(eventId: number) {
    return this.matchesRepository.find({
      where: { eventId },
      relations: ['referee', 'scores'],
      order: { matchNumber: 'ASC' },
    });
  }

  findByReferee(refereeId: number) {
    return this.matchesRepository.find({
      where: { refereeId },
      relations: ['event', 'event.tournament', 'scores'],
      order: { scheduledTime: 'ASC' },
    });
  }

  async findByAthlete(athleteId: number) {
    // Lấy thông tin user để có tên đầy đủ
    const user = await this.userRepository.findOne({
      where: { id: athleteId },
    });

    if (!user) {
      return [];
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    return this.matchesRepository.find({
      where: [
        { player1Name: fullName },
        { player2Name: fullName }
      ],
      relations: ['event', 'event.tournament', 'referee', 'scores'],
      order: { scheduledTime: 'ASC' },
    });
  }

  // Lấy danh sách trận đấu được group theo bảng
  async findMatchesByGroups(eventId: number) {
    // Lấy tất cả group của event
    const groups = await this.eventRepository.manager.getRepository(TournamentGroup).find({
      where: { eventId },
      order: { name: 'ASC' },
    });
    // Lấy tất cả match của event, kèm group
    const matches = await this.matchesRepository.find({
      where: { eventId },
      relations: ['referee', 'scores', 'group'],
      order: { matchNumber: 'ASC' },
    });
    // Group theo groupId
    const groupedMatches = groups.map(group => ({
      groupId: group.id,
      groupName: group.name,
      matches: matches.filter(m => m.groupId === group.id),
    }));
    return groupedMatches;
  }

  // Lấy danh sách người dùng có thể làm trọng tài cho một event
  async getAvailableReferees(eventId: number, excludeMatchId?: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['tournament'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Lấy thông tin trận đấu cần loại trừ (nếu có)
    let excludePlayerNames: string[] = [];
    if (excludeMatchId) {
      const match = await this.matchesRepository.findOne({
        where: { id: excludeMatchId },
      });
      
      if (match) {
        // Lấy tên của các vận động viên tham gia trận đấu này
        if (match.player1Name) excludePlayerNames.push(match.player1Name);
        if (match.player2Name) excludePlayerNames.push(match.player2Name);
      }
    }

    // Lấy tất cả người dùng có role referee hoặc athlete trong cùng giải đấu
    const users = await this.userRepository.find({
      where: [
        { role: UserRole.REFEREE },
        { role: UserRole.ATHLETE }
      ],
      relations: ['eventRegistrations'],
    });

    // Lọc những người đã đăng ký tham gia giải đấu này và không phải vận động viên thi đấu
    const availableReferees = users.filter(user => {
      // Loại trừ vận động viên thi đấu trong trận đấu này
      const fullName = `${user.firstName} ${user.lastName}`;
      if (excludePlayerNames.includes(fullName)) {
        return false;
      }
      
      // Chỉ bao gồm referee hoặc athlete đã đăng ký tham gia giải đấu
      return user.eventRegistrations.some(reg => 
        reg.eventId === eventId && reg.status === 'approved'
      ) || user.role === UserRole.REFEREE;
    });

    return availableReferees;
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

  async updateMatchStatus(matchId: number, status: MatchStatus) {
    return this.update(matchId, { status });
  }

  // Bắt đầu trận đấu
  async startMatch(matchId: number) {
    return this.update(matchId, { status: MatchStatus.IN_PROGRESS });
  }

  // Lấy trận đấu theo trạng thái
  async findMatchesByStatus(status: MatchStatus) {
    return this.matchesRepository.find({
      where: { status },
      relations: ['event', 'event.tournament', 'referee', 'scores'],
      order: { scheduledTime: 'ASC' },
    });
  }
} 