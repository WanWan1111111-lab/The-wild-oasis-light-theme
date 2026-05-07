"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const PROMOS = [
  { img: "/promo-1.png", alt: "推荐好友活动" },
  { img: "/promo-2.png", alt: "8周年庆活动" },
  { img: "/promo-3.png", alt: "组队入住活动" },
];

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const paused = useRef(false);

  function switchTo(next) {
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 300);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) {
        switchTo((prev) => (prev + 1) % PROMOS.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="activities"
      className="col-span-5 -mx-8 relative overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* 图片层：保持原始比例，宽度 100%，高度自适应 */}
      <div
        className="relative w-full transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          src={PROMOS[current].img}
          alt={PROMOS[current].alt}
          width={1376}
          height={768}
          quality={95}
          className="w-full h-auto"
          priority={current === 0}
        />
        {/* 遮罩 — 仅在有文字叠加时启用，当前关闭 */}
      </div>

      {/* 左箭头 */}
      <button
        onClick={() => switchTo((current - 1 + PROMOS.length) % PROMOS.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors p-2"
        aria-label="上一张"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </button>

      {/* 右箭头 */}
      <button
        onClick={() => switchTo((current + 1) % PROMOS.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors p-2"
        aria-label="下一张"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </button>

      {/* 标题 */}
      <div className="absolute bottom-12 left-0 right-0 text-center z-10">
        <p className="text-white text-2xl font-medium tracking-widest">
          {PROMOS[current].alt}
        </p>
      </div>

      {/* 指示点 */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
        {PROMOS.map((_, i) => (
          <button
            key={i}
            onClick={() => switchTo(i)}
            aria-label={`跳转到第 ${i + 1} 张`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
