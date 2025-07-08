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
import { Tournament } from './tournament.entity';
import { EventRegistration } from './event-registration.entity';
import { Match } from './match.entity';

export enum EventType {
  SINGLES_MALE = 'singles_male',
  SINGLES_FEMALE = 'singles_female',
  DOUBLES_MALE = 'doubles_male',
  DOUBLES_FEMALE = 'doubles_female',
  DOUBLES_MIXED = 'doubles_mixed',
}

@Entity('tournament_events')
export class TournamentEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @Column({ default: 0 })
  maxTeams: number;

  @Column({ default: 0 })
  currentTeams: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  entryFee: number;

  @Column({ nullable: true })
  prizes: string;

  // Luật thi đấu vòng bảng
  @Column({ default: 11 })
  groupStagePoints: number; // Số điểm thắng 1 set vòng bảng

  @Column({ default: 1 })
  groupStageWinBy: number; // Thắng cách biệt bao nhiêu điểm vòng bảng

  @Column({ nullable: true })
  groupStageMaxPoints: number; // Điểm tối đa 1 set vòng bảng

  @Column({ default: 1 })
  groupStageBo: number; // Best of (BO1 hoặc BO3) vòng bảng

  // Luật thi đấu vòng loại
  @Column({ default: 11 })
  knockoutStagePoints: number; // Số điểm thắng 1 set vòng loại

  @Column({ default: 1 })
  knockoutStageWinBy: number; // Thắng cách biệt bao nhiêu điểm vòng loại

  @Column({ nullable: true })
  knockoutStageMaxPoints: number; // Điểm tối đa 1 set vòng loại

  @Column({ default: 1 })
  knockoutStageBo: number; // Best of (BO1 hoặc BO3) vòng loại

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tournament, tournament => tournament.events)
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column()
  tournamentId: number;

  @OneToMany(() => EventRegistration, registration => registration.event)
  registrations: EventRegistration[];

  @OneToMany(() => Match, match => match.event)
  matches: Match[];
} 