# BD-001: Kiến Trúc Tổng Quan Hệ Thống

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Kiến trúc hệ thống

### 2.1 Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   iPad      │  │   Mobile    │  │   Desktop   │               │
│  │ (Primary)   │  │ (Secondary) │  │ (Secondary) │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
│                    Next.js 14 (App Router)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  React UI   │  │   i18n      │  │   PWA       │               │
│  │ Components  │  │   (JA/VI)   │  │   Offline   │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │    Auth     │  │   Lesson    │  │   Report    │               │
│  │   Module    │  │   Module    │  │   Module    │               │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤               │
│  │   Reading   │  │    Math     │  │   Reward    │               │
│  │   Module    │  │   Module    │  │   Module    │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Supabase PostgreSQL                         │   │
│  │  (Database + Auth + Realtime + Storage)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Stack công nghệ

| Layer | Công nghệ | Mục đích |
|-------|-----------|----------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG, API Routes |
| **UI Framework** | Tailwind CSS + shadcn/ui | Styling, Component base |
| **State Management** | Zustand + React Query | Global state, Server state |
| **Database** | Supabase PostgreSQL | Primary database |
| **Authentication** | Supabase Auth | JWT-based auth |
| **Storage** | Supabase Storage | File assets |
| **Realtime** | Supabase Realtime | Live updates |
| **Validation** | Zod | Schema validation |
| **i18n** | next-intl | Đa ngôn ngữ |
| **Canvas** | React-Konva | Tương tác hình học |

---

## 3. Sơ đồ triển khai

### 3.1 Môi trường

```
┌──────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js Application                      │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐   │   │
│  │  │   Build    │ │   Edge     │ │  Serverless    │   │   │
│  │  │  (Static)  │ │ Functions  │ │   Functions    │   │   │
│  │  └────────────┘ └────────────┘ └────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ PostgreSQL   │  │    Auth      │  │   Storage    │       │
│  │   (RLS)      │  │  (JWT/RLS)   │  │   (Assets)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Realtime    │  │ Edge Function│                         │
│  │  (WebSocket) │  │   (Cron)     │                         │
│  └──────────────┘  └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Branching Strategy

```
main ───────●────────●────────●────────●────────●────────► Production
            │        │        │        │        │
            │   ┌────┘        │        │        │
            │   │             │        │        │
develop ────┼───┼─────────────┼────────┼────────┼────────► Staging
            │   │             │        │        │
            │   │   ┌─────────┘        │        │
            │   │   │                  │        │
feature/* ──┘   └───┴──────────────────┴────────┴───────► Features
```

---

## 4. Luồng dữ liệu tổng quan

### 4.1 Luồng xác thực

```
┌─────────┐    Đăng nhập     ┌──────────┐    Verify     ┌─────────┐
│  User   │ ───────────────▶ │ Supabase │ ────────────▶ │  JWT    │
│(Browser)│ ◀─────────────── │   Auth   │ ◀──────────── │ Token   │
└─────────┘   Token/Error    └──────────┘               └─────────┘
     │
     │ RLS Protected Query
     ▼
┌─────────────┐
│  Database   │
│  (Filtered  │
│   by RLS)   │
└─────────────┘
```

### 4.2 Luồng học tập

```
┌──────────┐   Chọn bài    ┌──────────┐   Tải nội dung   ┌──────────┐
│  Học sinh │ ────────────▶ │   Menu   │ ───────────────▶ │  Lesson  │
│           │               │          │                  │  Content │
└──────────┘               └──────────┘                  └────┬─────┘
     ▲                                                        │
     │                                                        │
     │              ┌──────────◀──────────┐                   │
     │              │                     │                   │
┌────┴──────┐  Lưu  │   ┌──────────┐      │  Hoàn thành      │
│  Progress │ ◀─────┼── │  Submit  │ ◀────┘  & Chấm điểm    │
│  (Cache)  │       │   │  Answer  │                        │
└───────────┘       │   └──────────┘                        │
                    │         │                             │
                    │         ▼                             │
                    │   ┌──────────┐   Sync (Online)        │
                    └── │  Result  │ ────────────────────────┘
                        └──────────┘
```

---

## 5. Ràng buộc và giả định

### 5.1 Ràng buộc kỹ thuật

| Ràng buộc | Mô tả |
|-----------|-------|
| **Thiết bị ưu tiên** | iPad 16 inch ngang (1024×768+) |
| **Trình duyệt** | Safari iOS 16+, Chrome 120+ |
| **Kết nối** | Hỗ trợ offline cơ bản |
| **Lưu trữ local** | IndexedDB/LocalStorage |

### 5.2 Giả định

- Người dùng có kết nối internet ổn định trong phần lớn thời gian sử dụng
- Admin (phụ huynh/giáo viên) có quyền quản lý cao hơn học sinh
- Dữ liệu nhạy cảm được bảo vệ bởi RLS

---

## 6. Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- SRS-QUANLYBAOBOI.md
