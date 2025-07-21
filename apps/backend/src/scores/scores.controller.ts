import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ScoresService } from './scores.service';
import { Score } from '../entities/score.entity';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/roles.decorator';

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
          team2Score: 9,
          notes: 'Set 1 completed',
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
        team2Score: 9,
        notes: 'Set 1 completed',
        createdAt: '2025-04-01T10:00:00.000Z',
        updatedAt: '2025-04-01T10:00:00.000Z',
      },
    },
  })
  create(@Body() data: Partial<Score>) {
    return this.scoresService.create(data);
  }

  @Get()
  @Public()
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
          team2Score: 9,
        },
      ],
    },
  })
  findAll() {
    return this.scoresService.findAll();
  }

  @Get(':id')
  @Public()
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
        team2Score: 9,
        notes: 'Set 1 completed',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.scoresService.findOne(Number(id));
  }

  @Get('match/:matchId')
  @Public()
  @ApiOperation({ summary: 'Get all scores for a match' })
  @ApiParam({ name: 'matchId', example: 1 })
  findByMatch(@Param('matchId') matchId: string) {
    return this.scoresService.findByMatch(Number(matchId));
  }

  @Get('match/:matchId/total')
  @Public()
  @ApiOperation({ summary: 'Get total score for a match' })
  @ApiParam({ name: 'matchId', example: 1 })
  getMatchTotalScore(@Param('matchId') matchId: string) {
    return this.scoresService.getMatchTotalScore(Number(matchId));
  }

  @Post('match/:matchId/set')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN, UserRole.ATHLETE)
  @ApiOperation({ summary: 'Add a new set score to a match' })
  @ApiParam({ name: 'matchId', example: 1 })
  @ApiBody({
    schema: {
      example: {
        setNumber: 1,
        team1Score: 11,
        team2Score: 9,
        notes: 'Set 1 completed',
      },
    },
  })
  addSetScore(
    @Param('matchId') matchId: string,
    @Body() data: { setNumber: number; team1Score: number; team2Score: number; notes?: string },
    @Req() req
  ) {
    // Tạm thời bỏ qua kiểm tra quyền để test
    return this.scoresService.addSetScore(
      Number(matchId),
      data.setNumber,
      data.team1Score,
      data.team2Score,
      data.notes
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a score' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      example: {
        team1Score: 12,
        team2Score: 10,
        notes: 'Updated set score',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Score updated' })
  update(@Param('id') id: string, @Body() data: Partial<Score>) {
    return this.scoresService.update(Number(id), data);
  }

  @Patch(':id/set')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN, UserRole.ATHLETE)
  @ApiOperation({ summary: 'Update a set score' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      example: {
        team1Score: 12,
        team2Score: 10,
        notes: 'Updated set score',
      },
    },
  })
  updateSetScore(
    @Param('id') id: string,
    @Body() data: { team1Score: number; team2Score: number; notes?: string },
    @Req() req
  ) {
    // Kiểm tra quyền: athlete chỉ có thể cập nhật điểm cho trận đấu của mình
    if (req.user.role === UserRole.ATHLETE) {
      return this.scoresService.updateSetScoreForAthlete(
        Number(id),
        data.team1Score,
        data.team2Score,
        data.notes,
        req.user.id
      );
    }
    
    return this.scoresService.updateSetScore(
      Number(id),
      data.team1Score,
      data.team2Score,
      data.notes
    );
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

  @Delete('match/:matchId/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.REFEREE, UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete all scores for a match' })
  @ApiParam({ name: 'matchId', example: 1 })
  @ApiResponse({ status: 200, description: 'All scores deleted' })
  removeAllMatchScores(@Param('matchId') matchId: string) {
    return this.scoresService.removeAllMatchScores(Number(matchId));
  }
} 