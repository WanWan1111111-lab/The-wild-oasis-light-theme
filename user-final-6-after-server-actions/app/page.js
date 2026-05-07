import Link from "next/link";
import Image from "next/image";
import bg from "@/public/bg.png";

export default function Page() {
  return (
    <main className="mt-24">
      <Image
        src={bg}
        fill
        placeholder="blur"
        quality={80}
        className="object-cover object-top"
        alt="Mountains and forests with two cabins"
      />

      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          邂逅山野，栖居诗意
        </h1>
        <Link
          href="/cabins"
          className="bg-[#C8A96A] hover:bg-[#B8923F] px-8 py-6 text-primary-800 text-lg font-semibold transition-all"
        >
          探索奢华木屋
        </Link>
      </div>
    </main>
  );
}
