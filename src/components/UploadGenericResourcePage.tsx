import React, { useState } from "react";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  X,
  Check,
  Sparkles,
  Shield,
  FolderPlus,
  HelpCircle,
  Tag
} from "lucide-react";
import { UploadFileType } from "./ResourcesView";

interface UploadGenericResourcePageProps {
  type: UploadFileType;
  onClose: () => void;
  onPublishSuccess?: (msg: string) => void;
}

export default function UploadGenericResourcePage({
  type,
  onClose,
  onPublishSuccess
}: UploadGenericResourcePageProps) {
  // Config per type
  const configMap: Record<
    UploadFileType,
    { title: string; formats: string; icon: any; defaultName: string; accept: string; defaultCategory: string[] }
  > = {
    成片: {
      title: "视频上传",
      formats: "MP4, MOV, MKV (最大 2GB)",
      icon: Video,
      defaultName: "爆款洗发水高转化宣传视频_2026.mp4",
      accept: "video/*",
      defaultCategory: ["爆款素材", "内衣", "内裤", "通用", "二创剪辑"]
    },
    素材: {
      title: "素材上传",
      formats: "MP4, MOV, AVI (最大 5GB)",
      icon: Video,
      defaultName: "室外B-Roll打光原片_4K.mov",
      accept: "video/*",
      defaultCategory: ["镜头切片", "模特实拍", "痛点对比", "场景B-Roll"]
    },
    脚本: {
      title: "脚本上传",
      formats: "TXT, DOCX, PDF, MD (最大 50MB)",
      icon: FileText,
      defaultName: "爆款口播痛点对比三段式脚本_V2.docx",
      accept: ".docx,.doc,.txt,.pdf,.md",
      defaultCategory: ["口播文案", "AI拆解脚本", "直播话术", "二创创意"]
    },
    图片: {
      title: "图片上传",
      formats: "PNG, JPG, WEBP, PSD (最大 100MB)",
      icon: ImageIcon,
      defaultName: "高清商品主图_透明底精修图.png",
      accept: "image/*,.psd",
      defaultCategory: ["商品主图", "场景海报", "店铺宣发", "资质证明"]
    },
    音频: {
      title: "音频上传",
      formats: "MP3, WAV, AAC, M4A (最大 200MB)",
      icon: Music,
      defaultName: "欢快节奏电商带货背景音效_BGM.mp3",
      accept: "audio/*",
      defaultCategory: ["BGM衬乐", "旁白口播", "人声音效", "转场音效"]
    }
  };

  const config = configMap[type] || configMap["脚本"];
  const TypeIcon = config.icon;

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(config.defaultName.replace(/\.[^/.]+$/, ""));
  const [category, setCategory] = useState<string>(config.defaultCategory[0] || "通用");
  const [visibility, setVisibility] = useState<"公开" | "仅团队" | "私密">("公开");
  const [selectedTag, setSelectedTag] = useState<string>("热门推荐");
  const [remarks, setRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      if (onPublishSuccess) {
        onPublishSuccess(`✅ 已成功上传【${type}】资源：${title}`);
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FD] w-full h-full overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Page Header Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer mr-2"
            title="返回资源库"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回列表</span>
          </button>
          
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-slate-900">{config.title}页面</h2>
              <span className="text-xs text-slate-400">
                支持格式：{config.formats}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Page Form Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 font-sans max-w-5xl mx-auto w-full">
        
        {/* Upload Zone Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
            <h3 className="font-bold text-slate-900 text-sm">选择/拖拽上传文件</h3>
          </div>

          <div className="border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40 rounded-2xl p-8 text-center transition-all relative group cursor-pointer">
            <input
              type="file"
              accept={config.accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                {selectedFile ? `已选择文件: ${selectedFile.name}` : "点击此处或将文件拖拽至此上传"}
              </div>
              <p className="text-xs text-slate-400">
                支持 {config.formats}
              </p>
              
              <div className="pt-2 z-20">
                <span className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-xs inline-flex items-center gap-2 shadow-xs group-hover:bg-purple-700 transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  浏览本地文件
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
            <h3 className="font-bold text-slate-900 text-sm">基本属性设置</h3>
          </div>

          {/* Title */}
          <div className="flex items-center gap-6 pl-2">
            <span className="w-24 font-bold text-slate-700 shrink-0">
              <span className="text-rose-500 mr-1">*</span>资源名称
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入资源名称"
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Category */}
          <div className="flex items-start gap-6 pl-2">
            <span className="w-24 font-bold text-slate-700 shrink-0 pt-2">
              <span className="text-rose-500 mr-1">*</span>资源分类
            </span>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {config.defaultCategory.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-6 pl-2">
            <span className="w-24 font-bold text-slate-700 shrink-0">
              <span className="text-rose-500 mr-1">*</span>查看权限
            </span>
            <div className="flex items-center gap-5">
              {(["公开", "仅团队", "私密"] as const).map((v) => (
                <label key={v} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="radio"
                    name="genericVisibility"
                    checked={visibility === v}
                    onChange={() => setVisibility(v)}
                    className="accent-purple-600 w-4 h-4 cursor-pointer"
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div className="flex items-center gap-6 pl-2">
            <span className="w-24 font-bold text-slate-700 shrink-0">标签</span>
            <div className="flex items-center gap-2">
              {["热门推荐", "爆款核验", "团队共享", "高转化"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    selectedTag === t
                      ? "border-purple-600 text-purple-700 bg-purple-50"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="flex items-start gap-6 pl-2">
            <span className="w-24 font-bold text-slate-700 shrink-0 pt-2">备注说明</span>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="请输入格式说明或补充备注..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all min-h-[80px]"
            />
          </div>

        </div>

      </div>

      {/* Page Bottom Action Bar */}
      <div className="px-8 py-4 bg-white border-t border-slate-200/80 flex items-center justify-between shrink-0 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          取消并返回
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs px-8 py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "正在保存发布..." : `确认发布【${type}】`}
        </button>
      </div>

    </div>
  );
}
