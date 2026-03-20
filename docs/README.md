# Tài Liệu Thiết Kế - Học Tập Cho Con / 子供の学習アプリ

## Tổng Quan

Đây là tài liệu thiết kế cho hệ thống **Học Tập Cho Con** - ứng dụng học tập dành cho trẻ em tiểu học với tính năng song ngữ Nhật-Việt.

---

## Cấu Trúc Thư Mục

```
docs/
├── 01-BasicDesign/           # Thiết kế cơ bản
│   ├── BD-001-KienTrucTongQuan.md     # Kiến trúc tổng quan
│   ├── BD-002-ThietKeGiaoDien.md      # Thiết kế giao diện
│   ├── BD-003-ThietKeDatabase.md      # Thiết kế cơ sở dữ liệu
│   ├── BD-004-ThietKeAPI.md           # Thiết kế API
│   └── BD-005-BaoMatVaPhanQuyen.md    # Bảo mật và phân quyền
│
├── 02-DetailDesign/          # Thiết kế chi tiết
│   ├── DD-001-ModuleXacThuc.md        # Module Xác thực
│   ├── DD-002-ModuleLuyenDoc.md       # Module Luyện đọc
│   ├── DD-003-ModuleLuyenToan.md      # Module Luyện toán
│   ├── DD-004-ModuleBaoCao.md         # Module Báo cáo
│   ├── DD-005-ModulePhanThuong.md     # Module Phần thưởng
│   └── DD-006-ModuleQuanTri.md        # Module Quản trị
│
└── README.md                 # File này
```

---

## Phân Loại Tài Liệu

### 01. Basic Design (Thiết Kế Cơ Bản)

Tài liệu thiết kế cấp cao, tập trung vào kiến trúc tổng thể và các quyết định thiết kế chính:

| File | Nội dung |
|------|----------|
| BD-001 | Kiến trúc tổng quan hệ thống, stack công nghệ, sơ đồ triển khai |
| BD-002 | Design system, mẫu giao diện các màn hình chính |
| BD-003 | Schema database, RLS policies, triggers |
| BD-004 | REST API endpoints, request/response formats, error handling |
| BD-005 | Mô hình phân quyền RBAC, RLS, security headers, input validation |

### 02. Detail Design (Thiết Kế Chi Tiết)

Tài liệu thiết kế cấp thấp cho từng module chức năng:

| File | Module | Nội dung chính |
|------|--------|----------------|
| DD-001 | Xác Thực | Login, register, magic link, parental control |
| DD-002 | Luyện Đọc | Split pane, TTS, highlight, từ vựng, ghi chú |
| DD-003 | Luyện Toán | Canvas Konva, drag-drop, viết tay, chấm điểm |
| DD-004 | Báo Cáo | Charts, realtime dashboard, PDF export |
| DD-005 | Phần Thưởng | Star system, đổi thưởng, cấp độ, thành tích |
| DD-006 | Quản Trị | JSON editor, user management, parental settings |

---

## Cách Sử Dụng

1. **Đọc theo thứ tự**: Nên đọc Basic Design trước để nắm tổng quan, sau đó đọc Detail Design cho module cần triển khai.

2. **Tham chiếu**: Mỗi file Detail Design có thể đọc độc lập nhưng sẽ tham chiếu đến các quyết định trong Basic Design.

3. **Cập nhật**: Khi có thay đổi, cập nhật cả Basic Design và Detail Design liên quan.

---

## Thông Tin Dự Án

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày tạo** | 2026-03-17 |
| **Kiến trúc** | Next.js + Supabase |
| **Ngôn ngữ** | TypeScript |
| **i18n** | Tiếng Nhật (JA), Tiếng Việt (VI) |

---

## Tài Liệu Tham Khảo

- [SRS-QUANLYBAOBOI.md](../SRS-QUANLYBAOBOI.md) - Bảng định nghĩa yêu cầu phần mềm
