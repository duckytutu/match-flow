import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Match } from './entities/match.entity';
import { Score } from './entities/score.entity';
import { TournamentEvent } from './entities/tournament-event.entity';
import { EventRegistration } from './entities/event-registration.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'pickleball',
  password: process.env.DB_PASSWORD || 'pickleball',
  database: process.env.DB_NAME || 'pickleball',
  entities: [User, Tournament, Match, Score, TournamentEvent, EventRegistration],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
}); 