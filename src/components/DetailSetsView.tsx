import React, { useState } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  FileUp, 
  Plus, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Trash2,
  Settings
} from "lucide-react";
import { REFERENCE_SLIDER_IMAGES } from "../data";

interface DetailSetsViewProps {
  onBack: () => void;
  onAddTask: (type: "detail_set", name: string, inputFiles: string[], creditsCost: number) => void;
  onAddCredits: (amount: number, remark: string) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
}

export default function DetailSetsView({
  onBack,
  onAddTask,
  onAddCredits,
  onOpenMaterialSelector
}: DetailSetsViewProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [count, setCount] = useState<"4" | "6" | "8">("4");
  const [language, setLanguage] = useState("中文");
  const [remarks, setRemarks] = useState("");
  const [model, setModel] = useState("vip");
  const [format, setFormat] = useState("1k_jpeg");
  
  // Carousel slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSelectFiles = () => {
    onOpenMaterialSelector((urls) => {
      setUploadedImages([...uploadedImages, ...urls].slice(0, 5));
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (uploadedImages.length === 0) {
      alert("请至少选择或上传一张商品主体图作为分析底图！");
      return;
    }

    const cost = parseInt(count) * 1.0;
    onAddTask(
      "detail_set",
      `兰蔻套图商详分析 (${count}张)`,
      uploadedImages,
      cost
    );

    // Reset local state
    setUploadedImages([]);
    setRemarks("");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % REFERENCE_SLIDER_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + REFERENCE_SLIDER_IMAGES.length) % REFERENCE_SLIDER_IMAGES.length);
  };

  const creditsEstimate = parseInt(count) * 1.0;

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Navigation header */}
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
                商详套图
                <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                  AIGC PLANNED SET
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">上传一张主体产品图，一键智能完成多场景成套商详与微调编排</p>
            </div>
          </div>

          <button
            onClick={() => {
              setUploadedImages([]);
              setRemarks("");
            }}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>新建方案</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel Config Form: 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Upload Area */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">上传商品主体图 ({uploadedImages.length}/5)</span>
                <span className="text-[10px] text-slate-400">支持JPG, PNG高对比度白底或抠图文件</span>
              </div>

              {/* Grid of Slots */}
              <div className="grid grid-cols-5 gap-3">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group">
                    <img src={url} alt="uploaded item" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {uploadedImages.length < 5 && (
                  <button
                    onClick={handleSelectFiles}
                    className="aspect-square bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 transition-all cursor-pointer gap-1 group"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="text-[9px]">上传产品</span>
                  </button>
                )}
              </div>
            </div>

            {/* Layout parameters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
              <span className="text-xs font-bold text-slate-700 block border-b border-slate-100 pb-2">套图排版方案</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Language Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">配图语言 / Typography</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-sans"
                  >
                    <option value="中文">中文 (默认简体中文)</option>
                    <option value="English">英文 (Elegant Serif English)</option>
                    <option value="Japanese">日文 (Minimalist Japanese)</option>
                  </select>
                </div>

                {/* Drawings Count */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">生成套数 / Count</label>
                  <select
                    value={count}
                    onChange={(e: any) => setCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-sans"
                  >
                    <option value="4">精炼 4 张（首发、细节、场景、闭环）</option>
                    <option value="6">精选 6 张（多机位场景、核心标签强化）</option>
                    <option value="8">豪华 8 张（全案主图与多卖点拆解闭环）</option>
                  </select>
                </div>
              </div>

              {/* Remarks block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">补充说明 / Styling Details (选填)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="卖点方向、目标人群、禁用元素、希望呈现的风格（如：大理石底座、自然阳光、主打保湿紧致功效等）"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 h-20 resize-none font-sans"
                />
              </div>
            </div>

            {/* Technical guidance list */}
            <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                商详套图操作指引
              </span>
              <ol className="text-[10px] text-slate-400 list-decimal pl-4 space-y-1 leading-relaxed">
                <li>选择干净或无反光干扰的产品底图（最好带有Alpha透明通道，效果更佳）。</li>
                <li>配置配文语言、方案张数及核心文案偏好。</li>
                <li>点击立即分析，GPU智能工作流将自动裁剪拼贴主体、定制场景阴影，并渲染美妆高阶排版文案。</li>
              </ol>
            </div>

            {/* Bottom Config Panel & Trigger */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto flex-1 text-[11px]">
                {/* Model selection */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="bg-transparent border-none text-slate-700 focus:outline-none focus:ring-0 cursor-pointer py-0 text-[10px]"
                  >
                    <option value="vip">高级版 VIP (更快更稳)</option>
                    <option value="standard">常规通用模型</option>
                  </select>
                </div>

                {/* Resolution selection */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="bg-transparent border-none text-slate-700 focus:outline-none focus:ring-0 cursor-pointer py-0 text-[10px]"
                  >
                    <option value="1k_jpeg">1K ｜ JPEG</option>
                    <option value="2k_png">2K 高画质 ｜ PNG</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreate}
                id="btn-detail-set-cta"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/10 shrink-0 text-center cursor-pointer"
              >
                立即分析商品图 预计 <span className="font-mono text-sm font-bold text-amber-200">{creditsEstimate.toFixed(2)}</span> 积分
              </button>
            </div>

          </div>

          {/* Right panel: Reference Carousel Slider (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">创意排版参考范例</span>
            
            {/* Image display with custom description */}
            <div className="relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={REFERENCE_SLIDER_IMAGES[currentSlide].url}
                alt="reference"
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlapping text drawer */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 space-y-1">
                <span className="text-[10px] bg-purple-600/20 border border-purple-500/30 text-purple-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Layout Schema
                </span>
                <h4 className="text-sm font-bold text-white">{REFERENCE_SLIDER_IMAGES[currentSlide].title}</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed pt-0.5">
                  {REFERENCE_SLIDER_IMAGES[currentSlide].desc}
                </p>
              </div>

              {/* Next and previous handles */}
              <div className="absolute top-1/2 -translate-y-1/2 inset-x-3 flex justify-between pointer-events-none">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center pointer-events-auto transition-all shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center pointer-events-auto transition-all shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2">
              {REFERENCE_SLIDER_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? "bg-purple-600 w-4" : "bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
