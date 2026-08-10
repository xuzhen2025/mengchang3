import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Edit3, 
  Play, 
  Pause, 
  Upload, 
  Globe, 
  Check, 
  Download, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Box, 
  HelpCircle, 
  Scissors, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize2,
  ListFilter,
  Image as ImageIcon,
  FolderOpen,
  ChevronRight,
  Info
} from "lucide-react";

interface VideoRemakeProps {
  onBack: () => void;
  onAddTask: (
    type: "detail_set" | "watermark" | "subtitle" | "enhance" | "video_gen" | "image_gen" | "fission",
    name: string,
    inputFiles: string[],
    creditsCost: number
  ) => void;
  credits: number;
}

// Simulated data
const ORIGINAL_CHARACTER_IMG = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop"; // Skincare/grooming model style
const NEW_CHARACTER_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop"; // Three-view layout/clean portrait style 
const NEW_CHARACTER_3VIEW_IMG = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"; // Character frontal/profile style

const ORIGINAL_SCENE_IMG = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop"; // Bathroom
const NEW_SCENE_IMG = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=450&fit=crop"; // High-end bathroom

const ORIGINAL_PROP_IMG = "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop"; // Beauty device
const NEW_PROP_IMG = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop"; // Generated rosegold beauty device

export default function VideoRemakeView({ onBack, onAddTask, credits }: VideoRemakeProps) {
  // Navigation: "original" | "analyzing" | "setting" | "storyboard" | "final"
  const [currentStep, setCurrentStep] = useState<"original" | "analyzing" | "setting" | "storyboard" | "final">("original");
  
  // Original Video Selection Config State
  const [language, setLanguage] = useState("中文");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [resolution, setResolution] = useState("720p");
  const [videoStyle, setVideoStyle] = useState("写实通用");
  const [uploadedVideo, setUploadedVideo] = useState<{name: string, size: string, duration: string} | null>(null);
  
  // Analyzing Stage Progresses
  const [plotProgress, setPlotProgress] = useState(0);
  const [charProgress, setCharProgress] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [analyzingComplete, setAnalyzingComplete] = useState(false);

  // Setup/Settings Stage States
  const [activeSetupTab, setActiveSetupTab] = useState<"character" | "scene" | "prop">("character");
  const [characterName, setCharacterName] = useState("角色A");
  const [characterPrompt, setCharacterPrompt] = useState(
    "- 任务：完成角色的上半身正面平视特写和该角色的全身三视图。左边是角色的上半身正面平视特写，右边是该角色的全身三视图。三视图不可以有分割线，比例是 16:9，左侧为角色胸部以上特写大图，占画面约 40% 宽度，用于展示面部、发型、表情、眼神、上半身服装和配饰细节，右侧为同一角色的三视图，占画面约 60% 宽度，依次展示正面全、侧面全、背面全。"
  );
  
  const [sceneName, setSceneName] = useState("现代家居卫生间（浴室）");
  const [scenePrompt, setScenePrompt] = useState(
    "现代简约风格的中高档家居卫生间内景，白天，左侧大面积玻璃窗透进明亮柔和的自然日光，光线均匀通透。墙面为高级灰色哑光瓷砖，搭配黑框玻璃淋浴隔断，白色平整吊顶，角落可见玻璃浴室门与五金合页，整体空间干净整洁、无杂物，低饱和度灰调主色，营造清爽日常的居家氛围。空场景，无人物。"
  );
  
  const [propName, setPropName] = useState("美容仪");
  const [propPrompt, setPropPrompt] = useState(
    "高科技美容仪产品特写，流线型机身，玫瑰金与典雅黑配色，磨砂金属质感。机身有微亮的LED红光理疗灯阵，摆放在精致的大理石台面上，周围有极简水乳瓶衬托，高端轻奢画风。"
  );

  // Confirmation flags
  const [charConfirmed, setCharConfirmed] = useState(false);
  const [sceneConfirmed, setSceneConfirmed] = useState(false);
  const [propConfirmed, setPropConfirmed] = useState(false);

  // Model selectors
  const [charModel, setCharModel] = useState("Doubao-Seedream-5.0-Pro");
  const [sceneModel, setSceneModel] = useState("Doubao-Seedream-5.0-Pro");
  const [propModel, setPropModel] = useState("Doubao-Seedream-5.0-Pro");

  // Storyboard Stage States
  const [storyboardPrompt, setStoryboardPrompt] = useState(
    "分镜具体动作描述：整体视觉基调：明亮柔和的影调，浅景深突出主体。角色手持升级后的新款玫瑰金美容仪，贴着面部演示护肤提拉动作，眼眸含笑、姿态专业。"
  );
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderingFinished, setRenderingFinished] = useState(false);

  // Final / Comparison Stage States
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [isSyncActive, setIsSyncActive] = useState(true);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingNew, setIsPlayingNew] = useState(false);
  const [originalTime, setOriginalTime] = useState(1); // 1s out of 4s
  const [newTime, setNewTime] = useState(1);

  // Auto processing effects for the Analysis screen
  useEffect(() => {
    let interval: any;
    if (currentStep === "analyzing") {
      setPlotProgress(0);
      setCharProgress(0);
      setSceneProgress(0);
      setAnalyzingComplete(false);

      interval = setInterval(() => {
        setPlotProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.floor(Math.random() * 15 + 5);
        });
        setCharProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.floor(Math.random() * 10 + 5);
        });
        setSceneProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.floor(Math.random() * 12 + 4);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  // Check if analysis is complete to auto-forward
  useEffect(() => {
    if (currentStep === "analyzing" && plotProgress >= 100 && charProgress >= 100 && sceneProgress >= 100) {
      setPlotProgress(100);
      setCharProgress(100);
      setSceneProgress(100);
      setAnalyzingComplete(true);
      
      const timeout = setTimeout(() => {
        setCurrentStep("setting");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [plotProgress, charProgress, sceneProgress, currentStep]);

  // Storyboard simulated video render progress
  const startStoryboardRendering = () => {
    setIsRenderingVideo(true);
    setRenderProgress(0);
    setRenderingFinished(false);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRenderingVideo(false);
          setRenderingFinished(true);
          return 100;
        }
        return prev + 8;
      });
    }, 200);
  };

  // Draggable timelines
  const handleSeekOriginal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setOriginalTime(val);
    if (isSyncActive) {
      setNewTime(val);
    }
  };

  const handleSeekNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setNewTime(val);
    if (isSyncActive) {
      setOriginalTime(val);
    }
  };

  // Quick Preset Selection Helper
  const selectDemoVideo = () => {
    setUploadedVideo({
      name: "美妆仪使用误区大揭秘_示范.mp4",
      size: "24.5 MB",
      duration: "0:04"
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden text-slate-800">
      
      {/* ==================== 1. TOP HEADER NAVIGATION ==================== */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {uploadedVideo ? uploadedVideo.name.replace("_示范.mp4", "") : "新复刻项目"}
              </h1>
              <button className="text-slate-400 hover:text-slate-600">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Meta Tags */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{aspectRatio}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span>{resolution}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span>目标语言: {language}</span>
            </div>
          </div>
        </div>

        {/* TOP STEP STATUS BAR */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
          <button 
            onClick={() => { if (uploadedVideo) setCurrentStep("original"); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              currentStep === "original" 
                ? "bg-purple-600 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">1</span>
            原片
          </button>
          <div className="h-0.5 w-6 bg-slate-200" />
          <button 
            onClick={() => { if (uploadedVideo) setCurrentStep("setting"); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              currentStep === "setting" || currentStep === "analyzing"
                ? "bg-purple-600 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">2</span>
            设定
          </button>
          <div className="h-0.5 w-6 bg-slate-200" />
          <button 
            onClick={() => { if (uploadedVideo && (charConfirmed || sceneConfirmed)) setCurrentStep("storyboard"); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              currentStep === "storyboard" 
                ? "bg-purple-600 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">3</span>
            分镜
          </button>
          <div className="h-0.5 w-6 bg-slate-200" />
          <button 
            onClick={() => { if (uploadedVideo && renderingFinished) setCurrentStep("final"); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              currentStep === "final" 
                ? "bg-purple-600 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">4</span>
            视频
          </button>
        </div>

        {/* Current Available Credits Indicator */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-amber-700 font-medium text-xs">
            <span className="animate-pulse">✦</span>
            <span>可用算力: <strong className="font-mono">{credits.toFixed(0)}</strong> 点</span>
          </div>
        </div>
      </header>

      {/* ==================== 2. WORKSPACE STEPS ==================== */}
      <div className="flex-1 overflow-hidden relative">

        {/* STEP 1: ORIGINAL VIDEO SELECTION & UPLOAD */}
        {currentStep === "original" && (
          <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">创意复刻，让创意焕发新生</h2>
              <p className="text-sm text-slate-500">上传您需要转换风格、语言或人物角色的视频片断，通过 AI 大模型极速复刻整个故事片断。</p>
            </div>

            {/* Drag & Drop Container */}
            <div className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-400 p-8 flex flex-col items-center justify-center transition-all relative group shadow-xs">
              {uploadedVideo ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mx-auto">
                    <Tv className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800">{uploadedVideo.name}</p>
                    <p className="text-xs text-slate-400 mt-1">大小: {uploadedVideo.size} | 时长: {uploadedVideo.duration}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => setUploadedVideo(null)}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      重新选择
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 py-10 w-full cursor-pointer" onClick={selectDemoVideo}>
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">点击上传 或 拖拽视频文件到此区域</p>
                    <p className="text-xs text-slate-400 font-medium">
                      视频格式支持mp4/mov，大小不超过500M，时长不超过3分钟
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-purple-600 font-semibold px-3 py-1 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors">
                      <Sparkles className="w-3 h-3" />
                      使用演示样本视频: "美妆仪使用误区大揭秘.mp4"
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Parameters Controls Grid */}
            <div className="w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Language Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  语种
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-400 outline-none"
                >
                  <option value="中文">中文 (Chinese)</option>
                  <option value="English">English (英语)</option>
                  <option value="日本語">日本語 (Japanese)</option>
                  <option value="한국어">한국어 (Korean)</option>
                </select>
              </div>

              {/* Video Aspect Ratio */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Tv className="w-3 h-3 text-slate-400" />
                  视频比例
                </label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button 
                    onClick={() => setAspectRatio("9:16")}
                    className={`flex-1 text-xs py-1.5 font-bold rounded-lg transition-colors ${aspectRatio === "9:16" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    9:16 (竖屏)
                  </button>
                  <button 
                    onClick={() => setAspectRatio("16:9")}
                    className={`flex-1 text-xs py-1.5 font-bold rounded-lg transition-colors ${aspectRatio === "16:9" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    16:9 (横屏)
                  </button>
                </div>
              </div>

              {/* Resolution selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" />
                  分辨率
                </label>
                <select 
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-400 outline-none"
                >
                  <option value="720p">720p (标清)</option>
                  <option value="1080p">1080p (高清)</option>
                  <option value="4K">4K (极清大片)</option>
                </select>
              </div>
            </div>

            {/* Bottom Action button */}
            <button
              onClick={() => {
                if (!uploadedVideo) {
                  selectDemoVideo();
                }
                setCurrentStep("analyzing");
              }}
              className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/15 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-purple-200 animate-spin" />
              <span>开始智能复刻</span>
              <ChevronRight className="w-4 h-4 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: ANALYZING LOADING STEP */}
        {currentStep === "analyzing" && (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
            {/* Center animated file analyzer */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center">
                <Tv className="w-12 h-12 text-slate-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2.5 rounded-2xl shadow-md animate-bounce">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
            </div>

            <div className="text-center space-y-1.5 max-w-md">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">剧集资产解析中</h3>
              <p className="text-sm text-slate-400 font-medium">剧集资产深度建模解析中，请耐心等待...</p>
            </div>

            {/* Progress Wheels Container Card */}
            <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-8 max-w-2xl w-full grid grid-cols-3 gap-8 shadow-xs">
              {/* Plot Summary Analysis */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Outer circle progress track */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="34" className="stroke-purple-600 transition-all duration-300" strokeWidth="6" fill="none" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * Math.min(plotProgress, 100)) / 100}
                    />
                  </svg>
                  <span className="text-base font-extrabold text-slate-800 font-mono">
                    {Math.min(plotProgress, 100)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700">剧情概要解析</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{plotProgress >= 100 ? "分析完成" : "语义结构解构中..."}</p>
                </div>
              </div>

              {/* Character Analysis */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="34" className="stroke-indigo-600 transition-all duration-300" strokeWidth="6" fill="none" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * Math.min(charProgress, 100)) / 100}
                    />
                  </svg>
                  <span className="text-base font-extrabold text-slate-800 font-mono">
                    {Math.min(charProgress, 100)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700">角色解析</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{charProgress >= 100 ? "发现 1 名主角" : "面部关键点侦测中..."}</p>
                </div>
              </div>

              {/* Scene analysis */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="34" className="stroke-pink-500 transition-all duration-300" strokeWidth="6" fill="none" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * Math.min(sceneProgress, 100)) / 100}
                    />
                  </svg>
                  <span className="text-base font-extrabold text-slate-800 font-mono">
                    {Math.min(sceneProgress, 100)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700">场景解析</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sceneProgress >= 100 ? "识别：现代浴室" : "环境深度景深探测中..."}</p>
                </div>
              </div>
            </div>

            {/* Hint message & manual skip */}
            <div className="mt-8 text-center">
              <button 
                onClick={() => setCurrentStep("setting")}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100"
              >
                跳过解析动画 (直接进入设定)
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ASSET & MAPPING SETUPS */}
        {currentStep === "setting" && (
          <div className="h-full flex flex-col">
            
            {/* Attention banner */}
            <div className="bg-purple-50/60 border-b border-purple-100/50 px-6 py-2.5 flex items-center justify-between text-xs text-purple-700 font-semibold">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>请完成新旧角色、场景、和道具映射关系；确认替换关系后，系统将自动对原视频进行智能切片并提取关键帧对应，用于后续分镜生成。</span>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT SIDE PANEL: TABS & ASSETS LIST */}
              <div className="w-80 border-r border-slate-100 flex flex-col justify-between bg-white flex-shrink-0">
                <div className="p-4 space-y-4">
                  {/* Category sub-tabs */}
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button 
                      onClick={() => setActiveSetupTab("character")}
                      className={`flex-1 text-xs py-2 font-bold rounded-lg ${activeSetupTab === "character" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      角色 {charConfirmed && "✓"}
                    </button>
                    <button 
                      onClick={() => setActiveSetupTab("scene")}
                      className={`flex-1 text-xs py-2 font-bold rounded-lg ${activeSetupTab === "scene" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      场景 {sceneConfirmed && "✓"}
                    </button>
                    <button 
                      onClick={() => setActiveSetupTab("prop")}
                      className={`flex-1 text-xs py-2 font-bold rounded-lg ${activeSetupTab === "prop" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      道具 {propConfirmed && "✓"}
                    </button>
                  </div>

                  {/* Dynamic parsed list */}
                  <div className="space-y-3">
                    {activeSetupTab === "character" && (
                      <div className={`p-3 rounded-xl border transition-all ${charConfirmed ? "border-purple-200 bg-purple-50/20" : "border-slate-100 bg-white"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{characterName}</span>
                          <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">原视频角色</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="relative rounded-lg overflow-hidden border border-slate-100 aspect-square bg-slate-50">
                            <img src={ORIGINAL_CHARACTER_IMG} alt="Original character" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">原片</span>
                          </div>
                          <div className="relative rounded-lg overflow-hidden border border-purple-100 aspect-square bg-slate-50">
                            <img src={NEW_CHARACTER_IMG} alt="New character" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] px-1 rounded font-bold">新制形象</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">映射状态: {charConfirmed ? "已确认映射" : "待配置确认"}</span>
                          <button 
                            onClick={() => setCharConfirmed(!charConfirmed)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${charConfirmed ? "bg-purple-100 text-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                          >
                            {charConfirmed ? "取消映射" : "确认映射"}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeSetupTab === "scene" && (
                      <div className={`p-3 rounded-xl border transition-all ${sceneConfirmed ? "border-purple-200 bg-purple-50/20" : "border-slate-100 bg-white"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{sceneName}</span>
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">原视频场景</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="relative rounded-lg overflow-hidden border border-slate-100 aspect-square bg-slate-50">
                            <img src={ORIGINAL_SCENE_IMG} alt="Original Scene" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">原片</span>
                          </div>
                          <div className="relative rounded-lg overflow-hidden border border-purple-100 aspect-square bg-slate-50">
                            <img src={NEW_SCENE_IMG} alt="New Scene" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] px-1 rounded font-bold">重塑场景</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">映射状态: {sceneConfirmed ? "已确认替换" : "待配置确认"}</span>
                          <button 
                            onClick={() => setSceneConfirmed(!sceneConfirmed)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${sceneConfirmed ? "bg-purple-100 text-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                          >
                            {sceneConfirmed ? "取消映射" : "确认映射"}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeSetupTab === "prop" && (
                      <div className={`p-3 rounded-xl border transition-all ${propConfirmed ? "border-purple-200 bg-purple-50/20" : "border-slate-100 bg-white"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{propName}</span>
                          <span className="text-[10px] font-bold bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded">原视频道具</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="relative rounded-lg overflow-hidden border border-slate-100 aspect-square bg-slate-50">
                            <img src={ORIGINAL_PROP_IMG} alt="Original Prop" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">原片</span>
                          </div>
                          <div className="relative rounded-lg overflow-hidden border border-purple-100 aspect-square bg-slate-50">
                            <img src={NEW_PROP_IMG} alt="New Prop" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] px-1 rounded font-bold">重设道具</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">映射状态: {propConfirmed ? "已确认替换" : "待配置确认"}</span>
                          <button 
                            onClick={() => setPropConfirmed(!propConfirmed)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${propConfirmed ? "bg-purple-100 text-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                          >
                            {propConfirmed ? "取消映射" : "确认映射"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Bottom Section: "Next Step" Button */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <button 
                    onClick={() => {
                      // Mark all confirmed for continuous UX flow
                      setCharConfirmed(true);
                      setSceneConfirmed(true);
                      setPropConfirmed(true);
                      setCurrentStep("storyboard");
                    }}
                    className="w-full bg-slate-900 hover:bg-black text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Scissors className="w-4 h-4 text-purple-400" />
                    <span>智能切片进入下一步</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE PANEL: GENERATE & UPDATE DETAILS */}
              <div className="flex-1 bg-white overflow-y-auto p-6 flex flex-col space-y-6">
                
                {/* Active settings form container */}
                {activeSetupTab === "character" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={characterName} 
                          onChange={(e) => setCharacterName(e.target.value)}
                          className="text-lg font-extrabold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none px-1 py-0.5" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-3 py-2 rounded-xl transition-all">
                          + 添加变装
                        </button>
                        <button 
                          onClick={() => setCharConfirmed(!charConfirmed)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${charConfirmed ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-purple-600 text-white shadow-md hover:bg-purple-700"}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{charConfirmed ? "已确认映射角色" : "确认当前映射角色"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Character Three view Image block */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-slate-100 rounded-2xl overflow-hidden aspect-video relative bg-slate-50 col-span-2">
                        <img src={NEW_CHARACTER_IMG} alt="Three view frontal" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          正面形象 / Upper Half
                        </span>
                      </div>
                      <div className="border border-slate-100 rounded-2xl overflow-hidden aspect-square relative bg-slate-50">
                        <img src={NEW_CHARACTER_3VIEW_IMG} alt="Three view sheet" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          全身三视图
                        </span>
                      </div>
                    </div>

                    {/* Agent Character Generation console */}
                    <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        Agent 智能形象模型生成
                      </h4>

                      {/* Text prompt */}
                      <textarea 
                        value={characterPrompt}
                        onChange={(e) => setCharacterPrompt(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-2xs"
                      />

                      {/* Models & cost parameters */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          {/* Model choice */}
                          <select 
                            value={charModel}
                            onChange={(e) => setCharModel(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none"
                          >
                            <option value="Doubao-Seedream-5.0-Pro">Doubao-Seedream-5.0-Pro</option>
                            <option value="Gemini-2.5-Flash">Gemini-2.5-Flash</option>
                            <option value="SD-Ultra-Realistic">SDXL Ultra Realistic</option>
                          </select>

                          {/* Image amount */}
                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1 张</option>
                            <option>2 张</option>
                            <option>4 张</option>
                          </select>

                          {/* Resol */}
                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1K</option>
                            <option>2K</option>
                          </select>
                        </div>

                        {/* Generative triggers */}
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1 transition-colors">
                            <ListFilter className="w-3 h-3" />
                            智能优化
                          </button>
                          
                          <button 
                            onClick={() => {
                              alert("AI形象重绘已提交。花费算力点: 30点");
                              setCharConfirmed(true);
                            }}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <span>生成</span>
                            <span className="font-mono text-[10px] bg-purple-500 px-1 rounded">✦ 30</span>
                          </button>
                        </div>
                      </div>

                      {/* Manual uploads */}
                      <div className="flex items-center gap-3 pt-3 border-t border-slate-200/50 justify-end text-xs font-bold text-slate-500">
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          从形象库选择
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          本地上传三视图
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSetupTab === "scene" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={sceneName} 
                          onChange={(e) => setSceneName(e.target.value)}
                          className="text-lg font-extrabold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none px-1 py-0.5 w-full max-w-sm" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSceneConfirmed(!sceneConfirmed)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sceneConfirmed ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-purple-600 text-white shadow-md hover:bg-purple-700"}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{sceneConfirmed ? "已确认映射场景" : "确认当前映射场景"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Scene view image */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden aspect-video relative bg-slate-50">
                      <img src={NEW_SCENE_IMG} alt="Scene landscape" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        新重塑高档浴室场景
                      </span>
                    </div>

                    {/* Agent Scene Generation controls */}
                    <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        Agent 智能场景重塑生成
                      </h4>

                      <textarea 
                        value={scenePrompt}
                        onChange={(e) => setScenePrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-2xs"
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <select 
                            value={sceneModel}
                            onChange={(e) => setSceneModel(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none"
                          >
                            <option value="Doubao-Seedream-5.0-Pro">Doubao-Seedream-5.0-Pro</option>
                            <option value="SDXL-Ultra">SDXL-Ultra</option>
                          </select>

                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1 张</option>
                            <option>2 张</option>
                            <option>4 张</option>
                          </select>

                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1K分辨率</option>
                            <option>2K分辨率</option>
                            <option>4K分辨率</option>
                          </select>
                        </div>

                        {/* Generative triggers */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => alert("场景提示词智能优化已完成！")}
                            className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1 transition-colors"
                          >
                            <ListFilter className="w-3 h-3" />
                            智能优化
                          </button>
                          
                          <button 
                            onClick={() => {
                              alert("场景重构生成已提交。花费算力点: 30点");
                              setSceneConfirmed(true);
                            }}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <span>生成场景</span>
                            <span className="font-mono text-[10px] bg-purple-500 px-1 rounded">✦ 30</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-slate-200/50 justify-end text-xs font-bold text-slate-500">
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          从场景库选择
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          本地上传背景图
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSetupTab === "prop" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={propName} 
                          onChange={(e) => setPropName(e.target.value)}
                          className="text-lg font-extrabold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none px-1 py-0.5 w-full max-w-sm" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPropConfirmed(!propConfirmed)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${propConfirmed ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-purple-600 text-white shadow-md hover:bg-purple-700"}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{propConfirmed ? "已确认道具材质" : "确认当前道具材质"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Prop view image */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden aspect-video relative bg-slate-50 flex items-center justify-center">
                      <img src={NEW_PROP_IMG} alt="Prop modeling" className="max-h-80 w-full object-contain" />
                      <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        新重塑 3D 品牌美容仪道具 (玫瑰金版)
                      </span>
                    </div>

                    {/* Agent Prop Generation controls */}
                    <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        Agent 智能道具精模重构
                      </h4>

                      <textarea 
                        value={propPrompt}
                        onChange={(e) => setPropPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-2xs"
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <select 
                            value={propModel}
                            onChange={(e) => setPropModel(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none"
                          >
                            <option value="Doubao-Seedream-5.0-Pro">Doubao-Seedream-5.0-Pro</option>
                            <option value="PropMesh-3D-v2">PropMesh-3D-v2 (专业三维)</option>
                          </select>

                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1 张</option>
                            <option>2 张</option>
                            <option>4 张</option>
                          </select>

                          <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none">
                            <option>1K分辨率</option>
                            <option>2K分辨率</option>
                            <option>4K分辨率</option>
                          </select>
                        </div>

                        {/* Generative triggers */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => alert("道具提示词智能优化已完成！")}
                            className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1 transition-colors"
                          >
                            <ListFilter className="w-3 h-3" />
                            智能优化
                          </button>
                          
                          <button 
                            onClick={() => {
                              alert("道具重塑生成已经提交。花费算力点: 30点");
                              setPropConfirmed(true);
                            }}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <span>生成道具</span>
                            <span className="font-mono text-[10px] bg-purple-500 px-1 rounded">✦ 30</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-slate-200/50 justify-end text-xs font-bold text-slate-500">
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          从道具库选择
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="hover:text-purple-600 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          本地上传道具实拍
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* STEP 4: STORYBOARD/SCRIPT COMPOSITION */}
        {currentStep === "storyboard" && (
          <div className="h-full flex overflow-hidden">
            
            {/* 1. LEFT MATERIAL DRAWER */}
            <div className="w-64 border-r border-slate-100 bg-white p-4 flex flex-col space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">全部素材库</span>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">解析切片 3</span>
              </div>

              {/* Characters Asset Category */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">角色形象</span>
                <div className="p-2 border border-purple-100 rounded-xl flex items-center gap-2 bg-purple-50/10">
                  <img src={NEW_CHARACTER_IMG} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{characterName}</p>
                    <p className="text-[9px] text-slate-400">已映射新形象</p>
                  </div>
                </div>
              </div>

              {/* Scenes Asset Category */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">环境场景</span>
                <div className="p-2 border border-slate-100 rounded-xl flex items-center gap-2">
                  <img src={NEW_SCENE_IMG} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{sceneName}</p>
                    <p className="text-[9px] text-slate-400">浴室重构</p>
                  </div>
                </div>
              </div>

              {/* Props Asset Category */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">交互道具</span>
                <div className="p-2 border border-slate-100 rounded-xl flex items-center gap-2">
                  <img src={NEW_PROP_IMG} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{propName}</p>
                    <p className="text-[9px] text-slate-400">美容仪精模</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setCurrentStep("setting")}
                  className="text-xs text-purple-600 hover:text-purple-700 font-bold bg-purple-50 w-full py-2 rounded-xl border border-purple-100"
                >
                  返回调整解析资产
                </button>
              </div>
            </div>

            {/* 2. MIDDLE STORYBOARD DETAILS EDITOR */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto border-r border-slate-100 bg-white">
              <div className="p-6 space-y-6">
                
                {/* Storyboard title & description mapping */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">SHOT 01</span>
                      <h3 className="text-base font-extrabold text-slate-800">分镜第 1 镜 (一镜到底/核心切片)</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">时长: 4秒</span>
                  </div>

                  {/* Character/scene map chips */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-purple-100">
                      👤 {characterName}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-indigo-100">
                      📍 {sceneName}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-pink-100">
                      ⚡ {propName}
                    </span>
                  </div>
                </div>

                {/* Keyframe Slots Area */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Slot 1: Original video extracted frame */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">原片参考关键帧</span>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-100">
                      <img src={ORIGINAL_CHARACTER_IMG} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] text-slate-500 text-center font-mono">美妆仪原视频 00:01s</p>
                  </div>

                  {/* Slot 2: Generated storyboard representation */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">复刻分镜风格预览</span>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-100 bg-white flex items-center justify-center">
                      <img src={NEW_CHARACTER_IMG} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] text-slate-500 text-center font-mono">写实通用 AIGC 模型绘制</p>
                  </div>
                </div>

                {/* Storyboard prompt description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">分镜具体动作脚本描述</label>
                  <textarea 
                    value={storyboardPrompt}
                    onChange={(e) => setStoryboardPrompt(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Video Generation Advanced Controls */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">视频生成参数设置</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">生成大模型</span>
                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-600 outline-none w-full">
                        <option>Doubao-Seedream-2-0</option>
                        <option>Luma-Dream-Machine</option>
                        <option>Sora-Turbo</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">视频时长</span>
                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-600 outline-none w-full">
                        <option>4 秒</option>
                        <option>8 秒</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">生成分辨率</span>
                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-600 outline-none w-full">
                        <option>720p (快)</option>
                        <option>1080p</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">采样步数比例</span>
                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-600 outline-none w-full">
                        <option>1x</option>
                        <option>2x (高算力)</option>
                      </select>
                    </div>
                  </div>

                  {/* Rendering actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/50">
                    <span className="text-[11px] text-slate-400">消耗算力值: <strong>600 点</strong></span>
                    
                    {isRenderingVideo ? (
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-purple-600 font-bold flex items-center gap-1 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          视频拼剪渲染中 ({renderProgress}%)
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={startStoryboardRendering}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm shadow-purple-500/10 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                        <span>开始单镜视频生成</span>
                        <span className="font-mono text-[9px] bg-purple-500 px-1 rounded">✦ 600</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Storyboards Timeline Panel at bottom */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">分镜时间线</span>
                <div className="flex items-center gap-3">
                  {/* Storyboard shot cell */}
                  <div className="relative border-2 border-purple-500 bg-white p-1 rounded-lg w-28 text-left cursor-pointer flex-shrink-0">
                    <div className="aspect-video w-full rounded overflow-hidden">
                      <img src={NEW_CHARACTER_IMG} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between mt-1 px-0.5">
                      <span className="text-[10px] font-bold text-slate-700">分镜 01</span>
                      <span className="text-[9px] font-mono text-slate-400">4s</span>
                    </div>
                  </div>

                  {/* Add shot placeholder */}
                  <button className="border border-dashed border-slate-200 hover:border-purple-300 w-28 aspect-video rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 bg-white transition-colors">
                    <Plus className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold">追加分镜</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. RIGHT VIDEO PREVIEW & DISPATCH */}
            <div className="w-80 p-4 bg-slate-50 flex flex-col justify-between flex-shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">分镜生成效果预览</span>
                  <span className="text-[10px] font-mono bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">最终产出</span>
                </div>

                {/* Video playback window */}
                <div className="bg-black rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-center items-center shadow-lg border border-slate-800">
                  {renderingFinished ? (
                    <>
                      {/* Placeholder premium video simulation */}
                      <img src={NEW_CHARACTER_IMG} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center hover:scale-105 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                      </div>
                    </>
                  ) : isRenderingVideo ? (
                    <div className="p-4 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-purple-300">GPU云渲染合成中... {renderProgress}%</p>
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <Play className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">请点击左侧 “开始单镜视频生成”</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>映射和音轨同步校验成功</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    系统已自动对角色A原声进行了语音克隆和语速适应。在最终复刻生成的视频中，原视频的语气与新目标语种将完美吻合。
                  </p>
                </div>
              </div>

              {/* Enter final compare step */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setRenderingFinished(true);
                    setCurrentStep("final");
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>渲染完整影片并对比视频</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex justify-between text-[10px] text-slate-400 px-1 font-medium">
                  <button className="hover:text-purple-600 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    重新切片解析
                  </button>
                  <button className="hover:text-purple-600">
                    批量渲染全部镜头
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 5: FINAL VIDEO RECONSTRUCTION & COMPARISON */}
        {currentStep === "final" && (
          <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
            
            {/* Light theme Comparison top bar */}
            <div className="bg-white px-6 py-3 flex items-center justify-between text-slate-700 border-b border-slate-200/60">
              <span className="text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>恭喜您，创意复刻视频已全线渲染完毕！</span>
              </span>
 
              {/* Toggles */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span>对比视频</span>
                  <button 
                    onClick={() => setCompareEnabled(!compareEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${compareEnabled ? "bg-purple-600" : "bg-slate-200"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${compareEnabled ? "translate-x-5.5" : "translate-x-1"}`} />
                  </button>
                </div>
 
                <div className="flex items-center gap-2">
                  <span>同步时间轴</span>
                  <button 
                    onClick={() => setIsSyncActive(!isSyncActive)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${isSyncActive ? "bg-purple-600" : "bg-slate-200"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isSyncActive ? "translate-x-5.5" : "translate-x-1"}`} />
                  </button>
                </div>
 
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>导出剪映</span>
                </button>
 
                <button 
                  onClick={() => alert("原视频和新复刻视频合成文件已加入本地下载队列。")}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>下载</span>
                </button>
              </div>
            </div>
 
            {/* Main Video players frame */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
              
              {/* Compare Players Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch">
                
                {/* 1. ORIGINAL VIDEO PLAYER */}
                {compareEnabled && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                        原视频 / Original Spot
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">时长: 04s | 比例 9:16</span>
                    </div>
 
                    {/* Original video placeholder box */}
                    <div className="relative bg-slate-100 rounded-xl overflow-hidden flex-1 min-h-[220px] flex items-center justify-center">
                      <img src={ORIGINAL_CHARACTER_IMG} alt="Original Actor clip" className="h-full w-full object-cover max-h-[300px]" />
                      
                      {/* Dynamic watermarks */}
                      <span className="absolute top-4 left-4 bg-red-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        原
                      </span>
 
                      {/* Video Center Control Button */}
                      <button 
                        onClick={() => setIsPlayingOriginal(!isPlayingOriginal)}
                        className="absolute w-14 h-14 rounded-full bg-white/90 text-slate-800 hover:bg-white flex items-center justify-center backdrop-blur-xs hover:scale-105 transition-transform shadow-lg"
                      >
                        {isPlayingOriginal ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                      </button>
                    </div>
 
                    {/* Original bottom controls */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>00:0{originalTime.toFixed(0)} / 00:04</span>
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 hover:text-slate-700 cursor-pointer text-slate-400" />
                          <span className="text-slate-400">1x</span>
                          <Download className="w-4 h-4 hover:text-slate-700 cursor-pointer text-slate-400" />
                        </div>
                      </div>
 
                      {/* Drag seeker */}
                      <input 
                        type="range" 
                        min="1" 
                        max="4" 
                        step="1"
                        value={originalTime}
                        onChange={handleSeekOriginal}
                        className="w-full accent-purple-500 cursor-pointer" 
                      />
 
                      {/* Video Keyframes Strip */}
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 grid grid-cols-4 gap-1">
                        <img src={ORIGINAL_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                        <img src={ORIGINAL_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80 border border-purple-500" />
                        <img src={ORIGINAL_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                        <img src={ORIGINAL_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                      </div>
                    </div>
                  </div>
                )}
 
                {/* 2. NEWLY RECONSTRUCTED VIDEO PLAYER */}
                <div className={`bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3 shadow-md ${!compareEnabled ? "col-span-2" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                        新复刻智能视频 / Generated AIGC
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">写实通用 · 语言: 中文</span>
                  </div>
 
                  {/* New video placeholder box */}
                  <div className="relative bg-slate-100 rounded-xl overflow-hidden flex-1 min-h-[220px] flex items-center justify-center">
                    <img src={NEW_CHARACTER_IMG} alt="New Actor clip" className="h-full w-full object-cover max-h-[300px]" />
                    
                    <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono shadow-md">
                      新 (SHOT 1)
                    </span>
 
                    {/* Video Center Control Button */}
                    <button 
                      onClick={() => setIsPlayingNew(!isPlayingNew)}
                      className="absolute w-14 h-14 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center backdrop-blur-xs hover:scale-105 transition-transform shadow-lg shadow-purple-600/20"
                    >
                      {isPlayingNew ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>
                  </div>
 
                  {/* New bottom controls */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>00:0{newTime.toFixed(0)} / 00:04</span>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 hover:text-slate-700 cursor-pointer text-slate-400" />
                        <span className="text-slate-400">1x</span>
                        <Download className="w-4 h-4 hover:text-slate-700 cursor-pointer text-slate-400" />
                      </div>
                    </div>
 
                    {/* Drag seeker */}
                    <input 
                      type="range" 
                      min="1" 
                      max="4" 
                      step="1"
                      value={newTime}
                      onChange={handleSeekNew}
                      className="w-full accent-purple-500 cursor-pointer" 
                    />
 
                    {/* Generated Video Keyframes Strip */}
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 grid grid-cols-4 gap-1">
                      <img src={NEW_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                      <img src={NEW_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80 border border-purple-500" />
                      <img src={NEW_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                      <img src={NEW_CHARACTER_IMG} className="w-full aspect-video object-cover rounded opacity-80" />
                    </div>
                  </div>
                </div>
 
              </div>
 
              {/* Bottom Quick Return Action */}
              <div className="text-center">
                <button 
                  onClick={() => setCurrentStep("storyboard")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all"
                >
                  返回分镜时间线继续微调
                </button>
              </div>
 
            </div>
 
          </div>
        )}

      </div>

    </div>
  );
}
