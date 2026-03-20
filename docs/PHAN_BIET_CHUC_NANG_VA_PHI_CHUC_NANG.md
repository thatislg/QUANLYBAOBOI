# Phân Biệt Chức Năng (Functional) và Phi Chức Năng (Non-Functional)

## 1. Định Nghĩa Theo SRS

### 1.1 Yêu Cầu Chức Năng (Functional Requirements)

**Định nghĩa:** Các chức năng, tính năng mà hệ thống **phải thực hiện** - những gì hệ thống "làm".

**Từ SRS (Mục 2):**

| ID | Module | Tính năng | Mô tả |
|----|--------|-----------|-------|
| AUTH-01 | Authentication | Đăng nhập user | Phân quyền: Học sinh + Phụ huynh. Đăng nhập bằng email/password hoặc magic link |
| READ-01 | Luyện đọc | Bài đọc song ngữ | Văn bản Nhật-Việt song song. Tích hợp AI Text-to-Speech |
| MATH-01 | Luyện toán | Bài toán song ngữ | Đề bản Nhật-Việt. Hỗ trợ số, hình học, đo lường, logic |
| GAME-01 | Gamification | Hệ thống phần thưởng | Tích lũy Sao/Point sau mỗi bài tập. Đổi point lấy phần thưởng thực tế |

**Đặc điểm:**
- User có thể **nhìn thấy và tương tác** trực tiếp
- Thể hiện qua **giao diện UI**
- Có thể **test được** qua use cases
- Thay đổi thường ảnh hưởng đến **business logic**

### 1.2 Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

**Định nghĩa:** Các ràng buộc, tiêu chuẩn về **chất lượng** và **hiệu năng** của hệ thống - những gì hệ thống "phải đạt được".

**Từ SRS (Mục 3):**

| ID | Loại | Yêu cầu | Mô tả |
|----|------|---------|-------|
| NF-01 | Hiệu năng | Tải trang < 2s | First Contentful Paint trên iPad 16 ngang < 2 giây |
| NF-02 | Hiệu năng | Tương tác < 100ms | Phản hồi hình minh họa (drag, draw) < 100ms |
| NF-03 | Bảo mật | RLS bắt buộc | Mọi query Supabase phải qua RLS |
| NF-05 | Khả dụng | Cơ chế Offline | Cache bài tập hiện tại bằng IndexedDB/Local Storage |
| NF-06 | UX | i18n Hot switch | Đổi ngôn ngữ JA/VI không reload trang |

**Đặc điểm:**
- User **không tương tác trực tiếp** nhưng **cảm nhận được**
- Thể hiện qua **hiệu năng, độ tin cậy, bảo mật**
- Có thể **đo lường được** (metrics)
- Thay đổi thường ảnh hưởng đến **kiến trúc kỹ thuật**

---

## 2. Sự Khác Biệt Khi Triển Khai: BD vs DD

### 2.1 Trong Basic Design (BD)

**Mục đích:** Xác định **cái gì** cần đạt được (What)

| Loại | Nội dung trong BD | Ví dụ từ dự án |
|------|-------------------|----------------|
| **Functional** | Mô tả tính năng ở mức **tổng quan**, liệt kê các module | "Module Luyện Đọc có tính năng bài đọc song ngữ, TTS, highlight từ" |
| **Non-Functional** | Đặt ra **mục tiêu định lượng**, ràng buộc kỹ thuật | "Thờ gian tải trang < 2s", "Mọi query phải qua RLS" |

**Đặc điểm BD:**
- Dùng ngôn ngữ **dễ hiểu**, ít kỹ thuật
- Tập trung vào **mục tiêu** và **ràng buộc**
- Không đi sâu vào cách implement
- Dành cho: Product Owner, stakeholders, architects

### 2.2 Trong Detail Design (DD)

**Mục đích:** Xác định **làm như thế nào** (How)

| Loại | Nội dung trong DD | Ví dụ từ dự án |
|------|-------------------|----------------|
| **Functional** | **Code cụ thể**, component, API, state management | Component `BilingualText.tsx`, Hook `useTTS.ts`, API `/api/lessons/:id/content` |
| **Non-Functional** | **Cấu hình kỹ thuật**, tối ưu, giám sát | `next.config.js` với security headers, Supabase RLS policies, IndexedDB schema |

**Đặc điểm DD:**
- Dùng ngôn ngữ **kỹ thuật**, code snippets
- Tập trung vào **implementation details**
- Có thể code trực tiếp từ tài liệu
- Dành cho: Developers, DevOps, QA

---

## 3. So Sánh Chi Tiết

### Ví Dụ 1: Tính Năng "Bài Đọc Song Ngữ"

| Giai đoạn | Functional | Non-Functional |
|-----------|------------|----------------|
| **SRS** | READ-01: Văn bản Nhật-Việt song song. Tích hợp TTS | NF-01: Tải trang < 2s. NF-07: Touch & Pencil support |
| **BD** | Mô tả layout Split Pane (trái Nhật - phải Việt). Danh sách component cần thiết. | Yêu cầu responsive cho iPad 16 inch. Font chữ Noto Sans JP + VI. Button tối thiểu 44x44px |
| **DD** | Code `SplitPane.tsx`, `BilingualText.tsx`. Hook `useSyncScroll.ts`. API response format chi tiết. | Config `touch-action: none` cho iPad. Optimize `will-change: transform`. Service Worker cho offline. Metrics tracking |

### Ví Dụ 2: Tính Năng "Đăng Nhập"

| Giai đoạn | Functional | Non-Functional |
|-----------|------------|----------------|
| **SRS** | AUTH-01: Đăng nhập email/password hoặc magic link. Phân quyền HS/Admin | NF-03: RLS bắt buộc. NF-04: Security headers |
| **BD** | Flow diagram đăng nhập. Decision tree phân quyền. Danh sách roles | Yêu cầu JWT, HTTP-only cookies, SameSite=strict. Session timeout 7 ngày |
| **DD** | Code `useAuth.ts`, `LoginForm.tsx`, `middleware.ts`. Supabase Auth integration | Code RLS policies SQL. Config `next.config.js` security headers. Rate limiting 5req/phút |

### Ví Dụ 3: Tính Năng "Canvas Luyện Toán"

| Giai đoạn | Functional | Non-Functional |
|-----------|------------|----------------|
| **SRS** | MATH-02: Hỗ trợ Canvas kéo thả, đếm, nối, luyện viết tay. Phản hồi đúng/sai ngay | NF-02: Tương tác < 100ms. NF-07: Tối ưu cho Apple Pencil |
| **BD** | Component structure: `MathCanvas.tsx`, `DraggableItem.tsx`. Tương tác: drag, draw, erase | Yêu cầu React-Konva hoặc native Canvas. Double buffering cho animation mượt |
| **DD** | Code `MathCanvas.tsx` với React-Konva. Hook `useDrawing.ts`. Hit detection algorithm | Config `fastclick` disable. Optimize `requestAnimationFrame`. Pointer events cho Pencil. Performance monitoring |

---

## 4. Ma Trận Liên Kết BD-DD cho Functional/Non-Functional

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REQUIREMENT TRACEABILITY MATRIX                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SRS                    BD                      DD                      │
│  ────                   ──                      ──                      │
│                                                                         │
│  Functional             Functional Design       Detail Implementation   │
│  ──────────             ────────────────        ─────────────────────   │
│                                                                         │
│  AUTH-01      ───────▶  Auth Architecture  ───▶  useAuth.ts             │
│  (Đăng nhập)            - Flow diagram          - LoginForm.tsx         │
│                         - Role matrix           - middleware.ts         │
│                                                 - Supabase Auth         │
│                                                                         │
│  READ-01      ───────▶  Reading Layout     ───▶  SplitPane.tsx          │
│  (Bài đọc)              - Component list        - BilingualText.tsx     │
│                         - Data flow             - useTTS.ts             │
│                                                 - TextTokenizer.ts      │
│                                                                         │
│  MATH-02      ───────▶  Canvas Arch        ───▶  MathCanvas.tsx         │
│  (Tương tác)            - Tool palette          - useDrawing.ts         │
│                         - Interaction map       - HitDetection.ts       │
│                                                 - AnswerValidator.ts    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Non-Functional         Constraint Design       Technical Spec          │
│  ──────────────         ────────────────        ───────────────         │
│                                                                         │
│  NF-01        ───────▶  Performance Goal   ───▶  next.config.js         │
│  (< 2s load)            - Target: 2s            - Image optimization    │
│                         - Device: iPad          - Code splitting        │
│                                                 - Lazy loading          │
│                                                                         │
│  NF-03        ───────▶  Security Policy    ───▶  RLS Policies SQL       │
│  (RLS Required)         - Must have RLS         - auth.users()          │
│                         - All tables            - JWT validation        │
│                                                 - Row policies          │
│                                                                         │
│  NF-05        ───────▶  Offline Strategy   ───▶  IndexedDB schema       │
│  (Offline)              - Cache strategy        - Service Worker        │
│                         - Sync logic            - Sync algorithm        │
│                                                 - Conflict resolution   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Checklist Phân Biệt Khi Viết Tài Liệu

### Khi Viết BD (Basic Design)

**Functional:**
- [ ] Có mô tả use case không?
- [ ] Có diagram luồng dữ liệu không?
- [ ] Liệt kê đầy đủ các tính năng?
- [ ] Có mô tả input/output?

**Non-Functional:**
- [ ] Có số liệu định lượng (thờ gian, dung lượng, %)?
- [ ] Có liệt kê ràng buộc kỹ thuật?
- [ ] Có đề cập thiết bị mục tiêu?
- [ ] Có yêu cầu bảo mật cấp cao?

### Khi Viết DD (Detail Design)

**Functional:**
- [ ] Có code component cụ thể?
- [ ] Có định nghĩa interface/props?
- [ ] Có mô tả state management?
- [ ] Có API endpoint chi tiết?

**Non-Functional:**
- [ ] Có config file cụ thể?
- [ ] Có SQL/Policy code?
- [ ] Có monitoring/logging setup?
- [ ] Có test performance script?

---

## 6. Tóm Tắt

| Tiêu chí | Functional | Non-Functional |
|----------|------------|----------------|
| **Hỏi gì?** | "Hệ thống làm gì?" | "Hệ thống hoạt động như thế nào?" |
| **BD trả lời** | Làm những tính năng gì | Đạt chuẩn gì, ràng buộc gì |
| **DD trả lời** | Code như thế nào | Config và tối ưu ra sao |
| **Thay đổi ảnh hưởng** | Business logic | Kiến trúc hệ thống |
| **Test** | Unit test, E2E | Performance test, Security audit |

**Quy tắc vàng:**
- **BD** = "Cái gì" + "Tiêu chuẩn gì"
- **DD** = "Code sao" + "Config sao"
