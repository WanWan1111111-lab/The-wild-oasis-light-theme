import supabase from "./supabase";

/**
 * 向指定 guest 插入一条站内消息
 * @param {{ guestId: number, type: string, title: string, body: string, link?: string, metadata?: object }} param
 */
export async function createNotification({ guestId, type, title, body, link, metadata }) {
  if (!guestId) {
    console.error("createNotification: guestId is missing");
    return;
  }
  const { data, error } = await supabase.from("notifications").insert([
    { guest_id: guestId, type, title, body, link, metadata },
  ]).select();
  if (error) console.error("createNotification error:", error);
  else console.log("createNotification success:", data);
}
