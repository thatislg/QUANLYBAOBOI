"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-20 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8 text-center w-full max-w-2xl">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-6">
            <Image
              src="/globe.svg"
              alt="Globe icon"
              width={64}
              height={64}
              className="dark:invert"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            {t("home.title")}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t("home.subtitle")}
          </h2>
          <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400 mb-10">
            {t("home.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
              href="/login"
            >
              {t("home.getStarted")}
            </a>
            <a
              className="flex h-14 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] text-black dark:text-white"
              href="/about"
            >
              {t("home.learnMore")}
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="flex flex-col items-center text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-3 mb-4">
              <Image src="/file.svg" alt="Reading icon" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("subject.reading")}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Các bài đọc song ngữ Nhật-Việt với hỗ trợ Text-to-Speech
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="bg-green-200 dark:bg-green-800 rounded-full p-3 mb-4">
              <Image src="/window.svg" alt="Math icon" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("subject.math")}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bài toán tương tác với không gian vẽ và nhận diện nét vẽ
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full p-3 mb-4">
              <Image src="/globe.svg" alt="Rewards icon" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("subject.rewards")}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hệ thống sao và điểm thưởng để khuyến khích học tập
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
