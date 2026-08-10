import React, { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  FolderHeart,
  Loader2,
  Settings,
  Heart,
  Eye,
  Copy
} from "lucide-react";

interface AiImageViewProps {
  onBack: () => void;
  onAddTask: (type: "image_gen", name: string, inputFiles: string[], creditsCost: number, customPrompt?: string) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
  galleryItems: any[];
  presetPrompt?: string;
  presetReferences?: string[];
  onClearPreset?: () => void;
}

export default function AiImageView({
  onBack,
  onAddTask,
  onOpenMaterialSelector,
  galleryItems,
  presetPrompt,
  presetReferences,
  onClearPreset
}: AiImageViewProps) {
  const [prompt, setPrompt] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1k");
  const [format, setFormat] = useState("jpeg");
  const [model, setModel] = useState("premium");
  const [isExpanding, setIsExpanding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Pre-fill Preset Prompt and References from "一键同款"
  useEffect(() => {
    if (presetPrompt) {
      setPrompt(presetPrompt);
    }
    if (presetReferences && presetReferences.length > 0) {
      setReferences(presetReferences);
    }
    if (presetPrompt || (presetReferences && presetReferences.length > 0)) {
      onClearPreset?.();
    }
  }, [presetPrompt, presetReferences, onClearPreset]);

  // Filter image items
  const imageGallery = galleryItems.filter((g) => g.type === "image");

  const handleSelectReferences = () => {
    onOpenMaterialSelector((urls) => {
      setReferences([...references, ...urls].slice(0, 9));
    });
  };

  const handleRemoveRef = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  // Calling server-side Gemini prompt helper!
  const handleAiWrite = async () => {
    if (!prompt.trim()) {
      alert("请先输入一些关于您产品的简短描述，以便AI为您针对性扩写！");
      return;
    }

    setIsExpanding(true);
    try {
      const response = await fetch("/api/write-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "图片生成",
          shortDescription: prompt,
          style: "极极简日系高奢美妆主视觉，漫反射，大理石，北欧晨光"
        })
      });
      const data = await response.json();
      if (data.success && data.prompt) {
        setPrompt(data.prompt);
      } else {
        alert("AI 扩写失败，请稍后重试。");
      }
    } catch (err) {
      console.error(err);
      alert("连接后台AI助手超时。");
    } finally {
      setIsExpanding(false);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim() && references.length === 0) {
      alert("请在描述框中输入画面设想或添加参考图！");
      return;
    }

    const cost = resolution === "4k" ? 2.5 : resolution === "2k" ? 1.5 : 1.18;
    onAddTask(
      "image_gen",
      `AI 商业绘图: "${prompt.slice(0, 12)}..." (${aspectRatio})`,
      references,
      cost,
      prompt
    );

    // Reset prompt and references
    setPrompt("");
    setReferences([]);
  };

  const creditsEstimate = resolution === "4k" ? 2.5 : resolution === "2k" ? 1.5 : 1.18;

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              AI 图片生成
              <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                IMAGINATION AI
              </span>
            </h1>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Config form: 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Prompt textarea */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                <span>画面内容设想 / Product Scene Prompt</span>
                <span className="font-mono text-[10px] text-slate-400">{prompt.length}/2000</span>
              </div>

              <div className="relative border border-slate-200 rounded-xl bg-slate-50 focus-within:border-purple-500 transition-all">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="在此输入您的创意画面或产品设定，如：“一个带有金属微光的智能运动手表，置于极简暗色赛博底座，环绕圆形淡紫色冷光环，微距质感宣发海报”..."
                  className="w-full bg-transparent border-none text-xs p-4 pb-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0 h-32 resize-none font-sans"
                />

                {/* Help Me Write Gemini assist */}
                <button
                  type="button"
                  onClick={handleAiWrite}
                  disabled={isExpanding}
                  className="absolute right-3 bottom-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-600 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isExpanding ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>AI 深度扩写中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>帮我写 (Gemini 灵感扩容)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reference Uploads */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>上传参考垫图 / Subjects (最多9张) ({references.length}/9)</span>
                <span className="text-[10px] text-slate-400">支持上传或从资产库导入</span>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {references.map((url, i) => (
                  <div key={i} className="aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group">
                    <img src={url} alt="reference upload" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => handleRemoveRef(i)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {references.length < 9 && (
                  <button
                    onClick={handleSelectReferences}
                    className="aspect-square bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-200 hover:border-purple-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 transition-all cursor-pointer gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[9px]">添加参考</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Config controls */}
            <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl relative shadow-sm">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono">
                <Settings className="w-3.5 h-3.5 text-purple-600 animate-spin-slow" />
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent border-none text-slate-700 focus:outline-none focus:ring-0 cursor-pointer text-[11px]"
                >
                  <option value="premium">高级版 VIP (更懂质感细节)</option>
                  <option value="standard">常规通用模型</option>
                </select>
              </div>

              {/* Image settings trigger */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer animate-pulse-slow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-purple-600">{aspectRatio} ｜ {resolution.toUpperCase()} ｜ {format.toUpperCase()}</span>
              </button>

              {/* Image settings absolute panel */}
              {showSettings && (
                <div className="absolute left-1/3 bottom-16 bg-white border border-slate-200 rounded-2xl p-4 w-72 shadow-2xl z-50 space-y-4 animate-scale-up text-slate-700">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">画面属性控制</span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-purple-600 hover:text-purple-700 font-bold text-xs cursor-pointer"
                    >
                      确认
                    </button>
                  </div>

                  {/* Aspect Ratios */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">画面画幅比例 / Aspect Ratio</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["16:9", "4:3", "1:1", "3:4", "9:16"].map((aspect) => (
                        <button
                          key={aspect}
                          type="button"
                          onClick={() => setAspectRatio(aspect)}
                          className={`py-1 rounded text-[10px] font-mono border font-bold ${
                            aspectRatio === aspect 
                              ? "bg-purple-50 border-purple-200 text-purple-600" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {aspect}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolutions */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">输出分辨率 / Resolution</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["1k", "2k", "4k"].map((res) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setResolution(res)}
                          className={`py-1 rounded text-[10px] font-mono border font-bold uppercase ${
                            resolution === res 
                              ? "bg-purple-50 border-purple-200 text-purple-600" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {res === "1k" ? "标清 1K" : res === "2k" ? "高清 2K" : "极致 4K"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">格式 / Format</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["png", "jpeg"].map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormat(fmt)}
                          className={`py-1 rounded text-[10px] font-mono border font-bold uppercase ${
                            format === fmt 
                              ? "bg-purple-50 border-purple-200 text-purple-600" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleGenerate}
                id="btn-ai-image-cta"
                className="ml-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/10 cursor-pointer"
              >
                立即生成图片 预计 <span className="font-mono text-sm font-bold text-amber-200">{creditsEstimate.toFixed(2)}</span> 积分
              </button>
            </div>

          </div>

          {/* Right gallery sidebar showcase: 5 cols */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">历史绘图生成结果</span>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[500px]">
              {imageGallery.map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group">
                  <div className="aspect-square bg-slate-50 relative overflow-hidden">
                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-700 truncate">{item.title}</p>
                    <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                      <span>Likes: {item.likes}</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
