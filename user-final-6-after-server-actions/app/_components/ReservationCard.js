import Link from "next/link";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import DeleteReservation from "./DeleteReservation";
import ReviewModal from "./ReviewModal";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
    locale: zhCN,
  }).replace("大约 ", "");

function ReservationCard({ booking, reviewedBookingIds = [] }) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabinId,
    cabins: { name, image },
  } = booking;

  const isCompleted = isPast(new Date(endDate));
  const hasReviewed = reviewedBookingIds.includes(id);

  return (
    <div className="flex flex-col border border-primary-300 shadow-card bg-white">
      <div className="flex">
        <div className="relative h-32 aspect-square flex-shrink-0">
          <Image
            src={image}
            alt={`Cabin ${name}`}
            fill
            className="object-cover border-r border-primary-300"
          />
        </div>

        <div className="flex-grow px-6 py-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primary-900">
              {numNights} 晚 · {name}号木屋
            </h3>
            {status === "refund_pending" ? (
              <span className="bg-orange-100 text-orange-700 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                退款审核中
              </span>
            ) : status === "refunded" ? (
              <span className="bg-primary-200 text-primary-500 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                已退款
              </span>
            ) : isPast(new Date(startDate)) ? (
              <span className="bg-primary-200 text-primary-700 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                已完成
              </span>
            ) : (
              <span className="bg-accent-100 text-accent-700 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                即将到来
              </span>
            )}
          </div>

          <p className="text-lg text-primary-600">
            {format(new Date(startDate), "yyyy年M月d日 EEE", { locale: zhCN })} (
            {isToday(new Date(startDate))
              ? "今天"
              : formatDistanceFromNow(startDate)}
            ) &mdash; {format(new Date(endDate), "yyyy年M月d日 EEE", { locale: zhCN })}
          </p>

          <div className="flex gap-5 mt-auto items-baseline">
            <p className="text-xl font-semibold text-accent-600">¥{totalPrice}</p>
            <p className="text-primary-400">&bull;</p>
            <p className="text-lg text-primary-600">{numGuests} 位客人</p>
            <p className="ml-auto text-sm text-primary-500">
              预订于 {format(new Date(created_at), "yyyy年M月d日 HH:mm", { locale: zhCN })}
            </p>
          </div>
        </div>

        <div className="flex flex-col border-l border-primary-300 w-[100px]">
          {!isPast(startDate) || status === "refund_pending" || status === "refunded" ? (
            <>
              {!isPast(startDate) && status !== "refund_pending" && status !== "refunded" && (
                <Link
                  href={`/account/reservations/edit/${id}`}
                  className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-600 border-b border-primary-300 flex-grow px-3 hover:bg-accent-500 transition-colors hover:text-white"
                >
                  <PencilSquareIcon className="h-5 w-5 text-primary-400 group-hover:text-white transition-colors" />
                  <span className="mt-1">修改</span>
                </Link>
              )}
              {(status === "unconfirmed" || status === "refund_pending" || status === "refunded") && (
                <DeleteReservation bookingId={id} status={status} />
              )}
            </>
          ) : null}
        </div>
      </div>

      {isCompleted && !hasReviewed && (
        <ReviewModal bookingId={id} cabinId={cabinId} cabinName={name} />
      )}
      {isCompleted && hasReviewed && (
        <div className="border-t border-primary-300 px-4 py-2 bg-primary-50">
          <span className="text-xs text-primary-500">✓ 已评价</span>
        </div>
      )}
    </div>
  );
}

export default ReservationCard;
