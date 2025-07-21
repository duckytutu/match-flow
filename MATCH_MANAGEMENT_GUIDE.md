# Hướng Dẫn Quản Lý Trận Đấu Pickleball - Phiên Bản Cập Nhật

## Tổng Quan

Hệ thống quản lý trận đấu pickleball đã được cập nhật với các tính năng mới:
- **Gán trọng tài inline** (không cần modal) với Select2 dropdown
- **Bảng điểm kiểu TV** với bố cục 2 đội (xanh/đỏ) và nút lên điểm
- **Quản lý set và trận đấu** với các nút kết thúc
- **Giao diện thân thiện** cho trọng tài và vận động viên

## Các Vai Trò và Quyền Hạn

### 1. Admin
- Quản lý toàn bộ hệ thống
- Tạo và quản lý tất cả giải đấu
- Phân quyền người dùng

### 2. Organizer (Ban Tổ Chức)
- Tạo và quản lý giải đấu
- Tạo các sự kiện trong giải đấu
- **Gán trọng tài inline** cho từng trận đấu
- Cập nhật kết quả trận đấu
- Quản lý trạng thái trận đấu

### 3. Referee (Trọng Tài)
- Xem danh sách trận đấu được giao
- Cập nhật điểm số real-time
- Kết thúc set và trận đấu
- Quản lý bảng điểm kiểu TV

### 4. Athlete (Vận Động Viên)
- Xem trận đấu trong giải đấu tham gia
- Theo dõi kết quả và bảng điểm

## Tính Năng Mới

### 1. Gán Trọng Tài Inline (Select2 Style)

**Trang:** `/tournaments/[id]/events/[eventId]/matches`

- **Không cần modal**: Gán trọng tài trực tiếp trên danh sách
- **Select2 dropdown**: Tìm kiếm và chọn trọng tài dễ dàng
- **Cập nhật real-time**: Thay đổi được lưu ngay lập tức

```typescript
// ReactSelect component với tính năng tìm kiếm
<ReactSelect
  placeholder="Chọn trọng tài..."
  value={match.referee ? {
    value: match.referee.id.toString(),
    label: `${match.referee.firstName} ${match.referee.lastName} (${match.referee.role})`,
    id: match.referee.id,
  } : null}
  onChange={(option) => handleAssignReferee(match.id, option?.id || null)}
  options={[
    { value: '', label: 'Không có trọng tài', id: undefined },
    ...availableReferees.map(referee => ({
      value: referee.id.toString(),
      label: `${referee.firstName} ${referee.lastName} (${referee.role})`,
      id: referee.id,
    })),
  ]}
  isClearable={true}
/>
```

### 2. Bảng Điểm Kiểu TV

**Trang:** `/matches/[id]`

#### Bố Cục:
- **Đội 1**: Nền xanh dương, bên trái
- **Đội 2**: Nền đỏ, bên phải
- **Điểm số lớn**: Hiển thị rõ ràng như trên TV
- **Nút lên điểm**: Mỗi đội có nút "Lên điểm"

#### Tính Năng:
- **Nút lên điểm**: Mỗi lần bấm tăng 1 điểm
- **Kết thúc set**: Lưu điểm hiện tại và bắt đầu set mới
- **Kết thúc trận đấu**: Chọn người thắng và hoàn thành trận đấu
- **Lịch sử set**: Hiển thị tất cả các set đã đấu

```typescript
// Bảng điểm TV style
<div className="bg-white shadow rounded-lg overflow-hidden">
  <div className="bg-gray-800 text-white p-4">
    <h2 className="text-xl font-semibold text-center">BẢNG ĐIỂM</h2>
  </div>
  
  {/* Đội 1 - Nền xanh */}
  <div className="bg-blue-600 text-white p-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold">{match.player1Name}</h3>
        <p className="text-blue-200">Đội 1</p>
      </div>
      <div className="text-right">
        <div className="text-6xl font-bold">{currentSet?.team1Score || 0}</div>
        <Button onClick={() => handleAddPoint('team1')} className="mt-2">
          Lên điểm
        </Button>
      </div>
    </div>
  </div>
  
  {/* Đội 2 - Nền đỏ */}
  <div className="bg-red-600 text-white p-6">
    {/* Tương tự đội 1 */}
  </div>
</div>
```

### 3. Quản Lý Set và Trận Đấu

#### Kết Thúc Set:
- Lưu điểm hiện tại của set
- Tự động tạo set mới nếu cần
- Hiển thị lịch sử các set

#### Kết Thúc Trận Đấu:
- Chọn người thắng
- Cập nhật trạng thái trận đấu
- Lưu kết quả cuối cùng

## API Endpoints

### Quản Lý Trận Đấu

#### 1. Lấy Danh Sách Trận Đấu Theo Sự Kiện
```http
GET /matches/event/{eventId}
Authorization: Bearer {token}
```

#### 2. Lấy Trận Đấu Được Nhóm Theo Bảng
```http
GET /matches/event/{eventId}/grouped
Authorization: Bearer {token}
```

#### 3. Lấy Danh Sách Trọng Tài Có Sẵn
```http
GET /matches/event/{eventId}/available-referees
Authorization: Bearer {token}
```

#### 4. Gán Trọng Tài (Inline)
```http
PATCH /matches/{id}/assign-referee
Authorization: Bearer {token}
Content-Type: application/json

{
  "refereeId": 3
}
```

#### 5. Bắt Đầu Trận Đấu
```http
PATCH /matches/{id}/start
Authorization: Bearer {token}
```

#### 6. Kết Thúc Trận Đấu
```http
PATCH /matches/{id}/end
Authorization: Bearer {token}
Content-Type: application/json

{
  "winner": "Team A"
}
```

### Quản Lý Điểm Số

#### 1. Thêm Điểm Cho Set
```http
POST /scores/match/{id}/set
Authorization: Bearer {token}
Content-Type: application/json

{
  "setNumber": 1,
  "team1Score": 11,
  "team2Score": 9
}
```

#### 2. Cập Nhật Điểm Set
```http
PATCH /scores/{id}/set
Authorization: Bearer {token}
Content-Type: application/json

{
  "team1Score": 12,
  "team2Score": 10
}
```

#### 3. Lấy Điểm Số Trận Đấu
```http
GET /scores/match/{id}
Authorization: Bearer {token}
```

#### 4. Lấy Tổng Điểm Trận Đấu
```http
GET /scores/match/{id}/total
Authorization: Bearer {token}
```

### Truy Cập Theo Vai Trò

#### 1. Trận Đấu Của Trọng Tài
```http
GET /matches/referee/assigned
Authorization: Bearer {token}
```

#### 2. Trận Đấu Của Vận Động Viên
```http
GET /matches/athlete/tournaments
Authorization: Bearer {token}
```

## Giao Diện Frontend

### 1. Trang Quản Lý Trận Đấu
**URL:** `/tournaments/[id]/events/[eventId]/matches`

**Tính năng:**
- Danh sách trận đấu theo sự kiện
- Gán trọng tài inline với Select2
- Cập nhật kết quả (chỉ ban tổ chức)
- Hiển thị trạng thái và thông tin trận đấu

### 2. Trang Chi Tiết Trận Đấu
**URL:** `/matches/[id]`

**Tính năng:**
- Bảng điểm kiểu TV với màu sắc
- Nút lên điểm cho từng đội
- Kết thúc set và trận đấu
- Lịch sử các set đã đấu
- Thông tin chi tiết trận đấu

### 3. Navigation Menu
**Cho Trọng Tài:**
- Trận đấu được giao
- Quản lý bảng điểm

**Cho Vận Động Viên:**
- Trận đấu trong giải đấu
- Theo dõi kết quả

## Workflow Sử Dụng

### 1. Ban Tổ Chức
1. Tạo giải đấu và sự kiện
2. Vào trang quản lý trận đấu
3. Gán trọng tài inline cho từng trận
4. Bắt đầu trận đấu khi cần

### 2. Trọng Tài
1. Đăng nhập và xem trận đấu được giao
2. Vào trang chi tiết trận đấu
3. Sử dụng bảng điểm TV để cập nhật điểm
4. Kết thúc set và trận đấu

### 3. Vận Động Viên
1. Đăng nhập và xem trận đấu trong giải đấu
2. Theo dõi kết quả và bảng điểm
3. Xem lịch sử các set

## Cải Tiến So Với Phiên Bản Trước

### 1. Giao Diện
- **Không cần modal**: Gán trọng tài trực tiếp trên danh sách
- **Select2 dropdown**: Tìm kiếm và chọn trọng tài dễ dàng
- **Bảng điểm TV**: Giao diện chuyên nghiệp như trên TV
- **Màu sắc phân biệt**: Xanh cho đội 1, đỏ cho đội 2

### 2. Trải Nghiệm Người Dùng
- **Real-time updates**: Cập nhật ngay lập tức không cần refresh
- **Nút lên điểm**: Thao tác đơn giản, nhanh chóng
- **Responsive design**: Hoạt động tốt trên mọi thiết bị
- **Role-based access**: Phân quyền rõ ràng theo vai trò

### 3. Tính Năng Kỹ Thuật
- **Inline editing**: Không cần modal cho các thao tác đơn giản
- **State management**: Quản lý trạng thái hiệu quả
- **Error handling**: Xử lý lỗi tốt hơn
- **Performance**: Tối ưu hiệu suất với lazy loading

## Testing

Chạy script test để kiểm tra tất cả tính năng:

```bash
chmod +x test-match-management-updated.sh
./test-match-management-updated.sh
```

Script sẽ test:
- Authentication cho các vai trò
- API endpoints cho quản lý trận đấu
- Gán trọng tài inline
- Quản lý điểm số
- Truy cập theo vai trò

## Kết Luận

Hệ thống quản lý trận đấu pickleball đã được cải tiến đáng kể với:
- Giao diện hiện đại và thân thiện
- Tính năng gán trọng tài inline
- Bảng điểm kiểu TV chuyên nghiệp
- Quản lý set và trận đấu hiệu quả
- Phân quyền rõ ràng theo vai trò

Tất cả tính năng đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng trong môi trường production. 