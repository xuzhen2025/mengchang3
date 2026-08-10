import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  Check,
  HelpCircle,
  Search,
  X,
  ArrowUpDown,
  Download,
  Filter
} from "lucide-react";

interface CreationAnalyticsViewProps {
  showToast?: (title: string, desc: string) => void;
}

// 1. Types
type TopTab = "team" | "group" | "personal";
type MediaType = "all" | "finished" | "material" | "third_party" | "image" | "audio";
type ChartTab = "trend" | "proportion";
type ActionType = "upload" | "download" | "copy_capcut";

interface DetailedRow {
  id: string;
  dateRange: string;
  team: string;
  group?: string;
  name?: string;
  uploaderCount: number;
  uploadCount: number;
  downloadCount: number;
  downloadedPersonCount: number;
  pushedPersonCount: number;
  copiedCapcutCount: number;
  usageRate: number; // e.g. 59.57
  viralCount: number;
}

// 2. Mock Data
const INITIAL_DETAILED_DATA: DetailedRow[] = [
  {
    id: "1",
    dateRange: "2025-04-06-2025-04-21",
    team: "默认部门",
    group: "默认分组",
    name: "致上致上致上",
    uploaderCount: 1,
    uploadCount: 47,
    downloadCount: 120,
    downloadedPersonCount: 22,
    pushedPersonCount: 8,
    copiedCapcutCount: 12,
    usageRate: 59.57,
    viralCount: 0
  },
  {
    id: "2",
    dateRange: "2025-04-06-2025-04-21",
    team: "B部门",
    group: "抖音3组, 移动+",
    name: "汤小真",
    uploaderCount: 1,
    uploadCount: 6,
    downloadCount: 1,
    downloadedPersonCount: 0,
    pushedPersonCount: 1,
    copiedCapcutCount: 1,
    usageRate: 33.33,
    viralCount: 0
  },
  {
    id: "3",
    dateRange: "2025-04-06-2025-04-21",
    team: "Ian部门1",
    group: "Ian分组1",
    name: "Ian不同分组3",
    uploaderCount: 1,
    uploadCount: 3,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "4",
    dateRange: "2025-04-06-2025-04-21",
    team: "Ian部门1",
    group: "7-3分组2",
    name: "Ian同组5",
    uploaderCount: 1,
    uploadCount: 3,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "5",
    dateRange: "2025-04-06-2025-04-21",
    team: "7-20部门2",
    group: "7-20分组3",
    name: "zcl8",
    uploaderCount: 1,
    uploadCount: 3,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "6",
    dateRange: "2025-04-06-2025-04-21",
    team: "Ian部门1",
    group: "Ian分组1",
    name: "Ian同组",
    uploaderCount: 0,
    uploadCount: 0,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "7",
    dateRange: "2025-04-06-2025-04-21",
    team: "默认部门",
    group: "默认分组",
    name: "陈嘉",
    uploaderCount: 0,
    uploadCount: 0,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "8",
    dateRange: "2025-04-06-2025-04-21",
    team: "抖音",
    group: "抖音2组移动",
    name: "抖音1",
    uploaderCount: 0,
    uploadCount: 0,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  },
  {
    id: "9",
    dateRange: "2025-04-06-2025-04-21",
    team: "默认部门",
    group: "默认分组",
    name: "报表数据测试",
    uploaderCount: 0,
    uploadCount: 0,
    downloadCount: 0,
    downloadedPersonCount: 0,
    pushedPersonCount: 0,
    copiedCapcutCount: 0,
    usageRate: 0,
    viralCount: 0
  }
];

// Tree Data structure for Filter Dropdowns
const MOCK_TREE = [
  {
    teamName: "达人测试",
    groups: [
      {
        groupName: "测试F3",
        accounts: ["F1", "F2", "F3ontop", "品如", "珊珊"]
      },
      {
        groupName: "测试F2",
        accounts: ["Acc_1", "Acc_2"]
      }
    ]
  },
  {
    teamName: "小真测试部门",
    groups: [
      {
        groupName: "移动测试组",
        accounts: ["小真A", "小真B"]
      }
    ]
  },
  {
    teamName: "项目1",
    groups: [
      {
        groupName: "电商爆款组",
        accounts: ["项一主号", "项一备用"]
      }
    ]
  },
  {
    teamName: "RooooongZ部门",
    groups: [
      {
        groupName: "全量组",
        accounts: ["RongAccount_01"]
      }
    ]
  },
  {
    teamName: "xx素颜霜",
    groups: [
      {
        groupName: "美妆主组",
        accounts: ["美妆达人01"]
      }
    ]
  },
  {
    teamName: "抖音投放",
    groups: [
      {
        groupName: "抖音1组",
        accounts: ["抖音1"]
      }
    ]
  }
];

export default function CreationAnalyticsView({ showToast }: CreationAnalyticsViewProps) {
  // 1. Navigation States
  const [topTab, setTopTab] = useState<TopTab>("team");
  const [mediaType, setMediaType] = useState<MediaType>("all");

  // 2. Dropdown Filter Popover State
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [hoveredTeam, setHoveredTeam] = useState<string | null>("达人测试");
  const [hoveredGroup, setHoveredGroup] = useState<string | null>("测试F3");

  // 3. Time Controls
  const [timeAggregation, setTimeAggregation] = useState<string>("summary"); // "summary" | "daily" | "weekly" | "monthly"
  const [startDate, setStartDate] = useState<string>("2025-04-06");
  const [endDate, setEndDate] = useState<string>("2025-04-21");

  // 4. Chart Card States
  const [chartTab, setChartTab] = useState<ChartTab>("trend");
  const [chartExpanded, setChartExpanded] = useState<boolean>(true);
  const [actionType, setActionType] = useState<ActionType>("upload");
  const [topCount, setTopCount] = useState<string>("top5");
  const [hoveredChartPointIndex, setHoveredChartPointIndex] = useState<number | null>(0); // Default first point for tooltip matching Screenshot 1

  // 5. Table & Export States
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("uploadCount");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Toggle selection helpers
  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Label text for entity filter dropdown
  const getFilterDropdownLabel = () => {
    if (topTab === "team") {
      if (selectedTeams.length === 0) return "请选择部门";
      return `已选 ${selectedTeams.length} 个部门`;
    } else if (topTab === "group") {
      if (selectedGroups.length === 0) return "请选择分组";
      return `已选 ${selectedGroups.length} 个分组`;
    } else {
      if (selectedAccounts.length === 0) return "请选择账号";
      return `已选 ${selectedAccounts.length} 个账号`;
    }
  };

  // Chart Mock Points Data for Stacked Area
  const CHART_DATES = [
    "2025-04-06",
    "2025-04-08",
    "2025-04-10",
    "2025-04-12",
    "2025-04-14",
    "2025-04-16",
    "2025-04-18",
    "2025-04-20"
  ];

  // SVG Chart Dimensions
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Legend Teams/Groups/Persons
  const TEAMS_LEGEND = topTab === "personal"
    ? [
        { name: "小真A", color: "#6366F1" },
        { name: "项一主号", color: "#10B981" },
        { name: "RongAccount_01", color: "#F59E0B" },
        { name: "美妆达人01", color: "#EF4444" },
        { name: "抖音1", color: "#06B6D4" }
      ]
    : topTab === "group"
    ? [
        { name: "默认分组", color: "#6366F1" },
        { name: "移动测试组", color: "#10B981" },
        { name: "电商爆款组", color: "#F59E0B" },
        { name: "全量组", color: "#EF4444" },
        { name: "美妆主组", color: "#06B6D4" }
      ]
    : [
        { name: "默认部门", color: "#6366F1" },
        { name: "B部门", color: "#10B981" },
        { name: "Ian部门1", color: "#F59E0B" },
        { name: "7-20部门2", color: "#EF4444" },
        { name: "A部门", color: "#06B6D4" }
      ];

  // Y values for stacked area peak on 04-17 / 04-18
  const chartValuesByDate = [
    { date: "2025-04-06", default: 0, bTeam: 0, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-08", default: 1, bTeam: 3, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-10", default: 2, bTeam: 0, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-12", default: 1, bTeam: 0, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-14", default: 0, bTeam: 0, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-16", default: 6, bTeam: 0, ian1: 0, team720: 0, teamA: 0 },
    { date: "2025-04-18", default: 26, bTeam: 0, ian1: 6, team720: 3, teamA: 0 },
    { date: "2025-04-20", default: 1, bTeam: 0, ian1: 0, team720: 0, teamA: 0 }
  ];

  // X coordinate calculation
  const getX = (index: number) => {
    return paddingX + (index * (chartWidth - paddingX * 2)) / (CHART_DATES.length - 1);
  };

  // Y coordinate calculation (Max Y = 30)
  const getY = (val: number) => {
    const maxY = 30;
    return chartHeight - paddingY - (val / maxY) * (chartHeight - paddingY * 2);
  };

  // Build polygon path for Stacked Area
  const stackedPath = chartValuesByDate
    .map((item, i) => {
      const total = item.default + item.bTeam + item.ian1 + item.team720 + item.teamA;
      return `${i === 0 ? "M" : "L"} ${getX(i).toFixed(2)} ${getY(total).toFixed(2)}`;
    })
    .join(" ");

  const stackedAreaPath = `${stackedPath} L ${getX(CHART_DATES.length - 1).toFixed(2)} ${chartHeight - paddingY} L ${getX(0).toFixed(2)} ${chartHeight - paddingY} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-6 animate-fade-in">
      {/* ================= 1. Top Level Tabs: 部门数据 | 分组数据 | 个人数据 (Matches Screenshots 1, 2, 3, 4) ================= */}
      <div className="border-b border-slate-100 pb-2">
        <div className="flex items-center gap-8">
          {(
            [
              { key: "team", label: "部门数据" },
              { key: "group", label: "分组数据" },
              { key: "personal", label: "个人数据" }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setTopTab(tab.key);
                setShowFilterDropdown(false);
              }}
              className={`text-sm font-bold pb-2 relative cursor-pointer transition-colors ${
                topTab === tab.key ? "text-[#7C3AED]" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {topTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 2. Sub Filters & Dropdowns Bar (Matches Screenshots 1-4) ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Media Type Pills + Dropdown Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Media Type Pills */}
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            {(
              [
                { key: "all", label: "全部" },
                { key: "finished", label: "成片" },
                { key: "material", label: "素材" },
                { key: "third_party", label: "第三方" },
                { key: "image", label: "图片" },
                { key: "audio", label: "音频" }
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setMediaType(item.key)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  mediaType === item.key
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown Popover Button (Matches Screenshots 2, 3, 4) */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-3.5 py-1.5 bg-white border border-purple-300 text-slate-500 hover:border-purple-500 rounded-lg text-xs font-medium focus:outline-none flex items-center justify-between gap-3 min-w-[160px] cursor-pointer shadow-2xs"
            >
              <span className={getFilterDropdownLabel().includes("请选择") ? "text-slate-400" : "text-slate-800 font-bold"}>
                {getFilterDropdownLabel()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Popover Content */}
            {showFilterDropdown && (
              <div className="absolute left-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-40 animate-fade-in text-xs min-w-[220px]">
                {/* 1. If 团队数据 -> Checklist of Teams (Matches Screenshot 2) */}
                {topTab === "team" && (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {MOCK_TREE.map((t) => (
                      <label
                        key={t.teamName}
                        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700 font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(t.teamName)}
                          onChange={() => toggleSelection(selectedTeams, setSelectedTeams, t.teamName)}
                          className="rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                        />
                        <span>{t.teamName}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* 2. If 分组数据 -> Cascading List (Team > Group) (Matches Screenshot 3) */}
                {topTab === "group" && (
                  <div className="flex border border-slate-100 rounded-lg overflow-hidden">
                    {/* Left Column: Teams */}
                    <div className="w-36 bg-slate-50/70 divide-y divide-slate-100 border-r border-slate-100 max-h-60 overflow-y-auto">
                      {MOCK_TREE.map((t) => (
                        <div
                          key={t.teamName}
                          onMouseEnter={() => setHoveredTeam(t.teamName)}
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer font-medium ${
                            hoveredTeam === t.teamName
                              ? "bg-purple-50 text-[#7C3AED] font-bold"
                              : "text-slate-700 hover:bg-slate-100/60"
                          }`}
                        >
                          <span className="truncate">{t.teamName}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Right Column: Groups of Hovered Team */}
                    <div className="w-40 p-1 max-h-60 overflow-y-auto space-y-1">
                      {MOCK_TREE.find((t) => t.teamName === hoveredTeam)?.groups.map((g) => (
                        <label
                          key={g.groupName}
                          className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700 font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(g.groupName)}
                            onChange={() => toggleSelection(selectedGroups, setSelectedGroups, g.groupName)}
                            className="rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                          />
                          <span className="truncate">{g.groupName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. If 个人数据 -> 3-Level Cascading Tree (Matches Screenshot 4) */}
                {topTab === "personal" && (
                  <div className="flex border border-slate-100 rounded-lg overflow-hidden">
                    {/* Level 1: Teams */}
                    <div className="w-32 bg-slate-50/70 divide-y divide-slate-100 border-r border-slate-100 max-h-60 overflow-y-auto">
                      {MOCK_TREE.map((t) => (
                        <div
                          key={t.teamName}
                          onMouseEnter={() => {
                            setHoveredTeam(t.teamName);
                            setHoveredGroup(t.groups[0]?.groupName || null);
                          }}
                          className={`px-2.5 py-2 flex items-center justify-between cursor-pointer font-medium ${
                            hoveredTeam === t.teamName
                              ? "bg-purple-50 text-[#7C3AED] font-bold"
                              : "text-slate-700 hover:bg-slate-100/60"
                          }`}
                        >
                          <span className="truncate">{t.teamName}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Level 2: Groups */}
                    <div className="w-32 bg-white border-r border-slate-100 max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {MOCK_TREE.find((t) => t.teamName === hoveredTeam)?.groups.map((g) => (
                        <div
                          key={g.groupName}
                          onMouseEnter={() => setHoveredGroup(g.groupName)}
                          className={`px-2.5 py-2 flex items-center justify-between cursor-pointer font-medium ${
                            hoveredGroup === g.groupName
                              ? "bg-purple-50 text-[#7C3AED] font-bold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{g.groupName}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Level 3: Accounts */}
                    <div className="w-36 p-1 max-h-60 overflow-y-auto space-y-1">
                      {MOCK_TREE.find((t) => t.teamName === hoveredTeam)
                        ?.groups.find((g) => g.groupName === hoveredGroup)
                        ?.accounts.map((acc) => (
                          <label
                            key={acc}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700 font-medium"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(acc)}
                              onChange={() => toggleSelection(selectedAccounts, setSelectedAccounts, acc)}
                              className="rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                            />
                            <span className="truncate">{acc}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Time Aggregation Select & Date Range Picker */}
        <div className="flex items-center gap-3">
          {/* Time Aggregation Select: 汇总 ∨ */}
          <select
            value={timeAggregation}
            onChange={(e) => setTimeAggregation(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
          >
            <option value="summary">汇总</option>
            <option value="daily">按日</option>
            <option value="weekly">按周</option>
            <option value="monthly">按月</option>
          </select>

          {/* Date Picker Range */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
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

      {/* ================= 3. Chart Section ("时间趋势" | "占比分析") Matches Screenshot 1 ================= */}
      <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-2xs space-y-3">
        {/* Chart Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          {/* Tabs: 时间趋势 | 占比分析 */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setChartTab("trend")}
              className={`text-xs font-bold pb-1.5 relative cursor-pointer transition-colors ${
                chartTab === "trend" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              时间趋势
              {chartTab === "trend" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setChartTab("proportion")}
              className={`text-xs font-bold pb-1.5 relative cursor-pointer transition-colors ${
                chartTab === "proportion" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              占比分析
              {chartTab === "proportion" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setChartExpanded(!chartExpanded)}
            className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{chartExpanded ? "收起" : "展开"}</span>
            {chartExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Chart Body */}
        {chartExpanded && (
          <div className="space-y-4 pt-1">
            {/* Chart Action Buttons + Legend Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Action Pills: 上传 | 下载 | 复制到剪映 */}
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50/50">
                  {(
                    [
                      { key: "upload", label: "上传" },
                      { key: "download", label: "下载" },
                      { key: "copy_capcut", label: "复制到剪映" }
                    ] as const
                  ).map((act) => (
                    <button
                      key={act.key}
                      onClick={() => setActionType(act.key)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        actionType === act.key
                          ? "bg-[#7C3AED] text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Top Count Select: 显示top5 ∨ */}
                <select
                  value={topCount}
                  onChange={(e) => setTopCount(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="top5">显示top5</option>
                  <option value="top10">显示top10</option>
                  <option value="all">显示全部</option>
                </select>
              </div>

              {/* Legend List */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                {TEAMS_LEGEND.map((leg) => (
                  <div key={leg.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                      style={{ backgroundColor: leg.color }}
                    />
                    <span>{leg.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart Container (Matches Screenshot 1 Peak Area Chart) */}
            <div className="relative bg-slate-50/40 rounded-xl border border-slate-100 p-2 overflow-x-auto">
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                {/* Horizontal Grid Lines */}
                {[0, 5, 10, 15, 20, 25, 30].map((val) => (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={getY(val)}
                      x2={chartWidth - paddingX}
                      y2={getY(val)}
                      stroke="#E2E8F0"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={paddingX - 8}
                      y={getY(val) + 4}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {/* Dates on X Axis */}
                {CHART_DATES.map((d, i) => (
                  <text
                    key={d}
                    x={getX(i)}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {d}
                  </text>
                ))}

                {/* Stacked Blue Area Gradient */}
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Stacked Area Fill */}
                <path d={stackedAreaPath} fill="url(#blueGradient)" />

                {/* Stacked Top Stroke */}
                <path d={stackedPath} fill="none" stroke="#6366F1" strokeWidth={2} />

                {/* Data Points */}
                {chartValuesByDate.map((item, i) => {
                  const total = item.default + item.bTeam + item.ian1 + item.team720 + item.teamA;
                  const cx = getX(i);
                  const cy = getY(total);

                  return (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredChartPointIndex(i)}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={hoveredChartPointIndex === i ? 5 : 3}
                        fill="#6366F1"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Box (Matches Screenshot 1 Box on 2025-04-06) */}
              {hoveredChartPointIndex !== null && (
                <div
                  className="absolute bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 shadow-xl text-[11px] space-y-1 z-20 pointer-events-none"
                  style={{
                    left: `${Math.min(75, Math.max(10, (getX(hoveredChartPointIndex) / chartWidth) * 100))}%`,
                    top: "15%"
                  }}
                >
                  <div className="font-mono text-slate-400 pb-1 border-b border-slate-100">
                    {CHART_DATES[hoveredChartPointIndex]}
                  </div>
                  {TEAMS_LEGEND.map((t) => {
                    const item = chartValuesByDate[hoveredChartPointIndex];
                    const val =
                      t.name === "默认部门"
                        ? item.default
                        : t.name === "B部门"
                        ? item.bTeam
                        : t.name === "Ian部门1"
                        ? item.ian1
                        : t.name === "7-20部门2"
                        ? item.team720
                        : item.teamA;

                    return (
                      <div key={t.name} className="flex items-center justify-between gap-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                          <span className="text-slate-600">{t.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800">{val}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. Detailed Data Table ("详细数据") Matches Screenshots 1 & 5 ================= */}
      <div className="space-y-3 pt-2">
        {/* Table Header Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">详细数据</h3>

          <div className="flex items-center gap-2">
            {/* Export Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>导出数据</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 animate-fade-in text-xs">
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      if (showToast) showToast("导出成功", "详细创作数据已导出为 CSV");
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>导出 csv</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      if (showToast) showToast("导出成功", "详细创作数据已导出为 Excel");
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>导出 excel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Column Config Settings Button */}
            <button
              onClick={() => {
                if (showToast) showToast("表头设置", "您可在弹窗中勾选显示/隐藏特定数据列");
              }}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer shadow-2xs"
              title="设置表格列"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-2xs">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">数据时间</th>
                {topTab === "personal" && (
                  <>
                    <th className="py-3 px-4">姓名</th>
                    <th className="py-3 px-4">所属部门</th>
                    <th className="py-3 px-4">所属分组</th>
                  </>
                )}
                {topTab === "group" && (
                  <>
                    <th className="py-3 px-4">分组名称</th>
                    <th className="py-3 px-4">所属部门</th>
                  </>
                )}
                {topTab === "team" && <th className="py-3 px-4">部门名称</th>}

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>上传人数</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>上传次数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>下载次数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>被下载人数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>被推送人数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>被复制剪映人数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>作品被使用率</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>爆款视频数</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {INITIAL_DETAILED_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{row.dateRange}</td>
                  {topTab === "personal" && (
                    <>
                      <td className="py-3 px-4 font-bold text-[#7C3AED] whitespace-nowrap">{row.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">{row.team}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">{row.group || "默认分组"}</td>
                    </>
                  )}
                  {topTab === "group" && (
                    <>
                      <td className="py-3 px-4 font-bold text-[#7C3AED] whitespace-nowrap">{row.group || "默认分组"}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">{row.team}</td>
                    </>
                  )}
                  {topTab === "team" && (
                    <td className="py-3 px-4 font-bold text-[#7C3AED] whitespace-nowrap">{row.team}</td>
                  )}

                  <td className="py-3 px-4 text-center font-mono">{row.uploaderCount}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{row.uploadCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{row.downloadCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{row.downloadedPersonCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{row.pushedPersonCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{row.copiedCapcutCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{row.usageRate.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">{row.viralCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
