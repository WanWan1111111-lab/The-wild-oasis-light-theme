"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef(null);

  const activeFilter = searchParams.get("capacity") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSearch(e) {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const value = e.target.value.trim();
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
  }

  return (
    <div className="flex items-center gap-4 flex-wrap justify-end">
      <input
        type="text"
        defaultValue={searchQuery}
        onChange={handleSearch}
        placeholder="搜索木屋名称..."
        className="px-4 py-2 bg-white border border-primary-300 text-primary-800 placeholder-primary-400 rounded-sm focus:outline-none focus:border-accent-500 w-52 shadow-float"
      />
      <div className="border border-primary-300 flex shadow-float bg-white">
        <Button filter="all" handleFilter={handleFilter} activeFilter={activeFilter}>
          全部木屋
        </Button>
        <Button filter="small" handleFilter={handleFilter} activeFilter={activeFilter}>
          2&mdash;3 位客人
        </Button>
        <Button filter="medium" handleFilter={handleFilter} activeFilter={activeFilter}>
          4&mdash;7 位客人
        </Button>
        <Button filter="large" handleFilter={handleFilter} activeFilter={activeFilter}>
          8&mdash;12 位客人
        </Button>
      </div>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 text-primary-700 hover:bg-primary-200 transition-colors ${
        filter === activeFilter ? "bg-accent-500 text-white hover:bg-accent-600" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
