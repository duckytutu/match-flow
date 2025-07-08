import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistration } from '../entities/event-registration.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

class RegisterEventDto {
  eventId: number;
  teamName?: string;
  notes?: string;
  teamMembers?: string; // JSON string or array
}

@ApiTags('event-registrations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}

  @Post()
  @Roles(UserRole.ATHLETE, UserRole.GUEST)
  @ApiOperation({ summary: 'Register for an event' })
  @ApiBody({
    type: RegisterEventDto,
    examples: {
      example: {
        summary: 'Register Event Example',
        value: {
          eventId: 1,
          teamName: 'Team Alpha',
          notes: 'Looking forward to the event!',
          teamMembers: '[{"name":"John Doe","age":25},{"name":"Jane Smith","age":24}]',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Event registration created',
    schema: {
      example: {
        id: 1,
        eventId: 1,
        userId: 2,
        status: 'pending',
        teamName: 'Team Alpha',
        notes: 'Looking forward to the event!',
        paidAmount: 0,
        isPaid: false,
        teamMembers: '[{"name":"John Doe","age":25},{"name":"Jane Smith","age":24}]',
        createdAt: '2025-04-01T10:00:00.000Z',
        updatedAt: '2025-04-01T10:00:00.000Z',
      },
    },
  })
  registerForEvent(@Body() data: Partial<EventRegistration>, @Request() req: any) {
    return this.eventRegistrationsService.registerForEvent({
      ...data,
      userId: req.user.id,
    });
  }

  @Get('event/:eventId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get registrations by event' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventRegistrationsService.findByEvent(Number(eventId));
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get registrations by user' })
  findByUser(@Param('userId') userId: string) {
    return this.eventRegistrationsService.findByUser(Number(userId));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get event registration by ID' })
  findOne(@Param('id') id: string) {
    return this.eventRegistrationsService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Update an event registration' })
  update(@Param('id') id: string, @Body() data: Partial<EventRegistration>) {
    return this.eventRegistrationsService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Delete an event registration' })
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(Number(id));
  }
} 