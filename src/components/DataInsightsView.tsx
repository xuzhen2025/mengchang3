import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  X,
  Sparkles,
  Users,
  User,
  ShieldCheck,
  Award,
  BarChart3,
  TrendingUp,
  Check,
  HelpCircle,
  Zap,
  ArrowRight
} from "lucide-react";

interface DataInsightsViewProps {
  showToast?: (title: string, desc: string) => void;
}

// 1. Radar Chart Axis Definitions
const RADAR_AXES = [
  { key: "spend", label: "消耗力", fullMark: 100 },
  { key: "contribution", label: "贡献度", fullMark: 100 },
  { key: "diversity", label: "多样性", fullMark: 100 },
  { key: "viralRate", label: "爆片率", fullMark: 100 },
  { key: "diligence", label: "勤奋度", fullMark: 100 },
  { key: "creativity", label: "创造力", fullMark: 100 }
];

// Mock Personal Data Series
const PERSONAL_PROFILES: Record<
  string,
  {
    name: string;
    radar: Record<string, number>; // values 0-100
    dataAnalysis: Record<string, { valA: number | string; valB: number | string }>;
    taskAnalysis: Record<string, { valA: number | string; valB: number | string }>;
  }
> = {
  "致上致上致上": {
    name: "致上致上致上",
    radar: {
      spend: 35,
      contribution: 82,
      diversity: 40,
      viralRate: 45,
      diligence: 88,
      creativity: 85
    },
    dataAnalysis: {
      "成片消耗": { valA: "¥0", valB: "¥0" },
      "成交金额": { valA: "¥0", valB: "¥0" },
      "ROI": { valA: 0, valB: 0 },
      "上传作品（成片）": { valA: 0, valB: 44 },
      "上传作品（素材）": { valA: 0, valB: 0 },
      "上传作品（第三方）": { valA: 0, valB: 0 },
      "上传作品（图片）": { valA: 0, valB: 0 },
      "上传作品（文案）": { valA: 0, valB: 0 },
      "上传作品（音视频）": { valA: 0, valB: 0 },
      "上传作品（脚本）": { valA: 0, valB: 5 },
      "下载作品数": { valA: 0, valB: 4 },
      "推送他人作品数": { valA: 0, valB: 214 },
      "复制他人作品到剪映数": { valA: 0, valB: 2 },
      "作品被多少人下载": { valA: 0, valB: 5 },
      "作品被多少人复制到剪映": { valA: 0, valB: 2 },
      "作品被多少人推送": { valA: 0, valB: 32 }
    },
    taskAnalysis: {
      "发布任务数": { valA: 0, valB: 1 },
      "被指派任务数": { valA: 0, valB: 0 },
      "发布的任务（已达标）": { valA: 0, valB: 0 },
      "发布的任务（待完成）": { valA: 0, valB: 1 },
      "发布的任务（下单数）": { valA: 0, valB: 3 },
      "发布的任务（出片数）": { valA: 0, valB: 0 },
      "被指派的任务（已达标）": { valA: 0, valB: 0 },
      "被指派的任务（待完成）": { valA: 0, valB: 0 },
      "被指派的任务（下单数）": { valA: 0, valB: 0 },
      "被指派的任务（出片数）": { valA: 0, valB: 0 }
    }
  },
  "抖音1": {
    name: "抖音1",
    radar: {
      spend: 48,
      contribution: 42,
      diversity: 50,
      viralRate: 38,
      diligence: 45,
      creativity: 30
    },
    dataAnalysis: {
      "成片消耗": { valA: "¥0", valB: "¥0" },
      "成交金额": { valA: "¥0", valB: "¥0" },
      "ROI": { valA: 0, valB: 0 },
      "上传作品（成片）": { valA: 12, valB: 28 },
      "上传作品（素材）": { valA: 0, valB: 0 },
      "上传作品（第三方）": { valA: 0, valB: 0 },
      "上传作品（图片）": { valA: 0, valB: 0 },
      "上传作品（文案）": { valA: 0, valB: 0 },
      "上传作品（音视频）": { valA: 0, valB: 0 },
      "上传作品（脚本）": { valA: 2, valB: 3 },
      "下载作品数": { valA: 1, valB: 3 },
      "推送他人作品数": { valA: 45, valB: 120 },
      "复制他人作品到剪映数": { valA: 1, valB: 1 },
      "作品被多少人下载": { valA: 2, valB: 3 },
      "作品被多少人复制到剪映": { valA: 1, valB: 1 },
      "作品被多少人推送": { valA: 10, valB: 22 }
    },
    taskAnalysis: {
      "发布任务数": { valA: 0, valB: 1 },
      "被指派任务数": { valA: 0, valB: 0 },
      "发布的任务（已达标）": { valA: 0, valB: 0 },
      "发布的任务（待完成）": { valA: 0, valB: 1 },
      "发布的任务（下单数）": { valA: 0, valB: 2 },
      "发布的任务（出片数）": { valA: 0, valB: 0 },
      "被指派的任务（已达标）": { valA: 0, valB: 0 },
      "被指派的任务（待完成）": { valA: 0, valB: 0 },
      "被指派的任务（下单数）": { valA: 0, valB: 0 },
      "被指派的任务（出片数）": { valA: 0, valB: 0 }
    }
  }
};

// Mock Group Profiles
const GROUP_PROFILES: Record<
  string,
  {
    name: string;
    radar: Record<string, number>;
  }
> = {
  "抖音1组": {
    name: "抖音1组",
    radar: { spend: 32, contribution: 80, diversity: 42, viralRate: 48, diligence: 86, creativity: 82 }
  },
  "默认分组": {
    name: "默认分组",
    radar: { spend: 40, contribution: 38, diversity: 45, viralRate: 35, diligence: 42, creativity: 30 }
  }
};

// Helper SVG Radar Component
function SVGInteractiveRadarChart({
  dataA,
  dataB,
  nameA,
  nameB,
  size = 420
}: {
  dataA: Record<string, number>;
  dataB: Record<string, number>;
  nameA: string;
  nameB: string;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.36; // 36% of container
  const numAxes = RADAR_AXES.length;

  // Concentric circle ticks (20%, 40%, 60%, 80%, 100%)
  const circleTicks = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Get (x, y) for angle (0 at top, clockwise)
  const getCoordinates = (index: number, level: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = radius * level;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Build polygon path for a dataset
  const buildPolygonPath = (data: Record<string, number>) => {
    return RADAR_AXES.map((axis, i) => {
      const val = (data[axis.key] || 0) / 100;
      const { x, y } = getCoordinates(i, Math.max(0.05, Math.min(1, val)));
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ") + " Z";
  };

  const pathA = buildPolygonPath(dataA);
  const pathB = buildPolygonPath(dataB);

  return (
    <div className="relative flex flex-col items-center justify-center py-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Concentric Grid Circles */}
        {circleTicks.map((tick, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * tick}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={1}
            strokeDasharray={tick === 1.0 ? "none" : "2 2"}
          />
        ))}

        {/* Axis Spokes & Labels */}
        {RADAR_AXES.map((axis, i) => {
          const { x: endX, y: endY } = getCoordinates(i, 1.0);
          const { x: labelX, y: labelY } = getCoordinates(i, 1.18);

          // Alignment adjustments for top, bottom, left, right labels
          let textAnchor: "start" | "end" | "middle" = "middle";
          if (labelX > center + 15) textAnchor = "start";
          else if (labelX < center - 15) textAnchor = "end";

          let dy = "0.3em";
          if (labelY < center - 15) dy = "-0.2em";
          else if (labelY > center + 15) dy = "0.8em";

          return (
            <g key={axis.key}>
              {/* Radial Line */}
              <line
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#CBD5E1"
                strokeWidth={1}
              />
              {/* Label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor={textAnchor}
                dy={dy}
                className="text-xs font-semibold fill-slate-500 hover:fill-slate-900 transition-colors cursor-default"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Series A (Blue) Polygon */}
        <path
          d={pathA}
          fill="rgba(59, 130, 246, 0.18)"
          stroke="#3B82F6"
          strokeWidth={2}
          className="transition-all duration-300"
        />

        {/* Series A Dots */}
        {RADAR_AXES.map((axis, i) => {
          const val = (dataA[axis.key] || 0) / 100;
          const { x, y } = getCoordinates(i, Math.max(0.05, Math.min(1, val)));
          return (
            <circle
              key={`dotA-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill="#3B82F6"
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Series B (Purple) Polygon */}
        <path
          d={pathB}
          fill="rgba(139, 92, 246, 0.18)"
          stroke="#8B5CF6"
          strokeWidth={2}
          className="transition-all duration-300"
        />

        {/* Series B Dots */}
        {RADAR_AXES.map((axis, i) => {
          const val = (dataB[axis.key] || 0) / 100;
          const { x, y } = getCoordinates(i, Math.max(0.05, Math.min(1, val)));
          return (
            <circle
              key={`dotB-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill="#8B5CF6"
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function DataInsightsView({ showToast }: DataInsightsViewProps) {
  // 1. Top Tab Selection: "personal" (个人数据洞察) | "group" (小组数据洞察)
  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");

  // 2. Target Dropdowns State
  const [targetA, setTargetA] = useState<string>("致上致上致上");
  const [targetB, setTargetB] = useState<string>("抖音1");

  // Group Dropdowns State
  const [groupTargetA, setGroupTargetA] = useState<string>("抖音1组");
  const [groupTargetB, setGroupTargetB] = useState<string>("默认分组");

  // 3. Date Range State
  const [startDate, setStartDate] = useState<string>("2025-03-31");
  const [endDate, setEndDate] = useState<string>("2025-04-15");

  // 4. Modals and Dropdowns
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showLeadershipModal, setShowLeadershipModal] = useState<boolean>(false);

  // Leadership Modal Comparison States
  const [leadershipA, setLeadershipA] = useState<string>("致上致上致上");
  const [leadershipB, setLeadershipB] = useState<string>("抖音1");

  // Get Current Data based on selections
  const currentProfileA =
    activeTab === "personal"
      ? PERSONAL_PROFILES[targetA] || PERSONAL_PROFILES["致上致上致上"]
      : GROUP_PROFILES[groupTargetA] || GROUP_PROFILES["抖音1组"];

  const currentProfileB =
    activeTab === "personal"
      ? PERSONAL_PROFILES[targetB] || PERSONAL_PROFILES["抖音1"]
      : GROUP_PROFILES[groupTargetB] || GROUP_PROFILES["默认分组"];

  // Data Analysis Metrics (16 items)
  const dataAnalysisList = [
    "成片消耗",
    "成交金额",
    "ROI",
    "上传作品（成片）",
    "上传作品（素材）",
    "上传作品（第三方）",
    "上传作品（图片）",
    "上传作品（文案）",
    "上传作品（音视频）",
    "上传作品（脚本）",
    "下载作品数",
    "推送他人作品数",
    "复制他人作品到剪映数",
    "作品被多少人下载",
    "作品被多少人复制到剪映",
    "作品被多少人推送"
  ];

  // Task Analysis Metrics (10 items)
  const taskAnalysisList = [
    "发布任务数",
    "被指派任务数",
    "发布的任务（已达标）",
    "发布的任务（待完成）",
    "发布的任务（下单数）",
    "发布的任务（出片数）",
    "被指派的任务（已达标）",
    "被指派的任务（待完成）",
    "被指派的任务（下单数）",
    "被指派的任务（出片数）"
  ];

  // Helper function to extract numeric values for bar length calculation
  const parseVal = (val: number | string | undefined): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val.replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= 1. Top Header Banner (Purple/Blue Gradient) Matches Screenshots 1 & 2 ================= */}
      <div className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Top Left Navigation Tabs */}
          <div className="flex items-center gap-2 border-b lg:border-b-0 border-white/20 pb-3 lg:pb-0">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "personal"
                  ? "bg-white/20 backdrop-blur-md text-white shadow-2xs border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="w-4 h-4" />
              <span>个人数据洞察</span>
            </button>

            <button
              onClick={() => setActiveTab("group")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "group"
                  ? "bg-white/20 backdrop-blur-md text-white shadow-2xs border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>小组数据洞察</span>
            </button>
          </div>

          {/* Center PK Controls + Leadership Insights Button */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {activeTab === "personal" ? (
                <>
                  {/* Target A Dropdown */}
                  <select
                    value={targetA}
                    onChange={(e) => setTargetA(e.target.value)}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-bold outline-none cursor-pointer focus:bg-white/30"
                  >
                    <option value="致上致上致上" className="text-slate-800">
                      致上致上致上
                    </option>
                    <option value="抖音1" className="text-slate-800">
                      抖音1
                    </option>
                    <option value="莫钦全" className="text-slate-800">
                      莫钦全
                    </option>
                    <option value="张艺剪" className="text-slate-800">
                      张艺剪
                    </option>
                  </select>

                  {/* VS Badge */}
                  <div className="px-2 py-0.5 bg-white/30 rounded-lg text-xs font-black italic tracking-wider shadow-2xs">
                    VS
                  </div>

                  {/* Target B Dropdown */}
                  <select
                    value={targetB}
                    onChange={(e) => setTargetB(e.target.value)}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-bold outline-none cursor-pointer focus:bg-white/30"
                  >
                    <option value="抖音1" className="text-slate-800">
                      抖音1
                    </option>
                    <option value="致上致上致上" className="text-slate-800">
                      致上致上致上
                    </option>
                    <option value="莫钦全" className="text-slate-800">
                      莫钦全
                    </option>
                  </select>
                </>
              ) : (
                <>
                  {/* Group Target A Dropdown */}
                  <select
                    value={groupTargetA}
                    onChange={(e) => setGroupTargetA(e.target.value)}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-bold outline-none cursor-pointer focus:bg-white/30"
                  >
                    <option value="抖音1组" className="text-slate-800">
                      抖音1组
                    </option>
                    <option value="默认分组" className="text-slate-800">
                      默认分组
                    </option>
                    <option value="爆款剪辑组" className="text-slate-800">
                      爆款剪辑组
                    </option>
                  </select>

                  {/* VS Badge */}
                  <div className="px-2 py-0.5 bg-white/30 rounded-lg text-xs font-black italic tracking-wider shadow-2xs">
                    VS
                  </div>

                  {/* Group Target B Dropdown */}
                  <select
                    value={groupTargetB}
                    onChange={(e) => setGroupTargetB(e.target.value)}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-bold outline-none cursor-pointer focus:bg-white/30"
                  >
                    <option value="默认分组" className="text-slate-800">
                      默认分组
                    </option>
                    <option value="抖音1组" className="text-slate-800">
                      抖音1组
                    </option>
                  </select>
                </>
              )}
            </div>

            {/* 领导力洞察 Button (Centered below VS) */}
            <button
              onClick={() => setShowLeadershipModal(true)}
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-md text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>领导力洞察</span>
            </button>
          </div>

          {/* Right Date Range Display */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-3 py-1.5 text-xs font-semibold self-start lg:self-auto">
            <Calendar className="w-3.5 h-3.5 text-white/80 shrink-0" />
            <span>
              {startDate} 至 {endDate}
            </span>
          </div>

        </div>
      </div>

      {/* ================= 2. Radar Chart Analysis Section ("雷达图分析") Matches Screenshots 1 & 2 ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>雷达图分析</span>
            <span className="text-xs font-normal text-slate-400">
              ({activeTab === "personal" ? targetA : groupTargetA} 对比 {activeTab === "personal" ? targetB : groupTargetB})
            </span>
          </h2>

          {/* Export Dropdown ("导出 ∨") */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>导出</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in text-xs">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    if (showToast) showToast("导出成功", "雷达图图表已保存为高清图片");
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>导出 PNG 图片</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    if (showToast) showToast("导出成功", "雷达图能力指标报表已导出为 Excel");
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>导出 Excel 报表</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Radar Chart Display */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          <SVGInteractiveRadarChart
            dataA={currentProfileA.radar}
            dataB={currentProfileB.radar}
            nameA={currentProfileA.name}
            nameB={currentProfileB.name}
            size={380}
          />

          {/* Legend */}
          <div className="flex items-center gap-6 mt-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#3B82F6] rounded-sm" />
              <span className="text-slate-700">{currentProfileA.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#8B5CF6] rounded-sm" />
              <span className="text-slate-700">{currentProfileB.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. Data Analysis Comparative Bars ("数据分析") Matches Screenshot 3 ================= */}
      <div className="bg-[#F4F5FD] rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">数据分析</h2>

        <div className="space-y-4 max-w-2xl mx-auto">
          {dataAnalysisList.map((metricKey) => {
            const rawDataA = PERSONAL_PROFILES[targetA]?.dataAnalysis?.[metricKey]?.valA ?? 0;
            const rawDataB = PERSONAL_PROFILES[targetA]?.dataAnalysis?.[metricKey]?.valB ?? 0;

            const numA = parseVal(rawDataA);
            const numB = parseVal(rawDataB);

            const total = Math.max(1, numA + numB);
            const pctA = Math.round((numA / total) * 100);
            const pctB = Math.round((numB / total) * 100);

            return (
              <div key={metricKey} className="space-y-1.5 text-center">
                {/* Metric Title */}
                <div className="text-xs font-bold text-slate-700">{metricKey}</div>

                {/* Numeric Comparison Values */}
                <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold">
                  <span className="text-[#3B82F6]">{rawDataA}</span>
                  <span className="text-[#8B5CF6]">{rawDataB}</span>
                </div>

                {/* Comparative Horizontal Bar */}
                <div className="h-3.5 bg-slate-200/80 rounded-full overflow-hidden flex max-w-md mx-auto shadow-inner">
                  <div
                    className="bg-[#3B82F6] h-full transition-all duration-500"
                    style={{ width: `${pctA}%` }}
                    title={`${targetA}: ${rawDataA}`}
                  />
                  <div
                    className="bg-[#8B5CF6] h-full transition-all duration-500"
                    style={{ width: `${pctB}%` }}
                    title={`${targetB}: ${rawDataB}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 4. Task Analysis Comparative Bars ("任务分析") Matches Screenshot 4 ================= */}
      <div className="bg-[#F4F5FD] rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">任务分析</h2>

        <div className="space-y-4 max-w-2xl mx-auto">
          {taskAnalysisList.map((metricKey) => {
            const rawDataA = PERSONAL_PROFILES[targetA]?.taskAnalysis?.[metricKey]?.valA ?? 0;
            const rawDataB = PERSONAL_PROFILES[targetA]?.taskAnalysis?.[metricKey]?.valB ?? 0;

            const numA = parseVal(rawDataA);
            const numB = parseVal(rawDataB);

            const total = Math.max(1, numA + numB);
            const pctA = Math.round((numA / total) * 100);
            const pctB = Math.round((numB / total) * 100);

            return (
              <div key={metricKey} className="space-y-1.5 text-center">
                {/* Metric Title */}
                <div className="text-xs font-bold text-slate-700">{metricKey}</div>

                {/* Numeric Comparison Values */}
                <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold">
                  <span className="text-[#3B82F6]">{rawDataA}</span>
                  <span className="text-[#8B5CF6]">{rawDataB}</span>
                </div>

                {/* Comparative Horizontal Bar */}
                <div className="h-3.5 bg-slate-200/80 rounded-full overflow-hidden flex max-w-md mx-auto shadow-inner">
                  <div
                    className="bg-[#3B82F6] h-full transition-all duration-500"
                    style={{ width: `${pctA}%` }}
                    title={`${targetA}: ${rawDataA}`}
                  />
                  <div
                    className="bg-[#8B5CF6] h-full transition-all duration-500"
                    style={{ width: `${pctB}%` }}
                    title={`${targetB}: ${rawDataB}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 5. "领导力洞察（徒弟数据）" Modal Matches Screenshot 5 ================= */}
      {showLeadershipModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#7C3AED]" />
                <span>领导力洞察（徒弟数据）</span>
              </h3>
              <button
                onClick={() => setShowLeadershipModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Selectors inside Modal */}
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="w-3.5 h-3.5 bg-[#3B82F6] rounded-xs shrink-0" />
              <select
                value={leadershipA}
                onChange={(e) => setLeadershipA(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="致上致上致上">致上致上致上</option>
                <option value="抖音1">抖音1</option>
                <option value="莫钦全">莫钦全</option>
              </select>

              <span className="font-black text-[#7C3AED] italic text-sm">PK</span>

              <select
                value={leadershipB}
                onChange={(e) => setLeadershipB(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="抖音1">抖音1</option>
                <option value="致上致上致上">致上致上致上</option>
                <option value="莫钦全">莫钦全</option>
              </select>
              <div className="w-3.5 h-3.5 bg-[#8B5CF6] rounded-xs shrink-0" />
            </div>

            {/* Radar Chart */}
            <div className="flex justify-center">
              <SVGInteractiveRadarChart
                dataA={PERSONAL_PROFILES[leadershipA]?.radar || PERSONAL_PROFILES["致上致上致上"].radar}
                dataB={PERSONAL_PROFILES[leadershipB]?.radar || PERSONAL_PROFILES["抖音1"].radar}
                nameA={leadershipA}
                nameB={leadershipB}
                size={340}
              />
            </div>

            {/* Leadership Breakdown Summary Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 space-y-1">
                <div className="text-slate-500 font-medium">徒弟总消耗产出</div>
                <div className="text-base font-black text-slate-900">¥128,500</div>
                <div className="text-[11px] text-emerald-600 font-bold">人均月产出 +32.4%</div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1">
                <div className="text-slate-500 font-medium">徒弟爆款转化率</div>
                <div className="text-base font-black text-slate-900">28.6%</div>
                <div className="text-[11px] text-blue-600 font-bold">导师带教评级：A+</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLeadershipModal(false)}
                className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
