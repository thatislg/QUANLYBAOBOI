## **BẢNG ĐỊNH NGHĨA YÊU CẦU PHẦN MỀM (SRS)**

**Tên dự án:** 子供の学習アプリ / Học Tập Cho Con

**Phiên bản:** 1.1 (Cập nhật Gamification & Quản lý Phụ huynh)

**Ngày:** 2026-03-17

**Người dùng mục tiêu:** Trẻ em (Lứa tuổi tiểu học) + Phụ huynh/Giáo viên (Admin)

---

### **1. TỔNG QUAN HỆ THỐNG**

| **Mục**                 | **Mô tả**                                    |
| ------------------------------ | ---------------------------------------------------- |
| **Kiến trúc**          | Monolith - Next.js Full Stack (Deployment: Vercel)   |
| **Database**             | Supabase PostgreSQL + Supabase Storage               |
| **Ngôn ngữ**           | TypeScript                                           |
| **i18n**                 | Tiếng Nhật (JA), Tiếng Việt (VI)                 |
| **Thiết bị ưu tiên** | iPad 16 inch ngang (1024×768+), Web browser Windows |
| **Responsive**           | Hỗ trợ secondary: mobile dọc, desktop lớn        |

---

### **2. YÊU CẦU CHỨC NĂNG (Functional Requirements)**

| **ID**       | **Module** | **Tính năng**     | **Mô tả chi tiết**                                                                                                   | **Ưu tiên** | **Ghi chú kỹ thuật**             |
| ------------------ | ---------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------- |
| **AUTH-01**  | Authentication   | Đăng nhập user         | Phân quyền: Học sinh + Phụ huynh (Admin). Đăng nhập bằng email/password hoặc magic link.                             | P0                  | Supabase Auth, Row Level Security (RLS)   |
| **AUTH-02**  | Authentication   | Quản lý user            | Admin tạo/sửa/xóa account học sinh. Reset password. Xem lịch sử đăng nhập.                                           | P1                  | Dashboard admin đơn giản               |
| **AUTH-03**  | Authentication   | Phân quyền truy cập    | Học sinh chỉ thấy chương trình được gán. Admin thấy toàn bộ báo cáo và cài đặt.                            | P1                  | Middleware Next.js + RLS                  |
| **AUTH-04**  | Authentication   | Parental Control          | Cài đặt thời gian học tối đa/ngày hoặc khung giờ cho phép truy cập. Khóa app khi hết giờ.                      | P1                  | Local state kết hợp DB check            |
| **ADMIN-01** | CMS              | Quản lý nội dung       | Giao diện nội bộ để Admin thêm/sửa bài đọc, bài toán bằng JSON editor mà không cần chọc trực tiếp vào DB. | P2                  | React JSON Editor                         |
| **RPT-01**   | Báo cáo        | Tạo báo cáo kết quả  | Tổng hợp điểm số, thời gian học, tiến độ từng môn. Export PDF.                                                    | P1                  | react-pdf                                 |
| **RPT-02**   | Báo cáo        | Báo cáo realtime        | Dashboard xem đang học gì, mất bao lâu, đúng/sai bao nhiêu.                                                           | P2                  | Supabase Realtime                         |
| **READ-01**  | Luyện đọc     | Bài đọc song ngữ      | Văn bản Nhật-Việt song song. Tích hợp AI Text-to-Speech đọc diễn cảm. Highlight từ đang đọc.                    | P0                  | i18n JSON, Web Speech API / 3rd party TTS |
| **READ-02**  | Luyện đọc     | Tương tác bài đọc   | Click từ xem nghĩa, đánh dấu từ khó, ghi chú cá nhân.                                                               | P2                  | Tooltip component                         |
| **MATH-01**  | Luyện toán     | Bài toán song ngữ      | Đề bản Nhật-Việt. Hỗ trợ số, hình học, đo lường, logic.                                                          | P0                  | MathJax / plain text                      |
| **MATH-02**  | Luyện toán     | Không gian tương tác  | Hỗ trợ Canvas: kéo thả, đếm, nối, và**luyện viết tay** (nhận diện nét vẽ). Phản hồi đúng/sai ngay.    | P0                  | React-Konva hoặc native Canvas           |
| **GAME-01**  | Gamification     | Hệ thống phần thưởng | Tích lũy Sao/Point sau mỗi bài tập. Đổi point lấy phần thưởng thực tế do phụ huynh set up (VD: 30p chơi game). | P1                  | Bảng `rewards` trong DB                |
| **COM-01**   | Liên lạc       | Báo cáo tự động      | Tự động tổng hợp hoạt động hàng ngày gửi phụ huynh/giáo viên.                                                   | P2                  | Supabase Edge Functions (Cron job)        |

---

### **3. YÊU CẦU PHI CHỨC NĂNG (Non-Functional Requirements)**

| **ID**    | **Loại** | **Yêu cầu**  | **Mô tả**                                                                                                                   |
| --------------- | --------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **NF-01** | Hiệu năng     | Tải trang < 2s      | First Contentful Paint trên iPad 16 ngang < 2 giây.                                                                               |
| **NF-02** | Hiệu năng     | Tương tác < 100ms | Phản hồi hình minh họa (drag, draw) < 100ms.                                                                                    |
| **NF-03** | Bảo mật       | RLS bắt buộc       | Mọi query Supabase phải qua RLS.                                                                                                  |
| **NF-04** | Lưu trữ       | Quản lý Asset      | File Audio/Image kích thước lớn phải lưu ở Supabase Storage, DB chỉ lưu URL.                                               |
| **NF-05** | Khả dụng      | Cơ chế Offline     | Cache bài tập hiện tại bằng IndexedDB/Local Storage, tự động sync kết quả lên Supabase khi có mạng.                    |
| **NF-06** | UX              | i18n Hot switch      | Đổi ngôn ngữ JA/VI không reload trang, lưu preference user.                                                                   |
| **NF-07** | UX              | Touch & Pencil       | Button min 44×44px, gesture swipe, tối ưu cho Apple Pencil khi viết/vẽ.                                                        |
| **NF-08** | UX              | Animation & UI       | Confetti khi làm đúng, gentle shake khi sai. Hỗ trợ **Eye-care mode** (giảm ánh sáng xanh/dark mode) cho buổi tối. |
| **NF-09** | UX              | System Status        | Hiển thị icon trạng thái mạng (Online/Offline) và cảnh báo pin yếu ngay trong app.                                         |

---

### **4. THIẾT KẾ GIAO DIỆN (UI/UX Specifications)**

| **Màn hình**     | **Layout**       | **Đặc điểm**                                                                                   |
| ------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **Login**          | Centered card          | Logo, 2 input, magic link option, language switcher.                                                     |
| **Menu chính**    | Grid 2-3 cột          | Card môn học: icon, tên JA/VI, progress bar.**Góc phải: Hiển thị số Sao/Point đang có.** |
| **Bài đọc**     | Split pane             | Trái: Nhật, Phải: Việt. Toolbar: audio, font size, toggle song ngữ.                                 |
| **Bài toán**     | Workspace chính giữa | Đề trên, vùng Canvas tương tác (hỗ trợ viết tay) ở dưới. Scratchpad bên phải.             |
| **Phần thưởng** | Modal/Popup            | Danh sách các phần thưởng có thể đổi bằng point (do Admin cấu hình).                         |

**Design system:**

- Typography: Noto Sans JP + Noto Sans Vietnamese
- Color: Pastel friendly (primary: #4A90D9, success: #7ED321, error: #FF6B6B, warning/star: #FFD700)
- Spacing: 8px grid system

---

### **5. CƠ SỞ DỮ LIỆU (Database Schema - Cập nhật)**

| **Bảng**       | **Mục đích**                                             |
| --------------------- | ----------------------------------------------------------------- |
| `users`             | Profile (tên, avatar, role, language_pref, daily_time_limit)     |
| `programs`          | Danh sách chương trình học                                   |
| `lessons`           | Bài học thuộc program                                          |
| `reading_exercises` | Nội dung bài đọc (JSON: ja_text, vi_text, storage_audio_url)  |
| `math_exercises`    | Nội dung bài toán (JSON: question, answer, steps, canvas_data) |
| `progress`          | Tiến độ (user_id, lesson_id, score, time_spent, completed_at)  |
| `rewards`           | Hệ thống điểm (user_id, total_stars, reward_history)          |
| `reports`           | Báo cáo tổng hợp (daily snapshot)                             |

---

### **6. API & TÀI LIỆU**

| **Mục**            | **Quy chuẩn**                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| **API Design**      | RESTful (Next.js App Router API) hoặc Supabase Client                  |
| **Validation**      | Bắt buộc dùng**Zod** để validate JSON payload của bài tập |
| **Version control** | GitHub, branch:`main`, `develop`, `feature/*`                     |

---

### **7. LỘ TRÌNH PHÁT TRIỂN (Roadmap)**

| **Giai đoạn** | **Thời gian** | **Deliverable**                                             |
| --------------------- | -------------------- | ----------------------------------------------------------------- |
| **MVP 1**       | 2 tuần              | Auth, DB schema, Menu, 1 bài đọc mẫu, 1 bài toán có Canvas |
| **MVP 2**       | 2 tuần              | Full CRUD bài tập, tính năng lưu Offline/Sync cơ bản       |
| **V1.0**        | 2 tuần              | Tích hợp Text-to-Speech, Hệ thống Sao/Phần thưởng          |
| **Future**      | -                    | Báo cáo tự động qua email, phân tích điểm yếu bằng AI  |
