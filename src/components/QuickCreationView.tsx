import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  FileImage, 
  Tv2, 
  Image as ImageIcon, 
  Sliders, 
  Eraser, 
  Maximize2, 
  Layers, 
  Scissors, 
  Bot, 
  Play, 
  Heart, 
  Eye, 
  ArrowRight,
  Plus,
  Send,
  User,
  Copy,
  FolderHeart,
  ChevronUp,
  ChevronDown,
  Share2,
  Star,
  Flame,
  X,
  Crown,
  Gift,
  Coffee,
  Link,
  Video,
  Upload,
  Trash2,
  Globe,
  Check,
  Loader2,
  Minimize2
} from "lucide-react";
import { GalleryItem, ActiveScreen } from "../types";

interface QuickCreationViewProps {
  galleryItems: GalleryItem[];
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
  onAddTask: (taskType: any, name: string, inputFiles: string[], creditsCost: number) => void;
  onAddCredits: (amount: number, remark: string) => void;
  onUseSamePrompt: (type: "image" | "video", prompt: string, refUrl?: string, item?: GalleryItem) => void;
}

export default function QuickCreationView({
  galleryItems,
  setActiveScreen,
  onOpenMaterialSelector,
  onAddTask,
  onAddCredits,
  onUseSamePrompt
}: QuickCreationViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "beauty" | "tech" | "fashion">("all");
  const [queryText, setQueryText] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [outputTarget, setOutputTarget] = useState<"image" | "video">("image");
  const [selectedProductMaterialMode, setSelectedProductMaterialMode] = useState(false);
  const [selectedPainPointMode, setSelectedPainPointMode] = useState(false);
  const [selectedUsageProcessMode, setSelectedUsageProcessMode] = useState(false);
  const [painPointImg, setPainPointImg] = useState<string | null>(null);
  const [solutionImg, setSolutionImg] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [usageVideo, setUsageVideo] = useState<string | null>(null);
  const painPointInputRef = React.useRef<HTMLInputElement>(null);
  const solutionInputRef = React.useRef<HTMLInputElement>(null);
  const productImageInputRef = React.useRef<HTMLInputElement>(null);
  const usageVideoInputRef = React.useRef<HTMLInputElement>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiModelMode, setAiModelMode] = useState<"轻量模式" | "标准模式" | "专家高清模式">("轻量模式");
  const [isLightweightModeOpen, setIsLightweightModeOpen] = useState(false);
  const [videoLength, setVideoLength] = useState(30);
  const [videoAspectRatio, setVideoAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [autoRemoveWatermark, setAutoRemoveWatermark] = useState(true);

  // Image settings states
  const [imageAspectRatio, setImageAspectRatio] = useState<"1:1" | "3:4" | "9:16" | "16:9">("3:4");
  const [imageQuality, setImageQuality] = useState<"HD" | "2K" | "4K">("2K");
  const [imageCount, setImageCount] = useState<number>(1);
  const [autoImageEnhance, setAutoImageEnhance] = useState<boolean>(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isAgentMode, setIsAgentMode] = useState(true);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file);
      newUrls.push(objectUrl);
    }
    setSelectedMaterials(prev => [...prev, ...newUrls]);
  };

  // States for interactive e-commerce tool suites
  const [isHotVideosOpen, setIsHotVideosOpen] = useState(false);


  // Filter gallery items by matching tags for e-commerce video categories
  const filteredGallery = galleryItems.filter((item) => {
    if (activeTab === "all") return true;
    const tagsStr = (item.tags || []).join(" ");
    if (activeTab === "beauty") {
      return tagsStr.includes("美妆") || tagsStr.includes("日化") || tagsStr.includes("餐饮") || tagsStr.includes("厨具");
    }
    if (activeTab === "tech") {
      return tagsStr.includes("数码") || tagsStr.includes("智能") || tagsStr.includes("科技") || tagsStr.includes("3D");
    }
    if (activeTab === "fashion") {
      return tagsStr.includes("女装") || tagsStr.includes("鞋履") || tagsStr.includes("复古");
    }
    return true;
  });

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim() && selectedMaterials.length === 0) {
      alert("请上传图片或视频素材，或填写提示词！");
      return;
    }

    const targetText = outputTarget === "video" ? "AI视频原料" : "快速创作任务队列";

    const confirmRoute = window.confirm(
      `✨ AI智能识别为您产出素材中...\n` +
      `已上传素材: ${selectedMaterials.length > 0 ? `${selectedMaterials.length} 个多媒体文件` : "暂未上传文件 (AI将自动解析提示词)"}\n` +
      `输出目标: [${outputTarget === "video" ? "视频素材" : "图片素材"}]\n` +
      `提示词: "${queryText || "由AI智能识别上传素材产出"}"\n\n` +
      `${outputTarget === "video" ? "将跳转至" : "将在"} [${targetText}] ${outputTarget === "video" ? "继续配置" : "创建图片生成任务"}，是否继续？`
    );

    if (confirmRoute) {
      if (outputTarget === "video") {
        setActiveScreen("ai_video");
        return;
      }

      const taskName = `快速创作图片: ${queryText.trim() || "智能解析素材"}`;
      onAddTask("image_gen", taskName, selectedMaterials, imageCount * 2);
      alert("图片生成任务已加入任务队列，生成结果将保存至资源库。");
    }
  };

  const handleSelectAssets = () => {
    onOpenMaterialSelector((urls) => {
      setSelectedMaterials(urls);
    });
  };

  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Prompt 已复制到剪贴板！");
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Title Banner */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold rounded-full uppercase tracking-widest font-mono">
              ★ PREMIUM PLATFORM
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
            梦畅AIGC，
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">
              为电商而生的 AIGC 平台
            </span>
          </h1>
        </div>

        {/* AI Prompt Input Center */}
        <div className="space-y-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,video/*" 
            multiple 
            className="hidden" 
          />

          <form onSubmit={handleSendPrompt} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm relative space-y-3">
            {/* Top area with tag badge and prompt text */}
            <div className="flex flex-wrap items-start gap-2 min-h-20">
              {selectedProductMaterialMode && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/90 shadow-2xs select-none shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>产品素材</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProductMaterialMode(false)}
                    className="hover:bg-purple-200/80 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                    title="移除标签"
                  >
                    <X className="w-3 h-3 text-purple-600" />
                  </button>
                </span>
              )}

              {selectedPainPointMode && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/90 shadow-2xs select-none shrink-0 mt-0.5">
                  <Tv2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>痛点对比</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPainPointMode(false)}
                    className="hover:bg-purple-200/80 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                    title="移除标签"
                  >
                    <X className="w-3 h-3 text-purple-600" />
                  </button>
                </span>
              )}

              {selectedUsageProcessMode && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/90 shadow-2xs select-none shrink-0 mt-0.5">
                  <Play className="w-3.5 h-3.5 text-purple-600 fill-purple-600/20" />
                  <span>使用过程</span>
                  <button
                    type="button"
                    onClick={() => setSelectedUsageProcessMode(false)}
                    className="hover:bg-purple-200/80 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                    title="移除标签"
                  >
                    <X className="w-3 h-3 text-purple-600" />
                  </button>
                </span>
              )}

              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder={
                  selectedProductMaterialMode 
                    ? "参考已上传的图片/视频，生成相关的产品素材。"
                    : selectedPainPointMode
                    ? "参考已上传的图片，生成痛点对比素材。"
                    : selectedUsageProcessMode
                    ? "参考已上传的图片/视频，生成使用过程视频。"
                    : "请输入您想要创作的内容,例如:制作一条有关棒球服的展示视频。"
                }
                className={`flex-1 min-w-[200px] bg-transparent border-none text-sm py-0.5 focus:outline-none focus:ring-0 resize-none h-20 leading-relaxed placeholder-slate-400 ${
                  (selectedProductMaterialMode || selectedPainPointMode || selectedUsageProcessMode) && 
                  (queryText === "参考已上传的图片/视频，生成相关的产品素材。" || queryText === "参考已上传的图片，生成痛点对比素材。" || queryText === "参考已上传的图片/视频，生成使用过程视频。" || queryText === "")
                    ? "text-slate-400"
                    : "text-slate-700"
                }`}
              />
            </div>

            {/* Usage process specific asset previews */}
            {selectedUsageProcessMode && (productImage || usageVideo) && (
              <div className="flex flex-wrap gap-3 mb-2 pb-2 border-b border-slate-100">
                {productImage && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-300 bg-slate-50 flex-shrink-0 group shadow-xs">
                    <img src={productImage} alt="商品图片" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                      商品图片
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductImage(null)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}
                {usageVideo && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-300 bg-slate-900 flex-shrink-0 group shadow-xs">
                    <video src={usageVideo} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-0 left-0 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                      过程视频
                    </div>
                    <button
                      type="button"
                      onClick={() => setUsageVideo(null)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pain point specific asset previews */}
            {selectedPainPointMode && (painPointImg || solutionImg) && (
              <div className="flex flex-wrap gap-3 mb-2 pb-2 border-b border-slate-100">
                {painPointImg && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-300 bg-slate-50 flex-shrink-0 group shadow-xs">
                    <img src={painPointImg} alt="痛点素材" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                      痛点
                    </div>
                    <button
                      type="button"
                      onClick={() => setPainPointImg(null)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}
                {solutionImg && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-300 bg-slate-50 flex-shrink-0 group shadow-xs">
                    <img src={solutionImg} alt="解决痛点素材" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                      解决痛点
                    </div>
                    <button
                      type="button"
                      onClick={() => setSolutionImg(null)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Asset previews inside input for standard/product mode */}
            {!selectedPainPointMode && !selectedUsageProcessMode && selectedMaterials.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-slate-100">
                {selectedMaterials.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-purple-200 bg-slate-50 flex-shrink-0 group shadow-xs">
                    <img src={url} alt="uploaded material" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center font-mono font-bold py-0.5">
                      素材 #{i + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMaterials(selectedMaterials.filter(u => u !== url))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file inputs for pain point mode and usage process mode */}
            <input
              type="file"
              ref={painPointInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPainPointImg(URL.createObjectURL(file));
              }}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={solutionInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSolutionImg(URL.createObjectURL(file));
              }}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={productImageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setProductImage(URL.createObjectURL(file));
              }}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={usageVideoInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUsageVideo(URL.createObjectURL(file));
              }}
              accept="video/*"
              className="hidden"
            />

            {/* Bottom toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 relative">
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedUsageProcessMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => productImageInputRef.current?.click()}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>上传商品图片</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => usageVideoInputRef.current?.click()}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>上传使用过程视频</span>
                    </button>
                  </>
                ) : selectedPainPointMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => painPointInputRef.current?.click()}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>上传痛点素材</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => solutionInputRef.current?.click()}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>上传解决痛点素材</span>
                    </button>
                  </>
                ) : selectedProductMaterialMode ? (
                  <>
                    {/* Upload direct button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>上传图片/视频素材</span>
                    </button>

                    {/* Output Target selector */}
                    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-500 pl-2 select-none">输出目标:</span>
                      <button
                        type="button"
                        onClick={() => setOutputTarget("image")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          outputTarget === "image"
                            ? "bg-white text-purple-600 shadow-xs border border-purple-200/80"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>图片</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutputTarget("video")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          outputTarget === "video"
                            ? "bg-white text-purple-600 shadow-xs border border-purple-200/80"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>视频</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Standard Mode Buttons */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt("请输入您要绑定的商品 URL/ID:");
                        if (url) alert("已成功解析并绑定商品链接: " + url);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      <Link className="w-3.5 h-3.5 text-slate-500" />
                      <span>商品 URL/ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectAssets}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>媒体素材</span>
                    </button>
                  </>
                )}

                {/* 1. 设置 (视频/图片参数配置) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsLightweightModeOpen(false);
                  }}
                  className={`border rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isSettingsOpen
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-600"
                  }`}
                >
                  <Sliders className={`w-3.5 h-3.5 ${isSettingsOpen ? "text-purple-600" : "text-slate-500"}`} />
                  <span>设置</span>
                  <ChevronDown className={`w-3 h-3 ${isSettingsOpen ? "text-purple-500" : "text-slate-400"}`} />
                </button>

                {/* 2. AI大模型模式 (轻量模式 / 标准模式 / 专家模式) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLightweightModeOpen(!isLightweightModeOpen);
                    setIsSettingsOpen(false);
                  }}
                  className={`border rounded-xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isLightweightModeOpen
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-600"
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLightweightModeOpen ? "text-purple-600" : "text-slate-500"}`} />
                  <span>{aiModelMode}</span>
                  <ChevronDown className={`w-3 h-3 ${isLightweightModeOpen ? "text-purple-500" : "text-slate-400"}`} />
                </button>
              </div>

              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer shrink-0 ml-auto"
                title="开始生成"
              >
                <Sparkles className="w-5 h-5 fill-current" />
              </button>

              {/* Settings drawer popover (图片/视频设置) */}
              {isSettingsOpen && (
                <div className="absolute left-0 top-full mt-3 z-30 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-4 w-72 sm:w-80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  {outputTarget === "image" && !selectedPainPointMode ? (
                    <>
                      {/* Image output settings */}
                      <div className="font-bold text-slate-800 text-xs tracking-wide flex items-center justify-between">
                        <span>图片输出参数设置</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">清晰度与尺寸</span>
                      </div>
                      <div className="border-b border-slate-100 -mt-2" />

                      {/* 1. 图片画面比例 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">1. 图片画面比例</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { ratio: "1:1", label: "1:1" },
                            { ratio: "3:4", label: "3:4" },
                            { ratio: "9:16", label: "9:16" },
                            { ratio: "16:9", label: "16:9" },
                          ].map((item) => (
                            <button
                              key={item.ratio}
                              type="button"
                              onClick={() => setImageAspectRatio(item.ratio as any)}
                              className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                imageAspectRatio === item.ratio
                                  ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {item.ratio}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. 画质/分辨率 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">2. 画质/分辨率</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { level: "HD", label: "1080P 高清" },
                            { level: "2K", label: "2K 超清" },
                            { level: "4K", label: "4K 极清" },
                          ].map((item) => (
                            <button
                              key={item.level}
                              type="button"
                              onClick={() => setImageQuality(item.level as any)}
                              className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                imageQuality === item.level
                                  ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. 单次生成张数 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">3. 单次生成数量</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 4].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => setImageCount(cnt)}
                              className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                imageCount === cnt
                                  ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {cnt} 张
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. AI 细节强化与质感打光 */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700">4. AI 细节强化与打光</span>
                        <button
                          type="button"
                          onClick={() => setAutoImageEnhance(!autoImageEnhance)}
                          className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                            autoImageEnhance ? "bg-purple-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                              autoImageEnhance ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Video output settings */}
                      <div className="font-bold text-slate-800 text-xs tracking-wide flex items-center justify-between">
                        <span>视频输出参数设置</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-normal">画质与格式</span>
                      </div>
                      <div className="border-b border-slate-100 -mt-2" />

                      {/* 1. 视频长度 (20 - 120 秒) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">1. 视频长度 (20 - 120 秒)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[20, 30, 60, 120].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setVideoLength(sec)}
                              className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                videoLength === sec
                                  ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={120}
                          value={videoLength}
                          onChange={(e) => setVideoLength(Number(e.target.value))}
                          className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                        <div className="text-[11px] text-slate-400">当前: <span className="font-bold text-slate-700">{videoLength} 秒</span></div>
                      </div>

                      {/* 2. 视频画面比例 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">2. 视频画面比例</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setVideoAspectRatio("9:16")}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              videoAspectRatio === "9:16"
                                ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div className="w-2.5 h-4 border-2 border-current rounded-xs shrink-0" />
                            <span>9:16 竖屏</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVideoAspectRatio("16:9")}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              videoAspectRatio === "16:9"
                                ? "bg-purple-50 border-purple-400 text-purple-700 shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div className="w-4 h-2.5 border-2 border-current rounded-xs shrink-0" />
                            <span>16:9 横屏</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. 是否自动去水印并补足 */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700">3. 是否自动去水印并补足</span>
                        <button
                          type="button"
                          onClick={() => setAutoRemoveWatermark(!autoRemoveWatermark)}
                          className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                            autoRemoveWatermark ? "bg-purple-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                              autoRemoveWatermark ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* AI大模型选择 Popover */}
              {isLightweightModeOpen && (
                <div className="absolute left-24 sm:left-28 top-full mt-3 z-30 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-4 w-72 sm:w-80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-800 text-xs tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>AI大模型模式选择</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">运算算力</span>
                  </div>
                  <div className="border-b border-slate-100 -mt-1" />

                  <div className="space-y-2">
                    {[
                      { title: "轻量模式", desc: "响应极快，节省50%算力积分（推荐）", tag: "省积分" },
                      { title: "标准模式", desc: "高清顺滑，兼顾生成速度与画质", tag: "均衡" },
                      { title: "专家高清模式", desc: "极清画质与细腻质感，适合商业展示", tag: "极高画质" },
                    ].map((mode) => (
                      <div
                        key={mode.title}
                        onClick={() => {
                          setAiModelMode(mode.title as any);
                          setIsLightweightModeOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          aiModelMode === mode.title
                            ? "bg-purple-50/90 border-purple-400 text-purple-900 shadow-2xs"
                            : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-2">
                            <span>{mode.title}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              aiModelMode === mode.title ? "bg-purple-200 text-purple-800" : "bg-slate-200 text-slate-600"
                            }`}>
                              {mode.tag}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{mode.desc}</div>
                        </div>
                        {aiModelMode === mode.title && (
                          <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Underneath template pills row from the image */}
          <div className="flex flex-wrap items-center gap-3 justify-center pt-1.5">
            {[
              {
                label: "产品素材",
                icon: Layers,
                iconColor: "text-blue-500",
                prompt: "参考已上传的图片/视频，生成相关的产品素材。",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4",
                caseTitle: "高奢美妆产品细节特写演示"
              },
              {
                label: "痛点对比",
                icon: Tv2,
                iconColor: "text-red-500",
                prompt: "参考已上传的图片，生成痛点对比素材。",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4",
                caseTitle: "干皮痛点实测对比演示"
              },
              {
                label: "使用过程",
                icon: Play,
                iconColor: "text-emerald-500",
                prompt: "参考已上传的图片/视频，生成使用过程视频。",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-smart-watch-with-black-screen-40503-large.mp4",
                caseTitle: "智能数码产品使用演示"
              },
              {
                label: "koc口播",
                icon: User,
                iconColor: "text-purple-500",
                prompt: "生成一段高人气KOC博主坐在温馨北欧风客厅里，面对镜头亲切自然、充满热情进行[便携咖啡机]好物口播安利的种草视频，配有生动的解说字幕与分镜头剪辑。",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-with-makeup-posing-near-flowers-40540-large.mp4",
                caseTitle: "美妆KOC好物推荐口播演示"
              },
              {
                label: "剧情素材",
                icon: Video,
                iconColor: "text-amber-500",
                prompt: "帮我制作一段围绕‘办公室午后困倦’展开的创意带货剧情短片。前段展现打工人的疲惫与困意，中段通过享用[提神能量饮]实现能量瞬间满格，后半段展示高效工作的反差感，富有节奏感和趣味性。",
                videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
                caseTitle: "办公室场景创意带货剧情演示"
              }
            ].map((btn, idx) => {
              const IconComponent = btn.icon;
              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setActiveHoverIdx(idx)}
                  onMouseLeave={() => setActiveHoverIdx(null)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (btn.label === "产品素材") {
                        setSelectedProductMaterialMode(true);
                        setSelectedPainPointMode(false);
                        setSelectedUsageProcessMode(false);
                        if (btn.prompt) setQueryText(btn.prompt);
                      } else if (btn.label === "痛点对比") {
                        setSelectedPainPointMode(true);
                        setSelectedProductMaterialMode(false);
                        setSelectedUsageProcessMode(false);
                        setOutputTarget("video");
                        if (btn.prompt) setQueryText(btn.prompt);
                      } else if (btn.label === "使用过程") {
                        setSelectedUsageProcessMode(true);
                        setSelectedProductMaterialMode(false);
                        setSelectedPainPointMode(false);
                        setOutputTarget("video");
                        if (btn.prompt) setQueryText(btn.prompt);
                      } else {
                        setSelectedProductMaterialMode(false);
                        setSelectedPainPointMode(false);
                        setSelectedUsageProcessMode(false);
                        if (btn.prompt) setQueryText(btn.prompt);
                      }
                    }}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-600 rounded-full px-5 py-2.5 text-xs font-semibold text-slate-700 transition-all shadow-xs cursor-pointer hover:scale-[1.02]"
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${btn.iconColor}`} />
                    <span>{btn.label}</span>
                  </button>

                  {/* Case video popup on hover */}
                  {activeHoverIdx === idx && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-1.5 transition-all duration-200 animate-fade-in">
                      <div className="relative z-10 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-100">
                        <video
                          src={btn.videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          案例视频
                        </div>
                      </div>

                      {/* Decorative arrow pointing down */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 z-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Tools Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">电商核心创意工具组</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 水印擦除 */}
            <div 
              onClick={() => setActiveScreen("watermark")}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                  <Eraser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors">视频去水印</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">智能擦除视频水印与遮挡元素</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-pink-600 flex items-center gap-1 self-start mt-2">
                立即擦除 <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* 字幕擦除 */}
            <div 
              onClick={() => setActiveScreen("subtitle")}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">字幕擦除</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">一键去除视频字幕与画面文字</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 self-start mt-2">
                立即清除 <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* 画质增强 */}
            <div 
              onClick={() => setActiveScreen("enhance")}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors">画质增强</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">提升视频清晰度与画作多倍质感</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 flex items-center gap-1 self-start mt-2">
                立即增强 <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* 视频换脸 */}
            <div 
              onClick={() => setActiveScreen("face_swap")}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">视频换脸</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">识别人脸分组，为视频角色配置替换人像</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 self-start mt-2">
                开始换脸 <ArrowRight className="w-3 h-3" />
              </span>
            </div>

          </div>
        </div>

        {/* Discovery Gallery Feed */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">电商爆款灵感画廊</h2>
            <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
              {([
                { id: "all", label: "全部爆款" },
                { id: "beauty", label: "日化美妆" },
                { id: "tech", label: "数码科技" },
                { id: "fashion", label: "鞋履服饰" }
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    activeTab === t.id ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => setSelectedGalleryItem(item)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-slate-300 transition-all duration-300 cursor-pointer relative shadow-xs"
              >
                {/* Visual Thumbnail */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative">
                  <div className="w-full h-full relative">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/15 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-purple-600/95 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Floating One-click same style button overlay requested by the user */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUseSamePrompt("video", item.prompt || "", item.coverUrl || item.url, item);
                      }}
                      className="absolute bottom-2.5 left-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-lg cursor-pointer transition-all hover:scale-105 z-20 border border-purple-400/40"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                      <span>一键同款</span>
                    </button>

                    <span className="absolute bottom-2 right-2 bg-black/60 text-[9px] text-white px-1 rounded font-mono">
                      {item.duration || "10s"}
                    </span>
                  </div>

                  {/* Quick hovering copy option */}
                  {hoveredItemId === item.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.prompt);
                      }}
                      className="absolute top-2 right-2 bg-white/95 border border-slate-200 p-2 rounded-xl text-slate-700 hover:text-black transition-all shadow-md hover:scale-105 cursor-pointer z-10"
                      title="复制 AI Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Info details */}
                <div className="p-3.5 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <img src={item.authorAvatar} alt={item.author} className="w-4 h-4 rounded-full object-cover" />
                      <span className="truncate max-w-[80px]">{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500/10" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3 text-slate-400" /> {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 text-center space-y-2 text-[10px] text-slate-400 font-mono">
          <p>© 2026 MC AIGC. Designed 100% restored with robust full-stack GPU microservices.</p>
          <p>蜀ICP备18023450号-4 ｜ 电商大模型备案审核第D-4901209号</p>
        </div>
      </div>

      {/* Gallery inspect popup modal */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden animate-scale-up flex flex-col md:flex-row max-h-[90vh] shadow-2xl">
            
            {/* 1. Left-most Column: Related Items Vertical Carousel (Desktop only) */}
            <div className="hidden md:flex flex-col items-center justify-between gap-3 bg-slate-950 p-3 w-16 border-r border-slate-800 shrink-0 select-none">
              <button 
                onClick={() => {
                  const idx = galleryItems.findIndex(g => g.id === selectedGalleryItem.id);
                  const prevIdx = (idx - 1 + galleryItems.length) % galleryItems.length;
                  setSelectedGalleryItem(galleryItems[prevIdx]);
                }}
                className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-900"
                title="上一个"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              
              <div className="flex-1 flex flex-col gap-2.5 justify-center overflow-y-auto py-2">
                {galleryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGalleryItem(item)}
                    className={`w-10 h-14 rounded-lg overflow-hidden border-2 transition-all relative shrink-0 group ${
                      item.id === selectedGalleryItem.id 
                        ? "border-purple-500 ring-4 ring-purple-500/20 scale-105" 
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={item.type === "video" ? (item.coverUrl || item.url) : item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-2.5 h-2.5 fill-white text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const idx = galleryItems.findIndex(g => g.id === selectedGalleryItem.id);
                  const nextIdx = (idx + 1) % galleryItems.length;
                  setSelectedGalleryItem(galleryItems[nextIdx]);
                }}
                className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-900"
                title="下一个"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Visual Screen player (Middle) */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center relative md:max-w-xl select-none min-h-[300px] md:min-h-full">
              {selectedGalleryItem.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  <video
                    src={selectedGalleryItem.url}
                    className="w-full h-full object-contain max-h-[40vh] md:max-h-[80vh]"
                    controls
                    autoPlay
                    loop
                  />
                  <span className="absolute top-3 left-3 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded-md font-mono tracking-wider">
                    {selectedGalleryItem.duration || "15s"} VIDEO
                  </span>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <img
                    src={selectedGalleryItem.url}
                    alt={selectedGalleryItem.title}
                    className="w-full h-full object-contain max-h-[40vh] md:max-h-[80vh]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded-md font-mono tracking-wider">
                    HD IMAGE
                  </span>
                </div>
              )}
            </div>

            {/* 3. Inspect Side info (Right) */}
            <div className="p-6 flex flex-col justify-between w-full md:w-[380px] border-t md:border-t-0 md:border-l border-slate-100 overflow-y-auto bg-white max-h-[50vh] md:max-h-full">
              <div className="space-y-5">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <span>创意详情</span>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1 text-amber-500 font-mono font-black">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      <span>热度 {localLikes[selectedGalleryItem.id] || selectedGalleryItem.likes * 2 + 150}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedGalleryItem(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Author */}
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 leading-snug">{selectedGalleryItem.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                    <img src={selectedGalleryItem.authorAvatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-semibold text-slate-700">{selectedGalleryItem.author}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">
                      {selectedGalleryItem.category}
                    </span>
                  </div>
                </div>

                {/* Prompt Section */}
                {selectedGalleryItem.prompt && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        {selectedGalleryItem.type === "video" ? "视频提示词" : "图片提示词"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedGalleryItem.prompt)}
                        className="text-[10px] text-purple-600 hover:text-purple-500 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>复制</span>
                      </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 relative">
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed select-all font-medium">
                        {selectedGalleryItem.prompt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reference Image Section */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                    {selectedGalleryItem.type === "video" ? "视频参考图" : "图片参考图"}
                  </span>
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group select-none">
                    <img 
                      src={selectedGalleryItem.type === "video" ? (selectedGalleryItem.coverUrl || selectedGalleryItem.url) : selectedGalleryItem.url} 
                      alt="Reference visual" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-[8px] text-white px-1.5 py-0.5 rounded-md font-bold">
                      {selectedGalleryItem.type === "video" ? "首帧" : "主图"}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-all cursor-zoom-in">
                      展开详情
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {selectedGalleryItem.type === "video" ? "视频标签" : "图片标签"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedGalleryItem.tags || [selectedGalleryItem.category, "爆款推荐", "AIGC商用"]).map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {/* Favorite / Star Button */}
                  <button
                    onClick={() => {
                      const isFav = !favorites[selectedGalleryItem.id];
                      setFavorites({ ...favorites, [selectedGalleryItem.id]: isFav });
                      
                      const currentLikes = localLikes[selectedGalleryItem.id] || selectedGalleryItem.likes * 2 + 150;
                      setLocalLikes({ 
                        ...localLikes, 
                        [selectedGalleryItem.id]: isFav ? currentLikes + 1 : currentLikes - 1 
                      });
                      
                      alert(isFav ? "已将该创意加入您的收藏夹！" : "已将该创意移出您的收藏夹。");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      favorites[selectedGalleryItem.id]
                        ? "bg-amber-50 border-amber-300 text-amber-500 shadow-sm animate-scale-up"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    title={favorites[selectedGalleryItem.id] ? "取消收藏" : "加入收藏"}
                  >
                    <Star className={`w-4 h-4 ${favorites[selectedGalleryItem.id] ? "fill-amber-500" : ""}`} />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      copyToClipboard(selectedGalleryItem.prompt);
                      alert("已复制同款创意 Prompt 链接及提示词！快去和部门成员分享吧。");
                    }}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center"
                    title="分享创意"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* 一键同款 Button */}
                  <button
                    onClick={() => {
                      onUseSamePrompt(
                        selectedGalleryItem.type,
                        selectedGalleryItem.prompt || "",
                        selectedGalleryItem.type === "video" ? selectedGalleryItem.coverUrl : selectedGalleryItem.url,
                        selectedGalleryItem
                      );
                      setSelectedGalleryItem(null);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-purple-600/10 flex items-center justify-center gap-1.5 cursor-pointer ml-1 hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>一键同款</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 1. HOT VIDEOS LIST MODAL */}
      {isHotVideosOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh] shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">🔥 爆款电商视频模板库</h3>
                  <p className="text-[10px] text-slate-400">选择高转化率爆款模版，极速一键套用渲染</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHotVideosOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                {
                  id: "tpl1",
                  title: "全网爆卖！爆款羽绒服三维开场特效",
                  stats: "转发 1.2w · 赞 4.5w · 评论 8900",
                  cost: 30,
                  prompt: "三维羽绒服爆开开场，蓬松羽丝慢镜头特写，酷炫科技爆闪大灯，写实逼真，突出极致保暖性能与奢华科技感。",
                  cover: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&h=400&fit=crop"
                },
                {
                  id: "tpl2",
                  title: "美妆种草！多场景高级气泡遮罩香水片",
                  stats: "转发 8900 · 赞 3.2w · 评论 4500",
                  cost: 20,
                  prompt: "北欧冷淡风，高端磨砂香水瓶在水波纹气泡中缓缓上升，折射出晶莹反光，舒缓舒心，高级质感。",
                  cover: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=400&fit=crop"
                },
                {
                  id: "tpl3",
                  title: "数码神机！专业极简高奢折叠手机展示",
                  stats: "转发 1.8w · 赞 6.8w · 评论 1.2w",
                  cost: 30,
                  prompt: "折叠屏手机翻转开合全景，金属中框反光，背景为极简赛博朋克霓虹光晕，展现极致工业美学与未来科技感。",
                  cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"
                },
                {
                  id: "tpl4",
                  title: "餐饮带货！日式小清新牛排滋滋煎炸轴",
                  stats: "转发 5600 · 赞 2.1w · 评论 2900",
                  cost: 20,
                  prompt: "热气腾腾的牛排在铸铁锅中滋滋作响，迷迭香和黄油在慢镜头中翻滚融化，暖色调，烟火气，极具食欲感。",
                  cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop"
                }
              ]).map((tpl) => (
                <div key={tpl.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col h-[280px] shadow-xs group hover:border-purple-300 transition-all">
                  <div className="h-32 overflow-hidden relative bg-slate-200">
                    <img src={tpl.cover} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" referrerPolicy="no-referrer" />
                    <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded-md font-mono">
                      单次: {tpl.cost}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{tpl.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{tpl.stats}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{tpl.prompt}</p>
                    </div>

                    <button 
                      onClick={() => {
                        onAddTask("video", tpl.title, [], tpl.cost);
                        onAddCredits(-tpl.cost, "套用模版: " + tpl.title);
                        alert(`模板套用成功！已扣除 ${tpl.cost} 算力点。爆款视频任务已经排入系统备选生成区，请在 [成片管理] 进度中查看渲染！`);
                        setIsHotVideosOpen(false);
                      }}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>套用此模板生成</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
