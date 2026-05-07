import dynamic from "next/dynamic";

const SurroundingsMapInner = dynamic(() => import("./SurroundingsMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center bg-primary-50">
      <div className="spinner" />
    </div>
  ),
});

// 多洛米蒂默认中心坐标
const DEFAULT_LAT = 46.51;
const DEFAULT_LNG = 11.78;

export default function SurroundingsMap({ cabin }) {
  const cabinWithCoords = {
    ...cabin,
    latitude: cabin.latitude ?? DEFAULT_LAT,
    longitude: cabin.longitude ?? DEFAULT_LNG,
  };
  return <SurroundingsMapInner cabin={cabinWithCoords} />;
}
