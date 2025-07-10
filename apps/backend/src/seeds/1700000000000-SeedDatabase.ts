import { MigrationInterface, QueryRunner } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Tournament, TournamentStatus } from '../entities/tournament.entity';
import { TournamentEvent, EventType } from '../entities/tournament-event.entity';
import { EventRegistration, EventRegistrationStatus } from '../entities/event-registration.entity';
import * as bcrypt from 'bcrypt';

export class SeedDatabase1700000000000 implements MigrationInterface {
  name = 'SeedDatabase1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Check if tables exist before deleting
    const tables = ['event_registrations', 'tournament_events', 'tournaments', 'users'];
    for (const table of tables) {
      const tableExists = await queryRunner.hasTable(table);
      if (tableExists) {
        await queryRunner.query(`DELETE FROM "${table}"`);
        console.log(`✅ Cleared table: ${table}`);
      } else {
        console.log(`⚠️  Table does not exist: ${table}`);
      }
    }

    // Create users with different roles
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminResult = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Admin', 'User', 'admin@pickleball.com', hashedPassword, UserRole.ADMIN, true, 0, new Date(), new Date()]);
    const adminId = adminResult[0].id;

    const organizer1Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Nguyễn', 'Văn A', 'organizer1@pickleball.com', hashedPassword, UserRole.ORGANIZER, true, 0, new Date(), new Date()]);
    const organizer1Id = organizer1Result[0].id;

    const organizer2Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Trần', 'Thị B', 'organizer2@pickleball.com', hashedPassword, UserRole.ORGANIZER, true, 0, new Date(), new Date()]);
    const organizer2Id = organizer2Result[0].id;

    const athlete1Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Lê', 'Văn C', 'athlete1@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 4.0, new Date(), new Date()]);
    const athlete1Id = athlete1Result[0].id;

    const athlete2Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Phạm', 'Thị D', 'athlete2@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 4.5, new Date(), new Date()]);
    const athlete2Id = athlete2Result[0].id;

    const athlete3Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Hoàng', 'Văn E', 'athlete3@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 3.5, new Date(), new Date()]);
    const athlete3Id = athlete3Result[0].id;

    const athlete4Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Vũ', 'Thị F', 'athlete4@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 4.2, new Date(), new Date()]);
    const athlete4Id = athlete4Result[0].id;

    const athlete5Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Đặng', 'Văn G', 'athlete5@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 3.8, new Date(), new Date()]);
    const athlete5Id = athlete5Result[0].id;

    const athlete6Result = await queryRunner.query(`
      INSERT INTO "users" ("firstName", "lastName", "email", "password", "role", "isApproved", "levelPoint", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id"
    `, ['Bùi', 'Thị H', 'athlete6@pickleball.com', hashedPassword, UserRole.ATHLETE, true, 4.7, new Date(), new Date()]);
    const athlete6Id = athlete6Result[0].id;

    // Create tournaments
    console.log('🏆 Creating tournaments...');
    
    const tournament1Result = await queryRunner.query(`
      INSERT INTO "tournaments" ("name", "description", "location", "startDate", "endDate", "status", "isApproved", "organizerId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "id"
    `, [
      'Giải đấu Pickleball Hà Nội 2024',
      'Giải đấu Pickleball lớn nhất Hà Nội với nhiều nội dung thi đấu hấp dẫn',
      'Nhà thi đấu Hà Nội, 123 Đường ABC, Hà Nội',
      new Date('2024-12-15'),
      new Date('2024-12-17'),
      TournamentStatus.PUBLISHED,
      true,
      organizer1Id,
      new Date(),
      new Date()
    ]);
    const tournament1Id = tournament1Result[0].id;

    const tournament2Result = await queryRunner.query(`
      INSERT INTO "tournaments" ("name", "description", "location", "startDate", "endDate", "status", "isApproved", "organizerId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "id"
    `, [
      'Giải đấu Pickleball TP.HCM 2024',
      'Giải đấu Pickleball tại TP.HCM với các vận động viên hàng đầu',
      'Nhà thi đấu TP.HCM, 456 Đường XYZ, TP.HCM',
      new Date('2024-12-20'),
      new Date('2024-12-22'),
      TournamentStatus.PUBLISHED,
      true,
      organizer2Id,
      new Date(),
      new Date()
    ]);
    const tournament2Id = tournament2Result[0].id;

    const tournament3Result = await queryRunner.query(`
      INSERT INTO "tournaments" ("name", "description", "location", "startDate", "endDate", "status", "isApproved", "organizerId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "id"
    `, [
      'Giải đấu Pickleball Đà Nẵng 2024',
      'Giải đấu Pickleball tại Đà Nẵng - Thành phố đáng sống',
      'Nhà thi đấu Đà Nẵng, 789 Đường DEF, Đà Nẵng',
      new Date('2024-12-25'),
      new Date('2024-12-27'),
      TournamentStatus.DRAFT,
      false,
      organizer1Id,
      new Date(),
      new Date()
    ]);
    const tournament3Id = tournament3Result[0].id;

    // Create tournament events
    console.log('⚡ Creating tournament events...');
    
    const events1 = await Promise.all([
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament1Id, EventType.SINGLES_MALE, 32, 0, 200000, 'Giải nhất: 10,000,000 VND, Giải nhì: 5,000,000 VND, Giải ba: 2,000,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament1Id, EventType.SINGLES_FEMALE, 24, 0, 200000, 'Giải nhất: 8,000,000 VND, Giải nhì: 4,000,000 VND, Giải ba: 1,500,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament1Id, EventType.DOUBLES_MALE, 16, 0, 300000, 'Giải nhất: 15,000,000 VND, Giải nhì: 7,000,000 VND, Giải ba: 3,000,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament1Id, EventType.DOUBLES_FEMALE, 12, 0, 300000, 'Giải nhất: 12,000,000 VND, Giải nhì: 6,000,000 VND, Giải ba: 2,500,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament1Id, EventType.DOUBLES_MIXED, 20, 0, 300000, 'Giải nhất: 13,000,000 VND, Giải nhì: 6,500,000 VND, Giải ba: 2,800,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()])
    ]);

    const events2 = await Promise.all([
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament2Id, EventType.SINGLES_MALE, 24, 0, 180000, 'Giải nhất: 8,000,000 VND, Giải nhì: 4,000,000 VND, Giải ba: 1,500,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament2Id, EventType.DOUBLES_MIXED, 16, 0, 250000, 'Giải nhất: 10,000,000 VND, Giải nhì: 5,000,000 VND, Giải ba: 2,000,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()])
    ]);

    const events3 = await Promise.all([
      queryRunner.query(`
        INSERT INTO "tournament_events" ("tournamentId", "type", "maxTeams", "currentTeams", "entryFee", "prizes", "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING "id"
      `, [tournament3Id, EventType.SINGLES_MALE, 16, 0, 150000, 'Giải nhất: 5,000,000 VND, Giải nhì: 2,500,000 VND, Giải ba: 1,000,000 VND', 11, 2, 3, 11, 2, 3, new Date(), new Date()])
    ]);

    const event1Ids = events1.map(result => result[0].id);
    const event2Ids = events2.map(result => result[0].id);
    const event3Ids = events3.map(result => result[0].id);

    // Create event registrations with different statuses
    console.log('📝 Creating event registrations...');
    
    // Tournament 1 - Event 1 (Singles Male) - Approved registrations
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event1Ids[0], athlete1Id, EventRegistrationStatus.APPROVED, 'Rất mong được tham gia giải đấu!', 200000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event1Ids[0], athlete2Id, EventRegistrationStatus.APPROVED, 'Hẹn gặp lại tại giải đấu!', 200000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [event1Ids[0], athlete3Id, EventRegistrationStatus.APPROVED, 200000, true, new Date(), new Date()])
    ]);

    // Tournament 1 - Event 1 (Singles Male) - Pending registrations
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event1Ids[0], athlete4Id, EventRegistrationStatus.PENDING, 'Xin chào, tôi muốn đăng ký tham gia giải đấu này.', 0, false, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [event1Ids[0], athlete5Id, EventRegistrationStatus.PENDING, 0, false, new Date(), new Date()])
    ]);

    // Tournament 1 - Event 1 (Singles Male) - Rejected registration
    await queryRunner.query(`
      INSERT INTO "event_registrations" ("eventId", "userId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [event1Ids[0], athlete6Id, EventRegistrationStatus.REJECTED, 'Đăng ký không hợp lệ', 0, false, new Date(), new Date()]);

    // Tournament 1 - Event 2 (Singles Female) - Mixed statuses
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [event1Ids[1], athlete2Id, EventRegistrationStatus.APPROVED, 200000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event1Ids[1], athlete4Id, EventRegistrationStatus.PENDING, 'Chờ phê duyệt', 0, false, new Date(), new Date()])
    ]);

    // Tournament 1 - Event 3 (Doubles Male) - With teammates
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "teammateId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [event1Ids[2], athlete1Id, athlete2Id, EventRegistrationStatus.APPROVED, 'Đội mạnh nhất giải đấu!', 300000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "teammateId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [event1Ids[2], athlete3Id, athlete5Id, EventRegistrationStatus.PENDING, 'Đăng ký đôi nam', 0, false, new Date(), new Date()])
    ]);

    // Tournament 1 - Event 5 (Doubles Mixed) - Mixed statuses
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "teammateId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [event1Ids[4], athlete1Id, athlete4Id, EventRegistrationStatus.APPROVED, 'Đội nam nữ xuất sắc', 300000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "teammateId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event1Ids[4], athlete2Id, athlete6Id, EventRegistrationStatus.PENDING, 0, false, new Date(), new Date()])
    ]);

    // Tournament 2 - Event 1 (Singles Male) - Approved
    await Promise.all([
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [event2Ids[0], athlete1Id, EventRegistrationStatus.APPROVED, 180000, true, new Date(), new Date()]),
      queryRunner.query(`
        INSERT INTO "event_registrations" ("eventId", "userId", "status", "paidAmount", "isPaid", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [event2Ids[0], athlete3Id, EventRegistrationStatus.PENDING, 0, false, new Date(), new Date()])
    ]);

    // Tournament 2 - Event 2 (Doubles Mixed) - Approved
    await queryRunner.query(`
      INSERT INTO "event_registrations" ("eventId", "userId", "teammateId", "status", "notes", "paidAmount", "isPaid", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [event2Ids[1], athlete1Id, athlete4Id, EventRegistrationStatus.APPROVED, 'Đội mạnh TP.HCM', 250000, true, new Date(), new Date()]);

    // Update currentTeams for all events
    console.log('🔄 Updating current teams count...');
    const allEvents = [...event1Ids, ...event2Ids, ...event3Ids];
    
    for (const eventId of allEvents) {
      const approvedCountResult = await queryRunner.query(`
        SELECT COUNT(*) as count FROM "event_registrations" 
        WHERE "eventId" = $1 AND "status" = $2
      `, [eventId, EventRegistrationStatus.APPROVED]);
      
      const approvedCount = parseInt(approvedCountResult[0].count);
      await queryRunner.query(`
        UPDATE "tournament_events" SET "currentTeams" = $1 WHERE "id" = $2
      `, [approvedCount, eventId]);
    }



    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users created: 10');
    console.log('- Tournaments created: 3');
    console.log('- Events created: 8');
    console.log('- Registrations created: 15+');
    
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@pickleball.com / password123');
    console.log('Organizer 1: organizer1@pickleball.com / password123');
    console.log('Organizer 2: organizer2@pickleball.com / password123');
    console.log('Athlete 1: athlete1@pickleball.com / password123');
    console.log('Athlete 2: athlete2@pickleball.com / password123');
    console.log('Athlete 3: athlete3@pickleball.com / password123');
    console.log('Athlete 4: athlete4@pickleball.com / password123');
    console.log('Athlete 5: athlete5@pickleball.com / password123');
    console.log('Athlete 6: athlete6@pickleball.com / password123');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🧹 Reverting seed data...');
    
    // Clear all seeded data
    await queryRunner.query(`DELETE FROM "event_registrations"`);
    await queryRunner.query(`DELETE FROM "tournament_events"`);
    await queryRunner.query(`DELETE FROM "tournaments"`);
    await queryRunner.query(`DELETE FROM "users"`);
    
    console.log('✅ Seed data reverted successfully!');
  }
} 