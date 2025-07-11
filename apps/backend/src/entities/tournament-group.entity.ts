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
import { TournamentEvent } from './tournament-event.entity';
import { TournamentGroupTeam } from './tournament-group-team.entity';

@Entity('tournament_groups')
export class TournamentGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên bảng (A, B, C, D...)

  @Column()
  eventId: number;

  @Column({ default: 0 })
  maxTeams: number; // Số đội tối đa trong bảng (thường là 4)

  @Column({ default: 0 })
  currentTeams: number; // Số đội hiện tại trong bảng

  @Column({ default: false })
  isCompleted: boolean; // Bảng đã hoàn thành chưa

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TournamentEvent, event => event.groups)
  @JoinColumn({ name: 'eventId' })
  event: TournamentEvent;

  @OneToMany(() => TournamentGroupTeam, groupTeam => groupTeam.group)
  groupTeams: TournamentGroupTeam[];
} 