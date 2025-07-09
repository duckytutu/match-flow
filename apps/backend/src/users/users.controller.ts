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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { User, UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

@ApiTags('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        summary: 'Create User Example',
        value: {
          email: 'admin@example.com',
          password: 'adminpass',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() data: Partial<User>) {
    return this.usersService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: {
      example: [
        {
          id: 1,
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('athletes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.REFEREE, UserRole.ATHLETE, UserRole.GUEST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search athletes for team registration' })
  @ApiResponse({
    status: 200,
    description: 'List of athletes matching search criteria',
    schema: {
      example: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          levelPoint: 3.5
        }
      ]
    }
  })
  searchAthletes(@Request() req, @Query('search') search: string) {
    return this.usersService.searchAthletes(search, req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.REFEREE, UserRole.ATHLETE, UserRole.GUEST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: 1,
        email: 'athlete@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'athlete',
        isApproved: true,
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
        skillLevel: 'Intermediate',
        levelPoint: 3.5,
        pointSource: 'self_rated',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    }
  })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.REFEREE, UserRole.ATHLETE, UserRole.GUEST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    schema: {
      example: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
        skillLevel: 'Intermediate',
        levelPoint: 3.5,
        pointSource: 'self_rated'
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        id: 1,
        email: 'athlete@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'athlete',
        isApproved: true,
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
        skillLevel: 'Intermediate',
        levelPoint: 3.5,
        pointSource: 'self_rated',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    }
  })
  updateProfile(@Request() req, @Body() updateUserDto: Partial<User>) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User details',
    schema: {
      example: {
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user (admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        summary: 'Update User Example',
        value: {
          firstName: 'Updated',
          lastName: 'Name',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.usersService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a user (admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User approved',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'athlete',
        isApproved: true,
      },
    },
  })
  approve(@Param('id') id: string) {
    return this.usersService.approve(Number(id));
  }


} 