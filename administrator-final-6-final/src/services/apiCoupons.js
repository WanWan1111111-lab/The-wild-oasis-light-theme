import supabase from "./supabase";

export async function getCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("优惠券数据加载失败");
  return data;
}

export async function createCoupon(coupon) {
  const { error } = await supabase.from("coupons").insert([coupon]);
  if (error) throw new Error("优惠券创建失败：" + error.message);
}

export async function toggleCouponActive(id, is_active) {
  const { error } = await supabase
    .from("coupons")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error("优惠券状态更新失败");
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw new Error("优惠券删除失败");
}
