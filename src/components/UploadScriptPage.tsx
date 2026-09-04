import React, { useState } from "react";
import CategoryCascader from "./CategoryCascader";
import {
  ArrowLeft,
  FileText,
  X,
  HelpCircle,
  RefreshCw,
  Calendar,
  ChevronDown,
  Plus,
  Minus,
  Upload,
  Folder,
  Search
} from "lucide-react";

interface UploadScriptPageProps {
  onClose: () => void;
  onPublishSuccess?: (msg: string) => void;
}

const TAG_GROUPS_DATA: Record<string, string[]> = {
  "电商痛点": ["价格昂贵", "穿戴繁琐", "臃肿显胖", "闷热不透气", "掉档跑偏"],
  "产品亮点": ["极致无痕", "高弹透气", "轻盈裸感", "德绒蓄热", "防勾抗起球"],
  "剪辑风格": ["硬广直投", "剧情反转", "口播种草", "高光切片", "混剪卡点"],
  "人群画像": ["年轻职场", "宝妈群体", "学生党", "大码人群", "精致高净值"]
};

const SCRIPT_CATEGORY_OPTIONS: Record<string, string[]> = {
  "基础：对标翻拍": ["8835内衣", "6017内衣", "8020内衣", "0969内裤"],
  "进阶：二创衍生": ["8022超薄", "保暖系列", "无痕吊带", "功能内衣"],
  "原创": ["MF品牌", "爆款短视频", "直播切片"],
  "品牌宣传": ["品牌TVC", "形象宣传", "文化故事"],
  "电商带货": ["硬广直投", "口播种草", "痛点对比"]
};

interface ScriptRow {
  id: number;
  timepoint: string;
  dialogue: string;
  shotDescription: string;
  shotImage: string | null;
  notes: string;
}

export default function UploadScriptPage({
  onClose,
  onPublishSuccess
}: UploadScriptPageProps) {
  // Preset Header
  const [presetTemplate, setPresetTemplate] = useState("");

  // Section 1: Classification & Basic Info
  const [scriptCategory, setScriptCategory] = useState("基础：对标翻拍");
  const [primaryCategory, setPrimaryCategory] = useState("基础：对标翻拍");
  const [secondaryCategory, setSecondaryCategory] = useState("8835内衣");
  const [scriptTitle, setScriptTitle] = useState("粉色的发顺丰");
  const [associatedTask, setAssociatedTask] = useState("");
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  // Section 1: Public Tag 3-Column Panel
  const [publicTagSearch, setPublicTagSearch] = useState("");
  const [publicGroupSearch, setPublicGroupSearch] = useState("");
  const [publicSubSearch, setPublicSubSearch] = useState("");
  const [selectedPublicGroupKey, setSelectedPublicGroupKey] = useState("电商痛点");
  const [addedPublicTags, setAddedPublicTags] = useState<string[]>([]);

  // Section 1: Personal Tag 3-Column Panel
  const [personalTagSearch, setPersonalTagSearch] = useState("");
  const [personalGroupSearch, setPersonalGroupSearch] = useState("");
  const [personalSubSearch, setPersonalSubSearch] = useState("");
  const [selectedPersonalGroupKey, setSelectedPersonalGroupKey] = useState("电商痛点");
  const [addedPersonalTags, setAddedPersonalTags] = useState<string[]>([]);

  // Section 2: 填写脚本
  const [scriptTemplate, setScriptTemplate] = useState("对标翻拍");
  
  // Timeline Table Rows
  const [scriptRows, setScriptRows] = useState<ScriptRow[]>([
    {
      id: 1,
      timepoint: "",
      dialogue: "",
      shotDescription: "",
      shotImage: null,
      notes: ""
    }
  ]);

  // Extra Video Parameters
  const [videoFormat, setVideoFormat] = useState("");
  const [videoSize, setVideoSize] = useState("");
  const [subtitleType, setSubtitleType] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  const [bgm, setBgm] = useState("");

  // Section 3: 更多设置
  const [presetPermissionConfig, setPresetPermissionConfig] = useState("");
  const [viewPermission, setViewPermission] = useState<"公开" | "团队成员" | "小组成员" | "公用资源" | "指定范围">("公开");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reminderUser, setReminderUser] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Row Add / Remove
  const handleAddRow = (index?: number) => {
    const newRow: ScriptRow = {
      id: Date.now(),
      timepoint: "",
      dialogue: "",
      shotDescription: "",
      shotImage: null,
      notes: ""
    };
    if (typeof index === "number") {
      const updated = [...scriptRows];
      updated.splice(index + 1, 0, newRow);
      setScriptRows(updated);
    } else {
      setScriptRows([...scriptRows, newRow]);
    }
  };

  const handleRemoveRow = (index: number) => {
    if (scriptRows.length <= 1) return;
    setScriptRows(scriptRows.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof ScriptRow, value: any) => {
    const updated = [...scriptRows];
    updated[index] = { ...updated[index], [field]: value };
    setScriptRows(updated);
  };

  const handlePublish = (keepConfig = false) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      if (onPublishSuccess) {
        onPublishSuccess(keepConfig ? "✅ 已发布脚本，相同配置可继续上传" : "✅ 已成功上传【脚本】资源");
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F6FA] w-full h-full overflow-hidden animate-in fade-in duration-150 text-xs font-sans text-slate-700">
      
      {/* Top Header */}
      <div className="px-6 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer mr-2"
            title="返回列表"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回列表</span>
          </button>
          
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">上传脚本</h2>
          </div>
        </div>

        {/* Top Right Template Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={presetTemplate}
              onChange={(e) => setPresetTemplate(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-purple-500 pr-8 appearance-none cursor-pointer"
            >
              <option value="">选择预设模板</option>
              <option value="t1">电商对标翻拍标准模板</option>
              <option value="t2">短视频二创剧情模板</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <span>存为预设模板</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Form Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 w-full">
        
        {/* SECTION 1: 脚本基本信息 & 标签 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          
          {/* 1. 脚本分类 */}
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              <span className="text-rose-500 mr-0.5">*</span>脚本分类
            </label>
            <div className="flex-1">
              <CategoryCascader
                primaryCategory={primaryCategory}
                secondaryCategory={secondaryCategory}
                onSelect={(p, s) => {
                  setPrimaryCategory(p);
                  setSecondaryCategory(s);
                }}
              />
            </div>
          </div>

          {/* 2. 脚本标题 */}
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              <span className="text-rose-500 mr-0.5">*</span>脚本标题
            </label>
            <input
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              placeholder="请输入脚本标题"
              className="flex-1 bg-white border border-slate-200 focus:border-purple-500 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none shadow-2xs"
            />
          </div>

          {/* 3. 关联任务 */}
          <div className="flex items-center gap-4 relative">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              关联任务
            </label>
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  type="text"
                  value={associatedTask}
                  onChange={(e) => setAssociatedTask(e.target.value)}
                  onFocus={() => setShowTaskDropdown(true)}
                  onBlur={() => setTimeout(() => setShowTaskDropdown(false), 200)}
                  placeholder="输入任务编号 / 备注 / ID 搜索"
                  className="w-full bg-white border border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none transition-colors shadow-2xs pr-8"
                />
                {associatedTask && (
                  <button
                    type="button"
                    onClick={() => setAssociatedTask("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Task Popover */}
              {showTaskDropdown && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl p-6 w-80 animate-in fade-in duration-100">
                  <p className="font-bold text-xs text-slate-700 mb-4">我的待办任务</p>
                  <div className="flex flex-col items-center justify-center text-slate-400 py-4 space-y-2">
                    <Folder className="w-10 h-10 stroke-1 text-slate-300" />
                    <span className="text-xs">暂无待办任务</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. 公共标签 */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-3">
              <span className="w-24 text-slate-700 font-bold text-right shrink-0">
                <span className="text-rose-500 mr-0.5">*</span>公共标签
              </span>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={publicTagSearch}
                  onChange={(e) => setPublicTagSearch(e.target.value)}
                  placeholder="请选择公共标签，支持输入文字搜索"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                编辑公共标签
              </button>
            </div>

            {/* 公共标签 3 模块 Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F8F9FC] border border-slate-200/80 rounded-xl p-3">
              {/* Col 1: 标签组 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>标签组</span>
                  <button
                    type="button"
                    onClick={() => setPublicGroupSearch("")}
                    className="text-purple-600 hover:underline flex items-center gap-0.5 font-normal text-[11px] cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    刷新
                  </button>
                </div>
                <input
                  type="text"
                  value={publicGroupSearch}
                  onChange={(e) => setPublicGroupSearch(e.target.value)}
                  placeholder="请输入标签组名称"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none shrink-0"
                />
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {Object.keys(TAG_GROUPS_DATA)
                    .filter((g) => g.includes(publicGroupSearch.trim()))
                    .map((group) => (
                      <div
                        key={group}
                        onClick={() => setSelectedPublicGroupKey(group)}
                        className={`px-2.5 py-1.5 rounded-md cursor-pointer text-xs font-medium transition-colors ${
                          selectedPublicGroupKey === group
                            ? "text-purple-600 font-bold bg-purple-50"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {group}
                      </div>
                    ))}
                </div>
              </div>

              {/* Col 2: 子标签 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>子标签</span>
                  <span className="text-[10px] text-slate-400 font-normal">多选</span>
                </div>
                <input
                  type="text"
                  value={publicSubSearch}
                  onChange={(e) => setPublicSubSearch(e.target.value)}
                  placeholder="请输入标签名称"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none shrink-0"
                />
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pt-1">
                  {(TAG_GROUPS_DATA[selectedPublicGroupKey] || [])
                    .filter((sub) => sub.includes(publicSubSearch.trim()))
                    .map((subTag) => {
                      const isChecked = addedPublicTags.includes(subTag);
                      return (
                        <label
                          key={subTag}
                          className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-600 select-none px-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setAddedPublicTags(addedPublicTags.filter((t) => t !== subTag));
                              } else {
                                setAddedPublicTags([...addedPublicTags, subTag]);
                              }
                            }}
                            className="accent-purple-600 w-3.5 h-3.5 rounded"
                          />
                          <span>{subTag}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Col 3: 已添加标签 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>已添加标签</span>
                  {addedPublicTags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddedPublicTags([])}
                      className="text-slate-400 hover:text-rose-500 text-[10px] cursor-pointer"
                    >
                      清空
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto pt-1">
                  {addedPublicTags.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-12">
                      暂未添加标签
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {addedPublicTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setAddedPublicTags(addedPublicTags.filter((t) => t !== tag))}
                            className="text-purple-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. 个人标签 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="w-24 text-slate-700 font-bold text-right shrink-0">
                个人标签
              </span>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={personalTagSearch}
                  onChange={(e) => setPersonalTagSearch(e.target.value)}
                  placeholder="请选择个人标签，支持输入文字搜索"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                编辑个人标签
              </button>
            </div>

            {/* 个人标签 3 模块 Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F8F9FC] border border-slate-200/80 rounded-xl p-3">
              {/* Col 1: 标签组 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>标签组</span>
                  <button
                    type="button"
                    onClick={() => setPersonalGroupSearch("")}
                    className="text-purple-600 hover:underline flex items-center gap-0.5 font-normal text-[11px] cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    刷新
                  </button>
                </div>
                <input
                  type="text"
                  value={personalGroupSearch}
                  onChange={(e) => setPersonalGroupSearch(e.target.value)}
                  placeholder="请输入标签组名称"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none shrink-0"
                />
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {Object.keys(TAG_GROUPS_DATA)
                    .filter((g) => g.includes(personalGroupSearch.trim()))
                    .map((group) => (
                      <div
                        key={group}
                        onClick={() => setSelectedPersonalGroupKey(group)}
                        className={`px-2.5 py-1.5 rounded-md cursor-pointer text-xs font-medium transition-colors ${
                          selectedPersonalGroupKey === group
                            ? "text-purple-600 font-bold bg-purple-50"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {group}
                      </div>
                    ))}
                </div>
              </div>

              {/* Col 2: 子标签 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>子标签</span>
                  <span className="text-[10px] text-slate-400 font-normal">多选</span>
                </div>
                <input
                  type="text"
                  value={personalSubSearch}
                  onChange={(e) => setPersonalSubSearch(e.target.value)}
                  placeholder="请输入标签名称"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none shrink-0"
                />
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pt-1">
                  {(TAG_GROUPS_DATA[selectedPersonalGroupKey] || [])
                    .filter((sub) => sub.includes(personalSubSearch.trim()))
                    .map((subTag) => {
                      const isChecked = addedPersonalTags.includes(subTag);
                      return (
                        <label
                          key={subTag}
                          className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-600 select-none px-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setAddedPersonalTags(addedPersonalTags.filter((t) => t !== subTag));
                              } else {
                                setAddedPersonalTags([...addedPersonalTags, subTag]);
                              }
                            }}
                            className="accent-purple-600 w-3.5 h-3.5 rounded"
                          />
                          <span>{subTag}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Col 3: 已添加标签 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 flex flex-col h-[220px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 shrink-0">
                  <span>已添加标签</span>
                  {addedPersonalTags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddedPersonalTags([])}
                      className="text-slate-400 hover:text-rose-500 text-[10px] cursor-pointer"
                    >
                      清空
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto pt-1">
                  {addedPersonalTags.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-12">
                      暂未添加标签
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {addedPersonalTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setAddedPersonalTags(addedPersonalTags.filter((t) => t !== tag))}
                            className="text-purple-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 2: 填写脚本 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">填写脚本</h3>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <span>AI仿写免费次数200000/200000</span>
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 脚本模板 */}
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              <span className="text-rose-500 mr-0.5">*</span>脚本模板
            </label>
            <div className="flex-1 relative">
              <select
                value={scriptTemplate}
                onChange={(e) => setScriptTemplate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs appearance-none cursor-pointer"
              >
                <option value="对标翻拍">对标翻拍</option>
                <option value="口播种草">口播种草</option>
                <option value="剧情反转">剧情反转</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Script Timeline Table (画面时间轴) */}
          <div className="border border-purple-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="flex min-w-[760px]">
              {/* Vertical Header Bar */}
              <div className="w-10 bg-purple-100/90 border-r border-purple-200 flex items-center justify-center py-6 shrink-0 select-none">
                <span className="text-purple-900 font-extrabold text-xs tracking-widest [writing-mode:vertical-lr] text-center">
                  画面时间轴
                </span>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-purple-50/80 border-b border-purple-200 text-slate-700 font-bold text-xs text-center py-2.5">
                  <div className="col-span-1 border-r border-purple-200 flex items-center justify-center">序号</div>
                  <div className="col-span-2 border-r border-purple-200 flex items-center justify-center gap-1">
                    <span>画面时间点 (秒)</span>
                  </div>
                  <div className="col-span-3 border-r border-purple-200 flex items-center justify-center gap-1">
                    <span>台词/对白</span>
                  </div>
                  <div className="col-span-3 border-r border-purple-200 flex items-center justify-center">画面镜头</div>
                  <div className="col-span-2 border-r border-purple-200 flex items-center justify-center gap-1">
                    <span>画面注意事项</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">操作</div>
                </div>

                {/* Table Body Rows */}
                {scriptRows.map((row, idx) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 border-b border-slate-200/80 min-h-[140px] text-xs"
                  >
                    {/* 1. 序号 */}
                    <div className="col-span-1 border-r border-slate-200/80 flex items-center justify-center font-bold text-slate-800">
                      {idx + 1}
                    </div>

                    {/* 2. 画面时间点 (秒) */}
                    <div className="col-span-2 border-r border-slate-200/80 p-2">
                      <textarea
                        value={row.timepoint}
                        onChange={(e) => handleUpdateRow(idx, "timepoint", e.target.value)}
                        placeholder="例如: 0-3s"
                        className="w-full h-full min-h-[120px] bg-white border border-transparent hover:border-slate-200 focus:border-purple-500 rounded p-2 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    {/* 3. 台词/对白 */}
                    <div className="col-span-3 border-r border-slate-200/80 p-2">
                      <textarea
                        value={row.dialogue}
                        onChange={(e) => handleUpdateRow(idx, "dialogue", e.target.value)}
                        placeholder="请输入台词或口播文本"
                        className="w-full h-full min-h-[120px] bg-white border border-transparent hover:border-slate-200 focus:border-purple-500 rounded p-2 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    {/* 4. 画面镜头 (Shot + File Drop Area) */}
                    <div className="col-span-3 border-r border-slate-200/80 p-2 flex flex-col gap-2">
                      <textarea
                        value={row.shotDescription}
                        onChange={(e) => handleUpdateRow(idx, "shotDescription", e.target.value)}
                        placeholder="描述画面特写/分镜镜头"
                        className="w-full bg-white border border-transparent hover:border-slate-200 focus:border-purple-500 rounded p-1.5 text-xs focus:outline-none resize-none h-12"
                      />

                      {/* Dropzone Box */}
                      <div className="flex-1 bg-slate-100/80 border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center text-center relative group">
                        <p className="text-[11px] text-slate-500 font-medium mb-1.5">粘贴或拖拽至这里上传</p>
                        <label className="border border-dashed border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-slate-700 font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors">
                          <Plus className="w-3.5 h-3.5 text-purple-600" />
                          <span>添加本地文件</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUpdateRow(idx, "shotImage", e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                        {row.shotImage && (
                          <span className="text-[10px] text-purple-600 mt-1 font-medium truncate max-w-[140px]">
                            已选: {row.shotImage}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 5. 画面注意事项 */}
                    <div className="col-span-2 border-r border-slate-200/80 p-2">
                      <textarea
                        value={row.notes}
                        onChange={(e) => handleUpdateRow(idx, "notes", e.target.value)}
                        placeholder="灯光、道具或动作注意项"
                        className="w-full h-full min-h-[120px] bg-white border border-transparent hover:border-slate-200 focus:border-purple-500 rounded p-2 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    {/* 6. 操作 (+ / -) */}
                    <div className="col-span-1 flex flex-col items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddRow(idx)}
                        className="w-6 h-6 rounded-full border border-purple-300 hover:border-purple-600 text-purple-600 flex items-center justify-center hover:bg-purple-50 cursor-pointer transition-colors"
                        title="插入一行"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      {scriptRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="w-6 h-6 rounded-full border border-rose-300 hover:border-rose-600 text-rose-500 flex items-center justify-center hover:bg-rose-50 cursor-pointer transition-colors"
                          title="删除此行"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Full Width Bottom Bar: + 新增一行 */}
                <button
                  type="button"
                  onClick={() => handleAddRow()}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors border-t border-slate-200"
                >
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>新增一行</span>
                </button>
              </div>
            </div>
          </div>

          {/* Extra Video Parameters (Stacked Left Purple Headers) */}
          <div className="space-y-2 pt-2">
            {[
              { label: "视频格式", isInput: false, state: videoFormat, setter: setVideoFormat, options: ["MP4", "MOV", "AVI"] },
              { label: "视频尺寸", isInput: false, state: videoSize, setter: setVideoSize, options: ["9:16", "16:9", "1:1"] },
              { label: "字幕类型", isInput: true, state: subtitleType, setter: setSubtitleType, placeholder: "请输入字幕类型，如：内嵌字幕 / 挂载字幕 / 无字幕" },
              { label: "视频画质", isInput: false, state: videoQuality, setter: setVideoQuality, options: ["1080P", "4K", "720P"] },
              { label: "BGM", isInput: true, state: bgm, setter: setBgm, placeholder: "请输入BGM信息 / 背景音乐名称" }
            ].map((param) => (
              <div key={param.label} className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="w-36 bg-purple-100/60 border-r border-slate-200 text-slate-800 font-bold p-2.5 text-xs flex items-center shrink-0">
                  {param.label}
                </div>
                <div className="flex-1 relative flex items-center">
                  {param.isInput ? (
                    <input
                      type="text"
                      value={param.state}
                      onChange={(e) => param.setter(e.target.value)}
                      placeholder={param.placeholder}
                      className="w-full h-full bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none"
                    />
                  ) : (
                    <>
                      <select
                        value={param.state}
                        onChange={(e) => param.setter(e.target.value)}
                        className="w-full h-full bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">请选择</option>
                        {param.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* SECTION 3: 更多设置 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">更多设置</h3>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={presetPermissionConfig}
                  onChange={(e) => setPresetPermissionConfig(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-purple-500 pr-8 appearance-none cursor-pointer"
                >
                  <option value="">选择预设配置</option>
                  <option value="p1">公开访问配置</option>
                  <option value="p2">仅团队访问配置</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>存为预设模板</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. 谁可以看 */}
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              <span className="text-rose-500 mr-0.5">*</span>谁可以看
            </label>
            <div className="flex items-center gap-5 text-xs font-bold text-slate-700">
              {(["公开", "团队成员", "小组成员", "公用资源", "指定范围"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="scriptViewPermission"
                    checked={viewPermission === opt}
                    onChange={() => setViewPermission(opt)}
                    className="accent-purple-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{opt}</span>
                  {opt === "公用资源" && <HelpCircle className="w-3.5 h-3.5 text-slate-400 ml-0.5" />}
                </label>
              ))}
            </div>
          </div>

          {/* 2. 修改日期 */}
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-slate-700 text-right shrink-0">
              修改日期
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  placeholder="请选择生效时间"
                  className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                />
              </div>
              <span className="text-[11px] text-slate-400">将在所选日期 00:00 自动修改脚本查看权限</span>
            </div>
          </div>

          {/* 3. 提醒谁看 */}
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <label className="w-24 font-bold text-slate-700 text-right shrink-0">
                提醒谁看
              </label>

              <div className="flex-1 flex items-center gap-3">
                <div className="relative w-44">
                  <select
                    value={reminderUser}
                    onChange={(e) => setReminderUser(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs appearance-none pr-8"
                  >
                    <option value="">请选择</option>
                    <option value="user1">李明 (剪辑负责人)</option>
                    <option value="user2">王芳 (项目经理)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <span className="font-bold text-slate-700 shrink-0">并发送消息</span>

                <input
                  type="text"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="请输入消息"
                  className="flex-1 bg-white border border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none transition-colors shadow-2xs"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="px-8 py-3 bg-white border-t border-slate-200/80 flex items-center justify-end gap-3 shrink-0 shadow-lg">
        <button
          type="button"
          onClick={() => handlePublish(true)}
          disabled={isSubmitting}
          className="bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 text-purple-700 font-bold text-xs px-5 py-2 rounded-full transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
        >
          <span>发布后，相同配置继续上传</span>
          <HelpCircle className="w-4 h-4 text-purple-500 stroke-[1.75]" />
        </button>

        <button
          type="button"
          onClick={() => handlePublish(false)}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs px-9 py-2 rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "正在发布..." : "发布"}
        </button>
      </div>

    </div>
  );
}
