import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { bookingId } = params;
  const { numGuests, observations, cabinId } = await getBooking(bookingId);
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-500 mb-7">
        修改预订 #{bookingId}
      </h2>

      <form
        action={updateBooking}
        className="bg-primary-50 border border-primary-200 py-8 px-12 text-lg flex gap-6 flex-col rounded-sm"
      >
        <input type="hidden" value={bookingId} name="bookingId" />

        <div className="space-y-2">
          <label htmlFor="numGuests" className="text-primary-700 font-medium">入住人数？</label>
          <select
            name="numGuests"
            id="numGuests"
            defaultValue={numGuests}
            className="px-5 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-500"
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
          <label htmlFor="observations" className="text-primary-700 font-medium">
            有什么需要我们了解的吗？
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-500"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="更新中...">
            更新预订
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
