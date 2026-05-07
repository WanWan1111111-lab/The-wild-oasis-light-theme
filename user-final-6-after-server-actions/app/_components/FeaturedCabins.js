import Image from "next/image";
import Link from "next/link";
import { UsersIcon, StarIcon } from "@heroicons/react/24/solid";
import { getFeaturedCabins } from "../_lib/data-service";

async function FeaturedCabins() {
  const featured = await getFeaturedCabins();

  if (!featured.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <StarIcon className="h-6 w-6 text-accent-500" />
        <h2 className="text-2xl font-semibold text-accent-600">精选推荐</h2>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((cabin) => (
          <div
            key={cabin.id}
            className="flex flex-col border border-primary-300 shadow-card hover:shadow-hover transition-shadow relative overflow-hidden bg-white"
          >
            {/* 推荐标签 */}
            <div className="absolute top-3 left-3 z-10 bg-accent-500 text-white text-xs font-bold px-2 py-1 flex items-center gap-1">
              <StarIcon className="h-3 w-3" />
              推荐
            </div>

            <div className="relative h-40">
              <Image
                src={cabin.image}
                fill
                alt={`Cabin ${cabin.name}`}
                className="object-cover"
              />
            </div>

            <div className="p-4 bg-white flex-grow flex flex-col justify-between border-t border-primary-300">
              <div>
                <h3 className="text-accent-600 font-semibold text-lg mb-2">
                  {cabin.name}号木屋
                </h3>
                <div className="flex items-center gap-2 text-primary-600 text-sm mb-3">
                  <UsersIcon className="h-4 w-4 text-primary-400" />
                  <span>最多 {cabin.maxCapacity} 位客人</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p>
                  {cabin.discount > 0 ? (
                    <>
                      <span className="text-xl font-semibold text-primary-900">
                        ¥{cabin.regularPrice - cabin.discount}
                      </span>
                      <span className="line-through text-primary-400 text-sm ml-2">
                        ¥{cabin.regularPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-primary-900">
                      ¥{cabin.regularPrice}
                    </span>
                  )}
                  <span className="text-primary-500 text-sm"> / 晚</span>
                </p>

                <Link
                  href={`/cabins/${cabin.id}`}
                  className="text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors"
                >
                  查看详情 &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-primary-300 mt-10 mb-2" />
    </div>
  );
}

export default FeaturedCabins;
