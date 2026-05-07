"use client";

import { useState } from "react";
import Logo from "./Logo";

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const LIMIT = 80;
  const needsTruncate = children.length > LIMIT;
  const displayText =
    isExpanded || !needsTruncate ? children : children.slice(0, LIMIT) + "...";

  return (
    <span>
      {displayText}{" "}
      {needsTruncate && (
        <button
          className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "收起" : "展开"}
        </button>
      )}
    </span>
  );
}

export default TextExpander;
