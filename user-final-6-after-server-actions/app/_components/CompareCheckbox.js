"use client";

import { useCompare } from "./CompareContext";

export default function CompareCheckbox({ cabin }) {
  const { selected, toggle } = useCompare();
  const isSelected = selected.some((c) => c.id === cabin.id);
  const isDisabled = !isSelected && selected.length >= 3;

  return (
    <label
      className={`flex items-center gap-1.5 text-xs cursor-pointer select-none transition-colors ${
        isDisabled ? "opacity-40 cursor-not-allowed" : "text-primary-500 hover:text-primary-800"
      }`}
      title={isDisabled ? "最多对比 3 栋木屋" : ""}
    >
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => toggle(cabin)}
        className="accent-amber-500 w-3.5 h-3.5"
      />
      对比
    </label>
  );
}
