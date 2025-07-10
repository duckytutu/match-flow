import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TournamentEvent } from './tournament-event.entity';

export enum TournamentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên giải đấu

  @Column('text', { nullable: true })
  description: string; // Mô tả (optional)

  @Column()
  location: string; // Địa điểm

  @Column()
  startDate: Date; // Ngày bắt đầu

  @Column({ nullable: true })
  endDate: Date; // Ngày kết thúc

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.DRAFT,
  })
  status: TournamentStatus;

  @Column({ default: false })
  isApproved: boolean; // Phê duyệt giải đấu

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.organizedTournaments)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  organizerId: number;

  @OneToMany(() => TournamentEvent, event => event.tournament)
  events: TournamentEvent[];
} 