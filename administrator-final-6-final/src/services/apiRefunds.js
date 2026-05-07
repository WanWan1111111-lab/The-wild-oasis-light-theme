import supabase from "./supabase";
import { createNotification } from "./apiNotifications";

export async function getRefundRequests() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(name), guests(fullName, email)")
    .in("status", ["refund_pending", "refunded"])
    .order("refund_requested_at", { ascending: false });

  if (error) throw new Error("退款申请加载失败");
  return data;
}

export async function approveRefund(bookingId, note = "") {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "refunded",
      refund_reviewed_at: new Date().toISOString(),
      refund_note: note,
    })
    .eq("id", bookingId)
    .select("*, guests(id)")
    .single();

  if (error) throw new Error("审核操作失败");

  const guestId = data.guestId ?? data.guest_id;
  if (guestId) {
    await createNotification({
      guestId,
      type: "refund_approved",
      title: "退款申请已通过",
      body: `您的订单退款申请已审核通过，款项将在 3-5 个工作日内退回。`,
      link: "/account/reservations",
      metadata: { bookingId },
    });
  }

  return data;
}

export async function rejectRefund(bookingId, note = "") {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "unconfirmed",
      refund_reviewed_at: new Date().toISOString(),
      refund_note: note,
    })
    .eq("id", bookingId)
    .select("*, guests(id)")
    .single();

  if (error) throw new Error("审核操作失败");

  const guestId = data.guestId ?? data.guest_id;
  if (guestId) {
    await createNotification({
      guestId,
      type: "refund_rejected",
      title: "退款申请未通过",
      body: `很抱歉，您的退款申请未能通过审核。${note ? `原因：${note}` : ""}`,
      link: "/account/reservations",
      metadata: { bookingId },
    });
  }

  return data;
}
