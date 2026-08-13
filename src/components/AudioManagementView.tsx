import React, { useState, useEffect } from "react";
import { PublicTagFilter } from "./PublicTagFilter";
import AudioDetailView from "./AudioDetailView";
import { Pagination } from "./Pagination";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  Download,
  Edit2,
  Edit3,
  Copy,
  Plus,
  Check,
  Trash2,
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  MoreHorizontal,
  Send,
  MessageSquare,
  BarChart2,
  Archive,
  Layers,
  CheckSquare,
  Square,
  User
} from "lucide-react";

const PUBLIC_TAG_GROUPS: Record<string, string[]> = {
  "模特": ["张三", "里斯", "溜溜", "王五", "娃娃", "事事", "琪琪", "久久", "苏逸飞", "沈知许"],
  "场景": ["模特", "室内展厅", "户外公园", "直播间", "办公室", "家庭生活", "街拍"],
  "合作达人": ["美妆小达人", "生活测评官", "种草狂魔", "时尚指南"],
  "脚本类型": ["纯混剪", "痛点剧本", "口播测评", "拆箱体验"],
  "创新点": ["视觉冲击", "强勾子", "对比反转", "开箱震撼"],
  "编导姓名": ["张编", "王编", "李编", "刘编"]
};

const PERSONAL_TAG_GROUPS: Record<string, string[]> = {
  "Zs测试一": ["Zs测试一", "个人测试标签2", "重点剪辑音频"],
  "我的常用": ["高质量播音", "短视频配音", "爆款BGM"],
  "团队协作": ["需重新剪辑", "待试听核对", "已审核通过"]
};

export interface AudioItem {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "00:52"
  badge: string;
  downloads: number;
  author: string;
  time: string;
  primaryCategory: string;
  secondaryCategory: string;
  publicTags: string[];
  personalTag: string;
  size: string;
  starred?: boolean;
}

interface AudioManagementViewProps {
  onTriggerTask?: (type: any, name: string, inputFiles: string[], cost: number) => void;
  onDetailStateChange?: (isDetail: boolean) => void;
}

const INITIAL_AUDIO_LIST: AudioItem[] = [
  {
    id: "aud-1",
    title: "现在洁牙",
    subtitle: "医院",
    duration: 52,
    durationFormatted: "00:52",
    badge: "音频",
    downloads: 1,
    author: "月儿弯弯",
    time: "25 天前",
    primaryCategory: "美容美体",
    secondaryCategory: "医疗机构",
    publicTags: ["场景", "合作达人"],
    personalTag: "有个人标签",
    size: "1.2 MB",
    starred: true
  },
  {
    id: "aud-2",
    title: "危害",
    subtitle: "王五",
    duration: 62,
    durationFormatted: "01:02",
    badge: "音频",
    downloads: 1,
    author: "月儿弯弯",
    time: "25 天前",
    primaryCategory: "美容美体",
    secondaryCategory: "警示解说",
    publicTags: ["创新点"],
    personalTag: "无个人标签",
    size: "1.4 MB"
  },
  {
    id: "aud-3",
    title: "洗牙4.7",
    subtitle: "王五",
    duration: 12,
    durationFormatted: "00:12",
    badge: "音频",
    downloads: 0,
    author: "月儿弯弯",
    time: "25 天前",
    primaryCategory: "美容美体",
    secondaryCategory: "短对话",
    publicTags: ["模特"],
    personalTag: "Zs测试一",
    size: "0.4 MB"
  },
  {
    id: "aud-4",
    title: "4月7日 (1)",
    subtitle: "里斯 | 王五",
    duration: 6,
    durationFormatted: "00:06",
    badge: "音频",
    downloads: 0,
    author: "月儿弯弯",
    time: "25 天前",
    primaryCategory: "个人护理",
    secondaryCategory: "口播切片",
    publicTags: ["合作达人"],
    personalTag: "Zs测试二",
    size: "0.2 MB"
  },
  {
    id: "aud-5",
    title: "爆款防脱洗发水口播旁白",
    subtitle: "美妆 | 旁白解说",
    duration: 45,
    durationFormatted: "00:45",
    badge: "音频",
    downloads: 5,
    author: "致上互娱",
    time: "1小时前",
    primaryCategory: "美妆护肤",
    secondaryCategory: "洗护系列",
    publicTags: ["模特", "创新点"],
    personalTag: "有个人标签",
    size: "1.1 MB",
    starred: true
  },
  {
    id: "aud-6",
    title: "欢快电商带货节奏BGM",
    subtitle: "BGM | 电商促销",
    duration: 90,
    durationFormatted: "01:30",
    badge: "音频",
    downloads: 12,
    author: "汤小真",
    time: "3天前",
    primaryCategory: "休闲零食",
    secondaryCategory: "促销大促",
    publicTags: ["场景"],
    personalTag: "测试分享标签",
    size: "2.5 MB"
  },
  {
    id: "aud-7",
    title: "草本初色内衣舒适感音效",
    subtitle: "柔和 | 品牌语",
    duration: 28,
    durationFormatted: "00:28",
    badge: "音频",
    downloads: 8,
    author: "李剪辑",
    time: "5天前",
    primaryCategory: "服饰内衣",
    secondaryCategory: "品牌调性",
    publicTags: ["模特", "场景"],
    personalTag: "有个人标签",
    size: "0.8 MB"
  },
  {
    id: "aud-8",
    title: "搞笑短视频转场音效-拔塞子",
    subtitle: "音效 | 短视频转场",
    duration: 3,
    durationFormatted: "00:03",
    badge: "音频",
    downloads: 19,
    author: "王五",
    time: "7天前",
    primaryCategory: "家居优选",
    secondaryCategory: "趣味音效",
    publicTags: ["创新点"],
    personalTag: "无个人标签",
    size: "0.1 MB"
  }
];

export default function AudioManagementView({ onTriggerTask, onDetailStateChange }: AudioManagementViewProps) {
  // Category states
  const [selectedMainCategory, setSelectedMainCategory] = useState("全部");
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState("全部");
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState("全部");
  const [selectedPublicTag, setSelectedPublicTag] = useState("全部");
  const [selectedPersonalTag, setSelectedPersonalTag] = useState("全部");
  const [showMorePrimary, setShowMorePrimary] = useState(false);

  // Search & Filters
  const [sortBy, setSortBy] = useState("最新发布");
  const [searchCategoryKeyword, setSearchCategoryKeyword] = useState("");
  const [searchPublicTagKeyword, setSearchPublicTagKeyword] = useState("");
  const [searchPersonalTagKeyword, setSearchPersonalTagKeyword] = useState("");
  const [searchAuthorKeyword, setSearchAuthorKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // View Mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTimeMap, setCurrentTimeMap] = useState<Record<string, number>>({});

  // Dropdown States
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);
  const [showCopyJianyingMenu, setShowCopyJianyingMenu] = useState(false);
  const [showModifyMenu, setShowModifyMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  // Audio items list
  const [audioList, setAudioList] = useState<AudioItem[]>(INITIAL_AUDIO_LIST);

  // Audio Detail Modal State
  const [detailAudioItem, setDetailAudioItem] = useState<AudioItem | null>(null);

  React.useEffect(() => {
    onDetailStateChange?.(!!detailAudioItem);
  }, [detailAudioItem, onDetailStateChange]);
  const [detailCurrentTime, setDetailCurrentTime] = useState<number>(0);
  const [detailIsPlaying, setDetailIsPlaying] = useState<boolean>(false);
  const [detailSpeed, setDetailSpeed] = useState<string>("1x倍速");
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [detailIsMuted, setDetailIsMuted] = useState<boolean>(false);
  const [showDetailMoreMenu, setShowDetailMoreMenu] = useState<boolean>(false);

  // Modals & detail fields matching FinishedVideoDetailModal pattern
  const [audioCategoryText, setAudioCategoryText] = useState<string>("美容美体 / 短对话");
  const [showModifyCategoryModal, setShowModifyCategoryModal] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string>("宠物食品");
  const [tempCategoryPath, setTempCategoryPath] = useState<string>("");

  const [audioTitleText, setAudioTitleText] = useState<string>("");
  const [showModifyTitleModal, setShowModifyTitleModal] = useState<boolean>(false);
  const [tempTitleText, setTempTitleText] = useState<string>("");

  const [audioPublicTags, setAudioPublicTags] = useState<string[]>(["场景: 模特"]);
  const [showPublicTagModal, setShowPublicTagModal] = useState<boolean>(false);
  const [publicGroupSearch, setPublicGroupSearch] = useState<string>("");
  const [publicSubSearch, setPublicSubSearch] = useState<string>("");
  const [selectedPublicGroupKey, setSelectedPublicGroupKey] = useState<string>("模特");
  const [tempAddedPublicTags, setTempAddedPublicTags] = useState<string[]>([]);

  const [audioPersonalTags, setAudioPersonalTags] = useState<string[]>(["Zs测试一"]);
  const [showPersonalTagModal, setShowPersonalTagModal] = useState<boolean>(false);
  const [personalGroupSearch, setPersonalGroupSearch] = useState<string>("");
  const [personalSubSearch, setPersonalSubSearch] = useState<string>("");
  const [selectedPersonalGroupKey, setSelectedPersonalGroupKey] = useState<string>("Zs测试一");
  const [tempAddedPersonalTags, setTempAddedPersonalTags] = useState<string[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openDetailModal = (item: AudioItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDetailAudioItem(item);
    setDetailCurrentTime(currentTimeMap[item.id] || 0);
    setDetailIsPlaying(playingId === item.id);
    const cat = `${item.primaryCategory || "美容美体"} / ${item.secondaryCategory || "短对话"}`;
    setAudioCategoryText(cat);
    setAudioTitleText(item.title);
    setAudioPublicTags(item.publicTags && item.publicTags.length > 0 ? item.publicTags : ["场景: 模特"]);
    setAudioPersonalTags(item.personalTag && item.personalTag !== "无个人标签" ? [item.personalTag] : ["Zs测试一"]);
    setShowDetailMoreMenu(false);
    setShowSpeedMenu(false);
  };

  // Detail Audio Timer Loop
  useEffect(() => {
    if (!detailIsPlaying || !detailAudioItem) return;

    const interval = setInterval(() => {
      setDetailCurrentTime((prev) => {
        if (prev >= detailAudioItem.duration) {
          setDetailIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [detailIsPlaying, detailAudioItem]);

  // Audio Timer loop
  useEffect(() => {
    if (!playingId) return;

    const interval = setInterval(() => {
      setCurrentTimeMap((prev) => {
        const item = audioList.find((a) => a.id === playingId);
        const duration = item ? item.duration : 60;
        const current = prev[playingId] || 0;
        if (current >= duration) {
          setPlayingId(null);
          return { ...prev, [playingId]: 0 };
        }
        return { ...prev, [playingId]: current + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playingId, audioList]);

  // Toggle audio playback
  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const handleSeek = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTimeMap((prev) => ({ ...prev, [id]: val }));
  };

  // Filter logic
  const filteredAudios = audioList.filter((item) => {
    if (selectedMainCategory !== "全部" && item.primaryCategory !== selectedMainCategory) {
      // rough match or custom logic
    }
    if (selectedPrimaryCategory !== "全部" && item.primaryCategory !== selectedPrimaryCategory) {
      return false;
    }
    if (selectedSecondaryCategory !== "全部" && item.secondaryCategory !== selectedSecondaryCategory) {
      return false;
    }
    if (selectedPublicTag !== "全部" && !item.publicTags.includes(selectedPublicTag)) {
      return false;
    }
    if (selectedPersonalTag !== "全部") {
      if (selectedPersonalTag === "无个人标签" && item.personalTag !== "无个人标签") return false;
      if (selectedPersonalTag === "有个人标签" && item.personalTag === "无个人标签") return false;
      if (selectedPersonalTag !== "无个人标签" && selectedPersonalTag !== "有个人标签" && item.personalTag !== selectedPersonalTag) {
        return false;
      }
    }
    if (searchAuthorKeyword && !item.author.toLowerCase().includes(searchAuthorKeyword.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Pagination calculations
  const totalCount = filteredAudios.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedAudios = filteredAudios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Select all on current page
  const handleSelectPage = () => {
    const pageIds = paginatedAudios.map((a) => a.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedIds, ...pageIds]));
      setSelectedIds(combined);
      setIsSelectionMode(true);
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      const next = selectedIds.filter((i) => i !== id);
      setSelectedIds(next);
      if (next.length === 0) {
        setIsSelectionMode(false);
      }
    } else {
      setSelectedIds([...selectedIds, id]);
      setIsSelectionMode(true);
    }
  };

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAudioList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item))
    );
    showToast("已更新收藏状态");
  };

  const mainCategories = ["全部", "美妆", "个护家清", "服饰内衣", "食品饮料", "母婴宠物", "图书教育", "智能家居"];

  const primaryCategories = [
    "全部", "美妆护肤", "彩妆香水", "宠物食品", "宠物用品", "婴童尿裤", 
    "奶粉辅食", "婴童用品", "孕妇用品", "传统滋补", "童装/童鞋", "休闲零食", 
    "图书", "饮料冲调", "学习用品", "粮油速食", "教育音像", "数字阅读", 
    "家庭清洁", "家电好货", "美容美体", "个人护理", "化妆工具", "家居优选"
  ];

  const secondaryCategories = ["全部", "猫粮", "狗粮", "口播切片", "促销大促", "品牌调性", "趣味音效"];

  const publicTags = ["模特", "场景", "合作达人", "创新点"];

  const personalTags = ["全部", "无个人标签", "有个人标签", "Zs测试一", "Zs测试二", "测试分享标签"];

  const isAllPageSelected = filteredAudios.length > 0 && filteredAudios.every((a) => selectedIds.includes(a.id));

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  if (detailAudioItem) {
    return (
      <AudioDetailView
        item={detailAudioItem}
        onClose={() => {
          setDetailAudioItem(null);
          setDetailIsPlaying(false);
        }}
        showToast={showToast}
        onDelete={(id) => setAudioList((prev) => prev.filter((a) => a.id !== id))}
      />
    );
  }

  return (
    <div className="flex-1 bg-slate-100/70 p-4 min-h-0 flex flex-col font-sans text-slate-800 overflow-y-auto space-y-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/80 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Cascading Filter Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3.5 text-xs text-slate-700">
        
        {/* Row 1: 主类目 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-900 font-bold shrink-0 w-20">主 类 目：</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {mainCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMainCategory(cat)}
                  className={`transition-colors cursor-pointer text-xs ${
                    selectedMainCategory === cat
                      ? "text-purple-600 font-bold bg-purple-50 px-2.5 py-1 rounded-md"
                      : "text-slate-600 hover:text-purple-600 font-normal px-2.5 py-1"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <select className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer">
              <option value="">选择常用筛选预设</option>
              <option value="preset-1">音频速查预设1</option>
              <option value="preset-2">高下载口播旁白</option>
            </select>
            <button
              onClick={() => showToast("常用筛选预设已保存")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3.5 py-1 rounded-lg font-bold shadow-xs cursor-pointer transition-colors"
            >
              保存
            </button>
          </div>
        </div>

        {/* Row 2: 一级分类 */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
          <div className="flex items-start gap-2 flex-1 flex-wrap">
            <span className="text-slate-900 font-bold shrink-0 w-20 pt-1">一级分类：</span>
            <div className="flex items-center gap-1 flex-wrap flex-1">
              {(showMorePrimary ? primaryCategories : primaryCategories.slice(0, 14)).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPrimaryCategory(cat)}
                  className={`transition-colors cursor-pointer text-xs ${
                    selectedPrimaryCategory === cat
                      ? "text-purple-600 font-bold bg-purple-50 px-2.5 py-1 rounded-md"
                      : "text-slate-600 hover:text-purple-600 font-normal px-2.5 py-1"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowMorePrimary(!showMorePrimary)}
            className="text-purple-600 hover:text-purple-700 font-bold text-xs flex items-center gap-0.5 shrink-0 pt-1 cursor-pointer hover:underline"
          >
            <span>{showMorePrimary ? "收起" : "更多"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMorePrimary ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Row 3: 二级分类 */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-900 font-bold shrink-0 w-20">二级分类：</span>
          <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 shrink-0 focus-within:border-purple-400 mr-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索分类"
              value={searchCategoryKeyword}
              onChange={(e) => setSearchCategoryKeyword(e.target.value)}
              className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {secondaryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSecondaryCategory(cat)}
                className={`transition-colors cursor-pointer text-xs ${
                  selectedSecondaryCategory === cat
                    ? "text-purple-600 font-bold bg-purple-50 px-2.5 py-1 rounded-md"
                    : "text-slate-600 hover:text-purple-600 font-normal px-2.5 py-1"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: 公共标签 */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-900 font-bold shrink-0 w-20">公共标签：</span>
          <PublicTagFilter
            selectedTag={selectedPublicTag}
            onSelectTag={(tag) => setSelectedPublicTag(tag)}
          />
        </div>

        {/* Row 5: 个人标签 */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-900 font-bold shrink-0 w-20">个人标签：</span>
          <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 shrink-0 focus-within:border-purple-400 mr-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索标签"
              value={searchPersonalTagKeyword}
              onChange={(e) => setSearchPersonalTagKeyword(e.target.value)}
              className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {personalTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedPersonalTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPersonalTag === tag
                    ? "bg-purple-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium"
                }`}
              >
                {tag}
              </button>
            ))}
            <button
              onClick={() => setSelectedPersonalTag("全部")}
              className="text-slate-400 hover:text-purple-600 text-xs ml-2 cursor-pointer font-normal underline"
            >
              重置个人标签
            </button>
            <button
              onClick={() => showToast("正在打开个人标签管理...")}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="编辑个人标签"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 6: 高级搜索与排序 */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold shrink-0 w-20">高级搜索：</span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-bold text-xs cursor-pointer focus:outline-none focus:border-purple-400"
              >
                <option value="最新发布">排序: 最新发布</option>
                <option value="最多下载">排序: 最多下载</option>
                <option value="时长降序">排序: 时长从长到短</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("已执行高级筛选")}
              className="border border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100 font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>筛选</span>
            </button>
            <button
              onClick={() => {
                setSelectedMainCategory("全部");
                setSelectedPrimaryCategory("全部");
                setSelectedSecondaryCategory("全部");
                setSelectedPublicTag("全部");
                setSelectedPersonalTag("全部");
                setSearchAuthorKeyword("");
                showToast("已重置所有筛选");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
            >
              重置
            </button>
            <button
              onClick={() => showToast(`已成功导出 ${filteredAudios.length} 条音频资源数据`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
            >
              导出
            </button>
          </div>
        </div>

      </div>

      {/* Sub Toolbar: Selection mode or Batch Action Toolbar (Matches Screenshot 3 & 4) */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between flex-wrap gap-2 text-xs">
        
        {isSelectionMode && selectedIds.length > 0 ? (
          /* Mode B: Active Batch Toolbar (Screenshot 4) */
          <div className="flex items-center gap-2 flex-wrap w-full">
            <button
              onClick={() => {
                setSelectedIds([]);
                setIsSelectionMode(false);
              }}
              className="border border-purple-300 text-purple-600 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              取消选择
            </button>

            <button
              onClick={handleSelectPage}
              className="border border-purple-600 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-purple-600" />
              <span>选中本页</span>
            </button>

            <span className="text-slate-600 font-bold px-2">
              已选: <strong className="text-purple-600 text-sm font-extrabold">{selectedIds.length}</strong> 个
            </span>

            <button
              onClick={() => showToast(`已打包下载 ${selectedIds.length} 个音频文件`)}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors shadow-2xs"
            >
              下载
            </button>

            {/* 复制到剪映 下拉 */}
            <div className="relative">
              <button
                onClick={() => setShowCopyJianyingMenu(!showCopyJianyingMenu)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>复制到剪映</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showCopyJianyingMenu && (
                <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                  <button
                    onClick={() => {
                      setShowCopyJianyingMenu(false);
                      showToast("已成功复制草稿轨道链接到剪映");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-slate-700 font-medium"
                  >
                    复制音频轨道草稿
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => showToast(`已将 ${selectedIds.length} 个音频添加至工作台`)}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors shadow-2xs"
            >
              添加到工作台
            </button>

            {/* 修改 下拉 */}
            <div className="relative">
              <button
                onClick={() => setShowModifyMenu(!showModifyMenu)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>修改</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showModifyMenu && (
                <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                  <button
                    onClick={() => {
                      setShowModifyMenu(false);
                      showToast("批量修改作者完成");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-slate-700"
                  >
                    修改归属作者
                  </button>
                  <button
                    onClick={() => {
                      setShowModifyMenu(false);
                      showToast("批量修改分类完成");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-slate-700"
                  >
                    修改所属分类
                  </button>
                </div>
              )}
            </div>

            {/* 添加标签 下拉 */}
            <div className="relative">
              <button
                onClick={() => setShowTagMenu(!showTagMenu)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>添加标签</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showTagMenu && (
                <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                  <button
                    onClick={() => {
                      setShowTagMenu(false);
                      showToast("批量打标签 [高转口播] 完成");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-slate-700"
                  >
                    + 爆款BGM
                  </button>
                  <button
                    onClick={() => {
                      setShowTagMenu(false);
                      showToast("批量打标签 [高转化旁白] 完成");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-slate-700"
                  >
                    + 推荐音频
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => showToast("已复制音频在线分享链接")}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors shadow-2xs"
            >
              复制链接
            </button>

            {/* 操作 下拉 (投放数据分析, 发送消息提醒, 放入回收站) */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowMoreActionsMenu(!showMoreActionsMenu)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>操作</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showMoreActionsMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowMoreActionsMenu(false);
                      showToast("正在分析选中音频投放数据...");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 font-medium flex items-center gap-2"
                  >
                    <BarChart2 className="w-4 h-4 text-purple-600" />
                    <span>投放数据分析</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreActionsMenu(false);
                      showToast("已向团队群发消息提醒");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>发送消息提醒</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      setShowMoreActionsMenu(false);
                      setAudioList((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
                      setSelectedIds([]);
                      setIsSelectionMode(false);
                      showToast("已将选中音频放入回收站 ⓘ");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>放入回收站 ⓘ</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Mode A: Default toolbar (Screenshot 1 & 3) */
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSelectionMode(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shadow-2xs"
              >
                选择
              </button>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={isAllPageSelected}
                  onChange={handleSelectPage}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span>选中本页</span>
              </label>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* 作者 Filter */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400">作者:</span>
                <input
                  type="text"
                  placeholder="请选择(支持输入搜索)"
                  value={searchAuthorKeyword}
                  onChange={(e) => setSearchAuthorKeyword(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 w-44 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* 上传时间 Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">上传时间:</span>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent text-slate-700 focus:outline-none text-xs"
                  />
                  <span className="text-slate-400 font-bold">至</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent text-slate-700 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-purple-600 shadow-2xs font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="宫格网图"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-white text-purple-600 shadow-2xs font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="列表试图"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Audio Cards Grid List (Exact layout of Screenshot 2, 3 & 4) */}
      {filteredAudios.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <Music className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-bold text-sm">暂无符合条件的音频资源</p>
          <p className="text-slate-400 text-xs">尝试重置筛选或上传新的音频文件</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredAudios.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isPlaying = playingId === item.id;
            const currentSec = currentTimeMap[item.id] || 0;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isSelectionMode) toggleSelectItem(item.id);
                }}
                className={`bg-white rounded-2xl border transition-all duration-150 relative overflow-hidden group flex flex-col justify-between p-3.5 ${
                  isSelected
                    ? "border-purple-600 ring-2 ring-purple-500/20 shadow-md bg-purple-50/10"
                    : "border-slate-200/90 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                {/* Checkbox for Selection Mode */}
                {isSelectionMode && (
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Top Section: Title & Download Count / Hover Actions */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={(e) => openDetailModal(item, e)}
                      className="font-bold text-slate-900 text-sm tracking-tight truncate flex-1 hover:text-purple-600 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Download count / Action buttons (Screenshot 2 & 3) */}
                    <div className="flex items-center gap-1 shrink-0 text-slate-400 text-xs">
                      {!isSelectionMode && (
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`正在下载: ${item.title}.mp3`);
                            }}
                            className="p-1 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-lg transition-colors shadow-2xs"
                            title="下载"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-0.5 text-slate-400 font-medium group-hover:hidden">
                        <Download className="w-3 h-3" />
                        <span>{item.downloads}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle / Tags line */}
                  <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                    {item.subtitle}
                  </p>
                </div>

                {/* Middle Section: Interactive Audio Player (Exact look of Screenshot 2 & 3) */}
                <div className="py-3 space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Purple Circular Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(item.id);
                      }}
                      className={`w-9 h-9 rounded-full border-2 border-purple-600 flex items-center justify-center text-purple-600 hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-xs ${
                        isPlaying ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
                      }`}
                      title={isPlaying ? "暂停" : "播放"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Progress Scrubber Bar */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="relative flex-1 flex items-center">
                        <input
                          type="range"
                          min={0}
                          max={item.duration}
                          value={currentSec}
                          onChange={(e) => handleSeek(item.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus:outline-none"
                        />
                      </div>

                      {/* Duration Text */}
                      <span className="text-xs font-mono font-medium text-slate-600 shrink-0 min-w-[36px] text-right">
                        {isPlaying ? formatSeconds(currentSec) : item.durationFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Author Avatar & Relative Time (Exact layout of Screenshot 2 & 3) */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold shrink-0">
                      {item.author.slice(0, 1)}
                    </div>
                    <span className="truncate">{item.author}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">{item.time}</span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 font-bold">
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectPage}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">音频标题与类型</th>
                <th className="p-3.5">试听播放</th>
                <th className="p-3.5">时长</th>
                <th className="p-3.5">作者</th>
                <th className="p-3.5">下载数</th>
                <th className="p-3.5">上传时间</th>
                <th className="p-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAudios.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isPlaying = playingId === item.id;
                const currentSec = currentTimeMap[item.id] || 0;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-purple-50/30" : ""}`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                      </div>
                    </td>
                    <td className="p-3.5 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlay(item.id)}
                          className={`w-7 h-7 rounded-full border-2 border-purple-600 flex items-center justify-center text-purple-600 cursor-pointer ${
                            isPlaying ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={item.duration}
                          value={currentSec}
                          onChange={(e) => handleSeek(item.id, e)}
                          className="w-28 accent-purple-600 h-1 bg-slate-200 rounded"
                        />
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">{item.durationFormatted}</td>
                    <td className="p-3.5">{item.author}</td>
                    <td className="p-3.5">{item.downloads}</td>
                    <td className="p-3.5 text-slate-400">{item.time}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => openDetailModal(item, e)}
                          className="text-slate-600 hover:text-purple-600 font-bold px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => showToast(`已开始下载: ${item.title}.mp3`)}
                          className="text-purple-600 hover:text-purple-700 font-bold px-2 py-1 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
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

      {/* ========================================================================= */}
      {/* MODALS (修改分类/修改标题/公共标签/个人标签 in List View if needed) */}
      {/* ========================================================================= */}

      {/* MODAL 1: 修改分类 Modal (Matching FinishedVideoDetailModal) */}
      {showModifyCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改分类</h3>
              </div>
              <button
                onClick={() => setShowModifyCategoryModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">当前选择路径</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  {tempCategoryPath || audioCategoryText}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">选择分类层级</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedPrimaryCat}
                    onChange={(e) => {
                      setSelectedPrimaryCat(e.target.value);
                      setTempCategoryPath(`${e.target.value} / 默认二级分类`);
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="美容美体">美容美体</option>
                    <option value="宠物食品">宠物食品</option>
                    <option value="美妆护肤">美妆护肤</option>
                    <option value="数码家电">数码家电</option>
                  </select>
                  <select
                    onChange={(e) => setTempCategoryPath(`${selectedPrimaryCat} / ${e.target.value}`)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="短对话">短对话</option>
                    <option value="旁白解说">旁白解说</option>
                    <option value="情绪配音">情绪配音</option>
                    <option value="爆款BGM">爆款BGM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowModifyCategoryModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAudioCategoryText(tempCategoryPath || audioCategoryText);
                  showToast("✅ 已同步音频分类");
                  setShowModifyCategoryModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 编辑标题 Modal (Matching FinishedVideoDetailModal) */}
      {showModifyTitleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改标题</h3>
              </div>
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">音频标题</label>
                <input
                  type="text"
                  value={tempTitleText}
                  onChange={(e) => setTempTitleText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                  placeholder="请输入音频标题"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempTitleText.trim()) {
                    setAudioTitleText(tempTitleText.trim());
                    showToast("✅ 已更新音频标题");
                  }
                  setShowModifyTitleModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 关联公共标签 Modal (Matching FinishedVideoDetailModal 3-column layout) */}
      {showPublicTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">关联公共标签</h3>
              </div>
              <button
                onClick={() => setShowPublicTagModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3.5 h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>标签组</span>
                    <button
                      onClick={() => showToast("已刷新标签组")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      刷新
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      value={publicGroupSearch}
                      onChange={(e) => setPublicGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(PUBLIC_TAG_GROUPS)
                        .filter(g => g.includes(publicGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPublicGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPublicGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>子标签</span>
                    <button
                      onClick={() => showToast("弹出添加子标签弹窗")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      + 添加子标签
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      value={publicSubSearch}
                      onChange={(e) => setPublicSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(PUBLIC_TAG_GROUPS[selectedPublicGroupKey] || [])
                        .filter(sub => sub.includes(publicSubSearch.trim()))
                        .map((subTag) => {
                          const isChecked = tempAddedPublicTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== subTag));
                                  } else {
                                    setTempAddedPublicTags([...tempAddedPublicTags, subTag]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>已添加标签</span>
                    <button
                      onClick={() => showToast("已保存当前选择为预设")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      保存为预设
                    </button>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPublicTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未添加标签
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {tempAddedPublicTags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-slate-50 border border-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium hover:bg-slate-100/80 transition-colors"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== tag))}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPublicTagModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAudioPublicTags([...tempAddedPublicTags]);
                  showToast("✅ 已同步公共标签设置");
                  setShowPublicTagModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 关联个人标签 Modal (Matching FinishedVideoDetailModal 3-column layout) */}
      {showPersonalTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">关联个人标签</h3>
              </div>
              <button
                onClick={() => setShowPersonalTagModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <button
                  onClick={() => showToast("进入编辑个人标签模式")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  编辑个人标签
                </button>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-3 gap-3.5 h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    标签组
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      value={personalGroupSearch}
                      onChange={(e) => setPersonalGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(PERSONAL_TAG_GROUPS)
                        .filter(g => g.includes(personalGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPersonalGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPersonalGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    子标签
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      value={personalSubSearch}
                      onChange={(e) => setPersonalSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(PERSONAL_TAG_GROUPS[selectedPersonalGroupKey] || [])
                        .filter(sub => sub.includes(personalSubSearch.trim()))
                        .map((subTag) => {
                          const isChecked = tempAddedPersonalTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== subTag));
                                  } else {
                                    setTempAddedPersonalTags([...tempAddedPersonalTags, subTag]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    已添加标签
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPersonalTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未添加标签
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tempAddedPersonalTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== tag))}
                              className="text-purple-400 hover:text-rose-500 ml-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPersonalTagModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAudioPersonalTags([...tempAddedPersonalTags]);
                  showToast("✅ 已同步个人标签设置");
                  setShowPersonalTagModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
