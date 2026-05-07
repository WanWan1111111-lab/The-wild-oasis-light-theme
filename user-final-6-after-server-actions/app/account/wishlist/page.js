import Image from "next/image";
import Link from "next/link";
import { auth } from "@/app/_lib/auth";
import { getWishlistByGuestId } from "@/app/_lib/data-service";
import WishlistButton from "@/app/_components/WishlistButton";
import { UsersIcon } from "@heroicons/react/24/solid";

export const metadata = {
  title: "我的收藏",
};

export default async function Page() {
  const session = await auth();
  const wishlist = await getWishlistByGuestId(session.user.guestId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">我的收藏</h2>

      {wishlist.length === 0 ? (
        <p className="text-lg text-primary-600">
          您还没有收藏任何木屋。快去{" "}
          <Link className="underline text-accent-600" href="/cabins">
            浏览木屋 &rarr;
          </Link>
        </p>
      ) : (
        <ul className="space-y-6">
          {wishlist.map(({ id, cabinId, cabins: cabin }) => (
            <li key={id} className="flex border border-primary-300 shadow-card bg-white">
              <div className="relative h-32 aspect-square flex-shrink-0">
                <Image
                  src={cabin.image}
                  alt={`Cabin ${cabin.name}`}
                  fill
                  className="object-cover border-r border-primary-300"
                />
              </div>

              <div className="flex-grow px-6 py-3 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-primary-800">
                    {cabin.name}号木屋
                  </h3>
                  <WishlistButton
                    cabinId={cabinId}
                    isWishlisted={true}
                    isLoggedIn={true}
                  />
                </div>

                <div className="flex items-center gap-3 text-primary-600">
                  <UsersIcon className="h-4 w-4 text-primary-400" />
                  <span>最多 {cabin.maxCapacity} 位客人</span>
                  <span className="ml-auto text-accent-600 font-semibold text-lg">
                    {cabin.discount > 0 ? (
                      <>¥{cabin.regularPrice - cabin.discount}</>
                    ) : (
                      <>¥{cabin.regularPrice}</>
                    )}
                    <span className="text-primary-500 text-sm font-normal"> / 晚</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center border-l border-primary-300 px-5">
                <Link
                  href={`/cabins/${cabinId}`}
                  className="text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors whitespace-nowrap"
                >
                  查看详情 &rarr;
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
