"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  TrashIcon,
  HomeIcon,
  KeyIcon,
  MoonIcon,
  StarIcon,
  GiftIcon,
  BellIcon,
  ReceiptRefundIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";

const TYPE_CONFIG = {
  booking_confirmed: { Icon: HomeIcon,           bg: "bg-amber-50",   iconColor: "text-amber-500"  },
  checked_in:        { Icon: KeyIcon,            bg: "bg-green-50",   iconColor: "text-green-500"  },
  checked_out:       { Icon: MoonIcon,           bg: "bg-blue-50",    iconColor: "text-blue-500"   },
  review_invite:     { Icon: StarIcon,           bg: "bg-yellow-50",  iconColor: "text-yellow-500" },
  coupon_received:   { Icon: GiftIcon,           bg: "bg-pink-50",    iconColor: "text-pink-500"   },
  refund_approved:   { Icon: ReceiptRefundIcon,  bg: "bg-green-50",   iconColor: "text-green-500"  },
  refund_rejected:   { Icon: XCircleIcon,        bg: "bg-red-50",     iconColor: "text-red-400"    },
  system:            { Icon: BellIcon,           bg: "bg-primary-100",iconColor: "text-primary-500"},
};

function NotificationItem({ n, markAsRead, deleteNotification }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
  const { Icon, bg, iconColor } = cfg;

  function handleClick() {
    if (!n.is_read) {
      startTransition(async () => {
        await markAsRead(n.id);
      });
    }
    if (n.link) router.push(n.link);
  }

  function handleDelete(e) {
    e.stopPropagation();
    startTransition(async () => {
      await deleteNotification(n.id);
    });
  }

  const timeAgo = formatDistanceToNow(new Date(n.created_at), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div
      onClick={handleClick}
      className={`flex gap-4 px-5 py-4 cursor-pointer border-b border-primary-100 transition-all hover:bg-primary-50 ${
        !n.is_read ? "border-l-4 border-l-accent-500" : "border-l-4 border-l-transparent"
      } ${isPending ? "opacity-50" : ""}`}
    >
      {/* 图标 */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!n.is_read ? "font-semibold text-primary-900" : "font-medium text-primary-700"}`}>
          {n.title}
        </p>
        {n.body && (
          <p className="text-xs text-primary-500 mt-0.5 line-clamp-2">{n.body}</p>
        )}
        <p className="text-xs text-primary-400 mt-1">{timeAgo}</p>
      </div>

      {/* 删除 */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 text-primary-300 hover:text-red-400 transition-colors self-start mt-1"
        aria-label="删除"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationList({ notifications, markAsRead, deleteNotification }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 text-primary-400">
        <p className="text-4xl mb-3">🔔</p>
        <p className="text-lg">暂无消息</p>
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.is_read);
  const read = notifications.filter((n) => n.is_read);

  return (
    <div className="border border-primary-200 rounded-xl overflow-hidden">
      {unread.length > 0 && (
        <>
          <div className="px-5 py-2 bg-primary-50 border-b border-primary-200">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
              未读 · {unread.length}
            </p>
          </div>
          {unread.map((n) => (
            <NotificationItem
              key={n.id}
              n={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          ))}
        </>
      )}

      {read.length > 0 && (
        <>
          <div className="px-5 py-2 bg-primary-50 border-b border-primary-200">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
              已读 · {read.length}
            </p>
          </div>
          {read.map((n) => (
            <NotificationItem
              key={n.id}
              n={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          ))}
        </>
      )}
    </div>
  );
}
