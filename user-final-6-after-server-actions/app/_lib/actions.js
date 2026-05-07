"use server";

import { auth, signIn, signOut } from "./auth";
import { getBookings, getCouponByCode } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function claimWelcomeCoupon(couponId) {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  const guestId = session.user.guestId;

  const { error } = await supabase
    .from("guest_coupons")
    .insert([{ guest_id: guestId, coupon_id: couponId }]);

  // unique 约束触发 = 已领过，忽略
  if (error && !error.message.includes("unique")) throw new Error("领取失败");

  revalidatePath("/account");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const couponCode = formData.get("couponCode") || "";
  let discountAmount = 0;
  let couponId = null;

  if (couponCode) {
    const coupon = await getCouponByCode(couponCode);
    if (coupon) {
      const price = bookingData.cabinPrice;
      if (price >= (coupon.min_spend || 0)) {
        discountAmount =
          coupon.type === "fixed"
            ? Math.min(coupon.value, price)
            : Math.round((price * coupon.value) / 100);
        couponId = coupon.id;
      }
    }
  }

  const finalPrice = bookingData.cabinPrice - discountAmount;

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: finalPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);
  if (error) throw new Error("Booking could not be created");

  if (couponId) {
    await supabase
      .from("guest_coupons")
      .update({ used: true })
      .eq("guest_id", session.user.guestId)
      .eq("coupon_id", couponId);

    await supabase.rpc("increment_coupon_used", { coupon_id: couponId });
  }

  // 预订成功通知（不阻断主流程）
  try {
    await supabase.from("notifications").insert([{
      guest_id: session.user.guestId,
      type: "booking_confirmed",
      title: "预订成功",
      body: `您已成功预订木屋，入住日期 ${bookingData.startDate}，期待您的到来！`,
      link: "/account/reservations",
      metadata: { cabinId: bookingData.cabinId, startDate: bookingData.startDate },
    }]);
  } catch (e) {
    console.error("通知插入失败:", e);
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function requestRefund(bookingId, reason) {
  const session = await auth();
  if (!session) throw new Error("请先登录");

  const guestBookings = await getBookings(session.user.guestId);
  if (!guestBookings.find((b) => b.id === bookingId))
    throw new Error("无权操作此订单");

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "refund_pending",
      refund_reason: reason || null,
      refund_requested_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) throw new Error("申请提交失败");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function createNotification({ guestId, type, title, body, link, metadata }) {
  const { error } = await supabase.from("notifications").insert([
    { guest_id: guestId, type, title, body, link, metadata },
  ]);
  if (error) console.error("createNotification error:", error);
}

export async function markAsRead(notificationId) {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("guest_id", session.user.guestId);
  revalidatePath("/account/notifications");
}

export async function markAllRead() {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("guest_id", session.user.guestId)
    .eq("is_read", false);
  revalidatePath("/account/notifications");
}

export async function deleteNotification(notificationId) {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("guest_id", session.user.guestId);
  revalidatePath("/account/notifications");
}

export async function signInAction(formData) {
  const provider = formData?.get("provider") || "google";
  await signIn(provider, { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function createReview(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = session.user.guestId;
  const bookingId = Number(formData.get("bookingId"));
  const cabinId = Number(formData.get("cabinId"));
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment")?.slice(0, 500) || "";

  if (!rating || rating < 1 || rating > 5)
    throw new Error("请选择 1-5 星评分");

  // 验证该订单属于当前用户
  const guestBookings = await getBookings(guestId);
  if (!guestBookings.find((b) => b.id === bookingId))
    throw new Error("无权评价此订单");

  const { error } = await supabase
    .from("reviews")
    .insert([{ guestId, cabinId, bookingId, rating, comment, status: "pending" }]);

  if (error) {
    console.error(error);
    throw new Error("评价提交失败：" + error.message);
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${cabinId}`);
}

export async function toggleWishlist(cabinId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = session.user.guestId;

  // 检查是否已收藏
  const { data: existing, error: selectError } = await supabase
    .from("wishlists")
    .select("id")
    .eq("guestId", guestId)
    .eq("cabinId", cabinId)
    .maybeSingle();

  if (selectError) {
    console.error("Wishlist select error:", selectError);
    throw new Error(selectError.message);
  }

  if (existing) {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", existing.id);
    if (error) {
      console.error("Wishlist delete error:", error);
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("wishlists")
      .insert([{ guestId, cabinId }]);
    if (error) {
      console.error("Wishlist insert error:", error);
      throw new Error(error.message);
    }
  }

  revalidatePath("/account/wishlist");
  revalidatePath(`/cabins/${cabinId}`);
  revalidatePath("/cabins");
}
