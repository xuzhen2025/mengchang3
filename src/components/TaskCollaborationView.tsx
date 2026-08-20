import React, { useState, useEffect } from "react";
import LinkScriptModal from "./LinkScriptModal";
import { TaskDetailPage } from "./TaskDetailPage";
import { TASK_BINDINGS_KEY, TaskResourceBinding } from "./PersonalResourceCenter";
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  RotateCcw,
  Settings,
  Maximize2,
  BarChart2,
  Download,
  X,
  Check,
  Edit3,
  Copy,
  Trash2,
  HelpCircle,
  FileText,
  Video,
  Image,
  Music,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Users,
  Building2,
  FolderKanban,
  Sparkles,
  Layers,
  ArrowRight,
  Link2,
  FileEdit
} from "lucide-react";

export interface AssociatedWorkItem {
  id: string;
  type: "video" | "image" | "text" | "audio" | "成片" | "素材" | "图片" | "音频";
  name: string;
  numericId?: string;
  coverUrl?: string;
  status?: string;
  author?: string;
  createdAt?: string;
  category?: string;
  publicTags?: string[];
  personalTags?: string[];
  cost?: number;
  duration?: string;
  resolution?: string;
  size?: string;
  subtitle?: string;
  content?: string;
  scenesCount?: number;
  downloads?: number;
  shares?: number;
  cuts?: number;
  filesCount?: number;
}

export interface AssociatedScriptItem {
  id?: string;
  title: string;
  template?: string;
  status: "待审核" | "可以拍摄" | "改写" | "无关联" | "已通过";
  versionCount?: number;
  product?: string;
  scriptType?: string;
  publishTime?: string;
}

export interface TaskItem {
  id: string;
  publisher: string;
  publishDate: string;
  deadlineDate: string;
  assignee: string;
  assigneeDeptPath?: string;
  orderCount: number;
  completedCount: number;
  status: "pending" | "in_progress" | "review" | "completed";
  cost: number;
  associatedScript?: AssociatedScriptItem;
  associatedScripts?: AssociatedScriptItem[];
  associatedWorks?: AssociatedWorkItem[];
  product?: string;
  scriptType?: string;
  scriptDeconstruction?: string;
  visibilityType?: "none" | "specified" | "group";
  visibilityRange?: "public" | "public_resource" | "specified_range";
  specifiedTeam?: string;
  specifiedGroup?: string;
  specifiedPerson?: string;
  publicDate?: string;
  remark?: string;
  completionSnapshot?: AssociatedWorkItem[];
  completedAt?: string;
  completedBy?: string;
}

interface TaskCollaborationViewProps {
  onNavigateToDelivery?: () => void;
  onNavigateToMaterials?: () => void;
  initialDetailTask?: TaskItem | null;
  onClearInitialDetailTask?: () => void;
  initialTab?: "to_me" | "my_published" | "all";
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "08201150318",
    publisher: "徐振",
    publishDate: "2026-08-18",
    deadlineDate: "2026-08-20",
    assignee: "梁浩然",
    assigneeDeptPath: "天猫/拼多多组 / 天猫 / 梁浩然",
    orderCount: 5,
    completedCount: 5,
    status: "review",
    cost: 360,
    associatedScript: { title: "【秋季风衣】通勤场景三版混剪", status: "可以拍摄", versionCount: 2 },
    associatedWorks: [
      { id: "review-w-1", numericId: "110332301", type: "video", name: "风衣通勤地铁版_V1.mp4", status: "待审核", author: "梁浩然", createdAt: "2026-08-20 09:18", category: "女装", publicTags: ["场景", "产品名称"], personalTags: ["通勤系列"], duration: "00:29", resolution: "1080p", size: "32.4 MB", downloads: 2, shares: 1, cuts: 6, coverUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=480&auto=format&fit=crop&q=80" },
      { id: "review-w-2", numericId: "110332302", type: "素材", name: "风衣面料防风细节原始素材.mp4", status: "未审核", author: "梁浩然", createdAt: "2026-08-20 09:42", category: "商品实拍", publicTags: ["产品名称", "空镜"], duration: "00:18", resolution: "2K", size: "28.7 MB", downloads: 1, cuts: 3, coverUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=480&auto=format&fit=crop&q=80" },
      { id: "review-w-3", numericId: "110332303", type: "text", name: "秋季风衣通勤口播成稿.docx", status: "待审核", author: "梁浩然", createdAt: "2026-08-20 10:02", category: "口播种草", subtitle: "通勤场景", content: "早晚温差大的通勤季，一件轻量防风风衣即可兼顾地铁、办公室与户外场景。", scenesCount: 6, publicTags: ["脚本类型", "场景"] },
      { id: "review-w-4", numericId: "110332304", type: "image", name: "风衣通勤场景封面图.png", status: "已通过", author: "梁浩然", createdAt: "2026-08-20 10:18", category: "封面", subtitle: "竖版视频封面", resolution: "1080x1440", size: "2.6 MB", downloads: 4, filesCount: 1, publicTags: ["场景", "产品名称"], personalTags: ["重点验收"], coverUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=480&auto=format&fit=crop&q=80" },
      { id: "review-w-5", numericId: "110332305", type: "audio", name: "风衣通勤版旁白.wav", status: "待审核", author: "梁浩然", createdAt: "2026-08-20 10:32", category: "真人配音", subtitle: "女声·轻快", duration: "00:31", size: "5.8 MB", downloads: 2, publicTags: ["场景", "合作达人"] }
    ],
    product: "秋季通勤风衣",
    scriptType: "场景混剪",
    scriptDeconstruction: "已拆解",
    remark: "资源数量已达标，等待任务发布人验收确认"
  },
  {
    id: "06131146256",
    publisher: "徐振",
    publishDate: "2026-06-12",
    deadlineDate: "2026-06-13",
    assignee: "梁浩然",
    assigneeDeptPath: "天猫/拼多多组 / 天猫 / 梁浩然",
    orderCount: 8,
    completedCount: 0,
    status: "pending",
    cost: 0,
    associatedScript: {
      title: "【完美记忆】无钢圈内衣卡点混剪",
      status: "可以拍摄",
      versionCount: 2
    },
    associatedScripts: [
      { id: "S-101", title: "【完美记忆】无钢圈内衣卡点混剪", status: "可以拍摄", versionCount: 2, template: "通用模板", product: "6017无钢圈内衣", scriptType: "混剪卡点" },
      { id: "S-102", title: "【完美记忆】舒适透气细节对比", status: "待审核", versionCount: 1, template: "暴利卡点", product: "6017无钢圈内衣", scriptType: "痛点对比" }
    ],
    product: "6017无钢圈内衣",
    scriptType: "剧情演绎",
    scriptDeconstruction: "填写拆解表",
    remark: "另：复刻可正常提交当储备，合适也会安排"
  },
  {
    id: "06131146255",
    publisher: "徐振",
    publishDate: "2026-06-12",
    deadlineDate: "2026-06-13",
    assignee: "莫钦全",
    assigneeDeptPath: "快手投流组 / 快手 / 莫钦全",
    orderCount: 8,
    completedCount: 3,
    status: "in_progress",
    cost: 450,
    associatedScript: {
      title: "【爆款改写】无钢圈内衣舒适度实测",
      status: "可以拍摄",
      versionCount: 2
    },
    associatedScripts: [
      { id: "S-201", title: "【爆款改写】无钢圈内衣舒适度实测", status: "可以拍摄", versionCount: 2, template: "通用模板", product: "6017无钢圈内衣", scriptType: "痛点对比" },
      { id: "S-202", title: "【爆款改写】软支撑穿搭体验分镜", status: "可以拍摄", versionCount: 1, template: "信息流种草", product: "6017无钢圈内衣", scriptType: "开箱测评" }
    ],
    associatedWorks: [
      { id: "w_250319", type: "video", name: "250319定卖点混剪视频", status: "待审核" }
    ],
    product: "6017无钢圈内衣",
    scriptType: "痛点对比",
    scriptDeconstruction: "填写拆解表",
    remark: "本周训练二创为主，8条的任务都是二创。\n另：复刻可正常提交当储备，合适也会安排"
  },
  {
    id: "06061131660",
    publisher: "蔡卓良",
    publishDate: "2026-06-01",
    deadlineDate: "2026-06-06",
    assignee: "徐振",
    assigneeDeptPath: "快手投流组 / 磁力引擎 / 徐振",
    orderCount: 5,
    completedCount: 5,
    status: "completed",
    cost: 1200,
    associatedScript: {
      title: "【抗衰精华】A醇精油夜间修复种草",
      status: "可以拍摄",
      versionCount: 1
    },
    associatedScripts: [
      { id: "S-301", title: "【抗衰精华】A醇精油夜间修复种草", status: "可以拍摄", versionCount: 1, template: "口播种草", product: "抗衰精华液", scriptType: "口播种草" }
    ],
    associatedWorks: [
      { id: "w_20250328", type: "video", name: "抗衰精华实测特写01.mp4", status: "通过" }
    ],
    product: "抗衰精华液",
    scriptType: "口播种草",
    scriptDeconstruction: "已拆解",
    remark: "质感要求极高，请使用高清晰度4K打光源"
  },
  {
    id: "06201148431",
    publisher: "徐振",
    publishDate: "2026-06-15",
    deadlineDate: "2026-06-20",
    assignee: "蔡卓良",
    assigneeDeptPath: "快手投流组 / 磁力引擎 / 蔡卓良",
    orderCount: 8,
    completedCount: 2,
    status: "in_progress",
    cost: 300,
    associatedScript: {
      title: "【补水面膜】夏季晒后修护混剪",
      status: "待审核",
      versionCount: 2
    },
    associatedScripts: [
      { id: "S-401", title: "【补水面膜】夏季晒后修护混剪", status: "待审核", versionCount: 2, template: "混剪模板", product: "补水面膜", scriptType: "特写展示" }
    ],
    product: "补水面膜",
    scriptType: "特写展示",
    scriptDeconstruction: "填写拆解表",
    remark: "加急制作，本周首发"
  },
  {
    id: "06201148428",
    publisher: "蔡卓良",
    publishDate: "2026-06-14",
    deadlineDate: "2026-06-18",
    assignee: "徐振",
    assigneeDeptPath: "快手投流组 / 磁力引擎 / 徐振",
    orderCount: 6,
    completedCount: 6,
    status: "completed",
    cost: 1800,
    associatedScript: {
      title: "【秋装风衣】高爆Hook透气防风",
      status: "可以拍摄",
      versionCount: 3
    },
    associatedScripts: [
      { id: "S-501", title: "【秋装风衣】高爆Hook透气防风", status: "可以拍摄", versionCount: 3, template: "爆款二创", product: "加绒风衣", scriptType: "混剪卡点" },
      { id: "S-502", title: "【秋装风衣】加绒防风细节质感展示", status: "可以拍摄", versionCount: 1, template: "通用模板", product: "加绒风衣", scriptType: "特写展示" },
      { id: "S-503", title: "【秋装风衣】二创短视频走秀卡点", status: "待审核", versionCount: 1, template: "混剪模板", product: "加绒风衣", scriptType: "混剪卡点" }
    ],
    associatedWorks: [
      { id: "w_061801", type: "video", name: "风衣走秀快切成片_V3.mp4", status: "通过" }
    ],
    product: "加绒风衣",
    scriptType: "混剪卡点",
    scriptDeconstruction: "已拆解",
    remark: "效果优异，已完成跑量"
  },
  {
    id: "06211055102",
    publisher: "梁浩然",
    publishDate: "2026-06-18",
    deadlineDate: "2026-06-22",
    assignee: "徐振",
    assigneeDeptPath: "天猫/拼多多组 / 天猫 / 徐振",
    orderCount: 4,
    completedCount: 1,
    status: "pending",
    cost: 200,
    associatedScript: {
      title: "【防晒冰袖】户外骑行冰凉感实测",
      status: "可以拍摄",
      versionCount: 1
    },
    product: "防晒冰袖",
    scriptType: "开箱测评",
    scriptDeconstruction: "填写拆解表",
    remark: "突出冰感触感与透气网眼细节"
  },
  {
    id: "06220912301",
    publisher: "徐振",
    publishDate: "2026-06-19",
    deadlineDate: "2026-06-24",
    assignee: "王剪辑",
    assigneeDeptPath: "快手投流组 / 快手 / 王剪辑",
    orderCount: 10,
    completedCount: 10,
    status: "completed",
    cost: 2500,
    associatedScript: {
      title: "【修护霜】屏障受损肌救星口播",
      status: "可以拍摄",
      versionCount: 4
    },
    associatedWorks: [
      { id: "w_062402", type: "video", name: "修护霜对比成片_终版.mp4", status: "通过" }
    ],
    product: "修护霜",
    scriptType: "痛点对比",
    scriptDeconstruction: "已拆解",
    remark: "投放千川大盘，消耗突破5万"
  },
  {
    id: "06231146281",
    publisher: "蔡卓良",
    publishDate: "2026-08-18",
    deadlineDate: "2026-08-28",
    assignee: "徐振",
    assigneeDeptPath: "快手投流组 / 磁力引擎 / 徐振",
    orderCount: 8,
    completedCount: 5,
    status: "in_progress",
    cost: 680,
    associatedScript: { title: "【七夕礼盒】开箱与送礼场景混剪", status: "可以拍摄", versionCount: 2 },
    associatedWorks: [
      { id: "w-gift-1", type: "video", name: "七夕礼盒开箱口播01.mp4", status: "待审核" },
      { id: "w-gift-2", type: "image", name: "礼盒丝带细节特写.png", status: "未审核" },
      { id: "w-gift-3", type: "audio", name: "七夕氛围配音.wav", status: "已通过" },
      { id: "w-gift-4", type: "text", name: "送礼场景口播文案.docx", status: "待审核" },
      { id: "w-gift-5", type: "video", name: "情侣赠礼场景02.mp4", status: "待审核" }
    ],
    product: "七夕美妆礼盒",
    scriptType: "开箱测评",
    scriptDeconstruction: "已拆解",
    remark: "所有已上传资源均可计数，数量达标后等待发布人验收"
  },
  {
    id: "06231430099",
    publisher: "孙剧本",
    publishDate: "2026-06-20",
    deadlineDate: "2026-06-25",
    assignee: "徐振",
    assigneeDeptPath: "直播部 / 抖音直播 / 徐振",
    orderCount: 6,
    completedCount: 0,
    status: "pending",
    cost: 0,
    associatedScript: {
      title: "【星光吊坠】送女友生日礼物情境剧",
      status: "改写",
      versionCount: 2
    },
    product: "星光吊坠",
    scriptType: "剧情演绎",
    scriptDeconstruction: "填写拆解表",
    remark: "强调情侣节日赠礼情感价值"
  },
  {
    id: "06241600120",
    publisher: "徐振",
    publishDate: "2026-06-21",
    deadlineDate: "2026-06-26",
    assignee: "周洋",
    assigneeDeptPath: "天猫/拼多多组 / 天猫 / 周洋",
    orderCount: 5,
    completedCount: 3,
    status: "in_progress",
    cost: 800,
    associatedScript: {
      title: "【复古马丁靴】百搭穿搭卡点短视频",
      status: "可以拍摄",
      versionCount: 2
    },
    associatedWorks: [
      { id: "w_062501", type: "video", name: "马丁靴上脚卡点01.mp4", status: "待审核" }
    ],
    product: "复古马丁靴",
    scriptType: "混剪卡点",
    scriptDeconstruction: "已拆解",
    remark: "注意配合潮流BGM音频节奏"
  },
  {
    id: "06251820455",
    publisher: "莫钦全",
    publishDate: "2026-06-22",
    deadlineDate: "2026-06-27",
    assignee: "徐振",
    assigneeDeptPath: "快手投流组 / 快手 / 徐振",
    orderCount: 8,
    completedCount: 4,
    status: "in_progress",
    cost: 1000,
    associatedScript: {
      title: "【抗衰精华液】早C晚A组合推荐",
      status: "可以拍摄",
      versionCount: 3
    },
    associatedWorks: [
      { id: "w_062608", type: "video", name: "早C晚A抗衰精油切片.mp4", status: "待审核" }
    ],
    product: "抗衰精华液",
    scriptType: "口播种草",
    scriptDeconstruction: "已拆解",
    remark: "二创卡点素材已同步上传"
  }
];

// Department Tree Structure for "指派给" Cascader
const DEPT_TREE = [
  {
    name: "快手投流组",
    subGroups: [
      { name: "快手", members: ["蔡卓良", "莫钦全", "王剪辑", "张静"] },
      { name: "磁力引擎", members: ["李明", "赵强"] }
    ]
  },
  {
    name: "天猫/拼多多组",
    subGroups: [
      { name: "天猫", members: ["梁浩然", "孙悦", "周洋"] },
      { name: "拼多多", members: ["林小凡", "陈伟"] }
    ]
  },
  {
    name: "商务部",
    subGroups: [
      { name: "商务一组", members: ["刘芳", "郑洁"] },
      { name: "商务二组", members: ["吴豪", "黄薇"] }
    ]
  },
  {
    name: "ADQ投流组",
    subGroups: [
      { name: "广点通", members: ["赵千川", "徐一鸣"] }
    ]
  },
  {
    name: "视频号投流组",
    subGroups: [
      { name: "视频号", members: ["陈婷婷", "高小亮"] }
    ]
  },
  {
    name: "直播部",
    subGroups: [
      { name: "抖音直播", members: ["孙剧本", "严雪"] }
    ]
  }
];

const PRODUCTS_LIST = [
  "抗衰精华液",
  "无钢圈内衣",
  "防晒冰袖",
  "加绒风衣",
  "星光吊坠",
  "补水面膜",
  "修护霜",
  "复古马丁靴"
];

const SCRIPT_TYPES = [
  "口播种草",
  "痛点对比",
  "剧情演绎",
  "混剪卡点",
  "特写展示",
  "开箱测评"
];

// Department & Group Hierarchy for Cascading Multi-select Filters
export interface HierarchyPublisher {
  id: string;
  name: string;
}

export interface HierarchyGroup {
  id: string;
  name: string;
  publishers: HierarchyPublisher[];
}

export interface HierarchyTeam {
  id: string;
  name: string;
  groups: HierarchyGroup[];
}

const HIERARCHY_DATA: HierarchyTeam[] = [
  {
    id: "team_daren",
    name: "达人测试",
    groups: [
      {
        id: "grp_test_f3",
        name: "测试F3",
        publishers: [
          { id: "pub_f1", name: "F1" },
          { id: "pub_f2", name: "F2" },
          { id: "pub_f3ontop", name: "F3ontop" },
          { id: "pub_pinru", name: "品如" },
          { id: "pub_shanshan", name: "珊珊" }
        ]
      },
      {
        id: "grp_daren_slice",
        name: "达人切片组",
        publishers: [
          { id: "pub_daren_a", name: "达人小王" },
          { id: "pub_daren_b", name: "李主播" }
        ]
      }
    ]
  },
  {
    id: "team_xiaozhen",
    name: "小真测试团队",
    groups: [
      {
        id: "grp_edit_1",
        name: "剪辑一组",
        publishers: [
          { id: "pub_xz", name: "徐振" },
          { id: "pub_czl", name: "蔡卓良" },
          { id: "pub_zmx", name: "张美学" },
          { id: "pub_zsy", name: "周摄影" }
        ]
      },
      {
        id: "grp_edit_2",
        name: "剪辑二组",
        publishers: [
          { id: "pub_mqq", name: "莫钦全" },
          { id: "pub_lhr", name: "梁浩然" },
          { id: "pub_wjj", name: "王剪辑" }
        ]
      }
    ]
  },
  {
    id: "team_proj_1",
    name: "项目1",
    groups: [
      {
        id: "grp_sph",
        name: "视频号投流组",
        publishers: [
          { id: "pub_ctt", name: "陈婷婷" },
          { id: "pub_gxl", name: "高小亮" }
        ]
      },
      {
        id: "grp_cili",
        name: "磁力引擎组",
        publishers: [
          { id: "pub_lm", name: "李明" },
          { id: "pub_zq", name: "赵强" }
        ]
      }
    ]
  },
  {
    id: "team_rooooongz",
    name: "RooooongZ团队",
    groups: [
      {
        id: "grp_rooo_1",
        name: "视觉设计组",
        publishers: [
          { id: "pub_rooo_a", name: "Rooo总监" },
          { id: "pub_rooo_b", name: "阿荣" }
        ]
      }
    ]
  },
  {
    id: "team_xxsu",
    name: "xx素颜霜",
    groups: [
      {
        id: "grp_xxsu_1",
        name: "美妆运营组",
        publishers: [
          { id: "pub_xx_a", name: "小美" },
          { id: "pub_xx_b", name: "莉莉" }
        ]
      }
    ]
  },
  {
    id: "team_douyin",
    name: "抖音投放",
    groups: [
      {
        id: "grp_qianchuan",
        name: "千川剧本拆解组",
        publishers: [
          { id: "pub_zqc", name: "赵千川" },
          { id: "pub_xym", name: "徐一鸣" }
        ]
      },
      {
        id: "grp_zhibo",
        name: "抖音直播组",
        publishers: [
          { id: "pub_sjb", name: "孙剧本" },
          { id: "pub_yx", name: "严雪" }
        ]
      }
    ]
  }
];

export default function TaskCollaborationView({
  onNavigateToDelivery,
  onNavigateToMaterials,
  initialDetailTask,
  onClearInitialDetailTask,
  initialTab = "all"
}: TaskCollaborationViewProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const snapshots = JSON.parse(window.localStorage.getItem("cloud_video_task_completion_snapshots_v1") || "{}") as Record<string, Partial<TaskItem>>;
      return INITIAL_TASKS.map((task) => snapshots[task.id] ? { ...task, ...snapshots[task.id] } : task);
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    const syncBindings = () => {
      let bindings: TaskResourceBinding[] = [];
      try {
        bindings = JSON.parse(window.localStorage.getItem(TASK_BINDINGS_KEY) || "[]") as TaskResourceBinding[];
      } catch {
        bindings = [];
      }
      setTasks((current) => current.map((task) => {
        if (task.status === "completed") return task;
        const taskBindings = bindings.filter((binding) => binding.taskId === task.id);
        const existing = task.associatedWorks || [];
        const merged = [...existing];
        taskBindings.forEach((binding) => {
          if (!merged.some((work) => work.id === `resource-${binding.resourceId}` || work.name === binding.resourceName)) {
            merged.push({
              id: `resource-${binding.resourceId}`,
              type: binding.resourceType === "document" ? "text" : binding.resourceType === "template" ? "image" : binding.resourceType,
              name: binding.resourceName,
              coverUrl: binding.resourceUrl,
              status: "未审核",
              author: binding.boundBy,
              createdAt: binding.boundAt
            });
          }
        });
        const completedCount = Math.min(task.orderCount, Math.max(task.completedCount, merged.length));
        return {
          ...task,
          associatedWorks: merged,
          completedCount,
          status: completedCount >= task.orderCount ? "review" : completedCount > 0 ? "in_progress" : "pending"
        };
      }));
    };
    syncBindings();
    window.addEventListener("task-resource-bindings-changed", syncBindings);
    return () => window.removeEventListener("task-resource-bindings-changed", syncBindings);
  }, []);

  // Top Scope Tab: "to_me" (给我的任务), "my_published" (我发布的任务), "all" (全部任务)
  const [activeTab, setActiveTab] = useState<"to_me" | "my_published" | "all">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Top Right Date Pickers
  const [dateRange, setDateRange] = useState("2026-06-01 至 2026-06-30");
  const [outputDateRange, setOutputDateRange] = useState("");

  // Second Row Multi-Dimension Cascading Filter (团队 / 分组 / 发布人)
  const [publisherDimension, setPublisherDimension] = useState<"团队" | "分组" | "发布人">("发布人");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [publisherSearchText, setPublisherSearchText] = useState<string>("");
  const [isPublisherPopoverOpen, setIsPublisherPopoverOpen] = useState<boolean>(false);
  const [hoveredTeamId, setHoveredTeamId] = useState<string>("team_daren");
  const [hoveredGroupId, setHoveredGroupId] = useState<string>("grp_test_f3");

  // Other Second Row Filters
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [videoStatusFilter, setVideoStatusFilter] = useState("all");
  const [scriptStatusFilter, setScriptStatusFilter] = useState("all");
  const [taskIdSearch, setTaskIdSearch] = useState("");
  const [scriptIdSearch, setScriptIdSearch] = useState("");
  const [remarkSearch, setRemarkSearch] = useState("");

  // Second Row Multi-Dimension Cascading Filter for Assignee (团队 / 分组 / 出片人)
  const [assigneeDimension, setAssigneeDimension] = useState<"团队" | "分组" | "出片人">("出片人");
  const [selectedAssigneeTeams, setSelectedAssigneeTeams] = useState<string[]>([]);
  const [selectedAssigneeGroups, setSelectedAssigneeGroups] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [assigneeSearchText, setAssigneeSearchText] = useState<string>("");
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState<boolean>(false);
  const [hoveredAssigneeTeamId, setHoveredAssigneeTeamId] = useState<string>("team_daren");
  const [hoveredAssigneeGroupId, setHoveredAssigneeGroupId] = useState<string>("grp_test_f3");

  // Associated Works Popover & Filter State
  const [openWorkPopoverTaskId, setOpenWorkPopoverTaskId] = useState<string | null>(null);
  const [headerWorkDropdownOpen, setHeaderWorkDropdownOpen] = useState(false);
  const [selectedWorkTypeFilter, setSelectedWorkTypeFilter] = useState("all");

  // ASSOCIATED WORK RESOURCE MODAL STATES
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [workModalTask, setWorkModalTask] = useState<TaskItem | null>(null);
  const [workModalType, setWorkModalType] = useState<"video" | "image" | "text" | "audio">("video");
  const [workModalTypeName, setWorkModalTypeName] = useState<string>("关联视频");
  const [selectedWorkId, setSelectedWorkId] = useState<string>("S001");

  const [workSearchTitle, setWorkSearchTitle] = useState("");
  const [workSearchCategory, setWorkSearchCategory] = useState("");
  const [workSearchTag, setWorkSearchTag] = useState("");
  const [workSearchAuthor, setWorkSearchAuthor] = useState("");

  // Pagination states for Work Modal
  const [workPage, setWorkPage] = useState(1);
  const [workPageSize, setWorkPageSize] = useState(5);
  const [workJumpInput, setWorkJumpInput] = useState("");

  const MOCK_RESOURCES = [
    {
      id: "S001",
      type: "video",
      title: "【Mardi】好喜欢",
      template: "对标翻拍",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 15:15:53"
    },
    {
      id: "S002",
      type: "video",
      title: "【Mardi】清掉",
      template: "对标翻拍",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 15:11:40"
    },
    {
      id: "S003",
      type: "video",
      title: "微胖宝妈这样穿",
      template: "对标翻拍",
      tags: ["单人...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 14:42:34"
    },
    {
      id: "S004",
      type: "video",
      title: "【如悦大码女装】特别显瘦",
      template: "对标翻拍",
      tags: ["单人...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 11:54:26"
    },
    {
      id: "S005",
      type: "video",
      title: "听说（焕丽女王）夏日爆款",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 01:52:43"
    },
    {
      id: "S006",
      type: "video",
      title: "听说促销（焕丽女王）第二期",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 01:51:51"
    },
    {
      id: "S007",
      type: "video",
      title: "这件送（美嘉挺）无痕内衣",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 00:24:05"
    },
    {
      id: "S008",
      type: "video",
      title: "这件送（美嘉挺）夏季新款",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 00:24:02"
    },
    {
      id: "S009",
      type: "video",
      title: "微胖宝妈夏季穿搭精选 03",
      template: "对标翻拍",
      tags: ["单人...", "显瘦..."],
      status: "已通过",
      publisher: "徐振",
      publishTime: "2026-06-21 18:30:11"
    },
    {
      id: "S010",
      type: "video",
      title: "莫代尔高弹无痕挂脖文胸短视频",
      template: "爆款复刻",
      tags: ["透气...", "热销..."],
      status: "已通过",
      publisher: "莫钦全",
      publishTime: "2026-06-21 17:10:05"
    },
    {
      id: "S011",
      type: "video",
      title: "无痕防走光内衣细节混剪",
      template: "细节展示",
      tags: ["高清...", "特写..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-21 16:45:22"
    },
    {
      id: "S012",
      type: "video",
      title: "夏季防晒穿搭种草短视频",
      template: "场景试穿",
      tags: ["户外...", "休闲..."],
      status: "已通过",
      publisher: "鲁月园",
      publishTime: "2026-06-21 14:20:00"
    },
    {
      id: "IMG-001",
      type: "image",
      title: "微信图片_20250328183510",
      template: "产品细节",
      tags: ["促销...", "高清..."],
      status: "已通过",
      publisher: "徐振",
      publishTime: "2026-06-22 14:10:20"
    },
    {
      id: "IMG-002",
      type: "image",
      title: "【美嘉挺】无痕内衣展图_02",
      template: "主图宣发",
      tags: ["单人...", "精修..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 13:00:15"
    },
    {
      id: "IMG-003",
      type: "image",
      title: "高弹面料透气孔放大展示图",
      template: "产品细节",
      tags: ["透气...", "细节..."],
      status: "已通过",
      publisher: "徐振",
      publishTime: "2026-06-21 11:20:00"
    },
    {
      id: "IMG-004",
      type: "image",
      title: "模特试穿海报主图_04",
      template: "场景海报",
      tags: ["精修...", "促销..."],
      status: "已通过",
      publisher: "鲁月园",
      publishTime: "2026-06-21 09:15:40"
    },
    {
      id: "TXT-001",
      type: "text",
      title: "爆款卖点文案_01.docx",
      template: "分镜脚本",
      tags: ["口播...", "带货..."],
      status: "已通过",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 12:30:10"
    },
    {
      id: "TXT-002",
      type: "text",
      title: "夏季限时折扣促销口播稿.docx",
      template: "活动促销",
      tags: ["话术...", "限时..."],
      status: "已通过",
      publisher: "莫钦全",
      publishTime: "2026-06-21 15:40:12"
    },
    {
      id: "AUD-001",
      type: "audio",
      title: "背景配音音频_01.mp3",
      template: "AI配音",
      tags: ["旁白...", "女声..."],
      status: "已通过",
      publisher: "鲁月园",
      publishTime: "2026-06-22 11:15:30"
    },
    {
      id: "AUD-002",
      type: "audio",
      title: "欢快卡点BGM背景音乐_02.wav",
      template: "背景音乐",
      tags: ["卡点...", "欢快..."],
      status: "已通过",
      publisher: "徐振",
      publishTime: "2026-06-20 18:22:10"
    }
  ];

  const handleOpenWorkModal = (taskId: string, type: "video" | "image" | "text" | "audio", typeName: string) => {
    setOpenWorkPopoverTaskId(null);
    const targetTask = tasks.find(t => t.id === taskId) || null;
    setWorkModalTask(targetTask);
    setWorkModalType(type);
    setWorkModalTypeName(typeName);
    setIsWorkModalOpen(true);
    setWorkSearchTitle("");
    setWorkSearchCategory("");
    setWorkSearchTag("");
    setWorkSearchAuthor("");
    setWorkPage(1);
    setWorkJumpInput("");

    const firstMatch = MOCK_RESOURCES.find(r => r.type === type) || MOCK_RESOURCES[0];
    setSelectedWorkId(firstMatch ? firstMatch.id : "S001");
  };

  const handleConfirmAssociateWork = () => {
    if (!workModalTask) return;
    const chosen = MOCK_RESOURCES.find((r) => r.id === selectedWorkId);
    if (!chosen) {
      showToast("请先选择要关联的作品");
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === workModalTask.id) {
          const existing = t.associatedWorks || [];
          if (existing.some((w) => w.name === chosen.title)) {
            showToast(`⚠️ 作品【${chosen.title}】已关联`);
            return t;
          }
          const updatedWorks: AssociatedWorkItem[] = [
            ...existing,
            {
              id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              type: chosen.type === "script" ? "video" : (chosen.type as AssociatedWorkItem["type"]),
              name: chosen.title,
              status: chosen.status
            }
          ];
          const completedCount = Math.min(t.orderCount, Math.max(t.completedCount, updatedWorks.length));
          return {
            ...t,
            associatedWorks: updatedWorks,
            completedCount,
            status: completedCount >= t.orderCount ? "review" : "in_progress"
          };
        }
        return t;
      })
    );

    showToast(`✅ 已成功关联【${workModalTypeName}】: ${chosen.title}`);
    setIsWorkModalOpen(false);
  };

  // Multi-select helper functions for Publisher
  const toggleTeamSelection = (teamName: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamName) ? prev.filter(t => t !== teamName) : [...prev, teamName]
    );
  };

  const toggleGroupSelection = (groupName: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  const toggleTeamGroupsSelection = (team: HierarchyTeam) => {
    const teamGroupNames = team.groups.map(g => g.name);
    const allSelected = teamGroupNames.every(gName => selectedGroups.includes(gName));
    if (allSelected) {
      setSelectedGroups(prev => prev.filter(g => !teamGroupNames.includes(g)));
    } else {
      setSelectedGroups(prev => Array.from(new Set([...prev, ...teamGroupNames])));
    }
  };

  const togglePublisherSelection = (pubName: string) => {
    setSelectedPublishers(prev =>
      prev.includes(pubName) ? prev.filter(p => p !== pubName) : [...prev, pubName]
    );
  };

  const toggleGroupPublishersSelection = (group: HierarchyGroup) => {
    const groupPubNames = group.publishers.map(p => p.name);
    const allSelected = groupPubNames.every(pName => selectedPublishers.includes(pName));
    if (allSelected) {
      setSelectedPublishers(prev => prev.filter(p => !groupPubNames.includes(p)));
    } else {
      setSelectedPublishers(prev => Array.from(new Set([...prev, ...groupPubNames])));
    }
  };

  const toggleTeamPublishersSelection = (team: HierarchyTeam) => {
    const teamPubNames = team.groups.flatMap(g => g.publishers.map(p => p.name));
    const allSelected = teamPubNames.every(pName => selectedPublishers.includes(pName));
    if (allSelected) {
      setSelectedPublishers(prev => prev.filter(p => !teamPubNames.includes(p)));
    } else {
      setSelectedPublishers(prev => Array.from(new Set([...prev, ...teamPubNames])));
    }
  };

  // Multi-select helper functions for Assignee
  const toggleAssigneeTeamSelection = (teamName: string) => {
    setSelectedAssigneeTeams(prev =>
      prev.includes(teamName) ? prev.filter(t => t !== teamName) : [...prev, teamName]
    );
  };

  const toggleAssigneeGroupSelection = (groupName: string) => {
    setSelectedAssigneeGroups(prev =>
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  const toggleAssigneeTeamGroupsSelection = (team: HierarchyTeam) => {
    const teamGroupNames = team.groups.map(g => g.name);
    const allSelected = teamGroupNames.every(gName => selectedAssigneeGroups.includes(gName));
    if (allSelected) {
      setSelectedAssigneeGroups(prev => prev.filter(g => !teamGroupNames.includes(g)));
    } else {
      setSelectedAssigneeGroups(prev => Array.from(new Set([...prev, ...teamGroupNames])));
    }
  };

  const toggleAssigneeSelection = (pubName: string) => {
    setSelectedAssignees(prev =>
      prev.includes(pubName) ? prev.filter(p => p !== pubName) : [...prev, pubName]
    );
  };

  const toggleAssigneeGroupAssigneesSelection = (group: HierarchyGroup) => {
    const groupPubNames = group.publishers.map(p => p.name);
    const allSelected = groupPubNames.every(pName => selectedAssignees.includes(pName));
    if (allSelected) {
      setSelectedAssignees(prev => prev.filter(p => !groupPubNames.includes(p)));
    } else {
      setSelectedAssignees(prev => Array.from(new Set([...prev, ...groupPubNames])));
    }
  };

  const toggleAssigneeTeamAssigneesSelection = (team: HierarchyTeam) => {
    const teamPubNames = team.groups.flatMap(g => g.publishers.map(p => p.name));
    const allSelected = teamPubNames.every(pName => selectedAssignees.includes(pName));
    if (allSelected) {
      setSelectedAssignees(prev => prev.filter(p => !teamPubNames.includes(p)));
    } else {
      setSelectedAssignees(prev => Array.from(new Set([...prev, ...teamPubNames])));
    }
  };

  // Third Row Sub-Filters & Sort
  const [statusSubFilter, setStatusSubFilter] = useState<"all" | "pending" | "review" | "completed">("all");
  const [sortOrder, setSortOrder] = useState<"publish_desc" | "publish_asc" | "deadline">("publish_desc");

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // FULLSCREEN TOGGLE
  const [isFullscreen, setIsFullscreen] = useState(false);

  // DECONSTRUCTION MODAL STATES
  const [isDeconstructionModalOpen, setIsDeconstructionModalOpen] = useState(false);
  const [deconstructionTask, setDeconstructionTask] = useState<TaskItem | null>(null);
  const [deconstructionZoom, setDeconstructionZoom] = useState(100);

  const [deconstructionForm, setDeconstructionForm] = useState({
    deconstructionId: "CJB-883921",
    // 对接环节 1: 人员
    photographer: "张华",
    editor: "李明",
    frameReviewer: "王强",
    techReviewer: "赵雷",
    creativeModel: "Anna",
    creativeAudio: "解说-男声1",

    // 对接环节 2: 场景与道具
    creativeScene: "室内浴室/洗手台",
    creativeLighting: "柔和明亮暖光",
    modelClothing: "简约居家服",
    modelProps: ["耳环"] as string[],
    prepProps: ["洗发露/护发素", "毛巾", "镜子"] as string[],
    prepPropsOther: "",
    specialNeeds: "例如：泼水脚本，提醒模特自带服装",

    // 备注
    remark: "请注意控制拍摄时长在15秒内，重点突出前后效果对比",

    // 拍摄拆解 - 动态分镜头行
    shots: [
      {
        id: "1",
        storyboard: "开场前3秒：模特拿洗发露特写，展示受损发质与修复效果对比",
        dialogue: "“头发干枯毛躁？别再用传统洗发水了！”",
        sampleImage: "",
        notes: "抓取强对比特写，前3秒背景音效要吸引人"
      },
      {
        id: "2",
        storyboard: "挤出产品质地特写，泡沫丰富绵密",
        dialogue: "“看看这绵密的云朵泡沫，蕴含多种植物精油”",
        sampleImage: "",
        notes: "特写镜头需光线充足，突出泡沫光泽感"
      }
    ],

    // 视频规范
    videoFormat: "MP4 / H.264",
    videoSize: "9:16 竖屏 (1080x1920)",
    subtitleType: "双语花字字幕",
    videoQuality: "1080P / 60fps",
    bgm: "轻快卡点轻音乐",

    // 过审必备
    videoBottomText: "【特惠活动】点击下方链接，买一送一限量抢购！",
    otherText: "请勿包含违禁词及夸大宣传词汇"
  });

  const handleOpenDeconstructionModal = (task: TaskItem) => {
    setDeconstructionTask(task);
    setDeconstructionForm(prev => ({
      ...prev,
      deconstructionId: `CJB-${task.id.replace('#', '')}-${Math.floor(1000 + Math.random() * 9000)}`
    }));
    setIsDeconstructionModalOpen(true);
  };

  const handleSaveDeconstruction = () => {
    if (!deconstructionTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === deconstructionTask.id
          ? { ...t, scriptDeconstruction: "已拆解" }
          : t
      )
    );
    showToast(`✅ 脚本拆解表保存成功 (${deconstructionTask.id})`);
    setIsDeconstructionModalOpen(false);
  };

  const toggleModelProp = (prop: string) => {
    setDeconstructionForm(prev => ({
      ...prev,
      modelProps: prev.modelProps.includes(prop)
        ? prev.modelProps.filter(p => p !== prop)
        : [...prev.modelProps, prop]
    }));
  };

  const togglePrepProp = (prop: string) => {
    setDeconstructionForm(prev => ({
      ...prev,
      prepProps: prev.prepProps.includes(prop)
        ? prev.prepProps.filter(p => p !== prop)
        : [...prev.prepProps, prop]
    }));
  };

  const addShotRow = () => {
    setDeconstructionForm(prev => ({
      ...prev,
      shots: [
        ...prev.shots,
        {
          id: String(Date.now()),
          storyboard: "",
          dialogue: "",
          sampleImage: "",
          notes: ""
        }
      ]
    }));
  };

  const removeShotRow = (id: string) => {
    if (deconstructionForm.shots.length <= 1) {
      showToast("⚠️ 至少保留一行分镜头");
      return;
    }
    setDeconstructionForm(prev => ({
      ...prev,
      shots: prev.shots.filter(s => s.id !== id)
    }));
  };

  const updateShotRow = (id: string, field: string, value: string) => {
    setDeconstructionForm(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [detailModalTask, setDetailModalTask] = useState<TaskItem | null>(initialDetailTask || null);

  useEffect(() => {
    if (initialDetailTask) {
      setDetailModalTask(initialDetailTask);
    }
  }, [initialDetailTask]);

  // SCRIPT ASSOCIATION MODAL STATES
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [editAssociatedModalTask, setEditAssociatedModalTask] = useState<TaskItem | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleUnlinkScript = (taskId: string, scriptTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const existing = t.associatedScripts || (t.associatedScript ? [t.associatedScript] : []);
          const updated = existing.filter((s) => s.title !== scriptTitle);
          return {
            ...t,
            associatedScript: updated.length > 0 ? updated[0] : undefined,
            associatedScripts: updated
          };
        }
        return t;
      })
    );
    showToast(`已取消关联脚本: ${scriptTitle}`);
  };

  const handleRemoveWork = (taskId: string, workId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const existing = t.associatedWorks || [];
          const updated = existing.filter((w) => w.id !== workId);
          const completedCount = Math.min(t.completedCount, updated.length);
          return {
            ...t,
            associatedWorks: updated,
            completedCount,
            status: completedCount >= t.orderCount ? "review" : completedCount > 0 ? "in_progress" : "pending"
          };
        }
        return t;
      })
    );
    showToast(`已移除关联作品`);
  };
  const [editModalScriptList, setEditModalScriptList] = useState([
    {
      id: "SCR-101",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:48",
    },
    {
      id: "SCR-102",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:00",
    },
    {
      id: "SCR-103",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:08",
    },
    {
      id: "SCR-104",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:39",
    },
    {
      id: "SCR-105",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:11:21",
    },
    {
      id: "SCR-106",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:12",
    },
    {
      id: "SCR-107",
      title: "改写",
      template: "二创衍生",
      tags: ["单人...", "双人...", "稍微..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 20:12:53",
    },
  ]);
  const [scriptModalTask, setScriptModalTask] = useState<TaskItem | null>(null);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>("S001");
  const [scriptSearchTitle, setScriptSearchTitle] = useState("");
  const [scriptSearchCategory, setScriptSearchCategory] = useState("");
  const [scriptSearchTag, setScriptSearchTag] = useState("");
  const [scriptSearchAuthor, setScriptSearchAuthor] = useState("");

  // Pagination states for Script Modal
  const [scriptPage, setScriptPage] = useState(1);
  const [scriptPageSize, setScriptPageSize] = useState(5);
  const [scriptJumpInput, setScriptJumpInput] = useState("");

  // Pagination states for Edit Associated Script Modal
  const [editScriptPage, setEditScriptPage] = useState(1);
  const [editScriptPageSize, setEditScriptPageSize] = useState(5);
  const [editScriptJumpInput, setEditScriptJumpInput] = useState("");

  const MOCK_SCRIPTS = [
    {
      id: "S001",
      title: "【Mardi】好喜欢",
      template: "对标翻拍",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 15:15:53"
    },
    {
      id: "S002",
      title: "【Mardi】清掉",
      template: "对标翻拍",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 15:11:40"
    },
    {
      id: "S003",
      title: "微胖宝妈这样穿",
      template: "对标翻拍",
      tags: ["单人...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 14:42:34"
    },
    {
      id: "S004",
      title: "【如悦大码女装】特别显瘦",
      template: "对标翻拍",
      tags: ["单人...", "稍微..."],
      status: "待审核",
      publisher: "陈婷婷",
      publishTime: "2026-06-22 11:54:26"
    },
    {
      id: "S005",
      title: "听说（焕丽女王）夏日爆款",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 01:52:43"
    },
    {
      id: "S006",
      title: "听说促销（焕丽女王）第二期",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 01:51:51"
    },
    {
      id: "S007",
      title: "这件送（美嘉挺）无痕内衣",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 00:24:05"
    },
    {
      id: "S008",
      title: "这件送（美嘉挺）夏季新款",
      template: "二创衍生",
      tags: ["促销...", "稍微..."],
      status: "待审核",
      publisher: "鲁月园",
      publishTime: "2026-06-22 00:24:02"
    },
    {
      id: "S009",
      title: "【美嘉挺】极简真丝家居服拆解脚本",
      template: "分镜拆解",
      tags: ["家居...", "高端..."],
      status: "已通过",
      publisher: "徐振",
      publishTime: "2026-06-21 19:12:00"
    },
    {
      id: "S010",
      title: "大码女装夏日藏肉爆款脚本 02",
      template: "对标翻拍",
      tags: ["遮肉...", "显瘦..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-21 18:05:40"
    },
    {
      id: "S011",
      title: "夏季防晒冰丝衣实测对比口播稿",
      template: "产品对比",
      tags: ["冰丝...", "测评..."],
      status: "已通过",
      publisher: "陈婷婷",
      publishTime: "2026-06-21 16:22:15"
    },
    {
      id: "S012",
      title: "莫代尔高弹无痕文胸卖点提炼脚本",
      template: "卖点拆解",
      tags: ["高弹...", "舒适..."],
      status: "已通过",
      publisher: "鲁月园",
      publishTime: "2026-06-21 14:10:30"
    },
    {
      id: "S013",
      title: "【爆款二创】夏季限时大促三连击脚本",
      template: "二创衍生",
      tags: ["限时...", "冲量..."],
      status: "待审核",
      publisher: "徐振",
      publishTime: "2026-06-20 22:15:00"
    },
    {
      id: "S014",
      title: "抗下垂无钢圈内衣模特穿搭口播",
      template: "对标翻拍",
      tags: ["舒适...", "提拉..."],
      status: "已通过",
      publisher: "陈婷婷",
      publishTime: "2026-06-20 21:00:10"
    },
    {
      id: "S015",
      title: "轻薄凉感聚拢内衣短视频剧情脚本",
      template: "剧情种草",
      tags: ["剧情...", "凉感..."],
      status: "待审核",
      publisher: "莫钦全",
      publishTime: "2026-06-20 19:45:00"
    }
  ];

  const handleOpenScriptAssociationModal = (task: TaskItem) => {
    setScriptModalTask(task);
    setIsScriptModalOpen(true);
    setSelectedScriptId("S001");
    setScriptSearchTitle("");
    setScriptSearchCategory("");
    setScriptSearchTag("");
    setScriptSearchAuthor("");
    setScriptPage(1);
    setScriptJumpInput("");
  };

  // Reusable Pagination Component / Render Helper
  const renderPagination = (
    currentPage: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (size: number) => void,
    jumpInput: string,
    onJumpInputChange: (val: string) => void
  ) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const handleJump = () => {
      const pageNum = parseInt(jumpInput, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
        onJumpInputChange("");
      } else {
        showToast(`请输入 1 到 ${totalPages} 之间的有效页码`);
      }
    };

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }
      return pages;
    };

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/90 border-t border-slate-200/90 rounded-b-xl text-xs text-slate-600 font-sans">
        {/* Total stats & page size */}
        <div className="flex items-center gap-3 shrink-0 font-medium flex-wrap">
          <span>共 <strong className="text-purple-700 font-bold">{totalItems}</strong> 条数据</span>
          <span className="text-slate-300">|</span>
          <span>第 <strong className="text-slate-800 font-bold">{currentPage}</strong> / <strong className="text-slate-800 font-bold">{totalPages}</strong> 页</span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <span>每页展示:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200/90 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value={5}>5 条/页</option>
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
          </div>
        </div>

        {/* Complete Pagination controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
            title="首页"
          >
            首页
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          >
            上一页
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => {
              if (typeof p === "string") {
                return (
                  <span key={idx} className="px-1 text-slate-400 font-bold">
                    ...
                  </span>
                );
              }
              const isActive = p === currentPage;
              return (
                <button
                  key={idx}
                  onClick={() => onPageChange(p)}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 shadow-2xs"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          >
            下一页
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
            title="末页"
          >
            末页
          </button>

          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200/80 pl-3">
            <span className="text-[#64748B]">前往</span>
            <input
              type="text"
              value={jumpInput}
              onChange={(e) => onJumpInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJump();
              }}
              placeholder="页码"
              className="w-12 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 shadow-2xs"
            />
            <span className="text-slate-500">页</span>
            <button
              onClick={handleJump}
              className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              跳转
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleConfirmAssociateScript = () => {
    if (!scriptModalTask) return;
    const chosen = MOCK_SCRIPTS.find((s) => s.id === selectedScriptId);
    if (!chosen) {
      showToast("请先选择要关联的脚本");
      return;
    }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === scriptModalTask.id) {
          const newScriptItem: AssociatedScriptItem = {
            id: chosen.id,
            title: chosen.title,
            status: chosen.status as any,
            versionCount: 2,
            template: chosen.template || "通用模板",
            product: (chosen as any).product || t.product || "常规单品",
            scriptType: (chosen as any).type || t.scriptType || "混剪卡点",
            publishTime: chosen.publishTime || "2026-06-20 18:00:00"
          };

          const existingScripts = t.associatedScripts || (t.associatedScript ? [t.associatedScript] : []);
          const updatedScripts = existingScripts.some((s) => s.title === chosen.title)
            ? existingScripts.map((s) => (s.title === chosen.title ? { ...s, ...newScriptItem } : s))
            : [...existingScripts, newScriptItem];

          return {
            ...t,
            associatedScript: newScriptItem,
            associatedScripts: updatedScripts
          };
        }
        return t;
      })
    );
    showToast(`✅ 已成功关联脚本: ${chosen.title}`);
    setIsScriptModalOpen(false);
  };

  // Form State for Create / Edit Modal
  const [formState, setFormState] = useState({
    assigneePath: "",
    orderCount: "" as number | string,
    deadlineDate: "",
    visibilityType: "none" as "none" | "specified" | "group",
    visibilityRange: "public" as "public" | "public_resource" | "specified_range",
    specifiedTeam: "",
    specifiedGroup: "",
    specifiedPerson: "",
    publicDate: "",
    remark: "",
    product: "",
    scriptType: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cascader Dropdown State for "指派给"
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(0);
  const [activeSubGroupIndex, setActiveSubGroupIndex] = useState<number | null>(0);

  // Filter Tasks
  const currentUser = "徐振";

  const handleConfirmTaskCompletion = (task: TaskItem) => {
    if (task.publisher !== currentUser || task.status !== "review") return;
    const completedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const completedTask: TaskItem = {
      ...task,
      status: "completed",
      completedCount: task.orderCount,
      completionSnapshot: (task.associatedWorks || []).map((work) => ({ ...work })),
      completedAt,
      completedBy: currentUser
    };
    setTasks((prev) => prev.map((item) => item.id === task.id ? completedTask : item));
    try {
      const key = "cloud_video_task_completion_snapshots_v1";
      const existing = JSON.parse(window.localStorage.getItem(key) || "{}") as Record<string, Partial<TaskItem>>;
      existing[task.id] = completedTask;
      window.localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // The in-memory snapshot still demonstrates the completed-state flow.
    }
    setDetailModalTask(completedTask);
    showToast(`任务 ${task.id} 已确认完成，历史快照已保留`);
  };

  const filteredTasks = tasks.filter((task) => {
    // Top Scope Tab Filter
    if (activeTab === "to_me" && task.assignee !== currentUser) return false;
    if (activeTab === "my_published" && task.publisher !== currentUser) return false;

    // Sub Status Filter
    if (statusSubFilter === "pending" && task.status !== "pending" && task.status !== "in_progress") return false;
    if (statusSubFilter === "review" && task.status !== "review") return false;
    if (statusSubFilter === "completed" && task.status !== "completed") return false;

    // Second Row Filters (团队 / 分组 / 发布人)
    if (publisherDimension === "团队") {
      if (selectedTeams.length > 0) {
        const matched = selectedTeams.some(t =>
          (task.specifiedTeam && task.specifiedTeam.includes(t)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.includes(t)) ||
          t.includes("测试") || t.includes("项目")
        );
        if (!matched) return false;
      } else if (publisherSearchText.trim()) {
        const kw = publisherSearchText.trim().toLowerCase();
        const matched =
          (task.specifiedTeam && task.specifiedTeam.toLowerCase().includes(kw)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.toLowerCase().includes(kw));
        if (!matched) return false;
      }
    } else if (publisherDimension === "分组") {
      if (selectedGroups.length > 0) {
        const matched = selectedGroups.some(g =>
          (task.specifiedGroup && task.specifiedGroup.includes(g)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.includes(g))
        );
        if (!matched) return false;
      } else if (publisherSearchText.trim()) {
        const kw = publisherSearchText.trim().toLowerCase();
        const matched =
          (task.specifiedGroup && task.specifiedGroup.toLowerCase().includes(kw)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.toLowerCase().includes(kw));
        if (!matched) return false;
      }
    } else if (publisherDimension === "发布人") {
      if (selectedPublishers.length > 0) {
        const matched = selectedPublishers.some(p =>
          task.publisher.includes(p) || task.assignee.includes(p)
        );
        if (!matched) return false;
      } else if (publisherSearchText.trim()) {
        const kw = publisherSearchText.trim().toLowerCase();
        const matched =
          task.publisher.toLowerCase().includes(kw) ||
          task.assignee.toLowerCase().includes(kw);
        if (!matched) return false;
      }
    }
    // Second Row Filters: 指派给谁 (团队 / 分组 / 指派人)
    if (assigneeDimension === "团队") {
      if (selectedAssigneeTeams.length > 0) {
        const matched = selectedAssigneeTeams.some(t =>
          (task.specifiedTeam && task.specifiedTeam.includes(t)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.includes(t)) ||
          t.includes("测试") || t.includes("项目")
        );
        if (!matched) return false;
      } else if (assigneeSearchText.trim()) {
        const kw = assigneeSearchText.trim().toLowerCase();
        const matched =
          (task.specifiedTeam && task.specifiedTeam.toLowerCase().includes(kw)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.toLowerCase().includes(kw));
        if (!matched) return false;
      }
    } else if (assigneeDimension === "分组") {
      if (selectedAssigneeGroups.length > 0) {
        const matched = selectedAssigneeGroups.some(g =>
          (task.specifiedGroup && task.specifiedGroup.includes(g)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.includes(g))
        );
        if (!matched) return false;
      } else if (assigneeSearchText.trim()) {
        const kw = assigneeSearchText.trim().toLowerCase();
        const matched =
          (task.specifiedGroup && task.specifiedGroup.toLowerCase().includes(kw)) ||
          (task.assigneeDeptPath && task.assigneeDeptPath.toLowerCase().includes(kw));
        if (!matched) return false;
      }
    } else if (assigneeDimension === "出片人") {
      if (selectedAssignees.length > 0) {
        const matched = selectedAssignees.some(p =>
          task.assignee.includes(p) || (task.specifiedPerson && task.specifiedPerson.includes(p))
        );
        if (!matched) return false;
      } else if (assigneeSearchText.trim()) {
        const kw = assigneeSearchText.trim().toLowerCase();
        const matched =
          task.assignee.toLowerCase().includes(kw) ||
          (task.specifiedPerson && task.specifiedPerson.toLowerCase().includes(kw));
        if (!matched) return false;
      }
    }
    if (assigneeFilter !== "all" && task.assignee !== assigneeFilter) return false;
    if (videoStatusFilter !== "all" && task.status !== videoStatusFilter) return false;
    if (scriptStatusFilter !== "all" && task.associatedScript?.status !== scriptStatusFilter) return false;

    if (taskIdSearch.trim() && !task.id.includes(taskIdSearch.trim())) return false;
    if (scriptIdSearch.trim() && !task.associatedScript?.title.includes(scriptIdSearch.trim())) return false;
    if (remarkSearch.trim() && !(task.remark || "").includes(remarkSearch.trim())) return false;

    if (selectedWorkTypeFilter !== "all") {
      const targetType =
        selectedWorkTypeFilter === "关联视频" ? "video" :
        selectedWorkTypeFilter === "关联图片" ? "image" :
        selectedWorkTypeFilter === "关联文案" ? "text" :
        selectedWorkTypeFilter === "关联音频" ? "audio" : null;
      if (targetType) {
        if (!task.associatedWorks || !task.associatedWorks.some(w => w.type === targetType)) {
          return false;
        }
      }
    }

    return true;

    return true;
  });

  // Handle Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormState({
      assigneePath: "",
      orderCount: "",
      deadlineDate: "",
      visibilityType: "none",
      visibilityRange: "public",
      specifiedTeam: "",
      specifiedGroup: "",
      specifiedPerson: "",
      publicDate: "",
      remark: "",
      product: "",
      scriptType: ""
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setFormState({
      assigneePath: task.assigneeDeptPath || `${task.assignee}`,
      orderCount: task.orderCount,
      deadlineDate: task.deadlineDate,
      visibilityType: task.visibilityType || "specified",
      visibilityRange: task.visibilityRange || "public",
      specifiedTeam: task.specifiedTeam || "",
      specifiedGroup: task.specifiedGroup || "",
      specifiedPerson: task.specifiedPerson || "",
      publicDate: task.publicDate || "",
      remark: task.remark || "",
      product: task.product || "",
      scriptType: task.scriptType || ""
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle Copy Task
  const handleCopyTask = (task: TaskItem) => {
    const newTask: TaskItem = {
      ...task,
      id: `06201${Math.floor(100000 + Math.random() * 900000)}`,
      publishDate: new Date().toISOString().slice(0, 10),
      publisher: currentUser,
      completedCount: 0,
      status: "pending"
    };
    setTasks([newTask, ...tasks]);
    showToast(`📋 已复制任务，新增任务 ID: ${newTask.id}`);
  };

  // Handle Delete Task
  const handleDeleteTask = (id: string, publisher?: string) => {
    if (publisher && publisher !== currentUser) {
      showToast("❌ 只有任务发布人可以删除该任务");
      return;
    }
    if (confirm("确定要删除该任务吗？")) {
      setTasks(tasks.filter((t) => t.id !== id));
      showToast("🗑️ 任务已删除");
    }
  };

  // Handle Submit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: Record<string, string> = {};
    if (!formState.assigneePath) errors.assigneePath = "请选择指派目标";
    if (!formState.orderCount) errors.orderCount = "请填写下单数量";
    if (!formState.deadlineDate) errors.deadlineDate = "请选择出片日期";
    if (!formState.product) errors.product = "请填写必填项";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const assigneeName = formState.assigneePath.split("/").pop()?.trim() || "受派人";

    const parsedOrderCount = typeof formState.orderCount === "number" ? formState.orderCount : Number(formState.orderCount) || 1;

    if (editingTask) {
      // Edit existing
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                assignee: assigneeName,
                assigneeDeptPath: formState.assigneePath,
                orderCount: parsedOrderCount,
                deadlineDate: formState.deadlineDate,
                visibilityType: formState.visibilityType,
                visibilityRange: formState.visibilityRange,
                specifiedTeam: formState.specifiedTeam,
                specifiedGroup: formState.specifiedGroup,
                specifiedPerson: formState.specifiedPerson,
                publicDate: formState.publicDate,
                remark: formState.remark,
                product: formState.product,
                scriptType: formState.scriptType
              }
            : t
        )
      );
      showToast("✅ 任务修改成功");
    } else {
      // Create new
      const newId = `06201${Math.floor(100000 + Math.random() * 900000)}`;
      const newTask: TaskItem = {
        id: newId,
        publisher: currentUser,
        publishDate: new Date().toISOString().slice(0, 10),
        deadlineDate: formState.deadlineDate,
        assignee: assigneeName,
        assigneeDeptPath: formState.assigneePath,
        orderCount: parsedOrderCount,
        completedCount: 0,
        status: "pending",
        cost: 0,
        associatedScript: {
          title: "待关联脚本",
          status: "待审核",
          versionCount: 1
        },
        product: formState.product,
        scriptType: formState.scriptType,
        visibilityType: formState.visibilityType,
        visibilityRange: formState.visibilityRange,
        specifiedTeam: formState.specifiedTeam,
        specifiedGroup: formState.specifiedGroup,
        specifiedPerson: formState.specifiedPerson,
        publicDate: formState.publicDate,
        remark: formState.remark
      };
      setTasks([newTask, ...tasks]);
      showToast(`🎉 成功新增任务 ID: ${newId}`);
    }

    setIsModalOpen(false);
  };

  if (detailModalTask) {
    return (
      <TaskDetailPage
        task={detailModalTask}
        canConfirmComplete={detailModalTask.status === "review" && detailModalTask.publisher === currentUser}
        onConfirmComplete={() => handleConfirmTaskCompletion(detailModalTask)}
        onBack={() => {
          setDetailModalTask(null);
          if (onClearInitialDetailTask) {
            onClearInitialDetailTask();
          }
        }}
        onShowToast={showToast}
      />
    );
  }

  return (
    <div className={`flex-1 h-full overflow-y-auto bg-[#F7F8FA] font-sans text-slate-800 p-4 sm:p-6 space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6" : ""}`}>
      {/* Toast Floating Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & TOP TABS */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Top Scope Tabs */}
        <div className="flex items-center gap-8 border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab("to_me")}
            className={`text-sm font-extrabold relative pb-1 cursor-pointer transition-colors ${
              activeTab === "to_me" ? "text-purple-700" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>给我的任务 ({tasks.filter((t) => t.assignee === currentUser).length})</span>
            {activeTab === "to_me" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
          </button>

          <button
            onClick={() => setActiveTab("my_published")}
            className={`text-sm font-extrabold relative pb-1 cursor-pointer transition-colors ${
              activeTab === "my_published" ? "text-purple-700" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>我发布的任务 ({tasks.filter((t) => t.publisher === currentUser).length})</span>
            {activeTab === "my_published" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`text-sm font-extrabold relative pb-1 cursor-pointer transition-colors ${
              activeTab === "all" ? "text-purple-700" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>全部任务 ({tasks.length})</span>
            {activeTab === "all" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
          </button>
        </div>

        {/* Top Right Date Pickers */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-medium focus:outline-none w-44"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="出片开始日期 至 出片结束日期"
              value={outputDateRange}
              onChange={(e) => setOutputDateRange(e.target.value)}
              className="bg-transparent font-medium focus:outline-none w-48 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* SECOND ROW: 8 FILTER INPUTS */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
          {/* 1 & 2. 维度搜索 (团队 / 分组 / 发布人) 联合一体可多选下拉框 */}
          <div className="col-span-2 space-y-1 relative">
            <div className={`flex bg-slate-50 border rounded-lg overflow-hidden transition-all ${
              isPublisherPopoverOpen ? "border-purple-500 ring-1 ring-purple-500/20" : "border-slate-200"
            }`}>
              <select
                value={publisherDimension}
                onChange={(e) => {
                  setPublisherDimension(e.target.value as any);
                  setIsPublisherPopoverOpen(true);
                }}
                className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1.5 border-r border-slate-200 text-xs focus:outline-none cursor-pointer shrink-0"
              >
                <option value="团队">团队</option>
                <option value="分组">分组</option>
                <option value="发布人">发布人</option>
              </select>

              <div
                className="relative flex-1 flex items-center cursor-pointer min-w-0"
                onClick={() => setIsPublisherPopoverOpen(!isPublisherPopoverOpen)}
              >
                <input
                  type="text"
                  placeholder={
                    publisherDimension === "团队" && selectedTeams.length > 0
                      ? `已选择 ${selectedTeams.length} 项 (${selectedTeams.join(", ")})`
                      : publisherDimension === "分组" && selectedGroups.length > 0
                      ? `已选择 ${selectedGroups.length} 项 (${selectedGroups.join(", ")})`
                      : publisherDimension === "发布人" && selectedPublishers.length > 0
                      ? `已选择 ${selectedPublishers.length} 项 (${selectedPublishers.join(", ")})`
                      : "请选择(支持输入搜索)"
                  }
                  value={publisherSearchText}
                  onChange={(e) => {
                    setPublisherSearchText(e.target.value);
                    if (!isPublisherPopoverOpen) setIsPublisherPopoverOpen(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPublisherPopoverOpen(true);
                  }}
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium truncate"
                />
                {(publisherSearchText ||
                  (publisherDimension === "团队" && selectedTeams.length > 0) ||
                  (publisherDimension === "分组" && selectedGroups.length > 0) ||
                  (publisherDimension === "发布人" && selectedPublishers.length > 0)) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPublisherSearchText("");
                      setSelectedTeams([]);
                      setSelectedGroups([]);
                      setSelectedPublishers([]);
                    }}
                    className="pr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="清空"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="pr-2 text-slate-400 pointer-events-none">
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPublisherPopoverOpen ? "rotate-180" : ""}`} />
                  </span>
                )}
              </div>
            </div>

            {/* CASCADING MULTI-SELECT POPOVER OVERLAY */}
            {isPublisherPopoverOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsPublisherPopoverOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-slate-200/90 p-2 text-xs animate-in fade-in duration-100 min-w-[220px]">
                  {/* Triangle Arrow */}
                  <div className="absolute -top-1.5 left-12 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45" />

                  {/* MODE 1: 团队 (1 Column) */}
                  {publisherDimension === "团队" && (
                    <div className="max-h-60 overflow-y-auto space-y-0.5 p-1 w-56">
                      {HIERARCHY_DATA.filter(t => !publisherSearchText || t.name.includes(publisherSearchText)).map((team) => {
                        const isChecked = selectedTeams.includes(team.name);
                        return (
                          <label
                            key={team.id}
                            className={`flex items-center px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTeamSelection(team.name)}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                            />
                            <span className="truncate">{team.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* MODE 2: 分组 (2 Columns Cascade) */}
                  {publisherDimension === "分组" && (
                    <div className="grid grid-cols-2 h-60 w-[420px] divide-x divide-slate-100 font-medium">
                      {/* Column 1: Teams */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {HIERARCHY_DATA.filter(t =>
                          !publisherSearchText ||
                          t.name.includes(publisherSearchText) ||
                          t.groups.some(g => g.name.includes(publisherSearchText))
                        ).map((team) => {
                          const allGroupsInTeam = team.groups.map(g => g.name);
                          const isFullyChecked = allGroupsInTeam.length > 0 && allGroupsInTeam.every(g => selectedGroups.includes(g));
                          const isSomeChecked = allGroupsInTeam.some(g => selectedGroups.includes(g));
                          const isHovered = hoveredTeamId === team.id;

                          return (
                            <div
                              key={team.id}
                              onMouseEnter={() => {
                                setHoveredTeamId(team.id);
                                if (team.groups.length > 0) setHoveredGroupId(team.groups[0].id);
                              }}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                <input
                                  type="checkbox"
                                  checked={isFullyChecked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                  }}
                                  onChange={() => toggleTeamGroupsSelection(team)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{team.name}</span>
                              </label>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 2: Groups under hoveredTeamId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredTeamId) || HIERARCHY_DATA[0];
                          return currentTeam.groups.map((group) => {
                            const isChecked = selectedGroups.includes(group.name);
                            return (
                              <label
                                key={group.id}
                                className={`flex items-center px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleGroupSelection(group.name)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{group.name}</span>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* MODE 3: 发布人 (3 Columns Cascade) */}
                  {publisherDimension === "发布人" && (
                    <div className="grid grid-cols-3 h-60 w-[580px] divide-x divide-slate-100 font-medium">
                      {/* Column 1: Teams */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {HIERARCHY_DATA.filter(t =>
                          !publisherSearchText ||
                          t.name.includes(publisherSearchText) ||
                          t.groups.some(g => g.name.includes(publisherSearchText) || g.publishers.some(p => p.name.includes(publisherSearchText)))
                        ).map((team) => {
                          const allPubsInTeam = team.groups.flatMap(g => g.publishers.map(p => p.name));
                          const isFullyChecked = allPubsInTeam.length > 0 && allPubsInTeam.every(p => selectedPublishers.includes(p));
                          const isSomeChecked = allPubsInTeam.some(p => selectedPublishers.includes(p));
                          const isHovered = hoveredTeamId === team.id;

                          return (
                            <div
                              key={team.id}
                              onMouseEnter={() => {
                                setHoveredTeamId(team.id);
                                if (team.groups.length > 0) setHoveredGroupId(team.groups[0].id);
                              }}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                <input
                                  type="checkbox"
                                  checked={isFullyChecked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                  }}
                                  onChange={() => toggleTeamPublishersSelection(team)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{team.name}</span>
                              </label>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 2: Groups under hoveredTeamId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredTeamId) || HIERARCHY_DATA[0];
                          return currentTeam.groups.map((group) => {
                            const allPubsInGroup = group.publishers.map(p => p.name);
                            const isFullyChecked = allPubsInGroup.length > 0 && allPubsInGroup.every(p => selectedPublishers.includes(p));
                            const isSomeChecked = allPubsInGroup.some(p => selectedPublishers.includes(p));
                            const isHovered = hoveredGroupId === group.id;

                            return (
                              <div
                                key={group.id}
                                onMouseEnter={() => setHoveredGroupId(group.id)}
                                className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                  <input
                                    type="checkbox"
                                    checked={isFullyChecked}
                                    ref={(el) => {
                                      if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                    }}
                                    onChange={() => toggleGroupPublishersSelection(group)}
                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                  />
                                  <span className="truncate">{group.name}</span>
                                </label>
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Column 3: Publishers under hoveredGroupId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredTeamId) || HIERARCHY_DATA[0];
                          const currentGroup = currentTeam.groups.find(g => g.id === hoveredGroupId) || currentTeam.groups[0];
                          if (!currentGroup) return <div className="p-2 text-slate-400 text-[11px]">暂无人员</div>;

                          return currentGroup.publishers.map((pub) => {
                            const isChecked = selectedPublishers.includes(pub.name);
                            return (
                              <label
                                key={pub.id}
                                className={`flex items-center px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePublisherSelection(pub.name)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{pub.name}</span>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-400">
                    <span>
                      {publisherDimension === "团队"
                        ? `已选择 ${selectedTeams.length} 个团队`
                        : publisherDimension === "分组"
                        ? `已选择 ${selectedGroups.length} 个分组`
                        : `已选择 ${selectedPublishers.length} 位发布人`}
                    </span>
                    <button
                      onClick={() => setIsPublisherPopoverOpen(false)}
                      className="px-2.5 py-0.5 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 cursor-pointer"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 3 & 4. 出片人 / 分组 / 团队 联合一体可多选下拉框 */}
          <div className="col-span-2 space-y-1 relative">
            <div className={`flex bg-slate-50 border rounded-lg overflow-hidden transition-all ${
              isAssigneePopoverOpen ? "border-purple-500 ring-1 ring-purple-500/20" : "border-slate-200"
            }`}>
              <select
                value={assigneeDimension}
                onChange={(e) => {
                  setAssigneeDimension(e.target.value as any);
                  setIsAssigneePopoverOpen(true);
                }}
                className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1.5 border-r border-slate-200 text-xs focus:outline-none cursor-pointer shrink-0"
              >
                <option value="出片人">出片人</option>
                <option value="分组">分组</option>
                <option value="团队">团队</option>
              </select>

              <div
                className="relative flex-1 flex items-center cursor-pointer min-w-0"
                onClick={() => setIsAssigneePopoverOpen(!isAssigneePopoverOpen)}
              >
                <input
                  type="text"
                  placeholder={
                    assigneeDimension === "团队" && selectedAssigneeTeams.length > 0
                      ? `已选择 ${selectedAssigneeTeams.length} 项 (${selectedAssigneeTeams.join(", ")})`
                      : assigneeDimension === "分组" && selectedAssigneeGroups.length > 0
                      ? `已选择 ${selectedAssigneeGroups.length} 项 (${selectedAssigneeGroups.join(", ")})`
                      : assigneeDimension === "出片人" && selectedAssignees.length > 0
                      ? `已选择 ${selectedAssignees.length} 项 (${selectedAssignees.join(", ")})`
                      : "请选择出片人(支持输入搜索)"
                  }
                  value={assigneeSearchText}
                  onChange={(e) => {
                    setAssigneeSearchText(e.target.value);
                    if (!isAssigneePopoverOpen) setIsAssigneePopoverOpen(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAssigneePopoverOpen(true);
                  }}
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium truncate"
                />
                {(assigneeSearchText ||
                  (assigneeDimension === "团队" && selectedAssigneeTeams.length > 0) ||
                  (assigneeDimension === "分组" && selectedAssigneeGroups.length > 0) ||
                  (assigneeDimension === "出片人" && selectedAssignees.length > 0)) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssigneeSearchText("");
                      setSelectedAssigneeTeams([]);
                      setSelectedAssigneeGroups([]);
                      setSelectedAssignees([]);
                    }}
                    className="pr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="清空"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="pr-2 text-slate-400 pointer-events-none">
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAssigneePopoverOpen ? "rotate-180" : ""}`} />
                  </span>
                )}
              </div>
            </div>

            {/* CASCADING MULTI-SELECT POPOVER OVERLAY FOR ASSIGNEE */}
            {isAssigneePopoverOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsAssigneePopoverOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-slate-200/90 p-2 text-xs animate-in fade-in duration-100 min-w-[220px]">
                  {/* Triangle Arrow */}
                  <div className="absolute -top-1.5 left-12 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45" />

                  {/* MODE 1: 团队 (1 Column) */}
                  {assigneeDimension === "团队" && (
                    <div className="max-h-60 overflow-y-auto space-y-0.5 p-1 w-56">
                      {HIERARCHY_DATA.filter(t => !assigneeSearchText || t.name.includes(assigneeSearchText)).map((team) => {
                        const isChecked = selectedAssigneeTeams.includes(team.name);
                        return (
                          <label
                            key={team.id}
                            className={`flex items-center px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAssigneeTeamSelection(team.name)}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                            />
                            <span className="truncate">{team.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* MODE 2: 分组 (2 Columns Cascade) */}
                  {assigneeDimension === "分组" && (
                    <div className="grid grid-cols-2 h-60 w-[420px] divide-x divide-slate-100 font-medium">
                      {/* Column 1: Teams */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {HIERARCHY_DATA.filter(t =>
                          !assigneeSearchText ||
                          t.name.includes(assigneeSearchText) ||
                          t.groups.some(g => g.name.includes(assigneeSearchText))
                        ).map((team) => {
                          const allGroupsInTeam = team.groups.map(g => g.name);
                          const isFullyChecked = allGroupsInTeam.length > 0 && allGroupsInTeam.every(g => selectedAssigneeGroups.includes(g));
                          const isSomeChecked = allGroupsInTeam.some(g => selectedAssigneeGroups.includes(g));
                          const isHovered = hoveredAssigneeTeamId === team.id;

                          return (
                            <div
                              key={team.id}
                              onMouseEnter={() => {
                                setHoveredAssigneeTeamId(team.id);
                                if (team.groups.length > 0) setHoveredAssigneeGroupId(team.groups[0].id);
                              }}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                <input
                                  type="checkbox"
                                  checked={isFullyChecked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                  }}
                                  onChange={() => toggleAssigneeTeamGroupsSelection(team)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{team.name}</span>
                              </label>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 2: Groups under hoveredAssigneeTeamId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredAssigneeTeamId) || HIERARCHY_DATA[0];
                          return currentTeam.groups.map((group) => {
                            const isChecked = selectedAssigneeGroups.includes(group.name);
                            return (
                              <label
                                key={group.id}
                                className={`flex items-center px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleAssigneeGroupSelection(group.name)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{group.name}</span>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* MODE 3: 出片人 (3 Columns Cascade) */}
                  {assigneeDimension === "出片人" && (
                    <div className="grid grid-cols-3 h-60 w-[580px] divide-x divide-slate-100 font-medium">
                      {/* Column 1: Teams */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {HIERARCHY_DATA.filter(t =>
                          !assigneeSearchText ||
                          t.name.includes(assigneeSearchText) ||
                          t.groups.some(g => g.name.includes(assigneeSearchText) || g.publishers.some(p => p.name.includes(assigneeSearchText)))
                        ).map((team) => {
                          const allPubsInTeam = team.groups.flatMap(g => g.publishers.map(p => p.name));
                          const isFullyChecked = allPubsInTeam.length > 0 && allPubsInTeam.every(p => selectedAssignees.includes(p));
                          const isSomeChecked = allPubsInTeam.some(p => selectedAssignees.includes(p));
                          const isHovered = hoveredAssigneeTeamId === team.id;

                          return (
                            <div
                              key={team.id}
                              onMouseEnter={() => {
                                setHoveredAssigneeTeamId(team.id);
                                if (team.groups.length > 0) setHoveredAssigneeGroupId(team.groups[0].id);
                              }}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                <input
                                  type="checkbox"
                                  checked={isFullyChecked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                  }}
                                  onChange={() => toggleAssigneeTeamAssigneesSelection(team)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{team.name}</span>
                              </label>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 2: Groups under hoveredAssigneeTeamId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredAssigneeTeamId) || HIERARCHY_DATA[0];
                          return currentTeam.groups.map((group) => {
                            const allPubsInGroup = group.publishers.map(p => p.name);
                            const isFullyChecked = allPubsInGroup.length > 0 && allPubsInGroup.every(p => selectedAssignees.includes(p));
                            const isSomeChecked = allPubsInGroup.some(p => selectedAssignees.includes(p));
                            const isHovered = hoveredAssigneeGroupId === group.id;

                            return (
                              <div
                                key={group.id}
                                onMouseEnter={() => setHoveredAssigneeGroupId(group.id)}
                                className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isHovered ? "bg-purple-50/80 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <label className="flex items-center flex-1 cursor-pointer truncate mr-1">
                                  <input
                                    type="checkbox"
                                    checked={isFullyChecked}
                                    ref={(el) => {
                                      if (el) el.indeterminate = isSomeChecked && !isFullyChecked;
                                    }}
                                    onChange={() => toggleAssigneeGroupAssigneesSelection(group)}
                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                  />
                                  <span className="truncate">{group.name}</span>
                                </label>
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-purple-600" : "text-slate-400 opacity-60"}`} />
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Column 3: Assignees under hoveredAssigneeGroupId */}
                      <div className="p-1 space-y-0.5 overflow-y-auto">
                        {(() => {
                          const currentTeam = HIERARCHY_DATA.find(t => t.id === hoveredAssigneeTeamId) || HIERARCHY_DATA[0];
                          const currentGroup = currentTeam.groups.find(g => g.id === hoveredAssigneeGroupId) || currentTeam.groups[0];
                          if (!currentGroup) return <div className="p-2 text-slate-400 text-[11px]">暂无人员</div>;

                          return currentGroup.publishers.map((pub) => {
                            const isChecked = selectedAssignees.includes(pub.name);
                            return (
                              <label
                                key={pub.id}
                                className={`flex items-center px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isChecked ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleAssigneeSelection(pub.name)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 mr-2 cursor-pointer"
                                />
                                <span className="truncate">{pub.name}</span>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-400">
                    <span>
                      {assigneeDimension === "团队"
                        ? `已选择 ${selectedAssigneeTeams.length} 个团队`
                        : assigneeDimension === "分组"
                        ? `已选择 ${selectedAssigneeGroups.length} 个分组`
                        : `已选择 ${selectedAssignees.length} 位出片人`}
                    </span>
                    <button
                      onClick={() => setIsAssigneePopoverOpen(false)}
                      className="px-2.5 py-0.5 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 cursor-pointer"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 4. 请选择视频状态 */}
          <div className="space-y-1">
            <select
              value={videoStatusFilter}
              onChange={(e) => setVideoStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-purple-500"
            >
              <option value="all">请选择视频状态</option>
              <option value="pending">未完成</option>
              <option value="in_progress">进行中</option>
              <option value="review">待验收</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          {/* 5. 请选择脚本状态 */}
          <div className="space-y-1">
            <select
              value={scriptStatusFilter}
              onChange={(e) => setScriptStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-purple-500"
            >
              <option value="all">请选择脚本状态</option>
              <option value="待审核">待审核</option>
              <option value="可以拍摄">可以拍摄</option>
              <option value="改写">改写</option>
            </select>
          </div>

          {/* 6. 任务ID */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="任务ID"
              value={taskIdSearch}
              onChange={(e) => setTaskIdSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
            />
          </div>

          {/* 7. 脚本ID */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="脚本ID"
              value={scriptIdSearch}
              onChange={(e) => setScriptIdSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
            />
          </div>

          {/* 8. 备注 */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="备注"
              value={remarkSearch}
              onChange={(e) => setRemarkSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* THIRD ROW: SUB-FILTERS & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-transparent">
        {/* Left Sub-filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusSubFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusSubFilter === "all"
                ? "bg-[#7C3AED] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            全部
          </button>

          <button
            onClick={() => setStatusSubFilter("pending")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusSubFilter === "pending"
                ? "bg-[#7C3AED] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            待完成
          </button>

          <button
            onClick={() => setStatusSubFilter("review")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusSubFilter === "review"
                ? "bg-[#7C3AED] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            待验收
          </button>

          <button
            onClick={() => setStatusSubFilter("completed")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusSubFilter === "completed"
                ? "bg-[#7C3AED] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            已完成
          </button>

          <select
            value={sortOrder}
            onChange={(e: any) => setSortOrder(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none shrink-0"
          >
            <option value="publish_desc">排序: 按发布时间</option>
            <option value="publish_asc">排序: 发布时间升序</option>
            <option value="deadline">排序: 按出片截止日期</option>
          </select>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <span>发布任务</span>
          </button>

          <button
            onClick={() => showToast(`已按当前筛选条件导出 ${filteredTasks.length} 条任务数据（包含全部筛选结果，不限当前页）`)}
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <span>批量导出</span>
          </button>

          <button
            onClick={() => showToast("↺ 列表数据已重置并刷新")}
            className="p-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
            title="刷新"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs min-h-[420px]">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[12px]">
                <th className="py-3 px-4 min-w-[150px] text-center whitespace-nowrap">发布任务</th>
                <th className="py-3 px-4 min-w-[120px] text-center whitespace-nowrap">出片任务</th>
                <th className="py-3 px-4 min-w-[110px] text-center whitespace-nowrap">出片进度</th>
                <th className="py-3 px-4 min-w-[160px] text-center whitespace-nowrap">操作</th>
                <th className="py-3 px-4 min-w-[120px] text-center whitespace-nowrap relative">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => setHeaderWorkDropdownOpen(!headerWorkDropdownOpen)}
                      className="inline-flex items-center justify-center gap-1 cursor-pointer hover:text-purple-700 transition-colors font-bold select-none"
                    >
                      <span>关联作品</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${headerWorkDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {headerWorkDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setHeaderWorkDropdownOpen(false)} />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 px-1 min-w-[110px] text-center font-sans">
                          <button
                            onClick={() => { setSelectedWorkTypeFilter('all'); setHeaderWorkDropdownOpen(false); showToast('🎬 已筛选：关联视频'); }}
                            className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                          >
                            关联视频
                          </button>
                          <button
                            onClick={() => { setSelectedWorkTypeFilter('关联图片'); setHeaderWorkDropdownOpen(false); showToast('🖼️ 已筛选：关联图片'); }}
                            className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                          >
                            关联图片
                          </button>
                          <button
                            onClick={() => { setSelectedWorkTypeFilter('关联音频'); setHeaderWorkDropdownOpen(false); showToast('🎵 已筛选：关联音频'); }}
                            className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                          >
                            关联音频
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[110px] text-center whitespace-nowrap">任务关联消耗</th>
                <th className="py-3 px-4 min-w-[240px] text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span>关联脚本</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[220px] text-center whitespace-nowrap">备注</th>
                <th className="py-3 px-4 min-w-[110px] text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span>产品</span>
                    <Search className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[120px] text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span>脚本类型</span>
                    <Search className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[110px] text-center whitespace-nowrap">脚本拆解表</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-center">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    暂无符合条件的任务数据
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* 1. 发布任务 (Publisher, Date, ID) */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-purple-700 font-bold">{task.publisher}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{task.publishDate}</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          ID:{task.id}
                        </div>
                      </div>
                    </td>

                    {/* 2. 出片任务 (Deadline, Assignee) */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="text-slate-500 font-mono text-[11px]">{task.deadlineDate}</div>
                        <div className="font-bold text-slate-800">{task.assignee}</div>
                      </div>
                    </td>

                    {/* 3. 出片进度 */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${task.status === "completed" ? "bg-emerald-500" : task.status === "review" ? "bg-amber-500" : task.status === "in_progress" ? "bg-blue-500" : "bg-slate-400"}`} />
                          <span className={task.status === "completed" ? "text-emerald-600" : task.status === "review" ? "text-amber-600" : task.status === "in_progress" ? "text-blue-600" : "text-slate-500"}>
                            {task.status === "completed" ? "已完成" : task.status === "review" ? "待验收" : task.status === "in_progress" ? "进行中" : "未开始"}
                          </span>
                        </div>
                        <div className="font-mono text-xs font-bold text-slate-500">
                          <span className={task.completedCount > 0 ? "text-slate-800" : "text-rose-500"}>
                            {task.completedCount}
                          </span>
                          <span>/{task.orderCount}</span>
                        </div>
                      </div>
                    </td>

                    {/* 4. 操作 (详情, 编辑, 复制, 删除) */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2.5 font-medium text-purple-600">
                        <button
                          onClick={() => setDetailModalTask(task)}
                          className="hover:underline cursor-pointer"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(task)}
                          className="hover:underline cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleCopyTask(task)}
                          className="hover:underline cursor-pointer"
                        >
                          复制
                        </button>
                        {task.publisher === currentUser ? (
                          <button
                            onClick={() => handleDeleteTask(task.id, task.publisher)}
                            className="hover:underline cursor-pointer text-purple-600 transition-colors"
                          >
                            删除
                          </button>
                        ) : (
                          <button
                            disabled
                            className="text-slate-300 cursor-not-allowed select-none no-underline"
                            title="仅任务发布人可操作删除"
                          >
                            删除
                          </button>
                        )}
                      </div>
                      {task.status === "completed" && task.completedAt && (
                        <p className="mt-1 text-[9px] text-slate-400" title={`由 ${task.completedBy} 确认，已保存 ${task.completionSnapshot?.length || 0} 个资源快照`}>
                          已留存历史快照
                        </p>
                      )}
                    </td>

                    {/* 5. 关联作品 (+) */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap relative">
                      <div className="flex items-center justify-center gap-2">
                        {/* Display existing associated works */}
                        {task.associatedWorks && task.associatedWorks.length > 0 && (
                          (() => {
                            const scripts = task.associatedScripts && task.associatedScripts.length > 0
                              ? task.associatedScripts
                              : (task.associatedScript ? [task.associatedScript] : []);
                            const worksCount = task.associatedWorks.length;
                            const scriptsCount = scripts.length;
                            const canExpand = worksCount > 1 || scriptsCount > 1;
                            const isExpanded = canExpand && expandedTaskIds.has(task.id);
                            const worksToDisplay = isExpanded ? task.associatedWorks : [task.associatedWorks[0]];

                            return (
                              <div className={isExpanded ? "flex flex-col gap-1.5 items-start text-left py-1" : "flex items-center gap-1.5"}>
                                {worksToDisplay.map((work) => (
                                  <div key={work.id} className="flex items-center gap-1 bg-purple-50/80 border border-purple-100 rounded-md px-1.5 py-0.5 text-[11px] max-w-[180px]">
                                    <span className={`px-1 py-0.2 rounded text-[10px] font-extrabold text-white shrink-0 ${
                                      work.type === 'video' ? 'bg-purple-600' :
                                      work.type === 'image' ? 'bg-emerald-600' :
                                      work.type === 'text' ? 'bg-amber-600' : 'bg-blue-600'
                                    }`}>
                                      {work.type === 'video' ? '素' : work.type === 'image' ? '图' : work.type === 'text' ? '文' : '音'}
                                    </span>
                                    <span className="font-medium text-slate-700 truncate max-w-[100px]" title={work.name}>
                                      {work.name}
                                    </span>
                                    {work.status && (
                                      <span className="px-1 py-0.2 bg-[#FF5722] text-white text-[9px] font-bold rounded shrink-0">
                                        {work.status}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        )}

                        {/* Plus Button with Dropdown Popover */}
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenWorkPopoverTaskId(openWorkPopoverTaskId === task.id ? null : task.id);
                            }}
                            className="w-6 h-6 rounded-md bg-[#7C3AED] hover:bg-purple-700 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                            title="添加关联作品"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* DROPDOWN MENU matches screenshot */}
                          {openWorkPopoverTaskId === task.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenWorkPopoverTaskId(null)}
                              />
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 px-1 min-w-[110px] text-center font-sans">
                                <button
                                  onClick={() => handleOpenWorkModal(task.id, "video", "关联视频")}
                                  className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                                >
                                  关联视频
                                </button>
                                <button
                                  onClick={() => handleOpenWorkModal(task.id, "image", "关联图片")}
                                  className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                                >
                                  关联图片
                                </button>
                                <button
                                  onClick={() => handleOpenWorkModal(task.id, "audio", "关联音频")}
                                  className="w-full text-center py-2 px-3 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium text-xs rounded-lg transition-colors block whitespace-nowrap cursor-pointer"
                                >
                                  关联音频
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 6. 任务关联消耗 */}
                    <td className="py-3.5 px-4 text-center align-middle font-bold text-slate-700 whitespace-nowrap">
                      ¥{task.cost}
                    </td>

                    {/* 7. 关联脚本 */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {(() => {
                        const scripts = task.associatedScripts && task.associatedScripts.length > 0
                          ? task.associatedScripts
                          : (task.associatedScript ? [task.associatedScript] : []);
                        const worksCount = task.associatedWorks ? task.associatedWorks.length : 0;
                        const scriptsCount = scripts.length;
                        const canExpand = worksCount > 1 || scriptsCount > 1;
                        const isExpanded = canExpand && expandedTaskIds.has(task.id);

                        return (
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            {/* 左侧：关联脚本列表 (展开时：有几个就竖着排列显示几个；未展开时：只显示第1个) */}
                            {scripts.length > 0 ? (
                              isExpanded ? (
                                <div className="flex flex-col gap-2 text-left py-1">
                                  {scripts.map((sc, sIdx) => (
                                    <div key={sc.id || sIdx} className="flex items-center gap-1.5 whitespace-nowrap">
                                      <span className="font-bold text-slate-800 text-xs shrink-0 max-w-[140px] truncate" title={sc.title}>
                                        {sc.title}
                                      </span>
                                      <span className="px-2 py-0.5 bg-[#FF5722] text-white text-[10px] font-extrabold rounded shadow-2xs shrink-0 whitespace-nowrap">
                                        {sc.status || "待审核"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                  <span className="font-bold text-slate-800 text-xs shrink-0 max-w-[140px] truncate" title={scripts[0]?.title || "改写"}>
                                    {scripts[0]?.title || "改写"}
                                  </span>
                                  <span className="px-2 py-0.5 bg-[#FF5722] text-white text-[10px] font-extrabold rounded shadow-2xs shrink-0 whitespace-nowrap">
                                    {scripts[0]?.status || "待审核"}
                                  </span>
                                </div>
                              )
                            ) : (
                              <span className="text-slate-400 text-xs font-normal">暂无关联脚本</span>
                            )}

                            {/* 右侧：3个关联操作按钮 (关联脚本、编辑脚本、向下/向上展开) */}
                            <div className="flex items-center gap-1 shrink-0 self-center">
                              {/* 1. 关联脚本 (图标展示 + hover 提示) */}
                              <div className="relative group/link inline-block">
                                <button
                                  onClick={() => handleOpenScriptAssociationModal(task)}
                                  className="p-1.5 rounded-md bg-purple-50 hover:bg-purple-100 text-[#7C3AED] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
                                  title="关联脚本"
                                >
                                  <Link2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/link:flex items-center gap-1 z-50 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                                  <span>关联脚本</span>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                </div>
                              </div>

                              {/* 2. 编辑脚本 (图标展示 + hover 提示) */}
                              <div className="relative group/edit inline-block">
                                <button
                                  onClick={() => setEditAssociatedModalTask(task)}
                                  className="p-1.5 rounded-md bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
                                  title="编辑脚本"
                                >
                                  <FileEdit className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/edit:flex items-center gap-1 z-50 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                                  <span>编辑脚本</span>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                </div>
                              </div>

                              {/* 3. 向下/向上展开按钮 (如果关联作品或关联脚本里面有不止一个内容时可点击展开，否则置灰无法点击) */}
                              <div className="relative group/expand inline-block">
                                <button
                                  type="button"
                                  disabled={!canExpand}
                                  onClick={() => canExpand && toggleExpandTask(task.id)}
                                  className={`p-1.5 rounded-md transition-all flex items-center justify-center shrink-0 ${
                                    !canExpand
                                      ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/50 shadow-none opacity-60"
                                      : isExpanded
                                      ? "bg-[#7C3AED] text-white cursor-pointer shadow-2xs"
                                      : "bg-purple-50 hover:bg-purple-100 text-[#7C3AED] cursor-pointer shadow-2xs"
                                  }`}
                                  title={
                                    canExpand
                                      ? isExpanded
                                        ? "收起"
                                        : "展开已关联数据"
                                      : "暂无多条关联内容，不可展开"
                                  }
                                >
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                                {canExpand && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/expand:flex items-center gap-1 z-50 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                                    <span>{isExpanded ? "收起" : "展开已关联数据"}</span>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* 8. 备注 */}
                    <td className="py-3.5 px-4 text-center align-middle text-slate-600 max-w-[220px]">
                      <div className="line-clamp-2 whitespace-pre-line text-[11px] leading-relaxed font-normal text-center mx-auto" title={task.remark}>
                        {task.remark || "--"}
                      </div>
                    </td>

                    {/* 9. 产品 */}
                    <td className="py-3.5 px-4 text-center align-middle text-slate-800 font-medium whitespace-nowrap">
                      {task.product || "--"}
                    </td>

                    {/* 10. 脚本类型 */}
                    <td className="py-3.5 px-4 text-center align-middle text-slate-800 font-medium whitespace-nowrap">
                      {task.scriptType || "--"}
                    </td>

                    {/* 11. 脚本拆解表 */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDeconstructionModal(task)}
                        className="text-purple-600 hover:text-purple-800 font-bold hover:underline cursor-pointer text-xs"
                      >
                        {task.scriptDeconstruction || "填写拆解表"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION BAR */}
        <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="text-slate-500">
            共 <span className="font-bold text-slate-800">{filteredTasks.length}</span> 条
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 font-medium text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-7 h-7 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-500 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
              >
                &lt;
              </button>

              <button
                className="w-7 h-7 bg-[#7C3AED] text-white font-bold rounded-md flex items-center justify-center shadow-2xs"
              >
                {currentPage}
              </button>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-7 h-7 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50"
              >
                &gt;
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span>前往</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                className="w-10 bg-white border border-slate-200 rounded-md px-1 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-purple-500"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: 新增任务 / 编辑任务 ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            {/* Header: | 新增任务 */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  {editingTask ? "编辑任务" : "新增任务"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              {/* 1. * 指派给 */}
              <div className="flex items-start gap-3 relative">
                <label className="w-24 text-right pr-1 pt-2 text-xs font-medium text-slate-700 shrink-0 flex items-center justify-end">
                  <span className="text-rose-500 mr-1">*</span>指派给
                </label>

                <div className="flex-1 min-w-0 relative">
                  <div
                    onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg flex items-center justify-between cursor-pointer font-medium text-slate-800 transition-colors ${
                      formErrors.assigneePath ? "border-rose-500" : isDeptDropdownOpen ? "border-purple-500 bg-white ring-2 ring-purple-500/20" : "border-slate-200 hover:bg-slate-100/50"
                    }`}
                  >
                    {formState.assigneePath ? (
                      <span className="inline-flex items-center gap-1.5 bg-purple-100/70 text-purple-900 px-2 py-0.5 rounded font-medium">
                        <span>{formState.assigneePath}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormState({ ...formState, assigneePath: "" });
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
                                  setFormState({ ...formState, assigneePath: fullPath });
                                  setIsDeptDropdownOpen(false);
                                  if (formErrors.assigneePath) {
                                    setFormErrors({ ...formErrors, assigneePath: "" });
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
                  {formErrors.assigneePath && <p className="text-rose-500 text-[11px] font-medium mt-1">{formErrors.assigneePath}</p>}
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
                    value={formState.orderCount || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setFormState({ ...formState, orderCount: val });
                      if (formErrors.orderCount) setFormErrors({ ...formErrors, orderCount: "" });
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 transition-colors ${
                      formErrors.orderCount ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {formErrors.orderCount && <p className="text-rose-500 text-[11px] font-medium mt-1">{formErrors.orderCount}</p>}
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
                    value={formState.deadlineDate}
                    onChange={(e) => {
                      setFormState({ ...formState, deadlineDate: e.target.value });
                      if (formErrors.deadlineDate) setFormErrors({ ...formErrors, deadlineDate: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 transition-colors ${
                      formErrors.deadlineDate ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {formErrors.deadlineDate && <p className="text-rose-500 text-[11px] font-medium mt-1">{formErrors.deadlineDate}</p>}
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
                        onClick={() => setFormState({ ...formState, visibilityType: "none" })}
                        className={`px-3.5 py-1.5 font-medium text-xs transition-colors cursor-pointer ${
                          formState.visibilityType === "none"
                            ? "bg-[#7C3AED] text-white border border-[#7C3AED] shadow-2xs"
                            : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        不设置
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, visibilityType: "specified" })}
                        className={`px-3.5 py-1.5 font-medium text-xs transition-colors cursor-pointer border-l ${
                          formState.visibilityType === "specified"
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
                        setFormState({
                          ...formState,
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
                  {formState.visibilityType === "specified" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                          <input
                            type="radio"
                            name="visibilityRange"
                            checked={formState.visibilityRange === "public"}
                            onChange={() => setFormState({ ...formState, visibilityRange: "public" })}
                            className="accent-[#7C3AED]"
                          />
                          <span>公开</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                          <input
                            type="radio"
                            name="visibilityRange"
                            checked={formState.visibilityRange === "public_resource"}
                            onChange={() => setFormState({ ...formState, visibilityRange: "public_resource" })}
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
                            checked={formState.visibilityRange === "specified_range"}
                            onChange={() => setFormState({ ...formState, visibilityRange: "specified_range" })}
                            className="accent-[#7C3AED]"
                          />
                          <span>指定范围</span>
                        </label>
                      </div>

                      {/* Specified Range Dropdowns */}
                      {formState.visibilityRange === "specified_range" && (
                        <div className="space-y-2 pt-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-right text-xs text-slate-500 shrink-0">指定部门</span>
                            <select
                              value={formState.specifiedTeam}
                              onChange={(e) => setFormState({ ...formState, specifiedTeam: e.target.value })}
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
                              value={formState.specifiedGroup}
                              onChange={(e) => setFormState({ ...formState, specifiedGroup: e.target.value })}
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
                              value={formState.specifiedPerson}
                              onChange={(e) => setFormState({ ...formState, specifiedPerson: e.target.value })}
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
                    value={formState.publicDate}
                    onChange={(e) => setFormState({ ...formState, publicDate: e.target.value })}
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
                    placeholder="备注"
                    value={formState.remark}
                    onChange={(e) => setFormState({ ...formState, remark: e.target.value })}
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
                    value={formState.product}
                    onChange={(e) => {
                      setFormState({ ...formState, product: e.target.value });
                      if (formErrors.product) setFormErrors({ ...formErrors, product: "" });
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:outline-none font-medium text-slate-800 cursor-pointer transition-colors ${
                      formErrors.product ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  >
                    <option value="">请选择</option>
                    {PRODUCTS_LIST.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {formErrors.product && (
                    <p className="text-rose-500 text-[11px] font-medium mt-1">{formErrors.product}</p>
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
                    value={formState.scriptType}
                    onChange={(e) => setFormState({ ...formState, scriptType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="">请选择</option>
                    {SCRIPT_TYPES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-500 hover:text-slate-800 cursor-pointer text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer text-xs"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 关联作品 (资源库选择弹框) ================= */}
      {isWorkModalOpen && (() => {
        const filteredWorks = MOCK_RESOURCES.filter((res) => {
          if (res.type !== workModalType && workModalType !== "video") return false;
          if (
            workSearchTitle.trim() &&
            !res.title.includes(workSearchTitle.trim()) &&
            !res.id.includes(workSearchTitle.trim())
          )
            return false;
          if (workSearchCategory.trim() && !res.template.includes(workSearchCategory.trim())) return false;
          if (workSearchTag.trim() && !res.tags.some(t => t.includes(workSearchTag.trim()))) return false;
          if (workSearchAuthor && res.publisher !== workSearchAuthor) return false;
          return true;
        });

        const workTotalPages = Math.max(1, Math.ceil(filteredWorks.length / workPageSize));
        const currentWorkPage = Math.min(workPage, workTotalPages);
        const pagedWorks = filteredWorks.slice((currentWorkPage - 1) * workPageSize, currentWorkPage * workPageSize);

        return (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                  <h3 className="text-base font-extrabold text-slate-900">{workModalTypeName}</h3>
                </div>
                <button
                  onClick={() => setIsWorkModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
                {/* Search Row 1 */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="请输入标题或id"
                    value={workSearchTitle}
                    onChange={(e) => {
                      setWorkSearchTitle(e.target.value);
                      setWorkPage(1);
                    }}
                    className="flex-1 bg-slate-50/80 border border-slate-200/90 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={() => {
                      setWorkPage(1);
                      showToast("已执行条件查询");
                    }}
                    className="px-6 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  >
                    查询
                  </button>
                </div>

                {/* Search Row 2 */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative min-w-[120px] flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="搜索分类"
                      value={workSearchCategory}
                      onChange={(e) => {
                        setWorkSearchCategory(e.target.value);
                        setWorkPage(1);
                      }}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="relative min-w-[120px] flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="搜索标签"
                      value={workSearchTag}
                      onChange={(e) => {
                        setWorkSearchTag(e.target.value);
                        setWorkPage(1);
                      }}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={workSearchAuthor}
                    onChange={(e) => {
                      setWorkSearchAuthor(e.target.value);
                      setWorkPage(1);
                    }}
                    className="px-3 py-1.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer min-w-[90px]"
                  >
                    <option value="">作者</option>
                    <option value="陈婷婷">陈婷婷</option>
                    <option value="鲁月园">鲁月园</option>
                    <option value="徐振">徐振</option>
                    <option value="莫钦全">莫钦全</option>
                  </select>

                  <select className="px-3 py-1.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs font-medium text-slate-400 focus:outline-none cursor-pointer min-w-[160px]">
                    <option value="">请选择(支持输入搜索)</option>
                  </select>

                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <span>开始日期</span>
                    <span className="text-slate-300 mx-1">至</span>
                    <span>结束日期</span>
                  </div>
                </div>

                {/* Resource List Table */}
                <div className="border border-slate-200/90 rounded-xl overflow-hidden mt-3 shadow-2xs bg-white flex flex-col">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold text-xs">
                        <th className="py-3 px-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded accent-[#7C3AED] cursor-pointer"
                            onChange={(e) => {
                              if (e.target.checked && pagedWorks.length > 0) {
                                setSelectedWorkId(pagedWorks[0].id);
                              }
                            }}
                          />
                        </th>
                        <th className="py-3 px-3">标题</th>
                        <th className="py-3 px-3">模板</th>
                        <th className="py-3 px-3">标签</th>
                        <th className="py-3 px-3">状态</th>
                        <th className="py-3 px-3">发布人</th>
                        <th className="py-3 px-3">发布时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {pagedWorks.map((resource) => {
                        const isSelected = selectedWorkId === resource.id;
                        return (
                          <tr
                            key={resource.id}
                            onClick={() => setSelectedWorkId(resource.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "bg-purple-50/60 font-medium text-slate-900" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <td className="py-3 px-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => setSelectedWorkId(resource.id)}
                                className="w-3.5 h-3.5 rounded accent-[#7C3AED] cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">{resource.title}</td>
                            <td className="py-3 px-3 text-slate-600">{resource.template}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {resource.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-medium border border-sky-100"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-0.5 text-white font-bold rounded text-[10px] shadow-2xs ${
                                resource.status === "已通过" ? "bg-emerald-500" : "bg-[#FF5722]"
                              }`}>
                                {resource.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-medium">{resource.publisher}</td>
                            <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{resource.publishTime}</td>
                          </tr>
                        );
                      })}
                      {pagedWorks.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                            暂无符合条件的作品数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Bar */}
                  {renderPagination(
                    currentWorkPage,
                    workPageSize,
                    filteredWorks.length,
                    setWorkPage,
                    setWorkPageSize,
                    workJumpInput,
                    setWorkJumpInput
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  {selectedWorkId ? (
                    <span>
                      已选择作品 ID: <strong className="text-purple-700 font-mono">{selectedWorkId}</strong>
                    </span>
                  ) : (
                    <span>请勾选列表中的作品进行关联</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWorkModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAssociateWork}
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    确认关联
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= MODAL: 关联脚本 ================= */}
      <LinkScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        onConfirm={(selected) => {
          const chosen = Array.isArray(selected) ? selected[0] : selected;
          if (chosen) {
            setSelectedScriptId(chosen.id);
            if (editAssociatedModalTask) {
              setEditModalScriptList((prev) => [
                ...prev,
                {
                  id: chosen.id,
                  title: chosen.title,
                  template: chosen.template || "对标翻拍",
                  tags: chosen.tags || ["促销...", "稍微..."],
                  status: chosen.status || "待审核",
                  publisher: chosen.publisher || "陈婷婷",
                  publishTime: chosen.publishTime || "2026-06-22 15:15:53"
                }
              ]);
            }
            showToast(`✅ 已成功关联脚本: ${chosen.title}`);
          }
        }}
        initialSelectedId={selectedScriptId || "S001"}
      />

      {/* ================= MODAL: 编辑当前已关联脚本 (参考用户截图) ================= */}
      {editAssociatedModalTask && (() => {
        const editScriptTotalPages = Math.max(1, Math.ceil(editModalScriptList.length / editScriptPageSize));
        const currentEditScriptPage = Math.min(editScriptPage, editScriptTotalPages);
        const pagedEditScripts = editModalScriptList.slice(
          (currentEditScriptPage - 1) * editScriptPageSize,
          currentEditScriptPage * editScriptPageSize
        );

        return (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[88vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                  <h3 className="text-base font-extrabold text-slate-900">关联脚本</h3>
                </div>
                <button
                  onClick={() => setEditAssociatedModalTask(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1 bg-white">
                {/* Action Button: 关联脚本 */}
                <div>
                  <button
                    onClick={() => {
                      handleOpenScriptAssociationModal(editAssociatedModalTask);
                    }}
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    关联脚本
                  </button>
                </div>

                {/* Scripts Table */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold text-xs">
                        <th className="py-3.5 px-4 font-bold">脚本标题</th>
                        <th className="py-3.5 px-4 font-bold">脚本模板</th>
                        <th className="py-3.5 px-4 font-bold">标签</th>
                        <th className="py-3.5 px-4 font-bold text-center">状态</th>
                        <th className="py-3.5 px-4 font-bold">发布人</th>
                        <th className="py-3.5 px-4 font-bold">发布时间</th>
                        <th className="py-3.5 px-4 font-bold text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {pagedEditScripts.map((item, index) => (
                        <tr
                          key={item.id || index}
                          className="hover:bg-slate-50/80 transition-colors text-slate-700 font-medium"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-800">{item.title}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.template}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.tags.map((t: string, tidx: number) => (
                                <span
                                  key={tidx}
                                  className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[11px] font-medium border border-sky-100/70"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-0.5 bg-[#FF5722] text-white font-bold rounded text-[11px] shadow-2xs whitespace-nowrap">
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 font-bold whitespace-nowrap">{item.publisher}</td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{item.publishTime}</td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-3 font-bold text-[12px]">
                              <button
                                onClick={() => showToast(`📜 查看脚本详情: ${item.title}`)}
                                className="text-[#7C3AED] hover:underline cursor-pointer"
                              >
                                详情
                              </button>
                              <button
                                onClick={() => {
                                  setEditModalScriptList(prev => prev.filter(s => s.id !== item.id));
                                  showToast(`✅ 已取消关联脚本: ${item.title}`);
                                }}
                                className="text-[#7C3AED] hover:underline cursor-pointer"
                              >
                                取消关联
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {editModalScriptList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                            暂无已关联脚本
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Bar */}
                  {editModalScriptList.length > 0 &&
                    renderPagination(
                      currentEditScriptPage,
                      editScriptPageSize,
                      editModalScriptList.length,
                      setEditScriptPage,
                      setEditScriptPageSize,
                      editScriptJumpInput,
                      setEditScriptJumpInput
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SCRIPT DECONSTRUCTION FORM MODAL MATCHING USER SCREENSHOT */}
      {isDeconstructionModalOpen && deconstructionTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-6xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative">
            
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#7C3AED] rounded-full inline-block"></span>
                <h3 className="text-base font-bold text-slate-800">
                  拆解表
                </h3>
              </div>
              <button
                onClick={() => setIsDeconstructionModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(deconstructionForm.deconstructionId);
                  showToast("📋 拆解表ID已复制到剪贴板");
                }}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-medium px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                复制拆解表ID
              </button>
              <input
                type="text"
                value={deconstructionForm.deconstructionId}
                onChange={(e) => setDeconstructionForm({ ...deconstructionForm, deconstructionId: e.target.value })}
                placeholder="请输入拆解表ID"
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none focus:border-purple-500 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => showToast(`🔍 已识别拆解表信息 (${deconstructionForm.deconstructionId})`)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-medium px-5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                识别
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div 
                className="border border-slate-200 rounded-lg overflow-hidden text-slate-800 bg-white shadow-2xs transition-transform origin-top-left"
                style={{ transform: `scale(${deconstructionZoom / 100})`, width: deconstructionZoom !== 100 ? `${10000 / deconstructionZoom}%` : '100%' }}
              >
                
                {/* 1. 对接环节 (人员) */}
                <div className="flex border-b border-slate-200">
                  <div className="w-24 bg-slate-50/80 font-bold text-slate-700 p-3 flex items-center justify-center border-r border-slate-200 shrink-0 text-center select-none">
                    对接环节
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-200 font-bold text-slate-600">
                          <th className="p-2 border-r border-slate-200">拍摄人员</th>
                          <th className="p-2 border-r border-slate-200">剪辑人员</th>
                          <th className="p-2 border-r border-slate-200">框架审核</th>
                          <th className="p-2 border-r border-slate-200">技术审核</th>
                          <th className="p-2 border-r border-slate-200">创意模特</th>
                          <th className="p-2">创意声源</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 border-r border-slate-200">
                            <input type="text" value={deconstructionForm.photographer} onChange={e => setDeconstructionForm({...deconstructionForm, photographer: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-200">
                            <input type="text" value={deconstructionForm.editor} onChange={e => setDeconstructionForm({...deconstructionForm, editor: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-200">
                            <input type="text" value={deconstructionForm.frameReviewer} onChange={e => setDeconstructionForm({...deconstructionForm, frameReviewer: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-200">
                            <input type="text" value={deconstructionForm.techReviewer} onChange={e => setDeconstructionForm({...deconstructionForm, techReviewer: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-200">
                            <input type="text" value={deconstructionForm.creativeModel} onChange={e => setDeconstructionForm({...deconstructionForm, creativeModel: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                          <td className="p-1">
                            <input type="text" value={deconstructionForm.creativeAudio} onChange={e => setDeconstructionForm({...deconstructionForm, creativeAudio: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. 对接环节 (场景/服饰/道具/特殊需求) */}
                <div className="flex border-b border-slate-200">
                  <div className="w-24 bg-slate-50/80 font-bold text-slate-700 p-3 flex items-center justify-center border-r border-slate-200 shrink-0 text-center select-none">
                    对接环节
                  </div>
                  <div className="flex-1 divide-y divide-slate-200">
                    {/* Row 1: 创意场景 & 创意灯光 */}
                    <div className="flex items-stretch">
                      <div className="w-28 bg-slate-50/60 font-bold text-slate-600 p-2 text-center border-r border-slate-200 flex items-center justify-center shrink-0">创意场景</div>
                      <div className="flex-1 p-1 border-r border-slate-200 flex items-center">
                        <input type="text" value={deconstructionForm.creativeScene} onChange={e => setDeconstructionForm({...deconstructionForm, creativeScene: e.target.value})} className="w-full py-1 px-2 focus:bg-purple-50/30 rounded focus:outline-none" />
                      </div>
                      <div className="w-28 bg-slate-50/60 font-bold text-slate-600 p-2 text-center border-r border-slate-200 flex items-center justify-center shrink-0">创意灯光</div>
                      <div className="flex-1 p-1 flex items-center">
                        <input type="text" value={deconstructionForm.creativeLighting} onChange={e => setDeconstructionForm({...deconstructionForm, creativeLighting: e.target.value})} className="w-full py-1 px-2 focus:bg-purple-50/30 rounded focus:outline-none" />
                      </div>
                    </div>

                    {/* Row 2: 模特服饰 & 模特道具 */}
                    <div className="flex items-stretch">
                      <div className="w-28 bg-slate-50/60 font-bold text-slate-600 p-2 text-center border-r border-slate-200 flex items-center justify-center shrink-0">模特服饰</div>
                      <div className="flex-1 p-1 border-r border-slate-200 flex items-center">
                        <input type="text" value={deconstructionForm.modelClothing} onChange={e => setDeconstructionForm({...deconstructionForm, modelClothing: e.target.value})} className="w-full py-1 px-2 focus:bg-purple-50/30 rounded focus:outline-none" />
                      </div>
                      <div className="w-28 bg-slate-50/60 font-bold text-slate-600 p-2 text-center border-r border-slate-200 flex items-center justify-center shrink-0">模特道具</div>
                      <div className="flex-1 p-2 flex items-center gap-6 text-slate-700">
                        {["耳环", "项链"].map((item) => (
                          <label key={item} className="inline-flex items-center gap-1.5 cursor-pointer hover:text-purple-700 font-medium select-none">
                            <input type="checkbox" checked={deconstructionForm.modelProps.includes(item)} onChange={() => toggleModelProp(item)} className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Row 3: 编导开拍前需准备道具列表 */}
                    <div className="flex items-stretch">
                      <div className="w-36 bg-slate-50/60 font-bold text-slate-600 p-2.5 text-center border-r border-slate-200 flex items-center justify-center shrink-0 leading-snug">
                        编导开拍前需<br />准备道具列表
                      </div>
                      <div className="flex-1 p-2.5 text-slate-700 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          {["洗发露/护发素", "精油", "头皮喷雾", "毛巾", "镜子", "发箍", "梳子", "吹风机", "热水"].map((item) => (
                            <label key={item} className="inline-flex items-center gap-1.5 cursor-pointer hover:text-purple-700 font-medium select-none">
                              <input type="checkbox" checked={deconstructionForm.prepProps.includes(item)} onChange={() => togglePrepProp(item)} className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-medium shrink-0">其他</span>
                          <input type="text" value={deconstructionForm.prepPropsOther} onChange={e => setDeconstructionForm({...deconstructionForm, prepPropsOther: e.target.value})} placeholder="输入其他需要准备的道具..." className="w-full bg-transparent border-b border-slate-200 focus:border-purple-500 py-0.5 px-1 focus:outline-none text-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: 特殊需求 */}
                    <div className="flex items-stretch">
                      <div className="w-28 bg-slate-50/60 font-bold text-slate-600 p-2.5 text-center border-r border-slate-200 flex items-center justify-center shrink-0">特殊需求</div>
                      <div className="flex-1 p-1 flex items-center">
                        <input type="text" value={deconstructionForm.specialNeeds} onChange={e => setDeconstructionForm({...deconstructionForm, specialNeeds: e.target.value})} placeholder="例如：泼水脚本，提醒模特自带服装" className="w-full py-1 px-2 focus:bg-purple-50/30 rounded focus:outline-none placeholder:text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 备注 */}
                <div className="flex border-b border-slate-200">
                  <div className="w-24 bg-slate-50/80 font-bold text-slate-700 p-3 flex items-center justify-center border-r border-slate-200 shrink-0 text-center select-none">
                    备注
                  </div>
                  <div className="flex-1 p-1">
                    <input type="text" value={deconstructionForm.remark} onChange={e => setDeconstructionForm({...deconstructionForm, remark: e.target.value})} placeholder="请输入相关备注..." className="w-full py-1 px-2 focus:bg-purple-50/30 rounded focus:outline-none" />
                  </div>
                </div>

                {/* 4. 拍摄拆解 */}
                <div className="flex border-b border-slate-200">
                  <div className="w-24 bg-slate-50/80 font-bold text-slate-700 p-3 flex items-center justify-center border-r border-slate-200 shrink-0 text-center select-none">
                    拍摄拆解
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    {/* Shots Table */}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-200 font-bold text-slate-600 text-center">
                          <th className="p-2 border-r border-slate-200 w-1/4"><span className="text-rose-500 mr-0.5">*</span>脚本分镜</th>
                          <th className="p-2 border-r border-slate-200 w-1/4"><span className="text-rose-500 mr-0.5">*</span>对话过程</th>
                          <th className="p-2 border-r border-slate-200 w-1/4">分镜头例图</th>
                          <th className="p-2 w-1/4">注意点</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {deconstructionForm.shots.map((shot) => (
                          <tr key={shot.id} className="align-top">
                            {/* 脚本分镜 */}
                            <td className="p-2 border-r border-slate-200">
                              <textarea rows={4} value={shot.storyboard} onChange={e => updateShotRow(shot.id, "storyboard", e.target.value)} placeholder="请输入分镜描述..." className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 focus:bg-white focus:border-purple-500 focus:outline-none text-xs resize-none" />
                            </td>
                            {/* 对话过程 */}
                            <td className="p-2 border-r border-slate-200">
                              <textarea rows={4} value={shot.dialogue} onChange={e => updateShotRow(shot.id, "dialogue", e.target.value)} placeholder="请输入台词对白..." className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 focus:bg-white focus:border-purple-500 focus:outline-none text-xs resize-none" />
                            </td>
                            {/* 分镜头例图 */}
                            <td className="p-2 border-r border-slate-200 text-center">
                              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-dashed flex flex-col items-center justify-center min-h-[120px] text-slate-400 group relative hover:border-purple-400 transition-colors">
                                {shot.sampleImage ? (
                                  <div className="relative w-full h-24">
                                    <img src={shot.sampleImage} alt="例图" className="w-full h-full object-cover rounded" />
                                    <button onClick={() => updateShotRow(shot.id, "sampleImage", "")} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-rose-600 transition-colors">
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => updateShotRow(shot.id, "sampleImage", ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                      }
                                    }} />
                                    <span className="text-[11px] text-slate-500 font-medium mb-2">粘贴或拖拽至这里上传</span>
                                    <div className="w-12 h-8 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 group-hover:border-purple-500 group-hover:text-purple-600 transition-colors bg-white shadow-2xs">
                                      <Plus className="w-4 h-4" />
                                    </div>
                                  </label>
                                )}
                              </div>
                            </td>
                            {/* 注意点 */}
                            <td className="p-2 relative">
                              <textarea rows={4} value={shot.notes} onChange={e => updateShotRow(shot.id, "notes", e.target.value)} placeholder="请输入注意事项..." className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 focus:bg-white focus:border-purple-500 focus:outline-none text-xs resize-none" />
                              {deconstructionForm.shots.length > 1 && (
                                <button onClick={() => removeShotRow(shot.id)} className="absolute bottom-3 right-3 text-slate-400 hover:text-rose-600 text-[11px] font-medium hover:underline cursor-pointer">
                                  删除行
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* 新增一行 */}
                    <div className="border-t border-slate-200 p-2 text-center bg-slate-50/50">
                      <button onClick={addShotRow} className="inline-flex items-center gap-1 text-slate-600 hover:text-purple-700 font-bold hover:bg-purple-50 py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-xs">
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增一行</span>
                      </button>
                    </div>

                    {/* 视频格式规范 */}
                    <div className="border-t border-slate-200">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-50/60 border-b border-slate-200 font-bold text-slate-600">
                            <th className="p-2 border-r border-slate-200">视频格式</th>
                            <th className="p-2 border-r border-slate-200">视频尺寸</th>
                            <th className="p-2 border-r border-slate-200">字幕类型</th>
                            <th className="p-2 border-r border-slate-200">视频画质</th>
                            <th className="p-2">BGM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1 border-r border-slate-200">
                              <input type="text" value={deconstructionForm.videoFormat} onChange={e => setDeconstructionForm({...deconstructionForm, videoFormat: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                            </td>
                            <td className="p-1 border-r border-slate-200">
                              <input type="text" value={deconstructionForm.videoSize} onChange={e => setDeconstructionForm({...deconstructionForm, videoSize: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                            </td>
                            <td className="p-1 border-r border-slate-200">
                              <input type="text" value={deconstructionForm.subtitleType} onChange={e => setDeconstructionForm({...deconstructionForm, subtitleType: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                            </td>
                            <td className="p-1 border-r border-slate-200">
                              <input type="text" value={deconstructionForm.videoQuality} onChange={e => setDeconstructionForm({...deconstructionForm, videoQuality: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                            </td>
                            <td className="p-1">
                              <input type="text" value={deconstructionForm.bgm} onChange={e => setDeconstructionForm({...deconstructionForm, bgm: e.target.value})} className="w-full text-center py-1 px-1 focus:bg-purple-50/30 rounded focus:outline-none" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 5. 过审必备 */}
                <div className="flex">
                  <div className="w-24 bg-slate-50/80 font-bold text-slate-700 p-3 flex items-center justify-center border-r border-slate-200 shrink-0 text-center select-none">
                    过审必备
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-200 font-bold text-slate-600 text-center">
                          <th className="p-2 border-r border-slate-200 w-1/2">视频下方文案</th>
                          <th className="p-2 w-1/2">其他文案</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-r border-slate-200">
                            <textarea rows={3} value={deconstructionForm.videoBottomText} onChange={e => setDeconstructionForm({...deconstructionForm, videoBottomText: e.target.value})} placeholder="请输入视频下方文案..." className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 focus:bg-white focus:border-purple-500 focus:outline-none text-xs resize-none" />
                          </td>
                          <td className="p-2">
                            <textarea rows={3} value={deconstructionForm.otherText} onChange={e => setDeconstructionForm({...deconstructionForm, otherText: e.target.value})} placeholder="请输入其他文案..." className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 focus:bg-white focus:border-purple-500 focus:outline-none text-xs resize-none" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Side Zoom Controls */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-30 select-none">
              <button 
                onClick={() => setDeconstructionZoom(z => Math.min(120, z + 10))} 
                className="w-6 h-6 hover:bg-purple-50 hover:text-purple-700 rounded flex items-center justify-center font-bold text-slate-600 transition-colors cursor-pointer text-sm" 
                title="放大表格"
              >
                +
              </button>
              <button 
                onClick={() => setDeconstructionZoom(z => Math.max(80, z - 10))} 
                className="w-6 h-6 hover:bg-purple-50 hover:text-purple-700 rounded flex items-center justify-center font-bold text-slate-600 transition-colors cursor-pointer text-sm" 
                title="缩小表格"
              >
                -
              </button>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setIsDeconstructionModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveDeconstruction}
                className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                保存拆解表
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
