import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { createNotification } from "../../services/apiNotifications";
import { toast } from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: async (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });

      const guestId = data.guestId ?? data.guest_id;
      if (guestId) {
        await createNotification({
          guestId,
          type: "checked_out",
          title: "感谢您的入住",
          body: `期待再次相遇！您在${data.cabins?.name ?? ""}号木屋的旅程已结束。`,
          link: "/account/reservations",
          metadata: { bookingId: data.id },
        });

        await createNotification({
          guestId,
          type: "review_invite",
          title: "分享您的入住体验",
          body: `您在${data.cabins?.name ?? ""}号木屋的入住怎么样？留下评价帮助更多旅人。`,
          link: `/cabins/${data.cabinId}`,
          metadata: { bookingId: data.id, cabinId: data.cabinId },
        });
      }
    },

    onError: () => toast.error("There was an error while checking out"),
  });

  return { checkout, isCheckingOut };
}
