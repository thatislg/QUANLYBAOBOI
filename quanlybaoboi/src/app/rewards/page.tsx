"use client";

import { useState } from "react";

export default function Rewards() {
  const [stars, setStars] = useState(150);
  
  // Mock rewards data
  const rewards = [
    { id: 1, name: "30 phút chơi game", cost: 50, description: "Thời gian chơi game giải trí", claimed: false },
    { id: 2, name: "Món tráng miệng yêu thích", cost: 30, description: "Chọn một món tráng miệng", claimed: false },
    { id: 3, name: "Buổi phim cuối tuần", cost: 100, description: "Xem phim cùng gia đình", claimed: false },
    { id: 4, name: "Đồ chơi mới", cost: 80, description: "Chọn một món đồ chơi", claimed: true },
    { id: 5, name: "Buổi dã ngoại", cost: 120, description: "Đi chơi công viên hoặc sở thú", claimed: false },
    { id: 6, name: "Sách truyện mới", cost: 40, description: "Chọn một cuốn sách yêu thích", claimed: false }
  ];

  const claimReward = (rewardId: number) => {
    // In a real app, this would connect to a backend
    alert(`Bạn đã yêu cầu phần thưởng #${rewardId}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <a href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">Bảng điều khiển</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">Phần thưởng</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hệ thống phần thưởng</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Đổi điểm sao lấy những phần thưởng thú vị!
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stars}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sao tích lũy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Bài đã hoàn thành</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">12</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Điểm trung bình</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">85%</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Chuỗi ngày học</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">7</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Thời gian học</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">15h</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Các phần thưởng có sẵn</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Đổi sao lấy những phần thưởng thú vị
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`border rounded-lg p-6 flex flex-col ${
                    reward.claimed 
                      ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{reward.name}</h3>
                    {reward.claimed && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Đã nhận
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {reward.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">{reward.cost}</span>
                    </div>
                    <button
                      onClick={() => claimReward(reward.id)}
                      disabled={reward.claimed || stars < reward.cost}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full ${
                        reward.claimed
                          ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                          : stars >= reward.cost
                            ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {reward.claimed ? "Đã nhận" : "Đổi thưởng"}
                    </button>
                  </div>
                  {stars < reward.cost && !reward.claimed && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      Cần thêm {reward.cost - stars} sao
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Toward Next Milestone */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tiến trình đến mốc tiếp theo</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tiếp tục cố gắng để đạt được phần thưởng đặc biệt!
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">200 sao để mở khóa phần thưởng đặc biệt</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{stars}/200</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full" 
                style={{ width: `${Math.min((stars / 200) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Chỉ còn {(200 - stars > 0) ? 200 - stars : 0} sao nữa để mở khóa phần thưởng đặc biệt!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}