import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image, latitude, longitude")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

export async function getFeaturedCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .eq("is_featured", true)
    .limit(5);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getReviewsByCabinId(cabinId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, created_at, rating, comment, guests(fullName)")
    .eq("cabinId", cabinId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviewsByCabinId error:", error);
    return [];
  }

  return data;
}

export async function getReviewedBookingIds(guestId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("bookingId")
    .eq("guestId", guestId);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((r) => r.bookingId);
}

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, status, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  // await new Promise((res) => setTimeout(res, 5000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getWishlistByGuestId(guestId) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id, cabinId, cabins(id, name, maxCapacity, regularPrice, discount, image)")
    .eq("guestId", guestId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getWishlistByGuestId error:", error);
    throw new Error("Wishlist could not be loaded");
  }

  return data;
}

export async function getWishlistedCabinIds(guestId) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("cabinId")
    .eq("guestId", guestId);

  if (error) {
    console.error("getWishlistedCabinIds error:", error);
    return [];
  }

  return data.map((item) => item.cabinId);
}

export async function getWelcomePackCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_welcome_pack", true)
    .eq("is_active", true);
  if (error) throw new Error("礼包券加载失败");
  return data;
}

export async function getGuestCoupons(guestId) {
  const { data, error } = await supabase
    .from("guest_coupons")
    .select("*, coupons(*)")
    .eq("guest_id", guestId);
  if (error) throw new Error("用户券加载失败");
  return data;
}

export async function getCouponByCode(code) {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data;
}

export async function getNotifications(guestId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) { console.error(error); return []; }
  return data;
}

export async function getUnreadCount(guestId) {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("guest_id", guestId)
    .eq("is_read", false);
  if (error) return 0;
  return count ?? 0;
}

export async function getTopReviews(limit = 3) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, guests(fullName)")
    .eq("status", "approved")
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}
/*
export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}
*/
/////////////
// UPDATE

/*
// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
