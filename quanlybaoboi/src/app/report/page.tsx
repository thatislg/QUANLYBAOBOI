"use client";

import { useState } from "react";
import Link from "next/link";

export default function Report() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  // Mock report data
  const progressData = [
    { date: "2026-03-13", reading: 80, math: 75, totalTime: 45 },
    { date: "2026-03-14", reading: 90, math: 85, totalTime: 60 },
    { date: "2026-03-15", reading: 70, math: 60, totalTime: 30 },
    { date: "2026-03-16", reading: 85, math: 90, totalTime: 50 },
    { date: "2026-03-17", reading: 95, math: 80, totalTime: 55 },
    { date: "2026-03-18", reading: 75, math: 70, totalTime: 40 },
    { date: "2026-03-19", reading: 88, math: 92, totalTime: 65 }
  ];
  
  const weeklySummary = {
    reading: { average: 83, completed: 12, streak: 5 },
    math: { average: 80, completed: 10, streak: 4 },
    totalTime: { minutes: 355, sessions: 14 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">
              Bảng điều khiển
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">Báo cáo</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Báo cáo tiến độ</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Theo dõi tiến trình học tập của bạn
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("week")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    selectedPeriod === "week"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  Tuần này
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("month")}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedPeriod === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  Tháng này
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("year")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    selectedPeriod === "year"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  Năm nay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">TB Đọc hiểu</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.reading.average}%</div>
                      <div className="ml-2 text-sm text-green-600 dark:text-green-400">
                        +5%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">TB Toán</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.math.average}%</div>
                      <div className="ml-2 text-sm text-green-600 dark:text-green-400">
                        +3%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Thời gian học</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.totalTime.minutes} phút</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Chuỗi ngày học</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.reading.streak}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tiến độ học tập</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Biểu đồ điểm số theo ngày
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-80">
              <div className="flex items-end h-64 space-x-2 mt-8">
                {progressData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex items-end justify-center space-x-1 w-full h-48">
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        style={{ height: `${day.reading * 0.48}%` }}
                        title={`Đọc hiểu: ${day.reading}%`}
                      ></div>
                      <div 
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        style={{ height: `${day.math * 0.48}%` }}
                        title={`Toán: ${day.math}%`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Đọc hiểu</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Toán</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Progress */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Chi tiết tiến độ</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bảng chi tiết điểm số và thời gian học
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Đọc hiểu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Toán
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thời gian (phút)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bài hoàn thành
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {progressData.map((day, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <span>{day.reading}%</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${day.reading}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <span>{day.math}%</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${day.math}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {day.totalTime} phút
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {Math.floor(day.totalTime / 15)} bài
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Export Report */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Xuất báo cáo PDF
          </button>
        </div>
      </div>
    </div>
  );
}