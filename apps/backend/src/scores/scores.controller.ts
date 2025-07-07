import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ScoresService } from './scores.service';
import { Score } from '../entities/score.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

class CreateScoreDto {
  matchId: number;
  setNumber: number;
  team1Score: number;
  team2Score: number;
  notes?: string;
}

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new score' })
  @ApiBody({
    type: CreateScoreDto,
    examples: {
      example: {
        summary: 'Create Score Example',
        value: {
          matchId: 1,
          setNumber: 1,
          team1Score: 11,
          team2Score: 8,
          notes: 'Great set!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Score created',
    schema: {
      example: {
        id: 1,
        matchId: 1,
        setNumber: 1,
        team1Score: 11,
        team2Score: 8,
        notes: 'Great set!',
        createdAt: '2025-04-01T10:30:00.000Z',
      },
    },
  })
  create(@Body() data: Partial<Score>) {
    return this.scoresService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scores' })
  @ApiResponse({
    status: 200,
    description: 'List of scores',
    schema: {
      example: [
        {
          id: 1,
          matchId: 1,
          setNumber: 1,
          team1Score: 11,
          team2Score: 8,
        },
      ],
    },
  })
  findAll() {
    return this.scoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get score by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Score details',
    schema: {
      example: {
        id: 1,
        matchId: 1,
        setNumber: 1,
        team1Score: 11,
        team2Score: 8,
        notes: 'Great set!',
        createdAt: '2025-04-01T10:30:00.000Z',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.scoresService.findOne(Number(id));
  }

  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    return this.scoresService.findByMatch(Number(matchId));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a score' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: CreateScoreDto,
    examples: {
      example: {
        summary: 'Update Score Example',
        value: {
          team1Score: 15,
          notes: 'Updated score',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Score updated' })
  update(@Param('id') id: string, @Body() data: Partial<Score>) {
    return this.scoresService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a score' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Score deleted' })
  remove(@Param('id') id: string) {
    return this.scoresService.remove(Number(id));
  }
} 