import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TournamentsService } from './tournaments.service';
import { Tournament, TournamentStatus } from '../entities/tournament.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/roles.decorator';
import { TournamentBracketsService } from '../tournament-brackets/tournament-brackets.service';

class CreateTournamentDto {
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  events?: Array<{
    name: string;
    description?: string;
    type: string;
    maxTeams: number;
    entryFee: number;
    prizes?: string;
    groupStagePoints?: number;
    groupStageWinBy?: number;
    groupStageMaxPoints?: number;
    knockoutStagePoints?: number;
    knockoutStageWinBy?: number;
    knockoutStageMaxPoints?: number;
  }>;
}

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly tournamentBracketsService: TournamentBracketsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new tournament' })
  @ApiBody({
    type: CreateTournamentDto,
    examples: {
      example: {
        summary: 'Create Tournament Example',
        value: {
          name: 'Spring Open',
          description: 'Annual spring pickleball tournament',
          location: 'City Sports Center',
          startDate: '2025-04-01',
          endDate: '2025-04-05',
          status: 'draft',
          isApproved: false,
          organizerId: 2,
          events: [
            {
              type: 'singles_male',
              maxTeams: 16,
              entryFee: 20.0,
              groupStagePoints: 11,
              groupStageWinBy: 2,
              groupStageMaxPoints: 15,
              groupStageBo: 1,
              knockoutStagePoints: 11,
              knockoutStageWinBy: 2,
              knockoutStageMaxPoints: 15,
              knockoutStageBo: 3
            }
          ]
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tournament created',
    schema: {
      example: {
        id: 1,
        name: 'Spring Open',
        description: 'Annual spring pickleball tournament',
        location: 'City Sports Center',
        startDate: '2025-04-01T00:00:00.000Z',
        endDate: '2025-04-05T00:00:00.000Z',
        status: 'draft',
        isApproved: false,
        organizerId: 2,
        events: [
          {
            id: 1,
            type: 'singles_male',
            maxTeams: 16,
            entryFee: 20.0,
            groupStagePoints: 11,
            groupStageWinBy: 2,
            groupStageMaxPoints: 15,
            groupStageBo: 1,
            knockoutStagePoints: 11,
            knockoutStageWinBy: 2,
            knockoutStageMaxPoints: 15,
            knockoutStageBo: 3
          }
        ],
        createdAt: '2025-03-01T12:00:00.000Z',
        updatedAt: '2025-03-01T12:00:00.000Z',
      },
    },
  })
  create(@Body() data: Partial<Tournament>, @Request() req: any) {
    return this.tournamentsService.create({
      ...data,
      organizerId: req.user.id,
    });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all approved tournaments' })
  @ApiResponse({
    status: 200,
    description: 'List of approved tournaments',
    schema: {
      example: [
        {
          id: 1,
          name: 'Spring Open',
          location: 'City Sports Center',
          startDate: '2025-04-01T00:00:00.000Z',
          endDate: '2025-04-05T00:00:00.000Z',
          type: 'singles',
          status: 'published',
          isApproved: true,
        },
      ],
    },
  })
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get tournaments pending approval' })
  @ApiResponse({
    status: 200,
    description: 'List of tournaments pending approval',
    schema: {
      example: [
        {
          id: 2,
          name: 'Summer Tournament',
          location: 'Sports Complex',
          startDate: '2025-06-01T00:00:00.000Z',
          endDate: '2025-06-05T00:00:00.000Z',
          type: 'doubles',
          status: 'draft',
          isApproved: false,
        },
      ],
    },
  })
  findPendingApproval() {
    return this.tournamentsService.findPendingApproval();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get tournament by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tournament details',
    schema: {
      example: {
        id: 1,
        name: 'Spring Open',
        location: 'City Sports Center',
        startDate: '2025-04-01T00:00:00.000Z',
        endDate: '2025-04-05T00:00:00.000Z',
        type: 'singles',
        status: 'draft',
        organizer: { id: 2, firstName: 'Alice', lastName: 'Smith' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(Number(id));
  }

  @Get('organizer/:organizerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  findByOrganizer(@Param('organizerId') organizerId: string) {
    return this.tournamentsService.findByOrganizer(Number(organizerId));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a tournament' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: CreateTournamentDto,
    examples: {
      example: {
        summary: 'Update Tournament Example',
        value: {
          name: 'Spring Open Updated',
          maxParticipants: 64,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tournament updated' })
  update(@Param('id') id: string, @Body() data: Partial<Tournament>) {
    return this.tournamentsService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a tournament' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Tournament deleted' })
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(Number(id));
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a tournament' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tournament approved',
    schema: {
      example: {
        id: 1,
        name: 'Spring Open',
        isApproved: true,
        status: 'published',
      },
    },
  })
  approve(@Param('id') id: string) {
    return this.tournamentsService.approve(Number(id));
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject a tournament' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tournament rejected',
    schema: {
      example: {
        id: 1,
        name: 'Spring Open',
        isApproved: false,
        status: 'rejected',
      },
    },
  })
  reject(@Param('id') id: string, @Body() data: { reason?: string }) {
    return this.tournamentsService.reject(Number(id), data.reason);
  }

  @Patch(':id/request-info')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Request more information for a tournament' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tournament marked as needing more info',
    schema: {
      example: {
        id: 1,
        name: 'Spring Open',
        status: 'needs_info',
      },
    },
  })
  requestMoreInfo(@Param('id') id: string, @Body() data: { message?: string }) {
    return this.tournamentsService.requestMoreInfo(Number(id), data.message);
  }

  @Post(':id/start')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bắt đầu giải đấu (chia bảng, tạo lịch vòng bảng)' })
  @ApiParam({ name: 'id', description: 'ID của tournament event' })
  @ApiResponse({
    status: 200,
    description: 'Tournament started successfully',
    schema: {
      example: {
        message: 'Tournament started successfully',
        groups: 8,
        totalTeams: 32,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Event not found or insufficient teams',
    schema: {
      example: {
        message: 'Event needs 32 teams, but only has 28',
      },
    },
  })
  async startTournament(@Param('id') eventId: string) {
    return this.tournamentBracketsService.startTournament(Number(eventId));
  }

  @Post(':id/knockout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo vòng loại trực tiếp sau khi vòng bảng hoàn thành' })
  @ApiParam({ name: 'id', description: 'ID của tournament event' })
  @ApiResponse({
    status: 200,
    description: 'Knockout stage created successfully',
    schema: {
      example: {
        message: 'Knockout stage created successfully',
        teams: 16,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Group stage not completed yet',
    schema: {
      example: {
        message: 'Group stage not completed yet',
      },
    },
  })
  async createKnockoutStage(@Param('id') eventId: string) {
    return this.tournamentBracketsService.createKnockoutStage(Number(eventId));
  }

  @Get(':id/standings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN, UserRole.REFEREE)
  @ApiOperation({ summary: 'Lấy bảng điểm các bảng đấu của event' })
  @ApiParam({ name: 'id', description: 'ID của tournament event' })
  @ApiResponse({
    status: 200,
    description: 'Group standings retrieved successfully',
    schema: {
      example: [
        {
          groupName: 'A',
          teams: [
            {
              position: 1,
              teamName: 'Nguyễn Văn A / Trần Thị B',
              player1: 'Nguyễn Văn A',
              player2: 'Trần Thị B',
              matchesPlayed: 3,
              matchesWon: 3,
              matchesLost: 0,
              points: 3,
              setsWon: 6,
              setsLost: 0,
              gamesWon: 66,
              gamesLost: 30,
            },
            {
              position: 2,
              teamName: 'Lê Văn C / Phạm Thị D',
              player1: 'Lê Văn C',
              player2: 'Phạm Thị D',
              matchesPlayed: 3,
              matchesWon: 2,
              matchesLost: 1,
              points: 2,
              setsWon: 4,
              setsLost: 2,
              gamesWon: 55,
              gamesLost: 45,
            },
          ],
        },
      ],
    },
  })
  async getGroupStandings(@Param('id') eventId: string) {
    return this.tournamentBracketsService.getGroupStandings(Number(eventId));
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Hoàn thành giải đấu' })
  @ApiParam({ name: 'id', description: 'ID của tournament event' })
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
  async completeEvent(@Param('id') eventId: string) {
    return this.tournamentBracketsService.completeEvent(Number(eventId));
  }
} 