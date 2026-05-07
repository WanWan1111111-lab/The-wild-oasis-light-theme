"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
  HeartIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import SignOutButton from "./SignOutButton";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "首页",
    href: "/account",
    icon: <HomeIcon className="h-5 w-5 text-accent-500" />,
  },
  {
    name: "我的预订",
    href: "/account/reservations",
    icon: <CalendarDaysIcon className="h-5 w-5 text-accent-500" />,
  },
  {
    name: "我的收藏",
    href: "/account/wishlist",
    icon: <HeartIcon className="h-5 w-5 text-accent-500" />,
  },
  {
    name: "消息中心",
    href: "/account/notifications",
    icon: <BellIcon className="h-5 w-5 text-accent-500" />,
  },
  {
    name: "个人资料",
    href: "/account/profile",
    icon: <UserIcon className="h-5 w-5 text-accent-500" />,
  },
];

function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-r border-primary-300">
      <ul className="flex flex-col gap-2 h-full text-lg">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`py-3 px-5 hover:bg-primary-200 hover:text-primary-900 transition-colors flex items-center gap-4 font-semibold text-primary-700 ${
                pathname === link.href ? "bg-primary-200 text-primary-900" : ""
              }`}
              href={link.href}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}

        <li className="mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
