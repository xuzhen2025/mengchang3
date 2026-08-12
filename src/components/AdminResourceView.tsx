import React, { useState } from "react";
import { Search, ChevronDown, Play, Eye, Trash2, X, Sparkles, Film, Volume2, FileText, Headphones, Check, RotateCcw } from "lucide-react";
import { Pagination } from "./Pagination";
import FinishedVideoDetailModal, { FinishedVideo } from "./FinishedVideoDetailModal";
import ImageDetailView, { ImageItem } from "./ImageDetailView";
import AudioDetailView, { AudioItem } from "./AudioDetailView";
import ScriptDetailPage, { ScriptItem } from "./ScriptDetailPage";

export interface AdminResourceItem {
  id: string;
  name: string;
  cover: string;
  videoUrl?: string;
  tags: string[];
  category: string;
  company: string;
  uploadTime: string;
  tabType: "成片" | "素材" | "图片" | "音频" | "脚本" | "回收站";
  originalTabType?: "成片" | "素材" | "图片" | "音频" | "脚本";
  fileSize?: string;
  duration?: string;
  scriptContent?: string;
}

const INITIAL_ADMIN_RESOURCES: AdminResourceItem[] = [
  {
    id: "RES-001",
    name: "水印视频_1 (1)",
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    tags: ["有对比"],
    category: "成片同步一级/成片同步二级",
    company: "梦畅网络",
    uploadTime: "2025-05-24 16:50:18",
    tabType: "成片",
    originalTabType: "成片",
    duration: "00:45",
    fileSize: "18.4 MB"
  },
  {
    id: "RES-002",
    name: "草本初色内衣爆款口播切片_V2",
    cover: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4",
    tags: ["强推荐", "爆款短视频"],
    category: "女士内衣/无钢圈抹胸",
    company: "梦畅网络",
    uploadTime: "2025-05-24 14:22:05",
    tabType: "成片",
    originalTabType: "成片",
    duration: "00:32",
    fileSize: "12.8 MB"
  },
  {
    id: "RES-003",
    name: "高颜清爽防晒霜实验室测评实拍",
    cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    tags: ["有对比", "成分党"],
    category: "美妆护肤/防晒隔离",
    company: "致上互娱",
    uploadTime: "2025-05-23 18:10:42",
    tabType: "成片",
    originalTabType: "成片",
    duration: "01:05",
    fileSize: "28.1 MB"
  },
  {
    id: "RES-004",
    name: "智能降噪耳机开箱高清音轨素材",
    cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4",
    tags: ["硬核科技"],
    category: "3C数码/蓝牙耳机",
    company: "云享文化",
    uploadTime: "2025-05-22 11:05:30",
    tabType: "素材",
    originalTabType: "素材",
    duration: "02:10",
    fileSize: "45.0 MB"
  },
  {
    id: "RES-005",
    name: "法式古法金耳环-光泽特写Raw原片",
    cover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    tags: ["高奢质感"],
    category: "服饰首饰/古法金项链",
    company: "梦畅网络",
    uploadTime: "2025-05-21 09:15:00",
    tabType: "素材",
    originalTabType: "素材",
    duration: "00:58",
    fileSize: "22.3 MB"
  },
  {
    id: "RES-006",
    name: "夏日清凉系列高清图库包_01",
    cover: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&auto=format&fit=crop&q=80",
    tags: ["高清壁纸", "展示图"],
    category: "服装鞋帽/夏装走秀",
    company: "梦畅网络",
    uploadTime: "2025-05-20 15:40:12",
    tabType: "图片",
    originalTabType: "图片",
    fileSize: "5.2 MB"
  },
  {
    id: "RES-007",
    name: "防晒冰丝T恤4K宣发海报展示图",
    cover: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80",
    tags: ["宣发海报"],
    category: "服饰内衣/夏日防晒",
    company: "致上互娱",
    uploadTime: "2025-05-19 12:00:00",
    tabType: "图片",
    originalTabType: "图片",
    fileSize: "8.1 MB"
  },
  {
    id: "RES-008",
    name: "欢快轻柔电商背景音旁白",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    tags: ["BGM背景音"],
    category: "音频分类/欢快商用",
    company: "云享文化",
    uploadTime: "2025-05-18 10:00:00",
    tabType: "音频",
    originalTabType: "音频",
    duration: "01:30",
    fileSize: "3.5 MB"
  },
  {
    id: "RES-009",
    name: "痛点突破黄金3秒开场文案",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=80",
    tags: ["高转化"],
    category: "脚本同步一级/通用电商",
    company: "致上互娱",
    uploadTime: "2025-05-19 16:20:00",
    tabType: "脚本",
    originalTabType: "脚本",
    fileSize: "120 KB",
    scriptContent: "【黄金3秒Hook】：如果你的衣服总是洗完变硬变干，那一定要试试这个……\n【痛点场景拆解】：普通洗涤剂导致面料受损，无痕内衣变质。\n【转化引导】：今日直播间买一送一，限时限量抢购！"
  },
  {
    id: "RES-010",
    name: "草本内衣无钢圈口播拆解脚本",
    cover: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&auto=format&fit=crop&q=80",
    tags: ["爆款口播"],
    category: "女士内衣/无钢圈",
    company: "梦畅网络",
    uploadTime: "2025-05-17 14:10:00",
    tabType: "脚本",
    originalTabType: "脚本",
    fileSize: "85 KB",
    scriptContent: "【开场视觉】：展示高弹拉伸，一秒收腹无痕。\n【功能展示】：天然草本有机棉，亲肤透气不闷热。\n【尾帧促销】：下方小黄车直接领券立减20元。"
  },

  /* ---------------- 下面为回收站五种类别文件的初始化案例 ---------------- */
  {
    id: "RES-TRASH-001",
    name: "夏日清凉彩妆新品海报展示图_01",
    cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    tags: ["宣发海报", "高清壁纸"],
    category: "美妆护肤/彩妆口红",
    company: "致上互娱",
    uploadTime: "2025-06-18 15:08:03",
    tabType: "回收站",
    originalTabType: "图片",
    fileSize: "3.4 MB"
  },
  {
    id: "RES-TRASH-002",
    name: "夏日轻快节奏促销旁白音频_02",
    cover: "",
    tags: ["轻快欢快", "大促BGM"],
    category: "音频分类/欢快商用",
    company: "致上互娱",
    uploadTime: "2025-06-12 13:44:22",
    tabType: "回收站",
    originalTabType: "音频",
    duration: "01:15",
    fileSize: "1.2 MB"
  },
  {
    id: "RES-TRASH-003",
    name: "防晒霜爆款种草解说音轨_V1",
    cover: "",
    tags: ["种草口播", "爆款配乐"],
    category: "音频分类/解说旁白",
    company: "致上互娱",
    uploadTime: "2025-06-11 17:53:02",
    tabType: "回收站",
    originalTabType: "音频",
    duration: "02:05",
    fileSize: "2.8 MB"
  },
  {
    id: "RES-TRASH-004",
    name: "夏日冰爽爆款广告成片_V3_已移入回收站",
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    tags: ["爆款短视频", "对比实测"],
    category: "美妆护肤/防晒隔离",
    company: "梦畅网络",
    uploadTime: "2025-06-10 11:20:00",
    tabType: "回收站",
    originalTabType: "成片",
    duration: "00:45",
    fileSize: "18.4 MB"
  },
  {
    id: "RES-TRASH-005",
    name: "高清特写原片片段_02_草稿废弃",
    cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4",
    tags: ["对比实测", "高端质感"],
    category: "服饰首饰/古法金",
    company: "云享文化",
    uploadTime: "2025-06-09 16:15:30",
    tabType: "回收站",
    originalTabType: "素材",
    duration: "00:30",
    fileSize: "12.0 MB"
  },
  {
    id: "RES-TRASH-006",
    name: "无痕内衣痛点爆破口播脚本_草稿",
    cover: "",
    tags: ["黄金3秒Hook", "高转化"],
    category: "脚本分类/电商口播",
    company: "致上互娱",
    uploadTime: "2025-06-08 09:30:15",
    tabType: "回收站",
    originalTabType: "脚本",
    fileSize: "65 KB",
    scriptContent: "【黄金3秒Hook】：如果你的衣服总是洗完变硬变干，那一定要试试这个……"
  }
];

export default function AdminResourceView() {
  const [resources, setResources] = useState<AdminResourceItem[]>(INITIAL_ADMIN_RESOURCES);
  const [activeTab, setActiveTab] = useState<string>("成片");
  
  // 筛选字段
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTag, setSelectedTag] = useState("全部标签");
  const [selectedCompany, setSelectedCompany] = useState("全部公司");

  // 回收站勾选 ID 集合与选择模式
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);

  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // 查看弹窗/详情页
  const [previewItem, setPreviewItem] = useState<AdminResourceItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const tabs = ["成片", "素材", "图片", "音频", "脚本", "回收站"];
  const companies = ["全部公司", "致上互娱", "梦畅网络", "云享文化", "星耀传媒", "致上电商"];
  const tagsList = ["全部标签", "有对比", "强推荐", "爆款短视频", "硬核科技", "高转化", "种草口播", "成分党", "夏日新品", "爆款配乐"];

  // 过滤后的数据
  const filteredResources = resources.filter((item) => {
    // Tab match
    if (item.tabType !== activeTab) return false;
    
    // Keyword match
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.toLowerCase();
      const matchName = item.name.toLowerCase().includes(kw);
      const matchId = item.id.toLowerCase().includes(kw);
      const matchCompany = item.company.toLowerCase().includes(kw);
      if (!matchName && !matchId && !matchCompany) return false;
    }

    // Tag match
    if (selectedTag !== "全部标签") {
      if (!item.tags.includes(selectedTag)) return false;
    }

    // Company match
    if (selectedCompany !== "全部公司") {
      if (item.company !== selectedCompany) return false;
    }

    return true;
  });

  // 分页数据
  const totalCount = filteredResources.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 单个删除 -> 移入回收站
  const handleMoveToTrash = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            originalTabType: r.tabType !== "回收站" ? r.tabType as any : r.originalTabType,
            tabType: "回收站"
          };
        }
        return r;
      })
    );
    showToast("已将该素材移入回收站");
  };

  // 彻底删除
  const handlePermanentDelete = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast("已成功彻底删除该素材");
  };

  // 批量彻底删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast("请先勾选需要彻底删除的项目");
      return;
    }
    const count = selectedIds.length;
    setResources((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    showToast(`已成功批量彻底删除 ${count} 个选中的项目`);
  };

  // 批量恢复
  const handleBatchRestore = () => {
    if (selectedIds.length === 0) {
      showToast("请先勾选需要恢复的项目");
      return;
    }
    const count = selectedIds.length;
    setResources((prev) =>
      prev.map((r) => {
        if (selectedIds.includes(r.id)) {
          return {
            ...r,
            tabType: r.originalTabType || "成片"
          };
        }
        return r;
      })
    );
    setSelectedIds([]);
    showToast(`已成功批量恢复 ${count} 个选中的素材至对应分类`);
  };

  // 一键清空回收站
  const handleClearTrash = () => {
    const trashItems = resources.filter((r) => r.tabType === "回收站");
    if (trashItems.length === 0) {
      showToast("回收站当前为空");
      return;
    }
    setResources((prev) => prev.filter((r) => r.tabType !== "回收站"));
    setSelectedIds([]);
    showToast("已清空回收站所有关联素材");
  };

  // 切换勾选
  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 如果打开了详情页，渲染对应的用户端一致的详情组件
  if (previewItem) {
    if (previewItem.tabType === "成片" || previewItem.tabType === "素材" || (previewItem.tabType === "回收站" && (previewItem.originalTabType === "成片" || previewItem.originalTabType === "素材"))) {
      const finishedVideo: FinishedVideo = {
        id: previewItem.id,
        title: previewItem.name,
        videoUrl: previewItem.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
        coverUrl: previewItem.cover || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
        duration: previewItem.duration || "00:45",
        resolution: "1080p",
        size: previewItem.fileSize || "18.4 MB",
        creator: "human",
        createdAt: previewItem.uploadTime,
        syncStatus: "unsynced",
        shares: 12,
        likes: 120,
        comments: 18,
        author: previewItem.company,
        cost: 3.5,
        brandName: previewItem.company,
        category: previewItem.category,
        tags: previewItem.tags
      };

      return (
        <FinishedVideoDetailModal
          video={finishedVideo}
          isMaterialMode={previewItem.tabType === "素材" || previewItem.originalTabType === "素材"}
          isAdminMode={true}
          onClose={() => setPreviewItem(null)}
        />
      );
    }

    if (previewItem.tabType === "图片" || (previewItem.tabType === "回收站" && previewItem.originalTabType === "图片")) {
      const imageItem: ImageItem = {
        id: previewItem.id,
        title: previewItem.name,
        imageUrl: previewItem.cover || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
        badge: "普通视角",
        author: previewItem.company,
        primaryCategory: previewItem.category.split("/")[0] || "通用分类",
        secondaryCategory: previewItem.category.split("/")[1] || "未分类",
        size: previewItem.fileSize || "5.2 MB",
        resolution: "1080x1920",
        time: previewItem.uploadTime,
        downloads: 120,
        tags: previewItem.tags
      };

      return (
        <div className="flex-1 min-h-0 h-full overflow-y-auto w-full">
          <ImageDetailView
            item={imageItem}
            onClose={() => setPreviewItem(null)}
            showToast={showToast}
          />
        </div>
      );
    }

    if (previewItem.tabType === "音频" || (previewItem.tabType === "回收站" && previewItem.originalTabType === "音频")) {
      const audioItem: AudioItem = {
        id: previewItem.id,
        title: previewItem.name,
        duration: 90,
        durationFormatted: previewItem.duration || "01:30",
        author: previewItem.company,
        primaryCategory: previewItem.category.split("/")[0] || "通用分类",
        secondaryCategory: previewItem.category.split("/")[1] || "未分类",
        publicTags: previewItem.tags || [],
        personalTag: "常用音轨"
      };

      return (
        <div className="flex-1 min-h-0 h-full overflow-y-auto w-full">
          <AudioDetailView
            item={audioItem}
            onClose={() => setPreviewItem(null)}
            showToast={showToast}
            onDelete={(id) => {
              handlePermanentDelete(id);
              setPreviewItem(null);
            }}
          />
        </div>
      );
    }

    if (previewItem.tabType === "脚本" || (previewItem.tabType === "回收站" && previewItem.originalTabType === "脚本")) {
      const scriptItem: ScriptItem = {
        id: previewItem.id,
        title: previewItem.name,
        author: previewItem.company,
        categoryTag: "精选爆款",
        content: previewItem.scriptContent || "【开场白】：无痕舒适，专为高品质打造。\n【痛点解法】：亲肤无钢圈，秒提拉升。",
        status: "审核通过",
        mainCategory: "短视频脚本",
        primaryCategory: previewItem.category.split("/")[0] || "通用分类",
        secondaryCategory: previewItem.category.split("/")[1] || "未分类",
        classTag: "电商卖货",
        descTag: "爆款卖点",
        tasksCount: 1,
        tasks: [],
        createdAt: previewItem.uploadTime,
        scenesCount: 3,
        publisherGroup: previewItem.company
      };

      return (
        <div className="flex-1 min-h-0 h-full overflow-y-auto w-full">
          <ScriptDetailPage
            script={scriptItem}
            onBack={() => setPreviewItem(null)}
          />
        </div>
      );
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white text-slate-800 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/80 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 顶部筛选工具栏 (参考截图1) */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex flex-wrap items-center gap-3">
          {/* 搜索框 */}
          <div className="w-80 relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="关键词搜索（姓名/视频标题/视频id）"
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          {/* 标签选择框 */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer focus:outline-hidden focus:border-purple-500"
            >
              {tagsList.map((t) => (
                <option key={t} value={t}>
                  {t === "全部标签" ? "请选择标签" : t}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 公司/分类下拉框 */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer focus:outline-hidden focus:border-purple-500"
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c === "全部公司" ? "请选择公司" : c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 紫色搜索按钮 */}
          <button
            type="button"
            onClick={() => showToast("已应用搜索筛选条件")}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            搜索
          </button>
        </div>

        {/* 2. 选项卡分类栏 (图1展示：成片、素材、第三方、图片、文案、音频、脚本、回收站) */}
        <div className="flex items-center gap-8 mt-5 border-b border-slate-100/80 pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedIds([]);
                  setIsSelectMode(false);
                }}
                className={`pb-2 text-xs font-bold transition-all relative cursor-pointer ${
                  isActive ? "text-purple-600 font-extrabold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. 回收站专用批量功能操作工具栏 (完全参照截图) */}
        {activeTab === "回收站" && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-1">
            {/* 选择 / 取消选择 按钮 */}
            <button
              type="button"
              onClick={() => {
                if (isSelectMode) {
                  setIsSelectMode(false);
                  setSelectedIds([]);
                } else {
                  setIsSelectMode(true);
                }
              }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              {isSelectMode ? "取消选择" : "选择"}
            </button>

            {/* 选中本页 按钮 */}
            <button
              type="button"
              onClick={() => {
                setIsSelectMode(true);
                const currentIds = paginatedResources.map((r) => r.id);
                const isAllSelected = currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));
                if (isAllSelected) {
                  setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
                } else {
                  setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
                }
              }}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
                isSelectMode && paginatedResources.length > 0 && paginatedResources.every((r) => selectedIds.includes(r.id))
                  ? "bg-purple-50 border-purple-600 text-purple-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                isSelectMode && paginatedResources.length > 0 && paginatedResources.every((r) => selectedIds.includes(r.id))
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-slate-300 bg-white"
              }`}>
                <Check className={`w-2.5 h-2.5 stroke-[3] ${
                  isSelectMode && paginatedResources.length > 0 && paginatedResources.every((r) => selectedIds.includes(r.id))
                    ? "text-white"
                    : "text-slate-300 opacity-0 group-hover:opacity-100"
                }`} />
              </div>
              <span>选中本页</span>
            </button>

            {/* 后续三个操作按钮：只有在点击选择或选中本页后才显示 */}
            {isSelectMode && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      showToast("请先勾选需要删除的项目");
                      return;
                    }
                    handleBatchDelete();
                  }}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  批量删除
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      showToast("请先勾选需要恢复的项目");
                      return;
                    }
                    handleBatchRestore();
                  }}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  批量恢复
                </button>

                <button
                  type="button"
                  onClick={handleClearTrash}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  一键清空
                </button>

                {selectedIds.length > 0 && (
                  <span className="text-xs font-extrabold text-purple-600 ml-1">
                    已选中 {selectedIds.length} 项
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. 内容与卡片列表区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-white flex flex-col justify-between">
        <div>
          {filteredResources.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
              <Trash2 className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-xs">【{activeTab}】暂无符合条件的内容</p>
            </div>
          ) : activeTab === "回收站" ? (
            /* 回收站布局：2列网格，选择模式下显示复选框 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {paginatedResources.map((item) => {
                const isSelected = isSelectMode && selectedIds.includes(item.id);
                const realType = item.originalTabType || "图片";

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelectId(item.id);
                      } else {
                        setPreviewItem(item);
                      }
                    }}
                    className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all cursor-pointer group ${
                      isSelected ? "bg-purple-50/40" : "hover:bg-slate-50/60"
                    }`}
                  >
                    {/* 复选框 - 只有在选择模式下才显示 */}
                    {isSelectMode && (
                      <div className="pt-2 shrink-0">
                        <div
                          className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                            isSelected
                              ? "bg-purple-600 border-purple-600 text-white shadow-2xs"
                              : "border-slate-300 bg-white group-hover:border-purple-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    )}

                  {/* 缩略图/插图 (区分音视频、脚本、图片) */}
                  <div className="shrink-0 relative">
                    {realType === "音频" ? (
                      /* 耳机单线条灰白插图 (完全匹配截图1) */
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-3 shadow-2xs group-hover:border-purple-300 transition-colors">
                        <Headphones className="w-12 h-12 text-slate-900 stroke-[1.8]" />
                      </div>
                    ) : realType === "脚本" ? (
                      /* 笔记本灰白线条插图 (完全匹配通用插图要求) */
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-white border border-slate-200/90 flex flex-col items-center justify-center p-3 shadow-2xs group-hover:border-purple-300 transition-colors">
                        <FileText className="w-11 h-11 text-slate-800 stroke-[1.8]" />
                        <span className="text-[10px] text-slate-400 font-bold mt-1">脚本草稿</span>
                      </div>
                    ) : (
                      /* 图片/成片/素材 真实封面 */
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 relative shadow-2xs group-hover:border-purple-300 transition-colors">
                        <img
                          src={item.cover}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {(realType === "成片" || realType === "素材") && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xs">
                              <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />
                            </div>
                          </div>
                        )}
                        {item.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[9px] px-1 rounded">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 右侧信息排布 (对齐截图1: 标题 -> 橙/蓝底色标签 -> 一二级分类 -> 公司名与时间) */}
                  <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
                    {/* 标题 */}
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors truncate cursor-pointer"
                        title={item.name}
                      >
                        {item.name}
                      </h4>
                    </div>

                    {/* 橙/蓝标签 Chips (截图1: "是"、"1"、"2" "5.20") */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {item.tags.map((tag, idx) => {
                        const isBlue = tag.includes(".") || tag === "5.20";
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isBlue
                                ? "bg-blue-50 text-blue-600 border border-blue-100/80"
                                : "bg-amber-50 text-amber-700 border border-amber-100/80"
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    {/* 分类 */}
                    <p className="text-xs text-slate-500 font-medium truncate pt-1">
                      {item.category}
                    </p>

                    {/* 公司名称 与 删除/时间 */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="font-sans font-medium text-slate-500">{item.company}</span>
                      <span>{item.uploadTime}</span>
                    </div>

                    {/* 操作快捷按钮：恢复 / 彻底删除 */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResources((prev) =>
                            prev.map((r) => (r.id === item.id ? { ...r, tabType: r.originalTabType || "成片" } : r))
                          );
                          showToast(`已恢复【${item.name}】`);
                        }}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>恢复</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePermanentDelete(item.id);
                        }}
                        className="text-[11px] text-slate-400 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>彻底删除</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 普通 Tab 列表 (成片/素材/图片/音频/脚本) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedResources.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-100/90 p-3.5 shadow-2xs hover:shadow-md transition-all flex gap-3.5 items-center group relative"
              >
                {/* 左侧封面 */}
                {item.tabType === "音频" ? (
                  <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-200/90 relative group/cover flex flex-col items-center justify-center p-2">
                    <div className="w-10 h-10 rounded-full border border-slate-300 bg-white shadow-2xs flex items-center justify-center mb-1.5 group-hover/cover:scale-105 transition-transform">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 my-1">
                      <span className="w-0.5 h-3 bg-slate-400 rounded-full" />
                      <span className="w-0.5 h-4.5 bg-slate-500 rounded-full" />
                      <span className="w-0.5 h-2 bg-slate-400 rounded-full" />
                      <span className="w-0.5 h-4 bg-slate-500 rounded-full" />
                      <span className="w-0.5 h-2.5 bg-slate-400 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold font-mono tracking-tight mt-1">音频播放</span>
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                      </button>
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-1 right-1 bg-slate-800/80 text-white font-mono text-[9px] px-1 rounded">
                        {item.duration}
                      </span>
                    )}
                  </div>
                ) : item.tabType === "脚本" ? (
                  <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-200/90 relative group/cover flex flex-col items-center justify-center p-2">
                    <div className="w-10 h-13 bg-white rounded-md border border-slate-300 shadow-2xs p-1.5 flex flex-col justify-between relative group-hover/cover:scale-105 transition-transform">
                      <div className="absolute -left-1 top-2 bottom-2 flex flex-col justify-between">
                        <span className="w-1 h-0.5 bg-slate-400 rounded-full" />
                        <span className="w-1 h-0.5 bg-slate-400 rounded-full" />
                        <span className="w-1 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                      <div className="space-y-1 pl-1">
                        <div className="w-full h-1 bg-slate-300 rounded-full" />
                        <div className="w-3/4 h-1 bg-slate-200 rounded-full" />
                        <div className="w-5/6 h-1 bg-slate-200 rounded-full" />
                        <div className="w-2/3 h-1 bg-slate-200 rounded-full" />
                      </div>
                      <div className="flex justify-end pt-0.5">
                        <FileText className="w-3 h-3 text-slate-500" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold font-mono tracking-tight mt-1.5">笔记本脚本</span>
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-slate-900" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-900 relative group/cover">
                    <img
                      src={item.cover}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                      </button>
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[9px] px-1 rounded">
                        {item.duration}
                      </span>
                    )}
                  </div>
                )}

                {/* 右侧卡片内容 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <div>
                    <h4
                      onClick={() => setPreviewItem(item)}
                      className="text-xs font-bold text-slate-900 truncate hover:text-purple-600 transition-colors cursor-pointer"
                      title={item.name}
                    >
                      {item.name}
                    </h4>

                    {/* 标签列表 */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 一级 / 二级分类 */}
                    <p className="text-[11px] text-slate-500 mt-2 truncate">
                      {item.category}
                    </p>
                  </div>

                  {/* 底部信息：公司名称 + 上传时间 + 移入回收站 */}
                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="truncate max-w-[120px]">
                      <span className="text-slate-600 font-bold block truncate">{item.company}</span>
                      <span>{item.uploadTime}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToTrash(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="移入回收站"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

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
      </div>
    </div>
  );
}
