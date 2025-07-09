import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TournamentEventsService } from './tournament-events.service';
import { TournamentEvent } from '../entities/tournament-event.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/roles.decorator';

class CreateEventDto {
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
}

@ApiTags('tournament-events')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tournament-events')
export class TournamentEventsController {
  constructor(private readonly tournamentEventsService: TournamentEventsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new tournament event' })
  @ApiBody({
    type: CreateEventDto,
    examples: {
      example: {
        summary: 'Create Tournament Event Example',
        value: {
          tournamentId: 1,
          type: 'doubles_male',
          maxTeams: 16,
          entryFee: 30.0,
          prizes: 'Medals, Trophies',
          groupStagePoints: 11,
          groupStageWinBy: 2,
          groupStageMaxPoints: 15,
          groupStageBo: 1,
          knockoutStagePoints: 11,
          knockoutStageWinBy: 2,
          knockoutStageMaxPoints: 15,
          knockoutStageBo: 3
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tournament event created',
    schema: {
      example: {
        id: 1,
        tournamentId: 1,
        type: 'doubles_male',
        maxTeams: 16,
        entryFee: 30.0,
        prizes: 'Medals, Trophies',
        groupStagePoints: 11,
        groupStageWinBy: 2,
        groupStageMaxPoints: 15,
        groupStageBo: 1,
        knockoutStagePoints: 11,
        knockoutStageWinBy: 2,
        knockoutStageMaxPoints: 15,
        knockoutStageBo: 3,
        createdAt: '2025-04-01T10:00:00.000Z',
        updatedAt: '2025-04-01T10:00:00.000Z',
      },
    },
  })
  create(@Body() data: Partial<TournamentEvent>, @Request() req: any) {
    return this.tournamentEventsService.create(data);
  }

  @Get('tournament/:tournamentId')
  @Public()
  @ApiOperation({ summary: 'Get events by tournament' })
  findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.tournamentEventsService.findByTournament(Number(tournamentId));
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get tournament event by ID' })
  findOne(@Param('id') id: string) {
    return this.tournamentEventsService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a tournament event' })
  update(@Param('id') id: string, @Body() data: Partial<TournamentEvent>) {
    return this.tournamentEventsService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a tournament event' })
  remove(@Param('id') id: string) {
    return this.tournamentEventsService.remove(Number(id));
  }
} 