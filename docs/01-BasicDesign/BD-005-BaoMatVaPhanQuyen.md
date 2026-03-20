# BD-005: Bảo Mật và Phân Quyền

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Security Level** | Standard (Children's education app) |

---

## 2. Mô hình phân quyền (RBAC)

### 2.1 Các vai trò (Roles)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROLE HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                           ┌───────────┐                                 │
│                           │   Admin   │                                 │
│                           │ (Quản trị)│                                 │
│                           │   👨‍🏫     │                                 │
│                           └─────┬─────┘                                 │
│                                 │                                       │
│                    ┌────────────┼────────────┐                          │
│                    │            │            │                          │
│                    ▼            ▼            ▼                          │
│              ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│              │ Parent  │  │ Parent  │  │  User   │                      │
│              │(Phụ huynh)│ │(Phụ huynh)│ │(Giáo viên)│                     │
│              │  👨‍👩‍👧   │  │  👨‍👩‍👧‍👦   │  │  👩‍🏫   │                      │
│              └────┬────┘  └────┬────┘  └─────────┘                      │
│                   │            │                                       │
│                   ▼            ▼                                       │
│              ┌─────────┐  ┌─────────┐                                  │
│              │ Student │  │ Student │                                  │
│              │ (Học sinh)│  │ (Học sinh)│                                  │
│              │   🧒    │  │   👧    │                                  │
│              └─────────┘  └─────────┘                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Chi tiết quyền theo vai trò

| Chức năng | Admin | Parent | Student |
|-----------|-------|--------|---------|
| **Quản lý Users** | | | |
| Tạo/sửa/xóa tài khoản học sinh | ✅ | ✅ (chỉ của mình) | ❌ |
| Tạo/sửa/xóa tài khoản admin | ✅ | ❌ | ❌ |
| Reset mật khẩu | ✅ | ✅ (chỉ của mình) | ❌ |
| **Nội dung học tập** | | | |
| Xem danh sách chương trình | ✅ | ✅ | ✅ |
| Tạo/sửa/xóa chương trình | ✅ | ❌ | ❌ |
| Tạo/sửa/xóa bài học | ✅ | ❌ | ❌ |
| Làm bài tập | ❌ | ❌ | ✅ |
| **Tiến độ & Báo cáo** | | | |
| Xem tiến độ của mình | ✅ | ✅ | ✅ |
| Xem tiến độ học sinh | ✅ | ✅ (con mình) | ❌ |
| Xuất báo cáo PDF | ✅ | ✅ (con mình) | ❌ |
| **Hệ thống phần thưởng** | | | |
| Cấu hình phần thưởng | ✅ | ✅ | ❌ |
| Đổi phần thưởng | ❌ | ❌ | ✅ |
| Phê duyệt đổi thưởng | ✅ | ✅ | ❌ |
| **Parental Control** | | | |
| Cài đặt giới hạn thời gian | ✅ | ✅ (cho con) | ❌ |
| Cài đặt khung giờ học | ✅ | ✅ (cho con) | ❌ |
| Xem lịch sử hoạt động | ✅ | ✅ (con mình) | ❌ |

---

## 3. Bảo mật cấp ứng dụng

### 3.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION SEQUENCE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐    ┌─────────┐    │
│  │  User   │         │  Next   │         │Supabase │    │   DB    │    │
│  │ (Client)│         │  Server │         │  Auth   │    │(PostgreSQL)│  │
│  └────┬────┘         └────┬────┘         └────┬────┘    └────┬────┘    │
│       │                   │                   │               │         │
│       │ 1. Login request  │                   │               │         │
│       │ ─────────────────▶│                   │               │         │
│       │                   │                   │               │         │
│       │                   │ 2. Validate       │               │         │
│       │                   │ ─────────────────▶│               │         │
│       │                   │                   │               │         │
│       │                   │ 3. JWT Token      │               │         │
│       │                   │ ◀─────────────────│               │         │
│       │                   │                   │               │         │
│       │ 4. Set HTTP-only  │                   │               │         │
│       │    cookie         │                   │               │         │
│       │ ◀─────────────────│                   │               │         │
│       │                   │                   │               │         │
│       │ 5. API request    │                   │               │         │
│       │    + Cookie       │                   │               │         │
│       │ ─────────────────▶│                   │               │         │
│       │                   │                   │               │         │
│       │                   │ 6. Verify JWT     │               │         │
│       │                   │ ─────────────────▶│               │         │
│       │                   │                   │               │         │
│       │                   │ 7. User info      │               │         │
│       │                   │ ◀─────────────────│               │         │
│       │                   │                   │               │         │
│       │                   │ 8. Query with RLS │               │         │
│       │                   │ ────────────────────────────────▶│         │
│       │                   │                   │               │         │
│       │                   │ 9. Filtered data  │               │         │
│       │                   │ ◀────────────────────────────────│         │
│       │                   │                   │               │         │
│       │ 10. Response      │                   │               │         │
│       │ ◀─────────────────│                   │               │         │
│       │                   │                   │               │         │
└───────┴───────────────────┴───────────────────┴───────────────┴─────────┘
```

### 3.2 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }
];
```

### 3.3 Cookie Security

```typescript
// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
};
```

---

## 4. Row Level Security (RLS)

### 4.1 RLS Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      RLS IMPLEMENTATION                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                      │
│   │   Client     │                                                      │
│   │  (Browser)   │                                                      │
│   └──────┬───────┘                                                      │
│          │  1. Query: SELECT * FROM progress                            │
│          ▼                                                              │
│   ┌──────────────┐     2. Verify JWT      ┌──────────────┐             │
│   │   Supabase   │ ◀────────────────────▶ │  Auth Server │             │
│   │   Proxy      │                        └──────────────┘             │
│   └──────┬───────┘                                                      │
│          │  3. Extract user_id from JWT                                 │
│          ▼                                                              │
│   ┌──────────────┐     4. Apply RLS Policy                             │
│   │  PostgreSQL  │     WHERE user_id = current_user_id()               │
│   │   Database   │                                                      │
│   │              │     ┌─────────────────────────────────────┐         │
│   │              │     │  RLS Policy:                        │         │
│   │              │     │  CREATE POLICY "Users view own"     │         │
│   │              │     │  ON progress                        │         │
│   │              │     │  FOR SELECT                         │         │
│   │              │     │  USING (user_id = auth.uid());      │         │
│   │              │     └─────────────────────────────────────┘         │
│   └──────┬───────┘                                                      │
│          │  5. Return filtered results                                  │
│          ▼                                                              │
│   ┌──────────────┐                                                      │
│   │   Client     │  Chỉ nhận được data của user đó                      │
│   └──────────────┘                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 RLS Policies Summary

| Bảng | Chính sách | Mô tả |
|------|-----------|-------|
| `users` | `users_select_own` | User chỉ xem được profile của mình |
| `users` | `admin_select_all` | Admin xem được tất cả users |
| `progress` | `progress_select_own` | Chỉ xem được tiến độ của mình |
| `progress` | `admin_select_all_progress` | Admin xem tất cả tiến độ |
| `lessons` | `lessons_select_active` | Ai cũng xem được bài học active |
| `lessons` | `lessons_admin_all` | Admin có full quyền |
| `rewards` | `rewards_select_own` | Chỉ xem được reward của mình |
| `reports` | `reports_select_own_or_child` | Xem báo cáo của mình hoặc con |

### 4.3 Ví dụ RLS Policy chi tiết

```sql
-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT 
    USING (auth_id = auth.uid());

CREATE POLICY "Parent can view children profiles" ON users
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_relationships 
            WHERE parent_id = auth.uid() 
            AND child_id = users.id
        )
    );

-- Progress table policies  
CREATE POLICY "Users can manage own progress" ON progress
    FOR ALL 
    USING (
        user_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Admin bypass (using service role)
-- Admin sử dụng service_role key để bypass RLS
```

---

## 5. Input Validation

### 5.1 Validation Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     VALIDATION LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Layer 1: Client-side (UX)                                             │
│  ├── Immediate feedback                                                 │
│  ├── HTML5 validation                                                   │
│  └── Real-time format check                                             │
│                                                                         │
│  Layer 2: API Gateway                                                   │
│  ├── Request size limits                                                │
│  ├── Rate limiting                                                      │
│  └── Content-Type check                                                 │
│                                                                         │
│  Layer 3: Server (Zod Schema)                                          │
│  ├── Type validation                                                    │
│  ├── Business rules                                                     │
│  └── Sanitization                                                       │
│                                                                         │
│  Layer 4: Database                                                      │
│  ├── Constraint check                                                   │
│  ├── Foreign key validation                                             │
│  └── Trigger validation                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Zod Schema Examples

```typescript
// User creation validation
const createUserSchema = z.object({
  email: z.string()
    .email('Email không hợp lệ')
    .min(5, 'Email quá ngắn')
    .max(255, 'Email quá dài'),
    
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 số'),
    
  fullName: z.string()
    .min(2, 'Tên quá ngắn')
    .max(255, 'Tên quá dài')
    .regex(/^[\p{L}\s]+$/u, 'Tên chỉ chứa chữ cái và khoảng trắng'),
    
  role: z.enum(['student', 'admin', 'parent']),
  
  parentEmail: z.string()
    .email()
    .optional()
    .refine(
      (val) => !val || val !== ctx.data.email,
      'Email phụ huynh không được trùng với email học sinh'
    )
});

// Math exercise submission
const submitExerciseSchema = z.object({
  lessonId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.number()]),
    timeSpent: z.number().int().min(0)
  })),
  canvasData: z.object({
    strokes: z.array(z.any()).optional(),
    dragItems: z.array(z.object({
      itemId: z.string(),
      targetId: z.string()
    })).optional()
  }),
  totalTimeSpent: z.number().int().min(0),
  deviceInfo: z.object({
    type: z.enum(['ipad', 'mobile', 'desktop']),
    screenSize: z.string()
  })
});
```

---

## 6. Bảo mật dữ liệu

### 6.1 Data Classification

| Loại dữ liệu | Ví dụ | Xử lý |
|-------------|-------|-------|
| **PII** | Email, tên | Mã hóa at-rest, TLS in-transit |
| **Sensitive** | Mật khẩu | Hash (bcrypt), không lưu plaintext |
| **Educational** | Bài làm, điểm số | RLS, backup định kỳ |
| **Public** | Tên bài học, mô tả | Không cần bảo vệ đặc biệt |

### 6.2 Encryption

```typescript
// At-rest encryption (Supabase tự động xử lý)
// In-transit: TLS 1.3

// Application-level encryption cho sensitive data
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const encrypt = (text: string, key: Buffer): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};
```

---

## 7. Audit & Logging

### 7.1 Audit Log Schema

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, LOGIN, etc.
    resource_type VARCHAR(50) NOT NULL, -- user, lesson, progress, etc.
    resource_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
```

### 7.2 Các sự kiện cần log

| Sự kiện | Level | Mô tả |
|---------|-------|-------|
| `USER_LOGIN` | INFO | Đăng nhập thành công |
| `USER_LOGIN_FAILED` | WARN | Đăng nhập thất bại |
| `USER_CREATED` | INFO | Tạo user mới |
| `USER_UPDATED` | INFO | Cập nhật user |
| `LESSON_COMPLETED` | INFO | Hoàn thành bài học |
| `REWARD_REDEEMED` | INFO | Đổi phần thưởng |
| `PERMISSION_DENIED` | WARN | Truy cập không được phép |
| `VALIDATION_ERROR` | DEBUG | Lỗi validate |

---

## 8. Security Checklist

### 8.1 Pre-deployment Checklist

- [ ] RLS policies đã được test
- [ ] Tất cả API endpoints có authentication
- [ ] Input validation cho tất cả inputs
- [ ] Security headers đã cấu hình
- [ ] Rate limiting đã bật
- [ ] HTTPS only
- [ ] Secrets không hardcode
- [ ] Dependencies đã quét lỗi bảo mật
- [ ] Error messages không leak thông tin nhạy cảm
- [ ] Session timeout đã cấu hình

### 8.2 Regular Security Tasks

| Task | Tần suất |
|------|----------|
| Review RLS policies | Hàng tháng |
| Rotate secrets | 90 ngày |
| Scan dependencies | Hàng tuần |
| Review audit logs | Hàng tuần |
| Security assessment | Hàng năm |
