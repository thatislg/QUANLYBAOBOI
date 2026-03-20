# DD-003: Module Luyện Toán (Math Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Luyện Toán (Math) |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mô tả
Module Luyện Toán cung cấp không gian tương tác để học sinh giải các bài toán với hỗ trợ Canvas cho phép kéo thả, đếm, nối và luyện viết tay.

### 2.2 Yêu cầu chức năng

| ID | Chức năng | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| MATH-01 | Bài toán song ngữ | Đề bài Nhật-Việt | P0 |
| MATH-02 | Canvas tương tác | Kéo thả, đếm, nối, viết tay | P0 |
| MATH-03 | Phản hồi realtime | Đúng/sai ngay khi làm | P0 |
| MATH-04 | Scratchpad | Bảng tính nhẩm | P1 |
| MATH-05 | Gợi ý | Gợi ý giải bài | P2 |

---

## 3. Component Structure

```
app/
├── (main)/
│   └── math/
│       ├── page.tsx                 # Danh sách bài toán
│       └── [lessonId]/
│           └── page.tsx             # Chi tiết bài toán

components/
├── math/
│   ├── MathContainer.tsx            # Container chính
│   ├── QuestionDisplay.tsx          # Hiển thị đề bài
│   ├── MathCanvas.tsx               # Canvas chính (Konva)
│   ├── InteractionLayer.tsx         # Layer tương tác
│   ├── DragDropZone.tsx             # Vùng kéo thả
│   ├── DrawingTool.tsx              # Công cụ viết/vẽ
│   ├── AnswerInput.tsx              # Input câu trả lời
│   ├── FeedbackOverlay.tsx          # Phản hồi đúng/sai
│   ├── ScratchPad.tsx               # Bảng tính nhẩm
│   ├── HintPanel.tsx                # Panel gợi ý
│   └── MathToolbar.tsx              # Toolbar công cụ
│
├── canvas/
│   ├── CanvasStage.tsx              # Konva Stage wrapper
│   ├── DraggableItem.tsx            # Item có thể kéo
│   ├── DropTarget.tsx               # Vùng thả
│   ├── FreehandLayer.tsx            # Layer viết tự do
│   ├── ShapeTool.tsx                # Công cụ hình học
│   └── EraserTool.tsx               # Công cụ xóa
│
└── feedback/
    ├── SuccessAnimation.tsx         # Animation đúng
    └── ErrorShake.tsx               # Animation sai

hooks/
├── useMath.ts                       # Hook quản lý state bài toán
├── useCanvas.ts                     # Hook quản lý canvas
├── useDrawing.ts                    # Hook viết/vẽ
├── useDragDrop.ts                   # Hook kéo thả
├── useAnswerValidation.ts           # Hook kiểm tra đáp án
└── useScratchPad.ts                 # Hook scratchpad

lib/
├── math/
│   ├── equationRenderer.ts          # Render phương trình
│   ├── answerChecker.ts             # Kiểm tra đáp án
│   └── hintGenerator.ts             # Sinh gợi ý
│
└── canvas/
    ├── konvaConfig.ts               # Cấu hình Konva
    ├── drawingUtils.ts              # Utils vẽ
    └── hitDetection.ts              # Phát hiện va chạm

stores/
└── mathStore.ts                     # Zustand store cho math
```

---

## 4. Chi tiết Implementation

### 4.1 Database Schema

```sql
-- math_exercises (đã định nghĩa trong BD-003)
CREATE TABLE math_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    question JSONB NOT NULL,
    answer JSONB NOT NULL,
    hints JSONB DEFAULT '[]'::jsonb,
    canvas_data JSONB DEFAULT '{}'::jsonb,
    interaction_type VARCHAR(30) CHECK (interaction_type IN ('drag_drop', 'draw', 'multiple_choice', 'fill_blank')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu trạng thái canvas của user
CREATE TABLE math_user_canvas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES math_exercises(id) ON DELETE CASCADE,
    canvas_state JSONB NOT NULL, -- Trạng thái canvas (strokes, items, etc.)
    scratch_pad_state JSONB DEFAULT '{}'::jsonb,
    is_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- Indexes
CREATE INDEX idx_math_exercise_lesson ON math_exercises(lesson_id);
CREATE INDEX idx_math_canvas_user ON math_user_canvas(user_id);
CREATE INDEX idx_math_canvas_exercise ON math_user_canvas(exercise_id);
```

---

### 4.2 Data Models

```typescript
// types/math.ts

export type InteractionType = 'drag_drop' | 'draw' | 'multiple_choice' | 'fill_blank';

export interface MathQuestion {
  jaText: string;
  viText: string;
  visualAids?: VisualAid[];
  interaction: InteractionConfig;
}

export interface VisualAid {
  id: string;
  type: 'image' | 'shape' | 'number';
  url?: string; // cho image
  shapeType?: 'circle' | 'square' | 'triangle'; // cho shape
  count?: number;
  draggable?: boolean;
  value?: number; // giá trị số
  label?: string;
  position?: { x: number; y: number };
}

export interface InteractionConfig {
  type: InteractionType;
  targets?: DropTarget[];
  options?: MultipleChoiceOption[];
  correctAnswer: AnswerValue;
  tolerance?: number; // Sai số cho phép (cho draw)
}

export interface DropTarget {
  id: string;
  label?: string;
  accepts: string[]; // Loại item được phép thả
  maxItems: number;
  expectedValue?: number; // Giá trị mong đợi
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface MultipleChoiceOption {
  id: string;
  jaText?: string;
  viText: string;
  value: string | number;
  imageUrl?: string;
}

type AnswerValue = string | number | string[] | number[] | { targetId: string; items: string[] }[];

export interface MathAnswer {
  value: AnswerValue;
  steps?: string[];
  explanation?: {
    ja: string;
    vi: string;
  };
}

export interface MathHint {
  order: number;
  jaText: string;
  viText: string;
  reveals?: string[]; // Các phần được gợi ý
}

export interface MathExercise {
  id: string;
  lessonId: string;
  question: MathQuestion;
  answer: MathAnswer;
  hints: MathHint[];
  canvasData: CanvasConfig;
  interactionType: InteractionType;
}

export interface CanvasConfig {
  width: number;
  height: number;
  background: 'white' | 'grid' | 'lined';
  tools: CanvasTool[];
  initialItems?: VisualAid[];
}

export type CanvasTool = 'select' | 'drag' | 'draw' | 'erase' | 'shape' | 'text';

export interface CanvasState {
  strokes: Stroke[];
  items: CanvasItem[];
  selectedTool: CanvasTool;
  scale: number;
}

export interface Stroke {
  id: string;
  points: number[]; // [x1, y1, x2, y2, ...]
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

export interface CanvasItem {
  id: string;
  type: 'image' | 'text' | 'shape';
  x: number;
  y: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  draggable?: boolean;
  data: VisualAid | TextItem | ShapeItem;
}
```

---

### 4.3 Main Component: MathContainer

```typescript
// components/math/MathContainer.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useMath } from '@/hooks/useMath';
import { QuestionDisplay } from './QuestionDisplay';
import { MathCanvas } from './MathCanvas';
import { ScratchPad } from './ScratchPad';
import { MathToolbar } from './MathToolbar';
import { FeedbackOverlay } from './FeedbackOverlay';
import { HintPanel } from './HintPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Lightbulb, Eraser, CheckCircle } from 'lucide-react';

interface MathContainerProps {
  exerciseId: string;
}

export function MathContainer({ exerciseId }: MathContainerProps) {
  const {
    exercise,
    canvasState,
    userAnswer,
    feedback,
    isSubmitting,
    currentHint,
    showHint,
    updateCanvas,
    updateAnswer,
    submitAnswer,
    showNextHint,
    resetExercise
  } = useMath(exerciseId);

  const [selectedTool, setSelectedTool] = useState<CanvasTool>('select');
  const [showScratchPad, setShowScratchPad] = useState(false);
  const stageRef = useRef<any>(null);

  // Xử lý khi có thay đổi trên canvas
  const handleCanvasChange = useCallback((newState: Partial<CanvasState>) => {
    updateCanvas(newState);
  }, [updateCanvas]);

  // Xử lý submit bài
  const handleSubmit = useCallback(async () => {
    const result = await submitAnswer();
    
    if (result.isCorrect) {
      // Hiển thị animation thành công
      // Phát âm thanh (nếu có)
    } else {
      // Hiển thị gợi ý
      showNextHint();
    }
  }, [submitAnswer, showNextHint]);

  // Xử lý kéo thả hoàn thành
  const handleDragEnd = useCallback((itemId: string, targetId?: string) => {
    if (targetId) {
      updateAnswer({
        type: 'drag_drop',
        targetId,
        itemId
      });
    }
  }, [updateAnswer]);

  if (!exercise) {
    return <MathSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header với đề bài */}
      <div className="border-b bg-card p-4">
        <QuestionDisplay 
          question={exercise.question}
          language="vi" // hoặc theo user preference
        />
      </div>

      {/* Toolbar */}
      <MathToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onClear={() => handleCanvasChange({ strokes: [], items: [] })}
        onUndo={() => {}}
        onRedo={() => {}}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas chính */}
        <div className="flex-1 relative bg-white">
          <MathCanvas
            ref={stageRef}
            config={exercise.canvasData}
            state={canvasState}
            selectedTool={selectedTool}
            onChange={handleCanvasChange}
            onDragEnd={handleDragEnd}
            interactionType={exercise.interactionType}
            question={exercise.question}
          />

          {/* Feedback Overlay */}
          {feedback && (
            <FeedbackOverlay
              isCorrect={feedback.isCorrect}
              message={feedback.message}
              explanation={feedback.explanation}
              onContinue={() => {}}
              onRetry={resetExercise}
            />
          )}
        </div>

        {/* Side Panel */}
        <div className="w-16 border-l bg-card flex flex-col items-center py-4 space-y-4">
          {/* Hint Button */}
          <Sheet open={showHint} onOpenChange={() => showNextHint()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Lightbulb className="w-5 h-5" />
                {currentHint > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {currentHint}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <HintPanel
                hints={exercise.hints}
                currentHint={currentHint}
              />
            </SheetContent>
          </Sheet>

          {/* Scratchpad Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowScratchPad(!showScratchPad)}
          >
            <Eraser className="w-5 h-5" />
          </Button>

          {/* Submit Button */}
          <Button
            variant="default"
            size="icon"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Scratchpad */}
        {showScratchPad && (
          <div className="absolute bottom-4 right-20 w-64 h-64 bg-white border-2 border-primary rounded-lg shadow-lg z-10">
            <ScratchPad />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 4.4 MathCanvas Component (React-Konva)

```typescript
// components/math/MathCanvas.tsx
'use client';

import { forwardRef, useCallback, useState } from 'react';
import { Stage, Layer, Line, Circle, Rect, Text, Image, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasState, CanvasTool, InteractionType, MathQuestion } from '@/types/math';
import { DraggableItem } from './DraggableItem';
import { DropTarget } from './DropTarget';

interface MathCanvasProps {
  config: CanvasConfig;
  state: CanvasState;
  selectedTool: CanvasTool;
  onChange: (newState: Partial<CanvasState>) => void;
  onDragEnd: (itemId: string, targetId?: string) => void;
  interactionType: InteractionType;
  question: MathQuestion;
}

export const MathCanvas = forwardRef<any, MathCanvasProps>(({
  config,
  state,
  selectedTool,
  onChange,
  onDragEnd,
  interactionType,
  question
}, ref) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);

  // Xử lý vẽ tự do
  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (selectedTool !== 'draw') return;

    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setCurrentStroke([pos.x, pos.y]);
    }
  }, [selectedTool]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || selectedTool !== 'draw') return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setCurrentStroke(prev => [...prev, pos.x, pos.y]);
    }
  }, [isDrawing, selectedTool]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (currentStroke.length > 2) {
      onChange({
        strokes: [
          ...state.strokes,
          {
            id: Date.now().toString(),
            points: currentStroke,
            color: '#000',
            width: 2,
            tool: selectedTool === 'draw' ? 'pen' : 'eraser'
          }
        ]
      });
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, state.strokes, onChange, selectedTool]);

  // Xử lý kéo thả
  const handleItemDragEnd = useCallback((e: KonvaEventObject<DragEvent>, itemId: string) => {
    const item = e.target;
    const stage = item.getStage();
    
    if (!stage) return;

    // Kiểm tra va chạm với drop targets
    const targets = question.interaction.targets || [];
    let droppedTarget: string | undefined;

    for (const target of targets) {
      const targetNode = stage.findOne(`#${target.id}`);
      if (targetNode && targetNode.intersects(item.getClientRect())) {
        droppedTarget = target.id;
        break;
      }
    }

    onDragEnd(itemId, droppedTarget);
  }, [question.interaction.targets, onDragEnd]);

  return (
    <Stage
      ref={ref}
      width={config.width}
      height={config.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ background: getBackground(config.background) }}
    >
      {/* Background Layer */}
      <Layer>
        {/* Grid lines nếu cần */}
        {config.background === 'grid' && <GridLines />}
      </Layer>

      {/* Strokes Layer */}
      <Layer>
        {state.strokes.map(stroke => (
          <Line
            key={stroke.id}
            points={stroke.points}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={stroke.tool === 'eraser' ? 'destination-out' : 'source-over'}
          />
        ))}
        {isDrawing && currentStroke.length > 0 && (
          <Line
            points={currentStroke}
            stroke="#000"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Layer>

      {/* Items Layer (kéo thả) */}
      <Layer>
        {/* Drop Targets */}
        {question.interaction.targets?.map(target => (
          <DropTarget
            key={target.id}
            id={target.id}
            config={target}
          />
        ))}

        {/* Draggable Items */}
        {question.visualAids?.filter(aid => aid.draggable).map(aid => (
          <DraggableItem
            key={aid.id}
            aid={aid}
            isDraggable={selectedTool === 'drag'}
            onDragEnd={(e) => handleItemDragEnd(e, aid.id)}
          />
        ))}
      </Layer>

      {/* Interaction Layer */}
      <Layer>
        {interactionType === 'multiple_choice' && (
          <MultipleChoiceLayer
            options={question.interaction.options || []}
            onSelect={(value) => onChange({ selectedAnswer: value })}
          />
        )}
        
        {interactionType === 'fill_blank' && (
          <FillBlankLayer
            onChange={(value) => onChange({ selectedAnswer: value })}
          />
        )}
      </Layer>
    </Stage>
  );
});

MathCanvas.displayName = 'MathCanvas';

// Helper functions
function getBackground(type: CanvasConfig['background']): string {
  switch (type) {
    case 'grid':
      return 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)';
    case 'lined':
      return 'repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)';
    default:
      return '#ffffff';
  }
}
```

---

### 4.5 Answer Validation

```typescript
// lib/math/answerChecker.ts
import { AnswerValue, MathAnswer, InteractionType } from '@/types/math';

interface ValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: {
    ja: string;
    vi: string;
  };
  details?: string[];
}

export function validateAnswer(
  userAnswer: AnswerValue,
  correctAnswer: MathAnswer,
  interactionType: InteractionType
): ValidationResult {
  switch (interactionType) {
    case 'multiple_choice':
      return validateMultipleChoice(userAnswer, correctAnswer);
    
    case 'fill_blank':
      return validateFillBlank(userAnswer, correctAnswer);
    
    case 'drag_drop':
      return validateDragDrop(userAnswer, correctAnswer);
    
    case 'draw':
      return validateDraw(userAnswer, correctAnswer);
    
    default:
      return {
        isCorrect: false,
        score: 0,
        feedback: {
          ja: 'エラーが発生しました',
          vi: 'Có lỗi xảy ra'
        }
      };
  }
}

function validateMultipleChoice(
  userAnswer: AnswerValue,
  correctAnswer: MathAnswer
): ValidationResult {
  const isCorrect = userAnswer === correctAnswer.value;
  
  return {
    isCorrect,
    score: isCorrect ? 100 : 0,
    feedback: isCorrect ? {
      ja: '正解です！',
      vi: 'Chính xác! 🎉'
    } : {
      ja: 'もう一度考えてみましょう',
      vi: 'Hãy thử lại nhé! 💪'
    }
  };
}

function validateFillBlank(
  userAnswer: AnswerValue,
  correctAnswer: MathAnswer
): ValidationResult {
  const userValue = Number(userAnswer);
  const correctValue = Number(correctAnswer.value);
  
  if (isNaN(userValue)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: {
        ja: '数字を入力してください',
        vi: 'Vui lòng nhập số'
      }
    };
  }

  // Cho phép sai số nhỏ (ví dụ: 0.01)
  const tolerance = 0.01;
  const isCorrect = Math.abs(userValue - correctValue) < tolerance;
  
  // Tính điểm theo độ chính xác
  const error = Math.abs(userValue - correctValue);
  const score = isCorrect ? 100 : Math.max(0, 100 - error * 10);

  return {
    isCorrect,
    score: Math.round(score),
    feedback: isCorrect ? {
      ja: '正解です！',
      vi: 'Chính xác! 🎉'
    } : {
      ja: `答えは ${correctValue} です`,
      vi: `Đáp án đúng là ${correctValue}`
    }
  };
}

function validateDragDrop(
  userAnswer: AnswerValue,
  correctAnswer: MathAnswer
): ValidationResult {
  // Kiểm tra số lượng items trong từng target
  const userPlacement = userAnswer as { targetId: string; items: string[] }[];
  const correctPlacement = correctAnswer.value as { targetId: string; items: string[] }[];
  
  let correctCount = 0;
  const totalTargets = correctPlacement.length;

  for (const correct of correctPlacement) {
    const user = userPlacement.find(u => u.targetId === correct.targetId);
    if (user && arraysEqual(user.items.sort(), correct.items.sort())) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / totalTargets) * 100);
  const isCorrect = score === 100;

  return {
    isCorrect,
    score,
    feedback: isCorrect ? {
      ja: '完璧です！',
      vi: 'Hoàn hảo! 🌟'
    } : {
      ja: ` ${correctCount}/${totalTargets} 正解です`,
      vi: `Đúng ${correctCount}/${totalTargets}, cố lên! 💪`
    }
  };
}

function validateDraw(
  userAnswer: AnswerValue,
  correctAnswer: MathAnswer
): ValidationResult {
  // Phức tạp hơn - cần so sánh hình vẽ
  // Có thể dùng thuật toán nhận diện hình ảnh hoặc đơn giản là kiểm tra số nét
  
  return {
    isCorrect: true, // Tạm thời
    score: 100,
    feedback: {
      ja: '素晴らしい絵です！',
      vi: 'Bức tranh tuyệt đẹp! 🎨'
    }
  };
}

// Helper
function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
```

---

## 5. Checklist

- [ ] React-Konva integration
- [ ] Drawing tools (pen, eraser)
- [ ] Drag and drop functionality
- [ ] Multiple choice rendering
- [ ] Fill blank input
- [ ] Real-time answer validation
- [ ] Success/Error animations
- [ ] Hint system
- [ ] Scratchpad
- [ ] Auto-save canvas state
- [ ] Offline support
- [ ] Touch/Pencil support cho iPad
