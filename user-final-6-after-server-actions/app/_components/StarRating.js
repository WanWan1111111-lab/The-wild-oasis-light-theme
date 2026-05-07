"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

function StarRating({ name = "rating", defaultValue = 0 }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="flex gap-1">
      <input type="hidden" name={name} value={selected} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setSelected(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          {star <= (hovered || selected) ? (
            <StarIcon className="h-7 w-7 text-accent-400" />
          ) : (
            <StarOutline className="h-7 w-7 text-primary-500" />
          )}
        </button>
      ))}
    </div>
  );
}

export default StarRating;
