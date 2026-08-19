import React, { useState } from "react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  Home,
  Plus,
  RefreshCw,
  Search,
  Store,
  UsersRound,
  Video,
} from "lucide-react";

const liveTabs = [
  { id: "home", label: "首页", icon: Home },
  { id: "rooms", label: "我的直播间", icon: Video },
  { id: "schedule", label: "主播排班", icon: CalendarDays },
  { id: "host_data", label: "主播数据", icon: BarChart3 },
  { id: "team", label: "团队管理", icon: UsersRound },
  { id: "stores", label: "店铺管理", icon: Store },
  { id: "tools", label: "辅助工具", icon: Bot },
] as const;

export default function LiveManagementView() {
  const [activeTab, setActiveTab] = useState<(typeof liveTabs)[number]["id"]>("home");
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-800 overflow-hidden">
      <div className="pt-4 px-5 pb-1 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {liveTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
          <button className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 shrink-0 px-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>
        </div>
      </div>

      <main className="flex-1 min-h-0 m-5 mt-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-xl font-extrabold text-slate-900">我的直播号</h1>
          <label className="relative block">
            <Search className="absolute w-4 h-4 text-slate-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="搜索直播号名称"
              className="w-64 pl-9 pr-3 py-2.5 text-xs outline-none rounded-lg border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </label>
        </div>

        <button className="mt-6 w-[372px] h-52 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/35 hover:bg-purple-50 hover:border-purple-500 transition-all flex flex-col justify-center items-center gap-3 text-purple-600 cursor-pointer group">
          <span className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-8 h-8" />
          </span>
          <span className="font-extrabold">添加直播号</span>
        </button>
      </main>
    </div>
  );
}
