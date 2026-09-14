import { useReportData } from "../lib/useReportData";
import { REPORT_START, REPORT_TODAY, selectReportFacts, reportRows } from "../lib/reportDemoData";
import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  Check,
  Search,
  Info
} from "lucide-react";

interface DeliveryReportViewProps {
  showToast?: (title: string, desc: string) => void;
}

export default function DeliveryReportView({ showToast }: DeliveryReportViewProps) {
  const report = useReportData();
  const [applied, setApplied] = useState({ start: REPORT_START, end: REPORT_TODAY, uploadStart: "", uploadEnd: "", category: "", entities: [] as string[] });
  // 1. Top Platform Sub-Tabs (巨量广告 | 巨量千川 | 磁力智投 | 磁力金牛 | 百度营销 | 小红书)
  const [platformTab, setPlatformTab] = useState<string>("巨量广告");

  // 2. Dimension Tabs (部门 | 分组 | 个人 | 明细 | 分日 | 分月)
  const [dimensionTab, setDimensionTab] = useState<"team" | "group" | "individual" | "detail" | "daily" | "monthly">("team");

  // 3. Creator/Operator Role Toggle (视频作者 | 下单运营)
  const [roleType, setRoleType] = useState<"author" | "operator">("author");

  // 4. Date Ranges
  const [uploadStartDate, setUploadStartDate] = useState<string>("");
  const [uploadEndDate, setUploadEndDate] = useState<string>("");
  const [deliveryStartDate, setDeliveryStartDate] = useState<string>(REPORT_START);
  const [deliveryEndDate, setDeliveryEndDate] = useState<string>(REPORT_TODAY);

  // 5. Dropdown Popover States
  const [isEntityOpen, setIsEntityOpen] = useState<boolean>(false);
  const [selectedEntityTitle, setSelectedEntityTitle] = useState<string>("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Cascading menu active hover paths
  const [hoveredTeam, setHoveredTeam] = useState<string>("");
  const [hoveredGroup, setHoveredGroup] = useState<string>("");

  // 6. Query Has Run State
  const [hasQueried, setHasQueried] = useState<boolean>(true);

  // 7. Export Dropdown Menu State
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 8. Sorting State
  const [sortField, setSortField] = useState<string>("spend");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // 9. Pagination
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  React.useEffect(() => setCurrentPage(1), [platformTab, dimensionTab, applied, pageSize]);

  const handleQuery = () => {
    if ((deliveryStartDate && deliveryEndDate && deliveryStartDate > deliveryEndDate) || (uploadStartDate && uploadEndDate && uploadStartDate > uploadEndDate)) return showToast?.("日期有误", "开始日期不能晚于结束日期");
    setApplied({ start: deliveryStartDate || REPORT_START, end: deliveryEndDate || REPORT_TODAY, uploadStart: uploadStartDate, uploadEnd: uploadEndDate, category: selectedCategory, entities: selectedTeams });
    setCurrentPage(1);
    setHasQueried(true);
    if (showToast) {
      showToast("查询成功", `已为您更新【${platformTab} - ${getDimensionLabel(dimensionTab)}】最新投放数据`);
    }
  };

  const handleExport = (type: "csv" | "excel") => {
    setShowExportMenu(false);
    if (showToast) {
      showToast(`导出${type.toUpperCase()}成功`, `已成功导出【${platformTab}_${getDimensionLabel(dimensionTab)}报表.${type}】`);
    }
  };

  const toggleTeamSelect = (name: string) => {
    if (selectedTeams.includes(name)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== name));
    } else {
      setSelectedTeams([...selectedTeams, name]);
    }
  };

  const getDimensionLabel = (dim: string) => {
    switch (dim) {
      case "team": return "部门";
      case "group": return "分组";
      case "individual": return "个人";
      case "detail": return "明细";
      case "daily": return "分日";
      case "monthly": return "分月";
      default: return "部门";
    }
  };

  const selectedFacts = selectReportFacts(report.facts, platformTab, applied).filter(row =>
    !applied.entities.length || applied.entities.some(entity => [row.department, row.group, row.person, `${row.department}-${row.group}`].includes(entity)));
  let rows: any[] = reportRows(selectedFacts, dimensionTab);

  // Calculate totals
  const totalSpend = rows.reduce((acc, r: any) => acc + (r.spend || 0), 0);
  const totalGmv = rows.reduce((acc, r: any) => acc + (r.totalGmv || 0), 0);
  const totalDeal = rows.reduce((acc, r: any) => acc + (r.dealAmount || 0), 0);
  const totalCoupon = rows.reduce((acc, r: any) => acc + (r.coupon || 0), 0);
  const totalConv = rows.reduce((acc, r: any) => acc + (r.conv || 0), 0);
  const totalImp = rows.reduce((acc, r: any) => acc + (r.imp || 0), 0);
  const totalClicks = rows.reduce((acc, r: any) => acc + (r.clicks || 0), 0);
  const totalViews = rows.reduce((acc, r: any) => acc + (r.views || 0), 0);

  const avgRoi = totalSpend > 0 ? totalGmv / totalSpend : 0;
  const avgCvr = totalClicks > 0 ? (totalConv / totalClicks) * 100 : 0;
  const avgCpa = totalConv > 0 ? totalSpend / totalConv : 0;
  const avgCpm = totalImp > 0 ? (totalSpend / totalImp) * 1000 : 0;
  const avgCtr = totalImp > 0 ? (totalClicks / totalImp) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

  // Sorting
  rows = [...rows].sort((a: any, b: any) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
  });

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
      {/* ================= 1. Top Platform Sub-Tabs (Screenshot 1: 巨量广告 | 巨量千川 | 磁力智投 | 磁力金牛 | 百度营销 | 小红书) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-8 px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white overflow-x-auto">
          {[
            "巨量广告",
            "巨量千川",
            "磁力智投",
            "磁力金牛",
            "百度营销",
            "小红书"
          ].map((pName) => (
            <button
              key={pName}
              onClick={() => {
                setPlatformTab(pName);
                if (showToast) showToast("切换渠道", `已切换至【${pName}】投放数据报表`);
              }}
              className={`text-sm font-bold pb-3 relative cursor-pointer whitespace-nowrap transition-all ${
                platformTab === pName ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {pName}
              {platformTab === pName && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ================= 2. Secondary Dimension Navigation Bar (Screenshot 1: 部门 | 分组 | 个人 | 明细 | 分日 | 分月) ================= */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {[
              { id: "team", label: "部门" },
              { id: "group", label: "分组" },
              { id: "individual", label: "个人" },
              { id: "detail", label: "明细" },
              { id: "daily", label: "分日" },
              { id: "monthly", label: "分月" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setDimensionTab(item.id as any);
                  setSelectedTeams([]);
                  setApplied(value => ({ ...value, entities: [] }));
                  setCurrentPage(1);
                }}
                className={`text-xs font-bold cursor-pointer transition-colors ${
                  dimensionTab === item.id ? "text-[#7C3AED]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Date Filters Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* 上传时间 */}
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>上传时间:</span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="date"
                  placeholder="开始日期"
                  value={uploadStartDate}
                  onChange={(e) => setUploadStartDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 outline-none w-26 cursor-pointer"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  placeholder="结束日期"
                  value={uploadEndDate}
                  onChange={(e) => setUploadEndDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 outline-none w-26 cursor-pointer"
                />
              </div>
            </div>

            {/* 投放时间 */}
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>投放时间:</span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={deliveryStartDate}
                  onChange={(e) => setDeliveryStartDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 outline-none w-26 cursor-pointer"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={deliveryEndDate}
                  onChange={(e) => setDeliveryEndDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 outline-none w-26 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. Header Action Bar (Role Pill + Dropdowns + Query + Export) ================= */}
        <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Role Toggle Pill Button (视频作者 | 下单运营) */}
            <div className="flex items-center border border-slate-200/90 rounded-lg p-0.5 bg-slate-50/50 shadow-2xs">
              <button
                onClick={() => setRoleType("author")}
                className={`px-3.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  roleType === "author"
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                视频作者
              </button>
              <button
                onClick={() => setRoleType("operator")}
                className={`px-3.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  roleType === "operator"
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                下单运营
              </button>
            </div>

            {/* Entity Select Cascading/Checkbox Dropdown Popover matching Screenshots 2, 3 & 4 */}
            <div className="relative">
              <button
                onClick={() => setIsEntityOpen(!isEntityOpen)}
                className={`pl-3 pr-8 py-1.5 text-xs bg-white border ${
                  isEntityOpen ? "border-[#7C3AED] ring-2 ring-purple-100" : "border-slate-200"
                } rounded-lg text-slate-700 font-medium focus:outline-none shadow-2xs cursor-pointer min-w-[170px] flex items-center justify-between gap-2`}
              >
                <span className={selectedTeams.length > 0 ? "text-slate-900 font-bold" : "text-slate-400"}>
                  {selectedTeams.length > 0
                    ? `已选 ${selectedTeams.length} 项`
                    : dimensionTab === "team"
                    ? "请选择部门"
                    : dimensionTab === "group"
                    ? "请选择分组"
                    : dimensionTab === "individual"
                    ? "请选择账号"
                    : "请选择筛选"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Entity Dropdown Popover Box (Exact layout as Screenshot 2, 3, 4) */}
              {isEntityOpen && (
                <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200/90 py-2 z-40 animate-fade-in flex">
                  {/* Mode A: Single-Level Checkbox List (When dimension is 'team', Screenshot 2) */}
                  {dimensionTab === "team" && (
                    <div className="w-56 max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {report.tree.map(t => t.teamName).map((tName) => (
                        <label
                          key={tName}
                          onClick={() => toggleTeamSelect(tName)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(tName)}
                            onChange={() => {}}
                            className="rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                          />
                          <span>{tName}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Mode B: 2-Level Cascading Menu (When dimension is 'group', Screenshot 3) */}
                  {dimensionTab === "group" && (
                    <div className="flex">
                      <div className="w-48 max-h-64 overflow-y-auto border-r border-slate-100">
                        {report.tree.map(t => t.teamName).map((gt) => (
                          <div
                            key={gt}
                            onMouseEnter={() => setHoveredTeam(gt)}
                            className={`flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium transition-colors ${
                              hoveredTeam === gt ? "bg-purple-50/60 text-[#7C3AED] font-bold" : "text-slate-700"
                            }`}
                          >
                            <span>{gt}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>

                      {/* Level 2 Groups */}
                      {hoveredTeam && (
                        <div className="w-44 max-h-64 overflow-y-auto bg-slate-50/30 p-2 space-y-1">
                          {(report.tree.find(t => t.teamName === hoveredTeam)?.groups.map(g => g.groupName) || []).map((grp) => (
                            <label
                              key={grp}
                              onClick={() => toggleTeamSelect(`${hoveredTeam}-${grp}`)}
                              className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-white rounded cursor-pointer text-xs text-slate-700 font-medium"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTeams.includes(`${hoveredTeam}-${grp}`)}
                                onChange={() => {}}
                                className="rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                              />
                              <span>{grp}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode C: 3-Level Cascading Menu (When dimension is 'individual', Screenshot 4) */}
                  {(dimensionTab === "individual" || dimensionTab === "detail" || dimensionTab === "daily" || dimensionTab === "monthly") && (
                    <div className="flex">
                      {/* Level 1 Teams */}
                      <div className="w-44 max-h-64 overflow-y-auto border-r border-slate-100">
                        {report.tree.map(t => t.teamName).map((t) => (
                          <div
                            key={t}
                            onMouseEnter={() => setHoveredTeam(t)}
                            className={`flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium transition-colors ${
                              hoveredTeam === t ? "bg-purple-50/60 text-[#7C3AED] font-bold" : "text-slate-700"
                            }`}
                          >
                            <span>{t}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>

                      {/* Level 2 Groups */}
                      {hoveredTeam && (
                        <div className="w-40 max-h-64 overflow-y-auto border-r border-slate-100 bg-slate-50/20">
                          {(report.tree.find(t => t.teamName === hoveredTeam)?.groups.map(g => g.groupName) || []).map((g) => (
                            <div
                              key={g}
                              onMouseEnter={() => setHoveredGroup(g)}
                              className={`flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium transition-colors ${
                                hoveredGroup === g ? "bg-purple-50/60 text-[#7C3AED] font-bold" : "text-slate-700"
                              }`}
                            >
                              <span>{g}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Level 3 Accounts */}
                      {hoveredGroup && (
                        <div className="w-36 max-h-64 overflow-y-auto p-2 bg-slate-50/50 space-y-1">
                          {(report.tree.find(t => t.teamName === hoveredTeam)?.groups.find(g => g.groupName === hoveredGroup)?.accounts || []).map((acc) => (
                            <label
                              key={acc}
                              onClick={() => toggleTeamSelect(acc)}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-white rounded cursor-pointer text-xs text-slate-700 font-medium"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTeams.includes(acc)}
                                onChange={() => {}}
                                className="rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                              />
                              <span>{acc}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category Select (请选择分类) */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
              >
                <option value="">请选择分类</option>
                {report.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {/* Query Button (查询) matching purple styling in Screenshot 1 */}
            <button
              onClick={handleQuery}
              className="px-5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              查询
            </button>

            {/* Export Dropdown Button (导出数据 ∨) */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>导出数据</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200/90 py-1 z-30 animate-fade-in">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>导出csv</span>
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>导出excel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Column Config Icon Button (图标按钮) */}
            <button
              onClick={() => {
                if (showToast) showToast("自定义表格列", "您可以自定义展示或隐藏表头字段");
              }}
              className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 4. Table Header & Data Content Area ================= */}
        <div className="overflow-x-auto min-h-[260px]">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-slate-50/90 border-y border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                <th className="py-3.5 px-6 font-bold">
                  {dimensionTab === "team"
                    ? "部门"
                    : dimensionTab === "group"
                    ? "分组"
                    : dimensionTab === "individual"
                    ? "账号"
                    : "明细名称 / 日期"}
                </th>
                <th onClick={() => handleSort("spend")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>消耗</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("roi")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>roi</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("totalGmv")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>总成交金额</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("dealAmount")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>成交金额</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("coupon")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>智能优惠券</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("conv")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>转化数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("cvr")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>转化率</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("cpa")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>转化成本</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("imp")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>展示数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("cpm")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>平均千次展现费用</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("clicks")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>点击数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("ctr")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>点击率</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("cpc")} className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>平均点击单价</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("views")} className="py-3.5 px-6 font-bold text-center cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="inline-flex items-center gap-1">
                    <span>播放量</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {!hasQueried ? (
                /* "请点击查询按钮查询" Prompt State matching Screenshot 1 */
                <tr>
                  <td colSpan={15} className="py-16 text-center text-[#EF4444] font-medium text-xs">
                    请点击查询按钮查询
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-12 text-center text-slate-400">
                    暂无符合条件的数据
                  </td>
                </tr>
              ) : (
                <>
                  {/* Aggregated Total Row (总计) */}
                  <tr className="bg-purple-50/50 border-b border-purple-100 font-bold text-slate-900 whitespace-nowrap">
                    <td className="py-3.5 px-6 font-black text-slate-900">总计</td>
                    <td className="py-3.5 px-3 text-center font-bold text-[#7C3AED]">
                      {totalSpend.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-rose-600">
                      {avgRoi.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-800">
                      ¥{totalGmv.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-800">
                      ¥{totalDeal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">
                      ¥{totalCoupon.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-800">
                      {totalConv.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-indigo-600">
                      {avgCvr.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-800">
                      ¥{avgCpa.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">
                      {totalImp.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">
                      ¥{avgCpm.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">
                      {totalClicks.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                      {avgCtr.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">
                      ¥{avgCpc.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-slate-700">
                      {totalViews.toLocaleString()}
                    </td>
                  </tr>

                  {/* Individual Data Rows */}
                  {rows.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row: any, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                      <td className="py-3 px-6 font-bold text-[#7C3AED]">
                        {row.name || row.groupName || row.account || "测试条目"}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {row.spend.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-600">
                        {row.roi.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        ¥{row.totalGmv.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        ¥{row.dealAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        ¥{row.coupon.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        {row.conv.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-indigo-600">
                        {row.cvr.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        ¥{row.cpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {row.imp.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        ¥{row.cpm.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {row.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">
                        {row.ctr.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        ¥{row.cpc.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-center text-slate-600">
                        {row.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Horizontal Grey Separator Bar (Matching screenshot bottom bar) */}
        <div className="h-1.5 bg-slate-200/80 mx-4 rounded-full my-2" />

        {/* ================= 5. Footer Pagination Bar ================= */}
        <div className="flex flex-wrap items-center justify-end gap-4 px-6 py-3.5 bg-white border-t border-slate-100 text-xs text-slate-500">
          <div>共 {hasQueried ? rows.length : 0} 条</div>

          {/* Page Size Select */}
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

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
            >
              &lt;
            </button>
            <button className="px-3 py-1 bg-[#7C3AED] text-white font-bold rounded-lg cursor-pointer">{currentPage}</button>
            <button
              disabled={currentPage * pageSize >= rows.length} onClick={() => setCurrentPage(p => p + 1)}
              className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
            >
              &gt;
            </button>
          </div>

          {/* Go to page */}
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
