import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../entities/user.entity';
import { Tournament } from '../entities/tournament.entity';
import { Registration } from '../entities/registration.entity';
import { Match } from '../entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tournament, Registration, Match])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {} 