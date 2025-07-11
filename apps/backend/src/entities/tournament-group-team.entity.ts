import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TournamentGroup } from './tournament-group.entity';
import { EventRegistration } from './event-registration.entity';

@Entity('tournament_group_teams')
export class TournamentGroupTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: number;

  @Column()
  registrationId: number; // ID của event registration

  @Column({ default: 0 })
  matchesPlayed: number; // Số trận đã đấu

  @Column({ default: 0 })
  matchesWon: number; // Số trận thắng

  @Column({ default: 0 })
  matchesLost: number; // Số trận thua

  @Column({ default: 0 })
  points: number; // Điểm tích lũy (1 điểm cho mỗi trận thắng)

  @Column({ default: 0 })
  setsWon: number; // Tổng số set thắng

  @Column({ default: 0 })
  setsLost: number; // Tổng số set thua

  @Column({ default: 0 })
  gamesWon: number; // Tổng số game thắng

  @Column({ default: 0 })
  gamesLost: number; // Tổng số game thua

  @Column({ default: 0 })
  position: number; // Vị trí trong bảng (1, 2, 3, 4...)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TournamentGroup, group => group.groupTeams)
  @JoinColumn({ name: 'groupId' })
  group: TournamentGroup;

  @ManyToOne(() => EventRegistration)
  @JoinColumn({ name: 'registrationId' })
  registration: EventRegistration;
} 