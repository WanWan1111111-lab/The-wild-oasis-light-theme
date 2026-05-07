"use client";

import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { useOptimistic, useTransition } from "react";
import { toggleWishlist } from "../_lib/actions";

function WishlistButton({ cabinId, isWishlisted, isLoggedIn }) {
  const [optimisticWishlisted, setOptimisticWishlisted] = useOptimistic(isWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick(e) {
    e.preventDefault();

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    startTransition(async () => {
      setOptimisticWishlisted((prev) => !prev);
      await toggleWishlist(cabinId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={optimisticWishlisted ? "取消收藏" : "收藏木屋"}
      className={`p-1.5 rounded-full transition-all ${
        isPending ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      }`}
    >
      {optimisticWishlisted ? (
        <HeartIcon className="h-6 w-6 text-red-500" />
      ) : (
        <HeartOutlineIcon className="h-6 w-6 text-primary-400 hover:text-red-400" />
      )}
    </button>
  );
}

export default WishlistButton;
