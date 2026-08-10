import React, { useState } from "react";
import {
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Search,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  AlertTriangle,
  Layers,
  ShieldAlert,
  BarChart3,
  Compass,
  Filter,
  RotateCcw,
  Check,
  Download
} from "lucide-react";

interface PlatformTagsViewProps {
  showToast?: (title: string, desc: string) => void;
}

// Color palette matching the reference donut chart
const MATERIAL_TYPES = [
  {
    id: "first_release",
    name: "首发素材",
    color: "#4F46E5", // Indigo / Blue
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: Sparkles,
    count: 1280,
    countRatio: "28.5%",
    spend: 342800,
    spendRatio: "32.4%",
  },
  {
    id: "high_quality",
    name: "优质素材",
    color: "#EF4444", // Red / Coral
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    badgeColor: "bg-red-100 text-red-700",
    icon: Award,
    count: 860,
    countRatio: "19.1%",
    spend: 415200,
    spendRatio: "39.2%",
  },
  {
    id: "low_efficiency",
    name: "低效素材",
    color: "#8B5CF6", // Purple
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: AlertCircle,
    count: 940,
    countRatio: "20.9%",
    spend: 182500,
    spendRatio: "17.2%",
  },
  {
    id: "low_quality",
    name: "低质素材",
    color: "#F59E0B", // Amber / Yellow
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700",
    icon: AlertTriangle,
    count: 520,
    countRatio: "11.6%",
    spend: 68100,
    spendRatio: "6.4%",
  },
  {
    id: "homogeneity_severe",
    name: "同质化挤压严重素材",
    color: "#EC4899", // Pink
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    badgeColor: "bg-pink-100 text-pink-700",
    icon: Layers,
    count: 480,
    countRatio: "10.7%",
    spend: 32400,
    spendRatio: "3.1%",
  },
  {
    id: "homogeneity_risk",
    name: "同质化素材风险-排队投放素材",
    color: "#10B981", // Emerald / Green
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: ShieldAlert,
    count: 410,
    countRatio: "9.2%",
    spend: 17900,
    spendRatio: "1.7%",
  },
];

// Mock data rows for Detailed Table
const INITIAL_TABLE_ROWS = [
  {
    account: "广州千川官方号-01 (8821941)",
    entity: "广州某某网络科技有限公司",
    team: "华南电商一队",
    group: "直播二组",
    user: "张伟",
    cat1: "服饰鞋包",
    cat2: "女装短袖",
    totalMaterials: 1250,
    firstRelease: 380,
    firstReleaseRatio: "30.4%",
    firstReleaseSpend: "¥112,000",
    firstReleaseSpendRatio: "32.7%",
    highQuality: 240,
    highQualityRatio: "19.2%",
    highQualitySpend: "¥145,000",
    highQualitySpendRatio: "42.3%",
    lowEfficiency: 280,
    lowEfficiencyRatio: "22.4%",
    lowQuality: 150,
    lowQualityRatio: "12.0%",
    homogeneitySevere: 120,
    homogeneitySevereRatio: "9.6%",
    homogeneityRisk: 80,
    homogeneityRiskRatio: "6.4%",
  },
  {
    account: "杭州巨量千川-旗舰02 (9120482)",
    entity: "杭州电商服务有限公司",
    team: "华东数码二队",
    group: "信息流一组",
    user: "李娜",
    cat1: "3C数码",
    cat2: "智能耳机",
    totalMaterials: 980,
    firstRelease: 290,
    firstReleaseRatio: "29.6%",
    firstReleaseSpend: "¥89,500",
    firstReleaseSpendRatio: "31.0%",
    highQuality: 195,
    highQualityRatio: "19.9%",
    highQualitySpend: "¥118,200",
    highQualitySpendRatio: "41.0%",
    lowEfficiency: 210,
    lowEfficiencyRatio: "21.4%",
    lowQuality: 115,
    lowQualityRatio: "11.7%",
    homogeneitySevere: 95,
    homogeneitySevereRatio: "9.7%",
    homogeneityRisk: 75,
    homogeneityRiskRatio: "7.7%",
  },
  {
    account: "上海巨量广告-品牌01 (7739102)",
    entity: "上海传媒网络科技公司",
    team: "华东美妆一队",
    group: "品牌推广组",
    user: "王强",
    cat1: "美妆护肤",
    cat2: "精华面霜",
    totalMaterials: 1120,
    firstRelease: 310,
    firstReleaseRatio: "27.7%",
    firstReleaseSpend: "¥95,000",
    firstReleaseSpendRatio: "30.0%",
    highQuality: 220,
    highQualityRatio: "19.6%",
    highQualitySpend: "¥102,000",
    highQualitySpendRatio: "32.2%",
    lowEfficiency: 245,
    lowEfficiencyRatio: "21.9%",
    lowQuality: 135,
    lowQualityRatio: "12.1%",
    homogeneitySevere: 110,
    homogeneitySevereRatio: "9.8%",
    homogeneityRisk: 100,
    homogeneityRiskRatio: "8.9%",
  },
  {
    account: "北京千川测试户-05 (6652011)",
    entity: "北京互联网络有限公司",
    team: "华北综合队",
    group: "效果提升组",
    user: "刘洋",
    cat1: "食品饮料",
    cat2: "休闲零食",
    totalMaterials: 640,
    firstRelease: 180,
    firstReleaseRatio: "28.1%",
    firstReleaseSpend: "¥32,300",
    firstReleaseSpendRatio: "28.0%",
    highQuality: 125,
    highQualityRatio: "19.5%",
    highQualitySpend: "¥38,000",
    highQualitySpendRatio: "33.0%",
    lowEfficiency: 135,
    lowEfficiencyRatio: "21.1%",
    lowQuality: 80,
    lowQualityRatio: "12.5%",
    homogeneitySevere: 75,
    homogeneitySevereRatio: "11.7%",
    homogeneityRisk: 45,
    homogeneityRiskRatio: "7.0%",
  },
  {
    account: "深圳千川高爆户-08 (5510293)",
    entity: "深圳快消实业有限公司",
    team: "华南电商二队",
    group: "爆品孵化组",
    user: "陈晨",
    cat1: "家居百货",
    cat2: "个人护理",
    totalMaterials: 500,
    firstRelease: 120,
    firstReleaseRatio: "24.0%",
    firstReleaseSpend: "¥14,000",
    firstReleaseSpendRatio: "22.0%",
    highQuality: 80,
    highQualityRatio: "16.0%",
    highQualitySpend: "¥12,000",
    highQualitySpendRatio: "19.0%",
    lowEfficiency: 70,
    lowEfficiencyRatio: "14.0%",
    lowQuality: 40,
    lowQualityRatio: "8.0%",
    homogeneitySevere: 80,
    homogeneitySevereRatio: "16.0%",
    homogeneityRisk: 110,
    homogeneityRiskRatio: "22.0%",
  },
];

export default function PlatformTagsView({ showToast }: PlatformTagsViewProps) {
  // Top level platforms: 巨量千川 | 巨量广告
  const [platform, setPlatform] = useState<"qianchuan" | "oceanengine">("qianchuan");

  // Dimension level: 汇总 | 团队 | 分组 | 个人 | 广告账户
  const [dimension, setDimension] = useState<"summary" | "team" | "group" | "user" | "account">("summary");

  // Filters
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("2026-01-22");
  const [endDate, setEndDate] = useState("2026-01-24");

  // Collapse toggle for 占比分析
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tooltip hover/click
  const [showTooltip, setShowTooltip] = useState(false);

  // Active hover index on Pie Chart
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const handleQuery = () => {
    if (showToast) {
      showToast("查询成功", `已加载【${platform === "qianchuan" ? "巨量千川" : "巨量广告"}】维度数据 (${startDate} 至 ${endDate})`);
    }
  };

  const handleReset = () => {
    setCategory("all");
    setStartDate("2026-01-22");
    setEndDate("2026-01-24");
    if (showToast) {
      showToast("已重置", "已恢复默认筛选条件");
    }
  };

  // Generate SVG Pie Chart paths
  const totalCount = MATERIAL_TYPES.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativeAngle = 0;

  const pieSlices = MATERIAL_TYPES.map((item, index) => {
    const percentage = item.count / totalCount;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    // Convert polar coordinates to Cartesian
    const cx = 100;
    const cy = 100;
    const r = 75;
    const innerR = 42; // Donut style

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      `Z`,
    ].join(" ");

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <div className="space-y-4">
      {/* ================= 1. Platform & Dimension Tabs Bar ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Top Level Platforms (巨量千川 / 巨量广告) */}
        <div className="flex items-center gap-6 px-5 py-3 border-b border-slate-100 bg-white">
          <button
            onClick={() => setPlatform("qianchuan")}
            className={`flex items-center gap-2 font-bold text-sm transition-all cursor-pointer relative py-1 ${
              platform === "qianchuan"
                ? "text-[#7C3AED]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className={`p-1 rounded-md ${platform === "qianchuan" ? "bg-purple-100 text-[#7C3AED]" : "bg-slate-100 text-slate-400"}`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>巨量千川</span>
            {platform === "qianchuan" && (
              <span className="absolute bottom-[-12px] left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setPlatform("oceanengine")}
            className={`flex items-center gap-2 font-bold text-sm transition-all cursor-pointer relative py-1 ${
              platform === "oceanengine"
                ? "text-[#7C3AED]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className={`p-1 rounded-md ${platform === "oceanengine" ? "bg-purple-100 text-[#7C3AED]" : "bg-slate-100 text-slate-400"}`}>
              <Compass className="w-4 h-4" />
            </div>
            <span>巨量广告</span>
            {platform === "oceanengine" && (
              <span className="absolute bottom-[-12px] left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>
        </div>

        {/* Dimension Tabs & Filter Control Row */}
        <div className="p-4 bg-slate-50/50 space-y-3">
          {/* Dimension Selector Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "summary", label: "汇总" },
              { id: "team", label: "部门" },
              { id: "group", label: "分组" },
              { id: "user", label: "个人" },
              { id: "account", label: "广告账户" },
            ].map((d) => {
              const isActive = dimension === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDimension(d.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#7C3AED] border border-purple-300 shadow-2xs ring-1 ring-purple-100"
                      : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Select */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="all">请选择分类</option>
                  <option value="clothing">服饰鞋包</option>
                  <option value="beauty">美妆护肤</option>
                  <option value="digital">3C数码</option>
                  <option value="food">食品饮料</option>
                  <option value="home">家居百货</option>
                </select>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  消耗时间:
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleQuery}
                className="px-5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>查询</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>重置</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. 占比分析 (Proportion Analysis Panel) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">占比分析</h3>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-xs text-purple-600 font-bold hover:text-purple-700 cursor-pointer"
          >
            <span>{isCollapsed ? "展开" : "收起"}</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Content Body */}
        {!isCollapsed && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left side: 6 Material Quality Metric Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MATERIAL_TYPES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all flex items-start gap-3 shadow-2xs"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.bgColor} ${item.textColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500">
                        <div>
                          数量: <span className="font-bold text-slate-900">{item.count.toLocaleString()}</span>
                        </div>
                        <div>
                          数量占比: <span className="font-bold text-slate-900">{item.countRatio}</span>
                        </div>
                        <div>
                          消耗: <span className="font-bold text-slate-900">¥{item.spend.toLocaleString()}</span>
                        </div>
                        <div>
                          消耗占比: <span className="font-bold text-slate-900">{item.spendRatio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: SVG Donut Chart & Legends (5 cols) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 p-2 bg-slate-50/30 rounded-xl border border-slate-100">
              {/* Donut SVG */}
              <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {pieSlices.map((slice, idx) => (
                    <path
                      key={slice.id}
                      d={slice.pathData}
                      fill={slice.color}
                      className="transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-105 origin-center"
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  ))}
                </svg>
                {/* Center text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {hoveredSlice !== null ? (
                    <>
                      <span className="text-[10px] text-slate-400 font-bold">{pieSlices[hoveredSlice].name}</span>
                      <span className="text-sm font-black text-slate-900 mt-0.5">{pieSlices[hoveredSlice].count}</span>
                      <span className="text-[10px] font-bold text-purple-600">{pieSlices[hoveredSlice].percentage}%</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-400 font-bold">总素材数</span>
                      <span className="text-sm font-black text-slate-900 mt-0.5">{totalCount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 font-medium">六维类型</span>
                    </>
                  )}
                </div>
              </div>

              {/* Chart Legend List */}
              <div className="space-y-1.5 text-[11px] font-medium text-slate-600 flex-1 min-w-0">
                {pieSlices.map((slice, idx) => (
                  <div
                    key={slice.id}
                    className={`flex items-center gap-2 p-1 rounded-md transition-colors cursor-pointer ${
                      hoveredSlice === idx ? "bg-slate-200/60 text-slate-900 font-bold" : "hover:bg-slate-100"
                    }`}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate flex-1">{slice.name}</span>
                    <span className="font-mono text-slate-500 text-[10px] shrink-0">
                      {slice.count} ({slice.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. 详细数据 (Detailed Data Table Section) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 relative">
            <h3 className="text-sm font-bold text-slate-900">详细数据</h3>
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Tooltip Popup */}
            {showTooltip && (
              <div className="absolute top-6 left-16 z-30 w-72 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] leading-relaxed space-y-1 animate-fade-in pointer-events-none">
                <div className="font-bold text-purple-300">指标说明：</div>
                <div>• 首发素材：在该平台首次发布的原创素材。</div>
                <div>• 优质素材：高曝光与高转化率的标杆素材。</div>
                <div>• 低效/低质素材：ROI低于预期的受限素材。</div>
                <div>• 同质化挤压严重：素材重合度高导致排挤。</div>
              </div>
            )}
          </div>

          <button
            onClick={() => showToast && showToast("数据导出", "已开始导出详细数据 Excel 表格")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出表格</span>
          </button>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] whitespace-nowrap">
                <th className="py-3 px-3.5 font-bold">广告账户</th>
                <th className="py-3 px-3.5 font-bold">主体</th>
                <th className="py-3 px-3.5 font-bold">部门</th>
                <th className="py-3 px-3.5 font-bold">分组</th>
                <th className="py-3 px-3.5 font-bold">用户</th>
                <th className="py-3 px-3.5 font-bold">一级分类</th>
                <th className="py-3 px-3.5 font-bold">二级分类</th>
                <th className="py-3 px-3.5 font-bold text-right">总素材数</th>
                <th className="py-3 px-3.5 font-bold text-right">首发素材</th>
                <th className="py-3 px-3.5 font-bold text-right">首发素材消耗</th>
                <th className="py-3 px-3.5 font-bold text-right">优质素材</th>
                <th className="py-3 px-3.5 font-bold text-right">优质素材消耗</th>
                <th className="py-3 px-3.5 font-bold text-right">低效素材</th>
                <th className="py-3 px-3.5 font-bold text-right">低质素材</th>
                <th className="py-3 px-3.5 font-bold text-right">同质化挤压严重素材</th>
                <th className="py-3 px-3.5 font-bold text-right pr-4">同质化素材风险-排队投放素材</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Summary / Total Row (总计) */}
              <tr className="bg-purple-50/40 border-b border-purple-100/80 text-slate-900 font-bold text-xs whitespace-nowrap">
                <td className="py-3 px-3.5 text-slate-900 font-extrabold">总计</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-slate-400">--</td>
                <td className="py-3 px-3.5 text-right font-black text-[#7C3AED]">4,490</td>
                <td className="py-3 px-3.5 text-right font-bold">
                  <div>1,280</div>
                  <div className="text-[10px] text-slate-400 font-normal">28.5%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-slate-900">
                  <div>¥342,800</div>
                  <div className="text-[10px] text-slate-400 font-normal">32.4%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-emerald-600">
                  <div>860</div>
                  <div className="text-[10px] text-slate-400 font-normal">19.1%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-emerald-700">
                  <div>¥415,200</div>
                  <div className="text-[10px] text-slate-400 font-normal">39.2%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-purple-700">
                  <div>940</div>
                  <div className="text-[10px] text-slate-400 font-normal">20.9%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-amber-600">
                  <div>520</div>
                  <div className="text-[10px] text-slate-400 font-normal">11.6%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-pink-600">
                  <div>480</div>
                  <div className="text-[10px] text-slate-400 font-normal">10.7%</div>
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-emerald-600 pr-4">
                  <div>410</div>
                  <div className="text-[10px] text-slate-400 font-normal">9.2%</div>
                </td>
              </tr>

              {/* Dynamic Rows */}
              {INITIAL_TABLE_ROWS.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                  <td className="py-3 px-3.5 font-bold text-slate-800">{row.account}</td>
                  <td className="py-3 px-3.5 text-slate-600">{row.entity}</td>
                  <td className="py-3 px-3.5 text-slate-600">{row.team}</td>
                  <td className="py-3 px-3.5 text-slate-600">{row.group}</td>
                  <td className="py-3 px-3.5 text-slate-600">{row.user}</td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">{row.cat1}</td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">{row.cat2}</td>
                  <td className="py-3 px-3.5 text-right font-extrabold text-slate-900">{row.totalMaterials}</td>
                  <td className="py-3 px-3.5 text-right font-bold text-slate-800">
                    <div>{row.firstRelease}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.firstReleaseRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-slate-900">
                    <div>{row.firstReleaseSpend}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.firstReleaseSpendRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-600">
                    <div>{row.highQuality}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.highQualityRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-700">
                    <div>{row.highQualitySpend}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.highQualitySpendRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-purple-700">
                    <div>{row.lowEfficiency}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.lowEfficiencyRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-amber-600">
                    <div>{row.lowQuality}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.lowQualityRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-pink-600">
                    <div>{row.homogeneitySevere}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.homogeneitySevereRatio}</div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-600 pr-4">
                    <div>{row.homogeneityRisk}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.homogeneityRiskRatio}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
