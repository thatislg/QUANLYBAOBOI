# BD-003: Thiết Kế Cơ Sở Dữ Liệu

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Database** | PostgreSQL 15 (Supabase) |

---

## 2. Tổng quan Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SCHEMA OVERVIEW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │    users    │───▶│  programs   │◀───│   lessons   │                 │
│  └──────┬──────┘    └─────────────┘    └──────┬──────┘                 │
│         │                                      │                        │
│         │         ┌────────────────────────────┘                        │
│         │         │                                                   │
│         │    ┌────┴─────────┐    ┌─────────────┐                       │
│         └───▶│   progress   │    │reading_exercises│                   │
│              └──────────────┘    └─────────────┘                       │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   rewards   │◀───│    users    │───▶│  reports    │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐                                    │
│  │math_exercises│   │user_settings│                                    │
│  └─────────────┘    └─────────────┘                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Chi tiết các bảng

### 3.1 users

Lưu trữ thông tin người dùng (học sinh và admin/phụ huynh).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'parent')),
    language_pref VARCHAR(5) DEFAULT 'vi' CHECK (language_pref IN ('ja', 'vi')),
    daily_time_limit INTEGER DEFAULT 120, -- phút/ngày
    allowed_hours_start TIME DEFAULT '08:00',
    allowed_hours_end TIME DEFAULT '20:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_auth_id ON users(auth_id);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | PK, tự sinh |
| `auth_id` | UUID | FK đến Supabase Auth |
| `email` | VARCHAR | Email đăng nhập |
| `full_name` | VARCHAR | Tên đầy đủ |
| `display_name` | VARCHAR | Tên hiển thị (cho trẻ em) |
| `avatar_url` | TEXT | URL avatar |
| `role` | VARCHAR | student/admin/parent |
| `language_pref` | VARCHAR | Ngôn ngữ ưu tiên (ja/vi) |
| `daily_time_limit` | INTEGER | Giới hạn thời gian học/ngày |
| `allowed_hours_*` | TIME | Khung giờ được phép học |

---

### 3.2 programs

Danh sách chương trình học.

```sql
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ja VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_ja TEXT,
    description_vi TEXT,
    icon_url TEXT,
    color VARCHAR(7) DEFAULT '#4A90D9',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_programs_order ON programs(order_index);
CREATE INDEX idx_programs_active ON programs(is_active);
```

---

### 3.3 lessons

Các bài học thuộc chương trình.

```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    title_ja VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_ja TEXT,
    description_vi TEXT,
    lesson_type VARCHAR(20) NOT NULL CHECK (lesson_type IN ('reading', 'math')),
    order_index INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 15, -- phút
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lessons_program ON lessons(program_id);
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_order ON lessons(program_id, order_index);
```

---

### 3.4 reading_exercises

Nội dung bài đọc.

```sql
CREATE TABLE reading_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content JSONB NOT NULL, -- Chi tiết bên dưới
    audio_url TEXT, -- URL file audio
    vocabulary JSONB DEFAULT '[]'::jsonb, -- Danh sách từ vựng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reading_lesson ON reading_exercises(lesson_id);
```

**Cấu trúc JSON content:**

```json
{
  "paragraphs": [
    {
      "id": "p1",
      "ja_text": "春の一日...",
      "vi_text": "Một ngày mùa xuân...",
      "audio_start": 0,
      "audio_end": 5.5
    }
  ],
  "settings": {
    "font_size_default": "medium",
    "highlight_enabled": true
  }
}
```

---

### 3.5 math_exercises

Nội dung bài toán.

```sql
CREATE TABLE math_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    question JSONB NOT NULL, -- Chi tiết bên dưới
    answer JSONB NOT NULL,
    hints JSONB DEFAULT '[]'::jsonb,
    canvas_data JSONB DEFAULT '{}'::jsonb, -- Cấu hình canvas
    interaction_type VARCHAR(30) CHECK (interaction_type IN ('drag_drop', 'draw', 'multiple_choice', 'fill_blank')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_math_lesson ON math_exercises(lesson_id);
```

**Cấu trúc JSON question:**

```json
{
  "question_ja": "3 + 2 = ?",
  "question_vi": "3 + 2 = ?",
  "visual_aids": [
    {
      "type": "image",
      "url": "/images/apple.png",
      "count": 3,
      "draggable": true
    }
  ],
  "interaction": {
    "type": "drag_drop",
    "targets": [
      {"id": "answer_box", "accepts": ["apple"], "max_items": 5}
    ]
  }
}
```

---

### 3.6 progress

Tiến độ học tập của học sinh.

```sql
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    time_spent INTEGER DEFAULT 0, -- giây
    attempts INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    wrong_count INTEGER DEFAULT 0,
    answer_data JSONB DEFAULT '{}'::jsonb, -- Lưu câu trả lời
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_lesson ON progress(lesson_id);
CREATE INDEX idx_progress_status ON progress(status);
```

---

### 3.7 rewards

Hệ thống điểm và phần thưởng.

```sql
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_stars INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    reward_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Reward configuration (admin setup)
CREATE TABLE reward_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ja VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_ja TEXT,
    description_vi TEXT,
    icon_url TEXT,
    star_cost INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Cấu trúc reward_history:**

```json
[
  {
    "id": "uuid",
    "type": "earned", // earned | redeemed
    "amount": 10,
    "source": "lesson_completion",
    "source_id": "lesson_uuid",
    "timestamp": "2026-03-17T10:00:00Z"
  }
]
```

---

### 3.8 reports

Báo cáo tổng hợp.

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly')),
    report_date DATE NOT NULL,
    summary JSONB NOT NULL,
    details JSONB NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_date ON reports(report_date);
CREATE INDEX idx_reports_type ON reports(report_type);
```

**Cấu trúc summary:**

```json
{
  "total_lessons": 5,
  "completed_lessons": 3,
  "total_time": 3600,
  "average_score": 85,
  "stars_earned": 30
}
```

---

### 3.9 user_settings

Cài đặt cá nhân.

```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ui_preferences JSONB DEFAULT '{}'::jsonb,
    notification_settings JSONB DEFAULT '{}'::jsonb,
    parental_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Row Level Security (RLS)

### 4.1 Policies cho bảng `users`

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = auth_id);

-- Admin can view all users
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update own profile (except role)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Admin can insert/update any user
CREATE POLICY "Admin can manage users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );
```

### 4.2 Policies cho bảng `progress`

```sql
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Students can view own progress
CREATE POLICY "Students view own progress" ON progress
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Students can insert/update own progress
CREATE POLICY "Students update own progress" ON progress
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Admin can view all progress
CREATE POLICY "Admin view all progress" ON progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );
```

### 4.3 Policies cho bảng `lessons` và `reading_exercises`

```sql
-- Lessons are viewable by all authenticated users
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lessons" ON lessons
    FOR SELECT TO authenticated USING (is_active = TRUE);

-- Only admin can modify lessons
CREATE POLICY "Admin can manage lessons" ON lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );
```

---

## 5. Triggers và Functions

### 5.1 Auto-update updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... tương tự cho các bảng khác
```

### 5.2 Tự động tạo reward record khi tạo user

```sql
CREATE OR REPLACE FUNCTION create_user_reward()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO rewards (user_id, total_stars, total_points)
    VALUES (NEW.id, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_reward
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_reward();
```

### 5.3 Tính toán báo cáo hàng ngày

```sql
CREATE OR REPLACE FUNCTION generate_daily_report(p_user_id UUID, p_date DATE)
RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_summary JSONB;
    v_details JSONB;
BEGIN
    -- Calculate summary
    SELECT jsonb_build_object(
        'total_lessons', COUNT(*),
        'completed_lessons', COUNT(*) FILTER (WHERE status = 'completed'),
        'total_time', COALESCE(SUM(time_spent), 0),
        'average_score', COALESCE(AVG(score), 0),
        'stars_earned', (
            SELECT COALESCE(SUM((value->>'amount')::int), 0)
            FROM rewards, jsonb_array_elements(reward_history) as value
            WHERE user_id = p_user_id
            AND value->>'type' = 'earned'
            AND (value->>'timestamp')::date = p_date
        )
    )
    INTO v_summary
    FROM progress
    WHERE user_id = p_user_id
    AND last_accessed_at::date = p_date;

    -- Get details
    SELECT jsonb_agg(
        jsonb_build_object(
            'lesson_id', lesson_id,
            'status', status,
            'score', score,
            'time_spent', time_spent
        )
    )
    INTO v_details
    FROM progress
    WHERE user_id = p_user_id
    AND last_accessed_at::date = p_date;

    -- Insert report
    INSERT INTO reports (user_id, report_type, report_date, summary, details)
    VALUES (p_user_id, 'daily', p_date, v_summary, COALESCE(v_details, '[]'::jsonb))
    RETURNING id INTO v_report_id;

    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Migration Script

```sql
-- Run this to initialize the database
-- Order matters due to foreign key constraints

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables in order
-- users (depends on auth.users)
-- programs
-- lessons (depends on programs)
-- reading_exercises (depends on lessons)
-- math_exercises (depends on lessons)
-- progress (depends on users, lessons)
-- rewards (depends on users)
-- reward_items (depends on users)
-- reports (depends on users)
-- user_settings (depends on users)

-- 3. Create indexes

-- 4. Enable RLS and create policies

-- 5. Create triggers
```
