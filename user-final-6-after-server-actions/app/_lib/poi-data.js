export const POI_TYPES = {
  parking:    { label: "停车场", emoji: "🅿️", color: "#6B7280" },
  food:       { label: "美食",   emoji: "🍽️", color: "#EF4444" },
  attraction: { label: "景点",   emoji: "🏔️", color: "#3B82F6" },
  photo:      { label: "拍照点", emoji: "📸", color: "#EC4899" },
  route:      { label: "游玩路线",emoji: "🥾", color: "#10B981" },
  transport:  { label: "交通",   emoji: "🚗", color: "#F59E0B" },
};

// 多洛米蒂山脉区域共用 POI 数据
export const POI_DATA = {
  default: [
    // 停车场
    { id: "pk1", type: "parking", name: "Passo Gardena 停车场", lat: 46.4980, lng: 11.8230, description: "免费停车，可停约 80 辆，旺季建议早到" },
    { id: "pk2", type: "parking", name: "Val Gardena 收费停车场", lat: 46.5120, lng: 11.9100, description: "收费 €5/天，全天候开放" },
    { id: "pk3", type: "parking", name: "Ortisei 镇中心停车场", lat: 46.5760, lng: 11.6720, description: "免费，限时 2 小时，适合短暂停留" },
    { id: "pk4", type: "parking", name: "Selva di Val Gardena P1", lat: 46.5560, lng: 11.7560, description: "大型停车场，可停 200 辆，收费 €3/天" },

    // 美食
    { id: "fd1", type: "food", name: "Rifugio Gardeccia", lat: 46.4150, lng: 11.8560, description: "山间小屋餐厅，传统南蒂罗尔料理，推荐 Schlutzkrapfen" },
    { id: "fd2", type: "food", name: "Restaurant La Perla", lat: 46.5010, lng: 11.7430, description: "米其林推荐，精致意式料理，需提前预订" },
    { id: "fd3", type: "food", name: "Pizzeria Al Sole", lat: 46.5230, lng: 11.8890, description: "平价披萨，当地人常去，推荐薄底玛格丽特" },
    { id: "fd4", type: "food", name: "Café Dolomiti", lat: 46.4880, lng: 11.9340, description: "景观咖啡馆，提供自制蛋糕和热巧克力" },
    { id: "fd5", type: "food", name: "Rifugio Puez", lat: 46.5670, lng: 11.8120, description: "海拔 2475m 的山顶小屋，徒步补给首选" },

    // 景点
    { id: "at1", type: "attraction", name: "Lago di Carezza 彩虹湖", lat: 46.4080, lng: 11.5720, description: "多洛米蒂最美湖泊，湖面倒映山峰，色彩如彩虹" },
    { id: "at2", type: "attraction", name: "Tre Cime di Lavaredo 三峰山", lat: 46.6200, lng: 12.3000, description: "多洛米蒂标志性景观，三座巨型岩峰直插云霄" },
    { id: "at3", type: "attraction", name: "Alpe di Siusi 西西高原", lat: 46.5400, lng: 11.6300, description: "欧洲最大高山草甸，春夏野花盛开，冬季滑雪胜地" },
    { id: "at4", type: "attraction", name: "Castel Roncolo 朗科洛城堡", lat: 46.5200, lng: 11.3400, description: "14 世纪中世纪城堡，保存完好的壁画令人叹为观止" },

    // 拍照点
    { id: "ph1", type: "photo", name: "Tre Cime 日出观景台", lat: 46.6180, lng: 12.2980, description: "日出时分三峰山被染成橙红色，是多洛米蒂最佳拍摄时机" },
    { id: "ph2", type: "photo", name: "Lago di Braies 布莱斯湖", lat: 46.6940, lng: 12.0840, description: "翡翠绿湖水配合白雪山峰，网红打卡地，建议清晨前往" },
    { id: "ph3", type: "photo", name: "Seceda 山脊线", lat: 46.5890, lng: 11.7230, description: "锯齿状山脊线是多洛米蒂最具辨识度的轮廓，缆车可达" },
    { id: "ph4", type: "photo", name: "Passo Giau 加乌山口", lat: 46.4840, lng: 12.0530, description: "海拔 2236m，360° 全景视野，秋季色彩最为震撼" },

    // 游玩路线
    { id: "rt1", type: "route", name: "Alta Via 1 经典徒步路线", lat: 46.5100, lng: 12.1500, description: "多洛米蒂最著名徒步路线，全程约 120km，分 8 段可走" },
    { id: "rt2", type: "route", name: "Tre Cime 环形徒步", lat: 46.6150, lng: 12.2900, description: "三峰山环形路线，全程约 10km，难度适中，约 3-4 小时" },
    { id: "rt3", type: "route", name: "Alpe di Siusi 骑行路线", lat: 46.5350, lng: 11.6400, description: "高原骑行，全程约 25km，沿途风景绝美，可租电动自行车" },
    { id: "rt4", type: "route", name: "Val Gardena 自驾环线", lat: 46.5500, lng: 11.7800, description: "经典自驾路线，途经 4 个山口，全程约 80km，建议一天完成" },

    // 交通
    { id: "tr1", type: "transport", name: "Bolzano 博尔扎诺机场", lat: 46.4600, lng: 11.3260, description: "最近机场，距木屋区约 40km，有租车服务，飞行时间约 1h" },
    { id: "tr2", type: "transport", name: "Bolzano 火车站", lat: 46.4940, lng: 11.3540, description: "意大利铁路网络，可连接米兰、威尼斯等主要城市" },
    { id: "tr3", type: "transport", name: "Ortisei 缆车站", lat: 46.5760, lng: 11.6730, description: "通往 Seceda 和 Alpe di Siusi，旺季建议提前购票" },
    { id: "tr4", type: "transport", name: "Val Gardena 公交总站", lat: 46.5580, lng: 11.7600, description: "连接各村庄的公交线路，夏季班次频繁，持 Guest Card 免费" },
  ],
};

// Haversine 公式计算两点距离（km）
export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}
