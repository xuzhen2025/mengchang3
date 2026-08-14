import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CircleHelp,
  LayoutDashboard,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Store,
  UsersRound,
  Video,
} from "lucide-react";

type LiveSection = "rooms" | "schedule" | "hosts" | "team" | "stores" | "tools";

const liveSections: { id: LiveSection; label: string; icon: typeof Radio; group: string }[] = [
  { id: "rooms", label: "我的直播间", icon: Video, group: "直播间" },
  { id: "schedule", label: "主播排班", icon: CalendarDays, group: "运营" },
  { id: "hosts", label: "主播数据", icon: BarChart3, group: "运营" },
  { id: "team", label: "团队管理", icon: UsersRound, group: "组织" },
  { id: "stores", label: "店铺管理", icon: Store, group: "组织" },
  { id: "tools", label: "辅助工具", icon: Bot, group: "工具" },
];

const topTabs = [
  { label: "直播概览", section: "rooms" as LiveSection, icon: LayoutDashboard },
  { label: "直播运营", section: "schedule" as LiveSection, icon: Radio },
  { label: "组织与店铺", section: "team" as LiveSection, icon: UsersRound },
  { label: "直播工具", section: "tools" as LiveSection, icon: Bot },
];

export default function LiveManagementView() {
  const [activeSection, setActiveSection] = useState<LiveSection>("rooms");
  const [searchText, setSearchText] = useState("");
  const [refreshTime, setRefreshTime] = useState("刚刚");

  const activeMeta = useMemo(
    () => liveSections.find((item) => item.id === activeSection) ?? liveSections[0],
    [activeSection]
  );

  const selectSection = (section: LiveSection) => {
    setActiveSection(section);
    setSearchText("");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-800 overflow-hidden">
      <div className="pt-4 px-5 pb-1 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {topTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = ["rooms", "schedule", "hosts", "team", "stores", "tools"].includes(activeSection)
                && ((tab.section === "rooms" && activeSection === "rooms")
                  || (tab.section === "schedule" && ["schedule", "hosts"].includes(activeSection))
                  || (tab.section === "team" && ["team", "stores"].includes(activeSection))
                  || tab.section === activeSection);
              return (
                <button
                  key={tab.label}
                  onClick={() => selectSection(tab.section)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white text-[#7C3AED] shadow-2xs border border-purple-200/80 ring-1 ring-purple-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 shrink-0 pr-2">
            <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer">
              <CircleHelp className="w-4 h-4" /> 使用手册
            </button>
            <button
              onClick={() => setRefreshTime("刚刚更新")}
              className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> 刷新
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-5 pb-5 flex gap-4">
        <aside className="w-52 shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3 overflow-y-auto">
          <div className="px-3 pt-2 pb-3">
            <p className="text-[11px] tracking-[0.18em] text-slate-400 font-extrabold uppercase">直播管理</p>
          </div>
          <nav className="space-y-1">
            {liveSections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectSection(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold text-left transition-all cursor-pointer ${
                    isActive ? "bg-purple-50 text-[#7C3AED]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-purple-600 mb-1">{activeMeta.group}</p>
              <h1 className="text-xl font-extrabold text-slate-900">{activeMeta.label}</h1>
              <p className="text-sm text-slate-400 mt-1">统一管理直播账号、排班、运营团队与数据资产</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative block">
                <Search className="absolute w-4 h-4 text-slate-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={activeSection === "rooms" ? "搜索直播号名称" : `搜索${activeMeta.label}`}
                  className="w-64 pl-9 pr-3 py-2.5 text-xs outline-none rounded-lg border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </label>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{refreshTime}</span>
            </div>
          </div>

          <div className="mt-6">
            {activeSection === "rooms" ? (
              <button className="w-[372px] h-52 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/35 hover:bg-purple-50 hover:border-purple-500 transition-all flex flex-col justify-center items-center gap-3 text-purple-600 cursor-pointer group">
                <span className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-8 h-8" />
                </span>
                <span className="font-extrabold">添加直播号</span>
                <span className="text-xs text-purple-500/80">接入抖音、视频号等直播账号</span>
              </button>
            ) : (
              <div className="min-h-72 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <activeMeta.icon className="w-6 h-6" />
                </div>
                <p className="font-extrabold text-slate-700">{activeMeta.label}准备就绪</p>
                <p className="text-sm text-slate-400 mt-2">在这里管理直播业务的相关信息与配置。</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
