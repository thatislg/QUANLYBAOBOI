"use client";

import { useState, useEffect } from "react";

export default function ParentalControl() {
  const [timeLimit, setTimeLimit] = useState<number>(120); // minutes
  const [timeUsed, setTimeUsed] = useState<number>(45); // minutes
  const [isActive, setIsActive] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(75); // minutes

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedTimeLimit = localStorage.getItem("parental-time-limit");
    const savedTimeUsed = localStorage.getItem("parental-time-used");
    
    if (savedTimeLimit) {
      setTimeLimit(parseInt(savedTimeLimit, 10));
    }
    
    if (savedTimeUsed) {
      setTimeUsed(parseInt(savedTimeUsed, 10));
    }
  }, []);

  // Update time remaining
  useEffect(() => {
    setTimeRemaining(Math.max(0, timeLimit - timeUsed));
  }, [timeLimit, timeUsed]);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("parental-time-limit", timeLimit.toString());
    localStorage.setItem("parental-time-used", timeUsed.toString());
    alert("Cài đặt đã được lưu!");
  };

  // Reset daily usage
  const resetDailyUsage = () => {
    setTimeUsed(0);
    localStorage.setItem("parental-time-used", "0");
    alert("Đã đặt lại thời gian sử dụng hàng ngày!");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quản lý thời gian học</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">Thời gian tối đa mỗi ngày</span>
          <span className="font-medium text-gray-900 dark:text-white">{timeLimit} phút</span>
        </div>
        <label htmlFor="time-limit-slider" className="sr-only">
          Thời gian tối đa mỗi ngày
        </label>
        <input
          id="time-limit-slider"
          type="range"
          min="10"
          max="480"
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>10 phút</span>
          <span>8 giờ</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">Thời gian đã sử dụng hôm nay</span>
          <span className="font-medium text-gray-900 dark:text-white">{timeUsed} phút</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${Math.min(100, (timeUsed / timeLimit) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Thời gian còn lại</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {Math.floor(timeRemaining / 60)}h {timeRemaining % 60}m
          </span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={saveSettings}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Lưu cài đặt
        </button>
        <button
          onClick={resetDailyUsage}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Đặt lại
        </button>
      </div>
      
      {timeRemaining <= 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Hết thời gian học
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  Trẻ đã sử dụng hết thời gian học cho phép hôm nay. 
                  Vui lòng đặt lại thời gian nếu cần thêm thời gian học.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}