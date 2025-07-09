import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistration, EventRegistrationStatus } from '../entities/event-registration.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

class RegisterEventDto {
  eventId: number;
  teamName?: string;
  notes?: string;
  teammateId?: number; // ID of teammate for doubles events
}

class UpdateRegistrationStatusDto {
  status: EventRegistrationStatus;
  notes?: string; // Ghi chú từ ban tổ chức
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
          teammateId: 2,
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
        teammateId: 3,
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get registrations by user' })
  findByUser(@Param('userId') userId: string, @Request() req: any) {
    // Allow users to view their own registrations, or admin/organizer to view any
    const requestingUserId = req.user.id;
    const requestingUserRole = req.user.role;
    const targetUserId = Number(userId);
    
    if (requestingUserRole === UserRole.ADMIN || requestingUserRole === UserRole.ORGANIZER) {
      // Admin and Organizer can view any user's registrations
      return this.eventRegistrationsService.findByUser(targetUserId);
    } else if (requestingUserId === targetUserId) {
      // Users can view their own registrations
      return this.eventRegistrationsService.findByUser(targetUserId);
    } else {
      // Users cannot view other users' registrations
      throw new UnauthorizedException('You can only view your own registrations');
    }
  }

  @Get('pending')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get all pending registrations' })
  findPending() {
    return this.eventRegistrationsService.findPending();
  }

  @Get('organizer/:organizerId/pending')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get pending registrations for organizer\'s tournaments' })
  findPendingForOrganizer(@Param('organizerId') organizerId: string, @Request() req: any) {
    const requestingUserId = req.user.id;
    const requestingUserRole = req.user.role;
    const targetOrganizerId = Number(organizerId);
    
    if (requestingUserRole === UserRole.ADMIN || requestingUserId === targetOrganizerId) {
      return this.eventRegistrationsService.findPendingForOrganizer(targetOrganizerId);
    } else {
      throw new UnauthorizedException('You can only view registrations for your own tournaments');
    }
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

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Approve an event registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration approved successfully',
  })
  approve(@Param('id') id: string, @Body() data: UpdateRegistrationStatusDto) {
    return this.eventRegistrationsService.updateStatus(Number(id), EventRegistrationStatus.APPROVED, data.notes);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Reject an event registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration rejected successfully',
  })
  reject(@Param('id') id: string, @Body() data: UpdateRegistrationStatusDto) {
    return this.eventRegistrationsService.updateStatus(Number(id), EventRegistrationStatus.REJECTED, data.notes);
  }

  @Patch(':id/request-info')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Request more information for registration' })
  @ApiResponse({
    status: 200,
    description: 'Information request sent successfully',
  })
  requestInfo(@Param('id') id: string, @Body() data: UpdateRegistrationStatusDto) {
    return this.eventRegistrationsService.updateStatus(Number(id), EventRegistrationStatus.PENDING, data.notes);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Delete an event registration' })
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(Number(id));
  }
} 