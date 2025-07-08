import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistrationsController } from './event-registrations.controller';
import { EventRegistration } from '../entities/event-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventRegistration])],
  providers: [EventRegistrationsService],
  controllers: [EventRegistrationsController],
  exports: [EventRegistrationsService],
})
export class EventRegistrationsModule {} 