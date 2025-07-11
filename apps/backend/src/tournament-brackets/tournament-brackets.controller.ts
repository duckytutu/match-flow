import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TournamentBracketsService } from './tournament-brackets.service';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

class UpdateMatchResultDto {
  winnerId: number; // 1 hoặc 2
  scores: Array<{
    setNumber: number;
    team1Score: number;
    team2Score: number;
  }>;
}

@ApiTags('tournament-brackets')
@Controller('tournament-brackets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TournamentBracketsController {
  constructor(
    private readonly tournamentBracketsService: TournamentBracketsService,
  ) {}

  @Post('events/:eventId/start')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bắt đầu giải đấu - chia bảng và tạo matches' })
  @ApiParam({ name: 'eventId', description: 'ID của tournament event' })
  @ApiResponse({ status: 200, description: 'Tournament started successfully' })
  @ApiResponse({ status: 400, description: 'Event not found or insufficient teams' })
  async startTournament(@Param('eventId') eventId: string) {
    return this.tournamentBracketsService.startTournament(Number(eventId));
  }

  @Post('events/:eventId/knockout')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo vòng loại trực tiếp sau khi vòng bảng hoàn thành' })
  @ApiParam({ name: 'eventId', description: 'ID của tournament event' })
  @ApiResponse({ status: 200, description: 'Knockout stage created successfully' })
  @ApiResponse({ status: 400, description: 'Group stage not completed yet' })
  async createKnockoutStage(@Param('eventId') eventId: string) {
    return this.tournamentBracketsService.createKnockoutStage(Number(eventId));
  }

  @Post('events/:eventId/complete')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Hoàn thành giải đấu' })
  @ApiParam({ name: 'eventId', description: 'ID của tournament event' })
  @ApiResponse({
    status: 200,
    description: 'Event completed successfully',
    schema: {
      example: {
        message: 'Event completed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Event not found',
    schema: {
      example: {
        message: 'Event not found',
      },
    },
  })
  async completeEvent(@Param('eventId') eventId: string) {
    return this.tournamentBracketsService.completeEvent(Number(eventId));
  }

  @Get('events/:eventId/standings')
  @ApiOperation({ summary: 'Lấy bảng điểm của event' })
  @ApiParam({ name: 'eventId', description: 'ID của tournament event' })
  @ApiResponse({ status: 200, description: 'Group standings retrieved successfully' })
  async getGroupStandings(@Param('eventId') eventId: string) {
    return this.tournamentBracketsService.getGroupStandings(Number(eventId));
  }

  @Post('matches/:matchId/result')
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật kết quả match và bảng điểm' })
  @ApiParam({ name: 'matchId', description: 'ID của match' })
  @ApiBody({
    type: UpdateMatchResultDto,
    examples: {
      example: {
        summary: 'Update Match Result Example',
        value: {
          winnerId: 1,
          scores: [
            { setNumber: 1, team1Score: 11, team2Score: 9 },
            { setNumber: 2, team1Score: 11, team2Score: 7 },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Match result updated successfully',
    schema: {
      example: {
        message: 'Match result updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Match not found or invalid data',
    schema: {
      example: {
        message: 'Match not found',
      },
    },
  })
  async updateMatchResult(
    @Param('matchId') matchId: string,
    @Body() updateMatchResultDto: UpdateMatchResultDto,
  ) {
    return this.tournamentBracketsService.updateMatchResult(
      Number(matchId),
      updateMatchResultDto.winnerId,
      updateMatchResultDto.scores,
    );
  }
} 