import React, { useState } from "react";
import { 
  Home, 
  Video, 
  Image as ImageIcon, 
  Layers, 
  FolderHeart, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Film,
  Megaphone,
  RefreshCw,
  Settings,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  Clapperboard,
  ChevronDown,
  Zap,
  ListTodo
} from "lucide-react";
import { ActiveScreen } from "../types";

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  credits: number;
  openCreditsModal: () => void;
}

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  collapsed,
  setCollapsed,
  credits,
  openCreditsModal
}: SidebarProps) {
  const menuItems: { id: string; label: string; icon: any; badge?: string }[] = [
    { id: "home", label: "首页", icon: Home },
    { id: "quick_creation", label: "快速创作", icon: Zap },
    { id: "agent_creation", label: "Agent 创作", icon: Sparkles },
    { id: "video_remake", label: "爆款复刻", icon: RefreshCw },
    { id: "ai_video", label: "AI视频", icon: Video },
    { id: "ai_image", label: "AI图片", icon: ImageIcon },
    { id: "canvas", label: "画布", icon: Layers },
    { id: "task_collaboration", label: "任务协作", icon: ListTodo, badge: "协作" },
    { id: "resources", label: "资源库", icon: FolderHeart },
    { id: "ad_delivery", label: "数据分析", icon: BarChart3 },
    { id: "account_management", label: "系统管理", icon: Settings },
  ];

  return (
    <aside 
      className={`h-screen bg-white text-slate-800 flex flex-col justify-between border-r border-slate-100 shadow-xs transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        {/* LOGO Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-100 overflow-hidden">
          <div className="relative flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Sparkles className="w-4 h-4 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap animate-fade-in">
              <span className="font-extrabold text-base tracking-tight text-slate-900 bg-clip-text">
                梦畅AIGC
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              activeScreen === item.id || 
              (item.id === "resources" && ["resources", "materials", "finished_videos"].includes(activeScreen)) ||
              (item.id === "quick_creation" && [
                "detail_set", "enhance", "watermark", "subtitle", "fission"
              ].includes(activeScreen));

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveScreen(item.id as ActiveScreen);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? "bg-purple-50 text-purple-600 border-l-2 border-purple-500 font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {!collapsed && (
                  <span className="truncate whitespace-nowrap font-bold">{item.label}</span>
                )}

                {item.badge && !collapsed && (
                  <span className="ml-auto bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white scale-90">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-800 shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-2 space-y-2 border-t border-slate-100">
        {/* Credit details button */}
        <button
          onClick={openCreditsModal}
          id="btn-sidebar-credits"
          className={`w-full flex items-center rounded-xl transition-all ${
            collapsed 
              ? "p-2.5 justify-center hover:bg-slate-50 text-amber-500" 
              : "p-3 bg-gradient-to-br from-amber-500/5 to-amber-600/2 hover:from-amber-500/10 border border-amber-500/15 text-amber-700"
          }`}
        >
          <CreditCard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <div className="ml-2 text-left flex-1 min-w-0">
              <p className="text-[10px] text-amber-600 uppercase tracking-widest font-mono">✦ 可用积分 ✦</p>
              <p className="text-sm font-bold text-slate-800 font-mono truncate">{credits.toFixed(2)}</p>
            </div>
          )}
          {collapsed && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-amber-300 text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-amber-500/30 shadow-xl font-mono">
              积分: {credits.toFixed(2)}
            </div>
          )}
        </button>

        {/* User profile */}
        <div 
          onClick={openCreditsModal}
          className={`flex items-center gap-2 rounded-xl cursor-pointer ${
            collapsed ? "p-1 justify-center" : "p-2 hover:bg-slate-50"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-purple-500/30 object-cover"
            referrerPolicy="no-referrer"
          />
          {!collapsed && (
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">AIGC电商至尊</p>
              <p className="text-[10px] text-slate-400 truncate">VIP 高级权益</p>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
