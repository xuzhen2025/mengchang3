import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  HelpCircle,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RotateCcw,
  BarChart2,
  Tv,
  Layers,
  User,
  Users,
  Building2,
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface DeliveryStatusReportViewProps {
  showToast?: (title: string, desc: string) => void;
}

// Chart Trend Data (Matching dates in screenshots: 2025-03-31 to 2025-04-14)
const CHART_DATA = [
  { date: "2025-03-31", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-02", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-04", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-06", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-08", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-10", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-12", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 },
  { date: "2025-04-14", 未绑定: 0, "测试指定员工可见-部门": 0, 抖音投放: 0.05 }
];

export default function DeliveryStatusReportView({ showToast }: DeliveryStatusReportViewProps) {
  // 1. Top dimension tabs (Matching red rectangle in screenshots)
  const [activeDimension, setActiveDimension] = useState<
    "team" | "group" | "personal" | "live_room" | "advertiser_detail"
  >("team");

  // 2. Date Range Filter
  const [startDate, setStartDate] = useState<string>("2025-03-31");
  const [endDate, setEndDate] = useState<string>("2025-04-14");

  // 3. Platform Toggle (巨量广告 | 巨量千川)
  const [activePlatform, setActivePlatform] = useState<"巨量广告" | "巨量千川">("巨量广告");

  // 4. Dropdown selections
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [advertiserAccountId, setAdvertiserAccountId] = useState<string>("");

  // 5. Active Status Filter button above line chart
  const [activeMetricFilter, setActiveMetricFilter] = useState<string>("搭建计划总数");

  // Mock table data for Team / Group / Personal
  const TEAM_ROWS = [
    { name: "抖音投放", total: 8, delivering: 3, pending: 3, terminated: 1, finished: 1, deleted: 0 },
    { name: "测试指定员工可见-部门", total: 6, delivering: 2, pending: 3, terminated: 1, finished: 0, deleted: 0 },
    { name: "未绑定", total: 4, delivering: 0, pending: 2, terminated: 1, finished: 1, deleted: 0 }
  ];

  const GROUP_ROWS = [
    { name: "核心一组", total: 10, delivering: 4, pending: 4, terminated: 1, finished: 1, deleted: 0 },
    { name: "测试小组-02", total: 5, delivering: 1, pending: 2, terminated: 1, finished: 1, deleted: 0 },
    { name: "未绑定分组", total: 3, delivering: 0, pending: 2, terminated: 1, finished: 0, deleted: 0 }
  ];

  const PERSONAL_ROWS = [
    { name: "张伟 (zs_test)", total: 12, delivering: 5, pending: 4, terminated: 2, finished: 1, deleted: 0 },
    { name: "李娜 (1129新增)", total: 4, delivering: 0, pending: 2, terminated: 1, finished: 1, deleted: 0 },
    { name: "未绑定账号", total: 2, delivering: 0, pending: 2, terminated: 0, finished: 0, deleted: 0 }
  ];

  // Mock table data for Live Room Data
  const LIVE_ROOM_ROWS = [
    {
      roomName: "直播间2",
      total: 7,
      delivering: 0,
      ineffective: 0,
      auditNew: 0,
      auditEdit: 0,
      auditFailed: 0,
      paused: 7,
      finished: 0,
      deleted: 0
    },
    {
      roomName: "未绑定",
      total: 0,
      delivering: 0,
      ineffective: 0,
      auditNew: 0,
      auditEdit: 0,
      auditFailed: 0,
      paused: 0,
      finished: 0,
      deleted: 0
    }
  ];

  // Mock table data for Advertiser Detail Data
  const ADVERTISER_DETAIL_ROWS = [
    {
      accountName: "直播-铃蓓-牧唐-芜湖1 (1787869271614468)",
      team: "测试指定员工",
      group: "191",
      user: "1129新增",
      cat1: "未绑定",
      cat2: "未绑定",
      liveRoom: "/",
      total: 0,
      delivering: 0,
      pending: 0,
      terminated: 0,
      finished: 0,
      deleted: 0
    },
    {
      accountName: "千川直播号-数码01 (1839701482129801)",
      team: "抖音投放",
      group: "核心二组",
      user: "张伟",
      cat1: "3C数码",
      cat2: "蓝牙耳机",
      liveRoom: "直播间2",
      total: 7,
      delivering: 2,
      pending: 3,
      terminated: 1,
      finished: 1,
      deleted: 0
    }
  ];

  // Reset filters
  const handleReset = () => {
    setSelectedEntity("");
    setAdvertiserAccountId("");
    setStartDate("2025-03-31");
    setEndDate("2025-04-14");
    if (showToast) showToast("重置成功", "已重置计划搭建时间及筛选参数");
  };

  // Helper title for Dimension tab
  const getDimensionLabel = () => {
    switch (activeDimension) {
      case "team": return "部门";
      case "group": return "分组";
      case "personal": return "个人";
      case "live_room": return "直播间";
      case "advertiser_detail": return "广告账户";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
      {/* ================= 1. Top Navigation Bar (Matches Red Rectangle in Screenshots) ================= */}
      <div className="flex flex-wrap items-center justify-between px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-8">
          {[
            { id: "team", label: "部门数据" },
            { id: "group", label: "分组数据" },
            { id: "personal", label: "个人数据" },
            { id: "live_room", label: "直播间数据" },
            { id: "advertiser_detail", label: "广告主明细数据" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveDimension(tab.id as any);
                setSelectedEntity("");
                if (showToast) showToast("切换分析维度", `已切换至【${tab.label}】分析模式`);
              }}
              className={`text-sm font-bold pb-3 relative cursor-pointer transition-colors ${
                activeDimension === tab.id ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {activeDimension === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Top Right Date Range Filter: 计划搭建时间 ? [2025-03-31 至 2025-04-14] */}
        <div className="flex items-center gap-2 pb-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <span>计划搭建时间</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
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

      {/* ================= 2. Platform Toggle & Dimension Selectors (Matches Screenshots 1, 2, 3) ================= */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 space-y-3">
        <div className="flex items-center gap-6">
          {/* Platform buttons: 巨量广告 / 巨量千川 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePlatform("巨量广告")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                activePlatform === "巨量广告" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#7C3AED]" />
              <span>巨量广告</span>
            </button>

            <button
              onClick={() => setActivePlatform("巨量千川")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                activePlatform === "巨量千川" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
              <span>巨量千川</span>
            </button>
          </div>
        </div>

        {/* Dynamic Selectors depending on Active Dimension */}
        <div className="flex items-center gap-3">
          {activeDimension === "team" && (
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[160px]"
            >
              <option value="">请选择部门</option>
              <option value="抖音投放">抖音投放</option>
              <option value="测试指定员工可见-部门">测试指定员工可见-部门</option>
              <option value="未绑定">未绑定</option>
            </select>
          )}

          {activeDimension === "group" && (
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[160px]"
            >
              <option value="">请选择分组</option>
              <option value="核心一组">核心一组</option>
              <option value="测试小组-02">测试小组-02</option>
              <option value="未绑定分组">未绑定分组</option>
            </select>
          )}

          {activeDimension === "personal" && (
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[160px]"
            >
              <option value="">请选择个人</option>
              <option value="张伟">张伟</option>
              <option value="李娜">李娜</option>
              <option value="未绑定账号">未绑定账号</option>
            </select>
          )}

          {activeDimension === "advertiser_detail" && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="请输入广告账户id"
                value={advertiserAccountId}
                onChange={(e) => setAdvertiserAccountId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs min-w-[160px]"
              />
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
              >
                <option value="">请选择</option>
                <option value="测试指定员工">测试指定员工</option>
                <option value="抖音投放">抖音投放</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ================= 3. Middle Line Chart Trend Area ================= */}
      <div className="p-6 bg-white border-b border-slate-100 space-y-4">
        {/* Metric Toggles on Top-Left of Chart */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            {activeDimension === "live_room" ? (
              // Live Room Status Buttons (Matching Screenshot 2)
              ["搭建计划总数", "投放中", "审核不通过", "低效计划"].map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetricFilter(m)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    activeMetricFilter === m
                      ? "bg-[#7C3AED] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m}
                </button>
              ))
            ) : (
              // Team/Group/Personal/Advertiser Status Buttons (Matching Screenshots 1 & 3)
              ["搭建计划总数", "投放中", "未投放"].map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetricFilter(m)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    activeMetricFilter === m
                      ? "bg-[#7C3AED] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m}
                </button>
              ))
            )}
          </div>

          {/* Chart Legend (Matching screenshot colored circles) */}
          <div className="flex items-center gap-5 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white inline-block" />
              <span>未绑定</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white inline-block" />
              <span>测试指定员工可见-部门</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-white inline-block" />
              <span>抖音投放</span>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHART_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
              <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="未绑定" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="测试指定员工可见-部门" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
              <Line type="monotone" dataKey="抖音投放" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= 4. Bottom Detailed Table Section ("详细数据") ================= */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-black text-slate-800">详细数据</div>
          <button
            onClick={() => {
              if (showToast) showToast("表格列配置", "您可以按需显示或隐藏详细数据指标列");
            }}
            className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              {/* TABLE HEADERS FOR TEAM / GROUP / PERSONAL */}
              {(activeDimension === "team" || activeDimension === "group" || activeDimension === "personal") && (
                <tr className="bg-slate-50/80 border-y border-slate-200/80 text-slate-500 font-bold text-xs">
                  <th className="py-3 px-4 font-bold">{getDimensionLabel()}</th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>搭建计划总数</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>投放中</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>未投放</span>
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>已终止</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>已完成</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>已删除</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              )}

              {/* TABLE HEADERS FOR LIVE ROOM (Matches Screenshot 2) */}
              {activeDimension === "live_room" && (
                <tr className="bg-slate-50/80 border-y border-slate-200/80 text-slate-500 font-bold text-xs">
                  <th className="py-3 px-4 font-bold">直播间</th>
                  <th className="py-3 px-4 font-bold text-center">搭建计划总数 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">投放中 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">低效计划 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">新建审核中 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">修改审核中 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">审核不通过 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已暂停 ? ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已完成 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已删除 ↕</th>
                </tr>
              )}

              {/* TABLE HEADERS FOR ADVERTISER DETAIL (Matches Screenshot 3) */}
              {activeDimension === "advertiser_detail" && (
                <tr className="bg-slate-50/80 border-y border-slate-200/80 text-slate-500 font-bold text-xs">
                  <th className="py-3 px-4 font-bold">广告账户</th>
                  <th className="py-3 px-4 font-bold">部门</th>
                  <th className="py-3 px-4 font-bold">分组</th>
                  <th className="py-3 px-4 font-bold">用户</th>
                  <th className="py-3 px-4 font-bold">一级分类</th>
                  <th className="py-3 px-4 font-bold">二级分类</th>
                  <th className="py-3 px-4 font-bold">绑定直播间</th>
                  <th className="py-3 px-4 font-bold text-center">搭建计划总数 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">投放中 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">未投放 ? ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已终止 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已完成 ↕</th>
                  <th className="py-3 px-4 font-bold text-center">已删除 ↕</th>
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* ================= AGGREGATE ROW (总计) ================= */}
              <tr className="bg-purple-50/30 font-bold text-slate-900">
                <td className="py-3 px-4 font-black">总计</td>

                {(activeDimension === "team" || activeDimension === "group" || activeDimension === "personal") && (
                  <>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">18</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">5</td>
                    <td className="py-3 px-4 text-center text-slate-700">8</td>
                    <td className="py-3 px-4 text-center text-slate-700">3</td>
                    <td className="py-3 px-4 text-center text-slate-700">2</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                  </>
                )}

                {activeDimension === "live_room" && (
                  <>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">7</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-amber-600 font-bold">7</td>
                    <td className="py-3 px-4 text-center text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                  </>
                )}

                {activeDimension === "advertiser_detail" && (
                  <>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">/</td>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">7</td>
                    <td className="py-3 px-4 text-center text-slate-700">2</td>
                    <td className="py-3 px-4 text-center text-slate-700">3</td>
                    <td className="py-3 px-4 text-center text-slate-700">1</td>
                    <td className="py-3 px-4 text-center text-slate-700">1</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                  </>
                )}
              </tr>

              {/* DATA ROWS FOR TEAM / GROUP / PERSONAL */}
              {activeDimension === "team" &&
                TEAM_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#7C3AED]">{row.name}</td>
                    <td className="py-3 px-4 text-center text-slate-800 font-bold">{row.total}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.delivering}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.pending}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.terminated}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.finished}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.deleted}</td>
                  </tr>
                ))}

              {activeDimension === "group" &&
                GROUP_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#7C3AED]">{row.name}</td>
                    <td className="py-3 px-4 text-center text-slate-800 font-bold">{row.total}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.delivering}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.pending}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.terminated}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.finished}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.deleted}</td>
                  </tr>
                ))}

              {activeDimension === "personal" &&
                PERSONAL_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#7C3AED]">{row.name}</td>
                    <td className="py-3 px-4 text-center text-slate-800 font-bold">{row.total}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.delivering}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.pending}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.terminated}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.finished}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.deleted}</td>
                  </tr>
                ))}

              {/* DATA ROWS FOR LIVE ROOM (Matches Screenshot 2) */}
              {activeDimension === "live_room" &&
                LIVE_ROOM_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{row.roomName}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.total}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.delivering}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.ineffective}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.auditNew}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.auditEdit}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.auditFailed}</td>
                    <td className="py-3 px-4 text-center text-amber-600 font-bold">{row.paused}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.finished}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.deleted}</td>
                  </tr>
                ))}

              {/* DATA ROWS FOR ADVERTISER DETAIL (Matches Screenshot 3) */}
              {activeDimension === "advertiser_detail" &&
                ADVERTISER_DETAIL_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{row.accountName}</td>
                    <td className="py-3 px-4 text-[#7C3AED] font-medium">{row.team}</td>
                    <td className="py-3 px-4 text-[#7C3AED] font-medium">{row.group}</td>
                    <td className="py-3 px-4 text-[#7C3AED] font-medium">{row.user}</td>
                    <td className="py-3 px-4 text-slate-600">{row.cat1}</td>
                    <td className="py-3 px-4 text-slate-600">{row.cat2}</td>
                    <td className="py-3 px-4 text-slate-600">{row.liveRoom}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.total}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.delivering}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.pending}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.terminated}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.finished}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.deleted}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Scrollbar line indicator */}
        <div className="h-1 bg-slate-200/80 mx-2 rounded-full mt-3" />
      </div>
    </div>
  );
}
