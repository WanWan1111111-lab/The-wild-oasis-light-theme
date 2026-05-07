"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ANNOUNCEMENTS = [
  {
    icon: "🎁",
    main: "呼朋唤友住木屋，推荐好友至高得 ¥1500 住房优惠券",
    sub: "每成功邀请 1 位好友下单即可获奖励",
  },
  {
    icon: "🎂",
    main: "8 周年庆 · 4 月 22 日 — 抽惊喜盲盒，300 份礼包等你拿",
    sub: "参与抽奖最高得半价券，邀好友组队赢免单",
  },
  {
    icon: "🏆",
    main: "限时活动：组队入住享专属折扣，好友同行立减 ¥200",
    sub: "2 人及以上同期预订自动触发优惠",
  },
];

const STORAGE_KEY = "announcement_hidden_date";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hiddenDate = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    if (hiddenDate !== today) setVisible(true);
  }, []);

  const switchTo = useCallback((next) => {
    setFading(true);
    setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      switchTo((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [visible, switchTo]);

  function handlePrev() {
    switchTo((index - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  }

  function handleNext() {
    switchTo((index + 1) % ANNOUNCEMENTS.length);
  }

  function handleClose() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
  }

  if (!visible) return null;

  const { icon, main, sub } = ANNOUNCEMENTS[index];

  return (
    <div
      className="w-full h-11 flex items-center justify-between px-4 select-none"
      style={{
        background: "linear-gradient(90deg, #d38816ff 0%, #fbbd36ff 40%, #eb9c00ff 60%, #ffb516ff 80%, #d38816ff 100%)",
      }}
    >
      {/* 左箭头 */}
      <button
        onClick={handlePrev}
        className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1"
        aria-label="上一条"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {/* 公告内容 */}
      <div
        className="flex-1 text-center px-3 transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <a href="/about#activities" className="no-underline" style={{textDecoration: "none"}}>
          <span className="text-white text-sm font-semibold tracking-wide">
            {icon} {main}
          </span>
          <span className="text-white/75 text-xs ml-3 hidden sm:inline">
            — {sub}
          </span>
        </a>
        {/* 指示点 */}
        <span className="inline-flex gap-1 ml-3 align-middle">
          {ANNOUNCEMENTS.map((_, i) => (
            <span
              key={i}
              className="inline-block rounded-full transition-all duration-300"
              style={{
                width: i === index ? "16px" : "6px",
                height: "6px",
                background: i === index ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </span>
      </div>

      {/* 右箭头 + 关闭 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleNext}
          className="text-white/70 hover:text-white transition-colors p-1"
          aria-label="下一条"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <button
          onClick={handleClose}
          className="text-white/50 hover:text-white transition-colors p-1 ml-1"
          aria-label="关闭公告"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
