import React, { useState } from "react";
import { useReportData } from "../lib/useReportData";
import { REPORT_START, REPORT_TODAY, selectReportFacts, reportRows, reportTotals } from "../lib/reportDemoData";
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

export default function TencentReportView({ showToast }: TencentReportViewProps) {
  // 1. Top Tabs: 部门数据 | 分组数据 | 个人数据 (Reference Screenshot 1)
  const [topTab, setTopTab] = useState<"team" | "group" | "individual">("team");

  // 2. View Mode Toggle: 汇总 | 明细 (Reference Screenshot 1)
  const [viewMode, setViewMode] = useState<"summary" | "detail">("summary");

  // 3. Dropdown Filters
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(REPORT_START);
  const [endDate, setEndDate] = useState<string>(REPORT_TODAY);

  // 4. Export Menu Dropdown state (Reference Screenshot 2 & 3)
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 5. Pagination state
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 6. Sorting state
  const [sortField, setSortField] = useState<string>("spend");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const report = useReportData();
  const [applied, setApplied] = useState({ start: REPORT_START, end: REPORT_TODAY, entity: "", category: "" });
  const selected = selectReportFacts(report.facts, "腾讯ADQ", applied);
  let currentRows = reportRows(selected, viewMode === "detail" ? "detail" : topTab);
  const entityOptions = topTab === "team" ? report.tree.map(item => item.teamName) : topTab === "group" ? report.org.depts.filter(item => item.levelType === "group").map(item => item.name) : report.org.members.map(item => item.name);

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
  const avgFinish3s = reportTotals(selected).finish3s;

  // Perform sorting
  currentRows = [...currentRows].sort((a: any, b: any) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  React.useEffect(() => setCurrentPage(1), [topTab, viewMode, applied, pageSize]);

  const handleQuery = () => {
    if (!startDate || !endDate || startDate > endDate) { showToast?.("查询失败", "请选择有效的日期范围"); return; }
    setApplied({start: startDate, end: endDate, entity: selectedEntity, category: selectedCategory});
    setCurrentPage(1);
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
              setApplied(previous => ({ ...previous, entity: "" }));
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
              setApplied(previous => ({ ...previous, entity: "" }));
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
              setApplied(previous => ({ ...previous, entity: "" }));
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

            {/* Entity Selector (请选择部门 / 请选择分组 / 请选择个人) */}
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
                {entityOptions.map(name => <option key={name} value={name}>{name}</option>)}
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
                {report.categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
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
              {currentRows.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, idx) => (
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
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
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
            <button className="px-3 py-1 bg-[#7C3AED] text-white font-bold rounded-lg cursor-pointer">{currentPage}</button>
            <button
              disabled={currentPage * pageSize >= currentRows.length} onClick={() => setCurrentPage(p => p + 1)}
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
