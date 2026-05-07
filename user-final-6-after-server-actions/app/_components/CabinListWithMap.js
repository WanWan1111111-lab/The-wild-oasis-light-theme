import { getCabins, getWishlistedCabinIds } from "../_lib/data-service";
import { auth } from "../_lib/auth";
import CabinCard from "./CabinCard";
import CabinMapView from "./CabinMapView";
import ReservationReminder from "./ReservationReminder";

async function CabinListWithMap({ filter, search = "", view = "list" }) {
  const cabins = await getCabins();
  const session = await auth();
  const isLoggedIn = !!session;
  const wishlistedIds = isLoggedIn
    ? await getWishlistedCabinIds(session.user.guestId)
    : [];

  if (!cabins.length) return null;

  // 过滤容量
  let displayedCabins;
  if (filter === "all") displayedCabins = cabins;
  else if (filter === "small")
    displayedCabins = cabins.filter((c) => c.maxCapacity <= 3);
  else if (filter === "medium")
    displayedCabins = cabins.filter(
      (c) => c.maxCapacity >= 4 && c.maxCapacity <= 7
    );
  else if (filter === "large")
    displayedCabins = cabins.filter((c) => c.maxCapacity >= 8);
  else displayedCabins = cabins;

  // 过滤搜索
  if (search) {
    const keyword = search.toLowerCase();
    displayedCabins = displayedCabins.filter((c) =>
      c.name.toLowerCase().includes(keyword)
    );
  }

  if (!displayedCabins.length)
    return (
      <p className="text-primary-500 text-center text-lg py-12">
        没有找到符合条件的木屋，请尝试其他关键词。
      </p>
    );

  if (view === "map") {
    return (
      <>
        <CabinMapView
          cabins={displayedCabins}
          wishlistedIds={wishlistedIds}
          isLoggedIn={isLoggedIn}
        />
        <ReservationReminder />
      </>
    );
  }

  // 默认列表视图
  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {displayedCabins.map((cabin) => (
          <CabinCard
            cabin={cabin}
            key={cabin.id}
            isWishlisted={wishlistedIds.includes(cabin.id)}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
      <ReservationReminder />
    </>
  );
}

export default CabinListWithMap;
