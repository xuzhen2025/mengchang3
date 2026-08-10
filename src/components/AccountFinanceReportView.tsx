import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Search,
  RotateCcw,
  Check
} from "lucide-react";

interface AccountFinanceReportViewProps {
  showToast?: (title: string, desc: string) => void;
}

interface FinancialRow {
  accountName: string;
  accountId: string;
  team: string;
  group: string;
  user: string;
  cat1: string;
  cat2: string;
  totalSpend: number;
  nonGrantSpend: number;
  grantSpend: number;
  rebateSpend: number;
  sharedWalletSpend: number;
  totalDeposit: number;
  totalTransferIn: number;
  totalTransferOut: number;
  totalBalance: number;
  grantBalance: number;
  nonGrantBalance: number;
  standardSpend: number;
  globalSpend: number;
  remark: string;
}

const INITIAL_ROWS: FinancialRow[] = [
  {
    accountName: "青筒-元素-持之以恒",
    accountId: "1862066464789898",
    team: "未绑定部门",
    group: "未绑定分组",
    user: "未绑定账号",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    totalSpend: 92393.53,
    nonGrantSpend: 90523.42,
    grantSpend: 1870.11,
    rebateSpend: 0,
    sharedWalletSpend: 0,
    totalDeposit: 1870.11,
    totalTransferIn: 100000.00,
    totalTransferOut: 0,
    totalBalance: 88527.53,
    grantBalance: 0,
    nonGrantBalance: 88527.53,
    standardSpend: 0,
    globalSpend: 0,
    remark: "-"
  },
  {
    accountName: "书意-RICH-扶摇直上九万里",
    accountId: "1839701482129801",
    team: "未绑定部门",
    group: "未绑定分组",
    user: "未绑定账号",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    totalSpend: 68531.65,
    nonGrantSpend: 68202.75,
    grantSpend: 328.90,
    rebateSpend: 0,
    sharedWalletSpend: 0,
    totalDeposit: 328.90,
    totalTransferIn: 100000.00,
    totalTransferOut: 0,
    totalBalance: 140294.48,
    grantBalance: 0,
    nonGrantBalance: 140294.48,
    standardSpend: 0,
    globalSpend: 68351.04,
    remark: "-"
  },
  {
    accountName: "兰君-粤理-爆单888",
    accountId: "1843476828396544",
    team: "未绑定部门",
    group: "未绑定分组",
    user: "未绑定账号",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    totalSpend: 38148.62,
    nonGrantSpend: 37734.20,
    grantSpend: 414.42,
    rebateSpend: 0,
    sharedWalletSpend: 0,
    totalDeposit: 414.42,
    totalTransferIn: 52500.00,
    totalTransferOut: 0,
    totalBalance: 55533.17,
    grantBalance: 0,
    nonGrantBalance: 55533.17,
    standardSpend: 0,
    globalSpend: 0,
    remark: "-"
  },
  {
    accountName: "素棉-粤理-爆米花",
    accountId: "1868511341739399",
    team: "未绑定部门",
    group: "未绑定分组",
    user: "未绑定账号",
    cat1: "未绑定分类..",
    cat2: "未绑定分类",
    totalSpend: 21948.51,
    nonGrantSpend: 21948.51,
    grantSpend: 0.00,
    rebateSpend: 0,
    sharedWalletSpend: 0,
    totalDeposit: 0.00,
    totalTransferIn: 0.00,
    totalTransferOut: 0,
    totalBalance: 38610.93,
    grantBalance: 0,
    nonGrantBalance: 38610.93,
    standardSpend: 0,
    globalSpend: 0,
    remark: "-"
  },
  {
    accountName: "初理-惠理-跑量",
    accountId: "1851290312019482",
    team: "A部门",
    group: "核心一组",
    user: "张伟",
    cat1: "美妆护肤",
    cat2: "洗面奶",
    totalSpend: 102143.09,
    nonGrantSpend: 100800.00,
    grantSpend: 1343.09,
    rebateSpend: 0,
    sharedWalletSpend: 0,
    totalDeposit: 974.73,
    totalTransferIn: 314000.00,
    totalTransferOut: 100000.00,
    totalBalance: 1315202.11,
    grantBalance: 70439.87,
    nonGrantBalance: 1244762.24,
    standardSpend: 0,
    globalSpend: 35374.58,
    remark: "-"
  }
];

export default function AccountFinanceReportView({ showToast }: AccountFinanceReportViewProps) {
  const [activePlatform, setActivePlatform] = useState<string>("巨量千川");
  const [accountQuery, setAccountQuery] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [queryDate, setQueryDate] = useState<string>("2026-07-29");

  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered rows
  const filteredRows = INITIAL_ROWS.filter((r) => {
    if (accountQuery) {
      const matchName = r.accountName.toLowerCase().includes(accountQuery.toLowerCase());
      const matchId = r.accountId.includes(accountQuery);
      if (!matchName && !matchId) return false;
    }
    if (selectedTeam && r.team !== selectedTeam) return false;
    if (selectedGroup && r.group !== selectedGroup) return false;
    if (selectedAccount && r.user !== selectedAccount) return false;
    if (selectedCategory && r.cat1 !== selectedCategory) return false;
    return true;
  });

  // Calculate Aggregates (Matching values in screenshot aggregate row)
  const sumTotalSpend = filteredRows.reduce((a, b) => a + b.totalSpend, 0);
  const sumNonGrantSpend = filteredRows.reduce((a, b) => a + b.nonGrantSpend, 0);
  const sumGrantSpend = filteredRows.reduce((a, b) => a + b.grantSpend, 0);
  const sumRebateSpend = filteredRows.reduce((a, b) => a + b.rebateSpend, 0);
  const sumSharedWalletSpend = filteredRows.reduce((a, b) => a + b.sharedWalletSpend, 0);
  const sumTotalDeposit = filteredRows.reduce((a, b) => a + b.totalDeposit, 0);
  const sumTotalTransferIn = filteredRows.reduce((a, b) => a + b.totalTransferIn, 0);
  const sumTotalTransferOut = filteredRows.reduce((a, b) => a + b.totalTransferOut, 0);
  const sumTotalBalance = filteredRows.reduce((a, b) => a + b.totalBalance, 0);
  const sumGrantBalance = filteredRows.reduce((a, b) => a + b.grantBalance, 0);
  const sumNonGrantBalance = filteredRows.reduce((a, b) => a + b.nonGrantBalance, 0);
  const sumStandardSpend = filteredRows.reduce((a, b) => a + b.standardSpend, 0);
  const sumGlobalSpend = filteredRows.reduce((a, b) => a + b.globalSpend, 0);

  const handleReset = () => {
    setAccountQuery("");
    setSelectedTeam("");
    setSelectedGroup("");
    setSelectedAccount("");
    setSelectedCategory("");
    setQueryDate("2026-07-29");
    if (showToast) {
      showToast("重置成功", "已清空查询与过滤筛选条件");
    }
  };

  const handleExport = (type: string) => {
    setShowExportMenu(false);
    if (showToast) {
      showToast("导出成功", `已为您成功导出【广告账户财务报表_${queryDate}.${type}】`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Top Platform Header Tabs (Matching Screenshot 1 & 2) */}
      <div className="flex items-center gap-8 px-6 pt-3.5 pb-0 border-b border-slate-100 bg-white">
        {["巨量千川", "巨量广告"].map((pName) => (
          <button
            key={pName}
            onClick={() => {
              setActivePlatform(pName);
              if (showToast) showToast("切换平台", `已切换至【${pName}】财务报表`);
            }}
            className={`text-sm font-bold pb-3 relative cursor-pointer transition-colors ${
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

      {/* 2. Filter Bar (Matching Screenshots 1, 2, 3, 4) */}
      <div className="p-4 bg-white border-b border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* 请输入账户名称/ID */}
          <input
            type="text"
            placeholder="请输入账户名称/ID"
            value={accountQuery}
            onChange={(e) => setAccountQuery(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs min-w-[170px]"
          />

          {/* 请选择部门 */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
          >
            <option value="">请选择部门</option>
            <option value="A部门">A部门</option>
            <option value="未绑定部门">未绑定部门</option>
          </select>

          {/* 请选择分组 */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
          >
            <option value="">请选择分组</option>
            <option value="核心一组">核心一组</option>
            <option value="未绑定分组">未绑定分组</option>
          </select>

          {/* 请选择账号 */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
          >
            <option value="">请选择账号</option>
            <option value="张伟">张伟</option>
            <option value="未绑定账号">未绑定账号</option>
          </select>

          {/* 请选择分类 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer min-w-[150px]"
          >
            <option value="">请选择分类</option>
            <option value="美妆护肤">美妆护肤</option>
            <option value="未绑定分类..">未绑定分类..</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={queryDate}
              onChange={(e) => setQueryDate(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium outline-none w-28 cursor-pointer"
            />
          </div>

          {/* 查询 Button (Solid Purple #7C3AED) */}
          <button
            onClick={() => {
              if (showToast) showToast("查询完成", `已更新【${queryDate}】的数据流水报表`);
            }}
            className="px-5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>

          {/* 重置 Button */}
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 3. Section Title Bar (详细数据 & 导出 ∨) */}
      <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
        <div className="text-xs font-black text-slate-800">详细数据</div>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <span>导出</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 animate-fade-in">
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>导出 csv</span>
              </button>
              <button
                onClick={() => handleExport("xlsx")}
                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>导出 excel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Full Table with Horizontal Scrollable Matrix */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[2200px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-xs whitespace-nowrap">
              {/* Sticky Left Account Column */}
              <th className="py-3.5 px-6 font-bold sticky left-0 bg-slate-50/95 z-20 shadow-xs border-r border-slate-200/50">
                广告账户
              </th>
              <th className="py-3.5 px-4 font-bold">部门</th>
              <th className="py-3.5 px-4 font-bold">分组</th>
              <th className="py-3.5 px-4 font-bold">关联用户</th>
              <th className="py-3.5 px-4 font-bold">一级分类</th>
              <th className="py-3.5 px-4 font-bold">二级分类</th>

              {/* Numerical Metrics */}
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>总消耗</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>非赠款消耗</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>赠款消耗</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>消返红包消耗</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>共享钱包消耗</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>总存入</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>总转入</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>总转出</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>总余额</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>赠款金额</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>非赠款金额</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-right">标准消耗</th>
              <th className="py-3.5 px-4 font-bold text-right">全域消耗</th>
              <th className="py-3.5 px-6 font-bold text-center">备注</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {/* Aggregate (总计) Row - Matches Screenshots */}
            <tr className="bg-purple-50/20 font-bold text-slate-900 whitespace-nowrap">
              <td className="py-3.5 px-6 font-black text-slate-900 sticky left-0 bg-purple-50/90 z-10 border-r border-slate-200/50">
                总计
              </td>
              <td className="py-3.5 px-4 text-slate-400">-</td>
              <td className="py-3.5 px-4 text-slate-400">-</td>
              <td className="py-3.5 px-4 text-slate-400">-</td>
              <td className="py-3.5 px-4 text-slate-400">-</td>
              <td className="py-3.5 px-4 text-slate-400">-</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-900">{sumTotalSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">{sumNonGrantSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">{sumGrantSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-700">{sumRebateSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-700">{sumSharedWalletSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-800">{sumTotalDeposit.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-purple-700">{sumTotalTransferIn.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-700">{sumTotalTransferOut.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{sumTotalBalance.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">{sumGrantBalance.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">{sumNonGrantBalance.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-700">{sumStandardSpend.toFixed(2)}</td>
              <td className="py-3.5 px-4 text-right text-slate-700">{sumGlobalSpend.toFixed(2)}</td>
              <td className="py-3.5 px-6 text-center text-slate-400">-</td>
            </tr>

            {/* Individual Financial Account Rows */}
            {filteredRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                {/* Account Name & ID (Sticky) */}
                <td className="py-3.5 px-6 sticky left-0 bg-white hover:bg-slate-50 z-10 border-r border-slate-200/50">
                  <div className="font-bold text-slate-800">{row.accountName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{row.accountId}</div>
                </td>

                <td className="py-3.5 px-4 text-[#7C3AED] font-medium">{row.team}</td>
                <td className="py-3.5 px-4 text-[#7C3AED] font-medium">{row.group}</td>
                <td className="py-3.5 px-4 text-[#7C3AED] font-medium">{row.user}</td>
                <td className="py-3.5 px-4 text-[#7C3AED] font-medium">{row.cat1}</td>
                <td className="py-3.5 px-4 text-[#7C3AED] font-medium">{row.cat2}</td>

                {/* Financial Metrics */}
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">{row.totalSpend.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-800">{row.nonGrantSpend.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-800">{row.grantSpend.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-600">{row.rebateSpend}</td>
                <td className="py-3.5 px-4 text-right text-slate-600">{row.sharedWalletSpend}</td>
                <td className="py-3.5 px-4 text-right text-slate-800">{row.totalDeposit.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-bold text-[#7C3AED]">{row.totalTransferIn.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-700">{row.totalTransferOut.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{row.totalBalance.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-800">{row.grantBalance.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-800">{row.nonGrantBalance.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-slate-600">{row.standardSpend}</td>
                <td className="py-3.5 px-4 text-right text-slate-800">{row.globalSpend.toFixed(2)}</td>
                <td className="py-3.5 px-6 text-center text-slate-400">{row.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Horizontal Scroll Bar Accent Line */}
      <div className="h-1.5 bg-slate-200/80 mx-4 rounded-full my-2" />

      {/* 5. Pagination Bar (Matching Screenshots) */}
      <div className="flex flex-wrap items-center justify-end gap-4 px-6 py-3.5 bg-white border-t border-slate-100 text-xs text-slate-500">
        <div>共 {filteredRows.length} 条</div>

        {/* Page Size Select */}
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

        {/* Page Switch Buttons */}
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

        {/* Page Input */}
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
  );
}
