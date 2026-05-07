"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { UsersIcon, XMarkIcon } from "@heroicons/react/24/solid";

// Fix leaflet default icon issue in Next.js
function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function createPriceIcon(price, isSelected) {
  const discounted = price;
  return L.divIcon({
    className: "",
    html: `<div class="price-marker${isSelected ? " selected" : ""}">¥${discounted}</div>`,
    iconSize: [70, 34],
    iconAnchor: [35, 34],
    popupAnchor: [0, -34],
  });
}

// 地图自动飞到选中 marker
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 13), { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

function CabinPreviewCard({ cabin, onClose }) {
  const price =
    cabin.discount > 0 ? cabin.regularPrice - cabin.discount : cabin.regularPrice;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80 bg-white border border-primary-300 shadow-hover rounded-sm overflow-hidden">
      <div className="relative h-40">
        <Image
          src={cabin.image}
          fill
          alt={`Cabin ${cabin.name}`}
          className="object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-float hover:bg-primary-100 transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-primary-700" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary-900 text-lg mb-1">
          {cabin.name}号木屋
        </h3>
        <div className="flex items-center gap-2 text-primary-600 text-sm mb-3">
          <UsersIcon className="h-4 w-4 text-primary-400" />
          <span>最多 {cabin.maxCapacity} 位客人</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-primary-900">
              ¥{price}
            </span>
            {cabin.discount > 0 && (
              <span className="line-through text-primary-400 text-sm ml-2">
                ¥{cabin.regularPrice}
              </span>
            )}
            <span className="text-primary-500 text-sm"> / 晚</span>
          </div>
          <Link
            href={`/cabins/${cabin.id}`}
            className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            查看详情 →
          </Link>
        </div>
      </div>
    </div>
  );
}

function CabinMapInner({ cabins, activeCabinId, onSelectCabin }) {
  const [internalSelected, setInternalSelected] = useState(null);

  // 优先用外部控制的 activeCabinId，没有则用内部状态（兼容单独使用场景）
  const isControlled = activeCabinId !== undefined;
  const selectedId = isControlled ? activeCabinId : internalSelected;

  function handleSelect(cabin) {
    const newId = selectedId === cabin.id ? null : cabin.id;
    if (isControlled) {
      onSelectCabin?.(newId);
    } else {
      setInternalSelected(newId);
    }
  }

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // 过滤有坐标的木屋
  const mappableCabins = cabins.filter(
    (c) => c.latitude != null && c.longitude != null
  );

  const selectedCabin = mappableCabins.find((c) => c.id === selectedId) ?? null;

  // 地图中心：有坐标取平均，否则用多洛米蒂默认坐标
  const center =
    mappableCabins.length > 0
      ? [
          mappableCabins.reduce((s, c) => s + c.latitude, 0) /
            mappableCabins.length,
          mappableCabins.reduce((s, c) => s + c.longitude, 0) /
            mappableCabins.length,
        ]
      : [46.41, 11.85];

  const selectedPosition = selectedCabin
    ? [selectedCabin.latitude, selectedCabin.longitude]
    : null;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedPosition && <FlyToMarker position={selectedPosition} />}

        {mappableCabins.map((cabin) => {
          const price =
            cabin.discount > 0
              ? cabin.regularPrice - cabin.discount
              : cabin.regularPrice;
          const isSelected = selectedCabin?.id === cabin.id;

          return (
            <Marker
              key={cabin.id}
              position={[cabin.latitude, cabin.longitude]}
              icon={createPriceIcon(price, isSelected)}
              eventHandlers={{
                click: () => handleSelect(cabin),
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            />
          );
        })}
      </MapContainer>

      {selectedCabin && (
        <CabinPreviewCard
          cabin={selectedCabin}
          onClose={() => handleSelect(selectedCabin)}
        />
      )}

      {mappableCabins.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-50/80 z-[500]">
          <p className="text-primary-600 text-lg">
            暂无木屋坐标数据，请在管理员端配置坐标后刷新。
          </p>
        </div>
      )}
    </div>
  );
}

export default CabinMapInner;
