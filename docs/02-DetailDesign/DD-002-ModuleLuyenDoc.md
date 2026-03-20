# DD-002: Module Luyện Đọc (Reading Module)

## 1. Thông tin chung

| Mục | Chi tiết |
|-----|----------|
| **Module** | Luyện Đọc (Reading) |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 2026-03-17 |
| **Tác giả** | Development Team |

---

## 2. Mục đích và Phạm vi

### 2.1 Mô tả
Module Luyện Đọc cung cấp giao diện đọc song ngữ Nhật-Việt với tích hợp Text-to-Speech, highlight từ đang đọc, và tương tác từ vựng.

### 2.2 Yêu cầu chức năng

| ID | Chức năng | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| READ-01 | Bài đọc song ngữ | Văn bản Nhật-Việt song song | P0 |
| READ-02 | Text-to-Speech | AI đọc diễn cảm, highlight từ | P0 |
| READ-03 | Tương tác từ vựng | Click từ xem nghĩa, đánh dấu từ khó | P2 |
| READ-04 | Ghi chú cá nhân | Thêm ghi chú cho từ/câu | P2 |

---

## 3. Component Structure

```
app/
├── (main)/
│   └── reading/
│       ├── page.tsx                 # Danh sách bài đọc
│       └── [lessonId]/
│           └── page.tsx             # Chi tiết bài đọc

components/
├── reading/
│   ├── ReadingContainer.tsx         # Container chính
│   ├── SplitPane.tsx                # Layout chia đôi
│   ├── BilingualText.tsx            # Component văn bản song ngữ
│   ├── TextBlock.tsx                # Khối văn bản
│   ├── WordTooltip.tsx              # Tooltip từ vựng
│   ├── AudioPlayer.tsx              # Điều khiển audio
│   ├── HighlightText.tsx            # Highlight từ đang đọc
│   ├── VocabularyList.tsx           # Danh sách từ vựng
│   ├── NotePanel.tsx                # Panel ghi chú
│   └── ReadingToolbar.tsx           # Toolbar công cụ
│
├── audio/
│   ├── TTSPlayer.tsx                # Text-to-Speech player
│   └── TTSSettings.tsx              # Cài đặt TTS
│
└── canvas/
    └── HighlightCanvas.tsx          # Canvas vẽ highlight

hooks/
├── useReading.ts                    # Hook quản lý state bài đọc
├── useTTS.ts                        # Hook Text-to-Speech
├── useWordLookup.ts                 # Hook tra từ
└── useReadingProgress.ts            # Hook tiến độ đọc

lib/
├── reading/
│   ├── textProcessor.ts             # Xử lý văn bản
│   ├── tokenizer.ts                 # Tách từ tiếng Nhật
│   └── syncScroll.ts                # Đồng bộ scroll
│
└── tts/
    ├── providers.ts                 # Các provider TTS
    └── audioSync.ts                 # Đồng bộ audio với text

stores/
└── readingStore.ts                  # Zustand store cho reading
```

---

## 4. Chi tiết Implementation

### 4.1 Database Schema

```sql
-- reading_exercises (đã định nghĩa trong BD-003)
CREATE TABLE reading_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    audio_url TEXT,
    vocabulary JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm bảng lưu ghi chú của user
CREATE TABLE reading_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES reading_exercises(id) ON DELETE CASCADE,
    paragraph_id TEXT NOT NULL,
    word_index INTEGER,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id, paragraph_id, word_index)
);

-- Bảng lưu từ vựng đã đánh dấu
CREATE TABLE user_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES reading_exercises(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    reading TEXT,
    meaning TEXT,
    is_mastered BOOLEAN DEFAULT FALSE,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id, word)
);

-- Indexes
CREATE INDEX idx_reading_notes_user ON reading_notes(user_id);
CREATE INDEX idx_reading_notes_exercise ON reading_notes(exercise_id);
CREATE INDEX idx_user_vocab_user ON user_vocabulary(user_id);
```

---

### 4.2 Data Models

```typescript
// types/reading.ts

export interface Paragraph {
  id: string;
  jaText: string;
  viText: string;
  audioStart?: number;  // Thời gian bắt đầu trong audio (giây)
  audioEnd?: number;    // Thời gian kết thúc
}

export interface VocabularyItem {
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  paragraphId?: string;
  wordIndex?: number;
}

export interface ReadingContent {
  paragraphs: Paragraph[];
  settings: {
    fontSizeDefault: 'small' | 'medium' | 'large';
    highlightEnabled: boolean;
    autoPlay: boolean;
  };
}

export interface ReadingExercise {
  id: string;
  lessonId: string;
  content: ReadingContent;
  audioUrl?: string;
  vocabulary: VocabularyItem[];
}

export interface ReadingProgress {
  currentParagraph: number;
  currentWord: number;
  isPlaying: boolean;
  playbackSpeed: number;
}

export interface UserNote {
  id: string;
  paragraphId: string;
  wordIndex?: number;
  noteText: string;
  createdAt: string;
}
```

---

### 4.3 Main Component: ReadingContainer

```typescript
// components/reading/ReadingContainer.tsx
'use client';

import { useState, useCallback } from 'react';
import { useReading } from '@/hooks/useReading';
import { SplitPane } from './SplitPane';
import { BilingualText } from './BilingualText';
import { AudioPlayer } from './AudioPlayer';
import { ReadingToolbar } from './ReadingToolbar';
import { VocabularyList } from './VocabularyList';
import { NotePanel } from './NotePanel';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BookOpen, List } from 'lucide-react';

interface ReadingContainerProps {
  exerciseId: string;
}

export function ReadingContainer({ exerciseId }: ReadingContainerProps) {
  const {
    exercise,
    progress,
    vocabulary,
    notes,
    isLoading,
    updateProgress,
    addNote,
    toggleWordHighlight,
    toggleVocabulary
  } = useReading(exerciseId);

  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [activeTab, setActiveTab] = useState<'ja' | 'vi' | 'both'>('both');

  // Xử lý khi click vào từ
  const handleWordClick = useCallback((word: string, paragraphId: string, wordIndex: number) => {
    // Tìm nghĩa của từ trong danh sách từ vựng
    const vocab = vocabulary.find(v => v.word === word);
    if (vocab) {
      // Hiển thị tooltip hoặc panel từ vựng
      toggleWordHighlight(word);
    }
  }, [vocabulary, toggleWordHighlight]);

  // Xử lý khi audio đọc đến từ nào đó
  const handleAudioProgress = useCallback((paragraphIndex: number, wordIndex: number) => {
    updateProgress({
      currentParagraph: paragraphIndex,
      currentWord: wordIndex
    });
  }, [updateProgress]);

  if (isLoading || !exercise) {
    return <ReadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <ReadingToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onToggleVocabulary={() => setShowVocabulary(!showVocabulary)}
        onToggleNotes={() => setShowNotes(!showNotes)}
      />

      {/* Audio Player (nếu có audio) */}
      {exercise.audioUrl && (
        <AudioPlayer
          audioUrl={exercise.audioUrl}
          paragraphs={exercise.content.paragraphs}
          onProgress={handleAudioProgress}
          currentParagraph={progress.currentParagraph}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Split Pane cho song ngữ */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'both' ? (
            <SplitPane
              left={
                <BilingualText
                  paragraphs={exercise.content.paragraphs}
                  language="ja"
                  fontSize={fontSize}
                  highlightPosition={progress}
                  onWordClick={handleWordClick}
                  vocabulary={vocabulary}
                />
              }
              right={
                <BilingualText
                  paragraphs={exercise.content.paragraphs}
                  language="vi"
                  fontSize={fontSize}
                  syncedScroll={true}
                />
              }
            />
          ) : (
            <BilingualText
              paragraphs={exercise.content.paragraphs}
              language={activeTab}
              fontSize={fontSize}
              highlightPosition={progress}
              onWordClick={handleWordClick}
              vocabulary={vocabulary}
            />
          )}
        </div>

        {/* Side Panel - Vocabulary */}
        <Sheet open={showVocabulary} onOpenChange={setShowVocabulary}>
          <SheetContent side="right" className="w-80">
            <VocabularyList
              vocabulary={vocabulary}
              onToggleMaster={toggleVocabulary}
            />
          </SheetContent>
        </Sheet>

        {/* Side Panel - Notes */}
        <Sheet open={showNotes} onOpenChange={setShowNotes}>
          <SheetContent side="right" className="w-80">
            <NotePanel
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={(id) => {}}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
```

---

### 4.4 Text-to-Speech Hook

```typescript
// hooks/useTTS.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface TTSOptions {
  language: 'ja-JP' | 'vi-VN';
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWord: number;
  currentParagraph: number;
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentWord: 0,
    currentParagraph: 0
  });

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordBoundaryRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stop();
    };
  }, []);

  const speak = useCallback((text: string, options: TTSOptions) => {
    if (!synthRef.current) return;

    // Hủy utterance cũ
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language;
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Event handlers
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        wordBoundaryRef.current = event.charIndex;
        // Có thể emit event để highlight word
      }
    };

    utterance.onend = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false
      }));
    };

    utterance.onerror = (event) => {
      console.error('TTS Error:', event.error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false
      }));
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);

    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false
    }));
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && state.isPlaying) {
      synthRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, [state.isPlaying]);

  const resume = useCallback(() => {
    if (synthRef.current && state.isPaused) {
      synthRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, [state.isPaused]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState({
        isPlaying: false,
        isPaused: false,
        currentWord: 0,
        currentParagraph: 0
      });
    }
  }, []);

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    wordBoundary: wordBoundaryRef.current
  };
}
```

---

### 4.5 BilingualText Component

```typescript
// components/reading/BilingualText.tsx
'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Paragraph, VocabularyItem, ReadingProgress } from '@/types/reading';

interface BilingualTextProps {
  paragraphs: Paragraph[];
  language: 'ja' | 'vi';
  fontSize: 'small' | 'medium' | 'large';
  highlightPosition?: ReadingProgress;
  onWordClick?: (word: string, paragraphId: string, wordIndex: number) => void;
  vocabulary?: VocabularyItem[];
  syncedScroll?: boolean;
}

const fontSizeClasses = {
  small: 'text-sm leading-relaxed',
  medium: 'text-base leading-relaxed',
  large: 'text-lg leading-loose'
};

export function BilingualText({
  paragraphs,
  language,
  fontSize,
  highlightPosition,
  onWordClick,
  vocabulary = [],
  syncedScroll = false
}: BilingualTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll đến paragraph đang đọc
  useEffect(() => {
    if (highlightPosition && containerRef.current) {
      const paragraphEl = containerRef.current.querySelector(
        `[data-paragraph="${highlightPosition.currentParagraph}"]`
      );
      if (paragraphEl) {
        paragraphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightPosition]);

  // Tách từ tiếng Nhật (đơn giản - có thể dùng thư viện như kuromoji)
  const tokenizeJapanese = (text: string): string[] => {
    // Tạm thời tách theo khoảng trắng và dấu câu
    return text.split(/(\s+|[。、！？「」『』（）])/).filter(Boolean);
  };

  const renderText = (text: string, paragraphId: string) => {
    if (language === 'vi') {
      // Tiếng Việt hiển thị bình thường
      return <span>{text}</span>;
    }

    // Tiếng Nhật - tách từ và cho phép click
    const tokens = tokenizeJapanese(text);
    
    return (
      <>
        {tokens.map((token, index) => {
          const isVocab = vocabulary.some(v => v.word === token);
          const isHighlighted = 
            highlightPosition?.currentParagraph.toString() === paragraphId &&
            highlightPosition?.currentWord === index;

          return (
            <span
              key={index}
              className={cn(
                'inline-block cursor-pointer rounded transition-colors',
                isVocab && 'text-primary underline decoration-dotted',
                isHighlighted && 'bg-yellow-200',
                'hover:bg-muted'
              )}
              onClick={() => onWordClick?.(token, paragraphId, index)}
            >
              {token}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full overflow-y-auto p-6',
        fontSizeClasses[fontSize],
        language === 'ja' ? 'font-jp' : 'font-vi'
      )}
      data-language={language}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {paragraphs.map((paragraph, pIndex) => (
          <div
            key={paragraph.id}
            data-paragraph={pIndex}
            className={cn(
              'p-4 rounded-lg transition-colors',
              highlightPosition?.currentParagraph === pIndex && 'bg-accent/50'
            )}
          >
            <p className="text-justify">
              {renderText(
                language === 'ja' ? paragraph.jaText : paragraph.viText,
                pIndex.toString()
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4.6 Sync Scroll Hook

```typescript
// hooks/useSyncScroll.ts
import { useEffect, useRef } from 'react';

export function useSyncScroll(container1Ref: React.RefObject<HTMLElement>, 
                               container2Ref: React.RefObject<HTMLElement>) {
  const isScrolling = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const container1 = container1Ref.current;
    const container2 = container2Ref.current;

    if (!container1 || !container2) return;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (isScrolling.current) return;
      
      isScrolling.current = true;
      
      const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        isScrolling.current = false;
      }, 50);
    };

    const handleScroll1 = () => syncScroll(container1, container2);
    const handleScroll2 = () => syncScroll(container2, container1);

    container1.addEventListener('scroll', handleScroll1);
    container2.addEventListener('scroll', handleScroll2);

    return () => {
      container1.removeEventListener('scroll', handleScroll1);
      container2.removeEventListener('scroll', handleScroll2);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [container1Ref, container2Ref]);
}
```

---

## 5. API Integration

```typescript
// lib/api/reading.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ReadingExercise, UserNote, VocabularyItem } from '@/types/reading';

const supabase = createClientComponentClient();

export async function getReadingExercise(lessonId: string): Promise<ReadingExercise | null> {
  const { data, error } = await supabase
    .from('reading_exercises')
    .select(`
      *,
      lessons:lesson_id (*)
    `)
    .eq('lesson_id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching reading exercise:', error);
    return null;
  }

  return data as ReadingExercise;
}

export async function getUserNotes(exerciseId: string): Promise<UserNote[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('reading_notes')
    .select('*')
    .eq('exercise_id', exerciseId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return data as UserNote[];
}

export async function addNote(
  exerciseId: string, 
  paragraphId: string, 
  noteText: string,
  wordIndex?: number
): Promise<UserNote | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_notes')
    .insert({
      user_id: user.id,
      exercise_id: exerciseId,
      paragraph_id: paragraphId,
      word_index: wordIndex,
      note_text: noteText
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding note:', error);
    return null;
  }

  return data as UserNote;
}

export async function saveVocabulary(
  exerciseId: string,
  vocabulary: Omit<VocabularyItem, 'id'>
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('user_vocabulary')
    .upsert({
      user_id: user.id,
      exercise_id: exerciseId,
      word: vocabulary.word,
      reading: vocabulary.reading,
      meaning: vocabulary.meaning
    }, {
      onConflict: 'user_id,exercise_id,word'
    });

  return !error;
}
```

---

## 6. Checklist

- [ ] Tích hợp TTS (Web Speech API hoặc 3rd party)
- [ ] Highlight từ đang đọc
- [ ] Click từ xem nghĩa
- [ ] Đồng bộ scroll 2 panel
- [ ] Đánh dấu từ vựng
- [ ] Ghi chú cá nhân
- [ ] Font size adjustment
- [ ] Toggle song ngữ
- [ ] Offline caching
- [ ] Progress tracking
