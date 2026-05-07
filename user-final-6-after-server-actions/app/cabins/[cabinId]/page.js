import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import WishlistButton from "@/app/_components/WishlistButton";
import CabinReviews from "@/app/_components/CabinReviews";
import WelcomePackBanner from "@/app/_components/WelcomePackBanner";
import CabinSurroundings from "@/app/_components/CabinSurroundings";
import { getCabin, getCabins, getWishlistedCabinIds } from "@/app/_lib/data-service";
import { auth } from "@/app/_lib/auth";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return { title: `${name}号木屋` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
}

export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinId);
  const session = await auth();
  const isLoggedIn = !!session;
  const wishlistedIds = isLoggedIn
    ? await getWishlistedCabinIds(session.user.guestId)
    : [];
  const isWishlisted = wishlistedIds.includes(cabin.id);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2 text-primary-700">
          <WishlistButton
            cabinId={cabin.id}
            isWishlisted={isWishlisted}
            isLoggedIn={isLoggedIn}
          />
          <span className="text-sm font-medium">
            {isWishlisted ? "已收藏" : "收藏木屋"}
          </span>
        </div>
      </div>

      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          立即预订{cabin.name}号木屋
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>

      <Suspense fallback={<Spinner />}>
        <CabinReviews cabinId={cabin.id} />
      </Suspense>

      <CabinSurroundings cabin={cabin} />

      <Suspense fallback={null}>
        <WelcomePackBanner />
      </Suspense>
    </div>
  );
}
