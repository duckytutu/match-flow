import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRole } from '../entities/user.entity';
import { EventRegistrationStatus } from '../entities/event-registration.entity';
import { MatchStatus } from '../entities/match.entity';
import { EventType } from '../entities/tournament-event.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class SeedDatabase1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Vietnamese name lists for all roles
    const hoViet = [
      'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Trịnh', 'Đinh', 'Hà', 'Vương', 'Phùng', 'Quách', 'Tạ', 'Tô', 'Châu', 'La', 'Tăng', 'Thái', 'Tống', 'Cao', 'Mạc', 'Lâm', 'Hứa', 'Sơn', 'Lương', 'Giang', 'Lưu', 'Trương', 'Phùng', 'Đoàn', 'Văn', 'Từ', 'Chu', 'Triệu', 'Tạ', 'Tăng', 'Tô', 'Tống', 'Thạch'
    ];
    const tenNam = [
      'Anh', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Hải', 'Hùng', 'Khoa', 'Khôi', 'Long', 'Minh', 'Nam', 'Phát', 'Phong', 'Quang', 'Sơn', 'Thắng', 'Thành', 'Toàn', 'Trung', 'Tuấn', 'Việt', 'Vinh', 'Vũ', 'Hoàng', 'Hưng', 'Kiên', 'Lâm', 'Phúc', 'Quốc', 'Tài', 'Tiến', 'Trí', 'Văn', 'Bảo', 'Chí', 'Công', 'Đức', 'Duy', 'Hòa', 'Khánh', 'Lộc', 'Nhân', 'Quý', 'Tâm', 'Tân', 'Thái', 'Thiện', 'Trường', 'Tú'
    ];
    const tenNu = [
      'An', 'Bích', 'Chi', 'Châu', 'Diễm', 'Dung', 'Giang', 'Hà', 'Hạnh', 'Hoa', 'Hương', 'Lan', 'Linh', 'Mai', 'Ngân', 'Ngọc', 'Nhung', 'Oanh', 'Phương', 'Quỳnh', 'Thảo', 'Thúy', 'Trang', 'Trinh', 'Tuyết', 'Vy', 'Yến', 'Ánh', 'Cúc', 'Hằng', 'Hồng', 'Kim', 'Loan', 'Mỹ', 'Nga', 'Nguyệt', 'Phúc', 'Quyên', 'Sương', 'Thanh', 'Thắm', 'Thu', 'Thủy', 'Tiên', 'Tuyền', 'Vân', 'Xuân', 'Diệu', 'Hiền'
    ];

    // Helper to get random Vietnamese name
    function randomVietName(gender: 'male' | 'female') {
      const ho = faker.helpers.arrayElement(hoViet);
      const ten = gender === 'male' ? faker.helpers.arrayElement(tenNam) : faker.helpers.arrayElement(tenNu);
      return { ho, ten };
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await queryRunner.query(
      `INSERT INTO "users" (email, password, "firstName", "lastName", role, "isApproved", "phoneNumber", "dateOfBirth", "levelPoint", "pointSource", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        'admin@example.com',
        adminPassword,
        'Quản trị',
        'Hệ thống',
        'admin',
        true,
        faker.phone.number().replace(/^\d{2}/, '09'),
        faker.date.birthdate({ min: 1970, max: 1990, mode: 'year' }),
        '5.000',
        'Official',
        new Date(),
        new Date(),
      ]
    );
    const adminId = adminResult[0].id;
    console.log('✅ Admin user created');

    // Create organizers (ban tổ chức)
    const organizerIds: number[] = [];
    for (let i = 0; i < 3; i++) {
      const { ho, ten } = randomVietName('male');
      const organizerPassword = await bcrypt.hash('btc123', 10);
      const orgResult = await queryRunner.query(
        `INSERT INTO "users" (email, password, "firstName", "lastName", role, "isApproved", "phoneNumber", "dateOfBirth", "levelPoint", "pointSource", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
          `btc${i + 1}@example.com`,
          organizerPassword,
          ten,
          ho,
          'organizer',
          true,
          faker.phone.number().replace(/^\d{2}/, '09'),
          faker.date.birthdate({ min: 1970, max: 1995, mode: 'year' }),
          faker.number.float({ min: 4, max: 5 }).toFixed(1),
          'Official',
          new Date(),
          new Date(),
        ]
      );
      organizerIds.push(orgResult[0].id);
    }
    console.log('✅ Organizer users created');

    // Create referees (trọng tài)
    const refereeIds: number[] = [];
    for (let i = 0; i < 5; i++) {
      const { ho, ten } = randomVietName('male');
      const refereePassword = await bcrypt.hash('tt123', 10);
      const refResult = await queryRunner.query(
        `INSERT INTO "users" (email, password, "firstName", "lastName", role, "isApproved", "phoneNumber", "dateOfBirth", "levelPoint", "pointSource", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
          `tt${i + 1}@example.com`,
          refereePassword,
          ten,
          ho,
          'referee',
          true,
          faker.phone.number().replace(/^\d{2}/, '09'),
          faker.date.birthdate({ min: 1975, max: 2000, mode: 'year' }),
          faker.number.float({ min: 4, max: 5 }).toFixed(1),
          'Official',
          new Date(),
          new Date(),
        ]
      );
      refereeIds.push(refResult[0].id);
    }
    console.log('✅ Referee users created');

    // Create athletes (vận động viên)
    const athleteIds: number[] = [];
    for (let i = 0; i < 50; i++) {
      const gender = i % 2 === 0 ? 'male' : 'female';
      const { ho, ten } = randomVietName(gender as 'male' | 'female');
      const athletePassword = await bcrypt.hash('vdv123', 10);
      const athleteResult = await queryRunner.query(
        `INSERT INTO "users" (email, password, "firstName", "lastName", role, "isApproved", "phoneNumber", "dateOfBirth", "levelPoint", "pointSource", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
          `vdv${i + 1}@example.com`,
          athletePassword,
          ten,
          ho,
          'athlete',
          true,
          faker.phone.number().replace(/^\d{2}/, '09'),
          faker.date.birthdate({ min: 1980, max: 2007, mode: 'year' }),
          faker.number.float({ min: 2, max: 5 }).toFixed(1),
          faker.helpers.arrayElement(['Official', 'Practice', 'Tournament']),
          new Date(),
          new Date(),
        ]
      );
      athleteIds.push(athleteResult[0].id);
    }
    console.log('✅ Athlete users created');

    // Create main tournament (registration_open)
    const tournamentResult = await queryRunner.query(
      `INSERT INTO "tournaments" (name, description, "startDate", "endDate", location, status, "isApproved", "organizerId", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        'Giải Vô Địch Cầu Lông Toàn Quốc 2024',
        'Giải đấu phong trào toàn quốc với nhiều nội dung hấp dẫn.',
        faker.date.future({ years: 1 }),
        faker.date.future({ years: 1 }),
        'Nhà thi đấu Phú Thọ, TP.HCM',
        'registration_open',
        true,
        organizerIds[0],
        new Date(),
        new Date(),
      ]
    );
    const tournamentId = tournamentResult[0].id;
    console.log('✅ Tournament created');

    // Create a tournament đủ điều kiện để bắt đầu (registration_closed)
    const readyTournamentResult = await queryRunner.query(
      `INSERT INTO "tournaments" (name, description, "startDate", "endDate", location, status, "isApproved", "organizerId", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        'Giải Sẵn Sàng Thi Đấu 2024',
        'Giải đấu đã đóng đăng ký, sẵn sàng bắt đầu.',
        faker.date.future({ years: 1 }),
        faker.date.future({ years: 1 }),
        'Nhà thi đấu Quân Khu 7, TP.HCM',
        'registration_closed',
        true,
        organizerIds[1],
        new Date(),
        new Date(),
      ]
    );
    const readyTournamentId = readyTournamentResult[0].id;
    console.log('✅ Ready-to-start tournament created');

    // Create tournament events for both tournaments
    const eventTypes = [EventType.SINGLES_MALE, EventType.SINGLES_FEMALE, EventType.DOUBLES_MALE];
    const eventIds: number[] = [];
    const readyEventIds: number[] = [];
    for (let i = 0; i < eventTypes.length; i++) {
      const eventType = eventTypes[i];
      const maxTeams = eventType === EventType.SINGLES_MALE || eventType === EventType.SINGLES_FEMALE ? 16 : 8;
      // Main tournament
      const eventResult = await queryRunner.query(
        `INSERT INTO "tournament_events" (type, status, "maxTeams", "currentTeams", "entryFee", prizes, "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "tournamentId", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          eventType,
          'not_started',
          maxTeams,
          0,
          faker.number.int({ min: 100000, max: 300000 }),
          'Cúp, huy chương, tiền mặt',
          11,
          2,
          3,
          11,
          2,
          3,
          tournamentId,
          new Date(),
          new Date(),
        ]
      );
      eventIds.push(eventResult[0].id);
      // Ready-to-start tournament
      const readyEventResult = await queryRunner.query(
        `INSERT INTO "tournament_events" (type, status, "maxTeams", "currentTeams", "entryFee", prizes, "groupStagePoints", "groupStageWinBy", "groupStageBo", "knockoutStagePoints", "knockoutStageWinBy", "knockoutStageBo", "tournamentId", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          eventType,
          'not_started',
          maxTeams,
          0,
          faker.number.int({ min: 100000, max: 300000 }),
          'Cúp, huy chương, tiền mặt',
          11,
          2,
          3,
          11,
          2,
          3,
          readyTournamentId,
          new Date(),
          new Date(),
        ]
      );
      readyEventIds.push(readyEventResult[0].id);
    }
    console.log('✅ Tournament events created for both tournaments');

    const registrationStatuses = [
      EventRegistrationStatus.PENDING,
      EventRegistrationStatus.APPROVED,
      EventRegistrationStatus.REJECTED,
      EventRegistrationStatus.CANCELLED,
    ];
    // Đăng ký cho main tournament: mỗi vận động viên/cặp có đủ 4 trạng thái
    let singlesAthleteIdx = 0;
    let doublesAthleteIdx = 0;
    for (let eventIdx = 0; eventIdx < eventIds.length; eventIdx++) {
      const eventId = eventIds[eventIdx];
      const eventType = eventTypes[eventIdx];
      if (eventType === EventType.SINGLES_MALE || eventType === EventType.SINGLES_FEMALE) {
        for (let i = 0; i < 8; i++) { // 8 vận động viên đầu tiên: đủ 4 trạng thái
          const athleteId = athleteIds[singlesAthleteIdx % athleteIds.length];
          for (const status of registrationStatuses) {
            await queryRunner.query(
              `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                status,
                status === EventRegistrationStatus.APPROVED,
                status === EventRegistrationStatus.APPROVED ? 200000 : 0,
                `Ghi chú đăng ký trạng thái ${status}`,
                eventId,
                athleteId,
                null,
                new Date(),
                new Date(),
              ]
            );
          }
          singlesAthleteIdx++;
        }
        for (let i = 0; i < 4; i++) { // 4 vận động viên tiếp theo: chỉ trạng thái pending
          const athleteId = athleteIds[singlesAthleteIdx % athleteIds.length];
          await queryRunner.query(
            `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              EventRegistrationStatus.PENDING,
              false,
              0,
              `Ghi chú đăng ký trạng thái pending`,
              eventId,
              athleteId,
              null,
              new Date(),
              new Date(),
            ]
          );
          singlesAthleteIdx++;
        }
      } else if (eventType === EventType.DOUBLES_MALE) {
        for (let i = 0; i < 4; i++) { // 4 cặp đầu tiên: đủ 4 trạng thái
          const athlete1 = athleteIds[(doublesAthleteIdx * 2) % athleteIds.length];
          const athlete2 = athleteIds[(doublesAthleteIdx * 2 + 1) % athleteIds.length];
          for (const status of registrationStatuses) {
            await queryRunner.query(
              `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                status,
                status === EventRegistrationStatus.APPROVED,
                status === EventRegistrationStatus.APPROVED ? 200000 : 0,
                `Ghi chú đăng ký trạng thái ${status}`,
                eventId,
                athlete1,
                athlete2,
                new Date(),
                new Date(),
              ]
            );
          }
          doublesAthleteIdx++;
        }
        for (let i = 0; i < 2; i++) { // 2 cặp tiếp theo: chỉ trạng thái pending
          const athlete1 = athleteIds[(doublesAthleteIdx * 2) % athleteIds.length];
          const athlete2 = athleteIds[(doublesAthleteIdx * 2 + 1) % athleteIds.length];
          await queryRunner.query(
            `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              EventRegistrationStatus.PENDING,
              false,
              0,
              `Ghi chú đăng ký trạng thái pending`,
              eventId,
              athlete1,
              athlete2,
              new Date(),
              new Date(),
            ]
          );
          doublesAthleteIdx++;
        }
      }
    }
    // Đăng ký cho ready-to-start tournament: mỗi thể thức có ít nhất 16 đội/đăng ký approved
    singlesAthleteIdx = 0;
    doublesAthleteIdx = 0;
    for (let eventIdx = 0; eventIdx < readyEventIds.length; eventIdx++) {
      const eventId = readyEventIds[eventIdx];
      const eventType = eventTypes[eventIdx];
      if (eventType === EventType.SINGLES_MALE || eventType === EventType.SINGLES_FEMALE) {
        for (let i = 0; i < 16; i++) {
          const athleteId = athleteIds[singlesAthleteIdx % athleteIds.length];
          await queryRunner.query(
            `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              EventRegistrationStatus.APPROVED,
              true,
              200000,
              `Đã duyệt cho giải sẵn sàng thi đấu`,
              eventId,
              athleteId,
              null,
              new Date(),
              new Date(),
            ]
          );
          singlesAthleteIdx++;
        }
        await queryRunner.query(
          `UPDATE "tournament_events" SET "currentTeams" = 16, "maxTeams" = 16 WHERE id = $1`,
          [eventId]
        );
      } else if (eventType === EventType.DOUBLES_MALE) {
        for (let i = 0; i < 16; i++) {
          const athlete1 = athleteIds[(doublesAthleteIdx * 2) % athleteIds.length];
          const athlete2 = athleteIds[(doublesAthleteIdx * 2 + 1) % athleteIds.length];
          await queryRunner.query(
            `INSERT INTO "event_registrations" (status, "isPaid", "paidAmount", notes, "eventId", "userId", "teammateId", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              EventRegistrationStatus.APPROVED,
              true,
              200000,
              `Đã duyệt cho giải sẵn sàng thi đấu`,
              eventId,
              athlete1,
              athlete2,
              new Date(),
              new Date(),
            ]
          );
          doublesAthleteIdx++;
        }
        await queryRunner.query(
          `UPDATE "tournament_events" SET "currentTeams" = 16, "maxTeams" = 16 WHERE id = $1`,
          [eventId]
        );
      }
    }
    console.log('✅ Event registrations seeded cho đủ trạng thái và đủ điều kiện bắt đầu!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🧹 Reverting seed data...');
    // Clear all seeded data in correct order to avoid foreign key constraints
    await queryRunner.query(`DELETE FROM "scores"`);
    await queryRunner.query(`DELETE FROM "matches"`);
    await queryRunner.query(`DELETE FROM "tournament_group_teams"`);
    await queryRunner.query(`DELETE FROM "event_registrations"`);
    await queryRunner.query(`DELETE FROM "tournament_groups"`);
    await queryRunner.query(`DELETE FROM "tournament_events"`);
    await queryRunner.query(`DELETE FROM "tournaments"`);
    await queryRunner.query(`DELETE FROM "users"`);
    console.log('✅ Seed data reverted successfully!');
  }
}