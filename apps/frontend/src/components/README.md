# Components Library

Thư viện components được tái cấu trúc để tối ưu hóa việc tái sử dụng và maintain.

## Cấu trúc thư mục

```
components/
├── ui/                    # Shadcn UI components (giữ nguyên)
├── layout/                # Layout components
│   └── Navigation.tsx
├── forms/                 # Form components
│   └── TournamentForm.tsx
├── cards/                 # Card components
│   ├── DataCard.tsx       # Base card component
│   ├── TournamentCard.tsx # Tournament specific card
│   └── EventCard.tsx      # Event specific card
├── modals/                # Modal components
│   └── ConfirmModal.tsx
├── common/                # Common business components
│   ├── StatusBadge.tsx
│   ├── ActionButton.tsx
│   ├── LoadingSpinner.tsx
│   └── EmptyState.tsx
├── auth/                  # Auth components
│   ├── AuthGuard.tsx
│   └── AuthProvider.tsx
└── index.ts               # Export tất cả components
```

## Cách sử dụng

### Import từ index file
```typescript
import { 
  TournamentCard, 
  StatusBadge, 
  ActionButton,
  LoadingSpinner,
  ConfirmModal 
} from '@/components';
```

### Import trực tiếp
```typescript
import { TournamentCard } from '@/components/cards/TournamentCard';
import { StatusBadge } from '@/components/common/StatusBadge';
```

## Components chính

### DataCard
Base component cho tất cả card components:
```typescript
<DataCard
  title="Tiêu đề"
  subtitle="Mô tả"
  variant="default" // hoặc "admin"
  actions={<StatusBadge status="published" />}
>
  {/* Nội dung card */}
</DataCard>
```

### StatusBadge
Component hiển thị trạng thái:
```typescript
<StatusBadge 
  status="published" 
  variant="default" 
  size="md" 
/>
```

### ActionButton
Component button với icon và label tự động:
```typescript
<ActionButton
  variant="approve" // approve, reject, edit, delete, view, add
  onClick={() => handleApprove(id)}
  size="sm"
/>
```

### TournamentCard
Card hiển thị thông tin giải đấu:
```typescript
<TournamentCard
  tournament={tournamentData}
  variant="admin"
  onApprove={handleApprove}
  onReject={handleReject}
  onEdit={handleEdit}
/>
```

### ConfirmModal
Modal xác nhận hành động:
```typescript
<ConfirmModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={handleConfirm}
  title="Xác nhận xóa"
  message="Bạn có chắc chắn muốn xóa?"
  variant="danger"
/>
```

## Migration Guide

### Từ TournamentCard cũ sang mới:
```typescript
// Cũ
import TournamentCard from '@/components/TournamentCard';

// Mới
import { TournamentCard } from '@/components';
// hoặc
import { TournamentCard } from '@/components/cards/TournamentCard';
```

### Từ Navigation cũ sang mới:
```typescript
// Cũ
import Navigation from '@/components/Navigation';

// Mới
import { Navigation } from '@/components';
// hoặc
import { Navigation } from '@/components/layout/Navigation';
```

## Best Practices

1. **Sử dụng shared components**: Luôn sử dụng `StatusBadge`, `ActionButton`, `DataCard` thay vì tạo mới
2. **Consistent styling**: Sử dụng `variant` prop để thay đổi style theo context
3. **Type safety**: Tất cả components đều có TypeScript interfaces
4. **Accessibility**: Components được thiết kế với accessibility in mind

## Adding New Components

1. Tạo component trong thư mục phù hợp
2. Export trong `index.ts`
3. Thêm TypeScript interfaces
4. Thêm documentation trong README này 