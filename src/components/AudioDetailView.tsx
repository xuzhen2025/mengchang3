import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  User,
  Share2,
  ChevronDown,
  Edit3,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

export interface AudioItem {
  id: string;
  title: string;
  duration: number; // in seconds
  durationFormatted: string;
  author: string;
  primaryCategory: string;
  secondaryCategory: string;
  publicTags: string[];
  personalTag: string;
  starred?: boolean;
}

export interface AudioDetailViewProps {
  item: AudioItem;
  onClose: () => void;
  showToast: (msg: string) => void;
  onDelete?: (id: string) => void;
}

export const CATEGORY_TREE = [
  { name: "美容美体", subs: ["短对话", "口播解说", "混剪卡点", "软文种草"] },
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
  "创新点": ["爽点拆解", "痛点直击", "开门见山", "对比效果"]
};

export default function AudioDetailView({
  item,
  onClose,
  showToast,
  onDelete
}: AudioDetailViewProps) {
  // Audio Editable Fields State
  const [audioCategoryText, setAudioCategoryText] = useState<string>(
    `${item.primaryCategory || "美容美体"} / ${item.secondaryCategory || "短对话"}`
  );
  const [audioTitleText, setAudioTitleText] = useState<string>(item.title || "洗牙4.7");
  const [audioPublicTags, setAudioPublicTags] = useState<string[]>(
    item.publicTags && item.publicTags.length > 0 ? item.publicTags : ["场景: 模特"]
  );
  const [audioPersonalTags, setAudioPersonalTags] = useState<string[]>(
    item.personalTag && item.personalTag !== "无个人标签" ? [item.personalTag] : ["Zs测试一"]
  );

  // Player State
  const [detailCurrentTime, setDetailCurrentTime] = useState<number>(0);
  const [detailIsPlaying, setDetailIsPlaying] = useState<boolean>(false);
  const [detailSpeed, setDetailSpeed] = useState<string>("1x倍速");
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [detailIsMuted, setDetailIsMuted] = useState<boolean>(false);

  // Detail Menu & Modals State
  const [showDetailMoreMenu, setShowDetailMoreMenu] = useState<boolean>(false);
  const [showModifyCategoryModal, setShowModifyCategoryModal] = useState<boolean>(false);
  const [showModifyTitleModal, setShowModifyTitleModal] = useState<boolean>(false);
  const [showPublicTagModal, setShowPublicTagModal] = useState<boolean>(false);
  const [showPersonalTagModal, setShowPersonalTagModal] = useState<boolean>(false);

  // Temp State for Modals
  const [tempCategoryPath, setTempCategoryPath] = useState<string>("");
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string>("美容美体");
  const [selectedSecondaryCat, setSelectedSecondaryCat] = useState<string>("短对话");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [tempTitleText, setTempTitleText] = useState<string>("");

  const [selectedPublicGroupKey, setSelectedPublicGroupKey] = useState<string>("场景");
  const [tempAddedPublicTags, setTempAddedPublicTags] = useState<string[]>([]);

  const [selectedPersonalGroupKey, setSelectedPersonalGroupKey] = useState<string>("个人设的");
  const [tempAddedPersonalTags, setTempAddedPersonalTags] = useState<string[]>([]);

  const [publicPresetTab, setPublicPresetTab] = useState<string>("我的预设");
  const [personalPresetTab, setPersonalPresetTab] = useState<string>("我的预设");

  // Timer loop for playback
  useEffect(() => {
    if (!detailIsPlaying) return;

    const interval = setInterval(() => {
      setDetailCurrentTime((prev) => {
        if (prev >= item.duration) {
          setDetailIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [detailIsPlaying, item.duration]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen text-slate-800 space-y-6 pb-16 animate-fade-in font-sans overflow-y-auto">
      {/* 1. Top Page Sticky Header with Back Button & ID */}
      <div className="px-6 py-4 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200/90 shadow-2xs sticky top-0 z-20">
        <button
          onClick={() => {
            setDetailIsPlaying(false);
            onClose();
          }}
          className="px-4 py-2 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 border border-slate-200 hover:border-purple-300 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          title="返回音频列表"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          <span>返回音频列表</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            ID: {item.id === "1" ? "37923662" : item.id}
          </span>
        </div>
      </div>

      {/* 2. Main Page Content Container */}
      <div className="max-w-5xl mx-auto px-6 space-y-4">
        
        {/* Card 1: Top Main Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          {/* Row 1: Author Info & Action Buttons */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Left: Avatar & Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {item.author || "月儿弯弯"} / 管理组 / 管理部
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  发布时间: 2025-04-24 14:43:53
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => showToast(`已开始下载: ${item.title}.mp3`)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                下载
              </button>

              <button
                onClick={() => showToast("已复制在线分享链接")}
                className="w-9 h-9 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="分享"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* 更多操作 Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDetailMoreMenu(!showDetailMoreMenu)}
                  className="border border-purple-300 text-purple-600 hover:bg-purple-50 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>更多操作</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showDetailMoreMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        setShowDetailMoreMenu(false);
                        showToast("已推送至剪映工作台");
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700 cursor-pointer"
                    >
                      推送至团队剪辑
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailMoreMenu(false);
                        setShowModifyCategoryModal(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700 cursor-pointer"
                    >
                      修改所属分类
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailMoreMenu(false);
                        showToast("已发送提醒通知");
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-slate-700 cursor-pointer"
                    >
                      发送消息提醒
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setShowDetailMoreMenu(false);
                        if (onDelete) onDelete(item.id);
                        showToast("已放入回收站");
                        onClose();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer"
                    >
                      放入回收站
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="space-y-3.5">
            {/* Row 2: 音频区 / 分类 */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-slate-500 font-medium shrink-0">音频区</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{audioCategoryText}</span>
                  <button
                    onClick={() => {
                      setTempCategoryPath(audioCategoryText);
                      setSelectedPrimaryCat(audioCategoryText.split(" / ")[0] || "美容美体");
                      setIsCategoryDropdownOpen(true);
                      setShowModifyCategoryModal(true);
                    }}
                    className="text-slate-400 hover:text-purple-600 cursor-pointer transition-colors p-0.5 flex items-center gap-1 text-xs font-normal"
                    title="修改分类"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-purple-600 font-medium hover:underline">修改</span>
                  </button>
                </span>
              </div>
            </div>

            {/* Row 3: 音频标题 */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-20 text-slate-500 font-medium shrink-0">音频标题</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{audioTitleText}</span>
                  <button
                    onClick={() => {
                      setTempTitleText(audioTitleText);
                      setShowModifyTitleModal(true);
                    }}
                    className="text-slate-400 hover:text-purple-600 cursor-pointer transition-colors p-0.5"
                    title="修改标题"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            </div>

            {/* Row 4: 公共标签 Line */}
            <div className="flex items-start gap-3 text-xs">
              <span className="w-20 text-slate-500 font-medium shrink-0 pt-1">公共标签</span>
              <div className="flex flex-wrap items-center gap-2">
                {audioPublicTags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200/60 flex items-center">
                    <span>{tag}</span>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setTempAddedPublicTags([...audioPublicTags]);
                    setShowPublicTagModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-bold text-xs flex items-center gap-1 cursor-pointer py-1 hover:underline"
                >
                  <span>+ 添加公共标签</span>
                </button>
              </div>
            </div>

            {/* Row 5: 个人标签 Line */}
            <div className="flex items-start gap-3 text-xs">
              <span className="w-20 text-slate-500 font-medium shrink-0 pt-1">个人标签</span>
              <div className="flex flex-wrap items-center gap-2">
                {audioPersonalTags.map((tag, idx) => (
                  <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-purple-100 flex items-center gap-1">
                    <span>{tag}</span>
                    <button
                      onClick={() => setAudioPersonalTags(audioPersonalTags.filter((_, i) => i !== idx))}
                      className="text-purple-400 hover:text-rose-500 ml-0.5 cursor-pointer text-xs"
                      title="删除标签"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setTempAddedPersonalTags([...audioPersonalTags]);
                    setShowPersonalTagModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-bold text-xs flex items-center gap-1 cursor-pointer py-1 hover:underline"
                >
                  <span>+ 添加个人标签</span>
                </button>
              </div>
            </div>

            {/* Row 6: 音频说明 */}
            <div className="text-xs pt-1">
              <span className="text-slate-400 font-medium">音频说明</span>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Audio Player Control Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">
            {audioTitleText}
          </h3>

          {/* Player Bar */}
          <div className="flex items-center gap-4">
            {/* Play / Pause button */}
            <button
              onClick={() => setDetailIsPlaying(!detailIsPlaying)}
              className={`w-10 h-10 rounded-full border-2 border-purple-600 flex items-center justify-center text-purple-600 hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-xs ${
                detailIsPlaying ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
              }`}
            >
              {detailIsPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Current Time */}
            <span className="text-xs font-mono font-medium text-slate-600 shrink-0 min-w-[38px]">
              {formatSeconds(detailCurrentTime)}
            </span>

            {/* Scrubber Range Input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min={0}
                max={item.duration}
                value={detailCurrentTime}
                onChange={(e) => setDetailCurrentTime(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus:outline-none"
              />
            </div>

            {/* Total Duration */}
            <span className="text-xs font-mono font-medium text-slate-600 shrink-0 min-w-[38px]">
              {item.durationFormatted}
            </span>

            {/* Mute Button */}
            <button
              onClick={() => setDetailIsMuted(!detailIsMuted)}
              className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
              title={detailIsMuted ? "取消静音" : "静音"}
            >
              {detailIsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Playback Speed Button */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {detailSpeed}
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-28 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs font-medium">
                  {["0.5x倍速", "0.75x倍速", "1x倍速", "1.25x倍速", "1.5x倍速", "2x倍速"].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setDetailSpeed(speed);
                        setShowSpeedMenu(false);
                        showToast(`倍速设置为: ${speed}`);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-purple-50 cursor-pointer ${
                        detailSpeed === speed ? "text-purple-600 font-bold bg-purple-50/50" : "text-slate-700"
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL 1: 修改分类 Modal */}
      {showModifyCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改分类</h3>
              </div>
              <button
                onClick={() => setShowModifyCategoryModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">当前选择路径</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  {tempCategoryPath || audioCategoryText}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">选择分类层级</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedPrimaryCat}
                    onChange={(e) => {
                      const catName = e.target.value;
                      setSelectedPrimaryCat(catName);
                      const group = CATEGORY_TREE.find((g) => g.name === catName);
                      const firstSub = group?.subs[0] || "";
                      setSelectedSecondaryCat(firstSub);
                      setTempCategoryPath(`${catName} / ${firstSub}`);
                    }}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                  >
                    {CATEGORY_TREE.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSecondaryCat}
                    onChange={(e) => {
                      setSelectedSecondaryCat(e.target.value);
                      setTempCategoryPath(`${selectedPrimaryCat} / ${e.target.value}`);
                    }}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                  >
                    {(CATEGORY_TREE.find((c) => c.name === selectedPrimaryCat)?.subs || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowModifyCategoryModal(false)}
                className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempCategoryPath) {
                    setAudioCategoryText(tempCategoryPath);
                    showToast(`✅ 分类已更新为：[${tempCategoryPath}]`);
                  }
                  setShowModifyCategoryModal(false);
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 修改标题 Modal */}
      {showModifyTitleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">修改音频标题</h3>
              </div>
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <label className="block font-bold text-slate-700">音频标题</label>
              <input
                type="text"
                value={tempTitleText}
                onChange={(e) => setTempTitleText(e.target.value)}
                placeholder="请输入新标题..."
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
              />
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowModifyTitleModal(false)}
                className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempTitleText.trim() && tempTitleText.trim() !== audioTitleText) {
                    setAudioTitleText(tempTitleText.trim());
                    showToast(`✅ 音频标题已修改为：[${tempTitleText.trim()}]`);
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

      {/* MODAL 3: 关联公共标签 Modal (3-column layout) */}
      {showPublicTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-1 space-y-0.5 text-xs">
                    {Object.keys(PUBLIC_TAG_GROUPS).map((groupKey) => (
                      <button
                        key={groupKey}
                        onClick={() => setSelectedPublicGroupKey(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPublicGroupKey === groupKey
                            ? "bg-purple-50 font-bold text-purple-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {groupKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>子标签</span>
                    <button
                      onClick={() => showToast("新加子标签窗口已打开")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      + 添加子标签
                    </button>
                  </div>
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                    {(PUBLIC_TAG_GROUPS[selectedPublicGroupKey] || []).map((sub) => {
                      const fullTagStr = `${selectedPublicGroupKey}: ${sub}`;
                      const isChecked = tempAddedPublicTags.includes(fullTagStr);
                      return (
                        <label
                          key={sub}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempAddedPublicTags([...tempAddedPublicTags, fullTagStr]);
                              } else {
                                setTempAddedPublicTags(tempAddedPublicTags.filter((t) => t !== fullTagStr));
                              }
                            }}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span>{sub}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>已添加标签</span>
                    <button
                      onClick={() => showToast("标签预设已保存")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      保存为预设
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs">
                    {tempAddedPublicTags.length === 0 ? (
                      <div className="text-center text-slate-400 py-10">暂未选择标签</div>
                    ) : (
                      tempAddedPublicTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => setTempAddedPublicTags(tempAddedPublicTags.filter((t) => t !== tag))}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPublicTagModal(false)}
                className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAudioPublicTags(tempAddedPublicTags);
                  showToast("✅ 公共标签更新成功！");
                  setShowPublicTagModal(false);
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 关联个人标签 Modal (3-column layout) */}
      {showPersonalTagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-1 space-y-0.5 text-xs">
                    {["个人设的", "我的私有分类", "常用个人标记"].map((groupKey) => (
                      <button
                        key={groupKey}
                        onClick={() => setSelectedPersonalGroupKey(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPersonalGroupKey === groupKey
                            ? "bg-purple-50 font-bold text-purple-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {groupKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>子标签</span>
                    <button
                      onClick={() => showToast("添加个人子标签窗口已打开")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      + 添加子标签
                    </button>
                  </div>
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                    {["Zs测试一", "Zs测试二", "个人精选1", "二创标记"].map((sub) => {
                      const isChecked = tempAddedPersonalTags.includes(sub);
                      return (
                        <label
                          key={sub}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempAddedPersonalTags([...tempAddedPersonalTags, sub]);
                              } else {
                                setTempAddedPersonalTags(tempAddedPersonalTags.filter((t) => t !== sub));
                              }
                            }}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span>{sub}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>已添加标签</span>
                    <button
                      onClick={() => showToast("个人预设已保存")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      保存为预设
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs">
                    {tempAddedPersonalTags.length === 0 ? (
                      <div className="text-center text-slate-400 py-10">暂未选择标签</div>
                    ) : (
                      tempAddedPersonalTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center justify-between bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-purple-700 font-medium"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => setTempAddedPersonalTags(tempAddedPersonalTags.filter((t) => t !== tag))}
                            className="text-purple-400 hover:text-rose-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPersonalTagModal(false)}
                className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAudioPersonalTags(tempAddedPersonalTags);
                  showToast("✅ 个人标签更新成功！");
                  setShowPersonalTagModal(false);
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
