import React, { useState } from "react";
import { PublicTagFilter } from "./PublicTagFilter";
import LinkScriptModal from "./LinkScriptModal";
import UploadFinishedVideoModal from "./UploadFinishedVideoModal";
import UploadImageModal from "./UploadImageModal";
import UploadGenericResourcePage from "./UploadGenericResourcePage";
import {
  ArrowLeft,
  UploadCloud,
  AlertCircle,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  Filter,
  RotateCcw,
  Edit3,
  Plus,
  FileText,
  Check,
  Zap,
  TrendingUp,
  DollarSign,
  Tag,
  ShoppingBag,
  Percent,
  MessageSquare,
  Box,
  Upload,
  Film,
  Image as ImageIcon,
  Music,
  X
} from "lucide-react";
import { TaskItem } from "./TaskCollaborationView";

interface TaskDetailPageProps {
  task: TaskItem;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  onBack,
  onShowToast,
}) => {
  // Main Sub-tabs: 成片 | 素材 | 脚本 | 图片 | 音频
  const [activeTab, setActiveTab] = useState<"成片" | "素材" | "脚本" | "图片" | "音频">("成片");

  // Upload Page View State ("成片" | "素材" | "脚本" | "图片" | "音频" | null)
  const [uploadPageView, setUploadPageView] = useState<"成片" | "素材" | "脚本" | "图片" | "音频" | null>(null);

  // Filters State
  const [l1Category, setL1Category] = useState<string>("全部");
  const [l2Search, setL2Search] = useState<string>("");
  const [l2Category, setL2Category] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  
  const [publicTagSearch, setPublicTagSearch] = useState<string>("");
  const [selectedPublicTags, setSelectedPublicTags] = useState<string[]>([]);
  
  const [personalTagSearch, setPersonalTagSearch] = useState<string>("");
  const [personalTagFilter, setPersonalTagFilter] = useState<string>("全部");

  // Advanced Search
  const [sortBy, setSortBy] = useState<string>("最新发布");
  const [adPlatformTag, setAdPlatformTag] = useState<string>("");
  const [costRange, setCostRange] = useState<string>("不限");
  const [systemTag, setSystemTag] = useState<string>("");
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectThisPage, setSelectThisPage] = useState<boolean>(false);

  // Associated Scripts Table selection
  const [selectedScriptIds, setSelectedScriptIds] = useState<string[]>([]);

  // Modals for Actions inside Detail Page
  const [isUploadTypeSelectModalOpen, setIsUploadTypeSelectModalOpen] = useState(false);
  const [isAssociateScriptModalOpen, setIsAssociateScriptModalOpen] = useState(false);
  const [isUploadScriptModalOpen, setIsUploadScriptModalOpen] = useState(false);

  // Mock Associated Scripts List
  const [associatedScripts, setAssociatedScripts] = useState([
    {
      id: "SCR-001",
      title: task.associatedScript?.title || "改写",
      template: task.associatedScript?.template || "二创衍生",
      tag: "二创/爆款",
      status: task.associatedScript?.status || "待审核",
      publisher: task.publisher || "莫钦全",
      publishTime: "2026-06-20 20:11:08",
    },
    {
      id: "SCR-002",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:21",
    },
    {
      id: "SCR-003",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:36",
    },
    {
      id: "SCR-004",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:48",
    },
    {
      id: "SCR-005",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:00",
    },
    {
      id: "SCR-006",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:12",
    },
    {
      id: "SCR-007",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:27",
    },
    {
      id: "SCR-008",
      title: "改写",
      template: "二创衍生",
      tag: "二创",
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:39",
    }
  ]);

  // If user opened an upload page view, render the corresponding upload component (same as ResourcesView)
  if (uploadPageView) {
    if (uploadPageView === "图片") {
      return (
        <UploadImageModal
          isOpen={true}
          isPage={true}
          onClose={() => setUploadPageView(null)}
          onPublishSuccess={(msg) => {
            onShowToast(msg);
            setUploadPageView(null);
          }}
        />
      );
    }
    if (uploadPageView === "成片" || uploadPageView === "素材") {
      return (
        <UploadFinishedVideoModal
          isOpen={true}
          isPage={true}
          onClose={() => setUploadPageView(null)}
          onPublishSuccess={(msg) => {
            onShowToast(msg);
            setUploadPageView(null);
          }}
        />
      );
    }
    return (
      <UploadGenericResourcePage
        type={uploadPageView}
        onClose={() => setUploadPageView(null)}
        onPublishSuccess={(msg) => {
          onShowToast(msg);
          setUploadPageView(null);
        }}
      />
    );
  }

  const togglePublicTag = (tag: string) => {
    if (selectedPublicTags.includes(tag)) {
      setSelectedPublicTags(selectedPublicTags.filter(t => t !== tag));
    } else {
      setSelectedPublicTags([...selectedPublicTags, tag]);
    }
  };

  const toggleSelectScript = (id: string) => {
    if (selectedScriptIds.includes(id)) {
      setSelectedScriptIds(selectedScriptIds.filter(i => i !== id));
    } else {
      setSelectedScriptIds([...selectedScriptIds, id]);
    }
  };

  const toggleSelectAllScripts = () => {
    if (selectedScriptIds.length === associatedScripts.length) {
      setSelectedScriptIds([]);
    } else {
      setSelectedScriptIds(associatedScripts.map(s => s.id));
    }
  };

  const handleResetFilters = () => {
    setL1Category("全部");
    setL2Search("");
    setL2Category("全部");
    setStatusFilter("全部");
    setPublicTagSearch("");
    setSelectedPublicTags([]);
    setPersonalTagSearch("");
    setPersonalTagFilter("全部");
    setSortBy("最新发布");
    setAdPlatformTag("");
    setCostRange("不限");
    setSystemTag("");
    setAuthorFilter("");
    setStartDate("");
    setEndDate("");
    setSelectThisPage(false);
    onShowToast("已重置所有筛选条件");
  };

  const L1_CATEGORIES = ["全部", "爆款素材", "内衣", "内裤", "吊带", "裤袜", "保暖衣", "明星素材", "通用"];
  const STATUS_LIST = ["全部", "待审核", "审核通过", "审核驳回", "已修改", "二次修改", "已上机", "已搭", "放弃"];
  const PUBLIC_TAGS = [
    "模特姓名", "场景", "编导姓名", "爆款视频", "摄影姓名", "空镜", "上身",
    "剧情人设", "产品名称", "明星元素", "视觉类型", "剪辑形式", "痛点",
    "产品背书", "星图合作达人", "外包素材批次", "部门", "头达专场", "好身材",
    "四不买", "采访分类", "脚本标签", "培训", "直播录屏", "量级"
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F7F8FA] font-sans text-slate-800 p-4 sm:p-6 space-y-5 animate-fade-in">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 p-3.5 px-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50 font-bold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回任务列表</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">任务信息</h1>
            <span className="text-xs font-mono font-bold text-slate-400">ID: {task.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">关联产品:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
            {task.product || "通用服装"}
          </span>
        </div>
      </div>

      {/* SECTION 1: 任务信息 Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs border-b border-slate-200">
          {/* 下单 */}
          <div className="flex items-stretch">
            <div className="w-24 bg-slate-50/80 px-4 py-3 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
              下单
            </div>
            <div className="px-4 py-3 flex items-center font-bold text-slate-800 grow">
              {task.publisher || "徐振"}
            </div>
          </div>

          {/* 指派给 */}
          <div className="flex items-stretch">
            <div className="w-24 bg-slate-50/80 px-4 py-3 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
              指派给
            </div>
            <div className="px-4 py-3 flex items-center font-bold text-slate-800 grow">
              {task.assignee || "莫钦全"}
            </div>
          </div>

          {/* 下单时间 */}
          <div className="flex items-stretch">
            <div className="w-24 bg-slate-50/80 px-4 py-3 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
              下单时间
            </div>
            <div className="px-4 py-3 flex items-center font-mono font-bold text-slate-700 grow">
              {task.publishDate || "2026-06-15"}
            </div>
          </div>

          {/* 出片时间 */}
          <div className="flex items-stretch">
            <div className="w-24 bg-slate-50/80 px-4 py-3 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
              出片时间
            </div>
            <div className="px-4 py-3 flex items-center font-mono font-bold text-slate-700 grow">
              {task.deadlineDate || "2026-06-20"}
            </div>
          </div>
        </div>

        {/* 任务备注 */}
        <div className="flex items-stretch text-xs border-b border-slate-200">
          <div className="w-24 bg-slate-50/80 px-4 py-3.5 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
            任务备注
          </div>
          <div className="px-4 py-3.5 text-slate-700 font-medium leading-relaxed whitespace-pre-line grow">
            {task.remark || "本周训练二创为主，8条的任务都是二创。\n另：复刻可正常提交当储备，合适的也会安排"}
          </div>
        </div>

        {/* 出片进度 & 上传按钮 */}
        <div className="flex items-stretch text-xs">
          <div className="w-24 bg-slate-50/80 px-4 py-3.5 flex items-center font-semibold text-slate-500 shrink-0 border-r border-slate-200/80">
            出片进度
          </div>
          <div className="px-4 py-3 flex items-center justify-between grow">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] shadow-2xs">
                !
              </span>
              <span className="font-bold text-amber-600">
                未完成
              </span>
              <span className="font-mono text-slate-500 font-bold ml-1">
                ({task.completedCount || 0} / {task.orderCount || 8})
              </span>
            </div>

            <button
              onClick={() => setIsUploadTypeSelectModalOpen(true)}
              className="px-4 py-1.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>去上传作品</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Sub-Tabs Bar & Stats */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 px-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto w-full sm:w-auto">
          {(["成片", "素材", "脚本", "图片", "音频"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-extrabold relative pb-1 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Stats */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium shrink-0">
          <div>
            任务作品数: <span className="font-mono font-bold text-slate-800">0个</span>
          </div>
          <div>
            有权限查看: <span className="font-mono font-bold text-slate-800">0个</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: 素材数据汇总 (KPI Metric Cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">素材数据汇总</h2>
          <span className="text-xs text-slate-400 font-medium">数据实时同步</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Card 1: 消耗 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">¥0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">消耗</span>
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED]">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>

          {/* Card 2: ROI */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-slate-900 font-mono">0</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">ROI</span>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: 成交金额 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">成交金额</span>
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                ¥
              </div>
            </div>
          </div>

          {/* Card 4: 智能优惠券 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">智能优惠券</span>
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED]">
                <Tag className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 5: 总成交金额 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">总成交金额</span>
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED] font-bold text-xs">
                ¥
              </div>
            </div>
          </div>

          {/* Card 6: 电商平台补贴金额 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 leading-tight">平台补贴</span>
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                ¥
              </div>
            </div>
          </div>

          {/* Card 7: 转化数 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">转化数</span>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 8: 转化率 */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between h-20 relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="text-sm font-black text-slate-900 font-mono">0%</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">转化率</span>
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: 素材筛选 Filter Board */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4 text-xs">
        {/* 一级分类 */}
        <div className="flex items-start gap-4">
          <span className="w-20 font-bold text-slate-500 shrink-0 pt-1">一级分类:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {L1_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setL1Category(cat)}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all ${
                  l1Category === cat
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 二级分类 */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-bold text-slate-500 shrink-0">二级分类:</span>
          <div className="flex items-center gap-3">
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索分类"
                value={l2Search}
                onChange={(e) => setL2Search(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={() => setL2Category("全部")}
              className="px-3 py-1 bg-[#7C3AED] text-white rounded-md font-bold cursor-pointer"
            >
              全部
            </button>
          </div>
        </div>

        {/* 状态 */}
        <div className="flex items-start gap-4">
          <span className="w-20 font-bold text-slate-500 shrink-0 pt-1">状 态:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_LIST.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all ${
                  statusFilter === st
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 公共标签 */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-bold text-slate-500 shrink-0">公共标签:</span>
          <PublicTagFilter
            selectedTag={selectedPublicTags[0] || "全部"}
            onSelectTag={(tag) => {
              if (tag === "全部") {
                setSelectedPublicTags([]);
              } else {
                setSelectedPublicTags([tag]);
              }
            }}
          />
        </div>

        {/* 个人标签 */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
          <span className="w-20 font-bold text-slate-500 shrink-0">个人标签:</span>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索标签"
                value={personalTagSearch}
                onChange={(e) => setPersonalTagSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            {["全部", "无个人标签", "有个人标签"].map((pt) => (
              <button
                key={pt}
                onClick={() => setPersonalTagFilter(pt)}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all ${
                  personalTagFilter === pt
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pt}
              </button>
            ))}

            <button
              onClick={() => onShowToast("重置个人标签")}
              className="text-slate-400 hover:text-purple-600 font-medium flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>重置个人标签</span>
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 高级搜索 Bar */}
        <div className="border-t border-slate-100 pt-3 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="w-20 font-bold text-slate-500 shrink-0">高级搜索:</span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 font-medium text-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="最新发布">排序: 最新发布</option>
              <option value="最早发布">排序: 最早发布</option>
              <option value="消耗最高">排序: 消耗最高</option>
            </select>

            <select
              value={adPlatformTag}
              onChange={(e) => setAdPlatformTag(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 font-medium text-slate-400 focus:outline-none focus:border-purple-500"
            >
              <option value="">广告平台标签: 请选择广告平台</option>
              <option value="抖音">抖音</option>
              <option value="快手">快手</option>
              <option value="小红书">小红书</option>
            </select>

            <select
              value={costRange}
              onChange={(e) => setCostRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 font-medium text-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="不限">消耗: 不限</option>
              <option value="1000以下">¥1000 以下</option>
              <option value="1000-5000">¥1000 - ¥5000</option>
              <option value="5000以上">¥5000 以上</option>
            </select>

            <select
              value={systemTag}
              onChange={(e) => setSystemTag(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 font-medium text-slate-400 focus:outline-none focus:border-purple-500"
            >
              <option value="">系统自动标签: 请选择系统自动标签</option>
              <option value="爆款素材">爆款素材</option>
              <option value="潜力素材">潜力素材</option>
            </select>

            <button
              onClick={() => onShowToast("已执行高级筛选")}
              className="px-3.5 py-1 border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>筛选</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="px-3.5 py-1 bg-[#7C3AED] text-white hover:bg-purple-700 font-bold rounded-md cursor-pointer transition-colors shadow-2xs"
            >
              重置
            </button>
          </div>

          {/* Row 2 Advanced Controls */}
          <div className="flex items-center gap-4 flex-wrap pl-24 text-slate-600">
            <button
              onClick={() => onShowToast("多选操作")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700 cursor-pointer"
            >
              选择 ∨
            </button>

            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600 select-none">
              <input
                type="checkbox"
                checked={selectThisPage}
                onChange={(e) => setSelectThisPage(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span>选中本页</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">作者:</span>
              <input
                type="text"
                placeholder="请选择(支持输入搜索)"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 focus:outline-none focus:border-purple-500 w-48"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">上传时间:</span>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-slate-700"
                />
                <span>至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Media Content Area (Empty State) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 shadow-2xs flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
        <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 shadow-inner">
          <Box className="w-12 h-12 stroke-[1.2]" />
        </div>
        <p className="text-slate-400 font-bold text-sm">暂无数据</p>
        <button
          onClick={() => setUploadPageView(activeTab)}
          className="mt-1 px-4 py-1.5 bg-purple-50 text-[#7C3AED] hover:bg-purple-100 font-bold rounded-lg text-xs transition-colors cursor-pointer"
        >
          上传此分类作品/素材 ({activeTab})
        </button>
      </div>

      {/* SECTION 6: 关联脚本 Section Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">关联脚本</h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#7C3AED]">
            <button
              onClick={() => setIsAssociateScriptModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              关联脚本
            </button>
            <button
              onClick={() => onShowToast("正在编辑关联脚本")}
              className="hover:underline cursor-pointer"
            >
              编辑关联脚本
            </button>
            <button
              onClick={() => setIsUploadScriptModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              上传脚本
            </button>
          </div>
        </div>

        {/* Associated Scripts Table */}
        <div className="overflow-x-auto border border-slate-200/70 rounded-lg">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedScriptIds.length === associatedScripts.length && associatedScripts.length > 0}
                    onChange={toggleSelectAllScripts}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-4">脚本标题</th>
                <th className="py-2.5 px-4">脚本模板</th>
                <th className="py-2.5 px-4">标签</th>
                <th className="py-2.5 px-4 text-center">状态</th>
                <th className="py-2.5 px-4">发布人</th>
                <th className="py-2.5 px-4">发布时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {associatedScripts.map((scr) => {
                const isChecked = selectedScriptIds.includes(scr.id);
                return (
                  <tr key={scr.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectScript(scr.id)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">{scr.title}</td>
                    <td className="py-2.5 px-4 text-slate-600">{scr.template}</td>
                    <td className="py-2.5 px-4">
                      {scr.tag && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                          {scr.tag}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px] shadow-2xs">
                        {scr.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-bold">{scr.publisher}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{scr.publishTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: 选择作品/素材上传类型 */}
      {isUploadTypeSelectModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[200] p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-base font-extrabold text-slate-900">选择上传类型</h3>
              </div>
              <button
                onClick={() => setIsUploadTypeSelectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">请选择要上传的作品/素材类型，点击直接进入上传页面：</p>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  type: "成片" as const,
                  label: "成片作品",
                  desc: "高清渲染成片、广告视频，一键推送投放与效果追溯",
                  icon: Film,
                  color: "text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white"
                },
                {
                  type: "素材" as const,
                  label: "原始素材",
                  desc: "实拍原片、高清高光切片、产品镜头",
                  icon: ShoppingBag,
                  color: "text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white"
                },
                {
                  type: "脚本" as const,
                  label: "分镜脚本",
                  desc: "口播文案、AI分镜拆解与衍生剧本",
                  icon: FileText,
                  color: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white"
                },
                {
                  type: "图片" as const,
                  label: "图片素材",
                  desc: "宣发海报、商品主图、模特细节图",
                  icon: ImageIcon,
                  color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white"
                },
                {
                  type: "音频" as const,
                  label: "音频文件",
                  desc: "口播旁白、配音人声、BGM衬乐与音效",
                  icon: Music,
                  color: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white"
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      setIsUploadTypeSelectModalOpen(false);
                      setUploadPageView(item.type);
                    }}
                    className="p-3.5 border border-slate-200/90 rounded-xl flex items-center gap-3.5 hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer text-left group shadow-2xs"
                  >
                    <div className={`p-2.5 rounded-xl transition-colors shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-xs text-slate-800 group-hover:text-purple-700 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {item.desc}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsUploadTypeSelectModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 关联脚本 */}
      <LinkScriptModal
        isOpen={isAssociateScriptModalOpen}
        onClose={() => setIsAssociateScriptModalOpen(false)}
        onConfirm={(selected) => {
          const chosen = Array.isArray(selected) ? selected[0] : selected;
          if (chosen) {
            setAssociatedScripts((prev) => [
              ...prev,
              {
                id: chosen.id,
                title: chosen.title,
                template: chosen.template || "二创衍生",
                tag: chosen.tags?.[0] || "二创",
                status: chosen.status || "待审核",
                publisher: chosen.publisher || "莫钦全",
                publishTime: chosen.publishTime || new Date().toLocaleString(),
              }
            ]);
            onShowToast(`✅ 已关联脚本: ${chosen.title}`);
          }
        }}
      />

      {/* MODAL: 上传脚本 */}
      {isUploadScriptModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">上传脚本</h3>
              <button
                onClick={() => setIsUploadScriptModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">脚本标题</label>
                <input
                  type="text"
                  placeholder="如：二创爆款改写脚本"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">脚本内容</label>
                <textarea
                  rows={4}
                  placeholder="请输入或粘贴脚本正文内容..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsUploadScriptModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsUploadScriptModalOpen(false);
                  onShowToast("✅ 脚本上传并提交审核成功！");
                }}
                className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-2xs cursor-pointer"
              >
                确认上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
