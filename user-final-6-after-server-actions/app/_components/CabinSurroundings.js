import SurroundingsMap from "./SurroundingsMap";

export default function CabinSurroundings({ cabin }) {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-semibold text-accent-400 mb-6">周边环境</h2>
      <SurroundingsMap cabin={cabin} />
    </div>
  );
}
