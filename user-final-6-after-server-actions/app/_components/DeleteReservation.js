"use client";

import { ReceiptRefundIcon } from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { requestRefund } from "@/app/_lib/actions";

function DeleteReservation({ bookingId, status }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  // 已在审核中
  if (status === "refund_pending") {
    return (
      <div className="flex items-center gap-2 uppercase text-xs font-bold text-orange-400 flex-grow px-3 cursor-default">
        <ReceiptRefundIcon className="h-5 w-5" />
        <span className="mt-1">审核中</span>
      </div>
    );
  }

  // 已退款
  if (status === "refunded") {
    return (
      <div className="flex items-center gap-2 uppercase text-xs font-bold text-primary-400 flex-grow px-3 cursor-default">
        <ReceiptRefundIcon className="h-5 w-5" />
        <span className="mt-1">已退款</span>
      </div>
    );
  }

  function handleSubmit() {
    startTransition(async () => {
      await requestRefund(bookingId, reason);
      setShowModal(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-600 flex-grow px-3 hover:bg-orange-50 transition-colors hover:text-orange-600"
      >
        {!isPending ? (
          <>
            <ReceiptRefundIcon className="h-5 w-5 text-primary-400 group-hover:text-orange-500 transition-colors" />
            <span className="mt-1">退款</span>
          </>
        ) : (
          <span className="mx-auto"><SpinnerMini /></span>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-sm shadow-hover w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">申请退款</h3>
            <p className="text-sm text-primary-500 mb-4">
              提交后订单将进入审核状态，管理员审核通过后完成退款。
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="退款原因（选填）"
              rows={3}
              className="w-full border border-primary-300 rounded-sm px-3 py-2 text-sm text-primary-800 placeholder:text-primary-400 focus:outline-none focus:ring-1 focus:ring-accent-500 resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-primary-600 border border-primary-300 hover:bg-primary-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold bg-accent-500 hover:bg-accent-600 text-white transition-colors disabled:opacity-60"
              >
                {isPending ? "提交中..." : "确认申请"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteReservation;
