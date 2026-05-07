"use client";

import Image from "next/image";
import { XMarkIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useCompare } from "./CompareContext";

export default function CompareBar({ onOpen }) {
  const { selected, remove, clear } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-900 text-white shadow-2xl border-t border-primary-700">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center gap-6">
        <span className="text-xs tracking-widest uppercase text-primary-400 flex-shrink-0">
          对比木屋
        </span>

        {/* 已选木屋 */}
        <div className="flex gap-4 flex-1">
          {selected.map((cabin) => (
            <div key={cabin.id} className="flex items-center gap-2 bg-primary-800 px-3 py-1.5">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image src={cabin.image} fill className="object-cover" alt={cabin.name} />
              </div>
              <span className="text-sm text-primary-100">{cabin.name}号</span>
              <button
                onClick={() => remove(cabin.id)}
                className="text-primary-400 hover:text-white ml-1"
                aria-label="移除"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {/* 空槽位 */}
          {Array.from({ length: 3 - selected.length }).map((_, i) => (
            <div
              key={i}
              className="w-28 h-9 border border-dashed border-primary-600 flex items-center justify-center"
            >
              <span className="text-xs text-primary-500">+ 添加木屋</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={clear}
            className="text-xs text-primary-400 hover:text-white transition-colors"
          >
            清空
          </button>
          <button
            onClick={onOpen}
            disabled={selected.length < 2}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 text-primary-900 text-sm font-medium transition-all"
          >
            <ArrowsRightLeftIcon className="w-4 h-4" />
            开始对比 ({selected.length}/3)
          </button>
        </div>
      </div>
    </div>
  );
}
