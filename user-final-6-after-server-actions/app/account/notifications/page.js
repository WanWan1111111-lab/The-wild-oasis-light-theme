import { auth } from "@/app/_lib/auth";
import { getNotifications } from "@/app/_lib/data-service";
import { markAsRead, markAllRead, deleteNotification } from "@/app/_lib/actions";
import { redirect } from "next/navigation";
import NotificationList from "@/app/_components/NotificationList";

export const metadata = { title: "消息中心" };

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");

  const notifications = await getNotifications(session.user.guestId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-2xl text-accent-600">消息中心</h2>
        {notifications.some((n) => !n.is_read) && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="text-sm text-accent-600 hover:text-accent-500 border border-accent-400 px-3 py-1.5 rounded-full transition-colors"
            >
              全部已读
            </button>
          </form>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
      />
    </div>
  );
}
