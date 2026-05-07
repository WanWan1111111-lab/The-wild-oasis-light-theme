import Image from "next/image";
import Link from "next/link";
import { UsersIcon } from "@heroicons/react/24/solid";
import WishlistButton from "./WishlistButton";
import CompareCheckbox from "./CompareCheckbox";

function CabinCard({ cabin, isWishlisted = false, isLoggedIn = false }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;

  return (
    <div className="flex border border-primary-300 shadow-card hover:shadow-hover transition-shadow bg-white">
      <div className="flex-1 relative">
        <Image
          src={image}
          fill
          alt={`Cabin ${name}`}
          className="object-cover border-r border-primary-300"
        />
      </div>

      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-white">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-accent-600 font-semibold text-2xl">
              {name}号木屋
            </h3>
            <WishlistButton
              cabinId={id}
              isWishlisted={isWishlisted}
              isLoggedIn={isLoggedIn}
            />
          </div>

          <div className="flex gap-3 items-center mb-2">
            <UsersIcon className="h-5 w-5 text-primary-500" />
            <p className="text-lg text-primary-600">
              最多可容纳 <span className="font-bold text-primary-800">{maxCapacity}</span> 位客人
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-[350] text-primary-900">
                  ¥{regularPrice - discount}
                </span>
                <span className="line-through font-semibold text-primary-400">
                  ¥{regularPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-[350] text-primary-900">¥{regularPrice}</span>
            )}
            <span className="text-primary-600">/ 晚</span>
          </p>
        </div>

        <div className="bg-primary-100 border-t border-primary-300 flex items-center justify-between">
          <div className="pl-4">
            <CompareCheckbox cabin={cabin} />
          </div>
          <Link
            href={`/cabins/${id}`}
            className="border-l border-primary-300 py-4 px-6 inline-block hover:bg-accent-500 transition-all hover:text-white text-primary-700 font-medium"
          >
            查看详情并预订 &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CabinCard;
