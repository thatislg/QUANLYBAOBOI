# BD-004: Thiết Kế API

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Tên dự án** | Học Tập Cho Con / 子供の学習アプリ |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **API Style** | RESTful + Server Actions |
| **Base URL** | `/api/v1` |

---

## 2. API Endpoints Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           API STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  /api/v1                                                                │
│  ├── /auth                                                              │
│  │   ├── POST /login              # Đăng nhập                          │
│  │   ├── POST /logout             # Đăng xuất                          │
│  │   ├── POST /magic-link         # Gửi magic link                     │
│  │   └── GET  /session            # Lấy session hiện tại               │
│  │                                                                      │
│  ├── /users                                                           │
│  │   ├── GET    /                 # Danh sách users (admin)            │
│  │   ├── GET    /:id              # Chi tiết user                      │
│  │   ├── POST   /                 # Tạo user (admin)                   │
│  │   ├── PATCH  /:id              # Cập nhật user                      │
│  │   └── DELETE /:id              # Xóa user (admin)                   │
│  │                                                                      │
│  ├── /programs                                                        │
│  │   ├── GET    /                 # Danh sách chương trình             │
│  │   ├── GET    /:id              # Chi tiết chương trình              │
│  │   ├── GET    /:id/lessons      # Danh sách bài học                  │
│  │   ├── POST   /                 # Tạo chương trình (admin)           │
│  │   ├── PATCH  /:id              # Cập nhật (admin)                   │
│  │   └── DELETE /:id              # Xóa (admin)                        │
│  │                                                                      │
│  ├── /lessons                                                         │
│  │   ├── GET    /:id              # Chi tiết bài học                   │
│  │   ├── GET    /:id/content      # Nội dung bài học                   │
│  │   ├── POST   /                 # Tạo bài học (admin)                │
│  │   ├── PATCH  /:id              # Cập nhật (admin)                   │
│  │   └── POST   /:id/submit       # Nộp bài                            │
│  │                                                                      │
│  ├── /progress                                                        │
│  │   ├── GET    /                 # Tiến độ của user hiện tại          │
│  │   ├── GET    /:userId          # Tiến độ của user cụ thể (admin)    │
│  │   └── POST   /sync             # Đồng bộ offline data               │
│  │                                                                      │
│  ├── /rewards                                                         │
│  │   ├── GET    /                 # Thông tin reward của user          │
│  │   ├── GET    /items            # Danh sách phần thưởng              │
│  │   └── POST   /redeem           # Đổi phần thưởng                    │
│  │                                                                      │
│  └── /reports                                                         │
│      ├── GET    /                 # Danh sách báo cáo                  │
│      ├── GET    /:id              # Chi tiết báo cáo                   │
│      ├── GET    /:id/pdf          # Tải PDF                            │
│      └── POST   /generate         # Tạo báo cáo mới                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Chi tiết API

### 3.1 Authentication APIs

#### POST /api/v1/auth/login

**Request:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "displayName": "Em Bé",
      "role": "student",
      "languagePref": "vi",
      "avatarUrl": "https://..."
    },
    "session": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresAt": "2026-03-17T20:00:00Z"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không đúng"
  }
}
```

---

#### POST /api/v1/auth/magic-link

**Request:**
```json
{
  "email": "student@example.com",
  "redirectTo": "/dashboard"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Magic link đã được gửi đến email của bạn"
}
```

---

### 3.2 User APIs

#### GET /api/v1/users

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `role` | string | Lọc theo role (student/admin) |
| `page` | number | Trang hiện tại (default: 1) |
| `limit` | number | Số item mỗi trang (default: 20) |
| `search` | string | Tìm kiếm theo tên/email |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "student@example.com",
        "displayName": "Em Bé",
        "role": "student",
        "isActive": true,
        "createdAt": "2026-03-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

#### POST /api/v1/users

**Request:**
```json
{
  "email": "newstudent@example.com",
  "password": "tempPassword123",
  "fullName": "Nguyễn Văn A",
  "displayName": "Bé A",
  "role": "student",
  "parentEmail": "parent@example.com"
}
```

**Validation Schema (Zod):**
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(255),
  displayName: z.string().min(2).max(100),
  role: z.enum(['student', 'admin']),
  parentEmail: z.string().email().optional()
});
```

---

### 3.3 Program APIs

#### GET /api/v1/programs

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": "uuid",
        "title": {
          "ja": "読む練習",
          "vi": "Luyện Đọc"
        },
        "description": {
          "ja": "日本語の読解力を向上させる",
          "vi": "Nâng cao kỹ năng đọc hiểu tiếng Nhật"
        },
        "iconUrl": "/icons/reading.png",
        "color": "#4A90D9",
        "lessonCount": 20,
        "completedCount": 5,
        "progress": 25
      }
    ]
  }
}
```

---

### 3.4 Lesson APIs

#### GET /api/v1/lessons/:id/content

**Response (200 OK) - Reading Lesson:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "uuid",
      "type": "reading",
      "title": {
        "ja": "春の一日",
        "vi": "Một ngày mùa xuân"
      }
    },
    "content": {
      "paragraphs": [
        {
          "id": "p1",
          "jaText": "春の一日...",
          "viText": "Một ngày mùa xuân...",
          "audioStart": 0,
          "audioEnd": 5.5
        }
      ],
      "audioUrl": "https://storage.supabase.co/audio/lesson1.mp3",
      "vocabulary": [
        {
          "word": "公園",
          "reading": "こうえん",
          "meaning": "Công viên",
          "example": "公園へ行きます"
        }
      ]
    }
  }
}
```

**Response (200 OK) - Math Lesson:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "uuid",
      "type": "math",
      "title": {
        "ja": "足し算",
        "vi": "Phép cộng"
      }
    },
    "content": {
      "question": {
        "ja": "3 + 2 = ?",
        "vi": "3 + 2 = ?",
        "visualAids": [
          {
            "type": "image",
            "url": "/images/apple.png",
            "count": 3
          }
        ]
      },
      "interactionType": "drag_drop",
      "canvasConfig": {
        "width": 800,
        "height": 600,
        "background": "grid",
        "tools": ["drag", "draw", "erase"]
      },
      "hints": [
        {"order": 1, "text": {"ja": "指を使って数えてみよう", "vi": "Dùng ngón tay để đếm nhé"}}
      ]
    }
  }
}
```

---

#### POST /api/v1/lessons/:id/submit

**Request:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "answer": "5",
      "timeSpent": 30
    }
  ],
  "canvasData": {
    "strokes": [],
    "dragItems": [
      {"itemId": "apple1", "targetId": "answerBox"}
    ]
  },
  "totalTimeSpent": 120,
  "deviceInfo": {
    "type": "ipad",
    "screenSize": "1024x768"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "score": 100,
      "correctCount": 1,
      "wrongCount": 0,
      "timeSpent": 120,
      "completedAt": "2026-03-17T10:30:00Z"
    },
    "rewards": {
      "starsEarned": 10,
      "totalStars": 150,
      "unlockedAchievements": []
    },
    "nextLesson": {
      "id": "next-lesson-uuid",
      "title": "Bài tiếp theo"
    }
  }
}
```

---

### 3.5 Progress APIs

#### POST /api/v1/progress/sync

**Request:**
```json
{
  "syncData": [
    {
      "lessonId": "uuid",
      "status": "completed",
      "score": 90,
      "timeSpent": 300,
      "completedAt": "2026-03-17T09:00:00Z",
      "offlineId": "temp-uuid-1"
    }
  ],
  "deviceId": "device-uuid",
  "lastSyncAt": "2026-03-17T00:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "synced": [
      {
        "offlineId": "temp-uuid-1",
        "serverId": "server-uuid-1",
        "status": "synced"
      }
    ],
    "conflicts": [],
    "serverTime": "2026-03-17T10:35:00Z"
  }
}
```

---

### 3.6 Reward APIs

#### GET /api/v1/rewards

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "totalStars": 150,
    "totalPoints": 1500,
    "history": [
      {
        "id": "uuid",
        "type": "earned",
        "amount": 10,
        "source": "lesson_completion",
        "sourceId": "lesson-uuid",
        "timestamp": "2026-03-17T10:30:00Z"
      },
      {
        "id": "uuid",
        "type": "redeemed",
        "amount": 50,
        "rewardItemId": "reward-uuid",
        "timestamp": "2026-03-16T15:00:00Z"
      }
    ]
  }
}
```

---

#### POST /api/v1/rewards/redeem

**Request:**
```json
{
  "rewardItemId": "reward-uuid",
  "note": "Con muốn đổi thưởng này"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "uuid",
      "rewardItemId": "reward-uuid",
      "starCost": 50,
      "redeemedAt": "2026-03-17T10:40:00Z",
      "status": "pending_approval"
    },
    "remainingStars": 100
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STARS",
    "message": "Bạn không đủ sao để đổi phần thưởng này",
    "required": 50,
    "current": 30
  }
}
```

---

### 3.7 Report APIs

#### GET /api/v1/reports

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | daily/weekly/monthly |
| `from` | date | Từ ngày |
| `to` | date | Đến ngày |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "type": "daily",
        "date": "2026-03-17",
        "summary": {
          "totalLessons": 5,
          "completedLessons": 3,
          "totalTime": 3600,
          "averageScore": 85,
          "starsEarned": 30
        },
        "pdfUrl": "https://storage.supabase.co/reports/..."
      }
    ]
  }
}
```

---

## 4. Error Handling

### 4.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Thông báo lỗi bằng tiếng Việt",
    "details": {
      "field": "email",
      "issue": "Email không hợp lệ"
    }
  }
}
```

### 4.2 HTTP Status Codes

| Status | Code | Mô tả |
|--------|------|-------|
| 200 | OK | Thành công |
| 201 | Created | Tạo mới thành công |
| 400 | Bad Request | Request không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập |
| 403 | Forbidden | Không có quyền |
| 404 | Not Found | Không tìm thấy resource |
| 409 | Conflict | Xung đột dữ liệu |
| 422 | Unprocessable | Validation error |
| 500 | Server Error | Lỗi server |

### 4.3 Error Codes

| Code | Mô tả |
|------|-------|
| `INVALID_CREDENTIALS` | Sai email/mật khẩu |
| `UNAUTHORIZED` | Chưa đăng nhập |
| `FORBIDDEN` | Không đủ quyền |
| `VALIDATION_ERROR` | Lỗi validate dữ liệu |
| `RESOURCE_NOT_FOUND` | Không tìm thấy resource |
| `INSUFFICIENT_STARS` | Không đủ sao |
| `RATE_LIMITED` | Quá nhiều request |
| `OFFLINE_SYNC_ERROR` | Lỗi đồng bộ offline |

---

## 5. Authentication

### 5.1 JWT Token

```
Authorization: Bearer <access_token>
```

### 5.2 Refresh Token Flow

```
┌─────────┐                              ┌─────────┐
│ Client  │                              │ Server  │
└────┬────┘                              └────┬────┘
     │                                         │
     │ 1. Request with expired access token    │
     │ ──────────────────────────────────────▶ │
     │                                         │
     │ 2. Return 401 + token_expired           │
     │ ◀────────────────────────────────────── │
     │                                         │
     │ 3. POST /auth/refresh                   │
     │    { refreshToken }                     │
     │ ──────────────────────────────────────▶ │
     │                                         │
     │ 4. Return new access token              │
     │ ◀────────────────────────────────────── │
     │                                         │
     │ 5. Retry original request               │
     │ ──────────────────────────────────────▶ │
     │                                         │
```

---

## 6. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/*` | 5 requests | 1 phút |
| `/api/*` (GET) | 100 requests | 1 phút |
| `/api/*` (POST/PUT/PATCH) | 30 requests | 1 phút |
| `/progress/sync` | 10 requests | 1 phút |
