"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "vi" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  vi: {
    // Navigation
    "nav.home": "Trang chủ",
    "nav.login": "Đăng nhập",
    "nav.dashboard": "Bảng điều khiển",
    "nav.about": "Giới thiệu",
    
    // Home page
    "home.title": "子供の学習アプリ",
    "home.subtitle": "Học Tập Cho Con",
    "home.description": "Ứng dụng học tập tương tác dành cho trẻ em với các bài đọc và bài toán song ngữ Nhật-Việt",
    "home.getStarted": "Bắt đầu học tập",
    "home.learnMore": "Tìm hiểu thêm",
    
    // Dashboard
    "dashboard.title": "Bảng điều khiển",
    "dashboard.welcome": "Xin chào, Học sinh! Dưới đây là tiến trình học tập của bạn.",
    
    // Subjects
    "subject.reading": "Luyện đọc",
    "subject.math": "Luyện toán",
    "subject.rewards": "Phần thưởng",
    
    // Common
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.edit": "Chỉnh sửa",
    "common.delete": "Xóa",
  },
  ja: {
    // Navigation
    "nav.home": "ホーム",
    "nav.login": "ログイン",
    "nav.dashboard": "ダッシュボード",
    "nav.about": "概要",
    
    // Home page
    "home.title": "子供の学習アプリ",
    "home.subtitle": "子供の学習アプリ",
    "home.description": "日本語とベトナム語のバイリンガル教育向けインタラクティブ学習アプリ",
    "home.getStarted": "学習を始める",
    "home.learnMore": "詳しく見る",
    
    // Dashboard
    "dashboard.title": "ダッシュボード",
    "dashboard.welcome": "こんにちは、学生さん！以下があなたの学習進捗です。",
    
    // Subjects
    "subject.reading": "読解練習",
    "subject.math": "算数練習",
    "subject.rewards": "報酬",
    
    // Common
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.edit": "編集",
    "common.delete": "削除",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Load language preference from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language | null;
      if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "ja")) {
        return savedLanguage;
      }
    }
    return "vi";
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
    
    // Update document direction and language
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}