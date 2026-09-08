import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Folder,
  Globe2,
  Info,
  Loader2,
  Megaphone,
  Monitor,
  Radio,
  Search,
  Send,
  ShoppingBag,
  Trash2,
  Video,
  X,
  XCircle,
} from "lucide-react";
import AssetPagination from "./AssetPagination";

export type AdPushStatus = "排队中" | "推送中" | "推送成功" | "推送失败";

export interface AdPushRecord {
  id: string;
  kind: "push_video";
  videoTitle: string;
  platform: string;
  account: string;
  media: string;
  assetId: string;
  status: AdPushStatus;
  failureReason: string;
  operator: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  startedAt?: number;
  finishAt?: number;
}

interface PushVideoInfo {
  id: string;
  title: string;
  coverUrl?: string;
}

interface AdAccountPushWorkspaceProps {
  video: PushVideoInfo;
  onClose: () => void;
  onCreate: (record: AdPushRecord) => void;
}

interface PushRecordsModalProps {
  records: AdPushRecord[];
  onClose: () => void;
}

type PushMethod = "push" | "full_domain";
type AccountScope = "favorite" | "personal" | "group" | "category" | "all" | "company";

interface SelectableAccount {
  id: string;
  name: string;
  scope: Exclude<AccountScope, "all">;
  favorite: boolean;
  detail: string;
}

interface PlatformConfig {
  id: string;
  name: string;
  code: string;
  accounts: SelectableAccount[];
  workspaces: SelectableAccount[];
}

const formatDateTime = (date = new Date()) => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const makeAccounts = (platform: string, code: string): SelectableAccount[] => [
  { id: `${code}-1001`, name: `梦畅美妆旗舰店-${platform}`, scope: "personal", favorite: true, detail: `ID ${code}1001 · 已授权` },
  { id: `${code}-1002`, name: `悦己珠宝直播间-${platform}`, scope: "group", favorite: true, detail: `ID ${code}1002 · 电商投放一组` },
  { id: `${code}-1003`, name: `轻氧服饰直营-${platform}`, scope: "category", favorite: false, detail: `ID ${code}1003 · 服饰类目` },
  { id: `${code}-1004`, name: `新锐家居增长账户-${platform}`, scope: "company", favorite: false, detail: `ID ${code}1004 · 梦畅AIGC` },
];

const makeWorkspaces = (platform: string, code: string): SelectableAccount[] => [
  { id: `${code}-ws-01`, name: `${platform} · 爆款素材工作台`, scope: "group", favorite: true, detail: "电商投放一组 · 18 位成员" },
  { id: `${code}-ws-02`, name: `${platform} · 新品测试工作台`, scope: "company", favorite: false, detail: "梦畅AIGC · 组织内共享" },
  { id: `${code}-ws-03`, name: `${platform} · 直播切片工作台`, scope: "category", favorite: true, detail: "直播运营组 · 12 位成员" },
];

const PLATFORM_SEEDS = [
  ["qianchuan", "巨量千川", "QC"],
  ["ocean", "巨量广告", "JL"],
  ["local", "巨量本地推", "BD"],
  ["kuaishou", "磁力智投", "CZ"],
  ["jinniu", "磁力金牛", "JN"],
  ["tencent", "腾讯ADQ", "TX"],
  ["taobao", "淘宝超级短视频", "TB"],
  ["baidu", "百度营销", "BDY"],
  ["douyin", "抖音号作品", "DY"],
  ["tiktok-business", "TikTok for Business", "TTB"],
  ["tiktok-video", "TikTok Video", "TTV"],
  ["kuaishou-video", "快手号作品", "KSV"],
  ["bilibili", "Bilibili", "BILI"],
] as const;

const PLATFORMS: PlatformConfig[] = PLATFORM_SEEDS.map(([id, name, code]) => ({
  id,
  name,
  code,
  accounts: makeAccounts(name, code),
  workspaces: makeWorkspaces(name, code),
}));

const PUSH_METHODS: Array<{ id: PushMethod; title: string; description: string }> = [
  { id: "push", title: "仅推送", description: "将视频推送至所选平台素材库" },
  { id: "full_domain", title: "全域推广", description: "投放新视频至现有全域推广计划" },
];

const ACCOUNT_TABS: Array<{ id: AccountScope; label: string }> = [
  { id: "favorite", label: "收藏账户" },
  { id: "personal", label: "个人账户" },
  { id: "group", label: "分组账户" },
  { id: "category", label: "分类账户" },
  { id: "all", label: "全部账户" },
  { id: "company", label: "公司分组" },
];

const PLANS = [
  { id: "plan-01", name: "美妆新品直播全域放量计划", account: "梦畅美妆旗舰店", target: "直播全域", budget: "¥3,000/日" },
  { id: "plan-02", name: "珠宝爆款商品全域稳投计划", account: "悦己珠宝直播间", target: "商品全域", budget: "¥5,000/日" },
  { id: "plan-03", name: "服饰直播乘方拉新计划", account: "轻氧服饰直营", target: "直播乘方", budget: "¥2,000/日" },
];

export const createDefaultAdPushRecords = (): AdPushRecord[] => [
  {
    id: "push-demo-1", kind: "push_video", videoTitle: "0730-8835-鲁月园-复古耳环动态奢感视频.mp4", platform: "巨量千川",
    account: "梦畅美妆旗舰店-千川主账户", media: "巨量千川", assetId: "QC-92810461", status: "推送成功", failureReason: "—",
    operator: "徐振", createdAt: "2026-09-08 09:42:18", updatedAt: "2026-09-08 09:42:21", taskId: "PUSH-260908-001",
  },
  {
    id: "push-demo-2", kind: "push_video", videoTitle: "秋季轻氧通勤外套卖点视频.mp4", platform: "巨量广告",
    account: "轻氧服饰直营-巨量广告", media: "巨量广告", assetId: "JL-81726354", status: "推送中", failureReason: "—",
    operator: "李云", createdAt: "2026-09-08 10:06:30", updatedAt: "2026-09-08 10:06:32", taskId: "PUSH-260908-002",
  },
  {
    id: "push-demo-3", kind: "push_video", videoTitle: "悦己珠宝七夕礼赠短视频.mp4", platform: "腾讯ADQ",
    account: "悦己珠宝直播间-腾讯ADQ", media: "腾讯ADQ", assetId: "TX-62018473", status: "排队中", failureReason: "—",
    operator: "蔡卓良", createdAt: "2026-09-08 10:12:05", updatedAt: "2026-09-08 10:12:05", taskId: "PUSH-260908-003",
  },
  {
    id: "push-demo-4", kind: "push_video", videoTitle: "家居收纳柜场景种草视频.mp4", platform: "百度营销",
    account: "新锐家居增长账户-百度营销", media: "百度营销", assetId: "BDY-51029384", status: "推送失败", failureReason: "账户授权已过期",
    operator: "王强", createdAt: "2026-09-07 17:20:11", updatedAt: "2026-09-07 17:20:16", taskId: "PUSH-260907-018",
  },
];

export const advanceAdPushRecords = (records: AdPushRecord[], now = Date.now()) => {
  let changed = false;
  const next = records.map((record) => {
    if (!record.startedAt || !record.finishAt || record.status === "推送成功" || record.status === "推送失败") return record;
    const nextStatus: AdPushStatus = now >= record.finishAt ? "推送成功" : now - record.startedAt >= 700 ? "推送中" : "排队中";
    if (nextStatus === record.status) return record;
    changed = true;
    return { ...record, status: nextStatus, updatedAt: formatDateTime(new Date(now)) };
  });
  return changed ? next : records;
};

const Portal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const PlatformIcon = ({ id }: { id: string }) => {
  const className = "h-5 w-5";
  if (id === "qianchuan" || id === "ocean") return <BarChart3 className={className} />;
  if (id === "local") return <Building2 className={className} />;
  if (id === "kuaishou" || id === "jinniu") return <Radio className={className} />;
  if (id === "tencent" || id === "baidu") return <Globe2 className={className} />;
  if (id === "taobao") return <ShoppingBag className={className} />;
  if (id.includes("video") || id === "douyin" || id === "bilibili") return <Video className={className} />;
  return <Monitor className={className} />;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2 text-sm font-black text-slate-800">
    <span className="h-5 w-1 rounded-full bg-violet-600" />
    {children}
  </h2>
);

const SelectionMark = () => (
  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-tl-xl bg-violet-600 text-white">
    <Check className="h-4 w-4 stroke-[3]" />
  </span>
);

const StatusBadge = ({ status }: { status: AdPushStatus }) => {
  const styles: Record<AdPushStatus, string> = {
    排队中: "border-amber-200 bg-amber-50 text-amber-700",
    推送中: "border-blue-200 bg-blue-50 text-blue-700",
    推送成功: "border-emerald-200 bg-emerald-50 text-emerald-700",
    推送失败: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold ${styles[status]}`}>
      {status === "推送中" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {status === "推送成功" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {status === "推送失败" && <XCircle className="h-3.5 w-3.5" />}
      {status === "排队中" && <Calendar className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
};

export function AdAccountPushWorkspace({ video, onClose, onCreate }: AdAccountPushWorkspaceProps) {
  const [platformId, setPlatformId] = useState("qianchuan");
  const [method, setMethod] = useState<PushMethod>("push");
  const [destination, setDestination] = useState<"account" | "workspace">("account");
  const [scope, setScope] = useState<AccountScope>("favorite");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [marketingGoal, setMarketingGoal] = useState("直播全域");
  const [planMode, setPlanMode] = useState<"existing" | "batch">("existing");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [distributionRule, setDistributionRule] = useState<"all" | "average">("all");
  const [removalPolicy, setRemovalPolicy] = useState<"none" | "material" | "low" | "review">("none");
  const [removeMaterialIds, setRemoveMaterialIds] = useState("");
  const [lowDataDays, setLowDataDays] = useState("3");
  const [minSpend, setMinSpend] = useState("100");
  const [maxSpend, setMaxSpend] = useState("500");
  const [createTime, setCreateTime] = useState<"now" | "scheduled">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [videoVersion, setVideoVersion] = useState<"transcoded" | "original">("transcoded");
  const [buildStrategy, setBuildStrategy] = useState<"success" | "skip_failed">("success");
  const [videoStatus, setVideoStatus] = useState("已上机");
  const [namingRule, setNamingRule] = useState("{视频标题}_{云管家视频id}_{原片/转码/衍生编号}");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const platform = PLATFORMS.find((item) => item.id === platformId) ?? PLATFORMS[0];
  const sourceItems = destination === "account" ? platform.accounts : platform.workspaces;
  const visibleItems = useMemo(() => sourceItems.filter((item) => {
    const matchesScope = scope === "all" || (scope === "favorite" ? item.favorite : item.scope === scope);
    const keyword = search.trim().toLowerCase();
    return matchesScope && (!keyword || item.name.toLowerCase().includes(keyword) || item.id.toLowerCase().includes(keyword));
  }), [scope, search, sourceItems]);
  const selectedItems = sourceItems.filter((item) => selectedIds.includes(item.id));
  const selectedPlan = PLANS.find((item) => item.id === selectedPlanId);

  const selectPlatform = (id: string) => {
    setPlatformId(id);
    setSelectedIds([]);
    setSelectedPlanId("");
    setSearch("");
    setError("");
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setError("");
  };

  const toggleVisible = () => {
    const visibleIds = visibleItems.map((item) => item.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : Array.from(new Set([...current, ...visibleIds])));
  };

  const submit = () => {
    let validationMessage = "";
    if (method === "push" && selectedIds.length === 0) validationMessage = `请至少选择一个${destination === "account" ? "广告账户" : "工作台"}`;
    if (method === "full_domain" && !selectedPlanId) validationMessage = "请选择一个已有推广计划";
    if (createTime === "scheduled" && !scheduledAt) validationMessage = "请选择定时创建时间";
    if (!namingRule.trim()) validationMessage = "请填写视频推送至素材库的名称格式";
    if (removalPolicy === "material" && !removeMaterialIds.trim()) validationMessage = "请输入需要移除的视频素材 ID";

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const now = Date.now();
      const targetName = method === "full_domain"
        ? selectedPlan?.account ?? "计划绑定账户"
        : selectedItems.map((item) => item.name).join("、");
      onCreate({
        id: `ad-push-${now}`,
        kind: "push_video",
        videoTitle: video.title,
        platform: platform.name,
        account: targetName,
        media: platform.name,
        assetId: `${platform.code}-${video.id.replace(/\D/g, "").slice(-8) || now.toString().slice(-8)}`,
        status: "排队中",
        failureReason: "—",
        operator: "徐振",
        createdAt: formatDateTime(new Date(now)),
        updatedAt: formatDateTime(new Date(now)),
        taskId: `PUSH-${now.toString().slice(-10)}`,
        startedAt: now,
        finishAt: now + 3000,
      });
    }, 450);
  };

  const accountSelector = (
    <div className={`grid min-h-[330px] grid-cols-1 overflow-hidden rounded-md border bg-white lg:grid-cols-2 ${error.includes("账户") || error.includes("工作台") ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200"}`}>
      <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
        <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
          {(destination === "account" ? ACCOUNT_TABS : ACCOUNT_TABS.filter((item) => ["favorite", "all", "company"].includes(item.id))).map((tab) => (
            <button key={tab.id} type="button" onClick={() => setScope(tab.id)} className={`text-xs font-bold ${scope === tab.id ? "text-violet-700" : "text-slate-600 hover:text-slate-900"}`}>
              {destination === "workspace" ? tab.label.replace("账户", "工作台") : tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-b border-slate-100 p-3">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`请输入${destination === "account" ? "账户" : "工作台"}名称/ID`} className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-violet-400" />
          </label>
          <button type="button" className="whitespace-nowrap text-xs font-bold text-violet-600">+ {destination === "account" ? "账户分组" : "工作台分组"}</button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600">
          <input type="checkbox" checked={visibleItems.length > 0 && visibleItems.every((item) => selectedIds.includes(item.id))} onChange={toggleVisible} className="h-4 w-4 accent-violet-600" />
          <span>全选</span>
        </div>
        <div className="max-h-56 overflow-y-auto px-3 pb-3">
          {visibleItems.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-xs text-slate-400">暂无符合条件的数据</div>
          ) : visibleItems.map((item) => (
            <button key={item.id} type="button" onClick={() => toggleSelected(item.id)} className={`mb-2 flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${selectedIds.includes(item.id) ? "border-violet-400 bg-violet-50" : "border-slate-100 hover:border-violet-200 hover:bg-slate-50"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${selectedIds.includes(item.id) ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>
                {selectedIds.includes(item.id) && <Check className="h-3 w-3" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-slate-800">{item.name}</span>
                <span className="mt-1 block truncate text-[11px] text-slate-400">{item.detail}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700">
          <span>已选{destination === "account" ? "账户" : "工作台"}</span>
          <span className="text-violet-600">{selectedItems.length}</span>
        </div>
        <div className="max-h-[286px] overflow-y-auto p-3">
          {selectedItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-slate-400">
              <Folder className="mb-2 h-8 w-8 text-slate-300" />
              <span className="text-xs">暂未添加{destination === "account" ? "账户" : "工作台"}</span>
            </div>
          ) : selectedItems.map((item) => (
            <div key={item.id} className="mb-2 flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{item.name}</p>
                <p className="mt-1 truncate text-[11px] text-slate-400">{item.detail}</p>
              </div>
              <button type="button" title="移除" onClick={() => toggleSelected(item.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[#eef7f5] text-slate-800">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-100 bg-[#eef7f5]/95 px-5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={onClose} title="返回成片详情" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-violet-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700"><Send className="h-4 w-4" /></span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-black text-slate-900">添加推送任务</h1>
              <p className="truncate text-xs text-violet-600">推送成功后，平台将自动同步后续产生的广告数据</p>
            </div>
          </div>
          <button type="button" onClick={onClose} title="关闭" className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200">
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="mx-auto grid w-full max-w-[1540px] gap-3 px-4 pb-8 pt-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-md border border-slate-200 bg-white lg:sticky lg:top-20">
            <nav className="max-h-[calc(100vh-7rem)] overflow-y-auto p-3">
              {PLATFORMS.map((item) => (
                <button key={item.id} type="button" onClick={() => selectPlatform(item.id)} className={`mb-1 flex min-h-12 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${platformId === item.id ? "bg-violet-50 font-bold text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <span className={platformId === item.id ? "text-violet-600" : "text-slate-400"}><PlatformIcon id={item.id} /></span>
                  <span className="leading-5">{item.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <section className="space-y-4 p-5">
              <SectionTitle>推送方式</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {PUSH_METHODS.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setMethod(item.id); setDestination("account"); setSelectedIds([]); setScope("favorite"); setError(""); }} className={`relative min-h-24 overflow-hidden rounded-md border p-4 text-left transition ${method === item.id ? "border-violet-500 bg-violet-50/40" : "border-slate-100 bg-slate-50 hover:border-violet-200"}`}>
                    <span className={`block text-sm font-bold ${method === item.id ? "text-violet-700" : "text-slate-700"}`}>{item.title}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">{item.description}</span>
                    {method === item.id && <SelectionMark />}
                  </button>
                ))}
              </div>
            </section>

            {method === "push" && (
              <section className="space-y-4 border-t-[6px] border-[#eef7f5] p-5">
                <SectionTitle>推送视频设置</SectionTitle>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-bold text-slate-500">视频推送至</span>
                  <button type="button" onClick={() => { setDestination("account"); setSelectedIds([]); setScope("favorite"); }} className={`h-10 rounded-md px-5 font-bold ${destination === "account" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>广告账户视频库</button>
                  <button type="button" onClick={() => { setDestination("workspace"); setSelectedIds([]); setScope("favorite"); }} className={`h-10 rounded-md px-5 font-bold ${destination === "workspace" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>新版工作台（组织内共享）</button>
                </div>
                {accountSelector}
              </section>
            )}

            {method === "full_domain" && (
              <>
                <section className="space-y-5 border-t-[6px] border-[#eef7f5] p-5">
                  <SectionTitle>推广设置</SectionTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-28 text-right text-xs font-bold text-slate-500">营销目标</span>
                    {["直播全域", "商品全域", "直播乘方", "商品乘方"].map((item) => (
                      <button key={item} type="button" onClick={() => setMarketingGoal(item)} className={`relative h-16 min-w-40 overflow-hidden rounded-md border px-5 text-left text-sm font-bold ${marketingGoal === item ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-100 bg-slate-50 text-slate-600"}`}>
                        {item}{marketingGoal === item && <SelectionMark />}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-28 text-right text-xs font-bold text-slate-500">计划投放方式</span>
                    <button type="button" onClick={() => setPlanMode("existing")} className={`h-10 rounded-md px-5 text-xs font-bold ${planMode === "existing" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>已有计划添加视频</button>
                    <button type="button" onClick={() => setPlanMode("batch")} className={`h-10 rounded-md px-5 text-xs font-bold ${planMode === "batch" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>批量创建{marketingGoal}计划</button>
                  </div>
                  <div className={`ml-0 grid gap-3 md:ml-32 md:grid-cols-3 ${error.includes("推广计划") ? "rounded-md ring-2 ring-rose-200" : ""}`}>
                    {PLANS.map((plan) => (
                      <button key={plan.id} type="button" onClick={() => { setSelectedPlanId(plan.id); setError(""); }} className={`relative overflow-hidden rounded-md border p-4 text-left ${selectedPlanId === plan.id ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-300"}`}>
                        <p className="truncate text-xs font-black text-slate-800">{plan.name}</p>
                        <p className="mt-2 text-[11px] text-slate-500">{plan.account}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px]"><span className="text-violet-600">{plan.target}</span><span className="text-slate-400">{plan.budget}</span></div>
                        {selectedPlanId === plan.id && <SelectionMark />}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-5 border-t-[6px] border-[#eef7f5] p-5">
                  <SectionTitle>创意设置</SectionTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-40 text-right text-xs font-bold text-slate-500">视频分配规则</span>
                    <button type="button" title="每个计划都使用已选视频" onClick={() => setDistributionRule("all")} className={`h-10 rounded-md px-5 text-xs font-bold ${distributionRule === "all" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>全部使用 <Info className="ml-1 inline h-3.5 w-3.5" /></button>
                    <button type="button" title="每个视频只分配给一个计划" onClick={() => setDistributionRule("average")} className={`h-10 rounded-md px-5 text-xs font-bold ${distributionRule === "average" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>平均分配 <Info className="ml-1 inline h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-40 text-right text-xs font-bold text-slate-500">移除计划在投视频</span>
                    {[
                      ["none", "不移除"], ["material", "移除指定素材ID"], ["low", "移除低数据视频"], ["review", "移除卡审视频"],
                    ].map(([id, label]) => (
                      <button key={id} type="button" onClick={() => setRemovalPolicy(id as typeof removalPolicy)} className={`h-10 rounded-md px-5 text-xs font-bold ${removalPolicy === id ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{label}</button>
                    ))}
                  </div>
                  {removalPolicy === "material" && (
                    <label className="ml-0 grid gap-2 text-xs md:ml-40 md:grid-cols-[150px_1fr] md:items-start">
                      <span className="pt-3 text-right font-bold text-slate-500">移除视频素材ID</span>
                      <textarea value={removeMaterialIds} onChange={(event) => { setRemoveMaterialIds(event.target.value); setError(""); }} placeholder="请输入需要移除的视频素材ID，多个ID可用逗号隔开，或换行" className={`min-h-28 rounded-md border p-3 outline-none focus:border-violet-400 ${error.includes("素材 ID") ? "border-rose-400" : "border-slate-200"}`} />
                    </label>
                  )}
                  {removalPolicy === "low" && (
                    <div className="ml-0 space-y-3 rounded-md border border-slate-100 bg-slate-50 p-4 text-xs md:ml-40">
                      <label className="flex flex-wrap items-center gap-2"><span className="font-bold text-slate-600">计划内视频近</span><input value={lowDataDays} onChange={(event) => setLowDataDays(event.target.value)} className="h-9 w-20 rounded-md border border-slate-200 px-3" /><span>天，消耗在</span><input value={minSpend} onChange={(event) => setMinSpend(event.target.value)} className="h-9 w-24 rounded-md border border-slate-200 px-3" /><span>元至</span><input value={maxSpend} onChange={(event) => setMaxSpend(event.target.value)} className="h-9 w-24 rounded-md border border-slate-200 px-3" /><span>元范围内</span></label>
                    </div>
                  )}
                </section>
              </>
            )}

            <section className="space-y-5 border-t-[6px] border-[#eef7f5] p-5">
              <SectionTitle>推送视频设置</SectionTitle>
              <div className="mx-auto max-w-4xl space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="w-40 text-right font-bold text-slate-500">创建时间</span>
                  <label className="flex cursor-pointer items-center gap-2 font-bold text-violet-700"><input type="radio" checked={createTime === "now"} onChange={() => setCreateTime("now")} className="accent-violet-600" />立即创建</label>
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="radio" checked={createTime === "scheduled"} onChange={() => setCreateTime("scheduled")} className="accent-violet-600" />定时创建</label>
                  {createTime === "scheduled" && <input type="datetime-local" value={scheduledAt} onChange={(event) => { setScheduledAt(event.target.value); setError(""); }} className={`h-9 rounded-md border px-3 ${error.includes("定时") ? "border-rose-400" : "border-slate-200"}`} />}
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <span className="w-40 text-right font-bold text-slate-500">选择推送的视频</span>
                  <label className="flex cursor-pointer items-center gap-2 font-bold text-violet-700"><input type="radio" checked={videoVersion === "transcoded"} onChange={() => setVideoVersion("transcoded")} className="accent-violet-600" />转码后视频</label>
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="radio" checked={videoVersion === "original"} onChange={() => setVideoVersion("original")} className="accent-violet-600" />原片</label>
                </div>
                {method !== "push" && (
                  <div className="flex flex-wrap items-center gap-5">
                    <span className="w-40 text-right font-bold text-slate-500">推送搭建策略</span>
                    <label className="flex cursor-pointer items-center gap-2 font-bold text-violet-700"><input type="radio" checked={buildStrategy === "success"} onChange={() => setBuildStrategy("success")} className="accent-violet-600" />全部成功才搭建计划</label>
                    <label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="radio" checked={buildStrategy === "skip_failed"} onChange={() => setBuildStrategy("skip_failed")} className="accent-violet-600" />跳过失败的直接搭建</label>
                  </div>
                )}
                <label className="flex flex-wrap items-center gap-3">
                  <span className="w-40 text-right font-bold text-slate-500">推送成功后修改状态为</span>
                  <span className="relative">
                    <select value={videoStatus} onChange={(event) => setVideoStatus(event.target.value)} className="h-10 w-56 appearance-none rounded-md border border-slate-200 bg-white px-4 pr-9 font-bold text-slate-600 outline-none focus:border-violet-400"><option>已上机</option><option>已投放</option><option>待复盘</option></select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  </span>
                </label>
                <label className="flex flex-wrap items-start gap-3">
                  <span className="w-40 pt-3 text-right font-bold text-slate-500">视频推送至素材库名称</span>
                  <span className="min-w-0 flex-1">
                    <input value={namingRule} onChange={(event) => { setNamingRule(event.target.value); setError(""); }} className={`h-10 w-full rounded-md border px-4 font-mono text-xs outline-none focus:border-violet-400 ${error.includes("名称格式") ? "border-rose-400" : "border-slate-200"}`} />
                    <span className="mt-2 block leading-5 text-violet-600">动态词包：&#123;日期&#125; &#123;时间&#125; &#123;云管家视频id&#125; &#123;原片/转码/衍生编号&#125; &#123;视频标题&#125; &#123;当前用户姓名&#125;</span>
                  </span>
                </label>
              </div>
            </section>

            <footer className="sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
              {error && <span className="mr-auto inline-flex items-center gap-2 text-xs font-bold text-rose-600"><AlertCircle className="h-4 w-4" />{error}</span>}
              <button type="button" onClick={onClose} disabled={submitting} className="h-10 rounded-md border border-slate-200 px-5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">取消</button>
              <button type="button" onClick={submit} disabled={submitting} className="inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-md bg-violet-600 px-5 text-xs font-bold text-white hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />创建中</> : "确定"}
              </button>
              <span className="text-xs text-slate-500">您当前还能推送 <b className="text-violet-600">500</b> 个，目前有 <b className="text-violet-600">0</b> 个正在推送</span>
            </footer>
          </main>
        </div>
      </div>
    </Portal>
  );
}

export function PushRecordsModal({ records, onClose }: PushRecordsModalProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const filtered = records.filter((record) => record.kind === "push_video");
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]" role="dialog" aria-modal="true" aria-label="推送记录">
        <div className="flex h-[min(760px,calc(100vh-2rem))] w-full max-w-[1500px] flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-7">
            <h2 className="flex items-center gap-3 text-lg font-black text-slate-900"><span className="h-6 w-1 rounded-full bg-violet-600" />推送记录</h2>
            <button type="button" onClick={onClose} title="关闭" className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
          </header>
          <div className="flex shrink-0 items-center px-7 py-4">
            <div className="inline-flex overflow-hidden rounded-md border border-slate-200">
              <span className="flex h-10 items-center bg-violet-600 px-5 text-sm font-bold text-white">推送视频</span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-7">
            <table className="w-full min-w-[1180px] table-fixed text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500">
                <tr>{["推送视频", "广告账户", "媒体", "素材ID", "推送状态", "失败原因", "操作人", "创建推送时间", "更新时间", "任务ID"].map((head, index) => <th key={head} className={`px-4 py-3.5 font-bold ${index === 0 ? "w-60" : index === 1 ? "w-52" : ""}`}>{head}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600"><Video className="h-5 w-5" /></span><span className="line-clamp-2 font-bold text-slate-800">{record.videoTitle}</span></div></td>
                    <td className="px-4 py-4 text-slate-600">{record.account}</td><td className="px-4 py-4 text-slate-600">{record.media}</td><td className="px-4 py-4 font-mono text-slate-500">{record.assetId}</td>
                    <td className="px-4 py-4"><StatusBadge status={record.status} /></td><td className={`px-4 py-4 ${record.status === "推送失败" ? "font-bold text-rose-600" : "text-slate-400"}`}>{record.failureReason}</td>
                    <td className="px-4 py-4 text-slate-600">{record.operator}</td><td className="px-4 py-4 font-mono text-slate-500">{record.createdAt}</td><td className="px-4 py-4 font-mono text-slate-500">{record.updatedAt}</td><td className="px-4 py-4 font-mono text-slate-500">{record.taskId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <div className="flex h-56 flex-col items-center justify-center text-slate-400"><Megaphone className="mb-3 h-9 w-9 text-slate-300" /><p className="text-sm">暂无数据</p></div>}
          </div>
          <div className="shrink-0 px-7"><AssetPagination total={filtered.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /></div>
        </div>
      </div>
    </Portal>
  );
}
