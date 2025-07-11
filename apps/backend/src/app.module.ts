import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { ScoresModule } from './scores/scores.module';
import { AdminModule } from './admin/admin.module';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Match } from './entities/match.entity';
import { Score } from './entities/score.entity';
import { TournamentEvent } from './entities/tournament-event.entity';
import { EventRegistration } from './entities/event-registration.entity';
import { TournamentGroup } from './entities/tournament-group.entity';
import { TournamentGroupTeam } from './entities/tournament-group-team.entity';
import { EventRegistrationsModule } from './event-registrations/event-registrations.module';
import { TournamentEventsModule } from './tournament-events/tournament-events.module';
import { TournamentBracketsModule } from './tournament-brackets/tournament-brackets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'pickleball'),
        password: configService.get('DB_PASSWORD', 'pickleball'),
        database: configService.get('DB_NAME', 'pickleball'),
        entities: [User, Tournament, Match, Score, TournamentEvent, EventRegistration, TournamentGroup, TournamentGroupTeam],
        migrations: [__dirname + '/migrations/*.ts'],
        migrationsRun: true,
        synchronize: false, // Disable synchronize in favor of migrations
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TournamentsModule,
    MatchesModule,
    ScoresModule,
    AdminModule,
    EventRegistrationsModule,
    TournamentEventsModule,
    TournamentBracketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
