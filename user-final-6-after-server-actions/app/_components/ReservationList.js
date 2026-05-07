"use client";

import ReservationCard from "./ReservationCard";

function ReservationList({ bookings, reviewedBookingIds = [] }) {
  return (
    <ul className="space-y-6">
      {bookings.map((booking) => (
        <ReservationCard
          booking={booking}
          reviewedBookingIds={reviewedBookingIds}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
