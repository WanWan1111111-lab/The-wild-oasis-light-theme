import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function GET() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("coupons")
    .select("id, code, type, value, min_spend, end_date")
    .eq("is_active", true)
    .or(`end_date.is.null,end_date.gt.${now}`);
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
