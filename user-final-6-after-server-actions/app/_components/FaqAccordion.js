"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FAQS = [
  { q: "退订政策是什么？", a: "入住前 7 天可免费取消，7 天内退款 50%，当天不退款。" },
  { q: "可以带宠物吗？", a: "欢迎携带宠物，需提前告知，部分木屋设有宠物专区。" },
  { q: "有停车位吗？", a: "每栋木屋配备 2 个免费停车位，无需预约。" },
  { q: "入住和退房时间？", a: "入住 15:00 后，退房 11:00 前，可提前联系协商早到或晚退。" },
  { q: "提供早餐吗？", a: "不含早餐，木屋配备完整厨房，可自行烹饪。" },
  { q: "有 WiFi 吗？", a: "全区覆盖高速 WiFi，密码在入住时提供。" },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <div className="col-span-5 py-8">
      <div className="max-w-2xl mx-auto divide-y divide-primary-300">
        {FAQS.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between py-5 text-left text-primary-800 font-medium text-lg hover:text-accent-500 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <ChevronDownIcon
                className="h-5 w-5 flex-shrink-0 text-accent-400 transition-transform duration-300"
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: open === i ? "200px" : "0px" }}
            >
              <p className="pb-5 text-primary-600 text-base leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
