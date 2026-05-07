import Link from "next/link";
import { auth } from "../_lib/auth";
import { getUnreadCount } from "../_lib/data-service";
import NotificationBell from "./NotificationBell";

export default async function Navigation() {
  const session = await auth();
  const guestId = session?.user?.guestId ?? null;
  const unreadCount = guestId ? await getUnreadCount(guestId) : 0;

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link href="/cabins" className="text-accent-900 hover:text-accent-600 transition-colors font-medium">
            木屋
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-accent-900 hover:text-accent-600 transition-colors font-medium">
            关于我们
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link href="/account" className="text-accent-900 hover:text-accent-600 transition-colors flex items-center gap-4 font-medium">
              <img
                className="h-8 rounded-full ring-2 ring-accent-400"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>会员中心</span>
            </Link>
          ) : (
            <Link href="/account" className="text-primary-800 hover:text-accent-600 transition-colors font-medium">
              会员中心
            </Link>
          )}
        </li>
        {guestId && (
          <li>
            <NotificationBell guestId={guestId} initialCount={unreadCount} />
          </li>
        )}
      </ul>
    </nav>
  );
}
