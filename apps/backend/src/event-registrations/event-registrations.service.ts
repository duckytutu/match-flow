import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration, EventRegistrationStatus } from '../entities/event-registration.entity';
import { TournamentEventsService } from '../tournament-events/tournament-events.service';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private eventRegistrationsRepository: Repository<EventRegistration>,
    private tournamentEventsService: TournamentEventsService,
  ) {}

  create(data: Partial<EventRegistration>) {
    const registration = this.eventRegistrationsRepository.create(data);
    return this.eventRegistrationsRepository.save(registration);
  }

  findAll() {
    return this.eventRegistrationsRepository.find({ 
      relations: ['user', 'teammate', 'event', 'event.tournament'] 
    });
  }

  findOne(id: number) {
    return this.eventRegistrationsRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'teammate', 'event', 'event.tournament'] 
    });
  }

  findByEvent(eventId: number) {
    return this.eventRegistrationsRepository.find({ 
      where: { eventId }, 
      relations: ['user', 'teammate', 'event', 'event.tournament'] 
    });
  }

  findByUser(userId: number) {
    return this.eventRegistrationsRepository.find({ 
      where: { userId }, 
      relations: ['event', 'event.tournament', 'teammate'] 
    });
  }

  findPending() {
    return this.eventRegistrationsRepository.find({ 
      where: { status: EventRegistrationStatus.PENDING }, 
      relations: ['user', 'teammate', 'event', 'event.tournament'] 
    });
  }

  findPendingForOrganizer(organizerId: number) {
    return this.eventRegistrationsRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.user', 'user')
      .leftJoinAndSelect('registration.teammate', 'teammate')
      .leftJoinAndSelect('registration.event', 'event')
      .leftJoinAndSelect('event.tournament', 'tournament')
      .where('registration.status = :status', { status: EventRegistrationStatus.PENDING })
      .andWhere('tournament.organizerId = :organizerId', { organizerId })
      .orderBy('registration.createdAt', 'DESC')
      .getMany();
  }

  update(id: number, data: Partial<EventRegistration>) {
    return this.eventRegistrationsRepository.update(id, data);
  }

  async updateStatus(id: number, status: EventRegistrationStatus, notes?: string) {
    const updateData: Partial<EventRegistration> = { status };
    
    if (notes) {
      updateData.notes = notes;
    }

    // Lấy thông tin đăng ký trước khi cập nhật để biết eventId
    const registration = await this.findOne(id);
    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    await this.eventRegistrationsRepository.update(id, updateData);
    
    // Cập nhật currentTeams của event nếu status thay đổi thành approved hoặc từ approved sang status khác
    if (status === EventRegistrationStatus.APPROVED || registration.status === EventRegistrationStatus.APPROVED) {
      await this.tournamentEventsService.updateCurrentTeams(registration.eventId);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    // Lấy thông tin đăng ký trước khi xóa để biết eventId và status
    const registration = await this.findOne(id);
    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    await this.eventRegistrationsRepository.delete(id);
    
    // Cập nhật currentTeams nếu đăng ký bị xóa là approved
    if (registration.status === EventRegistrationStatus.APPROVED) {
      await this.tournamentEventsService.updateCurrentTeams(registration.eventId);
    }

    return { success: true };
  }

  async checkExistingRegistration(eventId: number, userId: number, teammateId?: number) {
    // Kiểm tra xem user chính đã đăng ký chưa
    const existingRegistration = await this.eventRegistrationsRepository.findOne({
      where: { eventId, userId }
    });

    if (existingRegistration) {
      throw new BadRequestException('Bạn đã đăng ký tham gia nội dung này rồi');
    }

    // Nếu có đồng đội, kiểm tra xem đồng đội đã đăng ký chưa
    if (teammateId) {
      const teammateRegistration = await this.eventRegistrationsRepository.findOne({
        where: { eventId, userId: teammateId }
      });

      if (teammateRegistration) {
        throw new BadRequestException('Đồng đội của bạn đã đăng ký tham gia nội dung này rồi');
      }

      // Kiểm tra xem có ai khác đã chọn đồng đội này chưa
      const teammateSelectedByOthers = await this.eventRegistrationsRepository.findOne({
        where: { eventId, teammateId }
      });

      if (teammateSelectedByOthers) {
        throw new BadRequestException('Đồng đội này đã được chọn bởi vận động viên khác');
      }
    }
  }

  async registerForEvent(data: Partial<EventRegistration>) {
    // Kiểm tra trùng lặp đăng ký
    await this.checkExistingRegistration(data.eventId!, data.userId!, data.teammateId);

    const registration = await this.create(data);
    return registration;
  }
} 