import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  Play, 
  Check, 
  Loader2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Save, 
  ExternalLink, 
  History, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  Info, 
  Video, 
  UserCheck, 
  FileVideo,
  ChevronLeft,
  X,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { Asset, Task, CreditTransaction } from "../types";

interface FissionViewProps {
  onBack: () => void;
  onAddTask: (type: "fission", name: string, inputFiles: string[], creditsCost: number) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
  credits: number;
}

interface HotMaterial {
  id: string;
  title: string;
  creativeId: string;
  coverUrl: string;
  cost: number;
  clickRate: number;
  cvRate: number;
  status: "unfissioned" | "fissioned";
}

export interface AvatarInfo {
  id: string;
  fullName: string;
  displayName: string;
  category: string;
  imageUrl: string;
  recommendedVoice: string;
}

export const AVATARS: AvatarInfo[] = [
  {
    id: "mizhuang",
    fullName: "主播小美 (美妆日化)",
    displayName: "主播小美",
    category: "美妆日化",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "热情高亢 (带货爆款)"
  },
  {
    id: "shuma",
    fullName: "主播小帅 (数码电器)",
    displayName: "主播小帅",
    category: "数码电器",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "富有磁性 (极简测评)"
  },
  {
    id: "shishang",
    fullName: "外籍女模莉萨 (鞋履时尚)",
    displayName: "外籍女模莉萨",
    category: "鞋履时尚",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "热情高亢 (带货爆款)"
  },
  {
    id: "baihuo",
    fullName: "幽默阿强 (日用百货)",
    displayName: "幽默阿强",
    category: "日用百货",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "睿智诚恳 (家电对比)"
  },
  {
    id: "jiaoyu",
    fullName: "知性小雅 (图书教育)",
    displayName: "知性小雅",
    category: "图书教育",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "温柔亲和 (好物种草)"
  },
  {
    id: "jianshen",
    fullName: "动感阳阳 (运动健身)",
    displayName: "动感阳阳",
    category: "运动健身",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "热情高亢 (带货爆款)"
  },
  {
    id: "shoushi",
    fullName: "优雅丽人 (奢侈首饰)",
    displayName: "优雅丽人",
    category: "奢侈首饰",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "温柔亲和 (好物种草)"
  },
  {
    id: "shipin",
    fullName: "亲民大妈 (生鲜食品)",
    displayName: "亲民大妈",
    category: "生鲜食品",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&q=80",
    recommendedVoice: "热情高亢 (带货爆款)"
  }
];

export default function FissionView({
  onBack,
  onAddTask,
  onOpenMaterialSelector,
  credits
}: FissionViewProps) {
  // Mock source high-performing materials
  const INITIAL_HOT_MATERIALS: HotMaterial[] = [
    {
      id: "hm_1",
      title: "M1101-260708-满小饱-wx梅干菜锅盔-香酥脆爽",
      creativeId: "7660259312963829823",
      coverUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=80",
      cost: 10000,
      clickRate: 2.34,
      cvRate: 1.85,
      status: "unfissioned"
    },
    {
      id: "hm_2",
      title: "7644178503204667427-卡皮巴拉解压毛绒玩具-爆款展示",
      creativeId: "7644178503204667427",
      coverUrl: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=300&auto=format&fit=crop&q=80",
      cost: 6504,
      clickRate: 1.92,
      cvRate: 1.48,
      status: "unfissioned"
    },
    {
      id: "hm_3",
      title: "ZC护心油-宠物狗猫营养保健品日常安利视频",
      creativeId: "7610264742570459174",
      coverUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80",
      cost: 4971,
      clickRate: 3.12,
      cvRate: 2.14,
      status: "unfissioned"
    },
    {
      id: "hm_4",
      title: "3.3这个直播间便宜lxr.mp4-美妆好物展示推荐",
      creativeId: "7477543006532272162",
      coverUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80",
      cost: 3412,
      clickRate: 2.56,
      cvRate: 1.92,
      status: "unfissioned"
    },
    {
      id: "hm_5",
      title: "7月8日-zsj-汤面拼2.mp4-鲜美多汁螺蛳粉吃播",
      creativeId: "7660028986342195227",
      coverUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80",
      cost: 2777,
      clickRate: 2.15,
      cvRate: 1.62,
      status: "unfissioned"
    }
  ];

  const [hotMaterials, setHotMaterials] = useState<HotMaterial[]>(INITIAL_HOT_MATERIALS);
  const [selectedMaterial, setSelectedMaterial] = useState<HotMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnfissionedOnly, setFilterUnfissionedOnly] = useState(false);
  const [timeRange, setTimeRange] = useState<"1" | "7" | "30">("30");
  
  // App view navigation and progress
  const [currentStage, setCurrentStage] = useState<"tutorial" | "settings" | "generating" | "results">("tutorial");
  const [generationProgress, setGenerationProgress] = useState(0);

  // Settings config states
  const [useDigitalHuman, setUseDigitalHuman] = useState(true);
  const [digitalAvatar, setDigitalAvatar] = useState("主播小美 (美妆日化)");
  const [digitalVoice, setDigitalVoice] = useState("热情高亢 (带货爆款)");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [replenishMaterials, setReplenishMaterials] = useState<string[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [hasAuthorized, setHasAuthorized] = useState(true);

  // Results page states
  const [taskName, setTaskName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [fissionResults, setFissionResults] = useState<any[]>([]);
  const [selectedResults, setSelectedResults] = useState<Record<string, boolean>>({});
  const [activePreviewVideo, setActivePreviewVideo] = useState<string | null>(null);

  // Filter materials list
  const filteredMaterials = hotMaterials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.creativeId.includes(searchQuery);
    const matchesUnfissioned = filterUnfissionedOnly ? item.status === "unfissioned" : true;
    return matchesSearch && matchesUnfissioned;
  });

  // Handle choosing a material for Fission Settings
  const handleSelectForFission = (material: HotMaterial) => {
    setSelectedMaterial(material);
    setCurrentStage("settings");
    // Auto populate suggestion / state
    setReplenishMaterials([]);
  };

  // Open asset selector to replenish raw materials
  const handleAddReplenishMaterial = () => {
    onOpenMaterialSelector((urls) => {
      setReplenishMaterials([...replenishMaterials, ...urls]);
    });
  };

  const handleRemoveReplenishMaterial = (index: number) => {
    setReplenishMaterials(replenishMaterials.filter((_, i) => i !== index));
  };

  // Launch the Fission AIGC generation process
  const handleStartFission = () => {
    if (!hasAuthorized) {
      alert("请仔细阅读并勾选承诺遵守《授权声明》，以确保合法合规使用。");
      return;
    }

    const cost = 12.0; // Fission cost 12 credits
    if (credits < cost) {
      alert("您的算力积分余额不足，请在可用积分中心充值或兑换卡密！");
      return;
    }

    // Prepare metadata
    const now = new Date();
    const formattedDate = now.toISOString().replace("T", " ").slice(0, 16);
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth()+1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0') + "_" + 
                    now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0');
    
    const newTaskName = `爆款裂变_${dateStr}`;
    const newTaskId = Math.floor(100000000 + Math.random() * 900000000).toString();

    setTaskName(newTaskName);
    setTaskId(newTaskId);

    // Trigger task adding globally so it runs in background queue as well
    onAddTask(
      "fission",
      `爆款裂变: ${selectedMaterial?.title.slice(0, 15)}...`,
      selectedMaterial ? [selectedMaterial.coverUrl, ...replenishMaterials] : replenishMaterials,
      cost
    );

    // Switch screen to generating progress
    setCurrentStage("generating");
    setGenerationProgress(0);
  };

  // Simulated local rendering ticks
  useEffect(() => {
    if (currentStage !== "generating") return;

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto transition to results view with mock variants
          generateMockVariants();
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 400);

    return () => clearInterval(interval);
  }, [currentStage]);

  // Generate beautiful variations based on chosen material
  const generateMockVariants = () => {
    const strategyTypes = [
      { tag: "智能裂变", strategy: "首帧动态扩写，AI语音声调微调" },
      { tag: "前贴扩写", strategy: "前3秒黄金片段融合，重构爆款前言" },
      { tag: "人物替换", strategy: "AI真人主播片段替换，高保真数字人唇形对齐" },
      { tag: "爆款开头", strategy: "添加大字吸睛贴纸，提高视频完播率" },
      { tag: "背景切换", strategy: "融合3D赛博朋克展厅，实现高端商用场景重塑" },
      { tag: "卖点高亮", strategy: "特写分镜插帧，强化产品卖点" }
    ];

    // Mock high quality results
    const urls = [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80"
    ];

    const results = Array.from({ length: 8 }).map((_, i) => {
      const idx = i % strategyTypes.length;
      const strategy = strategyTypes[idx];
      const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4";
      
      return {
        id: `f_res_${Date.now()}_${i}`,
        title: `哇塞！新出的极速爆款【${selectedMaterial?.title.slice(0, 10)}】衍生版本_${i+1}`,
        tag: strategy.tag,
        strategyDesc: strategy.strategy,
        coverUrl: urls[i] || selectedMaterial?.coverUrl,
        videoUrl: videoUrl,
        size: `${(Math.random() * 20 + 40).toFixed(2)} MB`,
        duration: `00:${Math.floor(Math.random() * 20 + 25)}`,
        checked: true
      };
    });

    setFissionResults(results);
    
    // Default all selected
    const initialSelection: Record<string, boolean> = {};
    results.forEach(r => {
      initialSelection[r.id] = true;
    });
    setSelectedResults(initialSelection);

    // Update the source material status to Fissioned
    if (selectedMaterial) {
      setHotMaterials(prev => 
        prev.map(m => m.id === selectedMaterial.id ? { ...m, status: "fissioned" } : m)
      );
    }

    setCurrentStage("results");
  };

  // Toggle selection state for results
  const toggleSelectResult = (id: string) => {
    setSelectedResults(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    const allChecked = Object.values(selectedResults).every(v => v);
    const updated: Record<string, boolean> = {};
    fissionResults.forEach(r => {
      updated[r.id] = !allChecked;
    });
    setSelectedResults(updated);
  };

  const getSelectedCount = () => {
    return Object.values(selectedResults).filter(v => v).length;
  };

  // Handlers for Save / Download Actions
  const handleDownloadSingle = (title: string) => {
    alert(`【下载成功】视频“${title}”已开始极速下载，并保存至您的本地浏览器。`);
  };

  const handleSaveSingleToAd = (title: string) => {
    alert(`【一键保存】已成功将视频“${title}”推送同步保存至您的投放广告主媒体库中。`);
  };

  const handleBatchDownload = () => {
    const count = getSelectedCount();
    if (count === 0) {
      alert("请至少选择一个裂变后视频！");
      return;
    }
    alert(`【批量下载成功】系统已为您自动打包 ${count} 个高清裂变视频，正在后台传输下载中。`);
  };

  const handleBatchSaveToAd = () => {
    const count = getSelectedCount();
    if (count === 0) {
      alert("请至少选择一个裂变后视频！");
      return;
    }
    alert(`【同步投放成功】已为您成功将选中的 ${count} 个爆款裂变视频一键推送保存至绑定的广告账户素材中心。`);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
      
      {/* View Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentStage !== "tutorial") {
                setCurrentStage("tutorial");
              } else {
                onBack();
              }
            }}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              爆款裂变
              <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                VIRAL FISSION v2.0
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">自动识别爆款内容，批量重组裂变衍生高投消新素材</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              alert("已开启智能排队优化机制，裂变视频将调用多节点GPU算力加速渲染。");
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>历史任务</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Accounts and Hot Materials (4 cols in concept, styled as flex sidebar) */}
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 overflow-y-auto">
          
          <div className="p-4 border-b border-slate-100 space-y-3.5">
            {/* Account Selector Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">投放账户</label>
              <select className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>全部投放账户 (3个已关联)</option>
                <option>半轮x盐津铺子专用户</option>
                <option>牧唐数码核心运营户</option>
                <option>美妆时尚推流总账户</option>
              </select>
            </div>

            {/* Time filter */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setTimeRange("1")}
                className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition-all ${
                  timeRange === "1" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                近 1 天在投
              </button>
              <button
                onClick={() => setTimeRange("7")}
                className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition-all ${
                  timeRange === "7" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                近 7 天在投
              </button>
              <button
                onClick={() => setTimeRange("30")}
                className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition-all ${
                  timeRange === "30" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                近 30 天消耗
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索视频名或素材ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter Toggle Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterUnfissionedOnly}
                onChange={(e) => setFilterUnfissionedOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 border-slate-300 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-semibold text-slate-600">仅展示未裂变素材</span>
            </label>
          </div>

          {/* List of High-performing Materials */}
          <div className="flex-1 p-3 space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 tracking-wider px-1 uppercase flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-500 animate-pulse" />
              <span>发现爆款素材 ({filteredMaterials.length})</span>
            </h3>

            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-1 bg-slate-50/55 rounded-2xl border border-dashed border-slate-100">
                <p className="text-xs font-semibold text-slate-400">未找到相匹配的爆款视频</p>
                <p className="text-[10px] text-slate-300">可以尝试切换在投时长或清除过滤条件</p>
              </div>
            ) : (
              filteredMaterials.map((item) => {
                const isSelected = selectedMaterial?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMaterial(item);
                      if (currentStage === "tutorial") {
                        handleSelectForFission(item);
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-3.5 ${
                      isSelected 
                        ? "bg-purple-50/50 border-purple-200 ring-2 ring-purple-100" 
                        : "bg-white hover:bg-slate-50 border-slate-200/75 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail wrapper */}
                      <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden relative flex-shrink-0 border border-slate-100">
                        <img 
                          src={item.coverUrl} 
                          alt="Cover" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center">
                            <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            {item.status === "fissioned" ? "已裂变" : "新爆款"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-mono">ID: {item.creativeId}</p>
                      </div>
                    </div>

                    {/* Metrics grid and trigger */}
                    <div className="bg-slate-50 rounded-xl p-2.5 grid grid-cols-3 gap-1 text-center border border-slate-100">
                      <div>
                        <p className="text-[9px] text-slate-400">累计消耗</p>
                        <p className="text-[11px] font-extrabold text-slate-700 font-mono">¥{item.cost >= 10000 ? `${(item.cost/10000).toFixed(0)}w` : item.cost}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">点击率</p>
                        <p className="text-[11px] font-extrabold text-slate-700 font-mono">{item.clickRate ? `${item.clickRate}%` : "--"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">转化率</p>
                        <p className="text-[11px] font-extrabold text-slate-700 font-mono">{item.cvRate ? `${item.cvRate}%` : "--"}</p>
                      </div>
                    </div>

                    {/* Fission trigger button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectForFission(item);
                      }}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black rounded-xl transition-all shadow-md shadow-purple-600/10 cursor-pointer text-center"
                    >
                      帮我裂变
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right workspace panel (changes according to state: tutorial, settings, generating, results) */}
        <section className="flex-1 bg-slate-100/40 p-6 overflow-y-auto flex flex-col min-w-0">
          
          {/* STAGE 1: TUTORIAL GREETING */}
          {currentStage === "tutorial" && (
            <div className="max-w-4xl mx-auto space-y-6 w-full py-2 animate-fade-in">
              {/* Main Banner */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex gap-4 items-start shadow-xs relative overflow-hidden">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 z-10">
                  <h2 className="text-base font-extrabold text-slate-800">Hi, 欢迎来到爆款裂变!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    在左侧系统已为您自动识别广告账户近 30 天有投放、单视频消耗大于 750 的高消素材，并从中筛选出可高频衍生、具备复刻属性的精质素材。快去挑选并设置您的裂变偏好，衍生出10倍甚至百倍表现的新爆款，一键分发！
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
              </div>

              {/* How to use Guide panel with Player */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileVideo className="w-5 h-5 text-purple-500" />
                  <h3 className="text-sm font-bold text-slate-800">如何使用爆款裂变功能？</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Tutorial Video Placeholder */}
                  <div className="md:col-span-7 bg-slate-950 aspect-video rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-md group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80" 
                      alt="Tutorial video thumb" 
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <p className="text-white font-bold text-xs mt-3">2分钟快速掌握爆款裂变秘诀</p>
                      <p className="text-slate-300 text-[10px] mt-1 font-mono">2026/07/19 优质课程</p>
                    </div>
                  </div>

                  {/* Steps Breakdown */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-100">1</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">选择优质爆款素材</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">从左侧关联广告账户同步高曝光素材，点击【帮我裂变】进行解构。</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-100">2</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">确认裂变偏好与原料</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">自定义黄金前贴开头、添加吸睛贴纸，或一键替换AI真人模特，解决视觉疲劳。</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-100">3</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">自动衍生、一键保存</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">利用智能渲染引擎极速秒级产出批量版本。可直接批量下载或同步推送到原投放账户。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice cards or general suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/1 bg-white border border-amber-500/10 rounded-2xl p-4 flex gap-3.5 items-start">
                  <div className="bg-amber-100 text-amber-700 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">什么是爆款裂变？</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      基于原爆款核心逻辑（前置镜头+痛点引申+核心卖点），由大模型拆解分镜片段，并结合AI真人模特片段替换或文案重塑，产生结构相同、展现各异的新素材。
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/1 bg-white border border-purple-500/10 rounded-2xl p-4 flex gap-3.5 items-start">
                  <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">为什么进行爆款裂变？</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      避免单视频生命周期缩短导致的“广告衰退”与受众产生审美疲劳，在极低生产成本下进行素材高频迭代，使起量推流保持超高ROI。
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STAGE 2: SETTINGS AND PREFERENCES CONFIGURATION */}
          {currentStage === "settings" && selectedMaterial && (
            <div className="max-w-xl mx-auto w-full animate-fade-in py-2">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
                
                {/* Panel Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-800">裂变设置</h3>
                  </div>
                  <button 
                    onClick={() => setCurrentStage("tutorial")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Selected Source Material Recap */}
                  <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-2xl flex gap-3 items-center">
                    <img 
                      src={selectedMaterial.coverUrl} 
                      alt="Selected thumbnail" 
                      className="w-12 h-16 object-cover rounded-lg border border-purple-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-[9px] text-purple-600 font-extrabold uppercase tracking-wide">已选择爆款母本</p>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{selectedMaterial.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">消耗 ¥{selectedMaterial.cost} ｜ 点击率 {selectedMaterial.clickRate}%</p>
                    </div>
                  </div>

                  {/* Section 1: Digital Human preference toggle */}
                  <div className="space-y-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          数字人替换真人片段
                        </span>
                        <p className="text-[10px] text-slate-400">将视频中真人出镜、播报片段自动精细切片，并无缝替换为高拟真数字人</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={useDigitalHuman} 
                          onChange={(e) => setUseDigitalHuman(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {useDigitalHuman && (
                      <div className="space-y-4 pt-1 animate-scale-up">
                        {/* Selector Grid of Avatar Previews */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 block">选择数字人出镜主播</label>
                            <button
                              type="button"
                              onClick={() => setShowAvatarModal(true)}
                              className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>查看全部形象</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3">
                            {AVATARS.slice(0, 3).map((avatar) => {
                              const isSelected = digitalAvatar === avatar.fullName;
                              return (
                                <div 
                                  key={avatar.fullName}
                                  onClick={() => {
                                    setDigitalAvatar(avatar.fullName);
                                    setDigitalVoice(avatar.recommendedVoice);
                                  }}
                                  className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer text-center group ${
                                    isSelected 
                                      ? "bg-purple-50/70 border-purple-500 shadow-sm" 
                                      : "bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200"
                                  }`}
                                >
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
                                    <img src={avatar.imageUrl} alt={avatar.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                                        <div className="bg-purple-600 text-white p-0.5 rounded-full">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-800 mt-2 truncate max-w-full">{avatar.displayName}</span>
                                  <span className="text-[8px] text-slate-400 font-medium scale-95">{avatar.category}</span>
                                </div>
                              );
                            })}

                            {/* 4th Column: dynamic based on selection */}
                            {!AVATARS.slice(0, 3).some(a => a.fullName === digitalAvatar) ? (
                              // Custom selected avatar from "More" modal
                              (() => {
                                const activeObj = AVATARS.find(a => a.fullName === digitalAvatar) || AVATARS[0];
                                return (
                                  <div 
                                    onClick={() => setShowAvatarModal(true)}
                                    className="relative flex flex-col items-center p-2 rounded-2xl border-2 border-purple-500 bg-purple-50/70 shadow-sm transition-all cursor-pointer text-center"
                                  >
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
                                      <img src={activeObj.imageUrl} alt={activeObj.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                                        <div className="bg-purple-600 text-white p-0.5 rounded-full">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 mt-2 truncate max-w-full">{activeObj.displayName}</span>
                                    <span className="text-[8px] text-purple-600 font-bold scale-95">点击更换...</span>
                                  </div>
                                );
                              })()
                            ) : (
                              // "+ More" button card
                              <div 
                                onClick={() => setShowAvatarModal(true)}
                                className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 transition-all cursor-pointer text-slate-400 hover:text-purple-600 text-center group"
                              >
                                <div className="w-12 h-12 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                                  <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold mt-2">更多形象</span>
                                <span className="text-[8px] opacity-75">查看全部</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sound Voice dropdown stays clean and functional */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 block">AI 播报声音风格</label>
                          <select 
                            value={digitalVoice} 
                            onChange={(e) => setDigitalVoice(e.target.value)}
                            className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option>热情高亢 (带货爆款)</option>
                            <option>温柔亲和 (好物种草)</option>
                            <option>富有磁性 (极简测评)</option>
                            <option>睿智诚恳 (家电对比)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Replenish raw materials (from account or selector) */}
                  <div className="space-y-3.5 border-b border-slate-100 pb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        添加补充原材料
                        <span className="text-[9px] text-slate-400 font-normal">（自动同步账户5组特写镜头）</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => alert("补充原料可提高裂变视频分镜的多样性，例如产品摆盘镜头、高清外包装图等。")}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Auto raw material deficiency suggestion */}
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-2 items-start text-[10px] text-amber-700 font-medium">
                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <div className="leading-normal">
                        <span className="font-extrabold">原材料检测与建议：</span>
                        <span>系统检测到原爆款前5秒画面在投效果最佳。若想提高裂变后转化率，强烈建议补充1款产品实物特写图或特写视频！</span>
                      </div>
                    </div>

                    {/* Uploded list of custom footage */}
                    <div className="grid grid-cols-4 gap-3 pt-1">
                      {replenishMaterials.map((url, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-200 bg-slate-100">
                          <img src={url} alt="raw material" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            onClick={() => handleRemoveReplenishMaterial(i)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}

                      {replenishMaterials.length < 4 && (
                        <button
                          onClick={handleAddReplenishMaterial}
                          className="aspect-square bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 transition-all cursor-pointer gap-1 group"
                        >
                          <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                          <span className="text-[9px] font-bold">补充原料</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Add Sticker decals option */}
                  <div className="space-y-3.5 border-b border-slate-100 pb-5">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      添加吸睛贴纸 (非必选)
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "st_1", label: "爆款抢购角标", tag: "Hot Corner" },
                        { id: "st_2", label: "限时秒杀横条", tag: "Flash Sale Banner" },
                        { id: "st_3", label: "买一送一贴画", tag: "Buy 1 Get 1 Free" }
                      ].map((sticker) => (
                        <div
                          key={sticker.id}
                          onClick={() => setSelectedSticker(selectedSticker === sticker.id ? null : sticker.id)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            selectedSticker === sticker.id 
                              ? "bg-purple-50/50 border-purple-400 text-purple-700 font-bold ring-2 ring-purple-100" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          <p className="text-xs">{sticker.label}</p>
                          <p className="text-[8px] opacity-70 font-mono mt-0.5">{sticker.tag}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Legal compliance authorization checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasAuthorized}
                      onChange={(e) => setHasAuthorized(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 border-slate-300 w-4 h-4 mt-0.5"
                    />
                    <span className="text-[10px] text-slate-400 leading-normal font-medium">
                      请您仔细阅读并承诺遵守<span className="text-purple-600 hover:underline">《授权声明》</span>，确认已获得权利方合法授权后再使用本产品爆款裂变功能，并对生成内容的使用合规性自行承担责任。
                    </span>
                  </label>

                </div>

                {/* Confirm Panel Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span>估算扣除算力：</span>
                    <span className="text-purple-600 font-extrabold font-mono text-sm">12.00 </span>
                    <span>积分</span>
                  </div>

                  <button
                    onClick={handleStartFission}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all shadow-md shadow-purple-600/10 cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>开始裂变</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* STAGE 3: RUNNING PROGRESS SPINNER */}
          {currentStage === "generating" && (
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full p-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center w-full space-y-6">
                
                {/* Spinner loading */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-700 font-mono">
                    {generationProgress}%
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-800">正在分析爆款并智能裂变中...</h3>
                  <p className="text-xs text-slate-400">大模型正在对视频分镜切片、合成AI主播、生成多维排版贴纸</p>
                </div>

                {/* Fake logs pipeline */}
                <div className="bg-slate-950 text-slate-300 text-left p-3.5 rounded-2xl font-mono text-[9px] leading-relaxed max-h-32 overflow-hidden border border-slate-800">
                  <p className="text-purple-400 font-bold">&gt; [INFO] 正在建立GPU深度算力并行池...</p>
                  {generationProgress > 15 && <p className="text-slate-500">&gt; [MODEL] 分析原片核心特征：前贴高曝光/核心特写...</p>}
                  {generationProgress > 45 && <p className="text-slate-400">&gt; [RENDER] AI数字人形象“{digitalAvatar}”开始对唇渲染...</p>}
                  {generationProgress > 75 && <p className="text-emerald-400 font-bold">&gt; [FISSION] 成功批量克隆 8 版高质量带货分镜...</p>}
                  <p className="text-slate-500 animate-pulse">&gt; [PIPELINE] 正在对音视频执行多轨道精密合流输出...</p>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: FISSIONED RESULTS GRID */}
          {currentStage === "results" && (
            <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-5 py-2">
              
              {/* Success summary banner */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-3 items-start md:items-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                    <CheckCircle2 className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      我已基于 <span className="text-purple-600">【{selectedMaterial?.title.slice(0, 15)}】</span> 素材 为你裂变出 {fissionResults.length} 个视频
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>任务名称: {taskName}</span>
                      <span>•</span>
                      <span>时间: 2026/07/19 20:15</span>
                      <span>•</span>
                      <span>任务ID: {taskId}</span>
                    </div>
                  </div>
                </div>

                {/* Batch Actions Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 mr-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 select-none">
                    <input
                      type="checkbox"
                      checked={Object.values(selectedResults).every(v => v)}
                      onChange={toggleSelectAll}
                      className="rounded text-purple-600 focus:ring-purple-500 border-slate-300 w-3.5 h-3.5"
                    />
                    <span>全选 ({getSelectedCount()}个)</span>
                  </label>

                  <button
                    onClick={handleBatchDownload}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>批量下载</span>
                  </button>

                  <button
                    onClick={handleBatchSaveToAd}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-600/10"
                  >
                    <Save className="w-3.5 h-3.5 text-purple-200" />
                    <span>保存回账户</span>
                  </button>
                </div>
              </div>

              {/* Grid of 9:16 Video Results */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fissionResults.map((item) => {
                  const isChecked = !!selectedResults[item.id];
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-purple-300 transition-all duration-300 relative flex flex-col shadow-xs"
                    >
                      {/* Checkbox Overlay in Corner */}
                      <label className="absolute top-2.5 left-2.5 z-20 cursor-pointer bg-black/45 hover:bg-black/60 p-1.5 rounded-xl border border-white/20 flex items-center justify-center transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectResult(item.id)}
                          className="rounded text-purple-600 focus:ring-purple-500 border-white/40 w-4 h-4 bg-transparent cursor-pointer"
                        />
                      </label>

                      {/* Video cover and visual area */}
                      <div className="aspect-[9/16] w-full bg-slate-100 overflow-hidden relative">
                        <img 
                          src={item.coverUrl} 
                          alt="Cover" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Strategy badge */}
                        <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 items-center">
                          <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md">
                            {item.tag}
                          </span>
                          <span className="bg-black/65 text-white/95 text-[9px] px-1.5 py-0.5 rounded-md font-mono border border-white/10">
                            AI生成
                          </span>
                        </div>

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10">
                          {/* Centered play preview */}
                          <div 
                            onClick={() => setActivePreviewVideo(item.coverUrl)}
                            className="m-auto w-12 h-12 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-lg cursor-pointer transform scale-90 group-hover:scale-100 transition-all hover:bg-white hover:scale-115"
                            title="预览成片"
                          >
                            <Play className="w-5 h-5 fill-slate-800 text-slate-800 ml-0.5" />
                          </div>

                          {/* Hover Download/Save buttons */}
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                              onClick={() => handleDownloadSingle(item.title)}
                              className="py-1.5 rounded-lg bg-white/95 text-slate-800 text-[10px] font-extrabold flex items-center justify-center gap-1 hover:bg-white shadow-xs cursor-pointer"
                            >
                              <Download className="w-3 h-3 text-slate-500" />
                              <span>下载</span>
                            </button>
                            <button
                              onClick={() => handleSaveSingleToAd(item.title)}
                              className="py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-xs cursor-pointer border border-purple-400/30"
                            >
                              <Save className="w-3 h-3 text-purple-200" />
                              <span>保存</span>
                            </button>
                          </div>
                        </div>

                        {/* Floating bottom duration & size details */}
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[8px] text-white px-1.5 py-0.5 rounded font-mono">
                          {item.duration} ｜ {item.size}
                        </div>
                      </div>

                      {/* Content title info bottom */}
                      <div className="p-3 bg-white space-y-1.5 border-t border-slate-100 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11px] font-extrabold text-slate-800 line-clamp-2 leading-relaxed">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 leading-normal font-medium">
                            <span className="font-bold text-purple-600">衍生策略：</span>
                            {item.strategyDesc}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-50">
                          <span>已解析音轨对齐 ｜ 30帧高拟真</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bot compliance disclaimer warning matching references */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-500 mt-4 leading-normal">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="font-medium">
                  内容由 AI 智能多线程生成，仅供参考。使用时请严格遵守我国互联网相关法律规定及 AIGC 服务条例对生成式内容进行标识（已自动内嵌隐式数字水印），并仅限本平台及关联官方投放平台内按授权要求使用。
                </p>
              </div>

            </div>
          )}

        </section>

      </div>

      {/* Video Preview Player Pop-up Modal */}
      {activePreviewVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden w-full max-w-sm flex flex-col max-h-[85vh] shadow-2xl relative">
            <button
              onClick={() => setActivePreviewVideo(null)}
              className="absolute top-3.5 right-3.5 z-50 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/90 transition-colors cursor-pointer border border-white/10"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 bg-black aspect-[9/16] relative flex items-center justify-center">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4"
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
              />
            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-left space-y-1.5 shrink-0">
              <span className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded font-black">
                9:16 HD 预览
              </span>
              <p className="text-xs font-bold text-white">正在流式播放裂变衍生视频...</p>
              <p className="text-[10px] text-slate-400 font-mono">视频格式：1080x1920 MP4 ｜ 声道数：2CH 立体声</p>
            </div>
          </div>
        </div>
      )}

      {/* showAvatarModal selection modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-scale-up border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="text-sm font-black text-slate-800">全部数字人主播形象</h3>
              </div>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {AVATARS.map((avatar) => {
                  const isSelected = digitalAvatar === avatar.fullName;
                  return (
                    <div
                      key={avatar.fullName}
                      onClick={() => {
                        setDigitalAvatar(avatar.fullName);
                        setDigitalVoice(avatar.recommendedVoice);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative group ${
                        isSelected 
                          ? "bg-purple-50/70 border-purple-500 shadow-md ring-2 ring-purple-100" 
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                      }`}
                    >
                      {/* Avatar Portrait */}
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 relative mb-3 shrink-0">
                        <img 
                          src={avatar.imageUrl} 
                          alt={avatar.displayName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                            <div className="bg-purple-600 text-white p-1 rounded-full">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h4 className="text-xs font-black text-slate-800 truncate max-w-full">{avatar.displayName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{avatar.category}</p>
                      <div className="mt-2.5 bg-slate-100 rounded-lg px-2 py-1 text-[8px] font-mono text-slate-500 max-w-full truncate">
                        推荐: {avatar.recommendedVoice.split(" ")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all shadow-md shadow-purple-600/10 cursor-pointer"
              >
                确认选择
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
