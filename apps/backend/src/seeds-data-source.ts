import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentEvent } from './entities/tournament-event.entity';
import { EventRegistration } from './entities/event-registration.entity';
import { Match } from './entities/match.entity';
import { Score } from './entities/score.entity';
import { TournamentGroup } from './entities/tournament-group.entity';
import { TournamentGroupTeam } from './entities/tournament-group-team.entity';

export const SeedsDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'pickleball',
  password: process.env.DB_PASSWORD || 'pickleball',
  database: process.env.DB_DATABASE || 'pickleball',
  entities: [User, Tournament, TournamentEvent, EventRegistration, Match, Score, TournamentGroup, TournamentGroupTeam],
  migrations: ['src/seeds/*.ts'],
  synchronize: false,
  logging: false,
}); 