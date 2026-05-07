"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useReservation } from "@/app/_components/ReservationContext";
import { createBooking } from "@/app/_lib/actions";
function formatDate(date) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

async function mockPay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) resolve({ status: "ok" });
      else reject(new Error("支付通道繁忙，请稍后重试 。"));
    }, 1500);
  });
}

export default function PayPage({ params }) {
  const { cabinId } = params;
  const router = useRouter();
  const { bookingDraft, appliedCoupon } = useReservation();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");

  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);

  if (!bookingDraft || String(bookingDraft.cabinId) !== String(cabinId)) {
    return (
      <div className="max-w-3xl mx-auto mt-16 bg-primary-50 border border-primary-300 p-10 text-center space-y-6">
        <h2 className="text-3xl font-semibold text-accent-600">
          订单信息已失效
        </h2>
        <p className="text-primary-600">
          没有找到对应的预订信息，请返回小木屋详情页重新选择日期并发起预定。
        </p>
        <Link
          href={`/cabins/${cabinId}`}
          className="inline-block bg-accent-500 px-8 py-4 text-white font-semibold hover:bg-accent-600 transition-all"
        >
          返回小木屋页面
        </Link>
      </div>
    );
  }

  const {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinName,
    numGuests,
    observations,
    userName,
    userEmail,
  } = bookingDraft;

  // 计算优惠后实付价
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "fixed"
      ? Math.min(appliedCoupon.value, cabinPrice)
      : Math.round((cabinPrice * appliedCoupon.value) / 100)
    : 0;
  const finalPrice = cabinPrice - discountAmount;

  async function handlePay(e) {
    e.preventDefault();
    setError(null);

    // 只有银行卡支付需要填写卡号
    if (paymentMethod === "card" && !cardNumber) {
      setError("请填写银行卡号（模拟校验）。");
      return;
    }

    setIsPaying(true);

    try {
      await mockPay();

      const formData = new FormData();
      formData.append("numGuests", String(numGuests));
      formData.append("observations", observations || "");
      formData.append("couponCode", appliedCoupon?.code ?? "");

      await createBooking(
        {
          startDate,
          endDate,
          numNights,
          cabinPrice,
          cabinId: bookingDraft.cabinId,
        },
        formData,
      );
    } catch (err) {
      setError(err.message || "支付失败，请稍后重试 。");
      setIsPaying(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
            Step 2 · 支付订单
          </p>
          <h1 className="text-3xl font-semibold text-primary-900">
            确认订单并完成支付
          </h1>
        </div>
        <p className="text-sm text-primary-500 hidden md:block">
          上一步：选择日期与填写预订信息
        </p>
      </div>

      <div className="border border-primary-300 rounded-xl bg-white shadow-card overflow-hidden">
        <div className="grid md:grid-cols-[1.1fr_1.1fr] divide-y md:divide-y-0 md:divide-x divide-primary-300">
          {/* 左侧：订单概要 */}
          <aside className="bg-primary-50 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary-900 mb-1">
                订单概要
              </h2>
              <p className="text-sm text-primary-500">
                请再次确认入住信息和价格，确保无误后再进行支付。
              </p>
            </div>

            <div className="space-y-3 text-sm md:text-base text-primary-700">
              <p>
                <span className="text-primary-500">小木屋：</span>
                <span className="font-medium text-primary-900">
                  {cabinName} 号木屋
                </span>
              </p>
              <p>
                <span className="text-primary-500">入住日期：</span>
                {formatDate(startDate)} ~ {formatDate(endDate)}（共{" "}
                {numNights} 晚）
              </p>
              <p>
                <span className="text-primary-500">入住人数：</span>
                {numGuests} 位客人
              </p>
              {appliedCoupon ? (
                <div className="mt-2 rounded-xl border border-accent-300 bg-accent-50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-500">原价</span>
                    <span className="line-through text-primary-400 text-base">¥{cabinPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent-700 font-medium">🎁 {appliedCoupon.code}</span>
                    <span className="text-red-600 font-semibold">-¥{discountAmount}</span>
                  </div>
                  <div className="border-t border-accent-200 pt-2 flex items-center justify-between">
                    <span className="text-primary-700 font-semibold">实付金额</span>
                    <span className="text-red-600 text-3xl font-bold">¥{finalPrice}</span>
                  </div>
                </div>
              ) : (
                <p>
                  <span className="text-primary-500">订单总价：</span>
                  <span className="text-accent-600 text-2xl font-semibold">¥{cabinPrice}</span>
                </p>
              )}
            </div>

            {/* 优惠券输入 — 已移除，通过礼包弹窗自动应用 */}

            <div className="border-t border-primary-300 pt-4 space-y-2 text-xs md:text-sm text-primary-600">
              <p>
                预订人：{userName}（{userEmail}）
              </p>
              {observations && (
                <p>
                  备注：<span className="text-primary-700">{observations}</span>
                </p>
              )}
            </div>

            <p className="text-[11px] md:text-xs text-primary-500 pt-4 border-t border-primary-300 leading-relaxed">
              提示：本支付流程为课程项目中的模拟实现，不接入任何真实支付通道；仅用于体验完整的「选择日期
              → 填写预订 → 模拟支付 → 感谢页」流程。
            </p>
          </aside>

          {/* 右侧：支付方式与二维码 / 银行卡信息 */}
          <section className="bg-white p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-primary-900">
                选择支付方式
              </h2>
              <p className="text-sm text-primary-600">
                微信 / 支付宝将展示二维码，银行卡支付仅做卡号输入模拟，不会真实扣款。
              </p>
            </div>

            <form onSubmit={handlePay} className="space-y-6 text-base md:text-lg">
              <div className="space-y-2">
                <label className="block text-primary-700 text-sm md:text-base">
                  支付方式
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="px-4 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm text-sm md:text-base focus:outline-none focus:border-accent-500"
                >
                  <option value="card">银行卡</option>
                  <option value="wechat">微信支付</option>
                  <option value="alipay">支付宝</option>
                </select>
              </div>

              {/* 根据支付方式展示不同内容 */}
              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <label className="block text-primary-700 text-sm md:text-base">
                    银行卡号
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="px-4 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm text-sm md:text-base focus:outline-none focus:border-accent-500"
                    placeholder="请输入银行卡号 "
                  />
                  <p className="text-xs md:text-sm text-primary-500">
                    该字段仅用于课程演示，不会发送到任何真实支付通道。
                  </p>
                </div>
              )}

              {paymentMethod === "wechat" && (
                <div className="space-y-4">
                  <p className="text-sm md:text-base text-primary-700">
                    请使用微信「扫一扫」扫描下方二维码 。扫码完成后，点击下方「确认支付 」按钮继续。
                  </p>
                  <div className="flex justify-center">
                    <Image
                      src="/wx.jpg"
                      alt="微信支付二维码 "
                      width={240}
                      height={240}
                      className="rounded-lg border border-primary-300 shadow-card"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "alipay" && (
                <div className="space-y-4">
                  <p className="text-sm md:text-base text-primary-700">
                    请使用支付宝「扫一扫」扫描下方二维码 。扫码完成后，点击下方「确认支付 」按钮继续。
                  </p>
                  <div className="flex justify-center">
                    <Image
                      src="/zfb.jpg"
                      alt="支付宝支付二维码 "
                      width={240}
                      height={240}
                      className="rounded-lg border border-primary-300 shadow-card"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-md text-sm md:text-base">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPaying}
                className="w-full bg-accent-500 px-8 py-3 md:py-4 text-white font-semibold text-base md:text-lg hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
              >
                {isPaying ? "支付中，请稍候..." : "确认支付 "}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

