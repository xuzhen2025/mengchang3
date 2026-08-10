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
  const [isDigitalHumanOpen, setIsDigitalHumanOpen] = useState(false);
  const [isModelDressingOpen, setIsModelDressingOpen] = useState(false);

  const [digitalHumanAvatar, setDigitalHumanAvatar] = useState("主播小美 (美妆日化)");
  const [digitalHumanTone, setDigitalHumanTone] = useState("热情高亢 (带货爆款)");
  const [digitalHumanScript, setDigitalHumanScript] = useState("哈罗各位宝宝们！今天给大家带来一款超级好用的黑科技香水。轻轻一喷，香味持久一整天，而且前中后调都特别有层次感。现在下单还享受买一送一哦，心动的宝宝赶紧点击下方链接抢购吧！");

  // ==========================================
  // --- Advanced AI Model Dress-Up/Try-on States ---
  // ==========================================
  
  // 1. Model Selection Mode & Data
  const [modelSourceMode, setModelSourceMode] = useState<"upload" | "digital">("digital");
  const [uploadedModelUrl, setUploadedModelUrl] = useState<string | null>(null);
  const [selectedDigitalModelId, setSelectedDigitalModelId] = useState<string>("digital_f1");
  
  // 2. Clothing Selection Mode & Data (Supports multiple/batch)
  const [clothingSourceMode, setClothingSourceMode] = useState<"upload" | "url">("upload");
  const [uploadedClothingUrls, setUploadedClothingUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=300&h=300&fit=crop", // preset 1
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop"  // preset 2
  ]);
  const [pastedProductItems, setPastedProductItems] = useState<{ id: string; url: string; imgUrl: string; name: string }[]>([]);
  const [clothingUrlInput, setClothingUrlInput] = useState("");
  const [isParsingClothingUrl, setIsParsingClothingUrl] = useState(false);

  // 3. Scene Selection (Required)
  const [modelScene, setModelScene] = useState<string>("高端室内摄影棚");

  // 4. Model Figure Style / Body Type Customization
  const [modelBodyTypeMode, setModelBodyTypeMode] = useState<"default" | "custom">("default"); // default = original uploaded image style
  const [selectedBodyType, setSelectedBodyType] = useState<string>("欧美骨感超模");

  // 5. Digital Human Face Swap / Custom face swap (from previous feature, preserved & fully integrated)
  const [faceSwapEnabled, setFaceSwapEnabled] = useState(false);
  const [faceSwapType, setFaceSwapType] = useState<"preset" | "upload">("preset");
  const [selectedFaceId, setSelectedFaceId] = useState("face1");
  const [uploadedFaceUrl, setUploadedFaceUrl] = useState<string | null>(null);

  // 6. Async Try-On Generation & Queue States
  const [tryOnStatus, setTryOnStatus] = useState<"idle" | "generating" | "minimized" | "completed">("idle");
  const [tryOnCountdown, setTryOnCountdown] = useState<number>(5);
  const [generatedResults, setGeneratedResults] = useState<{ id: string; url: string; clothingName: string; selected: boolean }[]>([]);
  const [isMinimizedNotificationOpen, setIsMinimizedNotificationOpen] = useState(false);

  // Helper to start the Model Try-On with countdown
  const startModelTryOn = () => {
    // 1. Validate Model Prototype
    if (modelSourceMode === "upload" && !uploadedModelUrl) {
      alert("⚠️ 请先上传您的模特原型照片！");
      return;
    }

    // 2. Validate Clothing Materials
    const activeClothesCount = clothingSourceMode === "upload" 
      ? uploadedClothingUrls.length 
      : pastedProductItems.length;

    if (activeClothesCount === 0) {
      alert("⚠️ 请至少提供一件服装（上传图片或输入商品链接/ID）！");
      return;
    }

    // 3. Validate Scene Selection
    if (!modelScene) {
      alert("⚠️ 请选择一个逼真渲染场景！");
      return;
    }

    // Prepare list of clothes to generate
    const clothesToGenerate = clothingSourceMode === "upload"
      ? uploadedClothingUrls.map((url, i) => ({ name: `上传服装原型 #${i + 1}`, url }))
      : pastedProductItems.map(p => ({ name: p.name, url: p.imgUrl }));

    // Initialize countdown
    setTryOnStatus("generating");
    setTryOnCountdown(5);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setTryOnCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        
        // Curated beautiful Try-On results matching various high-end styles
        const mockModelTryOnUrls = [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"
        ];
        
        const results = clothesToGenerate.map((item, idx) => ({
          id: `tryon-result-${idx}-${Date.now()}`,
          url: mockModelTryOnUrls[idx % mockModelTryOnUrls.length],
          clothingName: item.name,
          selected: true
        }));
        
        setGeneratedResults(results);
        setTryOnStatus("completed");
        setIsMinimizedNotificationOpen(true);
      }
    }, 1000);
  };

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

    const detectedScreen: ActiveScreen = outputTarget === "video" ? "ai_video" : "ai_image";
    const targetText = outputTarget === "video" ? "AI视频生成" : "AI图片生成";

    const confirmRoute = window.confirm(
      `✨ AI智能识别为您产出素材中...\n` +
      `已上传素材: ${selectedMaterials.length > 0 ? `${selectedMaterials.length} 个多媒体文件` : "暂未上传文件 (AI将自动解析提示词)"}\n` +
      `输出目标: [${outputTarget === "video" ? "视频素材" : "图片素材"}]\n` +
      `提示词: "${queryText || "由AI智能识别上传素材产出"}"\n\n` +
      `将自动为您跳转至 [${targetText}] 工具进行快速生成，是否跳转？`
    );

    if (confirmRoute) {
      setActiveScreen(detectedScreen);
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
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

            {/* 数字人分身 */}
            <div 
              onClick={() => setIsDigitalHumanOpen(true)}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors">数字人分身</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">高保真克隆音容笑貌，输入文本即产出主播视频</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-pink-600 flex items-center gap-1 self-start mt-2">
                极速制作 <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* 模特换衣 */}
            <div 
              onClick={() => setIsModelDressingOpen(true)}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-40"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">模特换衣</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">上传服装图搭配不同肤色AI模特和逼真场景</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 self-start mt-2">
                AI试穿 <ArrowRight className="w-3 h-3" />
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
                      alert("已复制同款创意 Prompt 链接及提示词！快去和团队成员分享吧。");
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

      {/* 2. DIGITAL HUMAN MODAL */}
      {isDigitalHumanOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh] shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">👥 AI 智能数字人分身工作台</h3>
                  <p className="text-[10px] text-slate-400">高保真音容笑貌克隆，无需实景拍摄，分钟级输出口播带货视频</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDigitalHumanOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              {/* Left Column: Avatar Selection */}
              <div className="flex-1 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">1. 选择主播模特分身</h4>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { name: "主播小美 (美妆日化)", desc: "甜美知性 · 亲和力极佳", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
                    { name: "主播大刘 (数码科技)", desc: "专业严谨 · 沉稳有说服力", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
                    { name: "主播露西 (服饰潮流)", desc: "外籍超模 · 时尚气息浓郁", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
                    { name: "主播王总 (高端商务)", desc: "中年精英 · 行业大咖气质", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" }
                  ]).map((avatar) => (
                    <div 
                      key={avatar.name}
                      onClick={() => setDigitalHumanAvatar(avatar.name)}
                      className={`border p-3 rounded-2xl cursor-pointer flex gap-3 items-center transition-all ${
                        digitalHumanAvatar === avatar.name 
                          ? "border-pink-500 bg-pink-50/20 shadow-sm" 
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <img src={avatar.img} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{avatar.name.split(" ")[0]}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 truncate">{avatar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">2. 调节声音音色及音速</h4>
                  <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">推荐音色标签</label>
                      <select 
                        value={digitalHumanTone}
                        onChange={(e) => setDigitalHumanTone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="热情高亢 (带货爆款)">热情高亢 (带货爆款)</option>
                        <option value="亲切温和 (好物推荐)">亲切温和 (好物推荐)</option>
                        <option value="干练专业 (测评对比)">干练专业 (测评对比)</option>
                        <option value="幽默风趣 (段子带货)">幽默风趣 (段子带货)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>口播语速倍率</span>
                        <span className="font-mono text-pink-600">1.05x</span>
                      </div>
                      <input type="range" min="0.8" max="1.5" step="0.05" defaultValue="1.0" className="w-full accent-pink-500 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Text and Launch */}
              <div className="w-full lg:w-[380px] space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">3. 设定数字人播报文案</h4>
                  <textarea 
                    value={digitalHumanScript}
                    onChange={(e) => setDigitalHumanScript(e.target.value)}
                    className="w-full h-44 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-medium text-slate-600 focus:outline-none focus:border-pink-300 resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>建议文案字数控制在 300 字以内</span>
                    <span>当前: {digitalHumanScript.length} 字</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">所需积分消耗</span>
                    <span className="font-mono font-black text-pink-600">40 点算力</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (!digitalHumanScript.trim()) {
                        alert("请先输入口播话术文本！");
                        return;
                      }
                      onAddTask("video", "数字人播报: " + digitalHumanAvatar.split(" ")[0], [], 40);
                      onAddCredits(-40, "AI数字人视频生成: " + digitalHumanAvatar.split(" ")[0]);
                      alert("AI数字人分身渲染任务已经提交排产！耗费: 40点。请在成片进度中查看。");
                      setIsDigitalHumanOpen(false);
                    }}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/15 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>一键合成数字人推流视频</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADVANCED MODEL DRESSING MODAL */}
      {isModelDressingOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden animate-scale-up flex flex-col h-[85vh] shadow-2xl text-slate-800">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">👚 模特换衣</h3>
                    <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded-sm font-mono font-bold tracking-wider uppercase">Pro Batch</span>
                  </div>
                  <p className="text-[10px] text-slate-500">将您的服装图智能融合到数字模特与写实商用场景中，极速批量生成商用主图</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (tryOnStatus === "generating") {
                    if (confirm("任务正在生成中，是否将其缩小至后台队列？")) {
                      setTryOnStatus("minimized");
                      setIsModelDressingOpen(false);
                    }
                  } else {
                    setIsModelDressingOpen(false);
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content body */}
            <div className="flex-1 overflow-hidden relative flex">
              
              {/* Overlay for GENERATING State */}
              {tryOnStatus === "generating" && (
                <div className="absolute inset-0 bg-white/95 z-20 backdrop-blur-xs flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                  <div className="relative mb-6">
                    {/* Ring loader */}
                    <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center">
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-3xl font-black text-blue-600">{tryOnCountdown}s</span>
                    </div>
                  </div>
                  
                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>AI 商用算力集群正在为您高速生成中...</span>
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
                    正在执行：衣服边缘智能剔除、三维骨骼姿态重组、高保真光影拟真重建、高级数字面容换脸融合。请稍等，预计5秒内完成。
                  </p>

                  <button
                    onClick={() => {
                      setTryOnStatus("minimized");
                      setIsModelDressingOpen(false);
                      alert("💼 任务已成功缩小并转入后台任务队列！您可在右下角查看进度并继续其他操作。");
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>缩小当前等待界面，转入“任务队列”继续</span>
                  </button>
                </div>
              )}

              {/* Overlay for COMPLETED State (Showing Results) */}
              {tryOnStatus === "completed" && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col h-full animate-fade-in p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>✨ 批量商用模特换装任务生成成功！</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">共为您生成 {generatedResults.length} 张高画质 commercial Lookbook 电商模特图</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const allSelected = generatedResults.every(r => r.selected);
                          setGeneratedResults(prev => prev.map(r => ({ ...r, selected: !allSelected })));
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        {generatedResults.every(r => r.selected) ? "取消全选" : "一键全选"}
                      </button>
                      <button
                        onClick={() => {
                          const selectedCount = generatedResults.filter(r => r.selected).length;
                          if (selectedCount === 0) {
                            alert("⚠️ 请至少勾选一张您心仪的生成图片！");
                            return;
                          }
                          alert(`🎉 成功将 ${selectedCount} 张高清AI模特换装图导入您的【电商素材库-成品区】！`);
                          setTryOnStatus("idle");
                          setIsModelDressingOpen(false);
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>保存至电商素材库 ({generatedResults.filter(r => r.selected).length}张)</span>
                      </button>
                      <button
                        onClick={() => setTryOnStatus("idle")}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        重新调整参数
                      </button>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-5 gap-4 flex-1 overflow-y-auto scrollbar-thin p-1">
                    {generatedResults.map((res) => (
                      <div 
                        key={res.id}
                        onClick={() => {
                          setGeneratedResults(prev => prev.map(r => r.id === res.id ? { ...r, selected: !r.selected } : r));
                        }}
                        className={`relative border rounded-2xl overflow-hidden cursor-pointer group transition-all duration-250 ${
                          res.selected 
                            ? "border-blue-500 bg-blue-50/10 shadow-lg shadow-blue-500/5 scale-95" 
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                          <img src={res.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          
                          {/* Selection Checkbox Overlay */}
                          <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            res.selected ? "bg-blue-600 text-white shadow-xs" : "bg-black/40 border border-white/50 text-transparent"
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>

                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1 py-0.5 rounded-sm uppercase tracking-wide">
                              8K 高保真
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">{res.clothingName}</p>
                          <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">
                            模特: {selectedBodyType} • 场景: {modelScene}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SINGLE COLUMN FORM LAYOUT (IDE STATE) */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Form Elements Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-slate-50/30">
                  
                  {/* STEP 1: SELECT MODEL */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono flex items-center justify-center font-black">1</span>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">选择或上传模特原型 (Model Prototype)</h4>
                      </div>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setModelSourceMode("digital")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            modelSourceMode === "digital" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          数字人库
                        </button>
                        <button
                          type="button"
                          onClick={() => setModelSourceMode("upload")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            modelSourceMode === "upload" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          本地自主上传
                        </button>
                      </div>
                    </div>

                    {modelSourceMode === "digital" ? (
                      <div className="grid grid-cols-5 gap-3">
                        {([
                          { id: "digital_f1", name: "诗雨", sex: "女性", desc: "古典东方优雅", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=200&fit=crop" },
                          { id: "digital_f2", name: "Rose", sex: "女性", desc: "欧美名媛气场", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=200&fit=crop" },
                          { id: "digital_f3", name: "凯特", sex: "女性", desc: "都市白领知性", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=200&fit=crop" },
                          { id: "digital_m1", name: "拓哉", sex: "男性", desc: "日系轻熟盐系", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=200&fit=crop" },
                          { id: "digital_m2", name: "David", sex: "男性", desc: "欧美时尚街头", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop" }
                        ]).map((model) => (
                          <div
                            key={model.id}
                            onClick={() => setSelectedDigitalModelId(model.id)}
                            className={`p-1.5 border rounded-2xl cursor-pointer text-center transition-all flex flex-col gap-1.5 bg-white relative ${
                              selectedDigitalModelId === model.id
                                ? "border-blue-500 ring-2 ring-blue-500/20 scale-[0.98]"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 relative">
                              <img src={model.img} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 right-1 text-[8px] bg-slate-900/80 text-white font-extrabold px-1 rounded-sm">
                                {model.sex}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-extrabold text-slate-800 truncate leading-tight">{model.name}</p>
                              <p className="text-[8px] text-slate-500 mt-0.5 truncate leading-none">{model.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 hover:border-blue-500/50 rounded-2xl p-4 text-center bg-white transition-all cursor-pointer relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setUploadedModelUrl(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {uploadedModelUrl ? (
                          <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img src={uploadedModelUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>原型模特图片上传成功</span>
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">已自动分析姿势、骨骼点位及光影反射...</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedModelUrl(null);
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 flex flex-col items-center justify-center py-2">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 group-hover:scale-110 transition-all">
                              <Upload className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">点击或将您想换装的模特照片拖拽至此上传</p>
                            <p className="text-[9px] text-slate-500 max-w-sm leading-relaxed">
                              支持全身或半身人像照片，衣服不限，光线明亮无过度遮挡效果最佳
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* STEP 2: CHOOSE MODEL BODY TYPE / FIGURE */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono flex items-center justify-center font-black">2</span>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">调整模特身材类型 (Model Figure Type)</h4>
                      </div>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setModelBodyTypeMode("default")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            modelBodyTypeMode === "default" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          默认图片身材
                        </button>
                        <button
                          type="button"
                          onClick={() => setModelBodyTypeMode("custom")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            modelBodyTypeMode === "custom" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          指定身材模板
                        </button>
                      </div>
                    </div>

                    {modelBodyTypeMode === "default" ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed font-semibold">
                        💡 智能引擎将保持上传模特照片中的原本身材形态、比例与线条，仅完成衣物及高级换脸的智能融合。
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2.5">
                        {([
                          { value: "欧美骨感超模", label: "欧美骨感超模", desc: "高挑比例/清晰锁骨" },
                          { value: "日系甜美美少女", label: "日系甜美美少女", desc: "娇小匀称/元气少女" },
                          { value: "国潮复古型男", label: "国潮复古型男", desc: "肩宽腰窄/健硕有型" },
                          { value: "资深都市丽人", label: "资深都市丽人", desc: "优雅挺拔/黄金比例" },
                          { value: "阳光运动型男", label: "阳光运动型男", desc: "阳刚硬朗/腹肌线条" },
                          { value: "微胖丰满身材", label: "微胖丰满身材", desc: "丰满肉感/曲线柔和" }
                        ]).map((body) => (
                          <div
                            key={body.value}
                            onClick={() => setSelectedBodyType(body.value)}
                            className={`p-2 border rounded-xl cursor-pointer transition-all bg-white ${
                              selectedBodyType === body.value
                                ? "border-blue-500 bg-blue-50/50 text-blue-600 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <p className="text-[10px] font-extrabold leading-tight">{body.label}</p>
                            <p className="text-[8px] text-slate-400 mt-1 font-medium leading-none">{body.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* STEP 3: ADVANCED FACE SWAP */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono flex items-center justify-center font-black">3</span>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">高级智能换脸/面孔重塑</h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={faceSwapEnabled} 
                          onChange={(e) => setFaceSwapEnabled(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 border border-slate-350"></div>
                        <span className="ml-1.5 text-[10px] font-bold text-slate-700">{faceSwapEnabled ? "定制换脸开启" : "换脸未开启"}</span>
                      </label>
                    </div>

                    {faceSwapEnabled ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFaceSwapType("preset")}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer border ${
                              faceSwapType === "preset" ? "bg-white text-blue-600 border-slate-200 shadow-xs" : "text-slate-500 border-transparent hover:text-slate-800"
                            }`}
                          >
                            选择数字人预设面容
                          </button>
                          <button
                            type="button"
                            onClick={() => setFaceSwapType("upload")}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer border ${
                              faceSwapType === "upload" ? "bg-white text-blue-600 border-slate-200 shadow-xs" : "text-slate-500 border-transparent hover:text-slate-800"
                            }`}
                          >
                            用户本地上传人脸
                          </button>
                        </div>

                        {faceSwapType === "preset" ? (
                          <div className="grid grid-cols-4 gap-2.5">
                            {([
                              { id: "face1", name: "时尚小美", desc: "甜美东方", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
                              { id: "face2", name: "干练佳丽", desc: "知性丽人", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
                              { id: "face3", name: "阳光小帅", desc: "活力潮男", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
                              { id: "face4", name: "韩系欧巴", desc: "极简潮男", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }
                            ]).map((face) => (
                              <div
                                key={face.id}
                                onClick={() => setSelectedFaceId(face.id)}
                                className={`p-2 border rounded-xl cursor-pointer text-center transition-all flex flex-col items-center gap-1 bg-white ${
                                  selectedFaceId === face.id
                                    ? "border-blue-500 bg-blue-50/50 shadow-xs"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                  <img src={face.img} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">{face.name}</p>
                                  <p className="text-[8px] text-slate-400 mt-0.5 truncate leading-none">{face.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-3 text-center bg-white transition-all cursor-pointer relative group">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setUploadedFaceUrl(event.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {uploadedFaceUrl ? (
                              <div className="flex items-center justify-between gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                    <img src={uploadedFaceUrl} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span>已锁定自定义换脸肖像</span>
                                    </p>
                                    <p className="text-[8px] text-slate-400">已智能识别眼/口/鼻等58个3D人脸定位特征</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedFaceUrl(null);
                                  }}
                                  className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1 flex flex-col items-center justify-center py-1">
                                <Upload className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold text-slate-700">点击或拖拽上传人脸特写原图</p>
                                <p className="text-[8px] text-slate-400">支持自拍、正面无遮挡，高画质照片换脸细节保留更完美</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center text-[10px] text-slate-400 font-semibold">
                        💡 关闭换脸重塑后，模特将自动保持原型人面孔，或应用内置数字超模默认五官。
                      </div>
                    )}
                  </div>

                  {/* STEP 4: CLOTHING SELECTION (SUPPORT BATCH) */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono flex items-center justify-center font-black">4</span>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">选择服装 (一次支持上传/添加多张批量生成)</h4>
                      </div>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setClothingSourceMode("upload")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            clothingSourceMode === "upload" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          多图本地上传
                        </button>
                        <button
                          type="button"
                          onClick={() => setClothingSourceMode("url")}
                          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                            clothingSourceMode === "url" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          商品链接/ID抓取
                        </button>
                      </div>
                    </div>

                    {clothingSourceMode === "upload" ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-2.5">
                          {uploadedClothingUrls.map((url, idx) => (
                            <div key={idx} className="relative aspect-square border border-slate-200 bg-white rounded-xl overflow-hidden group">
                              <img src={url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => setUploadedClothingUrls(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-1 rounded-lg bg-rose-600 text-white cursor-pointer hover:bg-rose-700 transition-colors"
                                  title="移除"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="absolute bottom-1 left-1 bg-black/70 text-[8px] px-1 rounded-xs text-white">
                                衣服 #{idx + 1}
                              </span>
                            </div>
                          ))}

                          {/* Trigger file input button */}
                          <div className="relative aspect-square border border-dashed border-slate-200 hover:border-blue-500/50 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  const promises = Array.from(files).map(file => {
                                    return new Promise<string>(resolve => {
                                      const r = new FileReader();
                                      r.onload = ev => resolve(ev.target?.result as string);
                                      r.readAsDataURL(file);
                                    });
                                  });
                                  Promise.all(promises).then(urls => {
                                    setUploadedClothingUrls(prev => [...prev, ...urls]);
                                  });
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[8px] text-slate-400 mt-1 font-bold group-hover:text-slate-500">追加上传衣服</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium">💡 可一次选定多张衣服照片进行上传，系统将自动对每件衣服与模特、场景进行高真实度试衣Lookbook生成。</p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-700 font-extrabold block">
                            粘贴商品链接/ID <span className="text-blue-600 font-semibold">(不同商品url/id请用“、”隔开)</span>
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="粘贴不同商品链接或ID，请用“、”隔开..."
                              value={clothingUrlInput}
                              onChange={(e) => setClothingUrlInput(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-hidden focus:border-blue-500"
                            />
                            <button
                              type="button"
                              disabled={isParsingClothingUrl || !clothingUrlInput.trim()}
                              onClick={() => {
                                setIsParsingClothingUrl(true);
                                setTimeout(() => {
                                  setIsParsingClothingUrl(false);
                                  
                                  const mockScrapedProducts = [
                                    { name: "高奢重工美利奴纯羊毛大衣", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop" },
                                    { name: "极客防水保暖加厚羽绒工装夹克", url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=300&h=300&fit=crop" },
                                    { name: "法式复古慵懒修身百褶雪纺裙", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop" },
                                    { name: "国潮刺绣水洗重磅棉工装卫衣", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop" }
                                  ];
                                  
                                  // Parse split list
                                  const itemsToParse = clothingUrlInput.split(/[、\n,]/).map(s => s.trim()).filter(Boolean);
                                  const newScrapedItems: any[] = [];
                                  
                                  itemsToParse.forEach((itemInput, idx) => {
                                    const match = mockScrapedProducts[(Math.floor(Math.random() * mockScrapedProducts.length) + idx) % mockScrapedProducts.length];
                                    const id = (itemInput.startsWith("http") ? "TB-" : "ID-") + Math.floor(Math.random()*90000+10000);
                                    newScrapedItems.push({
                                      id,
                                      url: itemInput,
                                      imgUrl: match.url,
                                      name: match.name
                                    });
                                  });
                                  
                                  setPastedProductItems(prev => [...prev, ...newScrapedItems]);
                                  setClothingUrlInput("");
                                  alert(`✅ 成功智能提取并解析了 ${newScrapedItems.length} 个服装宝贝主图！`);
                                }, 1000);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              {isParsingClothingUrl ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Globe className="w-3.5 h-3.5" />
                              )}
                              <span>自动解析商品</span>
                            </button>
                          </div>
                        </div>

                        {pastedProductItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[9px] text-slate-400 font-extrabold uppercase">已抓取解析服装列表 (共 {pastedProductItems.length} 款服装)</p>
                            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                              {pastedProductItems.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                    <img src={item.imgUrl} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-[10px] font-bold text-slate-800 truncate leading-tight">{item.name}</h5>
                                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 truncate">ID: {item.id}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setPastedProductItems(prev => prev.filter((_, i) => i !== index))}
                                    className="p-1 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* STEP 5: SELECT SCENE (FORCE / VISUAL) */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono flex items-center justify-center font-black">5</span>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">选择逼真商用融合场景 (Required Scene)</h4>
                      </div>
                      <span className="text-[9px] text-red-500 font-bold">* 必须选择场景</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {([
                        { name: "高端室内摄影棚", tag: "影棚/纯净高光", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=150&h=100&fit=crop" },
                        { name: "巴黎春季时尚街头", tag: "户外/自然漫射", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=100&fit=crop" },
                        { name: "奢华居家阳光露台", tag: "居家/落日氛围", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=150&h=100&fit=crop" },
                        { name: "夏日热带落日海滩", tag: "海滩/海风侧光", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=100&fit=crop" }
                      ]).map((scene) => (
                        <div
                          key={scene.name}
                          onClick={() => setModelScene(scene.name)}
                          className={`relative border rounded-2xl overflow-hidden cursor-pointer transition-all bg-white p-1 flex flex-col gap-1 ${
                            modelScene === scene.name
                              ? "border-blue-500 shadow-md shadow-blue-500/5 bg-blue-50/10"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 relative">
                            <img src={scene.img} className="w-full h-full object-cover" />
                            {modelScene === scene.name && (
                              <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                                <span className="bg-blue-600 text-white rounded-full p-0.5 shadow-xs">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-1 min-w-0">
                            <p className="text-[10px] font-extrabold text-slate-800 truncate leading-tight">{scene.name}</p>
                            <p className="text-[8px] text-slate-400 font-medium truncate leading-none mt-1">{scene.tag}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sticky Action Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-bold">算力点数扣除</span>
                    <span className="font-mono text-base font-black text-blue-600">
                      {25 * (clothingSourceMode === "upload" ? uploadedClothingUrls.length : pastedProductItems.length)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">点数</span>
                    <span className="text-[9px] text-slate-400"> (每件生成消耗25点)</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModelDressingOpen(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={startModelTryOn}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>一键启动 AI 模特换衣 ({clothingSourceMode === "upload" ? uploadedClothingUrls.length : pastedProductItems.length}件批量生成)</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* PERSISTENT FLOATING MINIMIZED TASK INDICATOR */}
      {tryOnStatus === "minimized" && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm text-slate-800 flex items-center gap-3 animate-slide-in">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 animate-pulse shrink-0">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-800">批量试衣换装任务进行中</span>
              <span className="text-[9px] bg-blue-50 text-blue-600 font-mono px-1 rounded-xs font-bold">{tryOnCountdown}s</span>
            </div>
            <p className="text-[9px] text-slate-500 truncate mt-0.5">正在融合场景【{modelScene}】与多款服装...</p>
          </div>
          <button
            onClick={() => {
              // Open the modal back up!
              setIsModelDressingOpen(true);
            }}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            还原查看
          </button>
        </div>
      )}

      {/* FLOATING SUCCESS NOTIFICATION POPUP */}
      {tryOnStatus === "completed" && isMinimizedNotificationOpen && !isModelDressingOpen && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border-2 border-emerald-500 p-4 rounded-2xl shadow-2xl max-w-md text-slate-800 flex gap-3 animate-slide-in">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-black text-slate-900">✅ AI 批量模特换装试穿生成完毕！</h5>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              共完成 {generatedResults.length} 款服装与场景【{modelScene}】的 Lookbook 生图融合。点击下方按钮立即查阅并保存大片。
            </p>
            <div className="flex gap-2 mt-2.5">
              <button
                onClick={() => {
                  setIsModelDressingOpen(true);
                  setIsMinimizedNotificationOpen(false);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
              >
                立即查收图片
              </button>
              <button
                onClick={() => {
                  setIsMinimizedNotificationOpen(false);
                  setTryOnStatus("idle");
                }}
                className="px-2 py-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
              >
                稍后处理
              </button>
            </div>
          </div>
        </div>
      )}    </div>
  );
}
