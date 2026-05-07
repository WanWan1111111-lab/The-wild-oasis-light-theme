"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import SubmitButton from "./SubmitButton";
import { createReview } from "../_lib/actions";

function ReviewForm({ bookingId, cabinId, cabinName, onSuccess }) {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");
    try {
      await createReview(formData);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 mt-3">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="cabinId" value={cabinId} />

      <div>
        <p className="text-primary-600 text-sm mb-2">
          评价 {cabinName}号木屋
        </p>
        <StarRating name="rating" />
      </div>

      <div>
        <textarea
          name="comment"
          rows={3}
          maxLength={500}
          placeholder="分享您的入住体验（选填，最多500字）..."
          className="w-full px-4 py-3 bg-white border border-primary-300 text-primary-800 placeholder-primary-400 rounded-sm focus:outline-none focus:border-accent-500 text-sm resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <SubmitButton pendingLabel="提交中...">提交评价</SubmitButton>
    </form>
  );
}

export default ReviewForm;
