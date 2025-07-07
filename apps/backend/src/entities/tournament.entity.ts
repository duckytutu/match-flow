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
import { Registration } from './registration.entity';
import { Match } from './match.entity';

export enum TournamentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TournamentType {
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  MIXED = 'mixed',
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.DRAFT,
  })
  status: TournamentStatus;

  @Column({
    type: 'enum',
    enum: TournamentType,
    default: TournamentType.SINGLES,
  })
  type: TournamentType;

  @Column({ default: 0 })
  maxParticipants: number;

  @Column({ default: 0 })
  currentParticipants: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  entryFee: number;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  rules: string;

  @Column({ nullable: true })
  prizes: string;

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

  @OneToMany(() => Registration, registration => registration.tournament)
  registrations: Registration[];

  @OneToMany(() => Match, match => match.tournament)
  matches: Match[];
} 