"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import ReviewForm from "./ReviewForm";

function ReviewModal({ bookingId, cabinId, cabinName }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted)
    return (
      <span className="text-xs text-accent-600 font-semibold px-3 py-2">
        评价已提交，待审核
      </span>
    );

  return (
    <div className="border-t border-primary-300">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-600 w-full px-3 py-3 hover:bg-accent-50 transition-colors hover:text-accent-700"
        >
          <StarIcon className="h-5 w-5 text-primary-400 group-hover:text-accent-500 transition-colors" />
          <span>写评价</span>
        </button>
      ) : (
        <div className="p-4 bg-primary-50">
          <ReviewForm
            bookingId={bookingId}
            cabinId={cabinId}
            cabinName={cabinName}
            onSuccess={() => setSubmitted(true)}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewModal;
