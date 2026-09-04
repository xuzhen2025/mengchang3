import React, { useState, useRef, useEffect } from "react";
import { 
  Video as VideoIcon, 
  Sparkles, 
  SlidersHorizontal, 
  HelpCircle, 
  FolderHeart, 
  Clock, 
  Sliders, 
  Trash2,
  FileVideo,
  Play,
  Heart,
  Eye,
  Loader2,
  Plus,
  ArrowLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  FileText,
  Tv,
  Mic,
  Info,
  Scissors,
  CheckCircle,
  Copy,
  RotateCcw,
  Download,
  Layers,
  Settings,
  AlertCircle,
  Pause,
  ChevronRight,
  X
} from "lucide-react";

interface AiVideoViewProps {
  onBack: () => void;
  onAddTask: (type: "detail_set" | "watermark" | "subtitle" | "enhance" | "video_gen" | "image_gen" | "fission", name: string, inputFiles: string[], creditsCost: number, customPrompt?: string) => void;
  onOpenMaterialSelector: (callback: (selectedUrls: string[]) => void) => void;
  galleryItems: any[];
  presetPrompt?: string;
  presetReferences?: string[];
  onClearPreset?: () => void;
}

export default function AiVideoView({
  onBack,
  onAddTask,
  onOpenMaterialSelector,
  galleryItems,
  presetPrompt,
  presetReferences,
  onClearPreset
}: AiVideoViewProps) {
  // Main page states
  const [prompt, setPrompt] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [model, setModel] = useState("seedance_2");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [resolution, setResolution] = useState("720p");
  const [duration, setDuration] = useState("15");
  const [audio, setAudio] = useState("include");
  const [isExpanding, setIsExpanding] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

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

  // Edit Mode states
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  
  // Custom Player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // Segment modification states (段修改)
  const [segmentStart, setSegmentStart] = useState(8.0);
  const [segmentEnd, setSegmentEnd] = useState(12.0);
  const [segmentPrompt, setSegmentPrompt] = useState("");
  const [segmentSuccessMsg, setSegmentSuccessMsg] = useState("");

  // Frame Extraction states (抽帧)
  const [capturedFrames, setCapturedFrames] = useState<any[]>([]);
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [frameNotification, setFrameNotification] = useState("");

  // Tabs for editing operations
  const [activeEditTab, setActiveEditTab] = useState<"subtitle" | "voice" | "hd" | "info" | "paoman">("subtitle");

  // 去字幕 sub-states
  const [subtitlePosition, setSubtitlePosition] = useState("bottom");
  const [subtitleMethod, setSubtitleMethod] = useState("generative");
  const [isEraserRunning, setIsEraserRunning] = useState(false);
  const [eraseSuccessMsg, setEraseSuccessMsg] = useState("");

  // 高清 sub-states
  const [hdResolution, setHdResolution] = useState("4k");
  const [hdFaceRestore, setHdFaceRestore] = useState(true);
  const [hdDenoise, setHdDenoise] = useState(true);
  const [hdFps, setHdFps] = useState(true);
  const [isHdRunning, setIsHdRunning] = useState(false);
  const [hdSuccessMsg, setHdSuccessMsg] = useState("");

  // 音色克隆 sub-states
  const [selectedVoice, setSelectedVoice] = useState("yating");
  const [voiceText, setVoiceText] = useState("");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [isVoiceRunning, setIsVoiceRunning] = useState(false);
  const [voiceSuccessMsg, setVoiceSuccessMsg] = useState("");

  // 泡漫AI漫剧 sub-states
  const [paomanCharacterName, setPaomanCharacterName] = useState("女主角 楚瑶");
  const [paomanCharacterOutfit, setPaomanCharacterOutfit] = useState("高奢职业装、白衬衫、珍珠耳环");
  const [paomanCharacterRole, setPaomanCharacterRole] = useState("churao_office");
  const [paomanCameraMotion, setPaomanCameraMotion] = useState("dolly_in");
  const [paomanMotionIntensity, setPaomanMotionIntensity] = useState("standard");
  const [paomanStyle, setPaomanStyle] = useState("cn_anime");
  const [paomanScript, setPaomanScript] = useState("楚瑶推开会议室大门，面带自信的微笑走入，身后的助理抱着厚厚的发布会文件...");
  const [isPaomanRunning, setIsPaomanRunning] = useState(false);
  const [paomanSuccessMsg, setPaomanSuccessMsg] = useState("");

  // Filter video items from database
  const videoGallery = galleryItems.filter((g) => g.type === "video");

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDurationTime(videoRef.current.duration || 15);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (videoRef.current) {
      videoRef.current.loop = nextLoop;
    }
  };

  // Video Generator triggers
  const handleSelectReferences = () => {
    onOpenMaterialSelector((urls) => {
      setReferences([...references, ...urls].slice(0, 15));
    });
  };

  const handleRemoveRef = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  // Calling server-side Gemini prompt helper
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
          type: "视频生成",
          shortDescription: prompt,
          style: "极度奢华美妆带货，微距漫反射，4K商用光影"
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
      alert("请在创意描述框中输入视频文案或添加参考图！");
      return;
    }

    // Estimate credits cost
    const baseCost = parseFloat(duration) * 1.36; // e.g. 15s * 1.36 = 20.4
    const finalCost = resolution === "1080p" ? baseCost * 1.5 : baseCost;

    onAddTask(
      "video_gen",
      `AI 视频生成: "${prompt.slice(0, 12)}..." (${aspectRatio})`,
      references,
      finalCost,
      prompt
    );

    // Clear prompt and ref on success
    setPrompt("");
    setReferences([]);
  };

  // Segment Regeneration (段修改)
  const handleSegmentRegen = () => {
    if (!segmentPrompt.trim()) {
      alert("请输入该区间欲替换的分镜描述！");
      return;
    }

    const durationSeg = segmentEnd - segmentStart;
    if (durationSeg <= 0) {
      alert("结束时间必须大于开始时间！");
      return;
    }

    const cost = Math.ceil(durationSeg * 1.8);
    
    // Dispatch actual task
    onAddTask(
      "video_gen",
      `视频分段修改 [${segmentStart.toFixed(1)}s-${segmentEnd.toFixed(1)}s]: "${segmentPrompt.slice(0, 15)}..."`,
      [editingVideo?.url || ""],
      cost,
      segmentPrompt
    );

    setSegmentSuccessMsg(`成功提交 ${segmentStart.toFixed(1)}秒 - ${segmentEnd.toFixed(1)}秒 的局部段修改生成任务！已扣除 ${cost} 积分。`);
    setTimeout(() => {
      setSegmentSuccessMsg("");
      setSegmentPrompt("");
    }, 5000);
  };

  // Preset Segment helper
  const handleApplySegmentPreset = (preset: "start" | "middle" | "end" | "custom") => {
    if (preset === "start") {
      setSegmentStart(0);
      setSegmentEnd(5);
    } else if (preset === "middle") {
      setSegmentStart(5);
      setSegmentEnd(10);
    } else if (preset === "end") {
      setSegmentStart(10);
      setSegmentEnd(15);
    }
  };

  // Frame Extraction (抽帧)
  const handleExtractFrame = () => {
    setIsExtractingFrame(true);
    setFrameNotification("");

    setTimeout(() => {
      // Simulate snapshot capture
      const randomImages = [
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80"
      ];
      const randomPic = randomImages[Math.floor(Math.random() * randomImages.length)];

      const newFrame = {
        id: "frame_" + Date.now(),
        time: currentTime.toFixed(2) + "s",
        url: randomPic,
        size: "2.44 MB",
        resolution: "1920 x 1080",
        format: "PNG",
        capturedAt: new Date().toLocaleTimeString()
      };

      setCapturedFrames([newFrame, ...capturedFrames]);
      setIsExtractingFrame(false);
      setFrameNotification(`成功捕获视频第 ${currentTime.toFixed(2)}s 画面帧！`);
      setTimeout(() => setFrameNotification(""), 3000);
    }, 800);
  };

  // Subtitle eraser (去字幕)
  const handleEraseSubtitles = () => {
    setIsEraserRunning(true);
    setEraseSuccessMsg("");

    setTimeout(() => {
      onAddTask(
        "subtitle",
        `擦除视频字幕: "${editingVideo?.title}" (擦除位置: ${subtitlePosition === "bottom" ? "底部" : "顶部"})`,
        [editingVideo?.url || ""],
        12.0
      );
      setIsEraserRunning(false);
      setEraseSuccessMsg("字幕无痕消除任务已在后台排队处理！");
      setTimeout(() => setEraseSuccessMsg(""), 5000);
    }, 1500);
  };

  // HD Enhancer (视频高清化)
  const handleHDEnhance = () => {
    setIsHdRunning(true);
    setHdSuccessMsg("");

    setTimeout(() => {
      onAddTask(
        "enhance",
        `视频高清重置 [${hdResolution === "4k" ? "4K 臻彩超画质" : "1080P 超清增强"}]: "${editingVideo?.title}"`,
        [editingVideo?.url || ""],
        25.0
      );
      setIsHdRunning(false);
      setHdSuccessMsg("4K超高清重画质渲染工程已成功部署至算力中心！");
      setTimeout(() => setHdSuccessMsg(""), 5000);
    }, 1500);
  };

  // Voice cloning synthesis (音色克隆与配音)
  const handleVoiceCloneAndSynth = () => {
    if (!voiceText.trim()) {
      alert("请先输入需要合成的配音文本！");
      return;
    }

    setIsVoiceRunning(true);
    setVoiceSuccessMsg("");

    const voiceLabels: Record<string, string> = {
      yating: "温柔女音雅婷",
      aqiang: "激情男音阿强",
      xiaomei: "甜美客服小美",
      dashan: "磁性播音大山"
    };

    setTimeout(() => {
      onAddTask(
        "subtitle", // Using subtitle as audio merge placeholder in App pipeline
        `音色克隆配音 [${voiceLabels[selectedVoice]}]: "${voiceText.slice(0, 15)}..."`,
        [editingVideo?.url || ""],
        15.0
      );
      setIsVoiceRunning(false);
      setVoiceSuccessMsg(`配音已合成并自动混入原视频轨道。音色模型: ${voiceLabels[selectedVoice]}`);
      setTimeout(() => {
        setVoiceSuccessMsg("");
        setVoiceText("");
      }, 5000);
    }, 2000);
  };

  // 泡漫AI漫剧生态剧本分镜/运镜动作流 (泡漫AI漫剧专区)
  const handlePaomanAction = (actionType: "character_lock" | "camera" | "script" | "theme") => {
    setIsPaomanRunning(true);
    setPaomanSuccessMsg("");

    setTimeout(() => {
      let taskName = "";
      let cost = 10;
      if (actionType === "character_lock") {
        taskName = `泡漫漫剧角色形象特征锁 [${paomanCharacterName}]: ${paomanCharacterOutfit.slice(0, 15)}`;
        cost = 20;
      } else if (actionType === "camera") {
        const motionLabels: Record<string, string> = {
          dolly_in: "智能微距推进 (Dolly In)",
          quick_pan: "快速摇摄 (Quick Pan)",
          orbit: "环绕追踪 (Orbit)",
          low_angle: "低角度仰拍 (Low Angle)"
        };
        taskName = `泡漫漫剧智能镜头重算 [${motionLabels[paomanCameraMotion] || "镜头运镜"}]: 强度 ${paomanMotionIntensity === "standard" ? "标准" : "温和"}`;
        cost = 15;
      } else if (actionType === "script") {
        taskName = `泡漫一键剧本漫剧分镜生成: "${paomanScript.slice(0, 15)}..." (共4幕连贯短剧)`;
        cost = 40;
      } else {
        const themeLabels: Record<string, string> = {
          cn_anime: "国漫风暴",
          manga_hand: "日系手绘",
          dream_3d: "3D梦幻超真",
          retro_comic: "复古美漫"
        };
        taskName = `泡漫漫剧一键画风转化 [${themeLabels[paomanStyle] || "画风转化"}]: 转换短剧画幅`;
        cost = 25;
      }

      onAddTask(
        "fission",
        taskName,
        [editingVideo?.url || ""],
        cost,
        actionType === "script" ? paomanScript : paomanCharacterOutfit
      );

      setIsPaomanRunning(false);
      setPaomanSuccessMsg(`泡漫生态漫剧工作流已部署！任务 [${taskName.slice(0, 25)}...] 在后台计算中，请留意右侧队列。`);
      setTimeout(() => setPaomanSuccessMsg(""), 6000);
    }, 1500);
  };

  const creditsEstimate = (parseFloat(duration) * (resolution === "1080p" ? 2.04 : 1.36));

  // --- RENDERING WORKSPACE (EDIT MODE) ---
  if (editingVideo) {
    return (
      <div className="flex-1 bg-slate-50 text-slate-700 p-6 overflow-y-auto font-sans">
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingVideo(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer border border-slate-200"
                title="返回视频生成"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                    {editingVideo.title}
                  </h1>
                  <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                    STUDIO WORKBENCH
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">智能视频编辑模式 ｜ 具备智能分段修改（段修改）、4K画质高清、AI智能去字幕、高保真音色克隆与漫剧生态套组</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono shadow-xs">
                原大小: <strong className="text-slate-700">{editingVideo.duration || "15s"}</strong> ｜ 热度: <span className="text-pink-500 font-bold">♥ {editingVideo.likes}</span>
              </span>
              <button
                onClick={() => setEditingVideo(null)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
              >
                退出工作台
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Player & Timeline Segment & Extraction */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Premium Video Player Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative">
                
                {/* Media frame */}
                <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={editingVideo.url}
                    poster={editingVideo.coverUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  />

                  {/* 悬浮抽帧按钮 */}
                  <button
                    type="button"
                    disabled={isExtractingFrame}
                    onClick={handleExtractFrame}
                    className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all border border-slate-700/50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 z-20 shadow-lg hover:scale-105"
                    title="提取当前时刻为超清物料帧"
                  >
                    {isExtractingFrame ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                        <span>捕获中...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-purple-400" />
                        <span>提取当前时刻帧</span>
                      </>
                    )}
                  </button>

                  {/* Dark overlay play button when paused */}
                  {!isPlaying && (
                    <button
                      onClick={handlePlayPause}
                      className="absolute w-14 h-14 bg-purple-600/90 hover:bg-purple-500/90 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 cursor-pointer z-10"
                    >
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </button>
                  )}
                </div>

                {/* Scrubber Timeline Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-indigo-600 font-mono font-bold w-12 text-right">
                      {currentTime.toFixed(1)}s
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={durationTime}
                      step="0.05"
                      value={currentTime}
                      onChange={handleScrubChange}
                      className="flex-1 accent-indigo-600 h-1.5 rounded-lg bg-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 font-mono w-12">
                      {durationTime.toFixed(1)}s
                    </span>
                  </div>

                  {/* Player Buttons Control Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePlayPause}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-all cursor-pointer border border-slate-200 shadow-xs"
                        title={isPlaying ? "暂停" : "播放"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-slate-600" /> : <Play className="w-4 h-4 fill-slate-600" />}
                      </button>
                      <button
                        onClick={handleStop}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-all cursor-pointer border border-slate-200 shadow-xs"
                        title="停止"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Speed selector */}
                      <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 ml-2 shadow-xs">
                        {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => handleSpeedChange(spd)}
                            className={`px-2 py-0.5 text-[9px] rounded font-mono font-bold transition-all cursor-pointer ${
                              playbackSpeed === spd 
                                ? "bg-indigo-600 text-white shadow-xs" 
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {spd.toFixed(1)}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Volume control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleMute}
                        className="text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 accent-indigo-600 h-1 bg-slate-200 rounded-lg"
                      />
                      
                      <button
                        onClick={handleToggleLoop}
                        className={`text-[9px] font-bold px-2 py-1 rounded border ml-3 cursor-pointer transition-all ${
                          isLooping 
                            ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
                            : "bg-white text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50 shadow-xs"
                        }`}
                      >
                        {isLooping ? "循环播放开启" : "单次播放"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segment modification (段修改) */}
              <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-xs">
                
                {/* Visual amber glowing accent border line */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                      <Scissors className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        智能分段修改 / Partial Segment Update
                        <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-100">
                          段修改
                        </span>
                      </h2>
                      <p className="text-[10px] text-slate-500">仅对视频特定时间区间重新生成、替换背景或添加特定镜头设定</p>
                    </div>
                  </div>
                </div>

                {/* Segment visual play-indicator */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 font-bold block text-center">区间预设 / Segment Range Presets</span>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleApplySegmentPreset("start")}
                        className="bg-white hover:bg-slate-100 hover:border-amber-300 hover:text-amber-600 border border-slate-200 text-[10px] font-bold text-slate-700 px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        前段 (0s-5s)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySegmentPreset("middle")}
                        className="bg-white hover:bg-slate-100 hover:border-amber-300 hover:text-amber-600 border border-slate-200 text-[10px] font-bold text-slate-700 px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        中段 (5s-10s)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySegmentPreset("end")}
                        className="bg-white hover:bg-slate-100 hover:border-amber-300 hover:text-amber-600 border border-slate-200 text-[10px] font-bold text-slate-700 px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        尾段 (10s-15s)
                      </button>
                    </div>
                  </div>

                  {/* Interactive Dual Slider Track */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0.0s</span>
                      <span className="text-amber-700 bg-amber-50/80 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                        当前所选区间: <strong className="text-amber-800 font-mono font-black">{segmentStart.toFixed(1)}s</strong> - <strong className="text-orange-700 font-mono font-black">{segmentEnd.toFixed(1)}s</strong> (共 {(segmentEnd - segmentStart).toFixed(1)} 秒)
                      </span>
                      <span>15.0s</span>
                    </div>
                    
                    <div className="relative w-full h-8 flex items-center">
                      {/* Background Track bar */}
                      <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full border border-slate-300" />
                      
                      {/* Highlighted selection range */}
                      <div 
                        className="absolute h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        style={{
                          left: `${(segmentStart / 15) * 100}%`,
                          width: `${((segmentEnd - segmentStart) / 15) * 100}%`
                        }}
                      />

                      {/* Invisible HTML5 range inputs for dragging */}
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.1"
                        value={segmentStart}
                        onChange={(e) => {
                          const val = Math.min(parseFloat(e.target.value), segmentEnd - 0.2);
                          setSegmentStart(parseFloat(val.toFixed(1)));
                        }}
                        className="absolute w-full h-8 opacity-0 cursor-pointer pointer-events-auto"
                        style={{ zIndex: segmentStart > 7.5 ? 25 : 20 }}
                      />

                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.1"
                        value={segmentEnd}
                        onChange={(e) => {
                          const val = Math.max(parseFloat(e.target.value), segmentStart + 0.2);
                          setSegmentEnd(parseFloat(val.toFixed(1)));
                        }}
                        className="absolute w-full h-8 opacity-0 cursor-pointer pointer-events-auto"
                        style={{ zIndex: segmentStart > 7.5 ? 20 : 25 }}
                      />

                      {/* Custom styled Start handle thumb */}
                      <div 
                        className="absolute w-6 h-6 bg-amber-500 hover:bg-amber-400 text-white rounded-full flex items-center justify-center -ml-3 pointer-events-none transition-all shadow-md border-2 border-white"
                        style={{ left: `${(segmentStart / 15) * 100}%` }}
                      >
                        <span className="text-[8px] font-bold">起</span>
                      </div>

                      {/* Custom styled End handle thumb */}
                      <div 
                        className="absolute w-6 h-6 bg-orange-500 hover:bg-orange-400 text-white rounded-full flex items-center justify-center -ml-3 pointer-events-none transition-all shadow-md border-2 border-white"
                        style={{ left: `${(segmentEnd / 15) * 100}%` }}
                      >
                        <span className="text-[8px] font-bold">终</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                      💡 提示：您可以直接在上述进度条上<strong>滑动拖拽 [起] [终] 两个金黄色滑块</strong>进行无级调距，或者使用区间预设进行快速划分。
                    </p>
                  </div>
                </div>

                {/* Prompt override input box */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-600 block">段修改描述设定 / New Prompt for Segment</span>
                  <div className="relative">
                    <textarea
                      value={segmentPrompt}
                      onChange={(e) => setSegmentPrompt(e.target.value)}
                      placeholder="例：“在该区间段，将背景中卧室的温暖光效替换为清冷微弱的淡蓝色月光，桌上高跟鞋替换为一束盛开的香槟色玫瑰”"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white h-20 resize-none font-sans"
                    />
                  </div>
                </div>

                {segmentSuccessMsg && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] p-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{segmentSuccessMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    段修改重配 预计扣除: <strong className="font-mono text-amber-600 text-xs">{(segmentEnd - segmentStart).toFixed(0)}</strong> 积分/s
                  </span>
                  <button
                    type="button"
                    onClick={handleSegmentRegen}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>确认重配生成片段</span>
                  </button>
                </div>
              </div>

              {/* Advanced Frame Extraction Tool (抽帧) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-600" />
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">已提取的高清视频帧 / Captured Video Frames</h3>
                      <p className="text-[10px] text-slate-500">拖动上方视频进度条，点击视频右上角悬浮的“提取当前时刻帧”按钮即可捕获 PNG 原画</p>
                    </div>
                  </div>
                </div>

                {frameNotification && (
                  <div className="bg-purple-50 border border-purple-100 text-purple-700 text-[10px] p-2.5 rounded-xl">
                    {frameNotification}
                  </div>
                )}

                {/* Extracted Frame List Tray */}
                {capturedFrames.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono tracking-wider">
                      抽帧记录 ({capturedFrames.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {capturedFrames.map((frame) => {
                        return (
                          <div key={frame.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-1.5 space-y-1.5 group relative shadow-2xs">
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
                              <img src={frame.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <span className="absolute left-1.5 bottom-1.5 bg-slate-950/80 backdrop-blur-xs text-[8px] font-mono font-bold text-purple-300 px-1 rounded">
                                {frame.time}
                              </span>
                            </div>
                            
                            <div className="text-[8px] text-slate-500 leading-tight">
                              <p className="text-slate-800 font-bold truncate">Frame_{frame.id.slice(-4)}.png</p>
                              <p className="font-mono text-slate-400">{frame.resolution} ｜ {frame.size}</p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.currentTarget.innerText = "已保存至素材库 ✓";
                                e.currentTarget.className = "w-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] py-1 rounded font-bold transition-all pointer-events-none";
                              }}
                              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-[9px] py-1 rounded font-bold transition-all cursor-pointer shadow-xs"
                            >
                              保存至素材库
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-[10px]">
                    暂未进行抽帧，拖动上方视频进度条，并在视频画面右上角点击“提取当前时刻帧”提取素材。
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Tab Panels for 去字幕, 音色克隆, 高清, details */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col text-slate-700">
              
              {/* Tabs Navigation Header */}
              <div className="flex bg-slate-50 border-b border-slate-200 p-1.5 gap-1">
                <button
                  onClick={() => setActiveEditTab("subtitle")}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeEditTab === "subtitle" 
                      ? "bg-white text-slate-800 border border-slate-200 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>去字幕</span>
                </button>
                <button
                  onClick={() => setActiveEditTab("voice")}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeEditTab === "voice" 
                      ? "bg-white text-slate-800 border border-slate-200 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-indigo-600" />
                  <span>音色克隆</span>
                </button>
                <button
                  onClick={() => setActiveEditTab("hd")}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeEditTab === "hd" 
                      ? "bg-white text-slate-800 border border-slate-200 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-sky-600" />
                  <span>画质高清</span>
                </button>
                <button
                  onClick={() => setActiveEditTab("info")}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeEditTab === "info" 
                      ? "bg-white text-slate-800 border border-slate-200 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>视频详情</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-5 flex-1 space-y-4">
                
                {/* 1. Subtitle Tab (去字幕) */}
                {activeEditTab === "subtitle" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>AI 智能字幕擦除引擎</span>
                      </h4>
                      <p className="text-[10px] text-slate-500">利用大模型智能识别并修补字幕覆盖区域，保持视频 background 像素无痕吻合</p>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">字幕覆盖方位 / Detection Position</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "bottom", label: "底部字幕 (15%)" },
                            { id: "top", label: "顶部字幕 (10%)" },
                            { id: "full", label: "全区域智能检测" }
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setSubtitlePosition(pos.id)}
                              className={`py-1.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                                subtitlePosition === pos.id 
                                  ? "bg-purple-50 border-purple-300 text-purple-700" 
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">填充算法模型 / Inpainting Method</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "generative", label: "AI 智能生成补全 (高精)", desc: "12 积分/次" },
                            { id: "fast_blur", label: "像素融合邻近模糊 (极速)", desc: "0 积分" }
                          ].map((meth) => (
                            <button
                              key={meth.id}
                              type="button"
                              onClick={() => setSubtitleMethod(meth.id)}
                              className={`p-2 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                                subtitleMethod === meth.id 
                                  ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-[9px] font-bold">{meth.label}</span>
                              <span className="text-[8px] text-slate-400 font-mono mt-0.5">{meth.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {eraseSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] p-3 rounded-xl flex items-start gap-2 animate-fade-in">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                        <span>{eraseSuccessMsg}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={handleEraseSubtitles}
                        disabled={isEraserRunning}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isEraserRunning ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>消隐算法计算中...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            <span>消除原视频字幕 (预计扣除 12 积分)</span>
                          </>
                        )}
                      </button>
                      <p className="text-[8px] text-slate-500 text-center">擦除字幕成功后将自动渲染输出并保存至历史库，不覆盖您的原版视频。</p>
                    </div>
                  </div>
                )}

                {/* 2. Voice Tab (音色克隆) */}
                {activeEditTab === "voice" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">高保真 AI 音色克隆 ｜ 智能配音</h4>
                      <p className="text-[10px] text-slate-500">选择爆款主播或定制您的专属克隆人音轨，输入台词生成超逼真环境配音</p>
                    </div>

                    {/* Actors select */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">配音主播模型 / Voice Actor</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "yating", name: "知性高奢 · 雅婷", tag: "优雅女音", style: "适合奢侈品/护肤品" },
                          { id: "aqiang", name: "激情带货 · 阿强", tag: "喊麦男音", style: "适合数码/零食大促" },
                          { id: "xiaomei", name: "温柔客服 · 小美", tag: "甜美轻柔", style: "适合玩具/居家百货" },
                          { id: "dashan", name: "磁气质感 · 大山", tag: "浑厚男播", style: "适合高端定制/户外" }
                        ].map((voice) => (
                          <button
                            key={voice.id}
                            type="button"
                            onClick={() => setSelectedVoice(voice.id)}
                            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              selectedVoice === voice.id 
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[9px] font-bold">{voice.name}</span>
                              <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded font-bold">{voice.tag}</span>
                            </div>
                            <span className="text-[8px] text-slate-400 mt-1">{voice.style}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text field */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">台词配音文本 / Narration Script</span>
                      <textarea
                        value={voiceText}
                        onChange={(e) => setVoiceText(e.target.value)}
                        placeholder="在此输入您的带货文案，如：“真丝的触感就像第二层皮肤，穿上它，把温柔还给自己...”"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 h-20 resize-none"
                      />
                    </div>

                    {/* Speech tuning controls */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                          <span>语速设定</span>
                          <span>{voiceSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="1.5"
                          step="0.1"
                          value={voiceSpeed}
                          onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-slate-200 rounded cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                          <span>音调微调</span>
                          <span>{voicePitch.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="1.2"
                          step="0.05"
                          value={voicePitch}
                          onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-slate-200 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {voiceSuccessMsg && (
                      <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] p-3 rounded-xl flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                        <span>{voiceSuccessMsg}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={handleVoiceCloneAndSynth}
                        disabled={isVoiceRunning}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                      >
                        {isVoiceRunning ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>克隆声线合成中...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span>合成并合入原声带 (预计扣除 15 积分)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. HD Quality Enhancement Tab (画质高清) */}
                {activeEditTab === "hd" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">4K 臻彩超清画质重塑 ｜ High-Definition</h4>
                      <p className="text-[10px] text-slate-500">运用超分（Super Resolution）神经网络在每个像素上进行超细致重组，使商品细节立显奢华质感。</p>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      
                      {/* Scale selection */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">分辨率级别 / Resolution Output</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "1080p", title: "1080P 超清升级", desc: "1.5x 画质密度" },
                            { id: "4k", title: "4K 臻彩画质 (超分)", desc: "4x 像素重塑" }
                          ].map((level) => (
                            <button
                              key={level.id}
                              type="button"
                              onClick={() => setHdResolution(level.id)}
                              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                hdResolution === level.id 
                                  ? "bg-sky-50 border-sky-300 text-sky-700" 
                                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-[9px] font-bold">{level.title}</span>
                              <span className="text-[8px] text-slate-400 mt-0.5 font-bold">{level.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-700 block">人脸五官超清重塑</span>
                            <span className="text-[8px] text-slate-400 block">针对电商模特局部面部细节恢复</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={hdFaceRestore}
                            onChange={(e) => setHdFaceRestore(e.target.checked)}
                            className="accent-sky-500 h-4 w-4 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-700 block">高对比噪点过滤 (Denoise)</span>
                            <span className="text-[8px] text-slate-400 block">消除漫反射等复杂光影微粒干扰</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={hdDenoise}
                            onChange={(e) => setHdDenoise(e.target.checked)}
                            className="accent-sky-500 h-4 w-4 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-700 block">60 FPS 臻彩超平滑插帧</span>
                            <span className="text-[8px] text-slate-400 block">丝滑播放，杜绝闪烁震荡</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={hdFps}
                            onChange={(e) => setHdFps(e.target.checked)}
                            className="accent-sky-500 h-4 w-4 cursor-pointer"
                          />
                        </div>
                      </div>

                    </div>

                    {hdSuccessMsg && (
                      <div className="bg-sky-50 border border-sky-200 text-sky-700 text-[10px] p-3 rounded-xl flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-600" />
                        <span>{hdSuccessMsg}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={handleHDEnhance}
                        disabled={isHdRunning}
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                      >
                        {isHdRunning ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>超分重绘算力渲染中...</span>
                          </>
                        ) : (
                          <>
                            <Tv className="w-4 h-4" />
                            <span>启动 4K 高清画质渲染 (预计扣除 25 积分)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Video Details Info Tab (视频详情信息) */}
                {activeEditTab === "info" && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">视频源文件详细数据</h4>
                      <p className="text-[10px] text-slate-500">读取到的视频文件底层元数据信息</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2.5 text-slate-600 font-mono">
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">文件名:</span>
                        <span className="text-slate-700">AI_Gen_{editingVideo.id}.mp4</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">画幅尺寸:</span>
                        <span className="text-slate-700">1080 x 1920 (竖屏 9:16)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">时幅 / 帧率:</span>
                        <span className="text-slate-700">{editingVideo.duration || "15s"} ｜ 30.00 fps</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">编码格式:</span>
                        <span className="text-slate-700">AVC H.264 / High Profile</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">音频编码:</span>
                        <span className="text-slate-700">AAC Stereo (48000 Hz)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">存储体积:</span>
                        <span className="text-slate-700">14.24 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">算力模型:</span>
                        <span className="text-slate-700">Veo-3.1-Lite Engine</span>
                      </div>
                    </div>

                    {/* Associated Reference Images */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">关联的参考附件图片 / Associated Reference Attachments</span>
                      <div className="flex flex-wrap gap-2">
                        {(editingVideo.inputFiles && editingVideo.inputFiles.length > 0 ? editingVideo.inputFiles : [
                          "./assets/prototype/skincare-product.jpg",
                          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80"
                        ]).map((url: string, index: number) => (
                          <div 
                            key={index}
                            onClick={() => setPreviewImageUrl(url)}
                            className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:border-purple-500 hover:shadow-sm transition-all relative group"
                            title="点击查看原高清大图"
                          >
                            <img src={url} alt="attached asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                              预览
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Original Prompt Block */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block">生成创意描述词 / Original Generator Prompt</span>
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl max-h-24 overflow-y-auto text-slate-600 leading-normal font-sans text-[11px]">
                        {editingVideo.prompt || "（智能扩展分镜：该视频通过上传参考图主体，由AI视频模型根据前向光照与漫反射物理模拟进行三维一致性动态延伸生成）"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(editingVideo.prompt || "智能扩展分镜");
                        alert("提示词已成功复制到剪贴板！");
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-bold py-2 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制生成提示词</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING GENERATION (STANDARD MODE) ---
  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              AI 视频生成
              <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                VEO GENERATIVE ENGINE
              </span>
            </h1>
          </div>
        </div>

        {/* Form panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Config left: 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Input Canvas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                <span>视频创意分镜描述 / Prompt Outline</span>
                <span className="font-mono text-[10px] text-slate-400">{prompt.length}/2000</span>
              </div>

              <div className="relative border border-slate-200 rounded-xl bg-slate-50 focus-within:border-purple-500 transition-all p-3 flex items-start gap-3">
                {references.length > 0 && (
                  <div className="relative flex-shrink-0 mt-1">
                    <div 
                      onClick={() => setPreviewImageUrl(references[0])}
                      className="w-14 h-14 bg-slate-200 rounded-xl border border-slate-300 overflow-hidden cursor-pointer relative group shadow-sm flex items-center justify-center hover:border-purple-500 transition-all"
                      title="点击预览附件图片"
                    >
                      <img src={references[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute -top-1.5 -left-1.5 bg-slate-600 text-white font-mono font-bold text-[8px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                        {references.length}
                      </span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold">
                        预览
                      </div>
                    </div>
                  </div>
                )}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="可连线添加素材并 @引用，描述你想生成的视频。例如：制作 15 秒商品卖点视频，展示开箱、细节特写和使用效果。"
                  className="flex-1 bg-transparent border-none text-xs p-1 pb-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0 h-32 resize-none font-sans"
                />

                {/* functional 'Help Me Write' assist button */}
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
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110" />
                      <span>帮我写 (Gemini 灵感扩容)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reference Upload */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>上传参考多媒体素材 (首帧/尾帧/主体) ({references.length}/15)</span>
                <span className="text-[10px] text-slate-400">支持 3 张以内联合引导</span>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {references.map((url, i) => (
                  <div key={i} className="aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group">
                    <img 
                      src={url} 
                      alt="reference media" 
                      className="w-full h-full object-cover cursor-pointer" 
                      referrerPolicy="no-referrer" 
                      onClick={() => setPreviewImageUrl(url)}
                      title="点击预览图片"
                    />
                    <button
                      onClick={() => handleRemoveRef(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      title="删除参考图片"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                    <div 
                      onClick={() => setPreviewImageUrl(url)}
                      className="absolute inset-x-0 bottom-0 bg-black/40 text-[9px] text-white py-1 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      预览
                    </div>
                  </div>
                ))}

                {references.length < 15 && (
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

            {/* Settings Row Popover trigger */}
            <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl relative shadow-sm">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent border-none text-slate-700 focus:outline-none focus:ring-0 cursor-pointer text-[11px]"
                >
                  <option value="seedance_2">Seedance-v2.0 (商业带货微距大模型)</option>
                  <option value="veo_lite">Veo-3.1-Lite (极速高画质视频)</option>
                </select>
              </div>

              {/* Video settings toggle */}
              <button
                type="button"
                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-purple-600">{aspectRatio} ｜ {resolution.toUpperCase()} ｜ {duration}s</span>
              </button>

              {/* Popover content absolute panel */}
              {showSettingsPopover && (
                <div className="absolute left-1/3 bottom-16 bg-white border border-slate-200 rounded-2xl p-4 w-72 shadow-2xl z-50 space-y-4 text-slate-700">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">视频细节设置</span>
                    <button
                      onClick={() => setShowSettingsPopover(false)}
                      className="text-purple-600 hover:text-purple-700 font-bold text-xs cursor-pointer"
                    >
                      确认
                    </button>
                  </div>

                  {/* Aspect Ratios */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">画幅比例 / Aspect Ratio</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].map((aspect) => (
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase">输出质量 / Quality</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["720p", "1080p"].map((res) => (
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
                          {res === "720p" ? "720P 高清" : "1080P 超清"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio flag */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">环境音轨 / Audio</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["include", "mute"].map((aud) => (
                        <button
                          key={aud}
                          type="button"
                          onClick={() => setAudio(aud)}
                          className={`py-1 rounded text-[10px] border font-bold ${
                            audio === aud 
                              ? "bg-purple-50 border-purple-200 text-purple-600" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {aud === "include" ? "含AI环境音" : "静音"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Durations */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>视频长度 / Duration</span>
                      <span className="font-mono text-purple-600">{duration}s</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="15"
                      step="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full accent-purple-600 cursor-pointer h-1 rounded bg-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleGenerate}
                id="btn-ai-video-cta"
                className="ml-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/10 cursor-pointer"
              >
                立即生成视频 预计 <span className="font-mono text-sm font-black text-amber-200">{creditsEstimate.toFixed(2)}</span> 积分
              </button>
            </div>

          </div>

          {/* Right panel gallery showcase: 5 cols */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">历史生成视频</span>
              <span className="text-[10px] text-slate-400">点击其中任意一个进入工作台编辑</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px]">
              {videoGallery.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setEditingVideo(item)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-300 rounded-xl overflow-hidden p-2 flex gap-3 cursor-pointer transition-all relative group"
                  title="点击视频进行精修和段修改"
                >
                  <div className="w-24 aspect-video rounded-lg overflow-hidden bg-slate-100 relative flex-shrink-0">
                    <img src={item.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <Play className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[11px] font-bold text-slate-700 truncate group-hover:text-purple-600 transition-colors flex-1">{item.title}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = (item.inputFiles && item.inputFiles.length > 0) 
                              ? item.inputFiles[0] 
                              : "./assets/prototype/skincare-product.jpg";
                            setPreviewImageUrl(url);
                          }}
                          className="flex-shrink-0 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold border border-purple-100 rounded px-1.5 py-0.5 text-[8px] transition-all cursor-pointer flex items-center gap-0.5"
                          title="查看该视频附带的参考图片"
                        >
                          📎 附件图
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.prompt || "智能扩展分镜"}</p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-slate-500">
                        时幅: {item.duration || "10s"}
                        <span className="bg-purple-50 text-purple-600 px-1 rounded text-[8px]">精修编辑 ➔</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Heart className="w-3 h-3 text-pink-500" /> {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox / Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setPreviewImageUrl(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 flex flex-col text-slate-700 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="text-purple-600">📎</span> 视频关联参考附件图片预览 / Attachment Preview
              </span>
              <button
                onClick={() => setPreviewImageUrl(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-slate-950/5 max-h-[60vh] overflow-hidden">
              <img 
                src={previewImageUrl} 
                alt="Attachment Preview" 
                className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg border border-white" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>图片来源: MC 素材库 / Unsplash 垫图参考</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewImageUrl);
                  alert("图片链接已成功复制到剪贴板！");
                }}
                className="text-purple-600 hover:text-purple-500 font-bold transition-all cursor-pointer"
              >
                复制图片直链
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
