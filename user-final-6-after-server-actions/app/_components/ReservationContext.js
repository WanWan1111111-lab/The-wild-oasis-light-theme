"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const resetRange = () => setRange(initialState);
  const resetBookingDraft = () => setBookingDraft(null);

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
        bookingDraft,
        setBookingDraft,
        resetBookingDraft,
        appliedCoupon,
        setAppliedCoupon,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { ReservationProvider, useReservation };
