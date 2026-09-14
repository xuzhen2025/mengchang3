import React from "react";
import { Search } from "lucide-react";
import { useConfigFilter, useResourceConfig } from "../lib/useResourceConfig";

export function ResourceCategoryFilters({ scope, primary, secondary, search, onPrimary, onSecondary, onSearch }: {
  scope: string; primary: string; secondary: string; search: string;
  onPrimary: (value: string) => void; onSecondary: (value: string) => void; onSearch: (value: string) => void;
}) {
  const { store } = useResourceConfig();
  useConfigFilter(scope, "primary", primary, onPrimary);
  useConfigFilter(scope, "secondary", secondary, onSecondary);
  const categories = store.categories(scope);
  const children = [...new Set(categories.filter(n => primary === "全部" || n.name === primary).flatMap(n => n.children.map(c => c.name)))];
  const style = (active: boolean) => `px-2.5 py-1 rounded-md text-xs cursor-pointer ${active ? "text-purple-600 font-bold bg-purple-50" : "text-slate-600 hover:text-purple-600 font-normal"}`;
  return <>
    <div className="flex items-start gap-2 border-t border-slate-100 pt-3" data-testid={`${scope}-primary-filter`}>
      <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2 pt-1">一级分类：</span>
      <div className="flex flex-1 flex-wrap gap-2 items-center">
        {["全部", ...categories.map(n => n.name)].map(name => <button type="button" key={name} onClick={() => { onPrimary(name); onSecondary("全部"); }} className={style(primary === name)}>{name}</button>)}
      </div>
    </div>
    <div className="flex items-center gap-2 border-t border-slate-100 pt-3" data-testid={`${scope}-secondary-filter`}>
      <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">二级分类：</span>
      <div className="flex flex-1 flex-wrap gap-2 items-center">
        <div className="border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 shrink-0 focus-within:border-purple-400">
          <Search className="w-3.5 h-3.5 text-slate-400" /><input aria-label="搜索二级分类" placeholder="搜索分类" value={search} onChange={e => onSearch(e.target.value)} className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal" />
        </div>
        {["全部", ...children.filter(name => name.toLowerCase().includes(search.trim().toLowerCase()))].map(name => <button type="button" key={name} onClick={() => onSecondary(name)} className={style(secondary === name)}>{name}</button>)}
      </div>
    </div>
  </>;
}

export function ResourceStatusFilter({ scope, value, onChange }: { scope: string; value: string; onChange: (value: string) => void }) {
  const { store } = useResourceConfig();
  useConfigFilter(scope, "status", value, onChange);
  if (!store.statusEnabled(scope)) return null;
  return <div className="flex items-center gap-2 border-t border-slate-100 pt-3" data-testid={`${scope}-status-filter`}>
    <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">{scope === "scripts" ? "脚本状态：" : "视频状态："}</span>
    <div className="flex flex-wrap items-center gap-2 flex-1">{["全部", ...store.statuses(scope).map(s => s.name)].map(name => <button key={name} type="button" onClick={() => onChange(name)}
      className={`text-xs px-2.5 py-1 rounded-md cursor-pointer ${value === name ? "font-bold bg-purple-50 text-purple-600" : "text-slate-600 hover:bg-slate-50"}`}>{name}</button>)}</div>
  </div>;
}

export function ResourceStatusBadge({ scope, status, className = "rounded px-2 py-0.5 text-xs font-semibold", children }: {
  scope: string; status?: string; className?: string; children?: React.ReactNode;
}) {
  const { store } = useResourceConfig();
  if (!store.statusEnabled(scope)) return null;
  return <span className={className} style={store.statusStyle(scope, status)}>{children || status || "未设置"}</span>;
}
