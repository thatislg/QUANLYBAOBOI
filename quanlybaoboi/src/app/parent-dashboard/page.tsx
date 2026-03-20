"use client";

import ParentalControl from "@/components/parental-control";
import Link from "next/link";

export default function ParentDashboard() {
  // Mock data for children
  const children = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "👨‍🎓",
      progress: 75,
      subjects: [
        { name: "Đọc hiểu", progress: 80 },
        { name: "Toán", progress: 70 }
      ],
      recentActivity: [
        { action: "Hoàn thành bài đọc", time: "2 giờ trước" },
        { action: "Đạt điểm cao Toán", time: "1 ngày trước" }
      ]
    },
    {
      id: 2,
      name: "Nguyễn Thị B",
      avatar: "👧",
      progress: 40,
      subjects: [
        { name: "Đọc hiểu", progress: 35 },
        { name: "Toán", progress: 45 }
      ],
      recentActivity: [
        { action: "Bắt đầu bài đọc mới", time: "4 giờ trước" },
        { action: "Luyện tập toán", time: "2 ngày trước" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">
              Bảng điều khiển
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">Bảng điều khiển phụ huynh</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển phụ huynh</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Theo dõi tiến trình học tập và quản lý thời gian của con bạn
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm trẻ em
              </button>
            </div>
          </div>
        </div>

        {/* Parental Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tổng quan tiến độ</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tiến trình học tập của tất cả trẻ em
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child) => (
                    <div key={child.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-3xl">
                          {child.avatar}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{child.name}</h3>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Tiến độ tổng thể</span>
                              <span>{child.progress}%</span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${child.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Môn học</h4>
                        <div className="space-y-2">
                          {child.subjects.map((subject, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{subject.name}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{subject.progress}%</span>
                              </div>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-green-600 h-1.5 rounded-full" 
                                  style={{ width: `${subject.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hoạt động gần đây</h4>
                        <ul className="space-y-1">
                          {child.recentActivity.map((activity, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              <span>{activity.action}</span>
                              <span className="text-gray-400 dark:text-gray-500"> • {activity.time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <ParentalControl />
            
            <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Báo cáo & Cảnh báo</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Nguyễn Văn A đã sử dụng 75% thời gian học cho phép
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Nguyễn Thị B đã hoàn thành 5 bài học hôm nay
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Báo cáo tuần sẽ sẵn sàng vào thứ Hai
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Xem tất cả báo cáo
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}