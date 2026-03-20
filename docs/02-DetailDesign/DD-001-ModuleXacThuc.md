# DD-001: Module Xác Thực (Authentication Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Authentication |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mục đích
- Quản lý đăng nhập/đăng xuất ngườ dùng
- Phân quyền truy cập (Học sinh, Phụ huynh/Admin)
- Bảo vệ các tài nguyên của hệ thống

### 2.2 Phạm vi
| ID Yêu cầu | Mô tả | Ưu tiên |
|------------|-------|---------|
| AUTH-01 | Đăng nhập user (email/password, magic link) | P0 |
| AUTH-02 | Quản lý user (tạo/sửa/xóa account) | P1 |
| AUTH-03 | Phân quyền truy cập (Student/Admin) | P1 |
| AUTH-04 | Parental Control (giới hạn thờ gian, khung giờ) | P1 |

---

## 3. Component Structure

```
app/
├── (auth)/
│   ├── layout.tsx              # Layout chung cho auth pages
│   ├── login/
│   │   └── page.tsx            # Trang đăng nhập
│   ├── magic-link/
│   │   └── page.tsx            # Gửi magic link
│   └── callback/
│       └── route.ts            # Xử lý callback từ magic link
├── (main)/
│   └── layout.tsx              # Layout chính (có auth check)
└── api/
    └── auth/
        └── [...nextauth]/      # API routes cho auth

components/
├── auth/
│   ├── LoginForm.tsx           # Form đăng nhập
│   ├── MagicLinkForm.tsx       # Form gửi magic link
│   ├── ProtectedRoute.tsx      # HOC bảo vệ route
│   └── RoleGuard.tsx           # Kiểm tra role
│
├── providers/
│   └── AuthProvider.tsx        # Context provider cho auth
│
└── ui/
    ├── PasswordInput.tsx       # Input mật khẩu có toggle
    └── LanguageSwitcher.tsx    # Chuyển đổi ngôn ngữ

hooks/
├── useAuth.ts                  # Hook quản lý auth state
├── usePermissions.ts           # Hook kiểm tra quyền
└── useParentalControl.ts       # Hook parental control

lib/
├── auth/
│   ├── supabase.ts             # Supabase client config
│   ├── session.ts              # Session management
│   └── tokens.ts               # Token utilities
│
└── validation/
    └── authSchema.ts           # Zod schemas
```

---

## 4. Chi tiết Implementation

### 4.1 Database Schema (Liên quan)

```sql
-- Bảng users đã được định nghĩa trong BD-003
-- Thêm bảng cho parental control

CREATE TABLE parental_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_time_limit INTEGER DEFAULT 120, -- phút
    allowed_hours_start TIME DEFAULT '08:00',
    allowed_hours_end TIME DEFAULT '20:00',
    blocked_days INTEGER[] DEFAULT '{}', -- [0, 6] = Chủ nhật, Thứ 7
    is_strict_mode BOOLEAN DEFAULT FALSE, -- Khóa ngay khi hết giờ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id)
);

-- Bảng lưu session tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_active_time INTEGER DEFAULT 0 -- giây
);
```

---

### 4.2 Auth Flow Chi tiết

#### 4.2.1 Login Flow

```typescript
// hooks/useAuth.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 1. Xác thực với Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) throw authError;

      // 2. Lấy thông tin user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();

      if (userError) throw userError;

      // 3. Kiểm tra parental control
      if (userData.role === 'student') {
        const canAccess = await checkParentalControl(userData.id);
        if (!canAccess.allowed) {
          throw new Error(canAccess.reason);
        }
      }

      // 4. Ghi log session
      await logUserSession(userData.id, authData.session.access_token);

      setState({
        user: { ...authData.user, profile: userData },
        isLoading: false,
        error: null
      });

      // 5. Redirect theo role
      const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
      router.push(redirectPath);
      router.refresh();

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: getErrorMessage(error)
        }
      }));
    }
  }, [supabase, router]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }, [supabase, router]);

  return { ...state, login, logout };
}

// Kiểm tra parental control
async function checkParentalControl(userId: string): Promise<AccessCheckResult> {
  const supabase = createClientComponentClient();
  
  const { data: settings } = await supabase
    .from('parental_settings')
    .select('*')
    .eq('student_id', userId)
    .single();

  if (!settings) return { allowed: true };

  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
  const currentDay = now.getDay();

  // Kiểm tra ngày bị chặn
  if (settings.blocked_days.includes(currentDay)) {
    return { 
      allowed: false, 
      reason: 'Hôm nay là ngày nghỉ, không được phép học' 
    };
  }

  // Kiểm tra khung giờ
  if (currentTime < settings.allowed_hours_start || 
      currentTime > settings.allowed_hours_end) {
    return { 
      allowed: false, 
      reason: `Chỉ được học từ ${settings.allowed_hours_start} đến ${settings.allowed_hours_end}` 
    };
  }

  // Kiểm tra giới hạn thời gian
  const { data: sessionData } = await supabase
    .from('user_sessions')
    .select('total_active_time')
    .eq('user_id', userId)
    .gte('started_at', new Date().toISOString().split('T')[0])
    .single();

  const todayUsage = (sessionData?.total_active_time || 0) / 60; // phút
  if (todayUsage >= settings.daily_time_limit) {
    return { 
      allowed: false, 
      reason: `Bạn đã học đủ ${settings.daily_time_limit} phút hôm nay` 
    };
  }

  return { allowed: true, remainingTime: settings.daily_time_limit - todayUsage };
}
```

---

### 4.3 Components

#### 4.3.1 LoginForm

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validation/authSchema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showMagicLink, setShowMagicLink] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-2xl font-bold">子供の学習アプリ</h1>
        <p className="text-muted-foreground">Học Tập Cho Con</p>
      </div>

      {/* Language Switcher */}
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email / メールアドレス
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="pl-10"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Mật khẩu / パスワード
          </Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            error={form.formState.errors.password?.message}
            {...form.register('password')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              {...form.register('rememberMe')}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Ghi nhớ đăng nhập / ログインを記憶
            </Label>
          </div>
          <a href="/forgot-password" className="text-sm text-primary hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập / ログイン'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Hoặc / または
          </span>
        </div>
      </div>

      {/* Magic Link */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowMagicLink(true)}
      >
        Gửi Magic Link / マジックリンクを送信
      </Button>
    </div>
  );
}
```

---

#### 4.3.2 ProtectedRoute HOC

```typescript
// components/auth/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Kiểm tra session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Redirect to login nếu chưa đăng nhập
          const returnUrl = encodeURIComponent(pathname);
          router.push(`/login?returnUrl=${returnUrl}`);
          return;
        }

        // 2. Kiểm tra role nếu có yêu cầu
        if (allowedRoles.length > 0) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', session.user.id)
            .single();

          if (!userData || !allowedRoles.includes(userData.role)) {
            // Redirect về trang không có quyền
            router.push('/unauthorized');
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen cho auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router, pathname, allowedRoles]);

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
```

---

### 4.4 Validation Schemas

```typescript
// lib/validation/authSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  rememberMe: z.boolean().default(false)
});

export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 số'),
  fullName: z.string().min(2).max(255),
  displayName: z.string().min(2).max(100),
  role: z.enum(['student', 'admin', 'parent']),
  parentEmail: z.string().email().optional(),
  languagePref: z.enum(['ja', 'vi']).default('vi')
});

export const parentalSettingsSchema = z.object({
  studentId: z.string().uuid(),
  dailyTimeLimit: z.number().int().min(15).max(480).default(120),
  allowedHoursStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  allowedHoursEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  blockedDays: z.array(z.number().int().min(0).max(6)).default([]),
  isStrictMode: z.boolean().default(false)
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type ParentalSettingsFormData = z.infer<typeof parentalSettingsSchema>;
```

---

### 4.5 Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes không cần auth
const publicRoutes = ['/login', '/magic-link', '/forgot-password', '/auth/callback'];

// Routes cho admin only
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const pathname = request.nextUrl.pathname;

  // Bỏ qua static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    /\.(.*)$/.test(pathname)
  ) {
    return res;
  }

  // Check public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res;
  }

  // Check session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

---

## 5. Testing

### 5.1 Unit Tests

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

jest.mock('@supabase/auth-helpers-nextjs');
jest.mock('next/navigation');

describe('useAuth', () => {
  const mockSignIn = jest.fn();
  const mockSignOut = jest.fn();
  
  beforeEach(() => {
    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
        signOut: mockSignOut
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-1', role: 'student' },
              error: null
            })
          })
        })
      })
    });
  });

  it('should login successfully', async () => {
    mockSignIn.mockResolvedValue({
      data: {
        user: { id: 'auth-1', email: 'test@test.com' },
        session: { access_token: 'token' }
      },
      error: null
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@test.com',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle login error', async () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
```

---

## 6. Checklist

- [ ] Supabase Auth đã cấu hình
- [ ] RLS policies cho bảng users đã tạo
- [ ] Middleware xác thực đã cài đặt
- [ ] Form validation với Zod
- [ ] Error handling đầy đủ
- [ ] Loading states
- [ ] Redirect sau login theo role
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Magic link flow
- [ ] Parental control checks
