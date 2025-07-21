import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentEvent, EventStatus } from '../entities/tournament-event.entity';
import { TournamentGroup } from '../entities/tournament-group.entity';
import { TournamentGroupTeam } from '../entities/tournament-group-team.entity';
import { EventRegistration } from '../entities/event-registration.entity';
import { Match, MatchType, MatchStatus } from '../entities/match.entity';

interface TeamWithLevel {
  registration: EventRegistration;
  totalLevel: number;
  player1Level: number;
  player2Level?: number; // undefined nếu team chỉ có 1 người
}

@Injectable()
export class TournamentBracketsService {
  constructor(
    @InjectRepository(TournamentEvent)
    private tournamentEventsRepository: Repository<TournamentEvent>,
    @InjectRepository(TournamentGroup)
    private tournamentGroupsRepository: Repository<TournamentGroup>,
    @InjectRepository(TournamentGroupTeam)
    private tournamentGroupTeamsRepository: Repository<TournamentGroupTeam>,
    @InjectRepository(EventRegistration)
    private eventRegistrationsRepository: Repository<EventRegistration>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  /**
   * Bắt đầu giải đấu - chia bảng và tạo matches
   */
  async startTournament(eventId: number) {
    // Lấy thông tin event
    const event = await this.tournamentEventsRepository.findOne({
      where: { id: eventId },
      relations: ['registrations', 'registrations.user', 'registrations.teammate'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Kiểm tra xem event đã đầy đủ đội chưa
    if (event.currentTeams < event.maxTeams) {
      throw new Error(`Event needs ${event.maxTeams} teams, but only has ${event.currentTeams}`);
    }

    // Integrity check: ensure no athlete appears in more than one registration for this event
    const userIdCount: Record<number, number> = {};
    for (const reg of event.registrations) {
      userIdCount[reg.userId] = (userIdCount[reg.userId] || 0) + 1;
      if (reg.teammateId) {
        userIdCount[reg.teammateId] = (userIdCount[reg.teammateId] || 0) + 1;
      }
    }
    const duplicateUserIds = Object.entries(userIdCount).filter(([_, count]) => count > 1);
    if (duplicateUserIds.length > 0) {
      const ids = duplicateUserIds.map(([id]) => id).join(', ');
      throw new Error(`Data integrity error: Athlete(s) with userId(s) ${ids} appear in multiple registrations for this event.`);
    }

    // Lấy danh sách các đội đã được approve
    const approvedRegistrations = event.registrations.filter(
      reg => reg.status === 'approved'
    );

    // Tính toán điểm trình độ cho từng đội
    const teamsWithLevel: TeamWithLevel[] = approvedRegistrations.map(registration => {
      const player1Level = registration.user.levelPoint || 3.0;
      let player2Level: number | undefined;
      let totalLevel = player1Level;

      if (registration.teammateId && registration.teammate) {
        player2Level = registration.teammate.levelPoint || 3.0;
        totalLevel = (player1Level + player2Level) / 2; // Trung bình điểm trình độ cho team đôi
      }
      // Nếu không có teammate, totalLevel = player1Level (không cần default 3.0)

      return {
        registration,
        totalLevel,
        player1Level,
        player2Level,
      };
    });

    // Sắp xếp theo điểm trình độ (cao nhất trước)
    teamsWithLevel.sort((a, b) => b.totalLevel - a.totalLevel);

    // Chia bảng
    const groups = await this.createGroups(eventId, teamsWithLevel);

    // Tạo matches cho vòng bảng
    await this.createGroupStageMatches(groups);

    // Cập nhật status của event thành IN_PROGRESS
    await this.tournamentEventsRepository.update(eventId, { status: EventStatus.IN_PROGRESS });

    return {
      message: 'Tournament started successfully',
      groups: groups.length,
      totalTeams: teamsWithLevel.length,
    };
  }

  /**
   * Tạo các bảng đấu
   */
  private async createGroups(eventId: number, teams: TeamWithLevel[]): Promise<TournamentGroup[]> {
    const maxTeamsPerGroup = 4;
    const numGroups = Math.ceil(teams.length / maxTeamsPerGroup);
    const groups: TournamentGroup[] = [];

    // Tạo các bảng
    for (let i = 0; i < numGroups; i++) {
      const groupName = String.fromCharCode(65 + i); // A, B, C, D...
      
      const group = this.tournamentGroupsRepository.create({
        name: groupName,
        eventId,
        maxTeams: maxTeamsPerGroup,
        currentTeams: 0,
        isCompleted: false,
      });

      const savedGroup = await this.tournamentGroupsRepository.save(group);
      groups.push(savedGroup);
    }

    // Phân bổ đội vào các bảng theo thuật toán "snake" để cân bằng
    const groupTeams: TournamentGroupTeam[] = [];
    
    for (let i = 0; i < teams.length; i++) {
      let groupIndex: number;
      
      if (Math.floor(i / numGroups) % 2 === 0) {
        // Chẵn: từ đầu đến cuối
        groupIndex = i % numGroups;
      } else {
        // Lẻ: từ cuối về đầu
        groupIndex = numGroups - 1 - (i % numGroups);
      }

      const group = groups[groupIndex];
      const team = teams[i];

      const groupTeam = this.tournamentGroupTeamsRepository.create({
        groupId: group.id,
        registrationId: team.registration.id,
        position: group.currentTeams + 1,
      });

      const savedGroupTeam = await this.tournamentGroupTeamsRepository.save(groupTeam);
      groupTeams.push(savedGroupTeam);

      // Cập nhật số đội trong bảng
      group.currentTeams++;
      await this.tournamentGroupsRepository.save(group);
    }

    return groups;
  }

  /**
   * Tạo matches cho vòng bảng
   */
  private async createGroupStageMatches(groups: TournamentGroup[]) {
    for (const group of groups) {
      const groupTeams = await this.tournamentGroupTeamsRepository.find({
        where: { groupId: group.id },
        relations: ['registration', 'registration.user', 'registration.teammate'],
        order: { position: 'ASC' },
      });

      // Tạo matches vòng tròn 1 lượt
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          const team1 = groupTeams[i];
          const team2 = groupTeams[j];

                     const match = new Match();
           match.eventId = group.eventId;
           match.matchNumber = await this.getNextMatchNumber(group.eventId);
           match.status = MatchStatus.SCHEDULED;
           match.type = this.getMatchType(team1.registration, team2.registration);
           match.player1Name = this.getTeamName(team1.registration);
           match.player2Name = this.getTeamName(team2.registration);
           match.groupId = group.id;
           // scheduledTime và courtNumber sẽ được set sau
           match.notes = `Group ${group.name} - ${team1.registration.user.firstName} ${team1.registration.user.lastName} vs ${team2.registration.user.firstName} ${team2.registration.user.lastName}`;

           await this.matchesRepository.save(match);
        }
      }
    }
  }

  /**
   * Tạo vòng loại trực tiếp
   */
  async createKnockoutStage(eventId: number) {
    const event = await this.tournamentEventsRepository.findOne({
      where: { id: eventId },
      relations: ['groups', 'groups.groupTeams', 'groups.groupTeams.registration'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Kiểm tra xem vòng bảng đã hoàn thành chưa
    const incompleteGroups = event.groups.filter(group => !group.isCompleted);
    if (incompleteGroups.length > 0) {
      throw new Error('Group stage not completed yet');
    }

    // Lấy các đội vào vòng loại
    const knockoutTeams = await this.getKnockoutTeams(eventId);

    // Tạo matches vòng loại
    await this.createKnockoutMatches(eventId, knockoutTeams);

    return {
      message: 'Knockout stage created successfully',
      teams: knockoutTeams.length,
    };
  }

  /**
   * Lấy danh sách đội vào vòng loại
   */
  private async getKnockoutTeams(eventId: number) {
    const groups = await this.tournamentGroupsRepository.find({
      where: { eventId },
      relations: ['groupTeams', 'groupTeams.registration'],
    });

    const knockoutTeams: TournamentGroupTeam[] = [];

    // Lấy 2 đội đầu mỗi bảng
    for (const group of groups) {
      const topTeams = group.groupTeams
        .sort((a, b) => {
          // Sắp xếp theo điểm, nếu bằng điểm thì theo set difference
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          const aSetDiff = a.setsWon - a.setsLost;
          const bSetDiff = b.setsWon - b.setsLost;
          if (bSetDiff !== aSetDiff) {
            return bSetDiff - aSetDiff;
          }
          // Nếu vẫn bằng thì theo game difference
          const aGameDiff = a.gamesWon - a.gamesLost;
          const bGameDiff = b.gamesWon - b.gamesLost;
          return bGameDiff - aGameDiff;
        })
        .slice(0, 2);

      knockoutTeams.push(...topTeams);
    }

    // Nếu số đội lẻ, lấy thêm đội thứ 3 có thành tích tốt nhất
    if (knockoutTeams.length % 2 !== 0) {
      const allThirdPlaces = groups.map(group => {
        const sortedTeams = group.groupTeams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const aSetDiff = a.setsWon - a.setsLost;
          const bSetDiff = b.setsWon - b.setsLost;
          if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff;
          const aGameDiff = a.gamesWon - a.gamesLost;
          const bGameDiff = b.gamesWon - b.gamesLost;
          return bGameDiff - aGameDiff;
        });
        return sortedTeams[2]; // Đội thứ 3
      }).filter(team => team);

      if (allThirdPlaces.length > 0) {
        // Lấy đội thứ 3 có thành tích tốt nhất
        const bestThirdPlace = allThirdPlaces.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const aSetDiff = a.setsWon - a.setsLost;
          const bSetDiff = b.setsWon - b.setsLost;
          return bSetDiff - aSetDiff;
        })[0];

        knockoutTeams.push(bestThirdPlace);
      }
    }

    return knockoutTeams;
  }

  /**
   * Tạo matches vòng loại
   */
  private async createKnockoutMatches(eventId: number, teams: TournamentGroupTeam[]) {
    // Sắp xếp teams theo thứ tự seed
    const seededTeams = teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const aSetDiff = a.setsWon - a.setsLost;
      const bSetDiff = b.setsWon - b.setsLost;
      return bSetDiff - aSetDiff;
    });

    // Tạo matches theo bracket
    for (let i = 0; i < seededTeams.length / 2; i++) {
      const team1 = seededTeams[i];
      const team2 = seededTeams[seededTeams.length - 1 - i];

             const match = new Match();
       match.eventId = eventId;
       match.matchNumber = await this.getNextMatchNumber(eventId);
       match.status = MatchStatus.SCHEDULED;
       match.type = this.getMatchType(team1.registration, team2.registration);
       match.player1Name = this.getTeamName(team1.registration);
       match.player2Name = this.getTeamName(team2.registration);
       match.notes = `Knockout Round - ${team1.registration.user.firstName} ${team1.registration.user.lastName} vs ${team2.registration.user.firstName} ${team2.registration.user.lastName}`;

       await this.matchesRepository.save(match);
    }
  }

  /**
   * Cập nhật kết quả match và bảng điểm
   */
  async updateMatchResult(matchId: number, winnerId: number, scores: Array<{setNumber: number, team1Score: number, team2Score: number}>) {
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
      relations: ['event'],
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Cập nhật trạng thái match
    match.status = MatchStatus.COMPLETED;
    match.winner = winnerId === 1 ? match.player1Name : match.player2Name;
    await this.matchesRepository.save(match);

    // Cập nhật bảng điểm
    await this.updateGroupStandings(match, scores);

    return { message: 'Match result updated successfully' };
  }

  /**
   * Cập nhật bảng điểm sau khi có kết quả match
   */
  private async updateGroupStandings(match: Match, scores: Array<{setNumber: number, team1Score: number, team2Score: number}>) {
    // Tìm group teams dựa trên tên đội
    const groupTeams = await this.tournamentGroupTeamsRepository.find({
      relations: ['registration', 'registration.user', 'registration.teammate', 'group'],
    });

    const team1Name = match.player1Name;
    const team2Name = match.player2Name;

    const team1 = groupTeams.find(gt => this.getTeamName(gt.registration) === team1Name);
    const team2 = groupTeams.find(gt => this.getTeamName(gt.registration) === team2Name);

    if (!team1 || !team2) {
      throw new Error('Teams not found in groups');
    }

    // Tính toán kết quả
    let team1Sets = 0;
    let team2Sets = 0;
    let team1Games = 0;
    let team2Games = 0;

    for (const score of scores) {
      team1Games += score.team1Score;
      team2Games += score.team2Score;
      
      if (score.team1Score > score.team2Score) {
        team1Sets++;
      } else {
        team2Sets++;
      }
    }

    // Cập nhật thống kê
    team1.matchesPlayed++;
    team2.matchesPlayed++;
    team1.setsWon += team1Sets;
    team1.setsLost += team2Sets;
    team2.setsWon += team2Sets;
    team2.setsLost += team1Sets;
    team1.gamesWon += team1Games;
    team1.gamesLost += team2Games;
    team2.gamesWon += team2Games;
    team2.gamesLost += team1Games;

    if (team1Sets > team2Sets) {
      team1.matchesWon++;
      team1.points += 1;
      team2.matchesLost++;
    } else {
      team2.matchesWon++;
      team2.points += 1;
      team1.matchesLost++;
    }

    await this.tournamentGroupTeamsRepository.save([team1, team2]);

    // Cập nhật vị trí trong bảng
    await this.updateGroupPositions(team1.groupId);
  }

  /**
   * Cập nhật vị trí các đội trong bảng
   */
  private async updateGroupPositions(groupId: number) {
    const groupTeams = await this.tournamentGroupTeamsRepository.find({
      where: { groupId },
      order: {
        points: 'DESC',
        setsWon: 'DESC',
        gamesWon: 'DESC',
      },
    });

    for (let i = 0; i < groupTeams.length; i++) {
      groupTeams[i].position = i + 1;
    }

    await this.tournamentGroupTeamsRepository.save(groupTeams);
  }

  /**
   * Cập nhật status của event thành COMPLETED
   */
  async completeEvent(eventId: number) {
    const event = await this.tournamentEventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    await this.tournamentEventsRepository.update(eventId, { status: EventStatus.COMPLETED });

    return {
      message: 'Event completed successfully',
    };
  }

  /**
   * Lấy bảng điểm của một event
   */
  async getGroupStandings(eventId: number) {
    const groups = await this.tournamentGroupsRepository.find({
      where: { eventId },
      relations: ['groupTeams', 'groupTeams.registration', 'groupTeams.registration.user', 'groupTeams.registration.teammate'],
    });

    return groups.map(group => ({
      groupName: group.name,
      teams: group.groupTeams
        .sort((a, b) => a.position - b.position)
        .map(team => ({
          position: team.position,
          teamName: this.getTeamName(team.registration),
          player1: `${team.registration.user.firstName} ${team.registration.user.lastName}`,
          player2: team.registration.teammate ? `${team.registration.teammate.firstName} ${team.registration.teammate.lastName}` : null,
          matchesPlayed: team.matchesPlayed,
          matchesWon: team.matchesWon,
          matchesLost: team.matchesLost,
          points: team.points,
          setsWon: team.setsWon,
          setsLost: team.setsLost,
          gamesWon: team.gamesWon,
          gamesLost: team.gamesLost,
        })),
    }));
  }

  // Helper methods
  private async getNextMatchNumber(eventId: number): Promise<number> {
    const lastMatch = await this.matchesRepository.findOne({
      where: { eventId },
      order: { matchNumber: 'DESC' },
    });
    return lastMatch ? lastMatch.matchNumber + 1 : 1;
  }

  private getMatchType(reg1: EventRegistration, reg2: EventRegistration): MatchType {
    if (reg1.teammateId || reg2.teammateId) {
      return MatchType.DOUBLES;
    }
    return MatchType.SINGLES;
  }

  private getTeamName(registration: EventRegistration): string {
    const player1 = `${registration.user.firstName} ${registration.user.lastName}`;
    if (registration.teammate) {
      const player2 = `${registration.teammate.firstName} ${registration.teammate.lastName}`;
      return `${player1} / ${player2}`;
    }
    return player1;
  }
} 