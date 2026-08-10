import React, { useState } from "react";
import { 
  ArrowLeft, 
  Video as VideoIcon, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Maximize2, 
  Layers, 
  Cpu, 
  FileUp, 
  Trash2,
  Tv
} from "lucide-react";

interface QualityEnhanceViewProps {
  onBack: () => void;
  onAddTask: (type: "enhance", name: string, inputFiles: string[], creditsCost: number) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
}

export default function QualityEnhanceView({
  onBack,
  onAddTask,
  onOpenMaterialSelector
}: QualityEnhanceViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [resolution, setResolution] = useState("1080p");
  const [fps, setFps] = useState("60");
  const [engine, setEngine] = useState("ultra_vip");
  
  // Split slider value from 0 to 100
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelectVideo = () => {
    onOpenMaterialSelector((urls) => {
      if (urls.length > 0) {
        setSelectedVideo(urls[0]);
      }
    });
  };

  const handleStart = () => {
    if (!selectedVideo) {
      alert("请选择或上传一个带货视频进行画质重塑！");
      return;
    }
    onAddTask(
      "enhance",
      `带货视频超分质感增强 [${resolution.toUpperCase()} @ ${fps}fps]`,
      [selectedVideo],
      5.0
    );
    setSelectedVideo(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
                视频画质增强
                <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                  SUPERSAMPLING AI
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">智能重构低清素材、还原奢华微距材质、平滑运动插帧，挽救失焦素材</p>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel Config Form */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Upload Area */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <span className="text-xs font-bold text-slate-700 block">选择或上传带货视频</span>
              
              {selectedVideo ? (
                <div className="border border-slate-200 bg-slate-50 p-3 rounded-2xl relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-purple-600 border border-slate-200 flex-shrink-0">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">视频素材_待增强.mp4</p>
                      <p className="text-[9px] text-slate-400 font-mono">Size: 18.4 MB ｜ Codec: H.264</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSelectVideo}
                  className="w-full border-2 border-dashed border-slate-200 hover:border-purple-300 bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer gap-2 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-slate-50 transition-all">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">选择或拖拽电商视频</p>
                    <p className="text-[10px] text-slate-400 mt-1">支持 5 分钟以内的 mp4 / mov / avi 格式</p>
                  </div>
                </button>
              )}
            </div>

            {/* Target configuration parameters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <span className="text-xs font-bold text-slate-700 block border-b border-slate-100 pb-2">画质重构设置</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Resolution */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">输出分辨率 / Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2.5 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-sans"
                  >
                    <option value="1080p">1080P 超高清极速渲染</option>
                    <option value="2k">2K 电影级画质质感 (推荐)</option>
                    <option value="4k">4K 极致商业巨幕超分 (+2积分)</option>
                  </select>
                </div>

                {/* FPS option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">目标帧率 / Motion Frame</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2.5 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-sans"
                  >
                    <option value="30">保持源帧率 30fps</option>
                    <option value="60">AI 智能插帧 60fps (超流畅)</option>
                  </select>
                </div>
              </div>

              {/* Engine selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">超分辨率计算引擎 / AI Engine</label>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2.5 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-sans"
                >
                  <option value="ultra_vip">UltraEnhance-v3.0 (高细节材质深度还原)</option>
                  <option value="standard">Standard-Super Resolution (标准画质放大)</option>
                </select>
              </div>
            </div>

            {/* Instruction manual */}
            <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                超分增强操作指引
              </span>
              <ul className="text-[10px] text-slate-400 list-disc pl-4 space-y-1 leading-relaxed">
                <li>本算法针对珠宝美妆细节、服装皮质、毛发质感有深度重构增强作用。</li>
                <li>超分渲染时间受视频源时长及分辨率选项影响，一般在 1-3 分钟内完成。</li>
                <li>开始增强预计将消耗 5.00 积分点。</li>
              </ul>
            </div>

            {/* CTA action button */}
            <button
              onClick={handleStart}
              id="btn-quality-enhance-cta"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-lg shadow-purple-600/10 text-center cursor-pointer"
            >
              一键激发 4K 画质重构 (预计 5.00)
            </button>

          </div>

          {/* Right panel: Visual Split Comparison */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">算法效果对比 (实时微距模拟)</span>
              <span className="text-[10px] text-slate-400">左右拖拽中线看清超高清细节</span>
            </div>

            {/* Drag Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 cursor-ew-resize select-none bg-slate-50"
            >
              {/* After: High clarity cosmetic bottle */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1000&auto=format&fit=crop&q=100"
                  alt="Enhanced high detail"
                  className="w-full h-full object-cover"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-emerald-500/80 border border-emerald-400/20 text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  After / 4K 质感重写
                </div>
              </div>

              {/* Before: Low clarity blurry glass bottle */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                {/* Ensure width matches container to prevent image squeeze */}
                <div className="absolute inset-y-0 left-0 w-[480px] sm:w-[500px] md:w-[600px] lg:w-[480px] xl:w-[500px] aspect-video">
                  <img
                    src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1000&auto=format&fit=crop&q=10&blur=10"
                    alt="Original low detail"
                    className="w-full h-full object-cover"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-red-500/80 border border-red-400/20 text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Before / 480P 压缩源图
                </div>
              </div>

              {/* Split line handler */}
              <div
                onMouseDown={() => setIsDragging(true)}
                className="absolute inset-y-0 w-1 bg-white hover:bg-purple-400 flex items-center justify-center cursor-ew-resize group"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl border border-purple-500 group-hover:scale-110 transition-all font-bold text-xs">
                  ↔
                </div>
              </div>
            </div>

            {/* Summary bullet specifications */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <Cpu className="w-4 h-4 text-purple-600 mx-auto" />
                <h5 className="text-[10px] font-bold text-slate-700">GPU 硬件加速</h5>
                <p className="text-[9px] text-slate-400">双核 Tensor A100 并行解算</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <Tv className="w-4 h-4 text-pink-600 mx-auto" />
                <h5 className="text-[10px] font-bold text-slate-700">质感智能补强</h5>
                <p className="text-[9px] text-slate-400">还原奢感漫反射与镜面高光</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
