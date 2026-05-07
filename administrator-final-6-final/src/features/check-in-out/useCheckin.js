import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { createNotification } from "../../services/apiNotifications";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: async (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });

      // 向用户发送入住通知
      const guestId = data.guestId ?? data.guest_id;
      if (guestId) {
        await createNotification({
          guestId,
          type: "checked_in",
          title: "您已成功入住",
          body: `${data.cabins?.name ?? ""}号木屋已为您开启，祝您入住愉快！`,
          link: "/account/reservations",
          metadata: { bookingId: data.id, cabinName: data.cabins?.name },
        });
      }

      navigate("/");
    },

    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}
