import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tournament } from './tournament.entity';
import { Match } from './match.entity';
import { EventRegistration } from './event-registration.entity';

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  REFEREE = 'referee',
  ATHLETE = 'athlete',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  skillLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => EventRegistration, registration => registration.user)
  eventRegistrations: EventRegistration[];

  @OneToMany(() => Tournament, tournament => tournament.organizer)
  organizedTournaments: Tournament[];

  @OneToMany(() => Match, match => match.referee)
  refereedMatches: Match[];
} 