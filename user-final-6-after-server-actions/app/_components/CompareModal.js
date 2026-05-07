"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { XMarkIcon, UsersIcon, CalendarDaysIcon, TagIcon } from "@heroicons/react/24/outline";
import { useCompare } from "./CompareContext";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";

async function fetchAll(cabinIds) {
  const [bookedResults, couponsRes] = await Promise.all([
    Promise.all(
      cabinIds.map((id) =>
        fetch(`/api/compare/booked?id=${id}`).then((r) => r.json()).then((dates) => [id, dates])
      )
    ),
    fetch("/api/compare/coupons").then((r) => r.json()),
  ]);
  return {
    booked: Object.fromEntries(bookedResults),
    coupons: couponsRes,
  };
}

function isDateRangeAvailable(bookedDates, checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return !bookedDates.some((d) => {
    const date = new Date(d);
    return date >= start && date < end;
  });
}

function calcSavings(cabin, numNights, coupons) {
  const basePrice = numNights * cabin.regularPrice;
  const cabinDiscount = numNights * (cabin.discount || 0);

  // 找出满足门槛的最优优惠券
  const eligible = coupons.filter((c) => basePrice >= (c.min_spend || 0));
  let bestCoupon = null;
  let bestCouponSaving = 0;
  for (const c of eligible) {
    const saving = c.type === "fixed" ? c.value : Math.floor(basePrice * c.value / 100);
    if (saving > bestCouponSaving) {
      bestCouponSaving = saving;
      bestCoupon = c;
    }
  }

  const totalSaving = cabinDiscount + bestCouponSaving;
  const finalPrice = basePrice - totalSaving;

  return { basePrice, cabinDiscount, bestCoupon, bestCouponSaving, totalSaving, finalPrice };
}

function describeCoupon(coupon) {
  const discount = coupon.type === "fixed"
    ? `减 ¥${coupon.value}`
    : `打 ${(10 - coupon.value / 10).toFixed(1)} 折`;
  const condition = coupon.min_spend > 0 ? `满 ¥${coupon.min_spend}` : "无门槛";
  return `${condition}${discount}`;
}

function Stars({ rating }) {
  if (!rating) return <span className="text-primary-400 text-xs">暂无评价</span>;
  return (
    <span className="flex items-center gap-1 justify-center">
      <span className="text-accent-400 text-sm">{"★".repeat(Math.round(rating))}</span>
      <span className="text-primary-600 text-sm">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function CompareModal({ onClose }) {
  const { selected, clear } = useCompare();
  const { setBookingDraft } = useReservation();
  const router = useRouter();
  const [data, setData] = useState({ booked: {}, coupons: [] });
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    fetchAll(selected.map((c) => c.id)).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [selected.map((c) => c.id).join(",")]);

  const numNights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;
  const today = new Date().toISOString().split("T")[0];
  const hasDate = numNights > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* 头部 */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-primary-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-medium text-primary-800">价格对比</h2>
          <button onClick={onClose} className="text-primary-400 hover:text-primary-800 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 日期选择 */}
        <div className="px-8 py-4 bg-primary-50 border-b border-primary-200 flex flex-wrap items-center gap-4">
          <CalendarDaysIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
          <span className="text-sm text-primary-600">选择入住日期，查看各木屋优惠：</span>
          <div className="flex items-center gap-3">
            <input
              type="date" min={today} value={checkIn}
              onChange={(e) => { setCheckIn(e.target.value); setCheckOut(""); }}
              className="border border-primary-300 px-3 py-1.5 text-sm text-primary-800 bg-white focus:outline-none focus:border-accent-400"
            />
            <span className="text-primary-400 text-sm">→</span>
            <input
              type="date" min={checkIn || today} value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border border-primary-300 px-3 py-1.5 text-sm text-primary-800 bg-white focus:outline-none focus:border-accent-400"
            />
          </div>
          {hasDate && (
            <span className="text-xs text-primary-500 bg-primary-100 px-3 py-1">
              共 {numNights} 晚
            </span>
          )}
        </div>

        {/* 对比表格 */}
        <div className="px-8 py-6">
          <table className="w-full">
            <colgroup>
              <col style={{ width: "110px" }} />
              {selected.map((c) => <col key={c.id} />)}
            </colgroup>
            <tbody>

              {/* 图片 */}
              <tr className="border-b border-primary-100">
                <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-top" />
                {selected.map((cabin) => (
                  <td key={cabin.id} className="py-4 px-4 text-center">
                    <div className="relative w-full h-36">
                      <Image src={cabin.image} fill className="object-cover" alt={cabin.name} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* 名称 */}
              <tr className="border-b border-primary-100">
                <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-middle">名称</td>
                {selected.map((cabin) => (
                  <td key={cabin.id} className="py-4 px-4 text-center">
                    <span className="text-base font-medium text-accent-600">{cabin.name}号木屋</span>
                  </td>
                ))}
              </tr>

              {/* 容量 */}
              <tr className="border-b border-primary-100">
                <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-middle">容量</td>
                {selected.map((cabin) => (
                  <td key={cabin.id} className="py-4 px-4 text-center">
                    <span className="flex items-center gap-1 justify-center text-primary-600 text-sm">
                      <UsersIcon className="w-4 h-4" />
                      最多 {cabin.maxCapacity} 人
                    </span>
                  </td>
                ))}
              </tr>

              {/* 可用性 */}
              <tr className="border-b border-primary-100">
                <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-middle">可用性</td>
                {selected.map((cabin) => {
                  const avail = loading ? null : isDateRangeAvailable(data.booked[cabin.id] || [], checkIn, checkOut);
                  return (
                    <td key={cabin.id} className="py-4 px-4 text-center">
                      {!hasDate ? (
                        <span className="text-primary-400 text-xs">请选择日期</span>
                      ) : loading ? (
                        <span className="text-primary-400 text-xs">检查中…</span>
                      ) : avail ? (
                        <span className="text-green-600 text-sm font-medium">✓ 可预订</span>
                      ) : (
                        <span className="text-red-500 text-sm font-medium">✗ 已被预订</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* 每晚价格 */}
              <tr className="border-b border-primary-100">
                <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-middle">每晚价格</td>
                {selected.map((cabin) => (
                  <td key={cabin.id} className="py-4 px-4 text-center">
                    <span className="text-xl font-medium text-primary-900">
                      ¥{cabin.discount > 0 ? cabin.regularPrice - cabin.discount : cabin.regularPrice}
                    </span>
                    <span className="text-xs text-primary-400 ml-1">/ 晚</span>
                  </td>
                ))}
              </tr>

              {/* 优惠对比（选日期后展示） */}
              {hasDate && (
                <>
                  {/* 最优优惠券 */}
                  <tr className="border-b border-primary-100 bg-primary-50/40">
                    <td className="py-4 pr-4 text-xs tracking-widest uppercase text-primary-400 align-middle">
                      <span className="flex items-center gap-1">
                        <TagIcon className="w-3.5 h-3.5" />
                        可用券
                      </span>
                    </td>
                    {selected.map((cabin) => {
                      const s = calcSavings(cabin, numNights, data.coupons);
                      return (
                        <td key={cabin.id} className="py-4 px-4 text-center">
                          {s.bestCoupon ? (
                            <div>
                              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 font-medium">
                                {s.bestCoupon.code}
                              </span>
                              <span className="block text-primary-500 text-xs mt-1">
                                {describeCoupon(s.bestCoupon)}
                              </span>
                              <span className="block text-accent-500 text-sm font-medium mt-0.5">
                                - ¥{s.bestCouponSaving}
                              </span>
                            </div>
                          ) : (
                            <span className="text-primary-300 text-sm">无可用券</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 原价 / 总优惠 / 实付 合并一行 */}
                  <tr className="border-b border-primary-200">
                    <td className="py-5 pr-4 text-xs tracking-widest uppercase text-primary-600 align-middle font-medium">价格明细</td>
                    {selected.map((cabin) => {
                      const s = calcSavings(cabin, numNights, data.coupons);
                      return (
                        <td key={cabin.id} className="py-5 px-4 text-center">
                          <span className="text-primary-400 text-xs line-through block">原价 ¥{s.basePrice}</span>
                          {s.totalSaving > 0 && (
                            <span className="text-green-600 text-xs block mt-0.5">省 ¥{s.totalSaving}</span>
                          )}
                          <span className="text-3xl font-medium text-primary-900 block mt-1">¥{s.finalPrice}</span>
                          <span className="text-xs text-primary-400 mt-0.5 block">{numNights} 晚合计</span>
                        </td>
                      );
                    })}
                  </tr>
                </>
              )}

              {/* 操作行 */}
              <tr>
                <td className="py-6 text-xs tracking-widest uppercase text-primary-400" />
                {selected.map((cabin) => {
                  const avail = hasDate && !loading
                    ? isDateRangeAvailable(data.booked[cabin.id] || [], checkIn, checkOut)
                    : null;
                  const disabled = avail === false;
                  const s = hasDate ? calcSavings(cabin, numNights, data.coupons) : null;

                  function handleBook() {
                    setBookingDraft({
                      startDate: new Date(checkIn),
                      endDate: new Date(checkOut),
                      numNights,
                      cabinPrice: s ? s.finalPrice : numNights * (cabin.regularPrice - (cabin.discount || 0)),
                      cabinId: cabin.id,
                      numGuests: 1,
                      observations: "",
                      cabinName: cabin.name,
                      cabinImage: cabin.image,
                    });
                    onClose();
                    clear();
                    router.push(`/cabins/${cabin.id}/pay`);
                  }

                  return (
                    <td key={cabin.id} className="py-6 px-4 text-center">
                      {disabled ? (
                        <span className="inline-block px-6 py-3 text-sm font-medium bg-primary-200 text-primary-400 cursor-not-allowed">
                          该日期已被预订
                        </span>
                      ) : hasDate ? (
                        <button
                          onClick={handleBook}
                          className="inline-block bg-accent-500 hover:bg-accent-600 px-6 py-3 text-primary-900 text-sm font-medium transition-all"
                        >
                          立即预订
                        </button>
                      ) : (
                        <Link
                          href={`/cabins/${cabin.id}`}
                          onClick={() => { onClose(); clear(); }}
                          className="inline-block bg-primary-200 hover:bg-primary-300 px-6 py-3 text-primary-700 text-sm font-medium transition-all"
                        >
                          查看详情
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
