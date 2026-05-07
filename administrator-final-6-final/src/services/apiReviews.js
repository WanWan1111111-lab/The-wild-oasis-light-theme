import supabase from "./supabase";

export async function getReviews({ status = "all" } = {}) {
  let query = supabase
    .from("reviews")
    .select("id, created_at, rating, comment, status, cabinId, guestId, bookingId, cabins(name), guests(fullName, email)")
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error("评价数据加载失败");
  return data;
}

export async function updateReviewStatus(id, status) {
  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error("评价状态更新失败");
}

export async function deleteReview(id) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error("评价删除失败");
}
