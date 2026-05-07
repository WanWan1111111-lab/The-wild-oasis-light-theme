import { unstable_noStore as noStore } from "next/cache";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { getReviewsByCabinId } from "../_lib/data-service";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <StarIcon key={s} className="h-4 w-4 text-accent-500" />
        ) : (
          <StarOutline key={s} className="h-4 w-4 text-primary-400" />
        )
      )}
    </div>
  );
}

async function CabinReviews({ cabinId }) {
  noStore();

  const reviews = await getReviewsByCabinId(cabinId);

  if (!reviews.length)
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-accent-600 mb-4">评价</h3>
        <p className="text-primary-500">暂无评价，快来成为第一个评价者吧。</p>
      </div>
    );

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-semibold text-accent-600">评价</h3>
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 px-3 py-1 rounded-sm">
          <StarIcon className="h-5 w-5 text-accent-500" />
          <span className="text-primary-800 font-semibold">{avg}</span>
          <span className="text-primary-500 text-sm">({reviews.length} 条)</span>
        </div>
      </div>

      <ul className="space-y-5">
        {reviews.map((review) => (
          <li key={review.id} className="border border-primary-300 p-5 bg-white shadow-float">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-primary-800">
                  {review.guests?.fullName || "匿名用户"}
                </p>
                <Stars rating={review.rating} />
              </div>
              <span className="text-primary-500 text-sm">
                {format(new Date(review.created_at), "yyyy年M月d日", { locale: zhCN })}
              </span>
            </div>
            {review.comment && (
              <p className="text-primary-600 text-sm mt-2 leading-relaxed">
                {review.comment}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CabinReviews;
