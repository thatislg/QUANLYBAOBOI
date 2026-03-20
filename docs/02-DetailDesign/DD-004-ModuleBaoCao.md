# DD-004: Module Báo Cáo (Reports Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Báo Cáo (Reports) |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mô tả
Module Báo Cáo cung cấp khả năng tổng hợp, phân tích và xuất báo cáo về tiến độ học tập của học sinh cho phụ huynh/giáo viên.

### 2.2 Yêu cầu chức năng

| ID | Chức năng | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| RPT-01 | Tạo báo cáo kết quả | Tổng hợp điểm số, thời gian, tiến độ | P1 |
| RPT-02 | Báo cáo realtime | Dashboard xem đang học gì | P2 |
| RPT-03 | Export PDF | Xuất báo cáo dạng PDF | P1 |
| RPT-04 | Báo cáo tự động | Tự động gửi báo cáo hàng ngày | P2 |

---

## 3. Component Structure

```
app/
├── (main)/
│   └── reports/
│       ├── page.tsx                 # Danh sách báo cáo
│       ├── [reportId]/
│       │   └── page.tsx             # Chi tiết báo cáo
│       └── dashboard/
│           └── page.tsx             # Dashboard realtime
│
├── (admin)/
│   └── reports/
│       ├── page.tsx                 # Quản lý báo cáo (admin)
│       └── students/
│           └── [studentId]/
│               └── page.tsx         # Báo cáo theo học sinh

components/
├── reports/
│   ├── ReportList.tsx               # Danh sách báo cáo
│   ├── ReportCard.tsx               # Card báo cáo
│   ├── ReportDetail.tsx             # Chi tiết báo cáo
│   ├── ProgressChart.tsx            # Biểu đồ tiến độ
│   ├── ScoreDistribution.tsx        # Phân bố điểm số
│   ├── TimeSpentChart.tsx           # Biểu đồ thời gian
│   ├── SubjectBreakdown.tsx         # Phân tích theo môn
│   ├── ComparisonView.tsx           # So sánh tuần/tháng
│   ├── RealtimeDashboard.tsx        # Dashboard realtime
│   ├── ActivityLog.tsx              # Nhật ký hoạt động
│   ├── PDFPreview.tsx               # Xem trước PDF
│   └── ReportFilter.tsx             # Bộ lọc báo cáo
│
├── charts/
│   ├── LineChart.tsx                # Biểu đồ đường
│   ├── BarChart.tsx                 # Biểu đồ cột
│   ├── PieChart.tsx                 # Biểu đồ tròn
│   ├── RadarChart.tsx               # Biểu đồ radar
│   └── Heatmap.tsx                  # Heatmap hoạt động
│
└── pdf/
    ├── PDFDocument.tsx              # Cấu trúc PDF
    ├── PDFStyles.ts                 # Style cho PDF
    └── PDFGenerator.tsx             # Generator PDF

hooks/
├── useReports.ts                    # Hook quản lý báo cáo
├── useRealtimeStats.ts              # Hook thống kê realtime
├── useProgressData.ts               # Hook dữ liệu tiến độ
└── usePDFExport.ts                  # Hook xuất PDF

lib/
├── reports/
│   ├── reportGenerator.ts           # Tạo báo cáo
│   ├── dataAggregator.ts            # Tổng hợp dữ liệu
│   ├── analytics.ts                 # Phân tích dữ liệu
│   └── pdfExport.ts                 # Export PDF
│
└── supabase/
    └── realtime.ts                  # Realtime subscriptions
```

---

## 4. Chi tiết Implementation

### 4.1 Database Schema

```sql
-- reports (đã định nghĩa trong BD-003)
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

-- Bảng tracking hoạt động realtime
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'lesson_start', 'lesson_complete', 'idle', etc.
    lesson_id UUID REFERENCES lessons(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER -- giây
);

-- Bảng snapshot thống kê
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_lessons INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- giây
    total_stars INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    subject_breakdown JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_reports_user_date ON reports(user_id, report_date);
CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_started ON activity_logs(started_at);
CREATE INDEX idx_daily_stats_user ON daily_stats(user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
```

---

### 4.2 Data Models

```typescript
// types/reports.ts

export type ReportType = 'daily' | 'weekly' | 'monthly';

export interface ReportSummary {
  totalLessons: number;
  completedLessons: number;
  totalTime: number; // giây
  averageScore: number;
  starsEarned: number;
  streakDays?: number; // Số ngày học liên tiếp
}

export interface LessonDetail {
  lessonId: string;
  lessonTitle: {
    ja: string;
    vi: string;
  };
  subject: 'reading' | 'math';
  status: 'completed' | 'in_progress' | 'not_started';
  score?: number;
  timeSpent: number;
  completedAt?: string;
  attempts: number;
}

export interface SubjectBreakdown {
  reading: {
    total: number;
    completed: number;
    averageScore: number;
    totalTime: number;
  };
  math: {
    total: number;
    completed: number;
    averageScore: number;
    totalTime: number;
  };
}

export interface Report {
  id: string;
  userId: string;
  reportType: ReportType;
  reportDate: string;
  summary: ReportSummary;
  details: {
    lessons: LessonDetail[];
    subjectBreakdown: SubjectBreakdown;
    dailyBreakdown?: DailyBreakdown[]; // cho weekly/monthly
  };
  pdfUrl?: string;
  createdAt: string;
}

export interface DailyBreakdown {
  date: string;
  totalLessons: number;
  completedLessons: number;
  totalTime: number;
  averageScore: number;
}

export interface RealtimeActivity {
  userId: string;
  userName: string;
  currentActivity: 'idle' | 'reading' | 'math' | 'paused';
  currentLesson?: {
    id: string;
    title: string;
  };
  sessionStartTime: string;
  todayStats: {
    totalTime: number;
    completedLessons: number;
    starsEarned: number;
  };
}

export interface ActivityLogEntry {
  id: string;
  activityType: string;
  lessonId?: string;
  lessonTitle?: string;
  metadata: Record<string, any>;
  startedAt: string;
  endedAt?: string;
  duration?: number;
}
```

---

### 4.3 Main Component: ReportsDashboard

```typescript
// components/reports/ReportsDashboard.tsx
'use client';

import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { ReportList } from './ReportList';
import { ProgressChart } from './ProgressChart';
import { SubjectBreakdown } from './SubjectBreakdown';
import { ScoreDistribution } from './ScoreDistribution';
import { TimeSpentChart } from './TimeSpentChart';
import { RealtimeCard } from './RealtimeCard';
import { ReportFilter } from './ReportFilter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, TrendingUp } from 'lucide-react';

interface ReportsDashboardProps {
  studentId?: string; // Nếu null thì xem của chính mình
}

export function ReportsDashboard({ studentId }: ReportsDashboardProps) {
  const {
    reports,
    currentReport,
    stats,
    isLoading,
    filter,
    setFilter,
    generateReport,
    exportPDF
  } = useReports(studentId);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleGenerateReport = async (type: ReportType) => {
    const report = await generateReport(type);
    if (report) {
      setSelectedReportId(report.id);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo học tập</h1>
          <p className="text-muted-foreground">
            {studentId ? 'Theo dõi tiến độ học sinh' : 'Xem lại quá trình học tập của bạn'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleGenerateReport('daily')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Báo cáo hôm nay
          </Button>
          <Button
            variant="outline"
            onClick={() => exportPDF(selectedReportId)}
            disabled={!selectedReportId}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilter filter={filter} onChange={setFilter} />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Danh sách báo cáo
          </TabsTrigger>
          <TabsTrigger value="realtime">
            Trực tiếp
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Tổng thời gian"
              value={formatDuration(stats.totalTime)}
              trend={stats.timeTrend}
              icon="⏱️"
            />
            <StatCard
              title="Bài đã hoàn thành"
              value={stats.completedLessons}
              trend={stats.lessonsTrend}
              icon="✅"
            />
            <StatCard
              title="Điểm trung bình"
              value={`${stats.averageScore}%`}
              trend={stats.scoreTrend}
              icon="📊"
            />
            <StatCard
              title="Sao đã tích lũy"
              value={stats.totalStars}
              icon="⭐"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart
              data={stats.progressData}
              timeRange={filter.dateRange}
            />
            <SubjectBreakdown
              data={stats.subjectBreakdown}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreDistribution
              scores={stats.scores}
            />
            <TimeSpentChart
              data={stats.dailyTimeData}
            />
          </div>
        </TabsContent>

        {/* Reports List Tab */}
        <TabsContent value="reports">
          <ReportList
            reports={reports}
            selectedId={selectedReportId}
            onSelect={setSelectedReportId}
            onDelete={(id) => {}}
          />
        </TabsContent>

        {/* Realtime Tab */}
        <TabsContent value="realtime">
          <RealtimeCard studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
function StatCard({ title, value, trend, icon }: {
  title: string;
  value: string | number;
  trend?: number;
  icon: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% so với kỳ trước
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
```

---

### 4.4 Realtime Dashboard

```typescript
// components/reports/RealtimeDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RealtimeActivity } from '@/types/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Calculator, Pause, Circle } from 'lucide-react';

interface RealtimeDashboardProps {
  studentId?: string;
}

export function RealtimeDashboard({ studentId }: RealtimeDashboardProps) {
  const supabase = createClientComponentClient();
  const [activity, setActivity] = useState<RealtimeActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const targetId = studentId || 'current-user-id';

    // Subscribe to realtime changes
    const channel = supabase
      .channel('activity_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${targetId}`
        },
        (payload) => {
          // Cập nhật activity khi có thay đổi
          fetchCurrentActivity(targetId);
        }
      )
      .subscribe();

    // Fetch initial data
    fetchCurrentActivity(targetId);

    // Polling backup (mỗi 30 giây)
    const interval = setInterval(() => {
      fetchCurrentActivity(targetId);
    }, 30000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [studentId, supabase]);

  const fetchCurrentActivity = async (userId: string) => {
    try {
      // Lấy hoạt động gần nhất
      const { data: latestActivity } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      // Lấy thống kê hôm nay
      const today = new Date().toISOString().split('T')[0];
      const { data: todayStats } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      // Lấy thông tin user
      const { data: userData } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', userId)
        .single();

      if (latestActivity) {
        setActivity({
          userId,
          userName: userData?.display_name || 'Unknown',
          currentActivity: determineActivityState(latestActivity),
          currentLesson: latestActivity.lesson_id ? {
            id: latestActivity.lesson_id,
            title: latestActivity.metadata?.lesson_title || 'Unknown'
          } : undefined,
          sessionStartTime: latestActivity.started_at,
          todayStats: {
            totalTime: todayStats?.total_time || 0,
            completedLessons: todayStats?.completed_lessons || 0,
            starsEarned: todayStats?.total_stars || 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineActivityState = (activity: any): RealtimeActivity['currentActivity'] => {
    if (activity.ended_at) return 'idle';
    if (activity.metadata?.paused) return 'paused';
    if (activity.activity_type.includes('reading')) return 'reading';
    if (activity.activity_type.includes('math')) return 'math';
    return 'idle';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!activity) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không có dữ liệu hoạt động
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = () => {
    switch (activity.currentActivity) {
      case 'reading': return <BookOpen className="w-5 h-5" />;
      case 'math': return <Calculator className="w-5 h-5" />;
      case 'paused': return <Pause className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getActivityColor = () => {
    switch (activity.currentActivity) {
      case 'reading': return 'bg-blue-500';
      case 'math': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Trạng thái hiện tại
            <span className={`w-3 h-3 rounded-full animate-pulse ${getActivityColor()}`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${getActivityColor()} text-white`}>
              {getActivityIcon()}
            </div>
            <div>
              <p className="font-medium text-lg">
                {activity.currentActivity === 'idle' && 'Đang nghỉ ngơi'}
                {activity.currentActivity === 'reading' && 'Đang học Luyện đọc'}
                {activity.currentActivity === 'math' && 'Đang học Luyện toán'}
                {activity.currentActivity === 'paused' && 'Đang tạm dừng'}
              </p>
              {activity.currentLesson && (
                <p className="text-muted-foreground">
                  {activity.currentLesson.title}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Thờ gian hôm nay</p>
            <p className="text-2xl font-bold">
              {Math.floor(activity.todayStats.totalTime / 60)} phút
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Bài đã xong</p>
            <p className="text-2xl font-bold">
              {activity.todayStats.completedLessons}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Sao kiếm được</p>
            <p className="text-2xl font-bold">
              {activity.todayStats.starsEarned} ⭐
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Info */}
      {activity.currentActivity !== 'idle' && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Phiên học bắt đầu lúc: {new Date(activity.sessionStartTime).toLocaleTimeString('vi-VN')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

### 4.5 PDF Export

```typescript
// lib/reports/pdfExport.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Report } from '@/types/reports';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export async function generatePDF(report: Report): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let y = height - 50;

  // Header
  page.drawText('BÁO CÁO HỌC TẬP', {
    x: 50,
    y,
    size: 24,
    font: fontBold,
    color: rgb(0.29, 0.56, 0.85)
  });
  y -= 40;

  // Date
  page.drawText(
    `Ngày: ${format(new Date(report.reportDate), 'dd/MM/yyyy', { locale: vi })}`,
    {
      x: 50,
      y,
      size: 12,
      font
    }
  );
  y -= 30;

  // Summary Section
  page.drawText('TỔNG QUAN', {
    x: 50,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2)
  });
  y -= 25;

  const summary = report.summary;
  const summaryItems = [
    `Tổng số bài học: ${summary.totalLessons}`,
    `Bài đã hoàn thành: ${summary.completedLessons}`,
    `Tổng thờ gian: ${Math.floor(summary.totalTime / 60)} phút`,
    `Điểm trung bình: ${summary.averageScore}%`,
    `Sao đã tích lũy: ${summary.starsEarned} ⭐`
  ];

  for (const item of summaryItems) {
    page.drawText(item, {
      x: 70,
      y,
      size: 11,
      font
    });
    y -= 18;
  }
  y -= 20;

  // Subject Breakdown
  page.drawText('CHI TIẾT THEO MÔN', {
    x: 50,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2)
  });
  y -= 25;

  const { reading, math } = report.details.subjectBreakdown;
  
  page.drawText('Luyện đọc:', {
    x: 70,
    y,
    size: 12,
    font: fontBold
  });
  y -= 18;
  page.drawText(`  - Hoàn thành: ${reading.completed}/${reading.total}`, { x: 90, y, size: 11, font });
  y -= 16;
  page.drawText(`  - Điểm TB: ${reading.averageScore}%`, { x: 90, y, size: 11, font });
  y -= 16;
  page.drawText(`  - Thờ gian: ${Math.floor(reading.totalTime / 60)} phút`, { x: 90, y, size: 11, font });
  y -= 25;

  page.drawText('Luyện toán:', {
    x: 70,
    y,
    size: 12,
    font: fontBold
  });
  y -= 18;
  page.drawText(`  - Hoàn thành: ${math.completed}/${math.total}`, { x: 90, y, size: 11, font });
  y -= 16;
  page.drawText(`  - Điểm TB: ${math.averageScore}%`, { x: 90, y, size: 11, font });
  y -= 16;
  page.drawText(`  - Thờ gian: ${Math.floor(math.totalTime / 60)} phút`, { x: 90, y, size: 11, font });
  y -= 30;

  // Lesson Details
  if (y > 150) {
    page.drawText('CHI TIẾT BÀI HỌC', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 25;

    for (const lesson of report.details.lessons.slice(0, 5)) {
      if (y < 100) break;
      
      const statusText = lesson.status === 'completed' ? '✓ Hoàn thành' : 
                        lesson.status === 'in_progress' ? '... Đang học' : '○ Chưa học';
      
      page.drawText(`${lesson.lessonTitle.vi} - ${statusText}`, {
        x: 70,
        y,
        size: 10,
        font
      });
      y -= 15;
    }
  }

  // Footer
  page.drawText('© 2026 Học Tập Cho Con - 子供の学習アプリ', {
    x: 50,
    y: 30,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5)
  });

  return await pdfDoc.save();
}
```

---

## 6. Checklist

- [ ] Report generation logic
- [ ] Progress charts (Line, Bar, Pie)
- [ ] Realtime dashboard
- [ ] PDF export
- [ ] Email automation (Edge Functions)
- [ ] Activity logging
- [ ] Data aggregation
- [ ] Comparison views
- [ ] Filter and search
- [ ] Parent/Student views
