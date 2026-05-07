import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings, getReviewedBookingIds } from "@/app/_lib/data-service";

export const metadata = {
  title: "我的预订",
};

export default async function Page() {
  const session = await auth();
  const [bookings, reviewedBookingIds] = await Promise.all([
    getBookings(session.user.guestId),
    getReviewedBookingIds(session.user.guestId),
  ]);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        我的预订
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          您还没有任何预订。快来看看我们的{" "}
          <a className="underline text-accent-500" href="/cabins">
            奢华木屋 &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} reviewedBookingIds={reviewedBookingIds} />
      )}
    </div>
  );
}
