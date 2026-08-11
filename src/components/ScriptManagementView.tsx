import React, { useState } from "react";
import ScriptDetailPage from "./ScriptDetailPage";
import { TaskItem } from "./TaskCollaborationView";
import {
  Search,
  Plus,
  Copy,
  Share2,
  Send,
  Eye,
  RotateCcw,
  Download,
  Filter,
  Check,
  X,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  HelpCircle,
  Tag,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Film
} from "lucide-react";

// Cascader Department Tree
const DEPT_TREE = [
  {
    name: "剪辑一组",
    subGroups: [
      { name: "视频后发", members: ["张三", "李四", "王五", "赵六"] },
      { name: "特效包装", members: ["钱七", "孙八"] }
    ]
  },
  {
    name: "拍摄一组",
    subGroups: [
      { name: "现场摄制", members: ["周九", "吴十"] },
      { name: "灯光布景", members: ["郑十一", "王十二"] }
    ]
  },
  {
    name: "AIGC爆款拆解部",
    subGroups: [
      { name: "抖音投流组", members: ["鲁月园", "刘弯", "陈晨"] },
      { name: "快手投流组", members: ["梁浩然", "莫钦全", "蔡卓良"] }
    ]
  }
];

const PRODUCTS_LIST = [
  "得力双头马克笔",
  "温和净透洗面奶",
  "控油蓬松洗发水",
  "儿童防晒喷雾",
  "植萃舒缓面膜",
  "全自动咖啡机",
  "无线降噪耳机"
];

const SCRIPT_TYPES = [
  "爆款拆解",
  "口播种草",
  "情景剧演出",
  "产品测评",
  "对比实验",
  "开箱体验",
  "专家科普"
];

export interface ScriptTaskItem {
  id: string;
  name: string;
  assignee: string;
  department?: string;
  deadline?: string;
  status: "已完成" | "进行中" | "待处理";
  updatedAt: string;
}

interface ScriptItem {
  id: string;
  title: string;
  author: string;
  categoryTag: string; // e.g. "AI分镜拆解"
  content: string;
  status: "待审核" | "审核通过" | "驳回-待修改";
  mainCategory: string;
  primaryCategory: string;
  secondaryCategory: string;
  classTag: string; // e.g. "演示分类 / 卸妆油 (仅内部)"
  descTag: string;  // e.g. "标签描述"
  tasksCount: number;
  tasks: ScriptTaskItem[];
  createdAt: string;
  scenesCount: number;
}

interface ScriptManagementViewProps {
  onTriggerTask?: (type: any, name: string, inputFiles: string[], cost: number) => void;
  onNavigateToTaskDetail?: (task: TaskItem) => void;
  onDetailStateChange?: (isDetail: boolean) => void;
}

export default function ScriptManagementView({ onTriggerTask, onNavigateToTaskDetail, onDetailStateChange }: ScriptManagementViewProps) {
  // Main filter states
  const [selectedMainCat, setSelectedMainCat] = useState("全部");
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState("全部");
  const [secondarySearch, setSecondarySearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部");
  const [publicTagSearch, setPublicTagSearch] = useState("");
  const [personalTagSearch, setPersonalTagSearch] = useState("");
  const [selectedPersonalTag, setSelectedPersonalTag] = useState("全部");
  const [sortBy, setSortBy] = useState("最新发布");
  const [isMorePrimaryExpanded, setIsMorePrimaryExpanded] = useState(false);

  // Preset filter saving
  const [selectedPreset, setSelectedPreset] = useState("");
  const [presets, setPresets] = useState<Array<{ name: string; mainCat: string; primaryCat: string }>>([
    { name: "洗发水", mainCat: "个护家清", primaryCat: "个人护理" },
    { name: "卸妆油模板", mainCat: "美妆", primaryCat: "美妆护肤" }
  ]);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");

  // Export Modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel">("csv");

  // View / Action Modals
  const [selectedScriptForTasks, setSelectedScriptForTasks] = useState<ScriptItem | null>(null);
  const [selectedScriptForPublish, setSelectedScriptForPublish] = useState<ScriptItem | null>(null);
  const [selectedScriptForDetail, setSelectedScriptForDetail] = useState<ScriptItem | null>(null);

  React.useEffect(() => {
    onDetailStateChange?.(!!selectedScriptForDetail);
  }, [selectedScriptForDetail, onDetailStateChange]);
  const [showCreateScriptModal, setShowCreateScriptModal] = useState(false);

  // Form State for Publish Task Modal (新增任务 Modal matching reference image)
  const [taskFormState, setTaskFormState] = useState({
    assigneePath: "剪辑一组 / 视频后发 / 张三",
    orderCount: 1 as number | string,
    deadlineDate: "2026-08-15",
    visibilityType: "none" as "none" | "specified",
    visibilityRange: "public" as "public" | "public_resource" | "specified_range",
    specifiedTeam: "",
    specifiedGroup: "",
    specifiedPerson: "",
    publicDate: "2026-08-07",
    remark: "",
    product: "得力双头马克笔",
    scriptType: "爆款拆解"
  });
  const [taskFormErrors, setTaskFormErrors] = useState<Record<string, string>>({});
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(0);
  const [activeSubGroupIndex, setActiveSubGroupIndex] = useState<number | null>(0);

  const openPublishTaskModal = (script: ScriptItem) => {
    setSelectedScriptForPublish(script);
    setTaskFormState({
      assigneePath: "剪辑一组 / 视频后发 / 张三",
      orderCount: 1,
      deadlineDate: "2026-08-15",
      visibilityType: "none",
      visibilityRange: "public",
      specifiedTeam: "",
      specifiedGroup: "",
      specifiedPerson: "",
      publicDate: "2026-08-07",
      remark: "",
      product: "得力双头马克笔",
      scriptType: "爆款拆解"
    });
    setTaskFormErrors({});
    setIsDeptDropdownOpen(false);
  };

  // New Script form
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [newScriptCategory, setNewScriptCategory] = useState("美妆护肤");
  const [newScriptContent, setNewScriptContent] = useState("");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleViewTaskDetail = (task: ScriptTaskItem) => {
    if (!selectedScriptForTasks) return;
    const taskItem: TaskItem = {
      id: task.id || "06131146256",
      publisher: "徐振",
      publishDate: "2026-06-12",
      deadlineDate: task.deadline || "2026-07-02",
      assignee: task.assignee.split(" ")[0] || task.assignee,
      assigneeDeptPath: task.department || `${task.assignee}`,
      orderCount: 8,
      completedCount: task.status === "已完成" ? 8 : 2,
      status: task.status === "已完成" ? "completed" : task.status === "进行中" ? "in_progress" : "pending",
      cost: 0,
      associatedScript: {
        title: selectedScriptForTasks.title,
        status: "可以拍摄",
        versionCount: 2
      },
      product: selectedScriptForTasks.primaryCategory || "美妆护肤",
      scriptType: selectedScriptForTasks.categoryTag || "AI分镜拆解",
      scriptDeconstruction: "已拆解",
      remark: `关联脚本: ${selectedScriptForTasks.title}`
    };

    setSelectedScriptForTasks(null);
    if (onNavigateToTaskDetail) {
      onNavigateToTaskDetail(taskItem);
    }
  };

  // Mock script dataset
  const [scripts, setScripts] = useState<ScriptItem[]>([
    {
      id: "S-10291",
      title: "脚本 1 - 口播温和洁面破圈案",
      author: "致上致上致上",
      categoryTag: "AI分镜拆解",
      content: "1: 哪怕是你一周染一次，也不会损伤你的头发，什么干枯毛躁，开叉打结都不会，就这样按一洗，洗出丰富的泡沫，使劲揉，使劲搓啊，它也不沾头皮...",
      status: "待审核",
      mainCategory: "个护家清",
      primaryCategory: "个人护理",
      secondaryCategory: "洗发护发",
      classTag: "演示分类 / 卸妆油 (仅内部)",
      descTag: "爆款洗发水口播",
      tasksCount: 2,
      tasks: [
        {
          id: "06131146256",
          name: "脚本 1 - 口播温和洁面破圈案",
          assignee: "张三 (剪辑组)",
          department: "剪辑一组 / 视频后发 / 张三",
          deadline: "2026-07-02",
          status: "已完成",
          updatedAt: "2026-08-04 14:20"
        },
        {
          id: "06131146255",
          name: "脚本 1 - 口播温和洁面破圈案",
          assignee: "李四 (拍摄组)",
          department: "拍摄一组 / 现场摄制 / 李四",
          deadline: "2026-07-05",
          status: "进行中",
          updatedAt: "2026-08-04 10:15"
        }
      ],
      createdAt: "2026-08-04 11:30",
      scenesCount: 6
    },
    {
      id: "S-10292",
      title: "脚本 2 - 植萃修护洗发水评测",
      author: "致上致上致上",
      categoryTag: "AI分镜拆解",
      content: "1: 哪怕是你一周染一次，也不会损伤你的头发，什么干枯毛躁，开叉打结都不会，就这样按一洗，洗出丰富的泡沫，使劲揉，使劲搓啊，它也不沾头皮...",
      status: "待审核",
      mainCategory: "个护家清",
      primaryCategory: "个人护理",
      secondaryCategory: "洗发护发",
      classTag: "演示分类 / 卸妆油 (仅内部)",
      descTag: "标签描述",
      tasksCount: 0,
      tasks: [],
      createdAt: "2026-08-03 16:45",
      scenesCount: 5
    },
    {
      id: "S-10293",
      title: "脚本 3 - 卸妆油乳化深度实验",
      author: "致上致上致上",
      categoryTag: "AI分镜拆解",
      content: "1: 哪怕是你一周染一次，也不会损伤你的头发，什么干枯毛躁，开叉打结都不会，就这样按一洗，洗出丰富的泡沫，使劲揉，使劲搓啊，它也不沾头皮...",
      status: "审核通过",
      mainCategory: "美妆",
      primaryCategory: "美妆护肤",
      secondaryCategory: "卸妆清洁",
      classTag: "演示分类 / 卸妆油 (仅内部)",
      descTag: "标签描述",
      tasksCount: 1,
      tasks: [
        { id: "T-803", name: "卸妆油实测1080P混剪", assignee: "王剪辑", status: "已完成", updatedAt: "2026-08-02 09:10" }
      ],
      createdAt: "2026-08-02 09:00",
      scenesCount: 8
    },
    {
      id: "S-10294",
      title: "脚本 4 - 4K光感亮肤精华高能开箱",
      author: "美妆团队A",
      categoryTag: "爆款复刻",
      content: "1: 皮肤暗沉黄气重？看这条视频就够了！28天实测对比，透亮感直接拉满，质地丝滑清爽，上脸一抹即化...",
      status: "驳回-待修改",
      mainCategory: "美妆",
      primaryCategory: "美妆护肤",
      secondaryCategory: "面部精华",
      classTag: "美妆护肤 / 精华素",
      descTag: "高转化率文案",
      tasksCount: 3,
      tasks: [
        { id: "T-804", name: "精华素A/B测试投放剪辑", assignee: "刘运营", status: "进行中", updatedAt: "2026-08-01 18:30" },
        { id: "T-805", name: "千川广告高能前3秒提审", assignee: "陈主管", status: "已完成", updatedAt: "2026-08-01 15:00" },
        { id: "T-806", name: "字幕配音智能合成", assignee: "AI系统", status: "已完成", updatedAt: "2026-08-01 12:10" }
      ],
      createdAt: "2026-08-01 11:20",
      scenesCount: 7
    },
    {
      id: "S-10295",
      title: "脚本 5 - 秋冬穿搭羊绒大衣氛围感种草",
      author: "服饰组",
      categoryTag: "原创策划",
      content: "1: 穿对大衣真的太显贵了！今天给姐妹们推荐这款100%双面羊绒大衣，垂坠感极佳，版型遮肉修身...",
      status: "审核通过",
      mainCategory: "服饰内衣",
      primaryCategory: "童装/童鞋",
      secondaryCategory: "女装外套",
      classTag: "服饰内衣 / 羊绒大衣",
      descTag: "秋冬新品种草",
      tasksCount: 1,
      tasks: [
        { id: "T-807", name: "羊绒大衣街拍场景渲染", assignee: "周导", status: "进行中", updatedAt: "2026-07-31 16:00" }
      ],
      createdAt: "2026-07-31 14:10",
      scenesCount: 9
    }
  ]);

  // Selected row checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === scripts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(scripts.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter handlers
  const handleResetFilters = () => {
    setSelectedMainCat("全部");
    setSelectedPrimaryCat("全部");
    setSecondarySearch("");
    setSelectedStatus("全部");
    setPublicTagSearch("");
    setPersonalTagSearch("");
    setSelectedPersonalTag("全部");
    setSortBy("最新发布");
    setSelectedPreset("");
    showToast("已重置所有筛选条件");
  };

  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;
    const newP = {
      name: presetNameInput.trim(),
      mainCat: selectedMainCat,
      primaryCat: selectedPrimaryCat
    };
    setPresets(prev => [...prev, newP]);
    setSelectedPreset(newP.name);
    setShowSavePresetModal(false);
    setPresetNameInput("");
    showToast(`已成功保存常用筛选预设: ${newP.name}`);
  };

  const handleRemovePreset = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets(prev => prev.filter(p => p.name !== name));
    if (selectedPreset === name) setSelectedPreset("");
    showToast(`已删除筛选预设: ${name}`);
  };

  const handleApplyPreset = (name: string) => {
    setSelectedPreset(name);
    const p = presets.find(item => item.name === name);
    if (p) {
      setSelectedMainCat(p.mainCat);
      setSelectedPrimaryCat(p.primaryCat);
      showToast(`已载入常用筛选预设: ${name}`);
    }
  };

  // Actions
  const handleCopyScript = (script: ScriptItem) => {
    const cloned: ScriptItem = {
      ...script,
      id: `S-${Math.floor(10000 + Math.random() * 90000)}`,
      title: `${script.title} (副本)`,
      status: "待审核",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      tasksCount: 0,
      tasks: []
    };
    setScripts(prev => [cloned, ...prev]);
    showToast(`已生成新脚本: ${cloned.title}`);
  };

  const handleShareLink = (script: ScriptItem) => {
    const shareUrl = `http://ygj-zssoft.sucaicloud.com/#/script-detail/${script.id}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    showToast(`已复制脚本链接到剪贴板！\n${shareUrl}`);
  };

  const handleExportSubmit = () => {
    setShowExportModal(false);
    showToast(`已成功导出脚本管理数据表格 (${exportFormat.toUpperCase()} 格式)`);
  };

  const handlePublishTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScriptForPublish) return;

    const errors: Record<string, string> = {};
    if (!taskFormState.assigneePath) {
      errors.assigneePath = "请选择指派人员/部门";
    }
    if (!taskFormState.orderCount || Number(taskFormState.orderCount) <= 0) {
      errors.orderCount = "请输入有效下单数量";
    }
    if (!taskFormState.deadlineDate) {
      errors.deadlineDate = "请选择出片日期";
    }
    if (!taskFormState.product) {
      errors.product = "请选择产品";
    }

    if (Object.keys(errors).length > 0) {
      setTaskFormErrors(errors);
      return;
    }

    const scriptToPub = selectedScriptForPublish;
    const assigneeName = taskFormState.assigneePath.split("/").pop()?.trim() || "未指定";

    const newTask: ScriptTaskItem = {
      id: `T-${Math.floor(800 + Math.random() * 200)}`,
      name: `${scriptToPub.title}`,
      assignee: assigneeName,
      department: taskFormState.assigneePath,
      deadline: taskFormState.deadlineDate,
      status: "进行中",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setScripts(prev => prev.map(s => {
      if (s.id === scriptToPub.id) {
        return {
          ...s,
          tasksCount: s.tasksCount + 1,
          tasks: [newTask, ...s.tasks]
        };
      }
      return s;
    }));

    if (onTriggerTask) {
      onTriggerTask("script_video", `${scriptToPub.title} - 新增任务`, [scriptToPub.title], 5);
    }

    setSelectedScriptForPublish(null);
    showToast(`发布任务成功！关联脚本: ${scriptToPub.title}`);
  };

  const handleCreateNewScriptSubmit = () => {
    if (!newScriptTitle.trim()) {
      showToast("请输入脚本标题");
      return;
    }
    const created: ScriptItem = {
      id: `S-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newScriptTitle.trim(),
      author: "致上致上致上",
      categoryTag: "AI分镜拆解",
      content: newScriptContent.trim() || "1: 美妆爆款口播分镜拆解内容...",
      status: "待审核",
      mainCategory: "美妆",
      primaryCategory: newScriptCategory,
      secondaryCategory: "通用分类",
      classTag: `演示分类 / ${newScriptCategory}`,
      descTag: "最新创建脚本",
      tasksCount: 0,
      tasks: [],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      scenesCount: 5
    };

    setScripts(prev => [created, ...prev]);
    setShowCreateScriptModal(false);
    setNewScriptTitle("");
    setNewScriptContent("");
    showToast(`成功新建脚本《${created.title}》！`);
  };

  // Filter logic
  const filteredScripts = scripts.filter(s => {
    if (selectedMainCat !== "全部" && s.mainCategory !== selectedMainCat) return false;
    if (selectedPrimaryCat !== "全部" && s.primaryCategory !== selectedPrimaryCat) return false;
    if (selectedStatus !== "全部" && s.status !== selectedStatus) return false;
    if (secondarySearch && !s.secondaryCategory.includes(secondarySearch) && !s.title.includes(secondarySearch)) return false;
    return true;
  });

  const mainCategories = ["全部", "美妆", "个护家清", "服饰内衣", "食品饮料", "母婴宠物", "图书教育", "智能家居"];

  const primaryCategoriesFirstRow = [
    "全部", "美妆护肤", "彩妆香水", "宠物食品", "宠物用品", "婴童尿裤", "奶粉辅食",
    "婴童用品", "孕妇用品", "粮油速食", "传统滋补", "童装/童鞋"
  ];

  const primaryCategoriesSecondRow = [
    "休闲零食", "图书", "饮料冲调", "学习用品", "教育音像", "数字阅读", "家庭清洁",
    "家电好货", "美容美体", "个人护理", "化妆工具", "家居优选"
  ];

  if (selectedScriptForDetail) {
    return (
      <ScriptDetailPage
        script={selectedScriptForDetail}
        onBack={() => setSelectedScriptForDetail(null)}
        onTriggerTask={onTriggerTask}
        onUpdateScript={(updated) => {
          setScripts(prev => prev.map(s => s.id === updated.id ? updated : s));
          setSelectedScriptForDetail(updated);
        }}
        onDeleteScript={(scriptId) => {
          setScripts(prev => prev.filter(s => s.id !== scriptId));
          setSelectedScriptForDetail(null);
          showToast("已成功删除脚本！");
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-4 text-slate-800 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[80] bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="whitespace-pre-line">{toastMessage}</span>
        </div>
      )}

      {/* Filter Card 1: Top Filter Panel (Matches FinishedVideosView UI) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5 text-xs text-slate-700">
        {/* Row 1: 主类目 & 常用筛选预设 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-start md:items-center gap-2 flex-1 flex-wrap">
            <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">主 类 目：</span>
            <div className="flex flex-wrap items-center gap-3">
              {mainCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedMainCat(cat)}
                  className={`transition-colors cursor-pointer text-xs ${
                    selectedMainCat === cat
                      ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                      : "text-slate-600 hover:text-purple-600 font-normal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right: 选择常用筛选预设 + 保存 */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <select
              value={selectedPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              <option value="">选择常用筛选预设</option>
              {presets.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowSavePresetModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3.5 py-1 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>保存</span>
            </button>
          </div>
        </div>

        {/* Row 2: 一级分类 */}
        <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2 mt-0.5">一级分类：</span>
          <div className="flex-1 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            {(isMorePrimaryExpanded
              ? [...primaryCategoriesFirstRow, ...primaryCategoriesSecondRow]
              : primaryCategoriesFirstRow
            ).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedPrimaryCat(cat)}
                className={`transition-colors cursor-pointer text-xs ${
                  selectedPrimaryCat === cat
                    ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                    : "text-slate-600 hover:text-purple-600 font-normal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMorePrimaryExpanded(!isMorePrimaryExpanded)}
            className="text-purple-600 text-xs font-semibold flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer hover:underline"
          >
            <span>{isMorePrimaryExpanded ? "收起" : "更多"}</span>
            {isMorePrimaryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Row 3: 二级分类 */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">二级分类：</span>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 focus-within:border-purple-400">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索分类"
                value={secondarySearch}
                onChange={(e) => setSecondarySearch(e.target.value)}
                className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
              />
            </div>

            <button
              onClick={() => setSecondarySearch("")}
              className={`transition-colors cursor-pointer text-xs ${
                !secondarySearch
                  ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded"
                  : "text-slate-600 hover:text-purple-600 font-normal"
              }`}
            >
              全部
            </button>
          </div>
        </div>

        {/* Row 4: 状 态 */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">状 态：</span>
          <div className="flex items-center gap-2 flex-wrap">
            {["全部", "待审核", "审核通过", "驳回-待修改"].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`transition-all cursor-pointer text-xs px-2.5 py-1 rounded-lg ${
                  selectedStatus === st
                    ? "text-purple-700 bg-purple-100/80 font-bold border border-purple-200 shadow-2xs"
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-50 font-normal"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: 公共标签 */}
        <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2 mt-1">公共标签：</span>
          <div className="flex-1 flex flex-wrap items-center gap-2">
            <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 shrink-0 focus-within:border-purple-400 mr-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索标签"
                value={publicTagSearch}
                onChange={(e) => setPublicTagSearch(e.target.value)}
                className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
              />
            </div>

            <button
              onClick={() => setPublicTagSearch("")}
              className={`transition-colors cursor-pointer text-xs mr-1 ${
                !publicTagSearch ? "text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded" : "text-slate-600 font-normal hover:text-purple-600"
              }`}
            >
              全部
            </button>

            {["脚本类型", "模特", "场景", "合作达人", "创新点", "编导姓名"].map(tag => (
              <button
                key={tag}
                onClick={() => setPublicTagSearch(publicTagSearch === tag ? "" : tag)}
                className={`transition-colors cursor-pointer text-xs px-1.5 py-0.5 rounded ${
                  publicTagSearch === tag 
                    ? "text-purple-600 font-bold bg-purple-100/70 border border-purple-200" 
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-50 font-normal"
                }`}
              >
                {tag}
              </button>
            ))}

            <button
              onClick={() => setPublicTagSearch("")}
              className="text-slate-400 hover:text-purple-600 text-xs ml-2 cursor-pointer font-normal"
            >
              重置公共标签
            </button>
          </div>
        </div>

        {/* Row 6: 个人标签 */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-slate-900 font-bold shrink-0 w-20 text-right pr-2">个人标签：</span>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="relative border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 bg-white w-32 focus-within:border-purple-400">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索标签"
                value={personalTagSearch}
                onChange={(e) => setPersonalTagSearch(e.target.value)}
                className="text-xs focus:outline-none w-full placeholder:text-slate-400 font-normal"
              />
            </div>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-white">
              {["全部", "无个人标签", "有个人标签"].map(ptag => (
                <button
                  key={ptag}
                  onClick={() => setSelectedPersonalTag(ptag)}
                  className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                    selectedPersonalTag === ptag
                      ? "bg-purple-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  {ptag}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setPersonalTagSearch("");
                setSelectedPersonalTag("全部");
              }}
              className="text-slate-500 hover:text-purple-600 text-xs flex items-center gap-1 cursor-pointer ml-3 font-normal"
            >
              <span>重置个人标签</span>
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Card 2: 高级搜索 Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-900 font-bold shrink-0">高级搜索：</span>

          {/* 排序 */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
            <span className="text-slate-900 font-bold shrink-0">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-normal text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="最新发布">最新发布</option>
              <option value="最早发布">最早发布</option>
              <option value="最多关联任务">最多关联任务</option>
            </select>
          </div>

          <button
            onClick={() => showToast("已执行高级筛选检索")}
            className="border border-purple-500 text-purple-600 hover:bg-purple-50 font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>筛选</span>
          </button>

          <button
            onClick={handleResetFilters}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            重置
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            导出
          </button>
        </div>

        {/* Secondary Dropdowns Line */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer">
            <option value="">请选择脚本模板</option>
            <option value="t1">美妆爆款拆解模板</option>
            <option value="t2">服饰种草口播模板</option>
          </select>

          <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 bg-white focus:outline-none focus:border-purple-400 cursor-pointer">
            <option value="">作者</option>
            <option value="致上致上致上">致上致上致上</option>
            <option value="美妆团队A">美妆团队A</option>
          </select>

          <input
            type="text"
            placeholder="请选择(支持输入搜索)"
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-purple-400 w-36"
          />

          <div className="flex items-center gap-1 text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>上传时间</span>
            <span className="text-slate-300">|</span>
            <input type="text" placeholder="开始日期" className="w-14 focus:outline-none text-center" />
            <span>至</span>
            <input type="text" placeholder="结束日期" className="w-14 focus:outline-none text-center" />
          </div>
        </div>
      </div>

      {/* Script List Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === scripts.length && scripts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 w-48">脚本</th>
                <th className="py-3 px-4">脚本内容</th>
                <th className="py-3 px-4 w-28">状态</th>
                <th className="py-3 px-4 w-48">分类/标签</th>
                <th className="py-3 px-4 w-24">分镜</th>
                <th className="py-3 px-4 w-44 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScripts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>暂无符合条件的脚本数据</p>
                  </td>
                </tr>
              ) : (
                filteredScripts.map((script) => (
                  <tr
                    key={script.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Checkbox */}
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(script.id)}
                        onChange={() => toggleSelectOne(script.id)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>

                    {/* 脚本 (Title, Author, Tag) */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedScriptForDetail(script)}
                          className="font-bold text-slate-900 hover:text-purple-600 text-left block line-clamp-1 cursor-pointer"
                        >
                          {script.title}
                        </button>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium border border-purple-200">
                            {script.author}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {script.categoryTag}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 脚本内容 Preview */}
                    <td className="py-4 px-4">
                      <p className="text-slate-600 line-clamp-2 leading-relaxed max-w-xl font-normal">
                        {script.content}
                      </p>
                    </td>

                    {/* 状态 Badge */}
                    <td className="py-4 px-4">
                      {script.status === "待审核" && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-md text-[11px] inline-block shadow-2xs">
                          待审核
                        </span>
                      )}
                      {script.status === "审核通过" && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-md text-[11px] inline-block shadow-2xs">
                          审核通过
                        </span>
                      )}
                      {script.status === "驳回-待修改" && (
                        <span className="px-2.5 py-1 bg-rose-500 text-white font-bold rounded-md text-[11px] inline-block shadow-2xs">
                          驳回-待修改
                        </span>
                      )}
                    </td>

                    {/* 分类/标签 */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-slate-700 font-medium text-[11px]">
                          {script.classTag}
                        </div>
                        <span className="inline-block px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] border border-sky-100">
                          {script.descTag}
                        </span>
                      </div>
                    </td>

                    {/* 分镜 Count */}
                    <td className="py-4 px-4 text-slate-500">
                      <span className="font-mono">{script.scenesCount}</span> 场分镜
                    </td>

                    {/* 操作 (查看任务, 发布任务, 分享链接, 复制) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 flex-wrap">
                        {/* 查看任务 */}
                        <button
                          onClick={() => setSelectedScriptForTasks(script)}
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer text-xs"
                        >
                          查看任务({script.tasksCount})
                        </button>

                        {/* 发布任务 */}
                        <button
                          onClick={() => openPublishTaskModal(script)}
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer text-xs"
                        >
                          发布任务
                        </button>

                        {/* 分享链接 */}
                        <button
                          onClick={() => handleShareLink(script)}
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer text-xs"
                        >
                          分享链接
                        </button>

                        {/* 复制 */}
                        <button
                          onClick={() => handleCopyScript(script)}
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer text-xs"
                        >
                          复制
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Modal 1: 保存为常用筛选 (Save Preset Modal) */}
      {showSavePresetModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm border-l-4 border-purple-600 pl-2">
                保存为常用筛选
              </h3>
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <label className="text-slate-600 font-medium shrink-0">
                  <span className="text-rose-500">*</span> 名称
                </label>
                <input
                  type="text"
                  placeholder="如：洗发水"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-purple-400 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-lg cursor-pointer text-xs"
              >
                取消
              </button>
              <button
                onClick={handleSavePreset}
                className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-lg cursor-pointer shadow-2xs text-xs"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 导出 (Export Modal) */}
      {showExportModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm border-l-4 border-purple-600 pl-2">
                导出
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-6">
                <span className="text-slate-700 font-medium">导出格式</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>csv</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "excel"}
                    onChange={() => setExportFormat("excel")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>excel</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-lg cursor-pointer text-xs"
              >
                取消
              </button>
              <button
                onClick={handleExportSubmit}
                className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-lg cursor-pointer shadow-2xs text-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 查看关联任务 (View Script Tasks Modal) */}
      {selectedScriptForTasks && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <h3 className="font-bold text-slate-900 text-sm border-l-4 border-purple-600 pl-2.5">
                查看任务
              </h3>
              <button
                onClick={() => setSelectedScriptForTasks(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table Area */}
            <div className="p-5 overflow-y-auto flex-1 text-xs">
              {selectedScriptForTasks.tasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">该脚本暂未关联任何处理任务</p>
                  <button
                    onClick={() => {
                      const scr = selectedScriptForTasks;
                      setSelectedScriptForTasks(null);
                      openPublishTaskModal(scr);
                    }}
                    className="px-3.5 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>立即发布任务</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 font-bold">
                        <th className="py-3 px-4 font-bold">任务名称</th>
                        <th className="py-3 px-4 font-bold">负责人</th>
                        <th className="py-3 px-4 font-bold">部门</th>
                        <th className="py-3 px-4 font-bold">截止时间</th>
                        <th className="py-3 px-4 font-bold">进度状态</th>
                        <th className="py-3 px-4 font-bold text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedScriptForTasks.tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {t.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {t.assignee}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {t.department || "剪辑一组 / 视频后发 / 张三"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono">
                            {t.deadline || "2026-07-02"}
                          </td>
                          <td className="py-3.5 px-4">
                            {t.status === "已完成" ? (
                              <span className="inline-block px-2.5 py-0.5 bg-[#E6F4EA] text-[#137333] font-bold rounded-md text-[11px]">
                                已完成
                              </span>
                            ) : t.status === "进行中" ? (
                              <span className="inline-block px-2.5 py-0.5 bg-[#F3E8FF] text-[#7C3AED] font-bold rounded-md text-[11px]">
                                进行中
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-md text-[11px]">
                                待处理
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleViewTaskDetail(t)}
                              className="text-[#7C3AED] hover:text-purple-800 font-bold cursor-pointer transition-colors hover:underline"
                            >
                              查看
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer / Pagination matching screenshot */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-end gap-3 text-xs text-slate-500 font-sans shrink-0">
              <span>共 {selectedScriptForTasks.tasks.length} 条</span>
              <select
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:border-purple-400 cursor-pointer shadow-2xs font-medium"
                defaultValue="20条/页"
              >
                <option value="20条/页">20条/页</option>
                <option value="50条/页">50条/页</option>
                <option value="100条/页">100条/页</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed bg-slate-50 shadow-2xs font-medium"
                >
                  &lt;
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center bg-[#7C3AED] text-white font-bold rounded-lg shadow-2xs"
                >
                  1
                </button>
                <button
                  disabled
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed bg-slate-50 shadow-2xs font-medium"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: 发布任务 (Publish Task Modal - Matches reference image / ScriptDetailPage) */}
      {selectedScriptForPublish && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[70] p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            {/* Header: | 新增任务 */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  新增任务
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScriptForPublish(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handlePublishTaskSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              {/* 1. * 指派给 */}
              <div className="flex items-start gap-3 relative">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0 flex items-center justify-end">
                  <span className="text-rose-500 mr-1">*</span>指派给
                </label>

                <div className="flex-1 min-w-0 relative">
                  <div
                    onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg flex items-center justify-between cursor-pointer font-medium text-slate-800 transition-colors ${
                      taskFormErrors.assigneePath ? "border-rose-500" : isDeptDropdownOpen ? "border-purple-500 bg-white ring-2 ring-purple-500/20" : "border-slate-200 hover:bg-slate-100/50"
                    }`}
                  >
                    {taskFormState.assigneePath ? (
                      <span className="inline-flex items-center gap-1.5 bg-purple-100/70 text-purple-900 px-2 py-0.5 rounded font-medium">
                        <span>{taskFormState.assigneePath}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskFormState({ ...taskFormState, assigneePath: "" });
                          }}
                        />
                      </span>
                    ) : (
                      <span className="text-slate-400">请选择</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Cascader Dropdown */}
                  {isDeptDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full sm:w-[480px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 grid grid-cols-3 divide-x divide-slate-100 h-56 text-xs overflow-hidden">
                      {/* Column 1: Groups */}
                      <div className="overflow-y-auto py-1">
                        {DEPT_TREE.map((dept, idx) => (
                          <div
                            key={idx}
                            onMouseEnter={() => {
                              setActiveDeptIndex(idx);
                              setActiveSubGroupIndex(0);
                            }}
                            className={`px-3 py-2 flex items-center justify-between cursor-pointer font-medium transition-colors ${
                              activeDeptIndex === idx ? "bg-purple-50 text-purple-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="truncate">{dept.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>

                      {/* Column 2: Sub Groups */}
                      <div className="overflow-y-auto py-1 bg-slate-50/50">
                        {activeDeptIndex !== null &&
                          DEPT_TREE[activeDeptIndex].subGroups.map((sub, idx) => (
                            <div
                              key={idx}
                              onMouseEnter={() => setActiveSubGroupIndex(idx)}
                              className={`px-3 py-2 flex items-center justify-between cursor-pointer font-medium transition-colors ${
                                activeSubGroupIndex === idx ? "bg-purple-100/60 text-purple-800 font-bold" : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span className="truncate">{sub.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ))}
                      </div>

                      {/* Column 3: Members */}
                      <div className="overflow-y-auto py-1 bg-slate-50">
                        {activeDeptIndex !== null &&
                          activeSubGroupIndex !== null &&
                          DEPT_TREE[activeDeptIndex].subGroups[activeSubGroupIndex]?.members.map((member, idx) => {
                            const fullPath = `${DEPT_TREE[activeDeptIndex].name} / ${DEPT_TREE[activeDeptIndex].subGroups[activeSubGroupIndex].name} / ${member}`;
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  setTaskFormState({ ...taskFormState, assigneePath: fullPath });
                                  setIsDeptDropdownOpen(false);
                                  if (taskFormErrors.assigneePath) {
                                    setTaskFormErrors({ ...taskFormErrors, assigneePath: "" });
                                  }
                                }}
                                className="px-3 py-2 hover:bg-purple-600 hover:text-white cursor-pointer font-bold text-slate-800 transition-colors"
                              >
                                {member}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {taskFormErrors.assigneePath && <p className="text-rose-500 text-[11px] font-medium mt-1">{taskFormErrors.assigneePath}</p>}
                </div>
              </div>

              {/* 2. * 下单数量 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0 flex items-center justify-end">
                  <span className="text-rose-500 mr-1">*</span>下单数量
                </label>
                <div className="flex-1 min-w-0">
                  <input
                    type="number"
                    min={1}
                    placeholder="请输入"
                    value={taskFormState.orderCount || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setTaskFormState({ ...taskFormState, orderCount: val });
                      if (taskFormErrors.orderCount) setTaskFormErrors({ ...taskFormErrors, orderCount: "" });
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 transition-colors ${
                      taskFormErrors.orderCount ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {taskFormErrors.orderCount && <p className="text-rose-500 text-[11px] font-medium mt-1">{taskFormErrors.orderCount}</p>}
                </div>
              </div>

              {/* 3. * 出片日期 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0 flex items-center justify-end">
                  <span className="text-rose-500 mr-1">*</span>出片日期
                </label>
                <div className="flex-1 min-w-0 relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={taskFormState.deadlineDate}
                    onChange={(e) => {
                      setTaskFormState({ ...taskFormState, deadlineDate: e.target.value });
                      if (taskFormErrors.deadlineDate) setTaskFormErrors({ ...taskFormErrors, deadlineDate: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 transition-colors ${
                      taskFormErrors.deadlineDate ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {taskFormErrors.deadlineDate && <p className="text-rose-500 text-[11px] font-medium mt-1">{taskFormErrors.deadlineDate}</p>}
                </div>
              </div>

              {/* 4. 出片可见性 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0">
                  出片可见性
                </label>
                <div className="flex-1 min-w-0 space-y-3 pt-0.5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-lg overflow-hidden border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setTaskFormState({ ...taskFormState, visibilityType: "none" })}
                        className={`px-3.5 py-1.5 font-medium text-xs transition-colors cursor-pointer ${
                          taskFormState.visibilityType === "none"
                            ? "bg-[#7C3AED] text-white border border-[#7C3AED] shadow-2xs"
                            : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        不设置
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskFormState({ ...taskFormState, visibilityType: "specified" })}
                        className={`px-3.5 py-1.5 font-medium text-xs transition-colors cursor-pointer border-l ${
                          taskFormState.visibilityType === "specified"
                            ? "bg-[#7C3AED] text-white border border-[#7C3AED] shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        指定可见性
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTaskFormState({
                          ...taskFormState,
                          visibilityType: "specified",
                          visibilityRange: "specified_range",
                          specifiedTeam: "快手投流组",
                          specifiedGroup: "快手",
                          specifiedPerson: ""
                        });
                        showToast("已自动设定为我的小组可见");
                      }}
                      className="text-[#7C3AED] hover:text-purple-800 font-medium text-xs cursor-pointer ml-1 border-0 bg-transparent transition-colors"
                    >
                      指定我的小组
                    </button>
                  </div>

                  {/* Sub Options when 指定可见性 */}
                  {taskFormState.visibilityType === "specified" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                          <input
                            type="radio"
                            name="visibilityRange"
                            checked={taskFormState.visibilityRange === "public"}
                            onChange={() => setTaskFormState({ ...taskFormState, visibilityRange: "public" })}
                            className="accent-[#7C3AED]"
                          />
                          <span>公开</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                          <input
                            type="radio"
                            name="visibilityRange"
                            checked={taskFormState.visibilityRange === "public_resource"}
                            onChange={() => setTaskFormState({ ...taskFormState, visibilityRange: "public_resource" })}
                            className="accent-[#7C3AED]"
                          />
                          <span>公用资源</span>
                          <span title="设定为公用资源后，全公司均可共享使用">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                          <input
                            type="radio"
                            name="visibilityRange"
                            checked={taskFormState.visibilityRange === "specified_range"}
                            onChange={() => setTaskFormState({ ...taskFormState, visibilityRange: "specified_range" })}
                            className="accent-[#7C3AED]"
                          />
                          <span>指定范围</span>
                        </label>
                      </div>

                      {/* Specified Range Dropdowns */}
                      {taskFormState.visibilityRange === "specified_range" && (
                        <div className="space-y-2 pt-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-right text-xs text-slate-500 shrink-0">指定部门</span>
                            <select
                              value={taskFormState.specifiedTeam}
                              onChange={(e) => setTaskFormState({ ...taskFormState, specifiedTeam: e.target.value })}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                            >
                              <option value="">请选择</option>
                              <option value="电商运营一部">电商运营一部</option>
                              <option value="AIGC爆款拆解部">AIGC爆款拆解部</option>
                              <option value="快手投流组">快手投流组</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-16 text-right text-xs text-slate-500 shrink-0">指定小组</span>
                            <select
                              value={taskFormState.specifiedGroup}
                              onChange={(e) => setTaskFormState({ ...taskFormState, specifiedGroup: e.target.value })}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                            >
                              <option value="">请选择</option>
                              <option value="天猫投流组">天猫投流组</option>
                              <option value="快手投流组">快手投流组</option>
                              <option value="快手">快手</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-16 text-right text-xs text-slate-500 shrink-0">指定人员</span>
                            <select
                              value={taskFormState.specifiedPerson}
                              onChange={(e) => setTaskFormState({ ...taskFormState, specifiedPerson: e.target.value })}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                            >
                              <option value="">请选择</option>
                              <option value="梁浩然">梁浩然</option>
                              <option value="莫钦全">莫钦全</option>
                              <option value="蔡卓良">蔡卓良</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. 公开日期 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0">
                  公开日期
                </label>
                <div className="flex-1 min-w-0 relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={taskFormState.publicDate}
                    onChange={(e) => setTaskFormState({ ...taskFormState, publicDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* 6. 备注 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0">
                  备注
                </label>
                <div className="flex-1 min-w-0">
                  <textarea
                    rows={2}
                    placeholder="备注需求说明"
                    value={taskFormState.remark}
                    onChange={(e) => setTaskFormState({ ...taskFormState, remark: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* 7. * 产品 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0 flex items-center justify-end">
                  <span className="text-rose-500 mr-1">*</span>产品
                </label>
                <div className="flex-1 min-w-0">
                  <select
                    value={taskFormState.product}
                    onChange={(e) => {
                      setTaskFormState({ ...taskFormState, product: e.target.value });
                      if (taskFormErrors.product) setTaskFormErrors({ ...taskFormErrors, product: "" });
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 cursor-pointer transition-colors ${
                      taskFormErrors.product ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  >
                    <option value="">请选择</option>
                    {PRODUCTS_LIST.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {taskFormErrors.product && (
                    <p className="text-rose-500 text-[11px] font-medium mt-1">{taskFormErrors.product}</p>
                  )}
                </div>
              </div>

              {/* 8. 脚本类型 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0">
                  脚本类型
                </label>
                <div className="flex-1 min-w-0">
                  <select
                    value={taskFormState.scriptType}
                    onChange={(e) => setTaskFormState({ ...taskFormState, scriptType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="">请选择</option>
                    {SCRIPT_TYPES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 9. 关联脚本 (Auto-associated to current selected script) */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0">
                  关联脚本
                </label>
                <div className="flex-1 min-w-0">
                  <div className="w-full px-3 py-2 bg-purple-50/80 border border-purple-200 rounded-lg flex items-center justify-between font-bold text-purple-900">
                    <span className="truncate">{selectedScriptForPublish.title}</span>
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] rounded font-extrabold shrink-0 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      已自动关联
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedScriptForPublish(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: 新建脚本 Modal */}
      {showCreateScriptModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm border-l-4 border-purple-600 pl-2">
                新建脚本工程
              </h3>
              <button
                onClick={() => setShowCreateScriptModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  <span className="text-rose-500">*</span> 脚本标题
                </label>
                <input
                  type="text"
                  placeholder="请输入脚本标题 (如：卸妆油清爽洁肤30秒口播)"
                  value={newScriptTitle}
                  onChange={(e) => setNewScriptTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">一级分类</label>
                <select
                  value={newScriptCategory}
                  onChange={(e) => setNewScriptCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="美妆护肤">美妆护肤</option>
                  <option value="个人护理">个人护理</option>
                  <option value="童装/童鞋">童装/童鞋</option>
                  <option value="家庭清洁">家庭清洁</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">脚本分镜文案</label>
                <textarea
                  rows={4}
                  placeholder="1: 镜头1 - 展现产品使用前干枯毛躁画面&#10;2: 镜头2 - 洗发水揉搓丰富泡沫特写..."
                  value={newScriptContent}
                  onChange={(e) => setNewScriptContent(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateScriptModal(false)}
                className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-lg cursor-pointer text-xs"
              >
                取消
              </button>
              <button
                onClick={handleCreateNewScriptSubmit}
                className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-lg cursor-pointer shadow-2xs text-xs"
              >
                保存脚本
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
