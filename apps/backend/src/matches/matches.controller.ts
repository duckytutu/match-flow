import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MatchesService } from './matches.service';
import { Match, MatchStatus } from '../entities/match.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/roles.decorator';

class CreateMatchDto {
  eventId: number;
  matchNumber: number;
  type: string;
  scheduledTime?: string;
  courtNumber?: number;
  player1Name?: string;
  player2Name?: string;
  refereeId?: number;
}

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new match' })
  @ApiBody({
    type: CreateMatchDto,
    examples: {
      example: {
        summary: 'Create Match Example',
        value: {
          eventId: 1,
          matchNumber: 1,
          type: 'singles',
          scheduledTime: '2025-04-01T10:00:00.000Z',
          courtNumber: 2,
          player1Name: 'John Doe',
          player2Name: 'Jane Smith',
          refereeId: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Match created',
    schema: {
      example: {
        id: 1,
        eventId: 1,
        matchNumber: 1,
        type: 'singles',
        status: 'scheduled',
        scheduledTime: '2025-04-01T10:00:00.000Z',
        courtNumber: 2,
        player1Name: 'John Doe',
        player2Name: 'Jane Smith',
        refereeId: 3,
        winner: null,
        notes: null,
        createdAt: '2025-04-01T10:00:00.000Z',
        updatedAt: '2025-04-01T10:00:00.000Z',
      },
    },
  })
  create(@Body() data: Partial<Match>) {
    return this.matchesService.create(data);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({
    status: 200,
    description: 'List of matches',
    schema: {
      example: [
        {
          id: 1,
          eventId: 1,
          matchNumber: 1,
          type: 'singles',
          status: 'scheduled',
        },
      ],
    },
  })
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Match details',
    schema: {
      example: {
        id: 1,
        eventId: 1,
        matchNumber: 1,
        type: 'singles',
        status: 'scheduled',
        scheduledTime: '2025-04-01T10:00:00.000Z',
        courtNumber: 2,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(Number(id));
  }

  @Get('tournament/:tournamentId')
  findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.findByTournament(Number(tournamentId));
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.matchesService.findByEvent(Number(eventId));
  }

  @Get('event/:eventId/groups')
  @ApiOperation({ summary: 'Get matches grouped by tournament groups' })
  @ApiParam({ name: 'eventId', example: 1 })
  findMatchesByGroups(@Param('eventId') eventId: string) {
    return this.matchesService.findMatchesByGroups(Number(eventId));
  }

  @Get('event/:eventId/available-referees')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get available referees for an event' })
  @ApiParam({ name: 'eventId', example: 1 })
  getAvailableReferees(@Param('eventId') eventId: string, @Query('excludeMatchId') excludeMatchId?: string) {
    return this.matchesService.getAvailableReferees(Number(eventId), excludeMatchId ? Number(excludeMatchId) : undefined);
  }

  @Get('referee/:refereeId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN, UserRole.ATHLETE)
  findByReferee(@Param('refereeId') refereeId: string) {
    return this.matchesService.findByReferee(Number(refereeId));
  }

  @Get('referee/assigned')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get matches assigned to current referee' })
  getAssignedMatches(@Req() req) {
    return this.matchesService.findByReferee(req.user.id);
  }

  @Get('athlete/tournaments')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ATHLETE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get matches for athlete\'s tournaments' })
  getAthleteMatches(@Req() req) {
    return this.matchesService.findByAthlete(Number(req.user.id));
  }

  @Get('status/:status')
  @Public()
  @ApiOperation({ summary: 'Get matches by status' })
  @ApiParam({ name: 'status', example: 'scheduled' })
  findByStatus(@Param('status') status: string) {
    return this.matchesService.findMatchesByStatus(status as MatchStatus);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a match' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: CreateMatchDto,
    examples: {
      example: {
        summary: 'Update Match Example',
        value: {
          scheduledTime: '2025-04-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Match updated' })
  update(@Param('id') id: string, @Body() data: Partial<Match>) {
    return this.matchesService.update(Number(id), data);
  }

  @Patch(':id/assign-referee')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign referee to match' })
  @ApiParam({ name: 'id', example: 1 })
  assignReferee(@Param('id') id: string, @Body() data: { refereeId: number }) {
    return this.matchesService.assignReferee(Number(id), data.refereeId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update match status' })
  @ApiParam({ name: 'id', example: 1 })
  updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.matchesService.updateMatchStatus(Number(id), data.status as MatchStatus);
  }

  @Patch(':id/start')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Start a match' })
  @ApiParam({ name: 'id', example: 1 })
  startMatch(@Param('id') id: string) {
    return this.matchesService.startMatch(Number(id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a match' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Match deleted' })
  remove(@Param('id') id: string) {
    return this.matchesService.remove(Number(id));
  }
} 