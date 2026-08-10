import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  RotateCcw
} from "lucide-react";

interface TencentReportViewProps {
  showToast?: (title: string, desc: string) => void;
}

// Mock Datasets for Team, Group, and Individual views in Summary (汇总) and Detail (明细) modes
const TEAM_SUMMARY = [
  { name: "默认部门", spend: 128450.50, conv: 4210, cvr: 4.12, cpa: 30.50, imp: 2450000, clicks: 98200, ctr: 4.01, cpc: 1.31, views: 2100000, finish3s: 22.5 },
  { name: "华南电商一队", spend: 96200.80, conv: 3120, cvr: 3.95, cpa: 30.83, imp: 1820000, clicks: 74620, ctr: 4.10, cpc: 1.29, views: 1560000, finish3s: 21.2 },
  { name: "华东投放二队", spend: 84300.00, conv: 2680, cvr: 3.78, cpa: 31.45, imp: 1590000, clicks: 62010, ctr: 3.90, cpc: 1.36, views: 1320000, finish3s: 20.4 },
  { name: "海外品牌推广组", spend: 52100.20, conv: 1540, cvr: 3.45, cpa: 33.83, imp: 1020000, clicks: 35700, ctr: 3.50, cpc: 1.46, views: 880000, finish3s: 18.5 },
];

const GROUP_SUMMARY = [
  { name: "默认分组", spend: 68450.00, conv: 2150, cvr: 4.05, cpa: 31.83, imp: 1350000, clicks: 54000, ctr: 4.00, cpc: 1.26, views: 1150000, finish3s: 23.0 },
  { name: "视频号攻坚组", spend: 142000.50, conv: 4850, cvr: 4.35, cpa: 29.27, imp: 2850000, clicks: 128250, ctr: 4.50, cpc: 1.10, views: 2450000, finish3s: 25.4 },
  { name: "朋友圈高ROI组", spend: 115000.00, conv: 3900, cvr: 4.20, cpa: 29.48, imp: 2100000, clicks: 88200, ctr: 4.20, cpc: 1.30, views: 1800000, finish3s: 21.8 },
  { name: "公众号搜一搜组", spend: 35600.00, conv: 1020, cvr: 3.30, cpa: 34.90, imp: 680000, clicks: 23800, ctr: 3.50, cpc: 1.49, views: 520000, finish3s: 17.2 },
];

const INDIVIDUAL_SUMMARY = [
  { name: "张伟 (投手A)", spend: 112000.00, conv: 3820, cvr: 4.25, cpa: 29.31, imp: 2200000, clicks: 96800, ctr: 4.40, cpc: 1.15, views: 1950000, finish3s: 24.1 },
  { name: "李娜 (投手B)", spend: 98500.50, conv: 3250, cvr: 4.02, cpa: 30.30, imp: 1900000, clicks: 77900, ctr: 4.10, cpc: 1.26, views: 1620000, finish3s: 22.0 },
  { name: "王磊 (创意组长)", spend: 81200.00, conv: 2540, cvr: 3.75, cpa: 31.96, imp: 1540000, clicks: 58520, ctr: 3.80, cpc: 1.38, views: 1310000, finish3s: 19.8 },
  { name: "赵敏 (高级优化师)", spend: 69300.00, conv: 2100, cvr: 3.60, cpa: 33.00, imp: 1320000, clicks: 47520, ctr: 3.60, cpc: 1.45, views: 1090000, finish3s: 18.9 },
];

// Detail Mode data (明细数据)
const DETAIL_ROWS = [
  { name: "TX_微信朋友圈_爆款二创01 (计划1029)", spend: 32450.50, conv: 1120, cvr: 4.25, cpa: 28.97, imp: 620000, clicks: 26350, ctr: 4.25, cpc: 1.23, views: 540000, finish3s: 24.5 },
  { name: "TX_微信视频号_美妆推介03 (计划1034)", spend: 48900.00, conv: 1680, cvr: 4.52, cpa: 29.10, imp: 950000, clicks: 42750, ctr: 4.50, cpc: 1.14, views: 820000, finish3s: 26.2 },
  { name: "TX_腾讯优量汇_信息流追投 (计划1058)", spend: 18300.20, conv: 520, cvr: 3.20, cpa: 35.19, imp: 410000, clicks: 13940, ctr: 3.40, cpc: 1.31, views: 330000, finish3s: 17.8 },
  { name: "TX_公众号搜一搜_品牌词拉新 (计划1062)", spend: 12500.00, conv: 380, cvr: 3.45, cpa: 32.89, imp: 280000, clicks: 9800, ctr: 3.50, cpc: 1.27, views: 220000, finish3s: 19.1 },
  { name: "TX_视频号原生_痛点抓手02 (计划1071)", spend: 28600.00, conv: 940, cvr: 4.10, cpa: 30.42, imp: 540000, clicks: 22680, ctr: 4.20, cpc: 1.26, views: 470000, finish3s: 23.0 },
];

export default function TencentReportView({ showToast }: TencentReportViewProps) {
  // 1. Top Tabs: 团队数据 | 分组数据 | 个人数据 (Reference Screenshot 1)
  const [topTab, setTopTab] = useState<"team" | "group" | "individual">("team");

  // 2. View Mode Toggle: 汇总 | 明细 (Reference Screenshot 1)
  const [viewMode, setViewMode] = useState<"summary" | "detail">("summary");

  // 3. Dropdown Filters
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("2022-04-27");
  const [endDate, setEndDate] = useState<string>("2025-05-12");

  // 4. Export Menu Dropdown state (Reference Screenshot 2 & 3)
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 5. Pagination state
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 6. Sorting state
  const [sortField, setSortField] = useState<string>("spend");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Determine current active rows
  const getRawRows = () => {
    if (viewMode === "detail") return DETAIL_ROWS;
    if (topTab === "team") return TEAM_SUMMARY;
    if (topTab === "group") return GROUP_SUMMARY;
    return INDIVIDUAL_SUMMARY;
  };

  // Filter & Sort rows
  let currentRows = getRawRows().filter((row) => {
    if (selectedEntity && !row.name.includes(selectedEntity)) return false;
    return true;
  });

  // Calculate Aggregated Totals Row (总计)
  const totalSpend = currentRows.reduce((acc, r) => acc + r.spend, 0);
  const totalConv = currentRows.reduce((acc, r) => acc + r.conv, 0);
  const totalImp = currentRows.reduce((acc, r) => acc + r.imp, 0);
  const totalClicks = currentRows.reduce((acc, r) => acc + r.clicks, 0);
  const totalViews = currentRows.reduce((acc, r) => acc + r.views, 0);

  const avgCvr = totalClicks > 0 ? (totalConv / totalClicks) * 100 : 0;
  const avgCpa = totalConv > 0 ? totalSpend / totalConv : 0;
  const avgCtr = totalImp > 0 ? (totalClicks / totalImp) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgFinish3s = currentRows.length > 0 ? currentRows.reduce((a, r) => a + r.finish3s, 0) / currentRows.length : 0;

  // Perform sorting
  currentRows = [...currentRows].sort((a: any, b: any) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleQuery = () => {
    if (showToast) {
      showToast("查询完成", `已加载【${topTab === "team" ? "部门" : topTab === "group" ? "分组" : "个人"}】在 ${startDate} 至 ${endDate} 期间的${viewMode === "summary" ? "汇总" : "明细"}数据`);
    }
  };

  const handleExport = (type: "csv" | "excel") => {
    setShowExportMenu(false);
    if (showToast) {
      showToast(`导出${type.toUpperCase()}成功`, `已成功生成并下载【腾讯投放_${viewMode === "summary" ? "汇总" : "明细"}报表.${type}】文件`);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= 1. Top Navigation & Filters Bar (Screenshot 1) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Top Tabs: 部门数据 | 分组数据 | 个人数据 */}
        <div className="flex items-center gap-8 px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white">
          <button
            onClick={() => {
              setTopTab("team");
              setSelectedEntity("");
            }}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              topTab === "team" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            部门数据
            {topTab === "team" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setTopTab("group");
              setSelectedEntity("");
            }}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              topTab === "group" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            分组数据
            {topTab === "group" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setTopTab("individual");
              setSelectedEntity("");
            }}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-all ${
              topTab === "individual" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            个人数据
            {topTab === "individual" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
            )}
          </button>
        </div>

        {/* Sub Filter Controls Row (Exact match to Screenshot 1) */}
        <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Toggle Buttons: 汇总 | 明细 */}
            <div className="flex items-center border border-slate-200/90 rounded-lg p-0.5 bg-slate-50/50 shadow-2xs">
              <button
                onClick={() => setViewMode("summary")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === "summary"
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                汇总
              </button>
              <button
                onClick={() => setViewMode("detail")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === "detail"
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                明细
              </button>
            </div>

            {/* Entity Selector (请选择团队 / 请选择分组 / 请选择个人) */}
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[170px]"
              >
                <option value="">
                  {topTab === "team"
                    ? "请选择部门"
                    : topTab === "group"
                    ? "请选择分组"
                    : "请选择个人"}
                </option>
                {topTab === "team" && (
                  <>
                    <option value="默认部门">默认部门</option>
                    <option value="华南电商一队">华南电商一队</option>
                    <option value="华东投放二队">华东投放二队</option>
                    <option value="海外品牌推广组">海外品牌推广组</option>
                  </>
                )}
                {topTab === "group" && (
                  <>
                    <option value="默认分组">默认分组</option>
                    <option value="视频号攻坚组">视频号攻坚组</option>
                    <option value="朋友圈高ROI组">朋友圈高ROI组</option>
                    <option value="公众号搜一搜组">公众号搜一搜组</option>
                  </>
                )}
                {topTab === "individual" && (
                  <>
                    <option value="张伟">张伟 (投手A)</option>
                    <option value="李娜">李娜 (投手B)</option>
                    <option value="王磊">王磊 (创意组长)</option>
                    <option value="赵敏">赵敏 (高级优化师)</option>
                  </>
                )}
              </select>
            </div>

            {/* Category Filter (请选择) */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[160px]"
              >
                <option value="">请选择</option>
                <option value="cat1">一级分类：核心投放渠道</option>
                <option value="cat2">二级分类：微信朋友圈与视频号</option>
                <option value="cat3">按转化类型：导购下单/留资</option>
              </select>
            </div>

            {/* Query Button (查询) */}
            <button
              onClick={handleQuery}
              className="px-5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              查询
            </button>
          </div>

          {/* Date Picker Range (Right aligned in Screenshot 1: 2022-04-27 至 2025-05-12) */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium outline-none w-26 cursor-pointer"
            />
            <span className="text-xs text-slate-400 font-medium">至</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium outline-none w-26 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ================= 2. Data Table Card (Screenshots 2 & 3) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Title & Export Data Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-base font-bold text-slate-900">
            {viewMode === "summary" ? "汇总数据" : "明细数据"}
          </h3>

          {/* Dropdown Export Button (导出数据 ∨) matching Screenshot 2 & 3 */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-2"
            >
              <span>导出数据</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Export Menu Dropdown */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-30 animate-fade-in">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>导出csv</span>
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>导出excel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                <th className="py-3.5 px-6 font-bold">
                  {viewMode === "detail"
                    ? "计划名称 / 账户"
                    : topTab === "team"
                    ? "部门"
                    : topTab === "group"
                    ? "分组"
                    : "个人"}
                </th>
                <th
                  onClick={() => handleSort("spend")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>消耗</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("conv")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>转化数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("cvr")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>转化率</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("cpa")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>转化成本</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("imp")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>展示数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("clicks")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>点击数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("ctr")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>点击率</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("cpc")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>平均点击单价</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("views")}
                  className="py-3.5 px-4 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>播放量</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("finish3s")}
                  className="py-3.5 px-6 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>3S完播率</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Total Row (第一行为“总计”，Matching Screenshot 2 & 3) */}
              <tr className="bg-purple-50/50 border-b border-purple-100 text-slate-900 font-bold whitespace-nowrap">
                <td className="py-4 px-6 font-black text-slate-900">总计</td>
                <td className="py-4 px-4 text-center font-black text-[#7C3AED]">
                  {totalSpend.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-center font-bold text-slate-800">
                  {totalConv.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center font-bold text-indigo-600">
                  {avgCvr.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-center font-bold text-slate-800">
                  ¥{avgCpa.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-center text-slate-700">
                  {totalImp.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center text-slate-700">
                  {totalClicks.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center font-bold text-emerald-600">
                  {avgCtr.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-center text-slate-700">
                  {avgCpc.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-center text-slate-700">
                  {totalViews.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center font-bold text-indigo-600">
                  {avgFinish3s.toFixed(1)}%
                </td>
              </tr>

              {/* Data Rows */}
              {currentRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors whitespace-nowrap"
                >
                  <td className="py-3.5 px-6 font-bold text-[#7C3AED]">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {row.spend.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700">
                    {row.conv.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-600">
                    {row.cvr.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700">
                    ¥{row.cpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {row.imp.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                    {row.ctr.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {row.cpc.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {row.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-center text-slate-700 font-bold">
                    {row.finish3s.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= 3. Pagination Footer Bar (Exact from Screenshot 2 & 3) ================= */}
        <div className="flex flex-wrap items-center justify-end gap-4 px-6 py-3.5 bg-white border-t border-slate-100 text-xs text-slate-500">
          <div>共 {currentRows.length} 条</div>

          {/* Page Size Dropdown */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </select>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent font-bold cursor-pointer"
            >
              &lt;
            </button>
            <button className="px-3 py-1 bg-[#7C3AED] text-white font-bold rounded-lg cursor-pointer">
              1
            </button>
            <button
              disabled
              className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
            >
              &gt;
            </button>
          </div>

          {/* Go to Page */}
          <div className="flex items-center gap-1.5">
            <span>前往</span>
            <input
              type="text"
              defaultValue="1"
              className="w-10 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-purple-500"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
}
