import React, { useState } from "react";
import { 
  FolderHeart, 
  Video, 
  FileText, 
  ListTodo, 
  Tag, 
  FolderTree, 
  Copy, 
  Sparkles, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Plus, 
  Eye, 
  TrendingUp, 
  Play, 
  Layers,
  BarChart2,
  FileCheck,
  Zap,
  Check
} from "lucide-react";
import AdminResourceView from "./AdminResourceView";
import CategoryManagementSubView from "./CategoryManagementSubView";
import PlatformTagsView from "./PlatformTagsView";

interface AdminViewProps {
  adminActiveScreen: string;
  onTriggerTask?: (type: any, name: string, inputFiles: string[], cost: number) => void;
  onOpenTaskQueue?: () => void;
}

type ContentTabType = 
  | "resource_hub"
  | "video_status"
  | "script_status"
  | "tasks"
  | "tags"
  | "categories"
  | "script_templates";

export default function AdminView({ adminActiveScreen, onTriggerTask, onOpenTaskQueue }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<ContentTabType>("resource_hub");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navTabs: { id: ContentTabType; label: string; icon: any; desc: string }[] = [
    { id: "resource_hub", label: "资源库", icon: FolderHeart, desc: "成片/素材/脚本/图片/音频统一管理" },
    { id: "video_status", label: "视频状态", icon: Video, desc: "渲染成片/审片流转/投放状态监控" },
    { id: "script_status", label: "脚本状态", icon: FileText, desc: "文案拆解/AI分镜/审核归档状态" },
    { id: "tasks", label: "任务", icon: ListTodo, desc: "后台AI生成与批量渲染任务监控" },
    { id: "tags", label: "标签", icon: Tag, desc: "受众偏好与平台爆款标签体系" },
    { id: "categories", label: "分类管理", icon: FolderTree, desc: "多级类目架构与业务属性划分" },
    { id: "script_templates", label: "脚本模板", icon: Copy, desc: "结构化文案框架与AI创作模版" },
  ];

  const handleTabClick = (tabId: ContentTabType) => {
    setActiveTab(tabId);
    if (tabId === "tasks" && onOpenTaskQueue) {
      onOpenTaskQueue();
    }
  };

  // Mock data for Video Status
  const videoStatusList = [
    { id: "V-2026-001", title: "【防晒霜】高颜值清爽不黏腻种草短视频", author: "张小梅", dept: "电商1组", status: "已完成", date: "2026-08-11 14:20", duration: "00:45", runs: 128 },
    { id: "V-2026-002", title: "【智能降噪耳机】深度测评对比画质增强版", author: "李强", dept: "品牌2组", status: "渲染中", date: "2026-08-11 15:05", duration: "01:12", runs: 45 },
    { id: "V-2026-003", title: "【夏季清凉女装】穿搭走秀多视角切片", author: "王芳", dept: "服装推广部", status: "待审核", date: "2026-08-11 11:30", duration: "00:30", runs: 210 },
    { id: "V-2026-004", title: "【空气炸锅】无油低卡美食制作过程", author: "赵天", dept: "家电业务部", status: "投放中", date: "2026-08-10 18:45", duration: "01:05", runs: 530 },
    { id: "V-2026-005", title: "【抗衰精华】实验室成分科普旁白版", author: "陈明", dept: "护肤项目组", status: "违规下架", date: "2026-08-09 09:12", duration: "00:50", runs: 12 },
  ];

  // Mock data for Script Status
  const scriptStatusList = [
    { id: "S-101", name: "护肤品痛点突破三段式口播文案", category: "美妆护肤", status: "AI分镜拆解中", author: "梁靖淇", updatedAt: "2026-08-11 16:00", words: 380 },
    { id: "S-102", name: "数码爆款沉浸式开箱评测脚本", category: "3C数码", status: "已生成视频", author: "汤小真", updatedAt: "2026-08-11 12:15", words: 520 },
    { id: "S-103", name: "限时买一赠一开场黄金3秒吸睛台词", category: "通用电商", status: "草稿", author: "刘建国", updatedAt: "2026-08-10 19:30", words: 210 },
    { id: "S-104", name: "服饰秋冬新品走秀情感共鸣脚本", category: "服装鞋帽", status: "爆款归档", author: "周华", updatedAt: "2026-08-08 10:20", words: 640 },
  ];

  // Mock data for Script Templates
  const scriptTemplates = [
    { id: "T-01", title: "黄金3秒痛点直击型", tag: "高转化", scenario: "美妆/日化/食品", structure: "场景痛点 -> 效果实测 -> 限时福利", usageCount: "2,410 次" },
    { id: "T-02", title: "沉浸式前后对比测评", tag: "强视觉", scenario: "3C数码/家居/小家电", structure: "传统困扰 vs 极致体验 -> 原理解析 -> 引导下单", usageCount: "1,890 次" },
    { id: "T-03", title: "种草剧情与反转剧本", tag: "高完播", scenario: "服装穿搭/剧情号/生活方式", structure: "日常冲突 -> 意外发现 -> 产品救场 -> 真实推荐", usageCount: "3,120 次" },
    { id: "T-04", title: "专家成分科普旁白型", tag: "高背书", scenario: "大健康/高端护肤/母婴", structure: "行业误区 -> 核心成分透析 -> 权威认证 -> 优惠福利", usageCount: "1,450 次" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 text-slate-800 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/80 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 顶部一排导航栏 (与资源库页面风格完全一致) */}
      <div className="pt-4 px-5 pb-1 bg-slate-50 shrink-0 z-30 relative">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs relative">
          <div className="flex items-center justify-between p-1.5 bg-slate-50/70 rounded-xl overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? "bg-white text-[#7C3AED] shadow-2xs border border-purple-200/80 ring-1 ring-purple-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 选项卡内容区域 */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        {/* TAB 1: 资源库 */}
        {activeTab === "resource_hub" && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <AdminResourceView />
          </div>
        )}

        {/* TAB 2: 视频状态 */}
        {activeTab === "video_status" && (
          <div className="p-6 space-y-5 animate-fade-in max-w-7xl mx-auto w-full">
            {/* Metric Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "视频总数", val: "1,248", color: "text-slate-900", bg: "bg-slate-100" },
                { label: "渲染中", val: "18", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                { label: "待审核", val: "32", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
                { label: "投放中", val: "890", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
                { label: "违规/下架", val: "5", color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
              ].map((m, idx) => (
                <div key={idx} className={`p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs`}>
                  <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                  <div className={`text-2xl font-black font-mono mt-1 ${m.color}`}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>渲染与投放视频状态列表</span>
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="搜索视频标题 / 编号..." 
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-56 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-3.5 h-3.5" />
                    <span>筛选状态</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50">
                      <th className="py-3 px-3">视频编号</th>
                      <th className="py-3 px-3">视频名称</th>
                      <th className="py-3 px-3">创作者 / 部门</th>
                      <th className="py-3 px-3">时长</th>
                      <th className="py-3 px-3">当前状态</th>
                      <th className="py-3 px-3">更新时间</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {videoStatusList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-slate-500">{item.id}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{item.title}</td>
                        <td className="py-3.5 px-3 text-slate-600">{item.author} <span className="text-slate-400">({item.dept})</span></td>
                        <td className="py-3.5 px-3 font-mono">{item.duration}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            item.status === "投放中" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                            item.status === "渲染中" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                            item.status === "待审核" ? "bg-indigo-50 text-indigo-600 border border-indigo-200" :
                            item.status === "已完成" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                            "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 font-mono">{item.date}</td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          <button onClick={() => showToast(`预览视频: ${item.title}`)} className="text-purple-600 font-bold hover:underline cursor-pointer">查看</button>
                          <button onClick={() => showToast(`更改视频 [${item.id}] 状态成功`)} className="text-slate-500 hover:text-slate-800 cursor-pointer">管理</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 脚本状态 */}
        {activeTab === "script_status" && (
          <div className="p-6 space-y-5 animate-fade-in max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>文案与分镜脚本流转状态</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">监控全局脚本从初稿、AI拆解、生成视频到归档的全生命周期</p>
                </div>
                <button 
                  onClick={() => showToast("新建脚本功能可在前端录入")}
                  className="px-3.5 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建脚本</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50">
                      <th className="py-3 px-3">脚本编号</th>
                      <th className="py-3 px-3">脚本名称</th>
                      <th className="py-3 px-3">归属类目</th>
                      <th className="py-3 px-3">字数</th>
                      <th className="py-3 px-3">流转状态</th>
                      <th className="py-3 px-3">提交作者</th>
                      <th className="py-3 px-3">更新时间</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {scriptStatusList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-slate-500">{item.id}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3.5 px-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px]">{item.category}</span></td>
                        <td className="py-3.5 px-3 font-mono">{item.words} 字</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            item.status === "已生成视频" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                            item.status === "AI分镜拆解中" ? "bg-indigo-50 text-indigo-600 border border-indigo-200" :
                            item.status === "爆款归档" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{item.author}</td>
                        <td className="py-3.5 px-3 text-slate-400 font-mono">{item.updatedAt}</td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          <button onClick={() => showToast(`查看脚本 [${item.name}]`)} className="text-purple-600 font-bold hover:underline cursor-pointer">编辑</button>
                          <button onClick={() => showToast(`触发分镜合成: ${item.name}`)} className="text-indigo-600 font-bold hover:underline cursor-pointer">生成视频</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 任务 */}
        {activeTab === "tasks" && (
          <div className="p-6 space-y-5 animate-fade-in max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-purple-600" />
                    <span>后台渲染与生成任务监控</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">全局实时任务队列、算力消耗与并发节点状态</p>
                </div>
                <button 
                  onClick={() => showToast("已刷新任务队列")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                >
                  刷新队列
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl">
                  <span className="text-xs font-bold text-purple-700">正在排队/渲染任务</span>
                  <div className="text-2xl font-black font-mono text-purple-900 mt-1">4 个</div>
                </div>
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <span className="text-xs font-bold text-emerald-700">今日已成功渲染</span>
                  <div className="text-2xl font-black font-mono text-emerald-900 mt-1">142 个</div>
                </div>
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <span className="text-xs font-bold text-indigo-700">GPU集群并发负载</span>
                  <div className="text-2xl font-black font-mono text-indigo-900 mt-1">68.5%</div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-xs text-slate-500 font-mono">
                <p className="font-bold text-slate-700 mb-2">✦ 任务列表（示例容器）</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-slate-800">[TASK-8812] 美妆千川视频批量裂变渲染 (10条)</span>
                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">渲染进度 65%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-slate-800">[TASK-8813] AI音频高保真人声合成</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">已完成</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 标签 */}
        {activeTab === "tags" && (
          <div className="p-6 animate-fade-in max-w-7xl mx-auto w-full">
            <PlatformTagsView showToast={showToast} />
          </div>
        )}

        {/* TAB 6: 分类管理 */}
        {activeTab === "categories" && (
          <div className="p-6 animate-fade-in max-w-7xl mx-auto w-full">
            <CategoryManagementSubView />
          </div>
        )}

        {/* TAB 7: 脚本模板 */}
        {activeTab === "script_templates" && (
          <div className="p-6 space-y-5 animate-fade-in max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-purple-600" />
                  <span>爆款文案与脚本模板库</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">预设高转化剧本结构，支持一键套用与分镜填充</p>
              </div>
              <button 
                onClick={() => showToast("添加自定义模板已触发")}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增脚本模板</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scriptTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200/60">{template.tag}</span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-2">{template.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">适用场景: {template.scenario}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">调用: {template.usageCount}</span>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 block mb-1">结构拆解:</span>
                    <p className="font-mono text-slate-500">{template.structure}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">{template.id}</span>
                    <button 
                      onClick={() => showToast(`已套用模板: ${template.title}`)}
                      className="text-purple-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>套用模板</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
