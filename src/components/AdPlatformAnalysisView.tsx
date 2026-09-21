import React, { useMemo, useState } from "react";
import {
  Search, Calendar, Download, Settings2, ChevronDown,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  Eye, ExternalLink, TrendingUp, Megaphone, Clapperboard,
  Radio, ShoppingCart, Layers, MonitorPlay
} from "lucide-react";

interface AdPlatformAnalysisViewProps {
  showToast?: (title: string, desc: string) => void;
}

// ============ 平台与推广类型 ============
const PLATFORMS = [
  { id: "qianchuan", name: "巨量千川", color: "#2563eb" },
  { id: "juliang", name: "巨量广告", color: "#7c3aed" },
  { id: "benditui", name: "巨量本地推", color: "#0891b2" },
  { id: "cailiao", name: "磁力智投", color: "#dc2626" },
  { id: "jinniu", name: "磁力金牛", color: "#ea580c" },
  { id: "adq", name: "腾讯ADQ", color: "#16a34a" },
  { id: "taobao", name: "淘宝超级短视频", color: "#e11d48" },
];

const PROMO_TABS = ["汇总", "标准推广", "直播全域推广", "商品全域推广"];

const DIMENSION_TABS = ["团队", "分组", "个人", "明细", "分日", "分月"] as const;
type DimensionTab = (typeof DIMENSION_TABS)[number];

// ============ 确定性伪随机 ============
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============ 原始明细行（虚拟电商数据，页面内自洽） ============
interface RawRow {
  team: string;
  group: string;
  author: string;
  cat1: string;
  cat2: string;
  video: string;
  uploadDate: string; // YYYY-MM-DD
  date: string; // 消耗日期
  month: string;
  cost: number; // 消耗
  orders: number; // 转化数
  gmv: number; // 成交金额
  coupon: number; // 智能优惠券
  platformSubsidy: number; // 电商平台补贴金额
  impressions: number; // 展示数
  clicks: number; // 点击数
  plays: number; // 播放量
  effectivePlays: number; // 有效播放数
  plays3s: number; // 3s播放数
}

const TEAMS = ["美妆爆品队", "服饰种草队", "个护家清队", "食品饮料队", "母婴宠物资队"];
const GROUPS: Record<string, string[]> = {
  美妆爆品队: ["护肤焕新组", "彩妆潮流组", "香氛精品组"],
  服饰种草队: ["内衣塑形组", "女装穿搭组", "运动休闲组"],
  个护家清队: ["洗护家清组", "口腔护理组", "纸品湿巾组"],
  食品饮料队: ["滋补养生组", "零食解馋组", "茶饮冲调组"],
  母婴宠物资队: ["婴童用品组", "宠物食品组", "孕妈营养组"],
};
const AUTHORS = ["小甜甜", "阿泽", "小鹿", "楠楠", "大飞", "雯雯", "老周", "桃桃", "Leo", "Momo", "Ada", "Kiki"];
const CAT1: Record<string, [string, string[]]> = {
  美妆爆品队: ["美妆护肤", ["面部精华", "面膜贴片", "口红唇釉", "防晒霜"]],
  服饰种草队: ["服饰内衣", ["女士内衣", "塑身衣", "家居服", "保暖内衣"]],
  个护家清队: ["个护家清", ["洗发水", "洗衣液", "牙膏", "纸巾"]],
  食品饮料队: ["食品饮料", ["黑芝麻丸", "养生茶", "坚果礼盒", "低脂零食"]],
  母婴宠物资队: ["母婴宠物", ["婴儿纸尿裤", "猫粮", "孕妇钙片", "儿童零食"]],
};

const VIDEO_TOPICS = [
  "熬夜党急救精华", "换季敏感肌救星", "黄皮显白口红", "高倍防晒不搓泥",
  "聚拢无痕内衣", "收腹提臀裤", "显瘦家居服", "秋冬加绒打底",
  "控油蓬松洗发水", "抑菌洗衣液", "美白牙膏", "柔纸巾",
  "黑芝麻丸零食", "红豆薏米茶", "每日坚果", "无蔗糖糕点",
  "超薄纸尿裤", "全价猫粮", "孕妇钙片", "宝宝溶豆",
];

function buildRawData(): RawRow[] {
  const rand = mulberry32(20260918);
  const rows: RawRow[] = [];
  let vid = 1;
  TEAMS.forEach((team) => {
    const groups = GROUPS[team];
    groups.forEach((group) => {
      const authorList = AUTHORS.slice(0, 3 + Math.floor(rand() * 3));
      authorList.forEach((author) => {
        const cat1 = CAT1[team][0];
        const cat2Pool = CAT1[team][1];
        const videoCount = 5 + Math.floor(rand() * 4);
        for (let v = 0; v < videoCount; v++) {
          const cat2 = cat2Pool[Math.floor(rand() * cat2Pool.length)];
          const topic = VIDEO_TOPICS[(vid + v) % VIDEO_TOPICS.length];
          const videoName = `${topic}_${String(vid).padStart(3, "0")}`;
          // 每条视频在 2026-09-03 ~ 2026-09-18 期间有消耗记录
          const days = 8 + Math.floor(rand() * 9);
          for (let d = 0; d < days; d++) {
            const dayOffset = Math.floor(rand() * 16);
            const date = new Date(2026, 8, 3 + dayOffset);
            const dateStr = date.toISOString().slice(0, 10);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const uploadOffset = Math.floor(rand() * 16);
            const uploadDate = new Date(2026, 8, 3 + uploadOffset);
            // 电商量级：消耗 200~6000/天
            const cost = Math.round(200 + rand() * 5800);
            const impressions = Math.round(cost * (180 + rand() * 320)); // 千次展现 ~
            const ctr = 0.018 + rand() * 0.06; // 点击率 1.8%~7.8%
            const clicks = Math.round(impressions * ctr);
            const cvr = 0.03 + rand() * 0.12; // 转化率
            const orders = Math.max(1, Math.round(clicks * cvr));
            const aov = 45 + rand() * 260; // 客单价
            const gmv = Math.round(orders * aov);
            const coupon = Math.round(gmv * (0.02 + rand() * 0.08));
            const platformSubsidy = Math.round(gmv * (0.01 + rand() * 0.05));
            const plays = Math.round(impressions * (0.35 + rand() * 0.5));
            const plays3s = Math.round(plays * (0.45 + rand() * 0.4));
            const effectivePlays = Math.round(plays * (0.12 + rand() * 0.25));
            rows.push({
              team, group, author: `${author}（${group.slice(0, 2)}）`,
              cat1, cat2, video: videoName,
              uploadDate: uploadDate.toISOString().slice(0, 10),
              date: dateStr, month,
              cost, orders, gmv, coupon, platformSubsidy,
              impressions, clicks, plays, effectivePlays, plays3s,
            });
          }
          vid++;
        }
      });
    });
  });
  return rows;
}

const RAW = buildRawData();

// ============ 聚合 ============
interface MetricRow {
  key: string;
  team: string;
  group: string;
  author: string;
  cat1: string;
  cat2: string;
  video: string;
  uploadDate: string;
  date: string;
  month: string;
  cost: number;
  orders: number;
  gmv: number;
  coupon: number;
  platformSubsidy: number;
  impressions: number;
  clicks: number;
  plays: number;
  effectivePlays: number;
  plays3s: number;
}

function sumRows(rows: RawRow[]): MetricRow {
  const acc: MetricRow = {
    key: "", team: "", group: "", author: "", cat1: "", cat2: "", video: "",
    uploadDate: "", date: "", month: "",
    cost: 0, orders: 0, gmv: 0, coupon: 0, platformSubsidy: 0,
    impressions: 0, clicks: 0, plays: 0, effectivePlays: 0, plays3s: 0,
  };
  rows.forEach((r) => {
    acc.cost += r.cost; acc.orders += r.orders; acc.gmv += r.gmv;
    acc.coupon += r.coupon; acc.platformSubsidy += r.platformSubsidy;
    acc.impressions += r.impressions; acc.clicks += r.clicks;
    acc.plays += r.plays; acc.effectivePlays += r.effectivePlays; acc.plays3s += r.plays3s;
  });
  return acc;
}

function aggregate(rows: RawRow[], dim: DimensionTab): MetricRow[] {
  const map = new Map<string, RawRow[]>();
  rows.forEach((r) => {
    let key = "";
    if (dim === "团队") key = r.team;
    else if (dim === "分组") key = `${r.team}||${r.group}`;
    else if (dim === "个人") key = `${r.team}||${r.group}||${r.author}`;
    else if (dim === "明细") key = `${r.video}`;
    else if (dim === "分日") key = r.date;
    else key = r.month;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  });
  const out: MetricRow[] = [];
  map.forEach((list, key) => {
    const s = sumRows(list);
    s.key = key;
    const first = list[0];
    s.team = dim === "团队" ? key : first.team;
    s.group = dim === "团队" ? "—" : dim === "分组" ? key.split("||")[1] : dim === "明细" ? first.group : dim === "个人" ? first.group : "—";
    s.author = dim === "个人" ? key.split("||")[2] : dim === "明细" ? first.author : "—";
    s.cat1 = dim === "明细" ? first.cat1 : "—";
    s.cat2 = dim === "明细" ? first.cat2 : "—";
    s.video = dim === "明细" ? key : "—";
    s.uploadDate = dim === "明细" ? first.uploadDate : "—";
    s.date = dim === "分日" ? key : "—";
    s.month = dim === "分月" ? key : "—";
    out.push(s);
  });
  // 按消耗降序
  out.sort((a, b) => b.cost - a.cost);
  return out;
}

// ============ 格式化 ============
const nf = (n: number) => n.toLocaleString("zh-CN");
const yuan = (n: number) => "¥" + n.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(2) + "%";

// 指标列定义
interface ColDef {
  key: string;
  label: string;
  align?: "right" | "center";
  render: (r: MetricRow) => string;
}
function metricCols(): ColDef[] {
  return [
    { key: "cost", label: "消耗", align: "right", render: (r) => yuan(r.cost) },
    { key: "roi", label: "roi", align: "right", render: (r) => r.cost > 0 ? (r.gmv / r.cost).toFixed(2) : "0.00" },
    { key: "totalGmv", label: "总成交金额", align: "right", render: (r) => yuan(r.gmv + r.coupon + r.platformSubsidy) },
    { key: "gmv", label: "成交金额", align: "right", render: (r) => yuan(r.gmv) },
    { key: "coupon", label: "智能优惠券", align: "right", render: (r) => yuan(r.coupon) },
    { key: "subsidy", label: "电商平台补贴金额", align: "right", render: (r) => yuan(r.platformSubsidy) },
    { key: "orders", label: "转化数", align: "right", render: (r) => nf(r.orders) },
    { key: "cvr", label: "转化率", align: "right", render: (r) => pct(r.clicks > 0 ? r.orders / r.clicks : 0) },
    { key: "cpa", label: "转化成本", align: "right", render: (r) => r.orders > 0 ? yuan(r.cost / r.orders) : "¥0" },
    { key: "impressions", label: "展示数", align: "right", render: (r) => nf(r.impressions) },
    { key: "cpm", label: "平均千次展现费用", align: "right", render: (r) => r.impressions > 0 ? yuan((r.cost / r.impressions) * 1000) : "¥0" },
    { key: "clicks", label: "点击数", align: "right", render: (r) => nf(r.clicks) },
    { key: "ctr", label: "点击率", align: "right", render: (r) => pct(r.impressions > 0 ? r.clicks / r.impressions : 0) },
    { key: "cpc", label: "平均点击单价", align: "right", render: (r) => r.clicks > 0 ? yuan(r.cost / r.clicks) : "¥0" },
    { key: "plays", label: "播放量", align: "right", render: (r) => nf(r.plays) },
    { key: "finishRate", label: "完播率", align: "right", render: (r) => pct(r.plays > 0 ? r.effectivePlays / r.plays : 0) },
    { key: "effPlays", label: "有效播放数", align: "right", render: (r) => nf(r.effectivePlays) },
    { key: "plays3s", label: "3s播放数", align: "right", render: (r) => nf(r.plays3s) },
    { key: "rate3s", label: "3s播放率", align: "right", render: (r) => pct(r.plays > 0 ? r.plays3s / r.plays : 0) },
  ];
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  qianchuan: <TrendingUp className="w-4 h-4" />,
  juliang: <Megaphone className="w-4 h-4" />,
  benditui: <Clapperboard className="w-4 h-4" />,
  cailiao: <Radio className="w-4 h-4" />,
  jinniu: <ShoppingCart className="w-4 h-4" />,
  adq: <Layers className="w-4 h-4" />,
  taobao: <MonitorPlay className="w-4 h-4" />,
};

export default function AdPlatformAnalysisView({ showToast }: AdPlatformAnalysisViewProps) {
  const [activePlatform, setActivePlatform] = useState("qianchuan");
  const [activePromo, setActivePromo] = useState(0);
  const [activeDim, setActiveDim] = useState<DimensionTab>("团队");
  const [sortKey, setSortKey] = useState<string>("cost");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [showColSettings, setShowColSettings] = useState(false);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  const data = useMemo(() => {
    let rows = aggregate(RAW, activeDim);
    // 排序
    const col = metricCols().find((c) => c.key === sortKey);
    const keyOf = (r: MetricRow) => {
      switch (sortKey) {
        case "cost": return r.cost;
        case "roi": return r.cost > 0 ? r.gmv / r.cost : 0;
        case "totalGmv": return r.gmv + r.coupon + r.platformSubsidy;
        case "gmv": return r.gmv;
        case "coupon": return r.coupon;
        case "subsidy": return r.platformSubsidy;
        case "orders": return r.orders;
        case "cvr": return r.clicks > 0 ? r.orders / r.clicks : 0;
        case "cpa": return r.orders > 0 ? r.cost / r.orders : 0;
        case "impressions": return r.impressions;
        case "cpm": return r.impressions > 0 ? (r.cost / r.impressions) * 1000 : 0;
        case "clicks": return r.clicks;
        case "ctr": return r.impressions > 0 ? r.clicks / r.impressions : 0;
        case "cpc": return r.clicks > 0 ? r.cost / r.clicks : 0;
        case "plays": return r.plays;
        case "finishRate": return r.plays > 0 ? r.effectivePlays / r.plays : 0;
        case "effPlays": return r.effectivePlays;
        case "plays3s": return r.plays3s;
        case "rate3s": return r.plays > 0 ? r.plays3s / r.plays : 0;
        default: return r.cost;
      }
    };
    rows = [...rows].sort((a, b) => (sortDir === "desc" ? keyOf(b) - keyOf(a) : keyOf(a) - keyOf(b)));
    return rows;
  }, [activeDim, sortKey, sortDir]);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  // 合计行（明细 tab）
  const totals = useMemo(() => sumRows(RAW), []);

  const cols = metricCols();
  const visibleCols = cols.filter((c) => !hiddenCols.has(c.key));

  const toggleCol = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const sortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === "desc" ? <ArrowDown className="w-3 h-3 text-purple-600" /> : <ArrowUp className="w-3 h-3 text-purple-600" />;
  };

  // 左列定义（随维度变化）
  const leftCols: { key: string; label: string }[] = (() => {
    if (activeDim === "团队") return [{ key: "team", label: "团队" }];
    if (activeDim === "分组") return [{ key: "team", label: "团队" }, { key: "group", label: "分组" }];
    if (activeDim === "个人") return [{ key: "team", label: "团队" }, { key: "group", label: "分组" }, { key: "author", label: "视频发布人" }];
    if (activeDim === "明细") return [
      { key: "team", label: "团队" }, { key: "group", label: "分组" }, { key: "author", label: "视频发布人" },
      { key: "cat1", label: "一级分类" }, { key: "cat2", label: "二级分类" }, { key: "video", label: "视频" },
      { key: "op", label: "操作" }, { key: "uploadDate", label: "视频上传时间" },
    ];
    return [{ key: "date", label: activeDim === "分日" ? "日期" : "月份" }];
  })();

  const filterPlaceholder =
    activeDim === "团队" ? "请选择团队" :
    activeDim === "分组" ? "请选择分组" :
    activeDim === "个人" ? "请选择账号" : "请选择视频发布人";

  return (
    <div className="space-y-4">
      {/* ===== 平台一级 Tab（白卡片） ===== */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-6 px-5 py-3 border-b border-slate-100 bg-white overflow-x-auto">
          {PLATFORMS.map((p) => {
            const active = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setActivePlatform(p.id); setPage(1); }}
                className={`flex items-center gap-2 font-bold text-sm transition-all cursor-pointer relative py-1 whitespace-nowrap ${
                  active ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-md ${active ? "bg-purple-100 text-[#7C3AED]" : "bg-slate-100 text-slate-400"}`}>
                  {PLATFORM_ICONS[p.id]}
                </div>
                <span>{p.name}</span>
                {active && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* 二级推广类型 Tab */}
        <div className="flex items-center gap-1 px-5 py-3 overflow-x-auto">
          {PROMO_TABS.map((t, i) => {
            const active = activePromo === i;
            const label = i === 0 ? (activePlatform === "qianchuan" ? "千川汇总" : t + "汇总") : t;
            return (
              <button
                key={t}
                onClick={() => { setActivePromo(i); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== 数据维度 + 筛选 + 表格 白卡片 ===== */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/50 space-y-3">
        {/* 维度 Tab 按钮式 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DIMENSION_TABS.map((d) => {
            const active = activeDim === d;
            return (
              <button
                key={d}
                onClick={() => { setActiveDim(d); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-white text-[#7C3AED] border border-purple-300 shadow-2xs ring-1 ring-purple-100"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* 筛选行 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 flex-wrap">
          <select className="pl-3 pr-8 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer w-44">
            <option>{filterPlaceholder}</option>
            {TEAMS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer w-40">
            <option>请选择分类</option>
            <option>美妆护肤</option><option>服饰内衣</option><option>个护家清</option>
            <option>食品饮料</option><option>母婴宠物</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>上传时间:</span>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-400 shadow-2xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>开始日期</span><span className="text-slate-400">至</span><span>结束日期</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>消耗时间:</span>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>2026-09-03</span><span className="text-slate-400">至</span><span>2026-09-18</span>
            </div>
          </div>

          <button
            onClick={() => showToast?.("查询成功", `已加载 ${total} 条广告平台数据`)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            查询
          </button>
          <button
            onClick={() => { setActiveDim("团队"); setPage(1); showToast?.("已重置", "筛选条件已重置"); }}
            className="border border-slate-200 text-slate-600 text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white shadow-2xs"
          >
            重置
          </button>
          </div>

          {/* 右组：导出 + 列设置 */}
          <div className="flex items-center gap-2">
            <button className="border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 flex items-center gap-1 shadow-2xs bg-white">
              导出 <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColSettings((v) => !v)}
                className={`border p-1.5 rounded-lg cursor-pointer bg-white shadow-2xs transition-colors ${showColSettings ? "border-[#7C3AED] text-[#7C3AED] ring-2 ring-purple-100" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                title="列设置"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              {showColSettings && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowColSettings(false)} />
                  <div className="absolute right-0 top-full mt-2 z-40 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 p-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                      <span className="text-sm font-bold text-slate-800">自定义字段(可拖动排序)</span>
                      <button
                        onClick={() => setHiddenCols(new Set())}
                        className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                      >
                        重置
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {cols.map((c) => {
                        const checked = !hiddenCols.has(c.key);
                        return (
                          <label
                            key={c.key}
                            className="flex items-center gap-2.5 px-1 py-1.5 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCol(c.key)}
                              className="rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer w-3.5 h-3.5"
                            />
                            <span>{c.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* 表格（横向滚动，纵向固定高度滚动） */}
        <div className="overflow-auto border border-slate-100 rounded-lg" style={{ height: 380 }}>
          <table className="w-full text-xs whitespace-nowrap border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 text-slate-500 font-bold">
                {leftCols.map((c) => (
                  <th key={c.key} className="text-left px-4 py-3 font-bold">{c.label}</th>
                ))}
                {visibleCols.map((c) => (
                  <th key={c.key} className="text-right px-4 py-3 font-bold cursor-pointer select-none hover:text-purple-600" onClick={() => handleSort(c.key)}>
                    <span className="inline-flex items-center gap-1 justify-end">
                      {c.label}{c.label === "完播率" && <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 text-[9px]">?</span>}
                      {sortIcon(c.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 顶部总计行（所有维度） */}
              <tr className="border-b border-slate-200 bg-purple-50/40 font-bold">
                <td colSpan={leftCols.length} className="px-4 py-2.5 text-slate-900">总计</td>
                {visibleCols.map((c) => (
                  <td key={c.key} className="px-4 py-2.5 text-right text-slate-900">{c.render(totals)}</td>
                ))}
              </tr>

              {pageData.map((r, idx) => (
                <tr key={r.key + idx} className="border-t border-slate-100 hover:bg-slate-50/60">
                  {leftCols.map((c) => (
                    <td key={c.key} className="px-4 py-2.5 text-slate-700 font-medium">
                      {c.key === "op" ? (
                        <button
                          onClick={() => showToast?.("查看视频", `查看 ${r.video}`)}
                          className="text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> 预览
                        </button>
                      ) : c.key === "video" ? (
                        <span className="text-slate-800 font-bold">{r.video}</span>
                      ) : (
                        (r as any)[c.key]
                      )}
                    </td>
                  ))}
                  {visibleCols.map((c) => (
                    <td key={c.key} className="px-4 py-2.5 text-right text-slate-700 tabular-nums">{c.render(r)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {pageData.length === 0 && (
            <div className="py-16 text-center text-xs text-red-400">请点击查询按钮查询</div>
          )}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-3 mt-4 text-xs text-slate-500">
          <span>共 {total} 条</span>
          <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none">
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer ${
                  p === page ? "bg-purple-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span>前往 <input value={page} readOnly className="w-12 border border-slate-200 rounded-lg px-2 py-1 text-center" /> 页</span>
        </div>
      </div>
    </div>
  );
}
