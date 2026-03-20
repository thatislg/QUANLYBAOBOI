"use client";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            子供の学習アプリ
          </h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Học Tập Cho Con
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Ứng dụng học tập tương tác dành cho trẻ em với các bài đọc và bài toán song ngữ Nhật-Việt
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Về ứng dụng</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    子供の学習アプリ (Học Tập Cho Con) là một nền tảng giáo dục trực tuyến được thiết kế đặc biệt 
                    cho trẻ em, giúp các em học tiếng Nhật và tiếng Việt thông qua các bài tập tương tác.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Với phương pháp học tập dựa trên trò chơi (gamification) và các bài tập được thiết kế cẩn thận, 
                    chúng tôi mong muốn tạo ra một môi trường học tập vui vẻ và hiệu quả cho trẻ.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ứng dụng hỗ trợ cả hai ngôn ngữ Nhật và Việt, giúp trẻ có thể học song ngữ một cách tự nhiên 
                    và dễ dàng hơn.
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tính năng chính</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-500 text-white">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-4 text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Luyện đọc:</span> Các bài đọc song ngữ Nhật-Việt với hỗ trợ Text-to-Speech
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-green-500 text-white">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-4 text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Luyện toán:</span> Bài toán tương tác với không gian vẽ và nhận diện nét vẽ
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-yellow-500 text-white">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-4 text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Hệ thống phần thưởng:</span> Tích lũy sao và điểm thưởng để đổi lấy phần quà
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-purple-500 text-white">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.644 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-4 text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Báo cáo tiến độ:</span> Theo dõi tiến trình học tập và điểm số của trẻ
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đối tượng sử dụng</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trẻ em</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Học sinh tiểu học muốn cải thiện kỹ năng đọc và toán song ngữ
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.644 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Phụ huynh</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Theo dõi tiến trình học tập và quản lý thời gian học của con
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Giáo viên</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Giao bài tập và theo dõi tiến độ học tập của học sinh
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bắt đầu ngay hôm nay!</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Hãy đăng ký ngay hôm nay để trải nghiệm nền tảng học tập tiên tiến nhất cho trẻ em. 
                Chúng tôi cam kết mang lại một môi trường học tập an toàn, hiệu quả và thú vị.
              </p>
              <div className="flex justify-center">
                <a
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Đăng ký ngay
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}