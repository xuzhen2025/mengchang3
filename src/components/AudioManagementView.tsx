import React, { useState, useEffect } from "react";
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
    author: "致上致上致上",
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

  // Modals inside detail
  const [showEditCategoryModal, setShowEditCategoryModal] = useState<boolean>(false);
  const [editPrimaryCat, setEditPrimaryCat] = useState<string>("");
  const [editSecondaryCat, setEditSecondaryCat] = useState<string>("");

  const [showAddPublicTagModal, setShowAddPublicTagModal] = useState<boolean>(false);
  const [newPublicTagInput, setNewPublicTagInput] = useState<string>("");

  const [showAddPersonalTagModal, setShowAddPersonalTagModal] = useState<boolean>(false);
  const [newPersonalTagInput, setNewPersonalTagInput] = useState<string>("");

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
    setEditPrimaryCat(item.primaryCategory || "美妆护肤");
    setEditSecondaryCat(item.secondaryCategory || "xx面膜");
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

  // Select all on current page
  const handleSelectPage = () => {
    const pageIds = filteredAudios.map((a) => a.id);
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
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3 text-xs text-slate-600">
        
        {/* Row 1: 主类目 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 font-medium shrink-0 w-16">主 类 目:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {mainCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMainCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedMainCategory === cat
                      ? "text-purple-600 font-bold bg-purple-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 cursor-pointer focus:outline-none text-xs">
              <option value="">选择常用筛选预设</option>
              <option value="preset-1">音频速查预设1</option>
              <option value="preset-2">高下载口播旁白</option>
            </select>
            <button
              onClick={() => showToast("常用筛选预设已保存")}
              className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-lg cursor-pointer transition-colors"
            >
              保存
            </button>
          </div>
        </div>

        {/* Row 2: 一级分类 */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
          <div className="flex items-start gap-3 flex-1 flex-wrap">
            <span className="text-slate-400 font-medium shrink-0 w-16 pt-1">一级分类:</span>
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {(showMorePrimary ? primaryCategories : primaryCategories.slice(0, 14)).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPrimaryCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedPrimaryCategory === cat
                      ? "text-purple-600 font-bold bg-purple-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowMorePrimary(!showMorePrimary)}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-0.5 shrink-0 pt-1 cursor-pointer"
          >
            <span>{showMorePrimary ? "收起" : "更多"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMorePrimary ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Row 3: 二级分类 */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-400 font-medium shrink-0 w-16">二级分类:</span>
          <div className="relative w-28 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索分类"
              value={searchCategoryKeyword}
              onChange={(e) => setSearchCategoryKeyword(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-400 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {secondaryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSecondaryCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedSecondaryCategory === cat
                    ? "text-purple-600 font-bold bg-purple-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: 公共标签 */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-400 font-medium shrink-0 w-16">公共标签:</span>
          <div className="relative w-28 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索标签"
              value={searchPublicTagKeyword}
              onChange={(e) => setSearchPublicTagKeyword(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-400 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {publicTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedPublicTag(selectedPublicTag === tag ? "全部" : tag)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedPublicTag === tag
                    ? "text-purple-600 font-bold bg-purple-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tag}
              </button>
            ))}
            <button
              onClick={() => setSelectedPublicTag("全部")}
              className="text-slate-400 hover:text-slate-600 underline ml-2 cursor-pointer"
            >
              重置公共标签
            </button>
          </div>
        </div>

        {/* Row 5: 个人标签 */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100 flex-wrap">
          <span className="text-slate-400 font-medium shrink-0 w-16">个人标签:</span>
          <div className="relative w-28 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索标签"
              value={searchPersonalTagKeyword}
              onChange={(e) => setSearchPersonalTagKeyword(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-400 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {personalTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedPersonalTag(tag)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedPersonalTag === tag
                    ? "bg-[#7C3AED] text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
            <button
              onClick={() => setSelectedPersonalTag("全部")}
              className="text-slate-400 hover:text-slate-600 underline ml-2 cursor-pointer"
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
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium shrink-0">高级搜索:</span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium cursor-pointer focus:outline-none"
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
              className="border border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100 font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
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
              className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              重置
            </button>
            <button
              onClick={() => showToast(`已成功导出 ${filteredAudios.length} 条音频资源数据`)}
              className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-colors"
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
                            onClick={(e) => openDetailModal(item, e)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`已归档音频 [${item.title}]`);
                            }}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="归档"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleStar(item.id, e)}
                            className={`p-1 hover:bg-slate-100 rounded-lg transition-colors ${
                              item.starred ? "text-amber-500 fill-amber-500" : "text-slate-400"
                            }`}
                            title="收藏"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
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
      {/* AUDIO DETAIL MODAL (音频详情) - MATCHES USER REFERENCE SCREENSHOT EXACTLY */}
      {/* ========================================================================= */}
      {detailAudioItem && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4 relative">
            
            {/* Top Bar: ID Badge & Close Button */}
            <div className="flex items-center justify-between">
              <span className="bg-white border border-slate-200/80 text-slate-500 font-mono text-xs px-2.5 py-1 rounded-md shadow-2xs">
                ID: 37923662
              </span>
              <button
                onClick={() => {
                  setDetailAudioItem(null);
                  setDetailIsPlaying(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Main Info Card (Exact match of reference screenshot top card) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              
              {/* Row 1: Author Info & Right Action Buttons */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: Avatar, Author, Group & Time */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {detailAudioItem.author} / 管理组 / 管理部
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5">
                      发布时间: 2025-04-24 14:43:53
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons (Exact Match to Screenshot) */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => showToast(`已开始下载: ${detailAudioItem.title}.mp3`)}
                    className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    下载
                  </button>
                  <button
                    onClick={() => showToast(`已复制 [${detailAudioItem.title}] 到剪映`)}
                    className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    复制到剪映
                  </button>

                  <button
                    onClick={() => showToast(`已归档音频: ${detailAudioItem.title}`)}
                    className="w-9 h-9 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    title="归档"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      toggleStar(detailAudioItem.id, e);
                      showToast(detailAudioItem.starred ? "已取消收藏" : "已加入收藏");
                    }}
                    className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                      detailAudioItem.starred
                        ? "border-amber-300 bg-amber-50 text-amber-500 fill-amber-500"
                        : "border-slate-200 hover:bg-slate-50 text-slate-500"
                    }`}
                    title="收藏"
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => showToast("已复制在线分享链接")}
                    className="w-9 h-9 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    title="分享"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* 更多操作 Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDetailMoreMenu(!showDetailMoreMenu)}
                      className="border border-purple-300 text-purple-600 hover:bg-purple-50 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>更多操作</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {showDetailMoreMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            setShowDetailMoreMenu(false);
                            showToast("已推送至剪映工作台");
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700"
                        >
                          推送至团队剪辑
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailMoreMenu(false);
                            setShowEditCategoryModal(true);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700"
                        >
                          修改所属分类
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailMoreMenu(false);
                            showToast("已向发送提醒通知");
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700"
                        >
                          发送消息提醒
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => {
                            setShowDetailMoreMenu(false);
                            setAudioList((prev) => prev.filter((a) => a.id !== detailAudioItem.id));
                            setDetailAudioItem(null);
                            showToast("已放入回收站");
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600"
                        >
                          放入回收站
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Category Line */}
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-rose-50 text-rose-500 font-bold px-2.5 py-0.5 rounded text-xs">
                  {detailAudioItem.badge || "音频"}
                </span>
                <span className="font-bold text-slate-800">
                  {editPrimaryCat || "美妆护肤"} / {editSecondaryCat || "xx面膜"}
                </span>
                <button
                  onClick={() => setShowEditCategoryModal(true)}
                  className="p-1 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                  title="修改分类"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 3: 公共标签 Line */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-slate-400 font-medium shrink-0 w-16">公共标签:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {detailAudioItem.publicTags && detailAudioItem.publicTags.length > 0 ? (
                    detailAudioItem.publicTags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                        场景: {tag}
                      </span>
                    ))
                  ) : (
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                      场景: 医院
                    </span>
                  )}
                  <button
                    onClick={() => setShowAddPublicTagModal(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer transition-colors"
                  >
                    + 添加公共标签
                  </button>
                </div>
              </div>

              {/* Row 4: 个人标签 Line */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-slate-400 font-medium shrink-0 w-16">个人标签:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {detailAudioItem.personalTag && detailAudioItem.personalTag !== "无个人标签" && (
                    <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg font-medium">
                      {detailAudioItem.personalTag}
                    </span>
                  )}
                  <button
                    onClick={() => setShowAddPersonalTagModal(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer transition-colors"
                  >
                    + 添加个人标签
                  </button>
                </div>
              </div>

              {/* Row 5: 音频说明 */}
              <div className="text-xs pt-1">
                <span className="text-slate-400 font-medium">音频说明</span>
              </div>

            </div>

            {/* Bottom Section: Audio Title & Player Control Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              
              {/* Title */}
              <h3 className="font-bold text-slate-900 text-base">
                {detailAudioItem.title}
              </h3>

              {/* Interactive Player Controls */}
              <div className="flex items-center gap-4">
                
                {/* Purple Circular Play/Pause Button */}
                <button
                  onClick={() => setDetailIsPlaying(!detailIsPlaying)}
                  className={`w-10 h-10 rounded-full border-2 border-purple-600 flex items-center justify-center text-purple-600 hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-xs ${
                    detailIsPlaying ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
                  }`}
                >
                  {detailIsPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Current Time */}
                <span className="text-xs font-mono font-medium text-slate-600 shrink-0 min-w-[38px]">
                  {formatSeconds(detailCurrentTime)}
                </span>

                {/* Scrubber Range Input */}
                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={detailAudioItem.duration}
                    value={detailCurrentTime}
                    onChange={(e) => setDetailCurrentTime(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <span className="text-xs font-mono font-medium text-slate-600 shrink-0 min-w-[38px]">
                  {detailAudioItem.durationFormatted}
                </span>

                {/* Mute Button */}
                <button
                  onClick={() => setDetailIsMuted(!detailIsMuted)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                  title={detailIsMuted ? "取消静音" : "静音"}
                >
                  {detailIsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Playback Speed Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {detailSpeed}
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-28 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs font-medium">
                      {["0.5x倍速", "0.75x倍速", "1x倍速", "1.25x倍速", "1.5x倍速", "2x倍速"].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setDetailSpeed(speed);
                            setShowSpeedMenu(false);
                            showToast(`倍速设置为: ${speed}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-purple-50 cursor-pointer ${
                            detailSpeed === speed ? "text-purple-600 font-bold bg-purple-50/50" : "text-slate-700"
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL: Modify Category inside Detail */}
      {showEditCategoryModal && detailAudioItem && (
        <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">修改音频分类</h3>
              <button onClick={() => setShowEditCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">一级分类</label>
                <input
                  type="text"
                  value={editPrimaryCat}
                  onChange={(e) => setEditPrimaryCat(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">二级分类</label>
                <input
                  type="text"
                  value={editSecondaryCat}
                  onChange={(e) => setEditSecondaryCat(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditCategoryModal(false)}
                className="border border-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowEditCategoryModal(false);
                  showToast("音频分类更新成功");
                }}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Public Tag inside Detail */}
      {showAddPublicTagModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">添加公共标签</h3>
              <button onClick={() => setShowAddPublicTagModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <label className="block text-slate-600 font-medium">标签名称</label>
              <input
                type="text"
                placeholder="例如: 场景、口播、爆款BGM"
                value={newPublicTagInput}
                onChange={(e) => setNewPublicTagInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddPublicTagModal(false)}
                className="border border-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (newPublicTagInput.trim() && detailAudioItem) {
                    detailAudioItem.publicTags = [...(detailAudioItem.publicTags || []), newPublicTagInput.trim()];
                  }
                  setShowAddPublicTagModal(false);
                  setNewPublicTagInput("");
                  showToast("已新增公共标签");
                }}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Personal Tag inside Detail */}
      {showAddPersonalTagModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">添加个人标签</h3>
              <button onClick={() => setShowAddPersonalTagModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <label className="block text-slate-600 font-medium">标签名称</label>
              <input
                type="text"
                placeholder="例如: Zs测试一、重要剪辑素材"
                value={newPersonalTagInput}
                onChange={(e) => setNewPersonalTagInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddPersonalTagModal(false)}
                className="border border-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (newPersonalTagInput.trim() && detailAudioItem) {
                    detailAudioItem.personalTag = newPersonalTagInput.trim();
                  }
                  setShowAddPersonalTagModal(false);
                  setNewPersonalTagInput("");
                  showToast("已更新个人标签");
                }}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs"
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
