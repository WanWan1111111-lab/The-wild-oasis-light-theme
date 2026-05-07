"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NotificationBell({ guestId, initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!guestId) return;

    const channel = supabaseClient
      .channel("notifications-bell")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `guest_id=eq.${guestId}`,
        },
        () => setCount((c) => c + 1)
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `guest_id=eq.${guestId}`,
        },
        () => {
          // 标记已读后重新拉取未读数
          fetch("/api/notifications/unread-count")
            .then((r) => r.json())
            .then((d) => setCount(d.count ?? 0))
            .catch(() => {});
        }
      )
      .subscribe();

    return () => supabaseClient.removeChannel(channel);
  }, [guestId]);

  if (!guestId) return null;

  return (
    <Link
      href="/account/notifications"
      className="relative text-accent-900 hover:text-accent-600 transition-colors"
      aria-label={`消息通知${count > 0 ? `，${count}条未读` : ""}`}
    >
      {count > 0 ? (
        <BellAlertIcon className="h-6 w-6" />
      ) : (
        <BellIcon className="h-6 w-6" />
      )}
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
