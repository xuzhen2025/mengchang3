import React, { useMemo, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Download,
  Edit3,
  FileText,
  Image as ImageIcon,
  Library,
  Link2,
  Music,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Video,
  X
} from "lucide-react";
import { Asset } from "../types";

export const FAVORITES_KEY = "cloud_video_personal_favorites_v1";
export const PERSONAL_TAGS_KEY = "cloud_video_personal_tags_v1";
export const TASK_BINDINGS_KEY = "cloud_video_task_resource_bindings_v1";

export interface TaskResourceBinding {
  id: string;
  taskId: string;
  resourceId: string;
  resourceName: string;
  resourceType: Asset["type"];
  resourceUrl?: string;
  boundAt: string;
  boundBy: string;
}

const CURRENT_USER = "徐振";

type ResourceCategory = NonNullable<Asset["resourceCategory"]>;
type ResourceSource = NonNullable<Asset["source"]>;
type PersonalAsset = Asset & {
  resourceCategory: ResourceCategory;
  source: ResourceSource;
  publicTags: string[];
  sourceTaskId?: string;
};

interface PersonalTagItem {
  id: string;
  name: string;
  color: string;
  resourceIds: string[];
}

interface PersonalResourceCenterProps {
  mode: "resources" | "favorites" | "personal_tags";
  assets: Asset[];
  onToast: (message: string) => void;
}

const AVAILABLE_TASKS = [
  { id: "06211055102", title: "防晒冰袖户外实测内容制作", publisher: "梁浩然", deadline: "2026-08-22", required: 4 },
  { id: "06231146281", title: "七夕美妆礼盒短视频批量制作", publisher: "蔡卓良", deadline: "2026-08-28", required: 8 },
  { id: "06231430099", title: "星光吊坠送礼情境短片", publisher: "孙剧本", deadline: "2026-08-25", required: 6 }
];

const TASK_UPLOAD_ASSETS: PersonalAsset[] = [
  {
    id: "task-upload-110321101",
    name: "抗衰精华夜间修护口播_V1.mp4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80",
    size: "36.8 MB",
    createdAt: "2026-08-16 10:12",
    category: "美妆口播成片",
    resourceCategory: "成片",
    source: "task_collaboration",
    sourceTaskId: "06171146266",
    creator: CURRENT_USER,
    publicTags: ["美妆护肤", "抗衰", "夜间修护"],
    status: "已通过"
  },
  {
    id: "task-upload-110321102",
    name: "A醇精油质地特写_原始素材.mp4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&auto=format&fit=crop&q=80",
    size: "28.4 MB",
    createdAt: "2026-08-16 11:08",
    category: "商品特写",
    resourceCategory: "素材",
    source: "task_collaboration",
    sourceTaskId: "06171146266",
    creator: CURRENT_USER,
    publicTags: ["美妆护肤", "产品名称", "质地特写"],
    status: "未审核"
  },
  {
    id: "task-upload-110321103",
    name: "抗衰精华成分卖点口播稿.docx",
    type: "document",
    url: "data:text/plain;charset=utf-8,%E6%8A%97%E8%A1%B0%E7%B2%BE%E5%8D%8E%E6%88%90%E5%88%86%E5%8D%96%E7%82%B9%E5%8F%A3%E6%92%AD%E7%A8%BF",
    size: "72 KB",
    createdAt: "2026-08-16 13:26",
    category: "口播种草",
    resourceCategory: "脚本",
    source: "task_collaboration",
    sourceTaskId: "06171146266",
    creator: CURRENT_USER,
    publicTags: ["美妆护肤", "成分卖点", "口播"],
    status: "待审核"
  },
  {
    id: "task-upload-110321104",
    name: "夜间修护版温柔女声旁白.wav",
    type: "audio",
    url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    size: "4.9 MB",
    createdAt: "2026-08-16 15:04",
    category: "AI配音",
    resourceCategory: "音频",
    source: "task_collaboration",
    sourceTaskId: "06171146266",
    creator: CURRENT_USER,
    publicTags: ["美妆护肤", "女声", "温柔"],
    status: "已通过"
  }
];

const RESOURCE_CATEGORIES: Array<"全部" | ResourceCategory> = ["全部", "成片", "素材", "图片", "音频", "脚本"];

const SOURCE_META: Record<ResourceSource, { label: string; className: string; icon: React.ElementType }> = {
  resource_library: { label: "资源库上传", className: "border-sky-200 bg-sky-50 text-sky-700", icon: Library },
  task_collaboration: { label: "任务协作上传", className: "border-amber-200 bg-amber-50 text-amber-700", icon: BriefcaseBusiness },
  ai_generation: { label: "AI 生成", className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700", icon: Sparkles }
};

const CATEGORY_META: Record<ResourceCategory, { className: string; icon: React.ElementType }> = {
  成片: { className: "bg-violet-600 text-white", icon: Video },
  素材: { className: "bg-cyan-600 text-white", icon: Video },
  图片: { className: "bg-emerald-600 text-white", icon: ImageIcon },
  音频: { className: "bg-blue-600 text-white", icon: Music },
  脚本: { className: "bg-amber-500 text-white", icon: FileText }
};

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const inferResourceCategory = (asset: Asset): ResourceCategory => {
  if (asset.resourceCategory) return asset.resourceCategory;
  if (asset.type === "image") return "图片";
  if (asset.type === "audio") return "音频";
  if (asset.type === "document") return "脚本";
  if (asset.type === "template") return "素材";
  return asset.libraryType === "finished" || asset.category?.includes("成片") ? "成片" : "素材";
};

const normalizeAsset = (asset: Asset): PersonalAsset => ({
  ...asset,
  resourceCategory: inferResourceCategory(asset),
  source: asset.source || (asset.category?.includes("生成") ? "ai_generation" : "resource_library"),
  publicTags: asset.publicTags || asset.tags || []
});

export default function PersonalResourceCenterV2({ mode, assets, onToast }: PersonalResourceCenterProps) {
  const [search, setSearch] = useState("");
  const [resourceCategory, setResourceCategory] = useState<"全部" | ResourceCategory>("全部");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [publicTagFilter, setPublicTagFilter] = useState("全部");
  const [sourceFilter, setSourceFilter] = useState<"全部" | ResourceSource>("全部");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadJson(FAVORITES_KEY, ["a1", "a4"]));
  const [bindings, setBindings] = useState<TaskResourceBinding[]>(() => loadJson(TASK_BINDINGS_KEY, []));
  const [tags, setTags] = useState<PersonalTagItem[]>(() => loadJson(PERSONAL_TAGS_KEY, [
    { id: "pt-1", name: "本周主推", color: "#7c3aed", resourceIds: ["a1", "a4"] },
    { id: "pt-2", name: "待二创", color: "#0284c7", resourceIds: ["a3"] },
    { id: "pt-3", name: "高转化备选", color: "#059669", resourceIds: ["task-upload-110321101"] }
  ]));
  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [bindingAsset, setBindingAsset] = useState<PersonalAsset | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taggingAsset, setTaggingAsset] = useState<PersonalAsset | null>(null);

  const personalAssets = useMemo(() => {
    const merged = [
      ...assets.filter((asset) => !asset.deletedAt && asset.creator === CURRENT_USER).map(normalizeAsset),
      ...TASK_UPLOAD_ASSETS
    ];
    return Array.from(new Map(merged.map((asset) => [asset.id, asset])).values());
  }, [assets]);

  const categoryOptions = useMemo(() => Array.from(new Set(personalAssets.map((asset) => asset.category).filter(Boolean) as string[])).sort(), [personalAssets]);
  const publicTagOptions = useMemo(() => Array.from(new Set(personalAssets.flatMap((asset) => asset.publicTags))).sort(), [personalAssets]);

  const filteredAssets = useMemo(() => personalAssets
    .filter((asset) => {
      const query = search.trim().toLowerCase();
      const searchable = [asset.id, asset.name, asset.category, ...asset.publicTags].filter(Boolean).join(" ").toLowerCase();
      if (mode === "favorites" && !favoriteIds.includes(asset.id)) return false;
      if (query && !searchable.includes(query)) return false;
      if (resourceCategory !== "全部" && asset.resourceCategory !== resourceCategory) return false;
      if (categoryFilter !== "全部" && asset.category !== categoryFilter) return false;
      if (publicTagFilter !== "全部" && !asset.publicTags.includes(publicTagFilter)) return false;
      if (sourceFilter !== "全部" && asset.source !== sourceFilter) return false;
      const date = asset.createdAt.slice(0, 10);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    })
    .sort((left, right) => {
      if (sortBy === "oldest") return left.createdAt.localeCompare(right.createdAt);
      if (sortBy === "name") return left.name.localeCompare(right.name, "zh-CN");
      return right.createdAt.localeCompare(left.createdAt);
    }), [categoryFilter, endDate, favoriteIds, mode, personalAssets, publicTagFilter, resourceCategory, search, sortBy, sourceFilter, startDate]);

  const persistFavorites = (next: string[]) => {
    setFavoriteIds(next);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const persistTags = (next: PersonalTagItem[]) => {
    setTags(next);
    window.localStorage.setItem(PERSONAL_TAGS_KEY, JSON.stringify(next));
  };

  const resetFilters = () => {
    setSearch("");
    setResourceCategory("全部");
    setCategoryFilter("全部");
    setPublicTagFilter("全部");
    setSourceFilter("全部");
    setStartDate("");
    setEndDate("");
    setSortBy("newest");
  };

  const toggleFavorite = (asset: PersonalAsset) => {
    const next = favoriteIds.includes(asset.id) ? favoriteIds.filter((id) => id !== asset.id) : [...favoriteIds, asset.id];
    persistFavorites(next);
    onToast(next.includes(asset.id) ? `已收藏《${asset.name}》` : `已取消收藏《${asset.name}》`);
  };

  const copyDetailLink = async (asset: PersonalAsset) => {
    const link = `${window.location.origin}/#/resources/${asset.id}`;
    await navigator.clipboard?.writeText(link);
    onToast("详情链接已复制，访问时将按查看者的资源权限显示");
  };

  const downloadAsset = (asset: PersonalAsset) => {
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = asset.name;
    link.target = "_blank";
    link.click();
    onToast(`已开始下载《${asset.name}》`);
  };

  const confirmBinding = () => {
    if (!bindingAsset || selectedTaskIds.length === 0) return;
    const additions: TaskResourceBinding[] = selectedTaskIds
      .filter((taskId) => !bindings.some((item) => item.taskId === taskId && item.resourceId === bindingAsset.id))
      .map((taskId) => ({
        id: `bind-${Date.now()}-${taskId}`,
        taskId,
        resourceId: bindingAsset.id,
        resourceName: bindingAsset.name,
        resourceType: bindingAsset.type,
        resourceUrl: bindingAsset.url,
        boundAt: new Date().toLocaleString("zh-CN", { hour12: false }),
        boundBy: CURRENT_USER
      }));
    const next = [...bindings, ...additions];
    setBindings(next);
    window.localStorage.setItem(TASK_BINDINGS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("task-resource-bindings-changed"));
    onToast(additions.length > 0 ? `已将资源绑定到 ${additions.length} 个任务` : "所选任务已绑定该资源，不重复计数");
    setBindingAsset(null);
    setSelectedTaskIds([]);
  };

  if (mode === "personal_tags") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div><h2 className="text-base font-bold text-slate-900">个人标签管理</h2><p className="mt-1 text-xs text-slate-500">管理仅自己可见的资源标签</p></div>
          <div className="flex items-center gap-2">
            <input value={newTagName} onChange={(event) => setNewTagName(event.target.value)} placeholder="输入标签名称" className="w-44 rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-violet-400" />
            <button type="button" onClick={() => { const name = newTagName.trim(); if (!name) return; persistTags([...tags, { id: `pt-${Date.now()}`, name, color: ["#7c3aed", "#0284c7", "#059669", "#e11d48"][tags.length % 4], resourceIds: [] }]); setNewTagName(""); onToast("个人标签已创建"); }} className="flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" />新建标签</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">标签名称</th><th className="px-4 py-3">已标记资源</th><th className="px-4 py-3">创建人</th><th className="px-4 py-3 text-right">操作</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {tags.map((tagItem) => <tr key={tagItem.id}>
                <td className="px-4 py-3">{editingTagId === tagItem.id ? <input autoFocus value={editingTagName} onChange={(event) => setEditingTagName(event.target.value)} className="rounded border border-violet-300 px-2 py-1 outline-none" /> : <span className="flex items-center gap-2 font-semibold text-slate-800"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: tagItem.color }} />{tagItem.name}</span>}</td>
                <td className="px-4 py-3 text-slate-500">{tagItem.resourceIds.length} 个</td><td className="px-4 py-3 text-slate-500">{CURRENT_USER}（个人）</td>
                <td className="px-4 py-3"><div className="flex justify-end gap-1">{editingTagId === tagItem.id ? <button type="button" title="保存" onClick={() => { const value = editingTagName.trim(); if (value) persistTags(tags.map((item) => item.id === tagItem.id ? { ...item, name: value } : item)); setEditingTagId(null); }} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button> : <button type="button" title="编辑" onClick={() => { setEditingTagId(tagItem.id); setEditingTagName(tagItem.name); }} className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><Edit3 className="h-4 w-4" /></button>}<button type="button" title="删除" onClick={() => { if (window.confirm(`删除个人标签“${tagItem.name}”？资源本身不会被删除。`)) persistTags(tags.filter((item) => item.id !== tagItem.id)); }} className="rounded p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">{mode === "favorites" ? "我的收藏" : "我的资源"}</h2>
          <p className="mt-1 text-xs text-slate-500">{mode === "favorites" ? "已收藏的资源内容" : "资源库上传、任务协作上传与 AI 生成的个人资源"}</p>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div><span className="text-slate-400">资源总数</span><strong className="ml-2 font-mono text-base text-slate-800">{personalAssets.length}</strong></div>
          <div><span className="text-slate-400">任务文件</span><strong className="ml-2 font-mono text-base text-amber-600">{personalAssets.filter((asset) => asset.source === "task_collaboration").length}</strong></div>
          <div><span className="text-slate-400">已绑定任务</span><strong className="ml-2 font-mono text-base text-violet-600">{new Set(bindings.map((item) => item.taskId)).size}</strong></div>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs" aria-label="资源筛选">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索资源名称、ID、分类或标签" className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-violet-400" />
            </div>
            <div className="flex overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              {RESOURCE_CATEGORIES.map((item) => <button type="button" key={item} onClick={() => setResourceCategory(item)} className={`min-w-12 px-3 py-2 text-xs font-semibold transition-colors ${resourceCategory === item ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-white hover:text-slate-800"}`}>{item}</button>)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-2"><span className="w-14 shrink-0 text-[11px] font-semibold text-slate-500">分类标签</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 outline-none focus:border-violet-400"><option value="全部">全部分类</option>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
            <label className="flex items-center gap-2"><span className="w-14 shrink-0 text-[11px] font-semibold text-slate-500">公共标签</span><select value={publicTagFilter} onChange={(event) => setPublicTagFilter(event.target.value)} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 outline-none focus:border-violet-400"><option value="全部">全部标签</option>{publicTagOptions.map((tagName) => <option key={tagName} value={tagName}>{tagName}</option>)}</select></label>
            <label className="flex items-center gap-2"><span className="w-14 shrink-0 text-[11px] font-semibold text-slate-500">资源来源</span><select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as "全部" | ResourceSource)} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 outline-none focus:border-violet-400"><option value="全部">全部来源</option><option value="resource_library">资源库上传</option><option value="task_collaboration">任务协作上传</option><option value="ai_generation">AI 生成</option></select></label>
            <label className="flex items-center gap-2"><span className="w-14 shrink-0 text-[11px] font-semibold text-slate-500">排序方式</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 outline-none focus:border-violet-400"><option value="newest">最新上传</option><option value="oldest">最早上传</option><option value="name">名称排序</option></select></label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" /><span className="font-semibold">上传时间</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-md border border-slate-200 px-2.5 py-1.5 outline-none focus:border-violet-400" />
              <span className="text-slate-300">至</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-md border border-slate-200 px-2.5 py-1.5 outline-none focus:border-violet-400" />
            </div>
            <div className="flex items-center gap-3"><span className="text-xs text-slate-400">共 {filteredAssets.length} 条</span><button type="button" onClick={resetFilters} className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-3.5 w-3.5" />重置</button></div>
          </div>
        </div>
      </section>

      {filteredAssets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-500">暂无符合条件的资源</p><button type="button" onClick={resetFilters} className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-700">清除筛选条件</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => {
            const categoryMeta = CATEGORY_META[asset.resourceCategory];
            const sourceMeta = SOURCE_META[asset.source];
            const SourceIcon = sourceMeta.icon;
            const TypeIcon = categoryMeta.icon;
            const assetTags = tags.filter((tagItem) => tagItem.resourceIds.includes(asset.id));
            const bindingCount = new Set(bindings.filter((binding) => binding.resourceId === asset.id).map((binding) => binding.taskId)).size;
            const isVisual = asset.resourceCategory === "成片" || asset.resourceCategory === "素材" || asset.resourceCategory === "图片";
            return (
              <article key={asset.id} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-300">
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-100">
                  {isVisual && (asset.coverUrl || asset.type === "image") ? <img src={asset.coverUrl || asset.url} alt={asset.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : asset.resourceCategory === "音频" ? <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white"><Music className="h-9 w-9 text-blue-500" /><div className="mt-4 flex h-8 items-end gap-1">{[14, 24, 18, 30, 20, 26, 16, 28, 22, 12].map((height, index) => <span key={index} className="w-1 rounded-sm bg-blue-300" style={{ height }} />)}</div></div> : <div className="flex h-full w-full flex-col items-center justify-center bg-amber-50/60 px-6 text-center"><FileText className="h-9 w-9 text-amber-500" /><p className="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-amber-900">{asset.name.replace(/\.[^.]+$/, "")}</p></div>}
                  <span className={`absolute left-0 top-0 flex items-center gap-1 rounded-br-md px-2.5 py-1 text-[11px] font-bold ${categoryMeta.className}`}><TypeIcon className="h-3 w-3" />{asset.resourceCategory}</span>
                  <span className={`absolute right-2 top-2 flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-semibold ${sourceMeta.className}`}><SourceIcon className="h-3 w-3" />{sourceMeta.label}</span>
                  {asset.status && <span className="absolute bottom-2 left-2 rounded bg-slate-950/70 px-2 py-1 text-[10px] font-semibold text-white">{asset.status}</span>}
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><h3 className="truncate text-xs font-bold text-slate-900" title={asset.name}>{asset.name}</h3><p className="mt-1 truncate font-mono text-[10px] text-slate-400">ID: {asset.id}</p></div>
                    <button type="button" title={favoriteIds.includes(asset.id) ? "取消收藏" : "收藏"} onClick={() => toggleFavorite(asset)} className={`shrink-0 rounded p-1.5 ${favoriteIds.includes(asset.id) ? "bg-amber-50 text-amber-600" : "text-slate-400 hover:bg-slate-100"}`}><Bookmark className="h-4 w-4" fill={favoriteIds.includes(asset.id) ? "currentColor" : "none"} /></button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">分类：{asset.category || "未分类"}</span>
                    {asset.publicTags.map((tagName) => <span key={tagName} className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">{tagName}</span>)}
                    {assetTags.map((tagItem) => <span key={tagItem.id} className="rounded px-2 py-0.5 text-[10px] text-white" style={{ backgroundColor: tagItem.color }}>{tagItem.name}</span>)}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">
                    <span>{asset.creator} · {asset.size}</span><span>{asset.createdAt}</span>
                  </div>
                  {asset.sourceTaskId && <p className="mt-2 truncate rounded bg-amber-50 px-2 py-1.5 text-[10px] text-amber-700">来源任务：{asset.sourceTaskId}</p>}
                  {bindingCount > 0 && <p className="mt-2 text-[10px] font-semibold text-violet-600">已绑定 {bindingCount} 个协作任务</p>}

                  <div className="mt-3 flex items-center gap-1.5">
                    <button type="button" title="下载" onClick={() => downloadAsset(asset)} className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"><Download className="h-3.5 w-3.5" /></button>
                    <button type="button" title="复制详情链接" onClick={() => copyDetailLink(asset)} className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"><Link2 className="h-3.5 w-3.5" /></button>
                    <button type="button" title="设置个人标签" onClick={() => setTaggingAsset(asset)} className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"><Tag className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => { setBindingAsset(asset); setSelectedTaskIds([]); }} className="ml-auto flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-700"><Plus className="h-3 w-3" />绑定任务</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {bindingAsset && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-lg rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h3 className="text-sm font-bold text-slate-900">绑定到任务</h3><p className="mt-1 max-w-sm truncate text-xs text-slate-500">{bindingAsset.name}</p></div><button type="button" title="关闭" onClick={() => setBindingAsset(null)}><X className="h-5 w-5 text-slate-400" /></button></div><div className="p-5"><div className="mb-3 rounded bg-blue-50 p-3 text-[11px] leading-5 text-blue-700">资源可复用并绑定多个任务；同一资源在同一任务中只计数一次。</div><div className="space-y-2">{AVAILABLE_TASKS.map((task) => <label key={task.id} className="flex cursor-pointer items-start gap-3 rounded border border-slate-200 p-3 hover:bg-slate-50"><input type="checkbox" checked={selectedTaskIds.includes(task.id)} onChange={() => setSelectedTaskIds((prev) => prev.includes(task.id) ? prev.filter((id) => id !== task.id) : [...prev, task.id])} className="mt-1" /><div className="flex-1"><p className="text-xs font-semibold text-slate-800">{task.title}</p><p className="mt-1 text-[10px] text-slate-500">任务 {task.id} · 发布人 {task.publisher} · 需提交 {task.required} 个 · 截止 {task.deadline}</p></div></label>)}</div></div><div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button type="button" onClick={() => setBindingAsset(null)} className="rounded border border-slate-200 px-4 py-2 text-xs text-slate-600">取消</button><button type="button" disabled={selectedTaskIds.length === 0} onClick={confirmBinding} className="rounded bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认绑定（{selectedTaskIds.length}）</button></div></div></div>}

      {taggingAsset && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-sm font-bold">设置个人标签</h3><button type="button" title="关闭" onClick={() => setTaggingAsset(null)}><X className="h-5 w-5 text-slate-400" /></button></div><p className="mt-1 truncate text-xs text-slate-500">{taggingAsset.name}</p><div className="mt-4 space-y-2">{tags.map((tagItem) => { const checked = tagItem.resourceIds.includes(taggingAsset.id); return <label key={tagItem.id} className="flex cursor-pointer items-center gap-2 rounded border border-slate-200 p-2.5 text-xs"><input type="checkbox" checked={checked} onChange={() => persistTags(tags.map((item) => item.id === tagItem.id ? { ...item, resourceIds: checked ? item.resourceIds.filter((id) => id !== taggingAsset.id) : [...item.resourceIds, taggingAsset.id] } : item))} /><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: tagItem.color }} />{tagItem.name}</label>; })}</div><button type="button" onClick={() => setTaggingAsset(null)} className="mt-4 w-full rounded bg-slate-900 py-2 text-xs font-semibold text-white">完成</button></div></div>}
    </div>
  );
}
