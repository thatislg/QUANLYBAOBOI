# DD-005: Module Phần Thưởng (Rewards Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Phần Thưởng (Rewards) |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mô tả
Module Phần Thưởng triển khai hệ thống gamification với điểm Sao (Stars), cho phép học sinh tích lũy điểm và đổi lấy các phần thưởng thực tế do phụ huynh thiết lập.

### 2.2 Yêu cầu chức năng

| ID | Chức năng | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| GAME-01 | Hệ thống điểm Sao | Tích lũy Sao sau mỗi bài tập | P1 |
| GAME-02 | Đổi phần thưởng | Đổi Sao lấy phần thưởng thực | P1 |
| GAME-03 | Quản lý phần thưởng | Admin tạo/cấu hình phần thưởng | P1 |
| GAME-04 | Phê duyệt | Phụ huynh phê duyệt yêu cầu đổi thưởng | P2 |
| GAME-05 | Lịch sử | Xem lịch sử tích lũy và đổi thưởng | P2 |

---

## 3. Component Structure

```
app/
├── (main)/
│   ├── rewards/
│   │   └── page.tsx                 # Trang phần thưởng (student view)
│   └── dashboard/
│       └── page.tsx                 # Menu chính (hiển thị số sao)
│
├── (admin)/
│   └── rewards/
│       ├── page.tsx                 # Quản lý phần thưởng
│       └── redemptions/
│           └── page.tsx             # Phê duyệt đổi thưởng

components/
├── rewards/
│   ├── RewardStore.tsx              # Cửa hàng phần thưởng
│   ├── RewardCard.tsx               # Card phần thưởng
│   ├── StarBalance.tsx              # Hiển thị số dư Sao
│   ├── RedemptionModal.tsx          # Modal xác nhận đổi thưởng
│   └── LevelProgress.tsx            # Thanh tiến độ cấp độ

hooks/
├── useRewards.ts                    # Hook quản lý phần thưởng
└── useRedemption.ts                 # Hook đổi thưởng
```

---

## 4. Chi tiết Implementation

### 4.1 Data Models

```typescript
// types/rewards.ts
export interface Reward {
  id: string;
  userId: string;
  totalStars: number;
  currentLevel: number;
  levelProgress: number;
}

export interface RewardItem {
  id: string;
  title: { ja: string; vi: string };
  starCost: number;
  isAvailable: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardItemId: string;
  starCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}
```

### 4.2 Star Calculation

```typescript
// lib/rewards/starCalculator.ts
export function calculateStarsForLesson(
  score: number,
  timeSpent: number,
  difficulty: number,
  isFirstAttempt: boolean,
  streakDays: number
): number {
  // Base stars từ điểm số
  let stars = Math.floor(score / 10);
  
  // Bonus hoàn thành
  if (score >= 80) stars += 2;
  if (score === 100) stars += 3;
  
  // Bonus lần đầu làm
  if (isFirstAttempt) stars += 1;
  
  // Bonus streak
  if (streakDays >= 7) stars += 5;
  else if (streakDays >= 3) stars += 2;
  
  return Math.min(stars, 20); // Tối đa 20 sao/bài
}
```

---

## 5. Checklist

- [ ] Star earning logic
- [ ] Reward store UI
- [ ] Redemption flow
- [ ] Admin approval
- [ ] Level system
- [ ] Confetti animation
