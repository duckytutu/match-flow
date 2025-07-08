import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration } from '../entities/event-registration.entity';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private eventRegistrationsRepository: Repository<EventRegistration>,
  ) {}

  create(data: Partial<EventRegistration>) {
    const registration = this.eventRegistrationsRepository.create(data);
    return this.eventRegistrationsRepository.save(registration);
  }

  findAll() {
    return this.eventRegistrationsRepository.find({ relations: ['user', 'event'] });
  }

  findOne(id: number) {
    return this.eventRegistrationsRepository.findOne({ where: { id }, relations: ['user', 'event'] });
  }

  findByEvent(eventId: number) {
    return this.eventRegistrationsRepository.find({ where: { eventId }, relations: ['user'] });
  }

  findByUser(userId: number) {
    return this.eventRegistrationsRepository.find({ where: { userId }, relations: ['event'] });
  }

  update(id: number, data: Partial<EventRegistration>) {
    return this.eventRegistrationsRepository.update(id, data);
  }

  remove(id: number) {
    return this.eventRegistrationsRepository.delete(id);
  }

  async registerForEvent(data: Partial<EventRegistration>) {
    const registration = await this.create(data);
    // Optionally: update participant count in event
    return registration;
  }
} 