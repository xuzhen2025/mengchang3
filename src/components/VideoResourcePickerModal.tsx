import React, { useMemo, useRef, useState } from "react";
import { Check, Search, Trash2, Upload, X } from "lucide-react";
import AssetPagination from "./AssetPagination";
import OverlayPortal from "./overlays/OverlayPortal";

export type VideoResourceSection = "成片" | "素材";

export interface VideoResourcePickerItem {
  id: string;
  name: string;
  cover: string;
  status: string;
  section: VideoResourceSection;
  primaryCategory: string;
  secondaryCategory: string;
  tags: string[];
  author: string;
  duration: string;
  size: string;
}

interface VideoResourcePickerModalProps {
  items: VideoResourcePickerItem[];
  initialSelectedIds: string[];
  initialSection?: VideoResourceSection;
  allowLocalUpload?: boolean;
  showAllSection?: boolean;
  onClose: () => void;
  onConfirm: (items: VideoResourcePickerItem[]) => void;
}

const filterClassName = "h-9 w-[130px] shrink-0 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-violet-400";

const uniqueValues = (values: string[]) => Array.from(new Set(values)).filter(Boolean);

export default function VideoResourcePickerModal({
  items,
  initialSelectedIds,
  initialSection = "成片",
  allowLocalUpload = false,
  showAllSection = false,
  onClose,
  onConfirm,
}: VideoResourcePickerModalProps) {
  const [sourceTab, setSourceTab] = useState<"library" | "local">("library");
  const [section, setSection] = useState<VideoResourceSection | "全部">(showAllSection ? "全部" : initialSection);
  const [primaryCategory, setPrimaryCategory] = useState("全部一级分类");
  const [secondaryCategory, setSecondaryCategory] = useState("全部二级分类");
  const [tag, setTag] = useState("全部标签");
  const [status, setStatus] = useState("全部状态");
  const [author, setAuthor] = useState("全部上传人");
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => uniqueValues(initialSelectedIds));
  const [localItems, setLocalItems] = useState<VideoResourcePickerItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const allItems = useMemo(() => [...items, ...localItems], [items, localItems]);
  const sectionItems = useMemo(
    () => items.filter((item) => section === "全部" || item.section === section),
    [items, section],
  );
  const primaryCategories = useMemo(() => uniqueValues(sectionItems.map((item) => item.primaryCategory)), [sectionItems]);
  const secondaryCategories = useMemo(
    () => uniqueValues(sectionItems.filter((item) => primaryCategory === "全部一级分类" || item.primaryCategory === primaryCategory).map((item) => item.secondaryCategory)),
    [primaryCategory, sectionItems],
  );
  const tags = useMemo(() => uniqueValues(sectionItems.flatMap((item) => item.tags)), [sectionItems]);
  const statuses = useMemo(() => uniqueValues(sectionItems.map((item) => item.status)), [sectionItems]);
  const authors = useMemo(() => uniqueValues(sectionItems.map((item) => item.author)), [sectionItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sectionItems.filter((item) =>
      (primaryCategory === "全部一级分类" || item.primaryCategory === primaryCategory) &&
      (secondaryCategory === "全部二级分类" || item.secondaryCategory === secondaryCategory) &&
      (tag === "全部标签" || item.tags.includes(tag)) &&
      (status === "全部状态" || item.status === status) &&
      (author === "全部上传人" || item.author === author) &&
      (!onlyMine || item.author === "徐振") &&
      (!query || `${item.name}${item.id}`.toLowerCase().includes(query)),
    );
  }, [author, onlyMine, primaryCategory, search, secondaryCategory, sectionItems, status, tag]);

  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredItems.length / pageSize)));
  const pagedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetPage = () => setPage(1);
  const toggleItem = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleLocalUpload = (files?: FileList | null) => {
    if (!files?.length) return;
    const uploaded = Array.from(files)
      .filter((file) => file.type.startsWith("video/") || /\.(mp4|mpeg|mov)$/i.test(file.name))
      .map((file, index): VideoResourcePickerItem => ({
        id: `script-video-local-${Date.now()}-${index}`,
        name: file.name,
        cover: "./assets/prototype/beauty-promo-detail.jpg",
        status: "本地文件",
        section: "素材",
        primaryCategory: "本地上传",
        secondaryCategory: "未分类",
        tags: [],
        author: "当前用户",
        duration: "--:--",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      }));
    setLocalItems((current) => [...current, ...uploaded]);
    setSelectedIds((current) => [...current, ...uploaded.map((item) => item.id)]);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  return (
    <OverlayPortal
      layer="modal"
      className="fixed inset-0 flex items-center justify-center bg-slate-900/45 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label="选择关联作品" className="flex h-[86vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white text-slate-800 shadow-2xl">
        <div className="flex min-h-0 flex-1 flex-col p-5 pb-0">
          {allowLocalUpload && (
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => { setSourceTab("library"); resetPage(); }} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${sourceTab === "library" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>资源库</button>
                <button type="button" onClick={() => { setSourceTab("local"); resetPage(); }} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${sourceTab === "local" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>本地上传</button>
              </div>
              <button type="button" onClick={onClose} title="关闭" className="mb-1 rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {sourceTab === "library" ? <>
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-1">
              {(showAllSection ? (["全部", "成片", "素材"] as const) : (["成片", "素材"] as const)).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSection(item);
                    setPrimaryCategory("全部一级分类");
                    setSecondaryCategory("全部二级分类");
                    setTag("全部标签");
                    setStatus("全部状态");
                    setAuthor("全部上传人");
                    resetPage();
                  }}
                  className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${section === item ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            {!allowLocalUpload && <button type="button" onClick={onClose} title="关闭" className="mb-1 rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-4 w-4" /></button>}
          </div>

          <div className="flex shrink-0 flex-nowrap items-center gap-2 overflow-x-auto py-4">
            <select value={primaryCategory} onChange={(event) => { setPrimaryCategory(event.target.value); setSecondaryCategory("全部二级分类"); resetPage(); }} className={filterClassName}>
              <option>全部一级分类</option>
              {primaryCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={secondaryCategory} onChange={(event) => { setSecondaryCategory(event.target.value); resetPage(); }} className={filterClassName}>
              <option>全部二级分类</option>
              {secondaryCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={tag} onChange={(event) => { setTag(event.target.value); resetPage(); }} className={filterClassName}>
              <option>全部标签</option>
              {tags.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(event) => { setStatus(event.target.value); resetPage(); }} className={filterClassName}>
              <option>全部状态</option>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={author} onChange={(event) => { setAuthor(event.target.value); resetPage(); }} className={`${filterClassName} whitespace-nowrap`}>
              <option>全部上传人</option>
              {authors.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} placeholder="搜索文件名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-violet-400" />
            </div>
            <label className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap px-2 text-xs text-slate-600">
              <input type="checkbox" checked={onlyMine} onChange={(event) => { setOnlyMine(event.target.checked); resetPage(); }} className="accent-violet-600" />
              仅看我的
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-md border border-slate-200">
            <table className="w-full min-w-[960px] table-fixed text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500">
                <tr>
                  <th className="w-14 px-4 py-3" />
                  <th className="w-32 px-3 py-3">文件缩略图</th>
                  <th className="w-[34%] px-3 py-3">文件名称 / ID</th>
                  <th className="w-28 px-3 py-3">状态</th>
                  <th className="w-44 px-3 py-3">所在分类</th>
                  <th className="w-24 px-3 py-3">上传人</th>
                  <th className="w-20 px-3 py-3">时长</th>
                  <th className="w-24 px-3 py-3">大小</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.length ? pagedItems.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} onClick={() => toggleItem(item.id)} className={`cursor-pointer border-t border-slate-100 ${selected ? "bg-violet-50" : "hover:bg-slate-50"}`}>
                      <td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white"}`}>{selected && <Check className="h-2.5 w-2.5" />}</span></td>
                      <td className="px-3 py-2"><img src={item.cover} alt="" className="h-10 w-16 rounded object-cover" referrerPolicy="no-referrer" /></td>
                      <td className="px-3 py-3"><p className="truncate font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td>
                      <td className="px-3 py-3"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{item.status}</span></td>
                      <td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.section}</p><p className="mt-1 truncate text-[10px] text-slate-400">{item.primaryCategory} / {item.secondaryCategory}</p></td>
                      <td className="truncate px-3 py-3 text-slate-500">{item.author}</td>
                      <td className="px-3 py-3 text-slate-500">{item.duration}</td>
                      <td className="px-3 py-3 text-slate-500">{item.size}</td>
                    </tr>
                  );
                }) : <tr><td colSpan={8} className="h-48 text-center text-sm text-slate-400">暂无符合条件的视频</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="shrink-0">
            <AssetPagination total={filteredItems.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); resetPage(); }} />
          </div>
          </> : (
            <div className="min-h-0 flex-1 overflow-y-auto py-5">
              <button type="button" onClick={() => uploadRef.current?.click()} className="flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-violet-400 hover:text-violet-700">
                <Upload className="h-6 w-6" />
                <span className="mt-3 text-xs font-semibold">点击选择本地视频</span>
              </button>
              <input ref={uploadRef} type="file" multiple accept=".mp4,.mpeg,.mov,video/mp4,video/mpeg,video/quicktime" className="hidden" onChange={(event) => handleLocalUpload(event.target.files)} />
              <p className="mt-3 text-center text-xs leading-6 text-slate-400">支持 mp4、mpeg、mov 格式，单个视频大小需小于 1000MB。<br />请确保上传素材为原创内容或已取得合法授权。</p>
              {localItems.length > 0 && <div className="mt-4 space-y-2">{localItems.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-md border border-slate-200 p-2.5"><img src={item.cover} alt="" className="h-11 w-16 rounded object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.size}</p></div><button type="button" onClick={() => { setLocalItems((current) => current.filter((video) => video.id !== item.id)); setSelectedIds((current) => current.filter((id) => id !== item.id)); }} title="删除" className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white px-5 py-4">
          <p className="mr-auto text-xs text-slate-500">已选择 <b className="text-violet-700">{selectedIds.length}</b> 个视频</p>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">取消</button>
          <button type="button" onClick={() => onConfirm(allItems.filter((item) => selectedIds.includes(item.id)))} className="rounded-md bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700">确认选择</button>
        </div>
      </div>
    </OverlayPortal>
  );
}
