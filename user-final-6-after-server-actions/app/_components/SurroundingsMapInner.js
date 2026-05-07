"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { POI_DATA, POI_TYPES, calcDistance } from "@/app/_lib/poi-data";

function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function createCabinIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="price-marker selected">🏠 木屋</div>`,
    iconSize: [70, 34],
    iconAnchor: [35, 34],
  });
}

function createPoiIcon(type, isSelected) {
  const { emoji, color } = POI_TYPES[type];
  return L.divIcon({
    className: "",
    html: `<div class="poi-marker${isSelected ? " selected" : ""}" style="background:${color}">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 13), { duration: 0.7 });
  }, [position, map]);
  return null;
}

export default function SurroundingsMapInner({ cabin }) {
  const [activeType, setActiveType] = useState("parking");
  const [selectedId, setSelectedId] = useState(null);
  const listRefs = useRef({});

  useEffect(() => { fixLeafletIcons(); }, []);

  const allPois = POI_DATA[cabin.id] ?? POI_DATA.default;

  const filteredPois = allPois
    .filter((p) => p.type === activeType)
    .map((p) => ({
      ...p,
      distance: Number(calcDistance(cabin.latitude, cabin.longitude, p.lat, p.lng)),
    }))
    .sort((a, b) => a.distance - b.distance);

  const selectedPoi = filteredPois.find((p) => p.id === selectedId) ?? null;

  function handleTabClick(type) {
    setActiveType(type);
    setSelectedId(null);
  }

  function handleMarkerClick(poi) {
    setSelectedId(poi.id);
    // 滚动列表到对应项
    setTimeout(() => {
      listRefs.current[poi.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  function handleListClick(poi) {
    setSelectedId(poi.id);
  }

  return (
    <div className="border border-primary-300 rounded-xl overflow-hidden">
      {/* Tab 栏 */}
      <div className="flex flex-wrap gap-2 px-4 py-3 bg-primary-50 border-b border-primary-200">
        {Object.entries(POI_TYPES).map(([type, { label, emoji }]) => (
          <button
            key={type}
            onClick={() => handleTabClick(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              activeType === type
                ? "bg-accent-500 text-white shadow-sm"
                : "bg-white border border-primary-300 text-primary-600 hover:bg-primary-100"
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* 地图 + 列表 */}
      <div className="grid grid-cols-[1fr_300px]">
        {/* 地图 */}
        <div className="h-[420px]">
          <MapContainer
            center={[cabin.latitude, cabin.longitude]}
            zoom={11}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {selectedPoi && (
              <FlyTo position={[selectedPoi.lat, selectedPoi.lng]} />
            )}

            {/* 木屋 marker */}
            <Marker
              position={[cabin.latitude, cabin.longitude]}
              icon={createCabinIcon()}
              zIndexOffset={2000}
            />

            {/* POI markers */}
            {filteredPois.map((poi) => (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                icon={createPoiIcon(poi.type, poi.id === selectedId)}
                zIndexOffset={poi.id === selectedId ? 1000 : 0}
                eventHandlers={{ click: () => handleMarkerClick(poi) }}
              />
            ))}
          </MapContainer>
        </div>

        {/* 右侧列表 */}
        <div className="border-l border-primary-200 flex flex-col h-[420px]">
          <div className="px-4 py-3 border-b border-primary-100 bg-primary-50">
            <p className="text-sm font-semibold text-primary-700">
              {POI_TYPES[activeType].emoji} {POI_TYPES[activeType].label}
              <span className="ml-2 text-primary-400 font-normal">
                共 {filteredPois.length} 处
              </span>
            </p>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredPois.length === 0 ? (
              <p className="text-primary-400 text-sm text-center py-10">暂无数据</p>
            ) : (
              filteredPois.map((poi) => (
                <div
                  key={poi.id}
                  ref={(el) => (listRefs.current[poi.id] = el)}
                  onClick={() => handleListClick(poi)}
                  className={`px-4 py-3 cursor-pointer border-b border-primary-100 hover:bg-primary-50 transition-all ${
                    selectedId === poi.id
                      ? "border-l-4 border-l-accent-500 bg-accent-50"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <p className="font-semibold text-primary-800 text-sm leading-snug">
                    {poi.name}
                  </p>
                  {poi.description && (
                    <p className="text-xs text-primary-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {poi.description}
                    </p>
                  )}
                  <p className="text-xs text-accent-600 font-semibold mt-1">
                    📍 {poi.distance} km
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
