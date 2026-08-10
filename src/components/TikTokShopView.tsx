import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  ExternalLink,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  RotateCcw,
  Store,
  SlidersHorizontal,
  Check
} from "lucide-react";

interface TikTokShopViewProps {
  showToast?: (title: string, desc: string) => void;
}

interface ShopItem {
  id: string;
  name: string;
  code: string;
  type: string; // "本地" or "跨境"
  region: string; // "美国" or "非美国"
  authorizedAt: string;
}

const INITIAL_SHOPS: ShopItem[] = [
  {
    id: "shop_1",
    name: "SANDBOX7397710...",
    code: "USLCHNEAYD",
    type: "本地",
    region: "美国",
    authorizedAt: "2025-04-10"
  },
  {
    id: "shop_2",
    name: "GLOBAL_STORE_UK_01",
    code: "UK88291045",
    type: "跨境",
    region: "非美国",
    authorizedAt: "2025-04-02"
  }
];

export default function TikTokShopView({ showToast }: TikTokShopViewProps) {
  // 1. Expansion state for shops area
  const [shopsExpanded, setShopsExpanded] = useState<boolean>(true);

  // 2. Shops List
  const [shops, setShops] = useState<ShopItem[]>(INITIAL_SHOPS);

  // 3. Modals & Popovers
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<"direct" | "link">("direct");
  const [authRegion, setAuthRegion] = useState<"us" | "non_us">("us");

  const [activeMoreOpsId, setActiveMoreOpsId] = useState<string | null>(null);

  // 4. Filters & Selection in Data Overview
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>("SANDBOX7397710...");
  const [timeGranularity, setTimeGranularity] = useState<"day" | "week" | "month">("day");
  const [timeZone, setTimeZone] = useState<string>("GMT-8");
  const [startDate, setStartDate] = useState<string>("2025-04-15");
  const [endDate, setEndDate] = useState<string>("2025-04-15");

  // 5. Bottom Table Tabs: "店铺数据" | "订单数据"
  const [bottomTab, setBottomTab] = useState<"shop_data" | "order_data">("shop_data");
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Handle Authorize action from modal
  const handleConfirmAuthorize = () => {
    setShowAuthModal(false);
    const newShop: ShopItem = {
      id: `shop_${Date.now()}`,
      name: `NEW_TK_SHOP_${Math.floor(1000 + Math.random() * 9000)}`,
      code: `US${Math.floor(10000000 + Math.random() * 90000000)}`,
      type: authRegion === "us" ? "本地" : "跨境",
      region: authRegion === "us" ? "美国" : "非美国",
      authorizedAt: new Date().toISOString().split("T")[0]
    };
    setShops([newShop, ...shops]);
    if (showToast) {
      showToast("店铺授权成功", `已完成【${newShop.name}】TikTok店铺组件与数据对接`);
    }
  };

  // Handle Cancel Authorization
  const handleCancelAuthorization = (shopId: string, shopName: string) => {
    setActiveMoreOpsId(null);
    setShops(shops.filter((s) => s.id !== shopId));
    if (selectedShopFilter.includes(shopName.slice(0, 8))) {
      setSelectedShopFilter("");
    }
    if (showToast) {
      showToast("取消授权成功", `已成功对店铺【${shopName}】解除TikTok店铺授权`);
    }
  };

  // Handle Data Analysis Click
  const handleDataAnalysis = (shopName: string) => {
    setSelectedShopFilter(shopName);
    if (showToast) {
      showToast("载入店铺分析", `已筛选【${shopName}】的财务及订单汇总概览`);
    }
  };

  // Metric overview cards definition
  const OVERVIEW_METRICS = [
    { title: "Statements-Processing", val: "$0", label: "较上一周期", diff: "--" },
    { title: "Statements-Paid", val: "$0", label: "较上一周期", diff: "--" },
    { title: "Statements-Failed", val: "$0", label: "较上一周期", diff: "--" },
    { title: "Payouts-Paid", val: "$0", label: "较上一周期", diff: "--" },
    { title: "Payouts-Processing", val: "$0", label: "较上一周期", diff: "--" },
    { title: "Payouts-Failed", val: "$0", label: "较上一周期", diff: "--" },
    { title: "总订单数", val: "0", label: "较上一周期", diff: "--" },
    { title: "总订单金额", val: "$0", label: "较上一周期", diff: "--" },
    { title: "未支付订单数", val: "0", label: "较上一周期", diff: "--" },
    { title: "未支付订单金额", val: "$0", label: "较上一周期", diff: "--" },
    { title: "取消订单数", val: "0", label: "较上一周期", diff: "--" },
    { title: "取消订单金额", val: "$0", label: "较上一周期", diff: "--" },
    { title: "退货退款订单数", val: "0", label: "较上一周期", diff: "--" },
    { title: "退货退款订单金额", val: "$0", label: "较上一周期", diff: "--" }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-6 p-6">
      {/* ================= 1. Authorized Shops Top Header Section (Matches Screenshot 1 & 4) ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800">授权店铺</h2>
            {/* 授权店铺 Purple Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>授权店铺</span>
            </button>
          </div>

          {/* Expand / Collapse Toggle */}
          <button
            onClick={() => setShopsExpanded(!shopsExpanded)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{shopsExpanded ? "展开" : "收起"}</span>
            {shopsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Shop Cards Grid */}
        {shopsExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-[#F8F5FF] border border-purple-100 rounded-xl p-4 space-y-3 relative shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  {/* TikTok Black Rounded Icon */}
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0 shadow-2xs">
                    {/* SVG TikTok Icon */}
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1 3.228-4.502V9.41a6.34 6.34 0 0 0-1.002-.08 6.34 6.34 0 1 0 6.34 6.34V9.237a8.23 8.23 0 0 0 5.12 1.758V7.55a4.793 4.793 0 0 1-1.27-.864z" />
                    </svg>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 truncate" title={shop.name}>
                        {shop.name}
                      </span>
                      {/* Badge 本地 / 跨境 */}
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded shrink-0">
                        {shop.type}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{shop.code}</div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {/* 数据分析 Purple Solid Button */}
                  <button
                    onClick={() => handleDataAnalysis(shop.name)}
                    className="flex-1 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs text-center"
                  >
                    数据分析
                  </button>

                  {/* 更多操作 Purple Outline Button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMoreOpsId(activeMoreOpsId === shop.id ? null : shop.id)
                      }
                      className="px-3 py-1.5 border border-purple-300 text-[#7C3AED] hover:bg-purple-50 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <span>更多操作</span>
                    </button>

                    {/* Popover Menu (Cancel Authorization / 取消授权) - Matches Screenshot 3 */}
                    {activeMoreOpsId === shop.id && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-28 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 animate-fade-in text-center">
                        <button
                          onClick={() => handleCancelAuthorization(shop.id, shop.name)}
                          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:text-rose-600 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          取消授权
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 2. Data Overview Section ("数据概览") (Matches Screenshot 1 & 4) ================= */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-800">数据概览</h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Select Shop Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedShopFilter}
                onChange={(e) => setSelectedShopFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
              >
                <option value="">请选择店铺</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Granularity: 按日 | 按周 | 按月 */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              {(["day", "week", "month"] as const).map((g) => {
                const label = g === "day" ? "按日" : g === "week" ? "按周" : "按月";
                return (
                  <button
                    key={g}
                    onClick={() => setTimeGranularity(g)}
                    className={`cursor-pointer transition-colors ${
                      timeGranularity === g ? "text-[#7C3AED] font-bold" : "hover:text-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Timezone Select: GMT-8 */}
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
            >
              <option value="GMT-8">GMT-8</option>
              <option value="GMT+8">GMT+8</option>
              <option value="GMT+0">GMT+0</option>
            </select>

            {/* Date Range Picker */}
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

        {/* 14 Stat Cards Grid (5 cols responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {OVERVIEW_METRICS.map((metric, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 space-y-1">
              <div className="text-[11px] font-medium text-slate-500 truncate" title={metric.title}>
                {metric.title}
              </div>
              <div className="text-base font-black text-slate-900">{metric.val}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{metric.label}</span>
                <span>{metric.diff}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. Bottom Table Section: "店铺数据" | "订单数据" (Matches Screenshot 1 & 4) ================= */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          {/* Left Tabs: 店铺数据 | 订单数据 */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setBottomTab("shop_data")}
              className={`text-xs font-bold pb-1.5 relative cursor-pointer transition-colors ${
                bottomTab === "shop_data" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              店铺数据
              {bottomTab === "shop_data" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setBottomTab("order_data")}
              className={`text-xs font-bold pb-1.5 relative cursor-pointer transition-colors ${
                bottomTab === "order_data" ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              订单数据
              {bottomTab === "order_data" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          </div>

          {/* Export Dropdown Button (Purple) */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>导出</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 animate-fade-in">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    if (showToast) showToast("导出成功", "已成功导出当前店铺数据报表.csv");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>导出 csv</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    if (showToast) showToast("导出成功", "已成功导出当前店铺数据报表.xlsx");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>导出 excel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Multi-level Header Table (Matches Screenshot 1 & 4) */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
          {bottomTab === "shop_data" ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                {/* Level 1 Group Header */}
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs text-center">
                  <th colSpan={2} className="py-2.5 px-4 border-r border-slate-200 bg-slate-100/50">
                    店铺
                  </th>
                  <th colSpan={3} className="py-2.5 px-4 border-r border-slate-200 bg-slate-100/50">
                    Statements
                  </th>
                  <th colSpan={3} className="py-2.5 px-4 bg-slate-100/50">
                    Payouts
                  </th>
                </tr>

                {/* Level 2 Column Sub-headers */}
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs">
                  <th className="py-2.5 px-4 border-r border-slate-200">名称</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">code</th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">
                    <div>Processing</div>
                    <div className="text-[10px] text-slate-400 font-normal">累计处理中</div>
                  </th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">
                    <div>Paid</div>
                    <div className="text-[10px] text-slate-400 font-normal">总支付</div>
                  </th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">
                    <div>Failed</div>
                    <div className="text-[10px] text-slate-400 font-normal">支付失败</div>
                  </th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">
                    <div>Paid</div>
                    <div className="text-[10px] text-slate-400 font-normal">总支付</div>
                  </th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">
                    <div>Processing</div>
                    <div className="text-[10px] text-slate-400 font-normal">待入账</div>
                  </th>
                  <th className="py-2.5 px-4 text-right">
                    <div>Failed</div>
                    <div className="text-[10px] text-slate-400 font-normal">入账失败</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 border-r border-slate-100 font-bold text-slate-800">
                      {shop.name}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-100 font-mono text-slate-500">
                      {shop.code}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-100 text-right font-mono">$0.00</td>
                    <td className="py-3 px-4 border-r border-slate-100 text-right font-mono">$0.00</td>
                    <td className="py-3 px-4 border-r border-slate-100 text-right font-mono">$0.00</td>
                    <td className="py-3 px-4 border-r border-slate-100 text-right font-mono">$0.00</td>
                    <td className="py-3 px-4 border-r border-slate-100 text-right font-mono">$0.00</td>
                    <td className="py-3 px-4 text-right font-mono">$0.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Order Data Table */
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">
                  <th className="py-2.5 px-4">订单ID</th>
                  <th className="py-2.5 px-4">所属店铺</th>
                  <th className="py-2.5 px-4 text-right">订单金额</th>
                  <th className="py-2.5 px-4 text-center">支付状态</th>
                  <th className="py-2.5 px-4 text-center">履约状态</th>
                  <th className="py-2.5 px-4 text-right">下单时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-800">TK_ORD_57829104</td>
                  <td className="py-3 px-4 font-bold text-[#7C3AED]">SANDBOX7397710...</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">$45.90</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded">已支付</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold rounded">出库中</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">2025-04-15 14:22</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= 4. Authorize Modal ("授权弹窗") (Matches Screenshot 2) ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden space-y-6 p-6">
            {/* Modal Header: | 授权 */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-sm font-bold text-slate-900">授权</h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-xs">
              {/* Field 1: 授权方式 */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">授权方式</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAuthMethod("direct")}
                    className={`px-5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      authMethod === "direct"
                        ? "border-2 border-[#7C3AED] text-[#7C3AED] bg-purple-50/30"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    直接授权
                  </button>
                  <button
                    onClick={() => setAuthMethod("link")}
                    className={`px-5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      authMethod === "link"
                        ? "border-2 border-[#7C3AED] text-[#7C3AED] bg-purple-50/30"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>生成授权链接</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Field 2: 国家/地区 */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">国家/地区</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAuthRegion("us")}
                    className={`px-5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      authRegion === "us"
                        ? "border-2 border-[#7C3AED] text-[#7C3AED] bg-purple-50/30"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    美国店铺
                  </button>
                  <button
                    onClick={() => setAuthRegion("non_us")}
                    className={`px-5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      authRegion === "non_us"
                        ? "border-2 border-[#7C3AED] text-[#7C3AED] bg-purple-50/30"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    非美国店铺
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer: 取消 | 去授权 */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAuthorize}
                className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                去授权
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
