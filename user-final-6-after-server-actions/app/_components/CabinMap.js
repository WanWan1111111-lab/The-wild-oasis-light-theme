import dynamic from "next/dynamic";

const CabinMapInner = dynamic(() => import("./CabinMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-primary-50">
      <div className="spinner" />
    </div>
  ),
});

function CabinMap({ cabins, activeCabinId, onSelectCabin }) {
  return <CabinMapInner cabins={cabins} activeCabinId={activeCabinId} onSelectCabin={onSelectCabin} />;
}

export default CabinMap;
