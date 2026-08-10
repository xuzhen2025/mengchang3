import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  SlidersHorizontal,
  RotateCcw,
  Search,
  ExternalLink,
  X,
  Check,
  Building2,
  Users,
  Tag,
  ShieldAlert
} from "lucide-react";

interface AdAccountDataViewProps {
  showToast?: (title: string, desc: string) => void;
}

// 1. Mock Data for "直播间汇总"
const LIVE_ROOM_ROWS = [
  { roomName: "未绑定直播间", leader: "-", spend: 0, roi: 0, gmv: 0, coupon: 0, conv: 0, cvr: "-", cpa: "-", imp: 0, clicks: 0, ctr: "-", cpc: "-", views: 0 },
  { roomName: "直播间-美妆旗舰店爆品 (ID: 89021)", leader: "展展", spend: 185400.50, roi: 3.92, gmv: 726769.90, coupon: 42100.00, conv: 6180, cvr: "4.85%", cpa: "30.00", imp: 3820000, clicks: 127420, ctr: "3.34%", cpc: "1.46", views: 3100000 },
  { roomName: "直播间-3C数码科技专场 (ID: 89035)", leader: "李强", spend: 124000.00, roi: 3.45, gmv: 427800.00, coupon: 28500.00, conv: 3950, cvr: "4.12%", cpa: "31.39", imp: 2450000, clicks: 95870, ctr: "3.91%", cpc: "1.29", views: 2050000 },
  { roomName: "直播间-服装鞋包新品发布 (ID: 89048)", leader: "王丹", spend: 96800.00, roi: 3.10, gmv: 300080.00, coupon: 19800.00, conv: 2890, cvr: "3.80%", cpa: "33.49", imp: 1980000, clicks: 76050, ctr: "3.84%", cpc: "1.27", views: 1680000 },
];

// 2. Mock Data for "广告主明细"
const ADVERTISER_DETAIL_ROWS = [
  {
    accountName: "直播-铃蓓-牧唐-芜湖1",
    accountId: "1787869271614468",
    team: "未绑定分组..",
    group: "未绑定分组",
    user: "-",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    spend: 0,
    roi: 0,
    gmv: 0,
    coupon: 0,
    conv: 0,
    cvr: "-",
    cpa: "-",
    imp: 0,
    clicks: 0
  },
  {
    accountName: "直播-颜姿2-牧唐-芜湖",
    accountId: "1783526642794571",
    team: "未绑定分组..",
    group: "未绑定分组",
    user: "-",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    spend: 0,
    roi: 0,
    gmv: 0,
    coupon: 0,
    conv: 0,
    cvr: "-",
    cpa: "-",
    imp: 0,
    clicks: 0
  },
  {
    accountName: "千川直通车-美妆03",
    accountId: "1792182049182310",
    team: "A部门",
    group: "核心二组",
    user: "张伟",
    cat1: "美妆护肤",
    cat2: "精华面霜",
    spend: 142500.00,
    roi: 3.85,
    gmv: 548625.00,
    coupon: 31200.00,
    conv: 4620,
    cvr: "4.75%",
    cpa: "30.84",
    imp: 2950000,
    clicks: 97260
  },
  {
    accountName: "千川直播号-数码01",
    accountId: "1795123019823122",
    team: "C部门",
    group: "管理员组",
    user: "李娜",
    cat1: "3C数码",
    cat2: "蓝牙耳机",
    spend: 98200.50,
    roi: 3.42,
    gmv: 335845.70,
    coupon: 21000.00,
    conv: 3150,
    cvr: "4.20%",
    cpa: "31.17",
    imp: 1890000,
    clicks: 75000
  },
  {
    accountName: "巨量信息流-洗护备用",
    accountId: "1781203912039102",
    team: "外部部门",
    group: "分组一",
    user: "zs_test",
    cat1: "个人护理",
    cat2: "洗发护发",
    spend: 52100.00,
    roi: 2.95,
    gmv: 153695.00,
    coupon: 11200.00,
    conv: 1540,
    cvr: "3.65%",
    cpa: "33.83",
    imp: 1120000,
    clicks: 42190
  }
];

// 3. Mock Data for "人员数据"
const PERSONNEL_ROWS = [
  { name: "张伟 (投放主管)", accountCount: 12, spend: 215000.00, roi: 3.88, gmv: 834200.00, coupon: 48000.00, conv: 6980, cvr: "4.65%", cpa: "30.80", imp: 4120000, clicks: 150100 },
  { name: "李娜 (高级优化师)", accountCount: 8, spend: 168000.50, roi: 3.52, gmv: 591360.00, coupon: 35000.00, conv: 5320, cvr: "4.30%", cpa: "31.58", imp: 3100000, clicks: 123720 },
  { name: "王磊 (主播运营)", accountCount: 6, spend: 98500.00, roi: 3.20, gmv: 315200.00, coupon: 19500.00, conv: 3080, cvr: "3.90%", cpa: "31.98", imp: 1950000, clicks: 78970 },
  { name: "未绑定人员账号", accountCount: 2, spend: 0.00, roi: 0.00, gmv: 0.00, coupon: 0.00, conv: 0, cvr: "-", cpa: "-", imp: 0, clicks: 0 }
];

// 4. Mock Data for "分类数据"
const CATEGORY_ROWS = [
  { cat1: "美妆护肤", cat2: "面部精华/霜", accountCount: 15, spend: 245000.00, roi: 3.95, gmv: 967750.00, coupon: 52000.00, conv: 7850, cvr: "4.80%", cpa: "31.21" },
  { cat1: "3C数码", cat2: "智能穿戴与耳机", accountCount: 9, spend: 142000.00, roi: 3.40, gmv: 482800.00, coupon: 28000.00, conv: 4420, cvr: "4.15%", cpa: "32.13" },
  { cat1: "个人护理", cat2: "身体洗护", accountCount: 6, spend: 89000.00, roi: 3.12, gmv: 277680.00, coupon: 16500.00, conv: 2750, cvr: "3.75%", cpa: "32.36" },
  { cat1: "未绑定分类", cat2: "未绑定分类", accountCount: 2, spend: 0.00, roi: 0.00, gmv: 0.00, coupon: 0.00, conv: 0, cvr: "-", cpa: "-" }
];

export default function AdAccountDataView({ showToast }: AdAccountDataViewProps) {
  // 1. Top Level Platform Tabs (Matching screenshot header)
  const [activePlatform, setActivePlatform] = useState<string>("巨量千川");

  // 2. Sub Promotion Types (Under 巨量千川)
  const [subPromotion, setSubPromotion] = useState<"standard" | "live_domain" | "product_domain">("standard");

  // 3. Dimension Tabs (直播间汇总 | 人员数据 | 分类数据 | 广告主明细)
  const [activeDimension, setActiveDimension] = useState<"live_summary" | "personnel" | "category" | "advertiser_detail">("live_summary");

  // 4. Dropdown Selectors (for 广告主明细 mode)
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 5. Query Filters
  const [startDate, setStartDate] = useState<string>("2026-07-15");
  const [endDate, setEndDate] = useState<string>("2026-07-30");
  const [advertiserIdInput, setAdvertiserIdInput] = useState<string>("");
  const [advertiserNameInput, setAdvertiserNameInput] = useState<string>("");

  // 6. Bind Data Modal State
  const [showBindModal, setShowBindModal] = useState<boolean>(false);

  // 7. Export Dropdown Menu State
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 8. Sorting State
  const [sortField, setSortField] = useState<string>("spend");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // 9. Pagination State
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Handle Reset Filters
  const handleReset = () => {
    setSelectedTeam("");
    setSelectedGroup("");
    setSelectedAccount("");
    setSelectedCategory("");
    setAdvertiserIdInput("");
    setAdvertiserNameInput("");
    setStartDate("2026-07-15");
    setEndDate("2026-07-30");
    if (showToast) {
      showToast("重置成功", "已重置所有筛选过滤条件");
    }
  };

  const handleExport = (type: "csv" | "excel") => {
    setShowExportMenu(false);
    if (showToast) {
      showToast(`导出${type.toUpperCase()}成功`, `已成功导出【${activePlatform}_${getDimensionLabel(activeDimension)}.${type}】文件`);
    }
  };

  const getDimensionLabel = (dim: string) => {
    switch (dim) {
      case "live_summary": return "直播间汇总";
      case "personnel": return "人员数据";
      case "category": return "分类数据";
      case "advertiser_detail": return "广告主明细";
      default: return "";
    }
  };

  // Filter dataset logic
  const getFilteredData = () => {
    if (activeDimension === "live_summary") {
      return LIVE_ROOM_ROWS.filter((r) => {
        if (advertiserNameInput && !r.roomName.includes(advertiserNameInput)) return false;
        return true;
      });
    } else if (activeDimension === "advertiser_detail") {
      return ADVERTISER_DETAIL_ROWS.filter((r) => {
        if (advertiserIdInput && !r.accountId.includes(advertiserIdInput)) return false;
        if (advertiserNameInput && !r.accountName.includes(advertiserNameInput)) return false;
        if (selectedTeam && r.team !== selectedTeam) return false;
        if (selectedGroup && r.group !== selectedGroup) return false;
        return true;
      });
    } else if (activeDimension === "personnel") {
      return PERSONNEL_ROWS.filter((r) => {
        if (advertiserNameInput && !r.name.includes(advertiserNameInput)) return false;
        return true;
      });
    } else {
      return CATEGORY_ROWS.filter((r) => {
        if (selectedCategory && r.cat1 !== selectedCategory) return false;
        return true;
      });
    }
  };

  const currentRows = getFilteredData();

  // Total Calculations
  const totalSpend = currentRows.reduce((acc, r: any) => acc + (r.spend || 0), 0);
  const totalGmv = currentRows.reduce((acc, r: any) => acc + (r.gmv || 0), 0);
  const totalCoupon = currentRows.reduce((acc, r: any) => acc + (r.coupon || 0), 0);
  const totalConv = currentRows.reduce((acc, r: any) => acc + (r.conv || 0), 0);
  const totalImp = currentRows.reduce((acc, r: any) => acc + (r.imp || 0), 0);

  const avgRoi = totalSpend > 0 ? totalGmv / totalSpend : 0;
  const avgCpa = totalConv > 0 ? totalSpend / totalConv : 0;

  return (
    <div className="space-y-4">
      {/* ================= 1. Top Platform Navigation Bar (Matches Screenshot 1 & 2) ================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-7 px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white overflow-x-auto">
          {[
            "巨量千川",
            "巨量广告",
            "巨量本地推",
            "磁力智投",
            "磁力金牛",
            "腾讯ADQ",
            "TikTok",
            "百度营销",
            "淘宝超级短视频"
          ].map((pName) => (
            <button
              key={pName}
              onClick={() => {
                setActivePlatform(pName);
                if (showToast) showToast("切换平台", `已切换至【${pName}】账户数据`);
              }}
              className={`text-sm font-bold pb-3 relative cursor-pointer whitespace-nowrap transition-all ${
                activePlatform === pName ? "text-[#7C3AED]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {pName}
              {activePlatform === pName && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Sub Promotion Mode Tabs (Under 巨量千川) */}
        {activePlatform === "巨量千川" && (
          <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex items-center gap-6">
            {[
              { id: "standard", label: "标准推广" },
              { id: "live_domain", label: "直播全域推广" },
              { id: "product_domain", label: "商品全域推广" }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubPromotion(sub.id as any)}
                className={`text-xs font-bold cursor-pointer relative pb-1 transition-colors ${
                  subPromotion === sub.id ? "text-[#7C3AED]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sub.label}
                {subPromotion === sub.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ================= 2. Dimension Tabs (直播间汇总 | 人员数据 | 分类数据 | 广告主明细) ================= */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-white flex items-center gap-8">
          {[
            { id: "live_summary", label: "直播间汇总" },
            { id: "personnel", label: "人员数据" },
            { id: "category", label: "分类数据" },
            { id: "advertiser_detail", label: "广告主明细" }
          ].map((dim) => (
            <button
              key={dim.id}
              onClick={() => setActiveDimension(dim.id as any)}
              className={`text-sm font-bold relative pb-1 cursor-pointer transition-colors ${
                activeDimension === dim.id ? "text-[#7C3AED]" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {dim.label}
              {activeDimension === dim.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ================= 3. Filter Controls Area (Matches Screenshot 1 & Screenshot 2) ================= */}
        <div className="p-4 bg-white space-y-3">
          {/* Top Dropdowns Row (Visible in '广告主明细' mode, matching Screenshot 2) */}
          {activeDimension === "advertiser_detail" && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* 请选择部门 */}
              <div className="relative">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
                >
                  <option value="">请选择部门</option>
                  <option value="A部门">A部门</option>
                  <option value="C部门">C部门</option>
                  <option value="外部部门">外部部门</option>
                  <option value="未绑定分组..">未绑定部门分组</option>
                </select>
              </div>

              {/* 请选择分组 */}
              <div className="relative">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
                >
                  <option value="">请选择分组</option>
                  <option value="核心二组">核心二组</option>
                  <option value="管理员组">管理员组</option>
                  <option value="分组一">分组一</option>
                  <option value="未绑定分组">未绑定分组</option>
                </select>
              </div>

              {/* 请选择账号 */}
              <div className="relative">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
                >
                  <option value="">请选择账号</option>
                  <option value="张伟">张伟 (zs_test)</option>
                  <option value="李娜">李娜 (0424)</option>
                  <option value="未绑定">未绑定账号</option>
                </select>
              </div>

              {/* 请选择分类 */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
                >
                  <option value="">请选择分类</option>
                  <option value="美妆护肤">美妆护肤</option>
                  <option value="3C数码">3C数码</option>
                  <option value="个人护理">个人护理</option>
                  <option value="未绑定分类">未绑定分类</option>
                </select>
              </div>
            </div>
          )}

          {/* Lower Filter Inputs & Actions Row (Matching Screenshot 1 & 2) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range Picker (2026-07-15 至 2026-07-30) */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
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

              {/* 请输入广告主ID */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入广告主ID"
                  value={advertiserIdInput}
                  onChange={(e) => setAdvertiserIdInput(e.target.value)}
                  className="pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs w-36"
                />
              </div>

              {/* 请输入广告主名称 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入广告主名称"
                  value={advertiserNameInput}
                  onChange={(e) => setAdvertiserNameInput(e.target.value)}
                  className="pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs w-40"
                />
              </div>

              {/* 未绑定数据 ? 点击前往 (Link to Open Binding Modal) */}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>未绑定数据</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <button
                  onClick={() => setShowBindModal(true)}
                  className="text-[#7C3AED] hover:underline font-bold ml-1 cursor-pointer"
                >
                  点击前往
                </button>
              </div>

              {/* 重置 Button */}
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>重置</span>
              </button>
            </div>

            {/* Right Buttons: 导出 ∨ and Column Config Icon */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <span>导出</span>
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

              {/* Column Settings Icon */}
              <button
                onClick={() => {
                  if (showToast) showToast("自定义表头", "您可以按需选择展示或隐藏数据列");
                }}
                className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. Data Table Area ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              {/* MODE 1: 直播间汇总 Headers (Matches Screenshot 1) */}
              {activeDimension === "live_summary" && (
                <tr className="bg-slate-50/90 border-y border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                  <th className="py-3.5 px-6 font-bold">直播间</th>
                  <th className="py-3.5 px-4 font-bold text-center">负责人</th>
                  <th className="py-3.5 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>消耗</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-bold text-center">roi</th>
                  <th className="py-3.5 px-4 font-bold text-center">成交金额</th>
                  <th className="py-3.5 px-4 font-bold text-center">智能优惠券</th>
                  <th className="py-3.5 px-4 font-bold text-center">转化数</th>
                  <th className="py-3.5 px-4 font-bold text-center">转化率</th>
                  <th className="py-3.5 px-4 font-bold text-center">转化成本</th>
                  <th className="py-3.5 px-6 font-bold text-center">展示数</th>
                </tr>
              )}

              {/* MODE 2: 广告主明细 Headers (Matches Screenshot 2) */}
              {activeDimension === "advertiser_detail" && (
                <tr className="bg-slate-50/90 border-y border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                  <th className="py-3.5 px-6 font-bold">广告账户</th>
                  <th className="py-3.5 px-4 font-bold">部门</th>
                  <th className="py-3.5 px-4 font-bold">分组</th>
                  <th className="py-3.5 px-4 font-bold text-center">用户</th>
                  <th className="py-3.5 px-4 font-bold">一级分类</th>
                  <th className="py-3.5 px-4 font-bold">二级分类</th>
                  <th className="py-3.5 px-4 font-bold text-center">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <span>消耗</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-bold text-center">roi</th>
                  <th className="py-3.5 px-4 font-bold text-center">成交金额</th>
                  <th className="py-3.5 px-6 font-bold text-center">智能优惠券</th>
                </tr>
              )}

              {/* MODE 3: 人员数据 Headers */}
              {activeDimension === "personnel" && (
                <tr className="bg-slate-50/90 border-y border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                  <th className="py-3.5 px-6 font-bold">人员名称</th>
                  <th className="py-3.5 px-4 font-bold text-center">关联账户数</th>
                  <th className="py-3.5 px-4 font-bold text-center">消耗</th>
                  <th className="py-3.5 px-4 font-bold text-center">roi</th>
                  <th className="py-3.5 px-4 font-bold text-center">成交金额</th>
                  <th className="py-3.5 px-4 font-bold text-center">智能优惠券</th>
                  <th className="py-3.5 px-4 font-bold text-center">转化数</th>
                  <th className="py-3.5 px-4 font-bold text-center">转化率</th>
                  <th className="py-3.5 px-6 font-bold text-center">转化成本</th>
                </tr>
              )}

              {/* MODE 4: 分类数据 Headers */}
              {activeDimension === "category" && (
                <tr className="bg-slate-50/90 border-y border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
                  <th className="py-3.5 px-6 font-bold">一级分类</th>
                  <th className="py-3.5 px-4 font-bold">二级分类</th>
                  <th className="py-3.5 px-4 font-bold text-center">关联账户数</th>
                  <th className="py-3.5 px-4 font-bold text-center">消耗</th>
                  <th className="py-3.5 px-4 font-bold text-center">roi</th>
                  <th className="py-3.5 px-4 font-bold text-center">成交金额</th>
                  <th className="py-3.5 px-4 font-bold text-center">智能优惠券</th>
                  <th className="py-3.5 px-6 font-bold text-center">转化数</th>
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Aggregate Row (总计) matching Screenshot 1 & 2 */}
              <tr className="bg-purple-50/30 border-b border-purple-100 font-bold text-slate-900 whitespace-nowrap">
                <td className="py-3.5 px-6 font-black text-slate-900">总计</td>
                {activeDimension === "live_summary" && (
                  <>
                    <td className="py-3.5 px-4 text-center text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#7C3AED]">{totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{avgRoi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">¥{totalGmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{totalCoupon.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-800">{totalConv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">-</td>
                    <td className="py-3.5 px-6 text-center text-slate-700">{totalImp.toLocaleString()}</td>
                  </>
                )}

                {activeDimension === "advertiser_detail" && (
                  <>
                    <td className="py-3.5 px-4 text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#7C3AED]">{totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{avgRoi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">¥{totalGmv.toLocaleString()}</td>
                    <td className="py-3.5 px-6 text-center text-slate-700">¥{totalCoupon.toLocaleString()}</td>
                  </>
                )}

                {activeDimension === "personnel" && (
                  <>
                    <td className="py-3.5 px-4 text-center text-slate-800">28</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#7C3AED]">{totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{avgRoi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-800">¥{totalGmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{totalCoupon.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-800">{totalConv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">-</td>
                    <td className="py-3.5 px-6 text-center text-slate-400">-</td>
                  </>
                )}

                {activeDimension === "category" && (
                  <>
                    <td className="py-3.5 px-4 text-slate-400">-</td>
                    <td className="py-3.5 px-4 text-center text-slate-800">32</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#7C3AED]">{totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{avgRoi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-800">¥{totalGmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{totalCoupon.toLocaleString()}</td>
                    <td className="py-3.5 px-6 text-center text-slate-800">{totalConv.toLocaleString()}</td>
                  </>
                )}
              </tr>

              {/* Data Rows for 直播间汇总 (Screenshot 1) */}
              {activeDimension === "live_summary" &&
                currentRows.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{row.roomName}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.leader}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.spend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{row.roi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{row.gmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">¥{row.coupon.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">{row.conv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.cvr}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.cpa}</td>
                    <td className="py-3.5 px-6 text-center text-slate-600">{row.imp.toLocaleString()}</td>
                  </tr>
                ))}

              {/* Data Rows for 广告主明细 (Screenshot 2) */}
              {activeDimension === "advertiser_detail" &&
                currentRows.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-800">{row.accountName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{row.accountId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 font-medium">{row.team}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-medium">{row.group}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.user}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-medium">{row.cat1}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-medium">{row.cat2}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.spend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{row.roi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{row.gmv.toLocaleString()}</td>
                    <td className="py-3.5 px-6 text-center text-slate-600">¥{row.coupon.toLocaleString()}</td>
                  </tr>
                ))}

              {/* Data Rows for 人员数据 */}
              {activeDimension === "personnel" &&
                currentRows.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3.5 px-6 font-bold text-[#7C3AED]">{row.name}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">{row.accountCount} 个</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.spend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{row.roi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{row.gmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">¥{row.coupon.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">{row.conv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.cvr}</td>
                    <td className="py-3.5 px-6 text-center text-slate-600">{row.cpa}</td>
                  </tr>
                ))}

              {/* Data Rows for 分类数据 */}
              {activeDimension === "category" &&
                currentRows.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{row.cat1}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{row.cat2}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">{row.accountCount} 个</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.spend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{row.roi.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">¥{row.gmv.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">¥{row.coupon.toLocaleString()}</td>
                    <td className="py-3.5 px-6 text-center text-slate-700">{row.conv.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Horizontal Separator Line (Matches Screenshots) */}
        <div className="h-1.5 bg-slate-200/80 mx-4 rounded-full my-2" />

        {/* ================= 5. Pagination Bar (Matches Screenshot 1 & 2) ================= */}
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

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
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

          {/* Go to page input */}
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

      {/* ================= 6. Bind Data Modal (未绑定数据 绑定/映射弹窗) ================= */}
      {showBindModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="text-base font-bold text-slate-900">未绑定广告主/直播间快速数据关联</h3>
              </div>
              <button
                onClick={() => setShowBindModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                当前有 <span className="font-bold text-purple-600">2</span> 个广告主账户未完成部门或品类映射。选择归属部门后系统将自动更新历史投产统计数据。
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">未绑定账户名称</label>
                  <div className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    直播-铃蓓-牧唐-芜湖1 (1787869271614468)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">分配归属部门</label>
                    <select className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-purple-500">
                      <option value="A部门">A部门</option>
                      <option value="C部门">C部门</option>
                      <option value="外部部门">外部部门</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">指定所属分组</label>
                    <select className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-purple-500">
                      <option value="核心二组">核心二组</option>
                      <option value="管理员组">管理员组</option>
                      <option value="分组一">分组一</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">责任负责人</label>
                    <input
                      type="text"
                      defaultValue="张伟"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">主营业务品类</label>
                    <select className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-purple-500">
                      <option value="美妆护肤">美妆护肤</option>
                      <option value="3C数码">3C数码</option>
                      <option value="个人护理">个人护理</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBindModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowBindModal(false);
                  if (showToast) showToast("关联成功", "已将【直播-铃蓓-牧唐-芜湖1】成功绑定至 A部门 - 核心二组");
                }}
                className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> 确认绑定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
