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
import { RegistrationsService } from './registrations.service';
import { Registration } from '../entities/registration.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

class RegisterTournamentDto {
  tournamentId: number;
  partnerName?: string;
  partnerEmail?: string;
  notes?: string;
}

@ApiTags('registrations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  @Roles(UserRole.ATHLETE, UserRole.GUEST)
  @ApiOperation({ summary: 'Register for a tournament' })
  @ApiBody({
    type: RegisterTournamentDto,
    examples: {
      example: {
        summary: 'Register Example',
        value: {
          tournamentId: 1,
          partnerName: 'Jane Doe',
          partnerEmail: 'jane@example.com',
          notes: 'Looking forward to the event!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registration created',
    schema: {
      example: {
        id: 1,
        userId: 2,
        tournamentId: 1,
        status: 'pending',
        partnerName: 'Jane Doe',
        partnerEmail: 'jane@example.com',
        notes: 'Looking forward to the event!',
        createdAt: '2025-03-01T12:00:00.000Z',
      },
    },
  })
  registerForTournament(@Body() data: Partial<Registration>, @Request() req: any) {
    return this.registrationsService.registerForTournament({
      ...data,
      userId: req.user.id,
    });
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get all registrations' })
  @ApiResponse({
    status: 200,
    description: 'List of registrations',
    schema: {
      example: [
        {
          id: 1,
          userId: 2,
          tournamentId: 1,
          status: 'pending',
        },
      ],
    },
  })
  findAll() {
    return this.registrationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get registration by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Registration details',
    schema: {
      example: {
        id: 1,
        userId: 2,
        tournamentId: 1,
        status: 'pending',
        partnerName: 'Jane Doe',
        partnerEmail: 'jane@example.com',
        notes: 'Looking forward to the event!',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(Number(id));
  }

  @Get('tournament/:tournamentId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.registrationsService.findByTournament(Number(tournamentId));
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  findByUser(@Param('userId') userId: string) {
    return this.registrationsService.findByUser(Number(userId));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Update a registration' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: RegisterTournamentDto,
    examples: {
      example: {
        summary: 'Update Registration Example',
        value: {
          notes: 'Updated note',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Registration updated' })
  update(@Param('id') id: string, @Body() data: Partial<Registration>) {
    return this.registrationsService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Delete a registration' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Registration deleted' })
  remove(@Param('id') id: string) {
    return this.registrationsService.remove(Number(id));
  }
} 