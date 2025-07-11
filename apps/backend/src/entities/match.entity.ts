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
import { Score } from './score.entity';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MatchType {
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  MIXED = 'mixed',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchNumber: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({
    type: 'enum',
    enum: MatchType,
    default: MatchType.SINGLES,
  })
  type: MatchType;

  @Column({ nullable: true })
  scheduledTime: Date;

  @Column({ nullable: true })
  courtNumber: number;

  @Column({ nullable: true })
  player1Name: string;

  @Column({ nullable: true })
  player2Name: string;

  @Column({ nullable: true })
  winner: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TournamentEvent, event => event.matches)
  @JoinColumn({ name: 'eventId' })
  event: TournamentEvent;

  @Column()
  eventId: number;

  @ManyToOne(() => User, user => user.refereedMatches)
  @JoinColumn({ name: 'refereeId' })
  referee: User;

  @Column({ nullable: true })
  refereeId: number;

  @OneToMany(() => Score, score => score.match)
  scores: Score[];
} 