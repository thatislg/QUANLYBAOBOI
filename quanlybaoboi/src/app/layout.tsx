import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import OfflineIndicator from "@/components/offline-indicator";
import { LanguageProvider } from "@/contexts/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "子供の学習アプリ | Học Tập Cho Con",
  description: "Ứng dụng học tập tương tác dành cho trẻ em với các bài đọc và bài toán song ngữ Nhật-Việt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black">
        <LanguageProvider>
          <Navigation />
          <OfflineIndicator />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 dark:text-gray-400">
                © 2026 子供の学習アプリ - Ứng dụng học tập cho trẻ em
              </p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
