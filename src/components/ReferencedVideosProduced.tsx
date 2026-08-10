import React, { useState, useRef } from "react";
import {
  Calendar,
  Search,
  ChevronDown,
  Download,
  HelpCircle,
  Zap,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Eye,
  Play,
  MousePointer,
  Percent,
  Film,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  User,
  Ticket,
  SlidersHorizontal,
  Check,
  Share2
} from "lucide-react";

interface DerivedVideo {
  id: string;
  title: string;
  coverUrl: string;
  duration: string;
  author: string;
  authorAvatar?: string;
  date: string;
  cost: number;
  roi: number;
  conversions: number;
  status: string;
}

const DEFAULT_DERIVED_VIDEOS: DerivedVideo[] = [
  {
    id: "dv1",
    title: "0730-复古古法金耳环高级质感种草成片_v1.mp4",
    coverUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    duration: "15s",
    author: "张玲静",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "2026-07-28",
    cost: 1280,
    roi: 3.85,
    conversions: 142,
    status: "投放中"
  },
  {
    id: "dv2",
    title: "0729-水光肌上脸实测对比爆款视频_v2.mp4",
    coverUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    duration: "30s",
    author: "叶闯红",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    date: "2026-07-25",
    cost: 3450,
    roi: 4.12,
    conversions: 380,
    status: "投放中"
  },
  {
    id: "dv3",
    title: "0725-夏日清爽控油晚霜对比演示_切片.mp4",
    coverUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    duration: "22s",
    author: "姐妹种草团",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    date: "2026-07-20",
    cost: 890,
    roi: 2.95,
    conversions: 95,
    status: "已暂停"
  }
];

interface ReferencedVideosProducedProps {
  hideTitle?: boolean;
  hideCardWrapper?: boolean;
}

export default function ReferencedVideosProduced({
  hideTitle = false,
  hideCardWrapper = false
}: ReferencedVideosProducedProps = {}) {
  const [sortOrder, setSortOrder] = useState("按关联时间排序");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authorSearchText, setAuthorSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [spendTimeStart, setSpendTimeStart] = useState("2026-06-26");
  const [spendTimeEnd, setSpendTimeEnd] = useState("2026-07-30");
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const metricCards = [
    { id: 1, label: "消耗", value: "¥ 0", icon: <Zap className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 2, label: "ROI", value: "0", hasHelp: true, helpText: "投流广告产生的投资回报率", icon: <TrendingUp className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 3, label: "成交金额", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 4, label: "智能优惠券", value: "¥ 0", icon: <Ticket className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 5, label: "总成交金额", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 6, label: "电商平台补贴金额", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 7, label: "转化数", value: "0", icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 8, label: "转化率", value: "0%", icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 9, label: "转化成本", value: "¥ 0", icon: <Tag className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 10, label: "展示数", value: "0", icon: <Eye className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 11, label: "平均千次展现费用", value: "¥ 0", hasHelp: true, helpText: "每展示1000次的平均推广花费(CPM)", icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 12, label: "点击数", value: "0", icon: <MousePointer className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 13, label: "点击率", value: "0%", icon: <Percent className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 14, label: "平均点击单价", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 15, label: "播放量", value: "0", icon: <Play className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 16, label: "完播率", value: "0%", icon: <Play className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    {
      id: 17,
      label: "有效播放率",
      value: "0%",
      hasRedHelp: true,
      redHelpText: "由于巨量部分字段未提供，数据无法与官方保持一致\n巨量计算公式: 播放时长超过3秒的次数/播放数，播放时长以播放终止时所在的视频时长来计算，包含拖拽等行为\n云管家计算公式: (有效播放数 / 总播放) * 100%",
      icon: <Film className="w-3.5 h-3.5 text-blue-600" />,
      iconBg: "bg-blue-100"
    },
    {
      id: 18,
      label: "千川3S完播率",
      value: "0%",
      hasRedHelp: true,
      redHelpText: "千川平台统计3秒完播率计算公式",
      icon: <Film className="w-3.5 h-3.5 text-blue-600" />,
      iconBg: "bg-blue-100"
    },
    { id: 19, label: "净成交金额", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" },
    { id: 20, label: "净成交订单数", value: "0", icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 21, label: "净成交ROI", value: "0", icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600" />, iconBg: "bg-blue-100" },
    { id: 22, label: "净成交订单成本", value: "¥ 0", icon: <DollarSign className="w-3.5 h-3.5 text-purple-600" />, iconBg: "bg-purple-100" }
  ];

  return (
    <div className={hideCardWrapper ? "space-y-4" : "bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4"}>
      {/* Top Header & Global Date Range Indicator (Hidden if hideTitle is true) */}
      {!hideTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <h3 className="text-sm font-extrabold text-purple-700 flex items-center gap-1.5 pb-1">
                <span>被引用后出片</span>
              </h3>
              <div className="w-8 h-1 bg-purple-600 rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-600 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>2026-06-26 至 2026-07-30</span>
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 text-xs">
        {/* Sort Order Dropdown */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer appearance-none pr-7 shadow-2xs"
          >
            <option value="按关联时间排序">按关联时间排序</option>
            <option value="按消耗金额排序">按消耗金额排序</option>
            <option value="按ROI高到低排序">按ROI高到低排序</option>
            <option value="按转化数排序">按转化数排序</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Author Picker */}
        <div className="relative flex items-center gap-1">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <User className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-slate-500 font-medium mr-1">作者</span>
            <input
              type="text"
              placeholder="请选择(支持输入搜索)"
              value={authorSearchText}
              onChange={(e) => setAuthorSearchText(e.target.value)}
              className="w-36 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 cursor-pointer" />
          </div>
        </div>

        {/* Upload Time Filter */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs text-slate-600">
          <span className="font-medium text-slate-500">上传时间</span>
          <span title="关联素材视频上传至平台的时间段">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <div className="flex items-center gap-1 text-slate-400 font-mono pl-1">
            <Calendar className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="开始日期"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-16 text-center focus:outline-none bg-transparent placeholder-slate-300"
            />
            <span>至</span>
            <input
              type="text"
              placeholder="结束日期"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-16 text-center focus:outline-none bg-transparent placeholder-slate-300"
            />
          </div>
        </div>

        {/* Spend Time Filter */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs text-slate-600">
          <span className="font-medium text-slate-500">消耗时间</span>
          <span title="产生投流消耗数据的具体统计时间范围">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <div className="flex items-center gap-1 text-slate-700 font-mono font-medium pl-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>2026-06-26 至 2026-07-30</span>
          </div>
        </div>

        {/* Export Dropdown Button */}
        <div className="ml-auto">
          <button
            onClick={() => alert("🎉 已成功导出成片数据分析报表 (Excel)！")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <span>导出</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Metric Cards Container */}
      <div className="relative group">
        {/* Scrollable Cards Wrapper */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 px-1"
        >
          {metricCards.map((card) => (
            <div
              key={card.id}
              className="w-[145px] shrink-0 bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[68px] hover:border-purple-300 hover:shadow-xs transition-all relative group/card"
            >
              {/* Top Row: Value + Optional Help Icon */}
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-black text-slate-900 font-mono tracking-tight leading-none">
                  {card.value}
                </span>

                {card.hasHelp && (
                  <div className="relative group/tooltip">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-purple-600 cursor-pointer" />
                    <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/tooltip:block z-50 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl font-normal leading-normal whitespace-pre-wrap">
                      {card.helpText}
                    </div>
                  </div>
                )}

                {card.hasRedHelp && (
                  <div className="relative group/tooltip">
                    <HelpCircle className="w-3.5 h-3.5 text-red-500 fill-red-100 hover:text-red-600 cursor-pointer" />
                    <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/tooltip:block z-50 w-64 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl font-normal leading-relaxed whitespace-pre-wrap border border-slate-700">
                      {card.redHelpText}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Row: Label + Icon */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="truncate pr-1">{card.label}</span>
                <div className={`w-5 h-5 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 引用后所出成片列表 (Derived Finished Videos List) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-black text-slate-800">引用后所出成片列表</h4>
            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {DEFAULT_DERIVED_VIDEOS.length} 条
            </span>
          </div>
          <span className="text-[11px] text-slate-400">衍生视频数据实时同步中</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {DEFAULT_DERIVED_VIDEOS.map((v) => (
            <div
              key={v.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-purple-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                  <img src={v.coverUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-md">
                      <Play className="w-3.5 h-3.5 fill-purple-600 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                    {v.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                    {v.title}
                  </h5>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {v.authorAvatar && (
                      <img src={v.authorAvatar} alt={v.author} className="w-4 h-4 rounded-full object-cover" />
                    )}
                    <span className="font-medium text-slate-700">{v.author}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-slate-400">{v.date}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      v.status === "投放中" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Strip */}
              <div className="bg-white rounded-xl p-2 border border-slate-100 grid grid-cols-3 gap-1 text-center font-mono">
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">消耗</p>
                  <p className="text-xs font-extrabold text-slate-800">¥{v.cost}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">ROI</p>
                  <p className="text-xs font-extrabold text-purple-700">{v.roi}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">转化数</p>
                  <p className="text-xs font-extrabold text-blue-600">{v.conversions}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-[11px] font-bold pt-1 border-t border-slate-100/80">
                <button
                  onClick={() => alert(`🔍 正在查看【${v.title}】归因效果数据`)}
                  className="text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>查看成片数据</span>
                </button>
                <button
                  onClick={() => alert(`🔗 已复制成片分享链接`)}
                  className="text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
