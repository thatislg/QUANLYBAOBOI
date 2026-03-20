"use client";

import { useState } from "react";

export default function ReadingExercise() {
  const [fontSize, setFontSize] = useState(16);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock reading content
  const readingContent = {
    title: "おはよう - Buổi sáng",
    japanese: `おはようございます。
今日はとても良い天気ですね。
公園で遊びましょう。
木の下に座って本を読みます。
鳥が歌っています。`,
    vietnamese: `Chào buổi sáng.
Hôm nay thời tiết rất tốt phải không?
Chúng ta hãy chơi ở công viên nhé.
Ngồi dưới gốc cây và đọc sách.
Chim đang hót.`
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would trigger text-to-speech
    console.log("Playing audio...");
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <a href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">Bảng điều khiển</a>
            <span className="mx-2">/</span>
            <a href="/reading" className="hover:text-gray-700 dark:hover:text-gray-300">Luyện đọc</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">Bài 1: おはよう</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{readingContent.title}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Bài đọc song ngữ Nhật-Việt
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={handlePlayAudio}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isPlaying ? (
                  <>
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dừng phát
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
                    </svg>
                    Phát âm
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {showTranslation ? "Ẩn dịch nghĩa" : "Hiện dịch nghĩa"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Nội dung bài đọc</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:text-gray-300"
                  aria-label="Giảm cỡ chữ"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5m14 0a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2m14 0v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2m14 0v-4a2 2 0 00-2-2h-2" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">A</span>
                <button
                  onClick={increaseFontSize}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:text-gray-300"
                  aria-label="Tăng cỡ chữ"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5m14 0a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2m14 0v-4a2 2 0 00-2-2h-2m-4 0H9m0 0H7m0 0H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">日本語 (Tiếng Nhật)</h3>
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {readingContent.japanese}
                  </pre>
                </div>
              </div>
              
              {showTranslation && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tiếng Việt</h3>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {readingContent.vietnamese}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Từ vựng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white">おはようございます</div>
                  <div className="text-gray-600 dark:text-gray-300">Chào buổi sáng (lịch sự)</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white">公園</div>
                  <div className="text-gray-600 dark:text-gray-300">Công viên</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white">木</div>
                  <div className="text-gray-600 dark:text-gray-300">Cây</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white">鳥</div>
                  <div className="text-gray-600 dark:text-gray-300">Chim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Bài tiếp theo
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}