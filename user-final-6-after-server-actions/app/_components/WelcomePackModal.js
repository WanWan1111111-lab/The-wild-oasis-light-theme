"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { claimWelcomeCoupon } from "@/app/_lib/actions";
import { useReservation } from "./ReservationContext";

export default function WelcomePackModal({ coupons, claimedIds, usedIds = [], isLoggedIn }) {
  const router = useRouter();
  const { appliedCoupon, setAppliedCoupon } = useReservation();
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(new Set(claimedIds));
  const [used] = useState(new Set(usedIds));
  const [isPending, startTransition] = useTransition();

  function handleClaim(coupon) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      await claimWelcomeCoupon(coupon.id);
      setClaimed((prev) => new Set([...prev, coupon.id]));
      // 自动应用：如果当前没有已应用的券，就把这张设为已应用
      if (!appliedCoupon) setAppliedCoupon(coupon);
    });
  }

  function handleApply(coupon) {
    setAppliedCoupon(coupon);
  }

  const allClaimed = coupons.every((c) => claimed.has(c.id));

  return (
    <>
      {/* 固定悬浮按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="新客礼包"
        className="fixed bottom-8 right-8 z-40 w-20 h-20 rounded-full bg-accent-500 text-white shadow-xl hover:bg-accent-600 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
      >
        <span className="text-3xl leading-none">🎁</span>
        {!allClaimed && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white" />
        )}
        <span className="text-xs font-semibold leading-none">新客礼包</span>
      </button>

      {/* 遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 弹窗面板 */}
      <div
        className={`fixed bottom-32 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="font-bold text-primary-900 text-lg">新客专属礼包</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-primary-400 hover:text-primary-700 text-2xl leading-none"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 券列表 */}
        <div className="p-5 flex flex-col gap-4 max-h-80 overflow-y-auto">
          {coupons.map((c) => {
            const isClaimed = claimed.has(c.id);
            const isUsed = used.has(c.id);
            const isApplied = appliedCoupon?.id === c.id;
            return (
              <div
                key={c.id}
                className={`rounded-xl border p-5 flex items-center justify-between gap-4 transition ${
                  isUsed
                    ? "border-primary-200 bg-primary-100 opacity-60"
                    : isApplied
                    ? "border-accent-400 bg-accent-50"
                    : isClaimed
                    ? "border-primary-200 bg-primary-50 opacity-70"
                    : "border-accent-300 bg-accent-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-bold text-accent-600 text-lg truncate">{c.code}</p>
                  <p className="text-sm text-primary-500 mt-1">
                    {c.type === "fixed" ? `减 ¥${c.value}` : `${c.value}% 折扣`}
                    {c.min_spend > 0 ? ` · 满¥${c.min_spend}可用` : " · 无门槛"}
                  </p>
                  {isUsed && (
                    <p className="text-xs text-primary-400 font-semibold mt-1">已使用</p>
                  )}
                  {isApplied && !isUsed && (
                    <p className="text-xs text-accent-700 font-semibold mt-1">✓ 已应用到订单</p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col gap-2 items-end">
                  {isUsed ? (
                    <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-200 text-primary-400 cursor-not-allowed">
                      已使用
                    </span>
                  ) : !isClaimed ? (
                    <button
                      disabled={isPending}
                      onClick={() => handleClaim(c)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent-500 text-white hover:bg-accent-600 active:scale-95 transition"
                    >
                      领取
                    </button>
                  ) : isApplied ? (
                    <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent-100 text-accent-700">
                      使用中
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(c)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-200 text-primary-700 hover:bg-primary-300 transition"
                    >
                      使用
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部 */}
        <div className="px-5 pb-5">
          {appliedCoupon && !used.has(appliedCoupon.id) ? (
            <div className="flex items-center justify-between bg-accent-50 border border-accent-300 rounded-xl px-4 py-3">
              <p className="text-sm text-accent-700 font-medium">
                ✓ 已应用：{appliedCoupon.code}
                {appliedCoupon.type === "fixed"
                  ? `，减 ¥${appliedCoupon.value}`
                  : `，${appliedCoupon.value}% 折扣`}
              </p>
              <button
                onClick={() => setAppliedCoupon(null)}
                className="text-xs text-accent-500 hover:text-primary-700 transition ml-3"
              >
                取消
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-primary-400">
              领取后自动应用到订单，下单时直接抵扣
            </p>
          )}
        </div>
      </div>
    </>
  );
}
