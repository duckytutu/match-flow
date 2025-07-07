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

class CreateTournamentDto {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  maxParticipants: number;
  entryFee: number;
}

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

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
          type: 'singles',
          maxParticipants: 32,
          entryFee: 25.0,
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
        type: 'singles',
        maxParticipants: 32,
        entryFee: 25.0,
        status: 'draft',
        isApproved: false,
        organizerId: 2,
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
} 