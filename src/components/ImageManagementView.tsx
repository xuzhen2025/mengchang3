import React, { useState } from "react";
import { PublicTagFilter } from "./PublicTagFilter";
import ImageDetailView from "./ImageDetailView";
import { Pagination } from "./Pagination";
import { ResourceSearchIntent } from "../types";
import ResourceSearchCondition from "./ResourceSearchCondition";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  Download,
  Edit2,
  Copy,
  Plus,
  Check,
  Trash2,
  Scissors,
  ListOrdered,
  Paperclip,
  Folder,
  Eye,
  X,
  LayoutGrid,
  List,
  ExternalLink,
  Tag,
  Share2,
  Star,
  ArrowUpDown,
  ZoomIn
} from "lucide-react";

interface ImageItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  downloads: number;
  filesCount: number;
  author: string;
  time: string;
  primaryCategory: string;
  secondaryCategory: string;
  publicTags: string[];
  personalTag: string;
  size: string;
  resolution: string;
  isFolder?: boolean;
}

interface ImageManagementViewProps {
  onTriggerTask?: (type: any, name: string, inputFiles: string[], cost: number) => void;
  onDetailStateChange?: (isDetail: boolean) => void;
  initialSearch?: ResourceSearchIntent | null;
  onClearSearch?: () => void;
}

const MOCK_IMAGES: ImageItem[] = [
  {
    id: "img-1",
    title: "防晒植物提取精华液展图.jpg",
    subtitle: "高清主图",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 12,
    filesCount: 1,
    author: "致上互娱",
    time: "1小时前",
    primaryCategory: "美妆护肤",
    secondaryCategory: "致上旗舰店",
    publicTags: ["产品实拍", "成分党"],
    personalTag: "精选主图",
    size: "2.4 MB",
    resolution: "1080x1440"
  },
  {
    id: "img-2",
    title: "无痕防晒冰丝丝袜场景模特图.png",
    subtitle: "模特穿搭展图",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 8,
    filesCount: 1,
    author: "汤小真",
    time: "2025-05-23",
    primaryCategory: "服饰内衣",
    secondaryCategory: "致上旗舰店",
    publicTags: ["模特出镜", "清凉冰丝"],
    personalTag: "精选主图",
    size: "1.8 MB",
    resolution: "800x1200",
    isFolder: true
  },
  {
    id: "img-3",
    title: "夏日爆款产品宣发介绍图册.pptx",
    subtitle: "宣发图册",
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 15,
    filesCount: 1,
    author: "致上互娱",
    time: "2025-05-12",
    primaryCategory: "宣发图库",
    secondaryCategory: "云享专营店",
    publicTags: ["宣发海报"],
    personalTag: "营销资料库",
    size: "4.5 MB",
    resolution: "1920x1080",
    isFolder: true
  },
  {
    id: "img-4",
    title: "草本护肤成分拆解对比展图.png",
    subtitle: "成分拆解",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 6,
    filesCount: 1,
    author: "汤小真",
    time: "2025-04-28",
    primaryCategory: "美妆护肤",
    secondaryCategory: "致上旗舰店",
    publicTags: ["对比实测"],
    personalTag: "重点素材",
    size: "3.1 MB",
    resolution: "1080x1080"
  },
  {
    id: "img-5",
    title: "防晒霜SPF50+权威检测报告图片.jpg",
    subtitle: "资质证明",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 20,
    filesCount: 1,
    author: "致上互娱",
    time: "2025-04-24",
    primaryCategory: "资质文件",
    secondaryCategory: "云享专营店",
    publicTags: ["成分党"],
    personalTag: "品牌资质",
    size: "1.2 MB",
    resolution: "1080x1920"
  },
  {
    id: "img-6",
    title: "补水面膜水分提升对比实验图.jpg",
    subtitle: "实验效果",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 11,
    filesCount: 1,
    author: "致上互娱",
    time: "2025-04-24",
    primaryCategory: "美妆护肤",
    secondaryCategory: "致上旗舰店",
    publicTags: ["对比实测"],
    personalTag: "精选主图",
    size: "2.9 MB",
    resolution: "1080x1440"
  },
  {
    id: "img-7",
    title: "夏日清凉草本展示图.jpg",
    subtitle: "爆款推广素材",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 5,
    filesCount: 1,
    author: "美妆设计组",
    time: "2025-04-20",
    primaryCategory: "宣发图库",
    secondaryCategory: "致上旗舰店",
    publicTags: ["爆款短视频"],
    personalTag: "精选主图",
    size: "5.4 MB",
    resolution: "2000x2000"
  },
  {
    id: "img-8",
    title: "高奢护肤瓶身渲染特写.jpg",
    subtitle: "3D透视修图",
    imageUrl: "https://images.unsplash.com/photo-1608248597261-833257058444?w=600&auto=format&fit=crop&q=80",
    badge: "图片",
    downloads: 3,
    filesCount: 1,
    author: "汤小真",
    time: "2025-04-18",
    primaryCategory: "美妆护肤",
    secondaryCategory: "云享专营店",
    publicTags: ["高端质感"],
    personalTag: "3D渲染图",
    size: "3.8 MB",
    resolution: "1440x1920"
  }
];

export default function ImageManagementView({ onTriggerTask, onDetailStateChange, initialSearch, onClearSearch }: ImageManagementViewProps) {
  // Category & Filter States
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState("全部");
  const [secondarySearch, setSecondarySearch] = useState("");
  const [selectedSecondaryCat, setSelectedSecondaryCat] = useState("全部");
  const [publicTagSearch, setPublicTagSearch] = useState("");
  const [personalTagSearch, setPersonalTagSearch] = useState("");
  const [selectedPersonalTag, setSelectedPersonalTag] = useState("全部");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [sortBy, setSortBy] = useState("最新发布");
  const [authorFilter, setAuthorFilter] = useState("");
  const [selectedShopLink, setSelectedShopLink] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modals & Popups
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<ImageItem | null>(null);

  React.useEffect(() => {
    onDetailStateChange?.(!!detailItem);
  }, [detailItem, onDetailStateChange]);
  const [selectedDetailThumbIndex, setSelectedDetailThumbIndex] = useState<number>(0);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");
  const [presets, setPresets] = useState<{ name: string }[]>([
    { name: "常用美妆素材组" },
    { name: "店铺资质文件库" }
  ]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Primary categories from reference screenshot
  const primaryCategories = [
    "全部",
    "美妆护肤",
    "服饰内衣",
    "3C数码",
    "资质文件",
    "宣发图库",
    "家居日用",
    "食品饮料"
  ];

  // Personal tag buttons from reference screenshot
  const personalTagsList = [
    "全部",
    "精选主图",
    "品牌资质",
    "营销资料库",
    "重点素材",
    "3D渲染图",
    "对比素材"
  ];

  React.useEffect(() => {
    const tag = initialSearch?.tag;
    if (!tag) return;
    if (primaryCategories.includes(tag)) setSelectedPrimaryCat(tag);
    else if (["a店铺", "b店铺"].includes(tag)) setSelectedSecondaryCat(tag);
    else if (personalTagsList.includes(tag)) setSelectedPersonalTag(tag);
    else setPublicTagSearch(tag);
    setCurrentPage(1);
  }, [initialSearch?.requestId]);

  // Filtered list
  const filteredImages = MOCK_IMAGES.filter(item => {
    const homeSearch = (initialSearch?.query || "").trim().toLowerCase();
    const matchesHomeSearch = !homeSearch || [item.title, item.subtitle, item.primaryCategory, item.secondaryCategory, item.personalTag, item.author, ...item.publicTags]
      .some((value) => value.toLowerCase().includes(homeSearch));
    if (!matchesHomeSearch) return false;

    if (selectedPrimaryCat !== "全部" && item.primaryCategory !== selectedPrimaryCat) {
      return false;
    }
    if (selectedSecondaryCat !== "全部" && item.secondaryCategory !== selectedSecondaryCat) {
      return false;
    }
    if (secondarySearch && !item.secondaryCategory.toLowerCase().includes(secondarySearch.toLowerCase())) {
      return false;
    }
    if (publicTagSearch && !item.publicTags.some(t => t.toLowerCase().includes(publicTagSearch.toLowerCase()))) {
      return false;
    }
    if (selectedPersonalTag !== "全部") {
      if (selectedPersonalTag === "无个人标签" && item.personalTag === "有个人标签") return false;
      if (selectedPersonalTag === "有个人标签" && item.personalTag === "无个人标签") return false;
      if (selectedPersonalTag !== "无个人标签" && selectedPersonalTag !== "有个人标签" && item.personalTag !== selectedPersonalTag) return false;
    }
    if (personalTagSearch && !item.personalTag.toLowerCase().includes(personalTagSearch.toLowerCase())) {
      return false;
    }
    if (authorFilter && !item.author.includes(authorFilter)) {
      return false;
    }
    return true;
  });

  const totalCount = filteredImages.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle select all on current page
  const handleSelectPage = () => {
    const pageIds = filteredImages.map(img => img.id);
    const allSelected = pageIds.every(id => selectedImageIds.includes(id));
    if (allSelected) {
      setSelectedImageIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedImageIds(Array.from(new Set([...selectedImageIds, ...pageIds])));
      setIsSelectionMode(true);
    }
  };

  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSelectionMode(true);
    setSelectedImageIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleApplyPreset = (name: string) => {
    setSelectedPreset(name);
    if (name) {
      showToast(`已加载常用筛选预设: ${name}`);
    }
  };

  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;
    setPresets(prev => [...prev, { name: presetNameInput.trim() }]);
    setSelectedPreset(presetNameInput.trim());
    setShowSavePresetModal(false);
    setPresetNameInput("");
    showToast("筛选预设保存成功！");
  };

  const handleResetFilters = () => {
    setSelectedPrimaryCat("全部");
    setSecondarySearch("");
    setSelectedSecondaryCat("全部");
    setPublicTagSearch("");
    setPersonalTagSearch("");
    setSelectedPersonalTag("全部");
    setSelectedPreset("");
    setSortBy("最新发布");
    setAuthorFilter("");
    setSelectedShopLink("");
    showToast("筛选条件已重置");
  };

  if (detailItem) {
    return (
      <ImageDetailView
        item={detailItem}
        onClose={() => setDetailItem(null)}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-4 text-slate-800 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[80] bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Card 1: Top Filter Panel (Matches Screenshot Exact Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5 text-xs text-slate-700">
        {/* Row 1: 常用筛选预设 (Top Right Corner inside card or aligned) */}
        <div className="flex justify-end items-center gap-2 pb-1 border-b border-slate-100/60">
          <select
            value={selectedPreset}
            onChange={(e) => handleApplyPreset(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer min-w-[150px]"
          >
            <option value="">选择常用筛选预设</option>
            {presets.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowSavePresetModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3.5 py-1 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>保存</span>
          </button>
        </div>

        {/* Row 2: 一级分类 */}
        <div className="flex items-start gap-2 pt-1">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2 mt-0.5">一级分类：</span>
          <div className="flex-1 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            {primaryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedPrimaryCat(cat)}
                className={`transition-colors cursor-pointer text-xs ${
                  selectedPrimaryCat === cat
                    ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                    : "text-slate-600 hover:text-purple-600 font-normal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: 二级分类 */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">二级分类：</span>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 focus-within:border-purple-400">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索分类"
                value={secondarySearch}
                onChange={(e) => setSecondarySearch(e.target.value)}
                className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
              />
            </div>

            <button
              onClick={() => setSelectedSecondaryCat("全部")}
              className={`transition-colors cursor-pointer text-xs ${
                selectedSecondaryCat === "全部"
                  ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                  : "text-slate-600 hover:text-purple-600 font-normal"
              }`}
            >
              全部
            </button>

            {["a店铺", "b店铺"].map(shop => (
              <button
                key={shop}
                onClick={() => setSelectedSecondaryCat(selectedSecondaryCat === shop ? "全部" : shop)}
                className={`transition-colors cursor-pointer text-xs ${
                  selectedSecondaryCat === shop
                    ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                    : "text-slate-600 hover:text-purple-600 font-normal"
                }`}
              >
                {shop}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: 公共标签 */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">公共标签：</span>
          <PublicTagFilter
            selectedTag={publicTagSearch || "全部"}
            onSelectTag={(tag) => setPublicTagSearch(tag === "全部" ? "" : tag)}
          />
        </div>

        {/* Row 5: 个人标签 */}
        <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2 mt-1">个人标签：</span>
          <div className="flex-1 flex flex-wrap items-center gap-2">
            <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 focus-within:border-purple-400 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索标签"
                value={personalTagSearch}
                onChange={(e) => setPersonalTagSearch(e.target.value)}
                className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
              />
            </div>

            {/* Selector group for [全部 | 无个人标签 | 有个人标签] */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-white shrink-0">
              {["全部", "无个人标签", "有个人标签"].map(ptag => (
                <button
                  key={ptag}
                  onClick={() => setSelectedPersonalTag(ptag)}
                  className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                    selectedPersonalTag === ptag
                      ? "bg-purple-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  {ptag}
                </button>
              ))}
            </div>

            {/* Extended Personal Tags list from reference image */}
            {personalTagsList.slice(3).map(ptag => (
              <button
                key={ptag}
                onClick={() => setSelectedPersonalTag(selectedPersonalTag === ptag ? "全部" : ptag)}
                className={`transition-colors cursor-pointer text-xs px-2 py-0.5 rounded ${
                  selectedPersonalTag === ptag
                    ? "text-purple-600 font-bold bg-purple-100/70 border border-purple-200"
                    : "text-slate-600 hover:text-purple-600 font-normal"
                }`}
              >
                {ptag}
              </button>
            ))}

            <button
              onClick={() => {
                setPersonalTagSearch("");
                setSelectedPersonalTag("全部");
              }}
              className="text-slate-500 hover:text-purple-600 text-xs flex items-center gap-1 cursor-pointer ml-2 font-normal"
            >
              <span>重置个人标签</span>
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <ResourceSearchCondition query={initialSearch?.query} onClear={onClearSearch} />

      {/* Filter Card 2: 高级搜索 Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <span className="text-slate-900 font-bold shrink-0">高级搜索：</span>

          {/* 排序 */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
            <span className="text-slate-900 font-bold shrink-0">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-normal text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="最新发布">最新发布</option>
              <option value="最早发布">最早发布</option>
              <option value="最多下载">最多下载</option>
            </select>
          </div>

          {/* 系统自动标签 */}
          <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer">
            <option value="">系统自动标签: 请选择系统标签</option>
            <option value="ai_generated">AI识别渲染</option>
            <option value="high_res">高精修大图</option>
          </select>

          {/* 近期未使用 */}
          <span className="text-slate-500 font-normal shrink-0">近期未使用:</span>

          {/* 店铺+链接ID */}
          <select
            value={selectedShopLink}
            onChange={(e) => setSelectedShopLink(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="">请选择店铺+链接ID</option>
            <option value="shop_a">a店铺-草本洗发水链接</option>
            <option value="shop_b">b店铺-古法金饰链接</option>
          </select>

          {/* 日历时间区间 */}
          <div className="flex items-center gap-1 text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>请选择时间</span>
            <span className="text-slate-300 mx-1">|</span>
            <span>至今</span>
          </div>
        </div>

        {/* Buttons: 筛选, 重置, 导出 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => showToast("已应用高级筛选条件")}
            className="border border-purple-500 text-purple-600 hover:bg-purple-50 font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>筛选</span>
          </button>

          <button
            onClick={handleResetFilters}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            重置
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            导出
          </button>
        </div>
      </div>

      {/* Toolbar / Action Bar (Matches FinishedVideosView EXACT Replica) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {(isSelectionMode || selectedImageIds.length > 0) ? (
            <>
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedImageIds([]);
                  setOpenDropdown(null);
                }}
                className="border border-purple-500 text-purple-600 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-2xs transition-all shrink-0"
              >
                取消选择
              </button>

              <button
                onClick={handleSelectPage}
                className={`border border-purple-500 text-purple-600 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-2xs transition-all flex items-center gap-1.5 shrink-0 ${
                  filteredImages.length > 0 && filteredImages.every(i => selectedImageIds.includes(i.id))
                    ? "bg-purple-50/90"
                    : "bg-white hover:bg-purple-50"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold transition-all ${
                  filteredImages.length > 0 && filteredImages.every(i => selectedImageIds.includes(i.id))
                    ? "bg-purple-600 text-white"
                    : "border border-purple-400 bg-white"
                }`}>
                  {filteredImages.length > 0 && filteredImages.every(i => selectedImageIds.includes(i.id)) && (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  )}
                </div>
                <span>选中本页</span>
              </button>

              <span className="text-slate-800 font-bold text-xs px-1 flex items-center gap-1">
                已选: <span className="text-purple-600 font-black">{selectedImageIds.length}</span>个
              </span>

              {/* Action dropdowns */}
              <button
                onClick={() => showToast(`正在批量下载 ${selectedImageIds.length} 个图片文件`)}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
              >
                下载
              </button>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "edit" ? null : "edit")}
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>修改</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {openDropdown === "edit" && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in">
                    {["修改一级分类", "修改二级分类", "修改个人标签"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => {
                          showToast(`批量操作: ${opt}`);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "tag" ? null : "tag")}
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>添加标签</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {openDropdown === "tag" && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in">
                    {["添加公共标签", "添加个人标签"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => {
                          showToast(`批量操作: ${opt}`);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => showToast("已复制选中的图片素材链接")}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>复制链接</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => showToast("批量更多操作")}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>操作</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
              >
                选择
              </button>

              <button
                onClick={() => {
                  setIsSelectionMode(true);
                  handleSelectPage();
                }}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <div className="w-3.5 h-3.5 border border-slate-300 rounded shrink-0" />
                <span>选中本页</span>
              </button>
            </>
          )}
        </div>

        {/* Right Side Controls (Author, Search, Date Range, View Toggle) */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 bg-white focus:outline-none cursor-pointer"
          >
            <option value="">作者</option>
            <option value="致上互娱">致上互娱</option>
            <option value="汤小真">汤小真</option>
            <option value="美妆设计组">美妆设计组</option>
          </select>

          <div className="relative border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white w-36 focus-within:border-purple-400">
            <input
              type="text"
              placeholder="请选择(支持输入搜索)"
              className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
            />
          </div>

          <div className="flex items-center gap-1 text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>上传时间</span>
            <span className="text-slate-300">|</span>
            <input type="text" placeholder="开始日期" className="w-14 focus:outline-none text-center" />
            <span>至</span>
            <input type="text" placeholder="结束日期" className="w-14 focus:outline-none text-center" />
          </div>

          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white ml-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded cursor-pointer ${viewMode === "grid" ? "bg-purple-100 text-purple-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded cursor-pointer ${viewMode === "list" ? "bg-purple-100 text-purple-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View of Images */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {paginatedImages.map((item) => {
            const isSelected = selectedImageIds.includes(item.id);
            const isSelectionActive = isSelectionMode || selectedImageIds.length > 0;
            return (
              <div
                key={item.id}
                onMouseEnter={() => {
                  if (!isSelectionActive) setHoveredItemId(item.id);
                }}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => {
                  if (isSelectionActive) {
                    handleToggleSelect(item.id);
                  } else {
                    setDetailItem(item);
                  }
                }}
                className={`bg-white rounded-2xl border transition-all flex flex-col group relative cursor-pointer ${
                  isSelected
                    ? "border-purple-600 ring-2 ring-purple-500/20 shadow-md bg-purple-50/10"
                    : "border-slate-200/90 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                {/* Floating Detail Preview Popover (Reference Screenshot Exact Match) */}
                {!isSelectionActive && hoveredItemId === item.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-[104%] left-1/2 -translate-x-1/2 z-[80] w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 space-y-3 animate-fade-in pointer-events-auto cursor-default"
                  >
                    {/* Header: Title + Tag on left, 查看详情 button on right */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                        <span className="inline-block bg-slate-100 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                          {item.subtitle || "测试2"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailItem(item);
                          setHoveredItemId(null);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-colors shrink-0"
                      >
                        查看详情
                      </button>
                    </div>

                    {/* Image Thumbnail Preview */}
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Bottom Arrow Pointer */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
                  </div>
                )}

                {/* Checkbox overlay button (ONLY shown when selection mode is active or items selected) */}
                {isSelectionActive && (
                  <button
                    type="button"
                    onClick={(e) => handleToggleSelect(item.id, e)}
                    className={`absolute top-1.5 left-1.5 z-30 w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-xs ring-2 ring-purple-200 opacity-100"
                        : "bg-white/90 hover:bg-white border-2 border-purple-400 text-slate-400 shadow-xs opacity-100"
                    }`}
                    title={isSelected ? "取消选择" : "选择此项"}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? "opacity-100 text-white" : "opacity-0 hover:opacity-100 text-purple-600"}`} />
                  </button>
                )}

                {/* Top Image Preview Box */}
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden rounded-t-[15px] flex items-center justify-center group/img">
                  {/* Top-Left Badge: Green Pill "图片" (positioned left-0 when no checkbox, left-7 when checkbox active) */}
                  <span className={`absolute top-0 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-br-lg z-10 shadow-xs transition-all ${
                    isSelectionActive ? "left-7 bg-purple-600" : "left-0 bg-[#10B981]"
                  }`}>
                    {item.badge}
                  </span>

                  {/* Main Image or Folder Icon */}
                  {item.isFolder ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-4">
                      <Folder className="w-12 h-12 stroke-1 text-slate-400" />
                    </div>
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Image Bottom Overlay Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 text-white flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-0.5">
                      <Download className="w-3 h-3" />
                      <span>{item.downloads}</span>
                    </div>
                    <span>共{item.filesCount}个文件</span>
                  </div>
                </div>

                {/* Card Information Footer */}
                <div className="p-3 flex flex-col gap-1 text-xs">
                  <h3 className="font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-[11px] truncate">
                    {item.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[11px] text-slate-500 mt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        Z
                      </div>
                      <span className="truncate">{item.author}</span>
                    </div>
                    <span className="text-slate-400 shrink-0">{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredImages.length > 0 && filteredImages.every(i => selectedImageIds.includes(i.id))}
                    onChange={handleSelectPage}
                    className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">图片资源</th>
                <th className="p-3.5">描述/标识</th>
                <th className="p-3.5">一级分类</th>
                <th className="p-3.5">二级分类</th>
                <th className="p-3.5">下载数</th>
                <th className="p-3.5">作者</th>
                <th className="p-3.5">上传时间</th>
                <th className="p-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedImages.map((item) => {
                const isSelected = selectedImageIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-purple-50/30 transition-colors ${
                      isSelected ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(item.id, e as any)}
                        className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                          {item.isFolder ? (
                            <Folder className="w-5 h-5 text-slate-400" />
                          ) : (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-bold text-slate-800 hover:text-purple-600 cursor-pointer" onClick={() => setDetailItem(item)}>
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">{item.subtitle}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                        {item.primaryCategory}
                      </span>
                    </td>
                    <td className="p-3.5">{item.secondaryCategory}</td>
                    <td className="p-3.5 font-semibold text-slate-600">{item.downloads}</td>
                    <td className="p-3.5">{item.author}</td>
                    <td className="p-3.5 text-slate-400">{item.time}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => showToast(`下载: ${item.title}`)}
                          className="text-slate-600 hover:text-purple-600 font-medium cursor-pointer"
                        >
                          下载
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 底部翻页模块 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      {/* Full-Screen Image Lightbox Modal (点击图片可查看大图) */}
      {fullScreenImage && (
        <div
          onClick={() => setFullScreenImage(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in cursor-zoom-out"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
            className="absolute top-6 right-6 z-[110] bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition-colors cursor-pointer"
            title="关闭大图"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center space-y-3"
          >
            <img
              src={fullScreenImage}
              alt="全屏大图预览"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <div className="flex items-center gap-3 text-white/80 text-xs font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <ZoomIn className="w-4 h-4 text-purple-400" />
              <span>点击任意位置或右上角按钮退出大图浏览</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: 保存为常用筛选 (Save Preset Modal) */}
      {showSavePresetModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-5 space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">保存常用筛选预设</h3>
              <button onClick={() => setShowSavePresetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">预设名称</label>
              <input
                type="text"
                placeholder="请输入预设名称 (例如: 美妆图片全集)"
                value={presetNameInput}
                onChange={(e) => setPresetNameInput(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSavePreset}
                className="px-3.5 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 导出模态框 */}
      {showExportModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-5 space-y-4 relative text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">导出图片数据表</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              将根据当前选中的 <span className="font-bold text-purple-600">{filteredImages.length}</span> 条图片记录生成 Excel 数据清单，包含所有标签分类及作者记录。
            </p>

            <div className="flex justify-end gap-2 pt-2 font-bold">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  showToast("导出已完成，Excel表格开始下载");
                }}
                className="px-3.5 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                立即导出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
