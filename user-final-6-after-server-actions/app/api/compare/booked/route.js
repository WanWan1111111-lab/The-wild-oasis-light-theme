import { NextResponse } from "next/server";
import { getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json([], { status: 400 });
  const dates = await getBookedDatesByCabinId(id);
  return NextResponse.json(dates);
}
