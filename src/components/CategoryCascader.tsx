import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Check } from "lucide-react";

export const CATEGORY_HIERARCHY: Record<string, string[]> = {
  "爆款素材": ["服饰内衣", "美妆护肤", "日用百货", "数码家电", "食品饮料"],
  "内衣": ["文胸", "内裤", "保暖", "家居服"],
  "内裤": ["男士内裤", "女士内裤", "无痕内裤"],
  "吊带": ["打底吊带", "蕾丝吊带", "美背吊带"],
  "裤袜": ["丝袜", "打底裤", "光腿神器"],
  "保暖衣": ["德绒保暖", "羊绒保暖", "自发热"],
  "基础：对标翻拍": ["8835内衣", "6017内衣", "8020内衣", "0969内裤"],
  "进阶：二创衍生": ["8022超薄", "保暖系列", "无痕吊带", "功能内衣"],
  "原创": ["MF品牌", "爆款短视频", "直播切片"],
  "品牌宣传": ["品牌TVC", "形象宣传", "文化故事"],
  "电商带货": ["硬广直投", "口播种草", "痛点对比"]
};

interface CategoryCascaderProps {
  primaryCategory: string;
  secondaryCategory: string;
  onSelect: (primary: string, secondary: string) => void;
  placeholder?: string;
  customCategoryMap?: Record<string, string[]>;
}

export default function CategoryCascader({
  primaryCategory,
  secondaryCategory,
  onSelect,
  placeholder = "请选择分类，支持输入文字搜索",
  customCategoryMap
}: CategoryCascaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePrimary, setActivePrimary] = useState(primaryCategory || "爆款素材");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryMap = customCategoryMap || CATEGORY_HIERARCHY;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update active primary if primaryCategory changes externally
  useEffect(() => {
    if (primaryCategory && categoryMap[primaryCategory]) {
      setActivePrimary(primaryCategory);
    }
  }, [primaryCategory, categoryMap]);

  const displayValue = searchQuery
    ? searchQuery
    : primaryCategory && secondaryCategory
    ? `${primaryCategory} / ${secondaryCategory}`
    : primaryCategory
    ? primaryCategory
    : "";

  const primaryKeys = Object.keys(categoryMap).filter((key) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesKey = key.toLowerCase().includes(q);
    const matchesSub = (categoryMap[key] || []).some((sub) => sub.toLowerCase().includes(q));
    return matchesKey || matchesSub;
  });

  const secondaryList = (categoryMap[activePrimary] || []).filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return sub.toLowerCase().includes(q) || activePrimary.toLowerCase().includes(q);
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer transition-all shadow-2xs ${
          isOpen
            ? "border-purple-500 ring-2 ring-purple-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-slate-800 font-medium focus:outline-none placeholder-slate-400"
        />
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-purple-600 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        )}
      </div>

      {/* Cascading Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden grid grid-cols-2 divide-x divide-slate-100 animate-in fade-in duration-100">
          {/* Left Column: 一级分类 */}
          <div className="flex flex-col max-h-64">
            <div className="px-4 py-2 text-[11px] font-bold text-slate-400 bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider shrink-0">
              一级分类
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {primaryKeys.length === 0 ? (
                <div className="px-4 py-6 text-slate-400 text-xs text-center">无匹配分类</div>
              ) : (
                primaryKeys.map((pKey) => {
                  const isSelected = activePrimary === pKey;
                  return (
                    <div
                      key={pKey}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePrimary(pKey);
                      }}
                      className={`px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer select-none transition-colors ${
                        isSelected
                          ? "bg-purple-50/80 text-purple-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <span>{pKey}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-purple-600 stroke-[2.5]" : "text-slate-300"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: 二级分类 */}
          <div className="flex flex-col max-h-64 bg-white">
            <div className="px-4 py-2 text-[11px] font-bold text-slate-400 bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider shrink-0">
              二级分类
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {secondaryList.length === 0 ? (
                <div className="px-4 py-6 text-slate-400 text-xs text-center">无分类选项</div>
              ) : (
                secondaryList.map((sub) => {
                  const isChecked = primaryCategory === activePrimary && secondaryCategory === sub;
                  return (
                    <div
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(activePrimary, sub);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={`px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer select-none transition-colors ${
                        isChecked
                          ? "bg-purple-50/80 text-purple-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <span>{sub}</span>
                      {isChecked && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
