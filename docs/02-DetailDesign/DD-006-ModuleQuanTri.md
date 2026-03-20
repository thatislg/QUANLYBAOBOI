# DD-006: Module Quản Trị (Admin Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Quản Trị (Admin) |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mô tả
Module Quản Trị cung cấp giao diện cho phụ huynh/giáo viên để quản lý nội dung học tập, ngườ dùng, và theo dõi tiến độ học sinh.

### 2.2 Yêu cầu chức năng

| ID | Chức năng | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| ADMIN-01 | Quản lý nội dung | Thêm/sửa/xóa bài tập bằng JSON editor | P2 |
| ADMIN-02 | Quản lý users | Tạo/sửa/xóa tài khoản học sinh | P1 |
| ADMIN-03 | Quản lý phần thưởng | Cấu hình phần thưởng, phê duyệt đổi thưởng | P1 |
| ADMIN-04 | Xem báo cáo | Xem tiến độ và báo cáo của học sinh | P1 |
| ADMIN-05 | Parental Control | Cài đặt giới hạn thờ gian học | P1 |

---

## 3. Component Structure

```
app/
├── (admin)/
│   ├── layout.tsx                   # Layout admin với sidebar
│   ├── page.tsx                     # Dashboard admin
│   ├── users/
│   │   ├── page.tsx                 # Danh sách users
│   │   └── [userId]/
│   │       └── edit/
│   │           └── page.tsx         # Sửa user
│   ├── lessons/
│   │   ├── page.tsx                 # Danh sách bài học
│   │   ├── create/
│   │   │   └── page.tsx             # Tạo bài học
│   │   └── [lessonId]/
│   │       └── edit/
│   │           └── page.tsx         # Sửa bài học
│   ├── programs/
│   │   └── page.tsx                 # Quản lý chương trình
│   ├── reports/
│   │   └── page.tsx                 # Xem báo cáo tổng hợp
│   └── settings/
│       └── page.tsx                 # Cài đặt hệ thống

components/
├── admin/
│   ├── AdminSidebar.tsx             # Sidebar navigation
│   ├── AdminHeader.tsx              # Header admin
│   ├── DashboardStats.tsx           # Thống kê dashboard
│   ├── UserTable.tsx                # Bảng danh sách users
│   ├── UserForm.tsx                 # Form tạo/sửa user
│   ├── LessonTable.tsx              # Bảng danh sách bài học
│   ├── LessonEditor.tsx             # JSON editor cho bài học
│   ├── ProgramManager.tsx           # Quản lý chương trình
│   └── ParentalControlPanel.tsx     # Panel parental control
│
├── json-editor/
│   ├── JSONEditor.tsx               # Component JSON editor
│   ├── SchemaValidator.tsx          # Validate schema
│   └── TemplateSelector.tsx         # Chọn template
│
└── data-table/
    ├── DataTable.tsx                # Reusable data table
    ├── Pagination.tsx               # Phân trang
    ├── SortHeader.tsx               # Sort header
    └── FilterInput.tsx              # Input lọc
```

---

## 4. Chi tiết Implementation

### 4.1 Admin Layout

```typescript
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Kiểm tra auth
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Kiểm tra role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', session.user.id)
    .single();
  
  if (userData?.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 4.2 JSON Editor cho Content

```typescript
// components/json-editor/JSONEditor.tsx
'use client';

import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { ZodSchema } from 'zod';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Upload, Download } from 'lucide-react';

interface JSONEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  schema?: ZodSchema;
  height?: string;
  templates?: Array<{ name: string; value: unknown }>;
}

export function JSONEditor({
  value,
  onChange,
  schema,
  height = '500px',
  templates = []
}: JSONEditorProps) {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const validateJSON = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      
      if (schema) {
        const result = schema.safeParse(parsed);
        if (!result.success) {
          setError(result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n'));
          setIsValid(false);
          return false;
        }
      }
      
      setError(null);
      setIsValid(true);
      return true;
    } catch (e) {
      setError('JSON không hợp lệ: ' + (e as Error).message);
      setIsValid(false);
      return false;
    }
  }, [schema]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newValue = value || '';
    setJsonString(newValue);
    
    if (validateJSON(newValue)) {
      onChange(JSON.parse(newValue));
    }
  }, [onChange, validateJSON]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonString), null, 2);
      setJsonString(formatted);
    } catch (e) {
      // Không format nếu JSON lỗi
    }
  }, [jsonString]);

  const handleLoadTemplate = useCallback((templateValue: unknown) => {
    const formatted = JSON.stringify(templateValue, null, 2);
    setJsonString(formatted);
    onChange(templateValue);
    setError(null);
    setIsValid(true);
  }, [onChange]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonString(content);
      if (validateJSON(content)) {
        onChange(JSON.parse(content));
      }
    };
    reader.readAsText(file);
  }, [onChange, validateJSON]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonString]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {templates.length > 0 && (
            <select
              className="border rounded px-3 py-1 text-sm"
              onChange={(e) => {
                const template = templates.find(t => t.name === e.target.value);
                if (template) handleLoadTemplate(template.value);
              }}
            >
              <option value="">Chọn template...</option>
              {templates.map(t => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          )}
          
          <Button variant="outline" size="sm" onClick={handleFormat}>
            Format
          </Button>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" size="sm" asChild>
              <span><Upload className="w-4 h-4 mr-1" /> Import</span>
            </Button>
          </label>
          
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>

        {/* Validation status */}
        {isValid ? (
          <span className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" /> Hợp lệ
          </span>
        ) : (
          <span className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" /> Có lỗi
          </span>
        )}
      </div>

      {/* Validation error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      {/* Editor */}
      <div className="border rounded-lg overflow-hidden">
        <Editor
          height={height}
          defaultLanguage="json"
          value={jsonString}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true
          }}
          theme="vs-light"
        />
      </div>
    </div>
  );
}
```

### 4.3 User Management Table

```typescript
// components/admin/UserTable.tsx
'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserTableProps {
  users: User[];
  onDelete: (userId: string) => void;
}

const roleLabels = {
  student: { label: 'Học sinh', color: 'bg-blue-100 text-blue-800' },
  admin: { label: 'Quản trị', color: 'bg-purple-100 text-purple-800' },
  parent: { label: 'Phụ huynh', color: 'bg-green-100 text-green-800' }
};

export function UserTable({ users, onDelete }: UserTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'fullName',
      header: 'Họ tên',
      cell: (user: User) => (
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.displayName}</p>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      cell: (user: User) => user.email
    },
    {
      key: 'role',
      header: 'Vai trò',
      cell: (user: User) => {
        const role = roleLabels[user.role];
        return (
          <Badge className={role.color}>
            {role.label}
          </Badge>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      cell: (user: User) => (
        <Badge variant={user.isActive ? 'default' : 'secondary'}>
          {user.isActive ? 'Hoạt động' : 'Đã khóa'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      cell: (user: User) => new Date(user.createdAt).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      header: '',
      cell: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" /> Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/reports`)}>
              <UserCheck className="w-4 h-4 mr-2" /> Xem báo cáo
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(user.id)}
              className="text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => router.push('/admin/users/create')}>
          + Thêm ngườ dùng
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        pageSize={10}
      />
    </div>
  );
}
```

### 4.4 Parental Control Panel

```typescript
// components/admin/ParentalControlPanel.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parentalSettingsSchema, type ParentalSettingsFormData } from '@/lib/validation/authSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Calendar, Shield } from 'lucide-react';

interface ParentalControlPanelProps {
  studentId: string;
  initialSettings?: ParentalSettingsFormData;
  onSave: (settings: ParentalSettingsFormData) => Promise<void>;
}

const daysOfWeek = [
  { value: 0, label: 'CN' },
  { value: 1, label: 'T2' },
  { value: 2, label: 'T3' },
  { value: 3, label: 'T4' },
  { value: 4, label: 'T5' },
  { value: 5, label: 'T6' },
  { value: 6, label: 'T7' }
];

export function ParentalControlPanel({ 
  studentId, 
  initialSettings,
  onSave 
}: ParentalControlPanelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const form = useForm<ParentalSettingsFormData>({
    resolver: zodResolver(parentalSettingsSchema),
    defaultValues: initialSettings || {
      studentId,
      dailyTimeLimit: 120,
      allowedHoursStart: '08:00',
      allowedHoursEnd: '20:00',
      blockedDays: [],
      isStrictMode: false
    }
  });

  const onSubmit = async (data: ParentalSettingsFormData) => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await onSave(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const timeLimit = form.watch('dailyTimeLimit');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Đã lưu cài đặt thành công!
          </AlertDescription>
        </Alert>
      )}

      {/* Daily Time Limit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Giới hạn thờ gian mỗi ngày
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{timeLimit} phút</span>
            <span className="text-sm text-muted-foreground">
              {Math.floor(timeLimit / 60)} giờ {timeLimit % 60} phút
            </span>
          </div>
          <Slider
            value={[timeLimit]}
            onValueChange={([value]) => form.setValue('dailyTimeLimit', value)}
            min={15}
            max={480}
            step={15}
          />
          <p className="text-sm text-muted-foreground">
            Học sinh sẽ bị khóa app khi đạt giới hạn này
          </p>
        </CardContent>
      </Card>

      {/* Allowed Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Khung giờ được phép học
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Từ</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register('allowedHoursStart')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Đến</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register('allowedHoursEnd')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocked Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Ngày nghỉ (không học)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {daysOfWeek.map(day => (
              <label
                key={day.value}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer
                  transition-colors
                  ${form.watch('blockedDays').includes(day.value)
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  value={day.value}
                  checked={form.watch('blockedDays').includes(day.value)}
                  onChange={(e) => {
                    const current = form.watch('blockedDays');
                    if (e.target.checked) {
                      form.setValue('blockedDays', [...current, day.value]);
                    } else {
                      form.setValue('blockedDays', current.filter(d => d !== day.value));
                    }
                  }}
                />
                <span className="text-sm font-medium">{day.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strict Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Chế độ nghiêm ngặt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tự động khóa khi hết giờ</p>
              <p className="text-sm text-muted-foreground">
                Học sinh sẽ bị đăng xuất ngay lập tức khi hết thờ gian cho phép
              </p>
            </div>
            <Switch
              checked={form.watch('isStrictMode')}
              onCheckedChange={(checked) => form.setValue('isStrictMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </Button>
    </form>
  );
}
```

---

## 5. API Routes cho Admin

```typescript
// app/api/admin/users/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET: Lấy danh sách users
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Kiểm tra auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Kiểm tra role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', session.user.id)
    .single();
    
  if (userData?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role');

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit)
    }
  });
}

// POST: Tạo user mới
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Kiểm tra auth và role
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Tạo auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Tạo profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      auth_id: authData.user.id,
      email: body.email,
      full_name: body.fullName,
      display_name: body.displayName,
      role: body.role,
      language_pref: body.languagePref || 'vi'
    })
    .select()
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  return NextResponse.json({ data: userData }, { status: 201 });
}
```

---

## 6. Checklist

- [ ] Admin authentication & authorization
- [ ] User CRUD operations
- [ ] JSON Editor for content
- [ ] Lesson/Program management
- [ ] Parental control settings
- [ ] Reports viewing
- [ ] Data validation
- [ ] Audit logging
