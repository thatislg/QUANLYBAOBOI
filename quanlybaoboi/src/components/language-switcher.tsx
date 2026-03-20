"use client";

import { useLanguage } from "@/contexts/language-context";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <button
        onClick={() => setLanguage("vi")}
        className={`px-3 py-1 text-sm rounded-l-md ${
          language === "vi"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLanguage("ja")}
        className={`px-3 py-1 text-sm rounded-r-md ${
          language === "ja"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        JA
      </button>
    </div>
  );
}