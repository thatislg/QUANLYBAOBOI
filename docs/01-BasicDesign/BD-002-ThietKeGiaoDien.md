# BD-002: Thiết Kế Giao Diện (UI/UX Design)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |

---

## 2. Design System

### 2.1 Color Palette

```
┌─────────────────────────────────────────────────────────────────┐
│                      COLOR SYSTEM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Primary: #4A90D9        Success: #7ED321        Warning: #FFD700│
│  ┌─────────┐             ┌─────────┐             ┌─────────┐   │
│  │ ■■■■■■■ │             │ ■■■■■■■ │             │ ■■■■■■■ │   │
│  └─────────┘             └─────────┘             └─────────┘   │
│                                                                 │
│  Error: #FF6B6B          Background: #F5F7FA     Surface: #FFFFFF│
│  ┌─────────┐             ┌─────────┐             ┌─────────┐   │
│  │ ■■■■■■■ │             │ ■■■■■■■ │             │ ■■■■■■■ │   │
│  └─────────┘             └─────────┘             └─────────┘   │
│                                                                 │
│  Text Primary: #1A1A2E   Text Secondary: #6B7280                │
│  ┌─────────┐             ┌─────────┐                            │
│  │ ■■■■■■■ │             │ ■■■■■■■ │                            │
│  └─────────┘             └─────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| **H1** | Noto Sans JP | 32px | 700 | 1.3 |
| **H2** | Noto Sans JP | 24px | 600 | 1.4 |
| **H3** | Noto Sans JP | 20px | 600 | 1.4 |
| **Body** | Noto Sans JP/VI | 16px | 400 | 1.6 |
| **Caption** | Noto Sans JP/VI | 14px | 400 | 1.5 |
| **Button** | Noto Sans JP/VI | 16px | 600 | 1.0 |

### 2.3 Spacing System (8px Grid)

```
space-1: 4px    (0.5 unit)
space-2: 8px    (1 unit)   ← Base
space-3: 12px   (1.5 unit)
space-4: 16px   (2 unit)
space-6: 24px   (3 unit)
space-8: 32px   (4 unit)
space-12: 48px  (6 unit)
space-16: 64px  (8 unit)
```

### 2.4 Breakpoints

| Breakpoint | Width | Mục đích |
|------------|-------|----------|
| **sm** | 640px | Mobile dọc (secondary) |
| **md** | 768px | Mobile ngang / Tablet nhỏ |
| **lg** | 1024px | **iPad 16 inch (PRIMARY)** |
| **xl** | 1280px | Desktop lớn (secondary) |
| **2xl** | 1536px | Desktop widescreen |

---

## 3. Thiết kế màn hình

### 3.1 Màn hình Đăng nhập (Login)

```
┌─────────────────────────────────────────┐
│           [Language Switcher]           │
│              [VI] [JA]                  │
│                                         │
│              ┌─────────┐                │
│              │  LOGO   │                │
│              │   🎓    │                │
│              └─────────┘                │
│                                         │
│         子供の学習アプリ               │
│         Học Tập Cho Con                 │
│                                         │
│         ┌──────────────────┐           │
│         │ 📧 Email         │           │
│         └──────────────────┘           │
│                                         │
│         ┌──────────────────┐           │
│         │ 🔒 Mật khẩu      │           │
│         └──────────────────┘           │
│                                         │
│         [ ] Ghi nhớ đăng nhập          │
│                                         │
│         ┌──────────────────┐           │
│         │    ĐĂNG NHẬP     │           │
│         └──────────────────┘           │
│                                         │
│         ─────── HOẶC ───────           │
│                                         │
│         ┌──────────────────┐           │
│         │  Gửi Magic Link  │           │
│         └──────────────────┘           │
│                                         │
│         Quên mật khẩu?                 │
│                                         │
└─────────────────────────────────────────┘
              1024px (iPad)
```

**Đặc điểm:**
- Centered card layout
- Min-height: 100vh
- Background: Gradient nhẹ (#E3F2FD → #F5F7FA)
- Input focus: Border màu Primary
- Button: Full width, rounded-lg (8px)

---

### 3.2 Màn hình Menu Chính

```
┌─────────────────────────────────────────────────────────────┐
│  🎓 Học Tập Cho Con          ⭐ 150 Sao    ⚙️    👤        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Xin chào, [Tên học sinh]! 👋                       │
│                                                             │
│    ┌──────────────────┐    ┌──────────────────┐           │
│    │                  │    │                  │           │
│    │     📚           │    │     🔢           │           │
│    │                  │    │                  │           │
│    │  Luyện Đọc      │    │  Luyện Toán     │           │
│    │  読む練習        │    │  数学の練習      │           │
│    │                  │    │                  │           │
│    │  ████████░░ 80% │    │  ██████░░░░ 60% │           │
│    │                  │    │                  │           │
│    └──────────────────┘    └──────────────────┘           │
│                                                             │
│    ┌──────────────────┐    ┌──────────────────┐           │
│    │                  │    │                  │           │
│    │     🏆           │    │     📊           │           │
│    │                  │    │                  │           │
│    │  Phần Thưởng    │    │  Báo Cáo        │           │
│    │  報酬            │    │  レポート        │           │
│    │                  │    │                  │           │
│    │  ⭐ Đổi quà     │    │  Xem tiến độ    │           │
│    │                  │    │                  │           │
│    └──────────────────┘    └──────────────────┘           │
│                                                             │
│                    [🎮 Chế độ Eye-care]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        1024px
```

**Đặc điểm:**
- Grid: 2 cột (gap: 24px)
- Card: Rounded-xl (16px), shadow-md
- Card hover: Scale 1.02, shadow-lg
- Progress bar: Height 8px, rounded-full
- Header: Sticky top, z-50

---

### 3.3 Màn hình Bài Đọc (Split Pane)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Quay lại    📚 Bài đọc 1    [🔊] [A+] [A-] [VI/JA]  ⭐   │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│  📖 TIẾNG NHẬT       │  📖 TIẾNG VIỆT                      │
│                      │                                      │
│  春の一日            │  Một ngày mùa xuân                 │
│                      │                                      │
│  昨日はとても        │  Hôm qua là một                    │
│  暖かい春の日        │  ngày xuân ấm áp.                  │
│  でした。            │                                      │
│                      │                                      │
│  私たちは公園へ      │  Chúng tôi đã                      │
│  行きました。        │  đi đến công viên.                 │
│                      │                                      │
│  そこで花を見たり    │  Ở đó chúng tôi                    │
│  ピクニックを        │  ngắm hoa và                       │
│  しました。          │  dã ngoại.                         │
│                      │                                      │
│  ────────────────────┼──────────────────────────────────────┤
│                      │                                      │
│  [🔊 Phát audio]     │  [📖 Từ vựng]                       │
│                      │                                      │
│  公園 (こうえん):    │  Công viên                          │
│  ピクニック:         │  Dã ngoại / Picnic                  │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
        45%                          55%
```

**Đặc điểm:**
- Split pane có thể resize (drag handle)
- Highlight từ đang đọc: Background #FFF3CD
- Click từ: Hiển thị tooltip nghĩa
- Audio: Web Speech API hoặc 3rd party TTS
- Đánh dấu từ khó: Icon ⭐ nhỏ bên cạnh từ

---

### 3.4 Màn hình Bài Toán

```
┌─────────────────────────────────────────────────────────────┐
│  ← Quay lại    🔢 Bài toán 1    [💡 Gợi ý]    ⭐ 50        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📋 ĐỀ BÀI                                         │   │
│  │                                                     │   │
│  │  「あなたは3個のリンゴを持っています。              │   │
│  │   友達が2個くれました。                            │   │
│  │   今、全部で何個ありますか。」                      │   │
│  │                                                     │   │
│  │  "Bạn có 3 quả táo. Bạn bè cho bạn   │   │
│  │   thêm 2 quả nữa. Hỏi bạn có tất cả  │   │
│  │   bao nhiêu quả táo?"                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✏️ VÙNG LÀM BÀI (Canvas/Konva)                    │   │
│  │                                                     │   │
│  │     3  +  2  =  [____]                             │   │
│  │                                                     │   │
│  │     [🍎] [🍎] [🍎]  +  [🍎] [🍎]                  │   │
│  │                                                     │   │
│  │     ┌─────────┐  ┌─────────┐  ┌─────────┐         │   │
│  │     │    3    │  │    4    │  │    5    │         │   │
│  │     │         │  │         │  │         │         │   │
│  │     │  [🔘]   │  │  [○]    │  │  [○]    │         │   │
│  │     └─────────┘  └─────────┘  └─────────┘         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────┐                                       │
│  │  ✏️ Nháp         │  [🗑️ Xóa]  [⬅️ Undo]  [➡️ Redo]     │
│  │  ┌────────────┐  │                                       │
│  │  │            │  │       ┌──────────────────┐           │
│  │  │  Tính      │  │       │    NỘP BÀI       │           │
│  │  │  nhẩm...   │  │       └──────────────────┘           │
│  │  │            │  │                                       │
│  │  └────────────┘  │                                       │
│  └──────────────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Đặc điểm:**
- Canvas tương tác: Hỗ trợ kéo thả, viết tay (Apple Pencil)
- Scratchpad: Mini canvas bên phải để tính nhẩm
- Feedback ngay: Confetti khi đúng, shake khi sai
- Multiple choice: Cards có thể click/tap

---

### 3.5 Modal Phần Thưởng

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    🎉 🎊 🎉                        │   │
│   │                                                     │   │
│   │        CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH!              │   │
│   │                                                     │   │
│   │              Bạn nhận được:                        │   │
│   │                                                     │   │
│   │                 ⭐ +10 Sao                         │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐  │   │
│   │   │  🎯 Phần thưởng có thể đổi:                │  │   │
│   │   │                                             │  │   │
│   │   │  ┌────────┐ ┌────────┐ ┌────────┐         │  │   │
│   │   │  │ 🎮     │ │ 🍦     │ │ 📺     │         │  │   │
│   │   │  │30p game│ │Kem     │ │1h TV   │         │  │   │
│   │   │  │⭐ 50   │ │⭐ 30   │ │⭐ 100  │         │  │   │
│   │   │  │[Đổi]   │ │[Đổi]   │ │[Đổi]   │         │  │   │
│   │   │  └────────┘ └────────┘ └────────┘         │  │   │
│   │   │                                             │  │   │
│   │   └─────────────────────────────────────────────┘  │   │
│   │                                                     │   │
│   │         [Tiếp tục bài tiếp theo]                   │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Đặc điểm:**
- Modal overlay với backdrop blur
- Confetti animation khi mở
- Reward items: Grid 3 cột
- Button đổi: Disabled nếu không đủ sao

---

## 4. Tương tác & Animation

### 4.1 Micro-interactions

| Tình huống | Animation | Thời gian |
|------------|-----------|-----------|
| **Click đúng** | Confetti + Scale up | 500ms |
| **Click sai** | Shake (translateX) | 300ms |
| **Hover card** | Scale 1.02 + Shadow | 200ms |
| **Loading** | Spinner/Pulse | Infinite |
| **Page transition** | Fade + Slide | 300ms |
| **Progress complete** | Fill + Glow | 400ms |

### 4.2 Touch & Gesture

| Gesture | Hành động |
|---------|-----------|
| **Swipe left** | Chuyển bài tiếp theo |
| **Swipe right** | Quay lại bài trước |
| **Pinch** | Zoom canvas (math) |
| **Tap hold** | Hiển thị context menu |
| **Double tap** | Zoom text (reading) |

### 4.3 Eye-care Mode

```css
/* Khi bật chế độ bảo vệ mắt */
.eye-care-mode {
  --bg-primary: #1A1A2E;      /* Dark background */
  --text-primary: #E8E8E8;    /* Light text */
  --accent-color: #7FB3D5;    /* Muted blue */
  filter: brightness(0.8) sepia(0.2);
}
```

---

## 5. Responsive Behavior

### 5.1 iPad 16 inch (PRIMARY - 1024px)

- Layout 2 cột cho menu
- Split pane cho bài đọc
- Full canvas cho bài toán

### 5.2 Mobile dọc (Secondary - < 768px)

```
Menu: Single column stack
Reading: Tab toggle (JA/VI)
Math: Full width, scratchpad dưới
```

### 5.3 Desktop lớn (> 1280px)

```
Max-width container: 1280px
Center content
Larger touch targets
```

---

## 6. Accessibility

### 6.1 Yêu cầu

- WCAG 2.1 Level AA compliance
- Touch target minimum: 44×44px
- Color contrast ratio: 4.5:1 minimum
- Keyboard navigation support
- Screen reader friendly

### 6.2 ARIA Labels

```jsx
// Ví dụ
<button aria-label="Phát audio bài đọc">
  🔊
</button>

<div role="progressbar" aria-valuenow="80" aria-valuemax="100">
  Tiến độ: 80%
</div>
```
