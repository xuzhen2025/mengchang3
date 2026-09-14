import React, { useState } from "react";
import { useReportData } from "../lib/useReportData";
import { grouped, ratio } from "../lib/analyticsData";
import { REPORT_START, REPORT_TODAY, REPORT_COLORS, fmt, money, percent, selectReportFacts, reportTotals, tagReportRow } from "../lib/reportDemoData";
import {
  Calendar,
  Download,
  ChevronDown,
  Filter,
  HelpCircle,
  ArrowUpDown,
  RotateCcw,
  Search,
  PieChart as PieChartIcon
} from "lucide-react";

interface TagAnalyticsViewProps {
  showToast?: (title: string, desc: string) => void;
}

export default function TagAnalyticsView({ showToast }: TagAnalyticsViewProps) {
  // Top Level Tab: 标签分析 | 潜力/当月爆款 | 使用数据
  const [activeMainTab, setActiveMainTab] = useState<"analytics" | "potential" | "usage">("analytics");

  // Platform sub-selector: 抖音 | 腾讯 | TikTok
  const [platform, setPlatform] = useState<"douyin" | "tencent" | "tiktok">("douyin");

  // Dropdown Selectors
  const [selectCategory, setSelectCategory] = useState("");
  const [selectTag, setSelectTag] = useState("");
  const [uploadStartDate, setUploadStartDate] = useState("");
  const [uploadEndDate, setUploadEndDate] = useState("");
  const [spendStartDate, setSpendStartDate] = useState(REPORT_START);
  const [spendEndDate, setSpendEndDate] = useState(REPORT_TODAY);

  // Hover state for Donut Slices
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Sorting state for Table
  const [sortField, setSortField] = useState<string>("spend");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const handleSort = (field: string) => { setSortAsc(sortField === field ? !sortAsc : false); setSortField(field); };

  const report = useReportData();
  const [applied, setApplied] = useState({ start: REPORT_START, end: REPORT_TODAY, uploadStart: "", uploadEnd: "", category: "", tag: "" });
  const tagGroup = report.tags.find(group => group.subTags.some(tag => tag.id === applied.tag)) || report.tags[0];
  const selected = selectReportFacts(report.facts, platform === "douyin" ? "巨量千川" : platform === "tencent" ? "腾讯ADQ" : "TikTok", applied)
    .filter(row => !applied.tag || Object.values(row.tags).includes(applied.tag));
  const total = tagReportRow(selected, "总计");
  const TOTAL_SPEND = reportTotals(selected).spend;
  const groupedTags = grouped(selected, row => row.tags[tagGroup?.id] || "");
  const INITIAL_TABLE_ROWS = groupedTags.map(([id, rows]) => tagReportRow(rows, tagGroup?.subTags.find(tag => tag.id === id)?.name || "未打标签")).sort((a, b) => {
    const numeric = (value: unknown) => Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
    return (sortAsc ? 1 : -1) * (numeric(a[sortField]) - numeric(b[sortField]));
  });
  const DONUT_SLICES = groupedTags.map(([id, rows], i) => ({ name: tagGroup?.subTags.find(tag => tag.id === id)?.name || "未打标签",
    val: reportTotals(rows).spend, ratio: percent(ratio(reportTotals(rows).spend, TOTAL_SPEND) * 100), color: REPORT_COLORS[i % REPORT_COLORS.length] }));
  const handleQuery = () => {
    if (!spendStartDate || !spendEndDate || spendStartDate > spendEndDate || (uploadStartDate && uploadEndDate && uploadStartDate > uploadEndDate)) { showToast?.("查询失败", "请选择有效的日期范围"); return; }
    setApplied({start: spendStartDate, end: spendEndDate, uploadStart: uploadStartDate, uploadEnd: uploadEndDate, category: selectCategory, tag: selectTag});
    if (showToast) {
      showToast("查询成功", `已更新【${platform === "douyin" ? "抖音" : platform === "tencent" ? "腾讯" : "TikTok"}】包含所选标签与时间的数据分析`);
    }
  };

  const handleReset = () => {
    setSelectCategory("");
    setApplied({ start: REPORT_START, end: REPORT_TODAY, uploadStart: "", uploadEnd: "", category: "", tag: "" });
    setSelectTag("");
    setUploadStartDate("");
    setUploadEndDate("");
    setSpendStartDate(REPORT_START);
    setSpendEndDate(REPORT_TODAY);
    if (showToast) {
      showToast("已重置", "筛选条件已重置为默认值");
    }
  };

  // SVG Donut Path calculations
  let accumulatedAngle = 0;
  const pieSlices = DONUT_SLICES.map((item, idx) => {
    const angle = TOTAL_SPEND ? (item.val / TOTAL_SPEND) * 360 : 0;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle = endAngle;

    const cx = 150;
    const cy = 150;
    const r = 115;
    const innerR = 72; // Generous hole for big text in screenshot 2

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

    // Mid angle for callout line anchor
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = ((midAngle - 90) * Math.PI) / 180;
    const labelX1 = cx + (r + 2) * Math.cos(midRad);
    const labelY1 = cy + (r + 2) * Math.sin(midRad);
    const labelX2 = cx + (r + 22) * Math.cos(midRad);
    const labelY2 = cy + (r + 22) * Math.sin(midRad);
    const isRightSide = Math.cos(midRad) >= 0;
    const labelX3 = isRightSide ? labelX2 + 20 : labelX2 - 20;

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
      midRad,
      labelX1,
      labelY1,
      labelX2,
      labelY2,
      labelX3,
      isRightSide,
    };
  });

  return (
    <div className="space-y-4">
      {/* ================= 1. Top Navigation Bar (Screenshot 1) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Main Tabs: 标签分析 | 潜力 / 当月爆款 | 使用数据 */}
        <div className="flex items-center gap-8 px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white">
          <button
            onClick={() => setActiveMainTab("analytics")}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              activeMainTab === "analytics" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            标签分析
            {activeMainTab === "analytics" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveMainTab("potential")}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              activeMainTab === "potential" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            潜力 / 当月爆款
            {activeMainTab === "potential" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveMainTab("usage")}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              activeMainTab === "usage" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            使用数据
            {activeMainTab === "usage" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>
        </div>

        {/* Platform Selector Buttons (抖音 | 腾讯 | TikTok) */}
        <div className="p-4 bg-slate-50/40 space-y-3">
          <div className="flex items-center gap-1.5 border border-slate-200/90 rounded-lg p-0.5 bg-white inline-flex shadow-2xs">
            <button
              onClick={() => setPlatform("douyin")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                platform === "douyin"
                  ? "bg-[#7C3AED] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/70"
              }`}
            >
              抖音
            </button>
            <button
              onClick={() => setPlatform("tencent")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                platform === "tencent"
                  ? "bg-[#7C3AED] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/70"
              }`}
            >
              腾讯
            </button>
            <button
              onClick={() => setPlatform("tiktok")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                platform === "tiktok"
                  ? "bg-[#7C3AED] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/70"
              }`}
            >
              TikTok
            </button>
          </div>

          {/* Filter Controls Bar (Dropdowns + Date Ranges) */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Select 1: Category Selector (一级分类 / 二级分类) */}
            <div className="relative">
              <select
                value={selectCategory}
                onChange={(e) => {
                  setSelectCategory(e.target.value);
                  setSelectTag(""); // reset tag selection when category changes
                }}
                className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[160px]"
              >
                <option value="">请选择分类</option>
                {report.categories.map(item => <optgroup key={item.id} label={item.name}><option value={item.name}>{item.name}</option>{item.children.map(child => <option key={child.id} value={child.name}>{child.name}</option>)}</optgroup>)}
              </select>
            </div>

            {/* Select 2: Tag Selector */}
            <div className="relative">
              <select
                value={selectTag}
                onChange={(e) => setSelectTag(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[170px]"
              >
                <option value="">请选择标签</option>
                {report.tags.map(group => <optgroup key={group.id} label={group.name}>{group.subTags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</optgroup>)}
              </select>
            </div>

            {/* Upload Time Range */}
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>上传时间:</span>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={uploadStartDate}
                  onChange={(e) => setUploadStartDate(e.target.value)}
                  placeholder="开始日期"
                  className="bg-transparent text-slate-700 outline-none w-24 cursor-pointer"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={uploadEndDate}
                  onChange={(e) => setUploadEndDate(e.target.value)}
                  placeholder="结束日期"
                  className="bg-transparent text-slate-700 outline-none w-24 cursor-pointer"
                />
              </div>
            </div>

            {/* Spend Time Range */}
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>消耗时间:</span>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={spendStartDate}
                  onChange={(e) => setSpendStartDate(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 outline-none w-26 cursor-pointer"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={spendEndDate}
                  onChange={(e) => setSpendEndDate(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 outline-none w-26 cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleQuery}
              className="px-5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              查询
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

      {/* ================= 2. Proportion Donut Chart Section (Screenshot 2) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">占比分析</h3>
          </div>
          <span className="text-xs text-slate-400">数据汇总范围: {spendStartDate} ~ {spendEndDate}</span>
        </div>

        {/* Large Prominent Donut Chart Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6">
          {/* SVG Donut with Callout Lines */}
          <div className="relative w-[360px] h-[360px] shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Donut Slices */}
              {pieSlices.map((slice, idx) => (
                <g key={idx}>
                  <path
                    d={slice.pathData}
                    fill={slice.color}
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredSlice === idx ? "opacity-100 scale-105 origin-center stroke-2 stroke-white" : "opacity-90 hover:opacity-100"
                    }`}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Center Big Number (as requested in Screenshot 2: 507441.37) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] font-bold text-slate-400">总消耗金额 (元)</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {TOTAL_SPEND.toFixed(2)}
              </span>
              <span className="text-[10px] text-purple-600 font-bold mt-0.5">多维对比看板</span>
            </div>
          </div>

          {/* Side Legend Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full">
            {pieSlices.map((slice, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  hoveredSlice === idx
                    ? "bg-purple-50/80 border-purple-200 shadow-2xs scale-[1.02]"
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 truncate">{slice.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-slate-900">¥{slice.val.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{slice.ratio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 3. Detailed Data Table Section (Screenshots 3, 4, 5) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Title Bar with Export button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">详细数据</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast && showToast("导出数据", "已导出全部数据列表表格 Excel")}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>导出</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Data Table with Full Columns matching screenshots 3, 4, 5 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[2200px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] whitespace-nowrap">
                <th className="py-3 px-4 font-bold sticky left-0 bg-slate-50 z-10 shadow-xs">模特姓名 / 标签</th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">视频数量 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">消耗 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">roi <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">成交金额 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">智能优惠券 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">电商平台补贴金额 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">转化数 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">转化率 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">转化成本 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">展示数 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">平均千次展现费用 <HelpCircle className="w-3 h-3 text-slate-400" /> <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">点击数 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">点击率 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">平均点击单价 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">播放量 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">3S完播率 <HelpCircle className="w-3 h-3 text-slate-400" /> <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">净成交金额 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">净成交订单数 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">净成交ROI <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3.5 font-bold text-right pr-5 cursor-pointer hover:text-slate-800">
                  <div className="inline-flex items-center gap-1">净成交订单成本 <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Total Row (第一行为“总计”) */}
              <tr className="bg-purple-50/60 border-b border-purple-100 text-slate-900 font-bold whitespace-nowrap">
                <td className="py-3.5 px-4 font-black text-slate-900 sticky left-0 bg-purple-50 z-10 shadow-xs">总计</td>
                <td className="py-3.5 px-3.5 text-right font-extrabold text-slate-900">{total.videoCount}</td>
                <td className="py-3.5 px-3.5 text-right font-black text-[#7C3AED]">{total.spend}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-emerald-600">{total.roi}</td>
                <td className="py-3.5 px-3.5 text-right font-extrabold text-slate-900">{total.salesAmount}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-700">{total.coupons}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-700">{total.subsidy}</td>
                <td className="py-3.5 px-3.5 text-right font-extrabold text-slate-900">{total.conversions}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-indigo-600">{total.cvr}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-900">{total.cpa}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{total.impressions}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{total.cpm}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{total.clicks}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-emerald-600">{total.ctr}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{total.cpc}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{total.views}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-indigo-600">{total.finishRate3s}</td>
                <td className="py-3.5 px-3.5 text-right font-black text-slate-900">{total.netSales}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-900">{total.netOrders}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-emerald-600">{total.netRoi}</td>
                <td className="py-3.5 px-3.5 text-right font-bold text-slate-900 pr-5">{total.netCpa}</td>
              </tr>

              {/* Data Rows */}
              {INITIAL_TABLE_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                  <td className="py-3.5 px-4 font-bold text-[#7C3AED] sticky left-0 bg-white z-10 shadow-xs">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{row.videoCount}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-slate-900">{row.spend}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-emerald-600">{row.roi}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{row.salesAmount}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.coupons}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.subsidy}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-slate-800">{row.conversions.toLocaleString()}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-indigo-600">{row.cvr}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-800">{row.cpa}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.impressions}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.cpm}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.clicks}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.ctr}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.cpc}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-600">{row.views}</td>
                  <td className="py-3.5 px-3.5 text-right text-indigo-600 font-bold">{row.finishRate3s}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-slate-900">{row.netSales}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-800">{row.netOrders.toLocaleString()}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-emerald-600">{row.netRoi}</td>
                  <td className="py-3.5 px-3.5 text-right text-slate-800 pr-5">{row.netCpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
