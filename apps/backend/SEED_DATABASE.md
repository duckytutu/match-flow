# Database Seeding Guide

## Overview
Script seed database tạo dữ liệu mẫu đầy đủ cho tất cả các chức năng hiện tại của hệ thống Pickleball.

## 📁 Cấu trúc folder

```
apps/backend/src/
├── migrations/              # Migrations tạo cấu trúc bảng
│   └── *.ts
├── seeds/                   # Seeds tạo dữ liệu mẫu
│   └── 1700000000000-SeedDatabase.ts
└── seeds-data-source.ts     # Data source cho seeds
```

**Lưu ý**: Seeds được tách riêng khỏi migrations để dễ quản lý và có thể chạy độc lập.

## 🚀 Quick Start (TypeORM Seeds)

**Cách đơn giản nhất để seed database:**

```bash
cd apps/backend
npm run seed:run
```

Lệnh này sẽ chạy TypeORM seeds để tạo dữ liệu mẫu.

## Dữ liệu được tạo

### 👥 Users (10 users)
- **1 Admin**: admin@pickleball.com / password123
- **2 Organizers**: 
  - organizer1@pickleball.com / password123
  - organizer2@pickleball.com / password123
- **6 Athletes**:
  - athlete1@pickleball.com / password123 (levelPoint: 1500)
  - athlete2@pickleball.com / password123 (levelPoint: 1600)
  - athlete3@pickleball.com / password123 (levelPoint: 1400)
  - athlete4@pickleball.com / password123 (levelPoint: 1550)
  - athlete5@pickleball.com / password123 (levelPoint: 1450)
  - athlete6@pickleball.com / password123 (levelPoint: 1650)

### 🏆 Tournaments (3 tournaments)
1. **Giải đấu Pickleball Hà Nội 2024** (Đã phê duyệt, Published)
   - 5 nội dung thi đấu: Singles Male, Singles Female, Doubles Male, Doubles Female, Doubles Mixed
   - Organizer: Nguyễn Văn A

2. **Giải đấu Pickleball TP.HCM 2024** (Đã phê duyệt, Published)
   - 2 nội dung thi đấu: Singles Male, Doubles Mixed
   - Organizer: Trần Thị B

3. **Giải đấu Pickleball Đà Nẵng 2024** (Chưa phê duyệt, Draft)
   - 1 nội dung thi đấu: Singles Male
   - Organizer: Nguyễn Văn A

### 📝 Event Registrations (Nhiều trạng thái)
- **Approved**: Đăng ký đã được phê duyệt
- **Pending**: Đăng ký chờ phê duyệt
- **Rejected**: Đăng ký bị từ chối
- **Có cả đăng ký đơn và đôi** (với teammate)

## Cách chạy seed database

### Sử dụng TypeORM Seeds (Khuyến nghị)
```bash
cd apps/backend
npm run seed:run
```

### Revert seeds
```bash
cd apps/backend
npm run seed:revert
```

### Generate new seed
```bash
cd apps/backend
npm run seed:generate -- src/seeds/SeedName
```

### Sử dụng TypeORM migration (Cách cũ)
```bash
cd apps/backend
npm run migration:seed
```

## Lưu ý quan trọng

⚠️ **Warning**: Script này sẽ xóa toàn bộ dữ liệu hiện tại và tạo lại từ đầu!

### Trước khi chạy seed:
1. Đảm bảo database đã được tạo
2. Đảm bảo migrations đã được chạy
3. Backup dữ liệu quan trọng (nếu có)

### Sau khi chạy seed:
1. Kiểm tra dữ liệu đã được tạo đúng
2. Test các chức năng với tài khoản mẫu
3. Cập nhật currentTeams và currentParticipants nếu cần

## Test các chức năng

### Admin
- Login: admin@pickleball.com / password123
- Phê duyệt users, tournaments
- Quản lý hệ thống

### Organizer
- Login: organizer1@pickleball.com / password123
- Tạo và quản lý tournaments
- Phê duyệt đăng ký

### Athlete
- Login: athlete1@pickleball.com / password123
- Đăng ký tham gia tournaments
- Xem trạng thái đăng ký

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra thông tin kết nối trong .env
- Đảm bảo PostgreSQL đang chạy

### Lỗi permission
- Đảm bảo user database có quyền tạo/xóa tables
- Kiểm tra quyền ghi vào database

### Lỗi duplicate key
- Script sẽ xóa dữ liệu cũ trước khi tạo mới
- Nếu vẫn lỗi, kiểm tra constraints trong database 