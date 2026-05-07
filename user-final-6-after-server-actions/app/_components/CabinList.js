import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "@/app/_components/CabinCard";
import { getCabins, getWishlistedCabinIds } from "../_lib/data-service";
import { auth } from "../_lib/auth";

async function CabinList({ filter, search = "" }) {
  // noStore();

  const cabins = await getCabins();
  const session = await auth();
  const isLoggedIn = !!session;
  const wishlistedIds = isLoggedIn
    ? await getWishlistedCabinIds(session.user.guestId)
    : [];

  if (!cabins.length) return null;

  let displayedCabins;
  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  if (search) {
    const keyword = search.toLowerCase();
    displayedCabins = displayedCabins.filter((cabin) =>
      cabin.name.toLowerCase().includes(keyword)
    );
  }

  if (!displayedCabins.length)
    return (
      <p className="text-primary-400 text-center text-lg py-12">
        没有找到符合条件的木屋，请尝试其他关键词。
      </p>
    );

  return (
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
  );
}

export default CabinList;
