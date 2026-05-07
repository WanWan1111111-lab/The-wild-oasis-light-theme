"use client";

import { differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }) {
  const router = useRouter();
  const { range, setBookingDraft } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!(startDate && endDate)) return;

    const formData = new FormData(e.target);
    const numGuests = Number(formData.get("numGuests"));
    const observations = formData.get("observations") || "";

    setBookingDraft({
      ...bookingData,
      numGuests,
      observations,
      cabinName: cabin.name,
      cabinImage: cabin.image,
      userName: user.name,
      userEmail: user.email,
    });

    router.push(`/cabins/${id}/pay`);
  }

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-200 text-primary-700 px-16 py-2 flex justify-between items-center">
        <p>当前登录</p>

        <div className="flex gap-4 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-primary-50 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests" className="text-primary-700">入住人数？</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none focus:border-accent-500"
            required
          >
            <option value="" key="">
              请选择入住人数...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} 位客人
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations" className="text-primary-700">
            有什么需要我们了解的吗？
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none focus:border-accent-500"
            placeholder="宠物、过敏、特殊需求等..."
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-500 text-base">
              请先选择入住日期
            </p>
          ) : (
            <SubmitButton pendingLabel="预订中...">立即预订</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
