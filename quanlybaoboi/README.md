# 子供の学習アプリ / Học Tập Cho Con

Ứng dụng học tập tương tác dành cho trẻ em với các bài đọc và bài toán song ngữ Nhật-Việt

## Giới thiệu

**子供の学習アプリ** (Học Tập Cho Con) là một nền tảng giáo dục trực tuyến được thiết kế đặc biệt cho trẻ em, giúp các em học tiếng Nhật và tiếng Việt thông qua các bài tập tương tác. Với phương pháp học tập dựa trên trò chơi (gamification) và các bài tập được thiết kế cẩn thận, chúng tôi mong muốn tạo ra một môi trường học tập vui vẻ và hiệu quả cho trẻ.

## Tính năng chính

### 📚 Luyện đọc
- Các bài đọc song ngữ Nhật-Việt
- Hỗ trợ Text-to-Speech để phát âm chuẩn
- Tăng cỡ chữ và dịch nghĩa linh hoạt

### 🔢 Luyện toán
- Bài toán tương tác với không gian vẽ
- Nhận diện nét vẽ và phản hồi tức thì
- Hỗ trợ viết tay và kéo thả

### ⭐ Hệ thống phần thưởng
- Tích lũy sao và điểm thưởng
- Đổi điểm lấy phần quà thực tế
- Theo dõi tiến trình học tập

### 📊 Báo cáo tiến độ
- Thống kê điểm số và thời gian học
- Biểu đồ trực quan về tiến độ
- Xuất báo cáo PDF

### 👨‍👩‍👧‍👦 Quản lý phụ huynh
- Thiết lập thời gian học tối đa
- Theo dõi tiến trình của trẻ
- Cảnh báo khi hết thời gian học

### 🌐 Hỗ trợ đa ngôn ngữ
- Giao diện song ngữ Nhật-Việt
- Chuyển đổi ngôn ngữ linh hoạt
- Hỗ trợ học sinh người Nhật và Việt Nam

## Công nghệ sử dụng

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Deployment**: Vercel
- **Database**: Supabase PostgreSQL (kế hoạch tương lai)

## Cấu trúc thư mục

```
src/
├── app/                 # Pages và layout chính
├── components/          # Các thành phần UI tái sử dụng
├── contexts/            # React contexts cho state management
├── public/              # Tài nguyên tĩnh (icon, image)
└── ...
```

## Cách cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở chế độ phát triển:
```bash
npm run dev
```

3. Truy cập http://localhost:3000 để xem ứng dụng

## Triển khai

Ứng dụng có thể được triển khai lên Vercel với một cú click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## Tác giả

Phát triển bởi Development Team cho dự án 子供の学習アプリ / Học Tập Cho Con.

## Giấy phép

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
