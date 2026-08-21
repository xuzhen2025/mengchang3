import React, { useState } from "react";
import { 
  User, 
  Coins, 
  Filter, 
  Key, 
  Send, 
  CheckCircle, 
  X, 
  Sparkles,
  FileText,
  ShieldCheck,
  Plus,
  FolderOpen,
  Tags
} from "lucide-react";
import { Asset, CreditTransaction } from "../types";
import PersonalResourceCenter from "./PersonalResourceCenterV2";
import ChangePasswordModal from "./ChangePasswordModal";
import PersonalInformationPanel from "./PersonalInformationPanel";

interface CreditsDashboardProps {
  credits: number;
  extraRequestedCredits?: number;
  transactions: CreditTransaction[];
  assets: Asset[];
  onAddCredits: (amount: number, remark: string) => void;
  onRequestCredits?: (amount: number, manager: string, reason: string, project?: string) => void;
}

export default function CreditsDashboard({
  credits,
  extraRequestedCredits: propExtraRequestedCredits,
  transactions,
  assets,
  onAddCredits,
  onRequestCredits
}: CreditsDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "resources" | "personal_tags" | "history">("profile");
  
  // Extra requested credits state fallback
  const [internalExtraRequestedCredits, setInternalExtraRequestedCredits] = useState<number>(350.00);
  const extraRequestedCreditsVal = propExtraRequestedCredits !== undefined ? propExtraRequestedCredits : internalExtraRequestedCredits;
  const totalAvailableCredits = credits + extraRequestedCreditsVal;

  // Filters for Billing History
  const [typeFilter, setTypeFilter] = useState<"all" | "consume" | "recharge" | "refund">("all");
  const [toolFilter, setToolFilter] = useState<string>("all");

  // Modal States
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);

  // Apply Credits Form
  const [applyForm, setApplyForm] = useState({
    amount: "500",
    manager: "张总 (品牌一部部长)",
    reason: "",
    project: ""
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit Credits Application
  const handleApplyCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(applyForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("请输入有效的申请积分数量");
      return;
    }
    if (!applyForm.reason.trim()) {
      alert("请填写申请积分的业务用途或原因");
      return;
    }

    if (onRequestCredits) {
      onRequestCredits(amountNum, applyForm.manager, applyForm.reason.trim(), applyForm.project.trim());
      showToast(`📩 已提交 ${amountNum} 积分申请至部长【${applyForm.manager}】，审批通知已实时推送至消息中心！`);
    } else {
      onAddCredits(amountNum, `向部长【${applyForm.manager}】申请积分 (${applyForm.reason.trim()})`);
      showToast(`✅ 已成功提交 ${amountNum} 积分申请！`);
    }

    setInternalExtraRequestedCredits(prev => prev + amountNum);
    setShowApplyModal(false);
    setApplyForm({
      amount: "500",
      manager: "张总 (品牌一部部长)",
      reason: "",
      project: ""
    });
  };

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const typeMatch = typeFilter === "all" || tx.type === typeFilter;
    const toolMatch = toolFilter === "all" || tx.tool === toolFilter;
    return typeMatch && toolMatch;
  });

  const toolsList = ["商详套图", "AI视频", "AI图片", "水印擦除", "字幕擦除", "画质增强", "爆款裂变", "系统赠送"];

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto font-sans relative">
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto w-full max-w-none space-y-6">
        {/* Header Title Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              个人中心
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              查看个人基础资料、所属部门架构、可用算力积分与明细账单
            </p>
          </div>
          
          {/* Nav Tabs */}
          <div className="flex w-full flex-wrap bg-slate-100 border border-slate-200 p-1 rounded-lg lg:w-auto lg:shrink-0">
            {([
              ["profile", "个人信息", User],
              ["resources", "我的资源", FolderOpen],
              ["personal_tags", "个人标签", Tags],
              ["history", "明细账单", Coins]
            ] as const).map(([value, label, Icon]) => (
              <button key={value} onClick={() => setActiveSubTab(value)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === value ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
                <Icon className="w-3.5 h-3.5" /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Balance Overview Cards: only shown with personal information. */}
        {activeSubTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 可用积分 (主卡片 / 核心算力总额) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white p-5 shadow-md flex flex-col justify-between">
            <div className="absolute right-2 top-2 opacity-15 pointer-events-none">
              <Coins className="w-24 h-24 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-200">✦ 可用积分 ✦</p>
                <span className="text-[10px] bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold">
                  总额
                </span>
              </div>
              <h3 className="text-3xl font-black font-mono mt-2 tracking-tight">
                {totalAvailableCredits.toFixed(2)}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-purple-100 flex items-center justify-between font-mono">
              <span>= 当月剩余积分({credits.toFixed(2)}) + 额外申请积分({extraRequestedCreditsVal.toFixed(2)})</span>
            </div>
          </div>

          {/* Card 2: 当月剩余积分 */}
          <div className="relative overflow-hidden rounded-2xl bg-purple-50/70 border border-purple-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-700">当月剩余积分</p>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  基础额度
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-purple-950 font-mono mt-2">
                {credits.toFixed(2)}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-purple-600">
              <CheckCircle className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>全平台 AI 模型通用基础算力</span>
            </div>
          </div>

          {/* Card 3: 额外申请积分 */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600">额外申请积分</p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200 transition-colors cursor-pointer"
                >
                  + 申请补给
                </button>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 font-mono mt-2">
                {extraRequestedCreditsVal.toFixed(2)}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>经主管/部长审批补给的算力额度</span>
            </div>
          </div>
        </div>
        )}

        {(activeSubTab === "resources" || activeSubTab === "personal_tags") && (
          <PersonalResourceCenter mode={activeSubTab} assets={assets} onToast={showToast} />
        )}

        {/* TAB 1: 个人信息 (PROFILE TAB) */}
        {activeSubTab === "profile" && (
          <PersonalInformationPanel
            name="徐振"
            role="剪辑师"
            employeeId="ZS-008"
            phone="138****8888"
            email="xuzhen@dreamchang.com"
            recentLogin="最近登录: 2026-08-05 23:20 (IP: 110.88.24.18 - 本地局域网)"
            company="梦畅AIGC"
            companyLevel="1级公司 (HQ-001)"
            parentNode="最高公司节点 (无上级)"
            structureType="公司 > 部门 > 分组 > 人员"
            hierarchySummary="电商投放一部 (女装千川放量组、美妆珠宝爆款组)、品牌效果投放部、AIGC爆款内容拆解部 (千川剧本拆解小组)、视频智能剪辑中心"
            actions={(
              <>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>修改密码</span>
                  </button>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>申请积分</span>
                  </button>
              </>
            )}
          />
        )}

        {/* TAB 2: 明细账单 (BILLING HISTORY TAB) */}
        {activeSubTab === "history" && (
          <div className="space-y-4">
            {/* Filters Row */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>账单类型:</span>
                </div>
                <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                  {(["all", "consume", "recharge", "refund"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        typeFilter === t
                          ? "bg-white text-slate-700 shadow-xs border border-slate-100"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {t === "all" ? "全部" : t === "consume" ? "消费" : t === "recharge" ? "充值" : "退款"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">功能归属:</span>
                <select
                  value={toolFilter}
                  onChange={(e) => setToolFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-1.5 text-slate-600 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">全部工具</option>
                  {toolsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="p-4">时间 / 流水号</th>
                      <th className="p-4">工具项目</th>
                      <th className="p-4">明细说明</th>
                      <th className="p-4 text-right">变化额度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-slate-400 text-xs">
                          没有符合过滤条件的账单明细
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-slate-700 font-mono">{tx.time}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.id}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500 text-[10px]">
                              {tx.tool}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 max-w-xs truncate">
                            {tx.remark}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`font-bold font-mono text-sm ${
                              tx.type === "recharge" || tx.type === "refund"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}>
                              {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: 向部长申请积分 ================= */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                <span>向部长申请算力积分</span>
              </span>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleApplyCreditsSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3 text-[11px] text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-purple-600" />
                  <span>算力补给规则</span>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  日常业务生成所需额外积分可随时向部门主管/部长发起申请。审批通过后积分将实时充入您的个人账户。
                </p>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  申请积分数量 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    required
                    value={applyForm.amount}
                    onChange={(e) => setApplyForm({ ...applyForm, amount: e.target.value })}
                    placeholder="请输入积分数量，如 500"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-purple-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">
                    积分
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  审批部长 / 主管 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={applyForm.manager}
                  onChange={(e) => setApplyForm({ ...applyForm, manager: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="张总 (品牌一部部长)">张总 (品牌一部部长)</option>
                  <option value="李经理 (电商投放部部长)">李经理 (电商投放部部长)</option>
                  <option value="王主管 (AIGC爆款拆解部主管)">王主管 (AIGC爆款拆解部主管)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  关联业务项目 / 任务名称 (选填)
                </label>
                <input
                  type="text"
                  value={applyForm.project}
                  onChange={(e) => setApplyForm({ ...applyForm, project: e.target.value })}
                  placeholder="如：美妆秋季新品爆款视频裂变"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  申请原因 / 算力用途 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                  placeholder="请详细阐述本次申请积分的具体用途，例如：千川投放素材批量渲染、画质 4K 提升及模特重组..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>提交积分申请</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 修改密码 ================= */}
      <ChangePasswordModal
        open={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={() => showToast("密码修改成功，请妥善保管您的新登录密码。")}
      />
    </div>
  );
}
