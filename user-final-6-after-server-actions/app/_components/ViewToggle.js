"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListBulletIcon, MapIcon } from "@heroicons/react/24/outline";

function ViewToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentView = searchParams.get("view") ?? "list";

  function switchView(view) {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex border border-primary-300 shadow-float bg-white">
      <button
        onClick={() => switchView("list")}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
          currentView === "list"
            ? "bg-accent-500 text-white"
            : "text-primary-700 hover:bg-primary-100"
        }`}
      >
        <ListBulletIcon className="h-4 w-4" />
        列表
      </button>
      <button
        onClick={() => switchView("map")}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l border-primary-300 ${
          currentView === "map"
            ? "bg-accent-500 text-white"
            : "text-primary-700 hover:bg-primary-100"
        }`}
      >
        <MapIcon className="h-4 w-4" />
        地图
      </button>
    </div>
  );
}

export default ViewToggle;
