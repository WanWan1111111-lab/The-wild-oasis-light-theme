"use client";

import { useState } from "react";
import CabinCard from "./CabinCard";
import CabinMap from "./CabinMap";

function CabinMapView({ cabins, wishlistedIds = [], isLoggedIn = false }) {
  const [activeCabinId, setActiveCabinId] = useState(null);

  if (!cabins.length)
    return (
      <p className="text-primary-500 text-center text-lg py-12">
        没有找到符合条件的木屋，请尝试其他关键词。
      </p>
    );

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-0 border border-primary-300 shadow-card">
      {/* 左侧：木屋列表 */}
      <div className="overflow-y-auto max-h-[680px] divide-y divide-primary-200 border-r border-primary-300">
        {cabins.map((cabin) => (
          <div
            key={cabin.id}
            onClick={() => setActiveCabinId(cabin.id === activeCabinId ? null : cabin.id)}
            className={`p-4 cursor-pointer transition-colors ${
              activeCabinId === cabin.id
                ? "bg-accent-50 border-l-4 border-l-accent-500"
                : "hover:bg-primary-50 border-l-4 border-l-transparent"
            }`}
          >
            <CabinCard
              cabin={cabin}
              isWishlisted={wishlistedIds.includes(cabin.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        ))}
      </div>

      {/* 右侧：地图（粘性） */}
      <div className="h-[680px] sticky top-4">
        <CabinMap cabins={cabins} activeCabinId={activeCabinId} onSelectCabin={setActiveCabinId} />
      </div>
    </div>
  );
}

export default CabinMapView;
