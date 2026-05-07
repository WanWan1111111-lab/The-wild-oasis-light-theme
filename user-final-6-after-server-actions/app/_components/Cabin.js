import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";

function Cabin({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  return (
    <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-300 shadow-card py-3 px-10 mb-24 bg-white">
      <div className="relative scale-[1.15] -translate-x-3">
        <Image
          src={image}
          fill
          className="object-cover"
          alt={`Cabin ${name}`}
        />
      </div>

      <div>
        <h3 className="text-accent-600 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-100 p-6 pb-1 w-[150%]">
          {name}号木屋
        </h3>

        <p className="text-lg text-primary-800 mb-10">
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className="flex flex-col gap-4 mb-7">
          <li className="flex gap-3 items-center">
            <UsersIcon className="h-5 w-5 text-accent-500" />
            <span className="text-lg text-primary-700">
              最多可容纳 <span className="font-bold text-primary-900">{maxCapacity}</span> 位客人
            </span>
          </li>
          <li className="flex gap-3 items-center">
            <MapPinIcon className="h-5 w-5 text-accent-500" />
            <span className="text-lg text-primary-700">
              坐落于意大利{" "}
              <span className="font-bold text-primary-900">多洛米蒂山脉</span>的心脏地带
            </span>
          </li>
          <li className="flex gap-3 items-center">
            <EyeSlashIcon className="h-5 w-5 text-accent-500" />
            <span className="text-lg text-primary-700">
              <span className="font-bold text-primary-900">100%</span> 隐私保障
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Cabin;
