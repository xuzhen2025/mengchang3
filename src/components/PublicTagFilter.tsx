import React, { useState, useRef } from "react";
import { Search, ChevronDown, Check, RotateCcw } from "lucide-react";

export interface TagGroupItem {
  id: string;
  name: string;
  subTags: string[];
}

export const DEFAULT_PUBLIC_TAG_GROUPS: TagGroupItem[] = [
  {
    id: "tg-1",
    name: "星图达人",
    subTags: [
      "任意",
      "星图达人",
      "蚊子超会买",
      "向晚晚",
      "西瓜有点甜",
      "娜姐68",
      "小四月麻麻",
      "可乐麻麻",
      "涵涵家居",
      "喵不李",
      "萌宝麻麻",
      "阳光夏的向日葵",
      "芸芸的小店",
      "马小克没毛病",
      "仅予妈妈",
      "恭喜妈妈",
      "好运66",
      "一满牛牛的妈",
      "悠悠妈妈",
      "财圆圆",
      "吴雪青",
      "申若男—77爱吃",
      "郁维一好好妈妈",
      "叶子姐和达子哥",
      "阿谦筱月",
      "汤圆妈妈",
      "小玥麻麻",
      "黄大锤",
      "昭仪娘娘",
      "陈时宜",
      "粥8皮",
      "是你的女朋友",
      "暖小溪麻麻",
      "畅畅畅畅是只猫",
      "秋姐姐",
      "陈湘湘",
      "哈尼honey",
      "大眼津",
      "辣妈kiki",
      "一只大漂亮",
      "锐锐努力版",
      "有财亿的冰冰",
      "小佳小佳钰宝藏屋",
      "小羊（清货版）",
    ],
  },
  {
    id: "tg-2",
    name: "主图比例",
    subTags: ["任意", "1:1主图", "3:4主图", "9:16竖屏", "16:9横屏", "4:3画幅"],
  },
  {
    id: "tg-3",
    name: "脚本类型",
    subTags: [
      "任意",
      "剧情（原创）",
      "剧情（1:1）",
      "实拍卡点",
      "纯混剪",
      "VLOG",
      "超长口播",
      "长剧情",
    ],
  },
  {
    id: "tg-4",
    name: "适用分类",
    subTags: [
      "任意",
      "成片/个护",
      "素材/美妆",
      "家居日用",
      "服装鞋帽",
      "食品饮料",
      "母婴用品",
    ],
  },
  {
    id: "tg-5",
    name: "爆款属性",
    subTags: ["任意", "千川跑量", "信息流", "黑马带货", "高转化", "品牌宣传"],
  },
  {
    id: "tg-6",
    name: "场景模特",
    subTags: [
      "任意",
      "室内棚拍",
      "户外实景",
      "办公室",
      "家庭厨房",
      "外籍模特",
      "素人出镜",
    ],
  },
];

interface PublicTagFilterProps {
  selectedTag?: string; // 当前选中的子标签名称 (例如 "娜姐68" 或 "全部")
  onSelectTag?: (tag: string, groupName?: string) => void;
  tagGroups?: TagGroupItem[];
  showSearchInput?: boolean;
}

export const PublicTagFilter: React.FC<PublicTagFilterProps> = ({
  selectedTag = "全部",
  onSelectTag,
  tagGroups = DEFAULT_PUBLIC_TAG_GROUPS,
  showSearchInput = true,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [popoverSearchKey, setPopoverSearchKey] = useState("");
  const [topSearchKey, setTopSearchKey] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (groupId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (activeGroupId !== groupId) {
      setActiveGroupId(groupId);
      setPopoverSearchKey("");
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveGroupId(null);
      setPopoverSearchKey("");
    }, 200);
  };

  const handleSelectSubTag = (subTag: string, groupName: string) => {
    if (onSelectTag) {
      onSelectTag(subTag, groupName);
    }
    setActiveGroupId(null);
  };

  const handleReset = () => {
    setTopSearchKey("");
    if (onSelectTag) {
      onSelectTag("全部");
    }
  };

  // 过滤包含搜索关键字的标签组
  const filteredGroups = tagGroups.filter((g) => {
    if (!topSearchKey) return true;
    const matchGroup = g.name.toLowerCase().includes(topSearchKey.toLowerCase());
    const matchSub = g.subTags.some((st) =>
      st.toLowerCase().includes(topSearchKey.toLowerCase())
    );
    return matchGroup || matchSub;
  });

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2 relative">
      {/* 搜索框 */}
      {showSearchInput && (
        <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 shrink-0 focus-within:border-purple-400 mr-1 shadow-2xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索标签"
            value={topSearchKey}
            onChange={(e) => setTopSearchKey(e.target.value)}
            className="text-xs focus:outline-hidden w-full placeholder:text-slate-400 font-normal text-slate-700"
          />
        </div>
      )}

      {/* 全部按钮 */}
      <button
        type="button"
        onClick={() => handleReset()}
        className={`transition-all cursor-pointer text-xs px-2.5 py-1 rounded-md font-medium ${
          selectedTag === "全部" || !selectedTag
            ? "text-purple-600 font-bold bg-purple-50 border border-purple-200/80 shadow-2xs"
            : "text-slate-600 hover:text-purple-600 font-normal hover:bg-slate-100/60"
        }`}
      >
        全部
      </button>

      {/* 标签组列表 */}
      {filteredGroups.map((group) => {
        // 判断当前标签组下是否有子标签被选中
        const hasSelectedSubTag =
          selectedTag !== "全部" && group.subTags.includes(selectedTag);

        const isOpen = activeGroupId === group.id;

        // 根据内部搜索筛选子标签
        const filteredSubTags = group.subTags.filter((st) =>
          st.toLowerCase().includes(popoverSearchKey.toLowerCase())
        );

        return (
          <div
            key={group.id}
            className="relative inline-block"
            onMouseEnter={() => handleMouseEnter(group.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 标签组触发按钮 */}
            <button
              type="button"
              onClick={() => {
                if (activeGroupId === group.id) {
                  setActiveGroupId(null);
                } else {
                  setActiveGroupId(group.id);
                  setPopoverSearchKey("");
                }
              }}
              className={`transition-all cursor-pointer text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium ${
                hasSelectedSubTag
                  ? "text-[#7C3AED] font-bold bg-purple-100/80 border border-purple-200 shadow-2xs"
                  : isOpen
                  ? "text-[#7C3AED] bg-purple-50 font-semibold border border-purple-200/60"
                  : "text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50/60 font-normal"
              }`}
            >
              <span>
                {hasSelectedSubTag ? `${group.name}: ${selectedTag}` : group.name}
              </span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 opacity-60 ${
                  isOpen ? "rotate-180 text-[#7C3AED]" : ""
                }`}
              />
            </button>

            {/* Hover 下拉 Popover (对齐截图) */}
            {isOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 z-[130] bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 min-w-[340px] max-w-[460px] text-left animate-in fade-in zoom-in-95 duration-150"
                onMouseEnter={() => handleMouseEnter(group.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* 顶部搜索输入框 (对齐截图1:1) */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="请输入标签名"
                    value={popoverSearchKey}
                    onChange={(e) => setPopoverSearchKey(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs font-normal text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all shadow-2xs"
                  />
                </div>

                {/* 子标签 Grid (对齐截图4列平铺风格) */}
                <div className="grid grid-cols-4 gap-y-2 gap-x-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredSubTags.length > 0 ? (
                    filteredSubTags.map((subTag) => {
                      const isSelected = selectedTag === subTag;
                      return (
                        <button
                          key={subTag}
                          type="button"
                          onClick={() => handleSelectSubTag(subTag, group.name)}
                          className={`text-xs px-1.5 py-1.5 rounded-md text-center truncate cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#7C3AED] text-white font-bold shadow-2xs"
                              : "text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50/80 font-normal"
                          }`}
                          title={subTag}
                        >
                          {subTag}
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-4 py-4 text-center text-xs text-slate-400">
                      未找到相关子标签
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 重置公共标签 */}
      <button
        type="button"
        onClick={handleReset}
        className="text-slate-400 hover:text-[#7C3AED] text-xs ml-2 cursor-pointer font-normal transition-colors shrink-0"
      >
        重置公共标签
      </button>
    </div>
  );
};
