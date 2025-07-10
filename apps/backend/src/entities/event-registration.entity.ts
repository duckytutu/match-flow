import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TournamentEvent } from './tournament-event.entity';

export enum EventRegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EventRegistrationStatus,
    default: EventRegistrationStatus.PENDING,
  })
  status: EventRegistrationStatus;



  @Column({ nullable: true })
  notes: string; // Ghi chú

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number; // Số tiền đã thanh toán

  @Column({ default: false })
  isPaid: boolean; // Đã thanh toán chưa

  @Column({ nullable: true })
  teammateId: number; // ID của đồng đội (cho nội dung đôi)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.eventRegistrations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'teammateId' })
  teammate: User;

  @ManyToOne(() => TournamentEvent, event => event.registrations)
  @JoinColumn({ name: 'eventId' })
  event: TournamentEvent;

  @Column()
  eventId: number;
} 