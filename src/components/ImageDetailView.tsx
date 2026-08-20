import React, { useState } from "react";
import {
  ArrowLeft,
  X,
  ZoomIn,
  Edit2,
  Edit3,
  Plus,
  ArrowUpDown,
  Star,
  Share2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Check,
  Film,
  FileText,
  History,
  Box,
  Search
} from "lucide-react";

export interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  badge: string;
  subtitle?: string;
  author?: string;
  primaryCategory: string;
  secondaryCategory: string;
  size: string;
  resolution: string;
  time: string;
  downloads: number;
  tags?: string[];
  isFolder?: boolean;
}

export interface ImageDetailViewProps {
  item: ImageItem;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const CATEGORY_TREE = [
  { name: "资质 / a店铺", subs: ["店铺授权书", "品牌营业执照", "质检合格证", "商标注册证"] },
  { name: "彩妆香水", subs: ["唇膏口红", "香水底妆", "眼影彩盘", "卸妆洁面"] },
  { name: "宠物食品", subs: ["猫粮", "狗粮", "零食罐头", "宠物保健品"] },
  { name: "宠物用品", subs: ["猫砂猫盆", "宠物玩具", "牵引驱虫", "清洁洗护"] },
  { name: "婴童尿裤", subs: ["婴儿纸尿裤", "拉拉裤", "湿巾/纸巾"] },
  { name: "奶粉辅食", subs: ["一段奶粉", "二段奶粉", "三段奶粉", "营养辅食"] },
  { name: "个护美妆", subs: ["美妆", "面部护肤", "身体护理", "洗护发"] },
  { name: "服饰内衣", subs: ["女装", "男装", "内衣家居", "鞋靴箱包"] },
];

export const PUBLIC_TAG_GROUPS: Record<string, string[]> = {
  "模特": ["张三", "里斯", "溜溜", "王五", "娃娃", "事事", "琪琪", "久久", "苏逸飞", "沈知许"],
  "场景": ["测试2", "室内展厅", "户外公园", "直播间", "办公室", "家庭生活", "街拍"],
  "合作达人": ["美妆小达人", "生活测评官", "种草狂魔", "时尚指南"],
  "视觉分类": ["白爆款: 主图", "高清无水印", "精修平铺", "模特穿搭", "细节特写"],
  "编导姓名": ["张编", "王编", "李编", "刘编"]
};

export const PERSONAL_TAG_GROUPS: Record<string, string[]> = {
  "常用精选": ["精选爆款", "首图必选", "高点击率"],
  "团队必用": ["A/B测试", "主推图", "大促备用"]
};

export interface OperationLogItem {
  id: string;
  operator: string;
  actionType: "修改标题" | "修改公共标签" | "修改个人标签" | "修改备注" | "类目变更" | "系统生成" | "修改套图排序";
  timestamp: string;
  beforeValue: string;
  afterValue: string;
}

export default function ImageDetailView({
  item,
  onClose,
  showToast
}: ImageDetailViewProps) {
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      return (JSON.parse(window.localStorage.getItem("cloud_video_personal_favorites_v1") || "[]") as string[]).includes(item.id);
    } catch {
      return false;
    }
  });
  // Lightbox
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [selectedDetailThumbIndex, setSelectedDetailThumbIndex] = useState<number>(0);
  const [activeBottomTab, setActiveBottomTab] = useState<"usage" | "associated" | "logs">("usage");

  // Basic Info Fields & States (Matches FinishedVideoDetailModal pattern)
  const [categoryText, setCategoryText] = useState(
    item.primaryCategory && item.secondaryCategory
      ? `${item.primaryCategory} / ${item.secondaryCategory}`
      : "资质 / a店铺"
  );
  const [showModifyCategoryModal, setShowModifyCategoryModal] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState("资质 / a店铺");
  const [tempCategoryPath, setTempCategoryPath] = useState("");

  const [titleText, setTitleText] = useState(item.title);
  const [showModifyTitleModal, setShowModifyTitleModal] = useState(false);
  const [tempTitleText, setTempTitleText] = useState("");

  // Public Tags Modal States
  const [publicTags, setPublicTags] = useState<string[]>(["场景：测试2", "白爆款: 主图", "高清无水印"]);
  const [showPublicTagModal, setShowPublicTagModal] = useState(false);
  const [publicGroupSearch, setPublicGroupSearch] = useState("");
  const [publicSubSearch, setPublicSubSearch] = useState("");
  const [selectedPublicGroupKey, setSelectedPublicGroupKey] = useState("场景");
  const [tempAddedPublicTags, setTempAddedPublicTags] = useState<string[]>([]);
  const [publicPresetTab, setPublicPresetTab] = useState<"我的预设" | "分享给我">("我的预设");

  // Personal Tags Modal States
  const [personalTags, setPersonalTags] = useState<string[]>(["常用精选", "团队必用"]);
  const [showPersonalTagModal, setShowPersonalTagModal] = useState(false);
  const [personalGroupSearch, setPersonalGroupSearch] = useState("");
  const [personalSubSearch, setPersonalSubSearch] = useState("");
  const [selectedPersonalGroupKey, setSelectedPersonalGroupKey] = useState("常用精选");
  const [tempAddedPersonalTags, setTempAddedPersonalTags] = useState<string[]>([]);

  // Note State
  const [noteText, setNoteText] = useState("已完成电商首图审核与裁剪，高清无瑕疵，建议优先推广。");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNoteText, setTempNoteText] = useState(noteText);

  // More Menu
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Operation Logs
  const [logs, setLogs] = useState<OperationLogItem[]>([
    {
      id: "log_1",
      operator: "致上运营 (管理员)",
      actionType: "修改备注",
      timestamp: "2026-08-02 14:20:10",
      beforeValue: "暂无",
      afterValue: "已完成电商首图审核与裁剪，高清无瑕疵，建议优先推广。"
    },
    {
      id: "log_2",
      operator: "李四 (运营)",
      actionType: "修改公共标签",
      timestamp: "2026-07-28 10:15:33",
      beforeValue: "无",
      afterValue: "场景：测试2, 白爆款: 主图, 高清无水印"
    },
    {
      id: "log_3",
      operator: "系统生成",
      actionType: "系统生成",
      timestamp: "2025-05-26 12:25:11",
      beforeValue: "无",
      afterValue: "成功解析图片资源包，建立高清原图与多尺寸智能缩略图"
    }
  ]);
  const [logFilterType, setLogFilterType] = useState<string>("all");

  const addOperationLog = (
    actionType: OperationLogItem["actionType"],
    beforeValue: string,
    afterValue: string
  ) => {
    const newLog: OperationLogItem = {
      id: `log_${Date.now()}`,
      operator: "致上运营 (当前用户)",
      actionType,
      timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
      beforeValue: beforeValue || "无",
      afterValue: afterValue || "无"
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Suite Images / Thumbnails state
  const [suiteImages, setSuiteImages] = useState([
    { id: "img-sub-1", url: item.imageUrl, name: "微信图片_202303251645513.jpg" },
    { id: "img-sub-2", url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80", name: "微信图片_202303251645512.jpg" }
  ]);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempSortList, setTempSortList] = useState<{ id: string; url: string; name: string }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const currentImageUrl = suiteImages[selectedDetailThumbIndex]?.url || item.imageUrl;

  const handleSaveNote = () => {
    if (tempNoteText.trim() !== noteText) {
      addOperationLog("修改备注", noteText || "无", tempNoteText.trim() || "无");
      setNoteText(tempNoteText.trim());
      showToast("✅ 备注信息更新成功！");
    }
    setIsEditingNote(false);
  };

  const filteredLogs = logFilterType === "all" ? logs : logs.filter((l) => l.actionType === logFilterType);

  return (
    <div className="bg-slate-50/60 flex-1 min-h-0 h-full overflow-y-auto text-slate-800 space-y-6 pb-12 animate-fade-in font-sans">
      {/* 1. Top Page Header with Back Button & ID */}
      <div className="px-6 py-4 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200/90 shadow-2xs sticky top-0 z-20">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 border border-slate-200 hover:border-purple-300 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          title="返回图片列表"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          <span>返回图片列表</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            ID: {item.id === "img-1" ? "42029245" : item.id}
          </span>
        </div>
      </div>

      {/* 2. Main Page Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Main Card: Image Preview + Metadata Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (6 Cols): Big Image Preview + Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            {/* Big Image Box */}
            <div
              onClick={() => setFullScreenImage(currentImageUrl)}
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 group cursor-zoom-in shadow-xs transition-all hover:border-purple-300"
              title="点击查看大图"
            >
              <img
                src={currentImageUrl}
                alt={titleText}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              {/* Zoom Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-black/75 backdrop-blur-md text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ZoomIn className="w-4 h-4 text-purple-300" />
                  <span>点击查看大图</span>
                </div>
              </div>
            </div>

            {/* Thumbnails Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {suiteImages.map((t, idx) => (
                <div
                  key={t.id || idx}
                  onClick={() => setSelectedDetailThumbIndex(idx)}
                  className={`relative w-24 h-20 rounded-xl overflow-hidden cursor-pointer transition-all border-2 shrink-0 ${
                    selectedDetailThumbIndex === idx
                      ? "border-purple-600 ring-2 ring-purple-500/20 shadow-xs"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={t.url} alt={`缩略图${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-purple-900/70 text-white text-[9px] px-1 py-0.5 truncate text-center backdrop-blur-2xs">
                    {t.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (6 Cols): Detailed Metadata & Actions */}
          <div className="lg:col-span-6 space-y-4 text-xs text-slate-700">
            
            {/* 1. Author & Organization Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  Z
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.author || "致上运营"} / 默认分组 / 默认团队
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">发布时间：2025-05-26 12:25:11</p>
                </div>
              </div>
            </div>

            {/* 2. Classification & Title */}
            <div className="space-y-3">
              
              {/* Category Hierarchy Edit (层级修改) */}
              <div className="flex items-center gap-2">
                <span className="bg-[#10B981] text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-2xs shrink-0">
                  图片
                </span>
                <span className="font-bold text-slate-800">{categoryText}</span>
                <button
                  onClick={() => {
                    setTempCategoryPath(categoryText);
                    setSelectedPrimaryCat(categoryText.split(" / ")[0] || "资质 / a店铺");
                    setIsCategoryDropdownOpen(true);
                    setShowModifyCategoryModal(true);
                  }}
                  className="text-slate-400 hover:text-purple-600 transition-colors p-0.5 flex items-center gap-1 text-xs font-normal cursor-pointer"
                  title="修改分类"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-purple-600 font-medium hover:underline">修改</span>
                </button>
              </div>

              {/* Title Edit (标题修改) */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium shrink-0">图片标题:</span>
                <span className="font-bold text-slate-900 text-sm">{titleText}</span>
                <button
                  onClick={() => {
                    setTempTitleText(titleText);
                    setShowModifyTitleModal(true);
                  }}
                  className="text-slate-400 hover:text-purple-600 transition-colors p-0.5 cursor-pointer"
                  title="修改标题"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Public Tags (公共标签) */}
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-slate-500 font-medium shrink-0 pt-0.5">公共标签:</span>
                {publicTags.map((tag, i) => (
                  <span key={i} className="bg-slate-100/90 text-slate-700 font-medium px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/60 flex items-center">
                    {tag}
                  </span>
                ))}
                <button
                  onClick={() => {
                    setTempAddedPublicTags([...publicTags]);
                    setShowPublicTagModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-bold text-xs flex items-center gap-0.5 cursor-pointer py-0.5 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加公共标签</span>
                </button>
              </div>

              {/* Personal Tags (个人标签) */}
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-slate-500 font-medium shrink-0 pt-0.5">个人标签:</span>
                {personalTags.map((tag, i) => (
                  <span key={i} className="bg-purple-50 text-purple-700 font-medium px-2.5 py-0.5 rounded-lg text-[11px] border border-purple-100 flex items-center gap-1">
                    <span>{tag}</span>
                    <button
                      onClick={() => {
                        const newP = personalTags.filter((_, idx) => idx !== i);
                        addOperationLog("修改个人标签", personalTags.join(", "), newP.join(", ") || "无");
                        setPersonalTags(newP);
                      }}
                      className="text-purple-400 hover:text-rose-500 ml-0.5 cursor-pointer text-xs"
                      title="删除标签"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setTempAddedPersonalTags([...personalTags]);
                    setShowPersonalTagModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-bold text-xs flex items-center gap-0.5 cursor-pointer py-0.5 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加个人标签</span>
                </button>
              </div>
            </div>

            {/* 3. Icon Action Buttons & Record Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                onClick={() => {
                  setTempSortList([...suiteImages]);
                  setShowSortModal(true);
                }}
                className="p-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-600 cursor-pointer transition-colors"
                title="图片排序 (拖拽进行排序)"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  let ids: string[] = [];
                  try { ids = JSON.parse(window.localStorage.getItem("cloud_video_personal_favorites_v1") || "[]") as string[]; } catch { ids = []; }
                  const next = isFavorite ? ids.filter((id) => id !== item.id) : Array.from(new Set([...ids, item.id]));
                  window.localStorage.setItem("cloud_video_personal_favorites_v1", JSON.stringify(next));
                  setIsFavorite(!isFavorite);
                  showToast(isFavorite ? "已取消收藏" : "已收藏，可在个人中心查看");
                }}
                className={`p-2 rounded-xl border cursor-pointer transition-colors ${isFavorite ? "border-amber-300 bg-amber-50 text-amber-600" : "border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-600"}`}
                title={isFavorite ? "取消收藏" : "收藏"}
              >
                <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
              </button>

              <button
                onClick={async () => {
                  await navigator.clipboard?.writeText(`${window.location.origin}/#/resources/${item.id}`);
                  showToast("详情链接已复制，访问时将按查看者登录状态与资源权限显示");
                }}
                className="p-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-600 cursor-pointer transition-colors"
                title="分享"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveBottomTab("usage");
                  showToast("已切换至【使用记录】列表");
                }}
                className={`px-4 py-1.5 rounded-xl border font-bold text-xs cursor-pointer transition-colors ml-1 ${
                  activeBottomTab === "usage"
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "border-purple-400 text-purple-600 hover:bg-purple-50"
                }`}
              >
                使用记录
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="px-3.5 py-1.5 rounded-xl border border-purple-400 text-purple-600 hover:bg-purple-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>更多</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-1.5 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-40 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        showToast("已重新生成智能色彩标签");
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-xl text-slate-700 font-medium"
                    >
                      重新智能分类
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        showToast("已下架该图片资源");
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-xl font-medium"
                    >
                      下架图片
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Primary Solid Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              <button
                onClick={() => showToast(`正在下载无水印原图: ${titleText}`)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-center shadow-xs cursor-pointer transition-colors text-xs active:scale-95"
              >
                下载无水印图片
              </button>
              <button
                onClick={() => showToast(`已将图片【${titleText}】发送至剪映`)}
                className="hidden bg-[#7C3AED] hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-center shadow-xs cursor-pointer transition-colors text-xs active:scale-95"
              >
                复制到剪映
              </button>
            </div>

            {/* 5. Metrics & Access Permissions Box */}
            <div className="bg-slate-50/80 rounded-2xl p-4 space-y-2 text-xs text-slate-500 border border-slate-100/80 mt-2">
              <div className="flex items-center justify-between">
                <span>下载次数: <strong className="text-slate-700">0</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span>浏览量: <strong className="text-slate-700">0</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>仅供内部员工学习，不可用于商业用途</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>所有人可见</span>
              </div>

              <div className="flex items-start justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 shrink-0 pt-0.5">可查看时间:</span>
                <div className="text-right space-y-1 text-slate-600 font-medium">
                  <div>小组成员 / 不限</div>
                  <div>团队成员 / 不限</div>
                  <div>其他团队 / 2025-06-25 12:25:11</div>
                </div>
              </div>

              <div className="flex items-start justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 shrink-0 pt-0.5">可下载时间:</span>
                <div className="text-right space-y-1 text-slate-600 font-medium">
                  <div>小组成员 / 不限</div>
                  <div>团队成员 / 不限</div>
                  <div>其他团队 / 2025-06-02 12:25:11</div>
                </div>
              </div>

              {/* Editable Note */}
              <div className="pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">备注:</span>
                  <button
                    onClick={() => {
                      setTempNoteText(noteText);
                      setIsEditingNote(!isEditingNote);
                    }}
                    className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isEditingNote ? (
                  <div className="space-y-2 mt-1.5">
                    <textarea
                      value={tempNoteText}
                      onChange={(e) => setTempNoteText(e.target.value)}
                      className="w-full border border-purple-300 rounded-xl p-2 text-xs text-slate-800 focus:outline-none bg-white min-h-[60px]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingNote(false)}
                        className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-lg text-xs"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg text-xs shadow-xs"
                      >
                        保存备注
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 font-medium mt-1 pl-1 italic bg-white/60 p-2 rounded-xl border border-slate-100">
                    {noteText || "暂无备注"}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>


      </div>

      {/* Full-Screen Image Lightbox */}
      {fullScreenImage && (
        <div
          onClick={() => setFullScreenImage(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in cursor-zoom-out"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
            className="absolute top-6 right-6 z-[110] bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition-colors cursor-pointer"
            title="关闭大图"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center space-y-3"
          >
            <img
              src={fullScreenImage}
              alt="全屏大图"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <div className="flex items-center gap-3 text-white/80 text-xs font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <ZoomIn className="w-4 h-4 text-purple-400" />
              <span>点击任意位置或右上角退出大图</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: 修改分类 Modal (Matching FinishedVideoDetailModal) */}
      {showModifyCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改分类</h3>
              </div>
              <button
                onClick={() => {
                  setShowModifyCategoryModal(false);
                  setIsCategoryDropdownOpen(false);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 min-h-[320px] pb-32">
              <div className="flex items-start gap-4 pt-2">
                <label className="text-xs font-bold text-slate-700 shrink-0 pt-2.5 flex items-center">
                  <span className="text-rose-500 font-bold mr-1">*</span>
                  <span>分类</span>
                </label>

                <div className="relative flex-1">
                  {/* Cascading Select Trigger Input */}
                  <div
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium cursor-pointer flex items-center justify-between transition-all shadow-2xs ${
                      isCategoryDropdownOpen
                        ? "border-purple-500 ring-2 ring-purple-100 shadow-xs"
                        : "border-purple-300 hover:border-purple-400"
                    }`}
                  >
                    <span className={tempCategoryPath ? "text-slate-800 font-bold" : "text-slate-400"}>
                      {tempCategoryPath || "请选择分类"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180 text-purple-600" : ""}`} />
                  </div>

                  {/* Cascading Options Dropdown */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-[360px] flex divide-x divide-slate-100 overflow-hidden text-xs animate-in fade-in duration-100">
                      {/* Primary Categories Column */}
                      <div className="w-1/2 py-1 max-h-64 overflow-y-auto space-y-0.5">
                        {CATEGORY_TREE.map((cat) => (
                          <div
                            key={cat.name}
                            onMouseEnter={() => setSelectedPrimaryCat(cat.name)}
                            onClick={() => {
                              setSelectedPrimaryCat(cat.name);
                              if (!cat.subs || cat.subs.length === 0) {
                                setTempCategoryPath(cat.name);
                                addOperationLog("类目变更", categoryText, cat.name);
                                setCategoryText(cat.name);
                                setIsCategoryDropdownOpen(false);
                                setShowModifyCategoryModal(false);
                                showToast(`✅ 已分类修改为：${cat.name}`);
                              }
                            }}
                            className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                              selectedPrimaryCat === cat.name
                                ? "bg-purple-50 text-purple-700 font-bold"
                                : "hover:bg-slate-50 text-slate-700 font-medium"
                            }`}
                          >
                            <span>{cat.name}</span>
                            <ChevronRight className={`w-3.5 h-3.5 ${selectedPrimaryCat === cat.name ? "text-purple-600" : "text-slate-300"}`} />
                          </div>
                        ))}
                      </div>

                      {/* Secondary Categories / Subcategories Column */}
                      <div className="w-1/2 py-1 max-h-64 overflow-y-auto space-y-0.5 bg-white">
                        {(CATEGORY_TREE.find(c => c.name === selectedPrimaryCat)?.subs || []).map((sub) => (
                          <div
                            key={sub}
                            onClick={() => {
                              const selectedVal = `${selectedPrimaryCat} / ${sub}`;
                              setTempCategoryPath(selectedVal);
                              addOperationLog("类目变更", categoryText, selectedVal);
                              setCategoryText(selectedVal);
                              setIsCategoryDropdownOpen(false);
                              setShowModifyCategoryModal(false);
                              showToast(`✅ 已成功修改图片分类为：${selectedVal}`);
                            }}
                            className="px-3.5 py-2.5 hover:bg-purple-50 hover:text-purple-700 text-slate-700 cursor-pointer font-medium transition-colors"
                          >
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowModifyCategoryModal(false);
                  setIsCategoryDropdownOpen(false);
                }}
                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempCategoryPath && tempCategoryPath !== categoryText) {
                    addOperationLog("类目变更", categoryText, tempCategoryPath);
                    setCategoryText(tempCategoryPath);
                    showToast(`✅ 已成功保存分类为：${tempCategoryPath}`);
                  }
                  setShowModifyCategoryModal(false);
                  setIsCategoryDropdownOpen(false);
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 编辑标题 Modal (Matching FinishedVideoDetailModal) */}
      {showModifyTitleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改标题</h3>
              </div>
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700 shrink-0 flex items-center">
                  <span className="text-rose-500 font-bold mr-1">*</span>
                  <span>图片标题</span>
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tempTitleText}
                    onChange={(e) => setTempTitleText(e.target.value)}
                    placeholder="请输入新的图片标题"
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs pr-8"
                  />
                  {tempTitleText && (
                    <button
                      onClick={() => setTempTitleText("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempTitleText.trim() && tempTitleText.trim() !== titleText) {
                    addOperationLog("修改标题", titleText, tempTitleText.trim());
                    setTitleText(tempTitleText.trim());
                    showToast(`✅ 图片标题已修改为：[${tempTitleText.trim()}]`);
                  }
                  setShowModifyTitleModal(false);
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 关联公共标签 Modal (Matching FinishedVideoDetailModal 3-column layout) */}
      {showPublicTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">关联公共标签</h3>
              </div>
              <button
                onClick={() => setShowPublicTagModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3.5 h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>标签组</span>
                    <button
                      onClick={() => showToast("已刷新标签组")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      刷新
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      value={publicGroupSearch}
                      onChange={(e) => setPublicGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(PUBLIC_TAG_GROUPS)
                        .filter(g => g.includes(publicGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPublicGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPublicGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>子标签</span>
                    <button
                      onClick={() => showToast("弹出添加子标签弹窗")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      + 添加子标签
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      value={publicSubSearch}
                      onChange={(e) => setPublicSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(PUBLIC_TAG_GROUPS[selectedPublicGroupKey] || [])
                        .filter(sub => sub.includes(publicSubSearch.trim()))
                        .map((subTag) => {
                          const fullTagName = `${selectedPublicGroupKey}: ${subTag}`;
                          const isChecked = tempAddedPublicTags.includes(fullTagName) || tempAddedPublicTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== fullTagName && t !== subTag));
                                  } else {
                                    setTempAddedPublicTags([...tempAddedPublicTags, fullTagName]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>已添加标签</span>
                    <button
                      onClick={() => showToast("已保存当前选择为预设")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      保存为预设
                    </button>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPublicTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未添加标签
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {tempAddedPublicTags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-slate-50 border border-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium hover:bg-slate-100/80 transition-colors"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== tag))}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPublicTagModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const oldTagsStr = publicTags.join(", ") || "无";
                  const newTagsStr = tempAddedPublicTags.join(", ") || "无";
                  if (oldTagsStr !== newTagsStr) {
                    addOperationLog("修改公共标签", oldTagsStr, newTagsStr);
                  }
                  setPublicTags([...tempAddedPublicTags]);
                  showToast("✅ 已同步公共标签设置");
                  setShowPublicTagModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 关联个人标签 Modal (Matching FinishedVideoDetailModal 3-column layout) */}
      {showPersonalTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">关联个人标签</h3>
              </div>
              <button
                onClick={() => setShowPersonalTagModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    <span>标签组</span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="搜索标签组"
                      value={personalGroupSearch}
                      onChange={(e) => setPersonalGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(PERSONAL_TAG_GROUPS)
                        .filter(g => g.includes(personalGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPersonalGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPersonalGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    <span>子标签</span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="搜索标签名称"
                      value={personalSubSearch}
                      onChange={(e) => setPersonalSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(PERSONAL_TAG_GROUPS[selectedPersonalGroupKey] || [])
                        .filter(sub => sub.includes(personalSubSearch.trim()))
                        .map((subTag) => {
                          const isChecked = tempAddedPersonalTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== subTag));
                                  } else {
                                    setTempAddedPersonalTags([...tempAddedPersonalTags, subTag]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加个人标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    <span>已选择标签 ({tempAddedPersonalTags.length})</span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPersonalTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未选择个人标签
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {tempAddedPersonalTags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-purple-50 border border-purple-100 text-purple-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== tag))}
                              className="text-purple-400 hover:text-rose-500 cursor-pointer ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPersonalTagModal(false)}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const oldTagsStr = personalTags.join(", ") || "无";
                  const newTagsStr = tempAddedPersonalTags.join(", ") || "无";
                  if (oldTagsStr !== newTagsStr) {
                    addOperationLog("修改个人标签", oldTagsStr, newTagsStr);
                  }
                  setPersonalTags([...tempAddedPersonalTags]);
                  showToast("✅ 已保存个人标签");
                  setShowPersonalTagModal(false);
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 图片排序 Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4.5 bg-[#7C3AED] rounded-full inline-block"></span>
                <span className="font-bold text-slate-900 text-base">图片排序</span>
                <span className="text-slate-500 text-xs sm:text-sm font-normal">
                  (拖拽图片进行排序，保存后生效)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSortModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto bg-slate-50/30">
              {tempSortList.map((imgItem, idx) => (
                <div
                  key={imgItem.id || idx}
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === idx) return;
                    const newList = [...tempSortList];
                    const [dragged] = newList.splice(draggedIndex, 1);
                    newList.splice(idx, 0, dragged);
                    setTempSortList(newList);
                    setDraggedIndex(null);
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-4 bg-white transition-all cursor-grab active:cursor-grabbing hover:shadow-2xs select-none ${
                    draggedIndex === idx
                      ? "opacity-30 border-purple-400 bg-purple-50/20"
                      : "border-slate-200/90 hover:border-purple-300"
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={imgItem.url}
                      alt={imgItem.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  <span className="font-medium text-slate-800 text-sm flex-1 truncate">
                    {imgItem.name}
                  </span>

                  {/* Up / Down buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const newList = [...tempSortList];
                        const prev = newList[idx - 1];
                        newList[idx - 1] = newList[idx];
                        newList[idx] = prev;
                        setTempSortList(newList);
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-purple-600 rounded disabled:opacity-20 cursor-pointer"
                      title="向上移动"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tempSortList.length - 1}
                      onClick={() => {
                        if (idx === tempSortList.length - 1) return;
                        const newList = [...tempSortList];
                        const next = newList[idx + 1];
                        newList[idx + 1] = newList[idx];
                        newList[idx] = next;
                        setTempSortList(newList);
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-purple-600 rounded disabled:opacity-20 cursor-pointer"
                      title="向下移动"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSortModal(false)}
                className="px-7 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuiteImages(tempSortList);
                  setSelectedDetailThumbIndex(0);
                  addOperationLog("修改套图排序", "原排序", "新排序");
                  showToast("✅ 图片排序已保存！");
                  setShowSortModal(false);
                }}
                className="px-7 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
