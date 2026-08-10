import React, { useState } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  FileUp, 
  Trash2, 
  Plus, 
  Eraser, 
  Scissors, 
  HelpCircle,
  Video as VideoIcon,
  Sparkles
} from "lucide-react";

interface WatermarkSubtitleViewProps {
  type: "watermark" | "subtitle";
  onBack: () => void;
  onAddTask: (type: "watermark" | "subtitle", name: string, inputFiles: string[], creditsCost: number) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
}

export default function WatermarkSubtitleView({
  type,
  onBack,
  onAddTask,
  onOpenMaterialSelector
}: WatermarkSubtitleViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Coordinate boxes state
  const [cropBoxes, setCropBoxes] = useState<Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>>([
    { id: "box_1", x1: 78, y1: 4, x2: 96, y2: 14 }
  ]);

  const handleSelectVideo = () => {
    onOpenMaterialSelector((urls) => {
      if (urls.length > 0) {
        setSelectedVideo(urls[0]);
      }
    });
  };

  const handleAddBox = () => {
    if (cropBoxes.length >= 4) {
      alert("单次最多配置 4 个擦除坐标框，以确保算法效率。");
      return;
    }
    const id = "box_" + Date.now();
    // Default mock bounding box coordinates
    const newBox = {
      id,
      x1: Math.floor(Math.random() * 30 + 10),
      y1: Math.floor(Math.random() * 30 + 50),
      x2: Math.floor(Math.random() * 30 + 40),
      y2: Math.floor(Math.random() * 30 + 60)
    };
    setCropBoxes([...cropBoxes, newBox]);
  };

  const handleRemoveBox = (id: string) => {
    setCropBoxes(cropBoxes.filter((b) => b.id !== id));
  };

  const handleStart = () => {
    if (!selectedVideo) {
      alert("请选择一个视频进行像素重绘！");
      return;
    }
    onAddTask(
      type,
      type === "watermark" ? "去除视频顽固水印 (智能重绘)" : "去除视频滚动字幕 (背景补全)",
      [selectedVideo],
      2.5
    );
    setSelectedVideo(null);
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
                {type === "watermark" ? "视频去水印" : "视频字幕擦除"}
                <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                  {type === "watermark" ? "WATERMARK REMOVAL" : "SUBTITLE ERASE"}
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">
                {type === "watermark" 
                  ? "采用多维光流时间轴补全算法，干净擦除顽固角标、动态品牌浮窗与遮挡物" 
                  : "一键分析字幕所在底条，智能无痕还原带货视频底部像素"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedVideo(null);
              setCropBoxes([{ id: "box_1", x1: 78, y1: 4, x2: 96, y2: 14 }]);
            }}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>新建擦除</span>
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel Config Form: 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Upload Video Slot */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <span className="text-xs font-bold text-slate-700 block">选择待处理视频</span>
              
              {selectedVideo ? (
                <div className="border border-slate-200 bg-slate-50 p-3 rounded-2xl relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-purple-600 border border-slate-200 flex-shrink-0">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">带水印素材_原片.mp4</p>
                      <p className="text-[9px] text-slate-400 font-mono">Duration: 15s ｜ Size: 18.4 MB</p>
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
                    <p className="text-xs font-semibold text-slate-700">选择待擦除水印视频</p>
                    <p className="text-[10px] text-slate-400 mt-1">智能分析格式，支持最高4K源文件输入</p>
                  </div>
                </button>
              )}
            </div>

            {/* Coordinate selectors */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-700">
                  {type === "watermark" ? "标定水印区域" : "标定字幕区域"} ({cropBoxes.length})
                </span>
                <button
                  onClick={handleAddBox}
                  className="text-xs text-purple-600 hover:text-purple-500 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加选区</span>
                </button>
              </div>

              {/* Box Chips */}
              <div className="flex flex-wrap gap-2">
                {cropBoxes.map((box, index) => (
                  <div 
                    key={box.id} 
                    className="flex items-center gap-2 bg-slate-50 border border-purple-200 text-purple-700 text-xs px-3 py-1.5 rounded-xl font-mono relative group"
                  >
                    <span>
                      {type === "watermark" ? "水印区" : "字幕区"} {index + 1}: {box.x1},{box.y1} / {box.x2},{box.y2}
                    </span>
                    <button
                      onClick={() => handleRemoveBox(box.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {cropBoxes.length === 0 && (
                  <p className="text-[10px] text-slate-400 py-2">
                    暂未标记任何区域，算法将自动扫描全局。建议手动添加框选以获最佳擦除效果。
                  </p>
                )}
              </div>
            </div>

            {/* Operational guidelines */}
            <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                智能擦除操作指引
              </span>
              <ol className="text-[10px] text-slate-400 list-decimal pl-4 space-y-1.5 leading-relaxed">
                <li>上传视频素材，并在右侧视频静止帧中直接拖动/画框。</li>
                <li>如果水印在视频的不同位置，可多次点击【添加选区】进行联合擦除。</li>
                <li>点击执行，系统会提取水印周围相邻多帧的纹理流，智能重构无瑕背景。</li>
              </ol>
            </div>

            {/* Submit button */}
            <button
              onClick={handleStart}
              id="btn-watermark-subtitle-cta"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-lg shadow-purple-600/10 text-center cursor-pointer"
            >
              立即执行智能重绘擦除 (预计 2.50)
            </button>

          </div>

          {/* Right panel: Video Canvas with overlays: 7 cols */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">画面预览与划定框</span>
              <span className="text-[10px] text-slate-400">模拟视频帧排布</span>
            </div>

            {/* Video mockup frame with absolute crop boxes */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group shadow-inner">
              
              {selectedVideo ? (
                <video
                  src={selectedVideo}
                  className="w-full h-full object-cover opacity-60"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&auto=format&fit=crop&q=80"
                  alt="Video Frame reference"
                  className="w-full h-full object-cover opacity-35 filter blur-[1px]"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Absolute mock overlay boxes */}
              {cropBoxes.map((box, index) => (
                <div
                  key={box.id}
                  className="absolute border-2 border-dashed border-purple-500 bg-purple-500/20 flex flex-col justify-between p-1 shadow-lg cursor-move animate-pulse-slow"
                  style={{
                    left: `${box.x1}%`,
                    top: `${box.y1}%`,
                    width: `${box.x2 - box.x1}%`,
                    height: `${box.y2 - box.y1}%`,
                    minWidth: "40px",
                    minHeight: "25px"
                  }}
                >
                  <span className="bg-purple-600 text-[8px] font-bold text-white px-1 py-0.5 rounded self-start font-mono uppercase">
                    选区 {index + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBox(box.id);
                    }}
                    className="w-4 h-4 rounded bg-red-500/90 text-white flex items-center justify-center text-[9px] font-bold hover:bg-red-600 self-end cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}

              {!selectedVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-100/50">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 mb-2 border border-slate-200 shadow-xs">
                    <VideoIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">尚未加载工作视频</p>
                  <p className="text-[10px] text-slate-400 mt-1">请在左侧点击上传视频，以便框选水印或字幕边界</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span>状态: GPU像素缓存区待命</span>
              <span>分辨率: 1920 × 1080px</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
