import { Suspense } from "react";
import FeaturedCabins from "../_components/FeaturedCabins";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ViewToggle from "../_components/ViewToggle";
import CabinListWithMap from "../_components/CabinListWithMap";
import { CompareProvider } from "../_components/CompareContext";
import CompareWrapper from "../_components/CompareWrapper";

export const revalidate = 3600;

export const metadata = {
  title: "木屋",
};

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";
  const search = searchParams?.search ?? "";
  const view = searchParams?.view ?? "list";

  return (
    <CompareProvider>
      <div className="pb-20">
        <h1 className="text-4xl mb-5 text-accent-500 font-medium">
          我们的奢华木屋
        </h1>
        <p className="text-primary-700 text-lg mb-10">
          温馨而奢华的木屋，坐落于意大利多洛米蒂山脉的心脏地带。
          想象一下，清晨在壮丽的山景中醒来，白天探索周围幽深的森林，
          或是在私人温泉中放松身心，仰望繁星点点的夜空。
          在这个远离尘嚣的小天地里，尽情享受大自然的美好。
          这里是宁静祥和假期的完美之选。欢迎来到世外桃源。
        </p>

        <Suspense fallback={null}>
          <FeaturedCabins />
        </Suspense>

        <div className="flex justify-between items-center mb-8">
          <ViewToggle />
          <Filter />
        </div>

        <Suspense fallback={<Spinner />} key={filter + search + view}>
          <CabinListWithMap filter={filter} search={search} view={view} />
        </Suspense>
      </div>
      <CompareWrapper />
    </CompareProvider>
  );
}
