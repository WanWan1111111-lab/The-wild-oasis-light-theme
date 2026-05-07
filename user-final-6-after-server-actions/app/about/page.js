import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import { getCabins, getTopReviews } from "../_lib/data-service";
import FaqAccordion from "../_components/FaqAccordion";
import {
  SparklesIcon,
  FireIcon,
  SunIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export const revalidate = 86400;
export const metadata = { title: "关于我们" };

const TIMELINE = [
  { year: "1962", text: "祖父母创立，第一栋木屋落成" },
  { year: "1985", text: "扩建至 5 栋，引入温泉设施" },
  { year: "2003", text: "全面翻新，融入现代野奢美学" },
  { year: "2016", text: "荣获意大利最佳生态度假地奖" },
  { year: "2024", text: "第 8 栋木屋开放，至今持续运营" },
];

const STATS = [
  { num: "62", unit: "年", label: "家族传承" },
  { num: "8", unit: "栋", label: "奢华木屋" },
  { num: "10,000+", unit: "", label: "幸福家庭" },
  { num: "4.9", unit: "分", label: "平均评分" },
];

const FEATURES = [
  { icon: SparklesIcon, title: "私人温泉", desc: "每栋木屋配备独立露天温泉，仰望星空泡汤" },
  { icon: FireIcon, title: "篝火区", desc: "专属篝火台，夜晚围坐烤棉花糖" },
  { icon: SunIcon, title: "山景露台", desc: "270° 多洛米蒂全景，日出日落尽收眼底" },
  { icon: HeartIcon, title: "宠物友好", desc: "毛孩子同样欢迎，配备宠物专属设施" },
];

function StarRating({ rating }) {
  return (
    <span className="text-accent-400 tracking-wider text-sm">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "今天";
  if (diff < 30) return `${diff} 天前`;
  if (diff < 365) return `${Math.floor(diff / 30)} 个月前`;
  return `${Math.floor(diff / 365)} 年前`;
}

export default async function Page() {
  const cabins = await getCabins();
  const reviews = await getTopReviews(3);

  return (
    <div className="flex flex-col">

      {/* ══ HERO：超大标题 + 图片错位 ══ */}
      <section className="relative grid grid-cols-12 min-h-[520px] mb-24">
        {/* 左侧文字区，垂直居中 */}
        <div className="col-span-6 flex flex-col justify-center pr-12 py-16">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-6">
            Since 1962 · Dolomites, Italy
          </p>
          <h1 className="text-6xl font-medium text-primary-800 leading-tight mb-8">
            野奢绿洲<br />
            <span className="text-accent-400">自然之境</span>
          </h1>
          <p className="text-primary-600 text-base leading-relaxed max-w-md mb-10">
            隐匿于意大利多洛米蒂山脉心脏地带，{cabins.length} 栋奢华木屋，
            每一栋都是与自然重新连接的起点。
          </p>
          {/* 特色标签行 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {FEATURES.map((f) => (
              <span key={f.title} className="flex items-center gap-1.5 text-primary-500 text-xs">
                <f.icon className="w-3.5 h-3.5 text-accent-400 stroke-1" />
                {f.title}
              </span>
            ))}
          </div>
          <a
            href="/cabins"
            className="self-start bg-accent-500 px-8 py-4 text-primary-800 text-sm tracking-widest font-medium hover:bg-accent-600 transition-all uppercase"
          >
            探索木屋
          </a>
        </div>
        {/* 右侧图片 */}
        <div className="col-span-6 relative">
          <div className="absolute inset-0 -top-8 -right-8">
            <Image
              src={image1}
              alt="野奢绿洲"
              fill
              className="object-cover"
              placeholder="blur"
              quality={90}
            />
          </div>
        </div>
      </section>

      {/* ══ 家族故事：图片左，文字右 ══ */}
      <section className="grid grid-cols-12 gap-0 mb-24">
        <div className="col-span-5 relative" style={{ minHeight: "480px" }}>
          <Image src="/about-2.jpg" fill className="object-cover" alt="野奢绿洲的经营家族" />
        </div>
        <div className="col-span-6 col-start-7 flex flex-col justify-center pl-16 py-12">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-4">Our Story</p>
          <h2 className="text-4xl font-medium text-primary-800 mb-8 leading-snug">
            家族传承<br />始于 <span className="text-accent-400">1962</span>
          </h2>
          <div className="space-y-5 text-primary-600 text-base leading-relaxed">
            <p>
              自1962年以来，野奢绿洲一直是我们家族珍视的度假胜地。由祖父母创立，
              这片世外桃源在爱与关怀中代代相传。
            </p>
            <p>
              我们将山脉的永恒之美与家族企业独有的贴心服务完美融合。
              在这里，您不仅是客人，更是我们大家庭的一员。
            </p>
          </div>
          {/* 数据嵌入 */}
          <div className="mt-10 pt-8 border-t border-primary-300 grid grid-cols-4 gap-0">
            {STATS.map((s, i) => (
              <div key={s.label} className={`${i < 3 ? "border-r border-primary-300 pr-4" : ""} ${i > 0 ? "pl-4" : ""}`}>
                <div className="flex items-end gap-0.5">
                  <span className="text-2xl font-medium text-accent-400">{s.num}</span>
                  <span className="text-sm font-medium text-accent-300 mb-0.5">{s.unit}</span>
                </div>
                <div className="text-xs tracking-widest text-primary-400 uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 家族历史：横向时间线，节点错落 ══ */}
      <section className="mb-24 px-4">
        <div className="mb-12">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-4">Our Story</p>
          <h2 className="text-4xl font-medium text-primary-800 leading-snug">
            历史故事
          </h2>
          <div className="mt-4 w-8 border-t-2 border-accent-400" />
        </div>
        <div className="relative">
          <div className="absolute left-0 right-0 border-t border-primary-300" style={{ top: "50%" }} />
          <div className="relative grid grid-cols-5">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className="flex flex-col items-center"
                style={{ paddingTop: i % 2 === 0 ? "0" : "80px" }}
              >
                {i % 2 === 0 && (
                  <div className="text-center mb-5 px-3">
                    <div className="text-accent-500 font-medium text-lg">{item.year}</div>
                    <div className="text-primary-500 text-xs mt-2 leading-relaxed">{item.text}</div>
                  </div>
                )}
                <div className="w-2.5 h-2.5 rounded-full bg-accent-400 relative z-10 ring-4 ring-primary-100" />
                {i % 2 !== 0 && (
                  <div className="text-center mt-5 px-3">
                    <div className="text-accent-500 font-medium text-lg">{item.year}</div>
                    <div className="text-primary-500 text-xs mt-2 leading-relaxed">{item.text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 评价：错位三列 ══ */}
      {reviews.length > 0 && (
        <section className="mb-24">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-3 text-center">Guest Reviews</p>
          <h2 className="text-4xl font-medium text-primary-800 mb-2 text-center">真实住客评价</h2>
          <div className="w-8 border-t-2 border-accent-400 mb-12 mx-auto" />
          <div className="grid grid-cols-3 gap-0">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className={`p-10 border-r border-primary-300 last:border-r-0 bg-primary-50 border-l-2 border-l-accent-400`}
              >
                <div className="text-5xl text-accent-200 font-medium leading-none mb-4 select-none">"</div>
                <StarRating rating={r.rating} />
                <p className="text-primary-700 text-sm mt-4 leading-relaxed line-clamp-5">
                  {r.comment}
                </p>
                <p className="text-primary-400 text-xs mt-6 tracking-wide">
                  — {r.guests?.fullName ?? "匿名住客"} · {timeAgo(r.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ 地图：文字右，地图左 ══ */}
      <section className="grid grid-cols-12 gap-0 border-t border-primary-300 mb-24">
        <div className="col-span-7">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=11.7%2C46.3%2C12.0%2C46.5&layer=mapnik&marker=46.4102%2C11.8440"
            className="w-full border-r border-primary-300"
            style={{ height: "400px" }}
            title="野奢绿洲地理位置"
          />
        </div>
        <div className="col-span-5 flex flex-col justify-center pl-12 py-12 space-y-5 text-primary-600 text-sm">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-1">Find Us</p>
          <h2 className="text-4xl font-medium text-primary-800 mb-1">如何抵达</h2>
          <div className="w-8 border-t-2 border-accent-400 mb-4" />
          <p>📍 意大利多洛米蒂山脉，博尔扎诺省</p>
          <p>🚗 自驾：从博尔扎诺市区出发约 45 分钟</p>
          <p>✈️ 最近机场：因斯布鲁克机场（INN），车程约 1.5 小时</p>
          <p>🚂 最近火车站：博尔扎诺站，可预约接送服务</p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="border-t border-primary-300">
        <div className="pt-16 pb-2 text-center">
          <p className="text-xs tracking-[0.25em] text-primary-400 uppercase mb-3">FAQ</p>
          <h2 className="text-4xl font-medium text-primary-800 mb-2">常见问题</h2>
          <div className="w-8 border-t-2 border-accent-400 mx-auto" />
        </div>
        <FaqAccordion />
      </section>

    </div>
  );
}
