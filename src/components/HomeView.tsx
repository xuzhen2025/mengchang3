import React, { useEffect, useRef, useState } from "react";
import { 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Video, 
  MessageSquare, 
  Headphones, 
  ChevronRight, 
  Calendar, 
  Tag, 
  ArrowUpRight, 
  Film, 
  Layers, 
  Send, 
  Check, 
  X, 
  Play, 
  User, 
  Plus, 
  Flame, 
  ShieldCheck, 
  Filter, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Award,
  Zap,
  RefreshCw,
  Copy,
  Download,
  Eye,
  Lock,
  Share2,
  TrendingUp,
  AlertTriangle,
  Upload,
  Edit,
  UserCheck,
  UserX,
  FileCheck,
  CalendarCheck,
  CheckSquare,
  ListTodo,
  Inbox
} from "lucide-react";
import { ActiveScreen, AppMessage, ResourceSearchIntent, ResourceSearchType } from "../types";
import { MESSAGE_CATEGORY_CONFIGS } from "../data";
import ApprovalActionBox from "./ApprovalActionBox";

interface HomeViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onNavigateToTaskTab?: (tab: "to_me" | "my_published" | "all") => void;
  onOpenMaterialSelector?: (callback: (selectedUrls: string[]) => void) => void;
  messages?: AppMessage[];
  onApproveCredits?: (msgId: string) => void;
  onRejectCredits?: (msgId: string, rejectReason: string) => void;
  onMarkMessageRead?: (id: string) => void;
  onMarkAllMessagesRead?: () => void;
  onSearchResources?: (intent: Omit<ResourceSearchIntent, "requestId">) => void;
}

const RESOURCE_SEARCH_TYPES: ResourceSearchType[] = ["成片", "素材", "图片", "脚本", "音频"];

const RESOURCE_HOT_TAGS: Record<ResourceSearchType, string[]> = {
  成片: ["达人成片", "爆款视频", "短视频推广", "直播切片", "首发素材", "千川跑量", "美妆口播", "服装穿搭", "产品测评", "品牌宣传"],
  素材: ["产品实拍", "模特出镜", "商品特写", "场景空镜", "口播素材", "开箱素材", "使用演示", "对比实测", "直播素材", "4K原片"],
  图片: ["高清主图", "产品实拍", "模特出镜", "宣发海报", "详情页长图", "透明底图", "成分展示", "对比实测", "资质证明", "3D渲染图"],
  脚本: ["美妆护肤", "个人护理", "30秒口播", "痛点转化", "KOC测评", "产品种草", "剧情反转", "开箱测评", "直播引流", "卖点拆解"],
  音频: ["场景", "合作达人", "创新点", "模特", "带货口播", "解说旁白", "促销BGM", "卡点音效", "转场音效", "AI配音"]
};

// Notification category structure
interface CategoryConfig {
  id: string;
  name: string;
  subcategories: string[];
}

const MESSAGE_CATEGORIES: CategoryConfig[] = MESSAGE_CATEGORY_CONFIGS.map((category) => ({
  id: category.id,
  name: category.name,
  subcategories: [...category.subcategories]
}));

// Message detail item
export interface MessageDetailItem {
  label: string;
  value: string;
  isLink?: boolean;
}

// Message item in notification list
interface MessageItem {
  id: string;
  category: string; // 创作, 投放, 卡审, 预约, 任务, 账号, 导出
  subcategory: string; // e.g. 上传视频, 视频审核不通过, 授权失效, etc.
  detail: string;
  status: "unread" | "read"; // 未读, 已读
  time: string; // ISO or human readable timestamp
  title?: string;
  details?: MessageDetailItem[];
}

// Task Item
interface TaskItem {
  id: string;
  title: string;
  ownerType: "assigned" | "published"; // 给我的, 我发布的
  status: "pending" | "completed"; // 待完成, 已达标
  creatorOrAssignee: string;
  targetMetric: string;
  currentProgress: number;
  totalProgress: number;
  deadline: string;
  priority: "high" | "medium" | "low";
  category: string;
}

// Update Log
interface UpdateLogItem {
  version: string;
  date: string;
  title: string;
  tag: "新功能" | "性能提升" | "算法升级" | "体验优化";
  description: string;
  contents: string[];
}

export default function HomeView({ 
  setActiveScreen,
  onNavigateToTaskTab,
  messages: propMessages,
  onApproveCredits,
  onRejectCredits,
  onMarkMessageRead,
  onMarkAllMessagesRead,
  onSearchResources
}: HomeViewProps) {
  // ================= 1. SEARCH MODULE STATES =================
  const [searchType, setSearchType] = useState<ResourceSearchType>("成片");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openResourceSearch = (type: ResourceSearchType, options?: { query?: string; tag?: string }) => {
    setSearchType(type);
    setSearchPanelOpen(false);
    onSearchResources?.({ type, ...options });
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchPanelOpen(true);
      return;
    }
    const exactTag = RESOURCE_HOT_TAGS[searchType].find((tag) => tag.toLowerCase() === query.toLowerCase());
    openResourceSearch(searchType, exactTag ? { tag: exactTag } : { query });
  };

  // ================= 2. MESSAGE NOTIFICATION MODULE STATES =================
  const [messages, setMessages] = useState<MessageItem[]>([
    // 创作 (Creation)
    { 
      id: "m1", 
      category: "创作", 
      subcategory: "上传视频", 
      title: "资源库成片上传提醒",
      detail: "在资源库点击上传成片《冬季风衣短视频_01.mp4》时，选择了上传并提示您查看。", 
      status: "unread", 
      time: "2026-07-31 18:20",
      details: [
        { label: "提示发起人", value: "张立 (致上运营)" },
        { label: "上传成片", value: "冬季风衣短视频_01.mp4" },
        { label: "触发动作", value: "资源库上传成片并选择提示团队成员" },
        { label: "网页链接", value: "http://ygj-zssoft.sucaicloud.com/#/video-detail/42021437", isLink: true }
      ]
    },
    { 
      id: "m2", 
      category: "创作", 
      subcategory: "上传视频", 
      title: "资源库成片上传提醒",
      detail: "在资源库点击上传成片《美妆精华开箱_4K.mp4》时，选择了上传并提示您查看。", 
      status: "unread", 
      time: "2026-07-31 17:10",
      details: [
        { label: "提示发起人", value: "李剪辑" },
        { label: "上传成片", value: "美妆精华开箱_4K.mp4" },
        { label: "画质规格", value: "3840x2160 (4K 60fps)" },
        { label: "网页链接", value: "http://ygj-zssoft.sucaicloud.com/#/video-detail/42021438", isLink: true }
      ]
    },
    { 
      id: "m3", 
      category: "创作", 
      subcategory: "编辑视频", 
      title: "基础信息编辑提醒",
      detail: "编辑了资源库内容《3D数码降噪示范》的基础信息。", 
      status: "unread", 
      time: "2026-07-31 15:05",
      details: [
        { label: "编辑人", value: "王编导" },
        { label: "素材名称", value: "3D数码降噪示范" },
        { label: "操作内容", value: "编辑资源库内容的基础信息" },
        { label: "网页链接", value: "http://ygj-zssoft.sucaicloud.com/#/video-detail/42021439", isLink: true }
      ]
    },
    { 
      id: "m6", 
      category: "创作", 
      subcategory: "视频状态被修改", 
      title: "视频状态被修改",
      detail: "资源库内容《女装秋冬 Lookbook》状态由【草稿】更新为【已提审】。", 
      status: "read", 
      time: "2026-07-30 11:20",
      details: [
        { label: "修改人", value: "汤小真" },
        { label: "修改前后", value: "草稿 -> 已提审" },
        { label: "项目标题", value: "女装秋冬 Lookbook" },
        { label: "网页链接", value: "http://sucaiwang.zhishangsoft.com/#/video-detail/38549144", isLink: true }
      ]
    },

    // 卡审 (Review/Audit)
    { 
      id: "a1", 
      category: "卡审", 
      subcategory: "视频审核不通过", 
      title: "文案/视频审核不通过",
      detail: "审核驳回：视频《补水面膜对比》因出现极限修辞词汇“最顶级”被平台卡审驳回，请修正文案。", 
      status: "unread", 
      time: "2026-07-31 17:45",
      details: [
        { label: "修改人", value: "张立 (致上运营)" },
        { label: "修改前后", value: "修改前 -> 审核驳回" },
        { label: "文案内容", value: "好看好🙋！！这个补水面膜效果真的是最顶级的了..." },
        { label: "修改文案备注", value: "最顶级" },
        { label: "网页链接", value: "http://ygj-zssoft.sucaicloud.com/#/reviews-detail/42021437", isLink: true }
      ]
    },

    // 预约 (Reservation)
    { 
      id: "r1", 
      category: "预约", 
      subcategory: "轮到你的预约", 
      title: "轮到你预约计算",
      detail: "GPU 专属云端渲染排队提醒：轮到您的 [4K 爆款裂变生成] 任务开始计算，预计耗时 3 分钟。", 
      status: "unread", 
      time: "2026-07-31 16:10",
      details: [
        { label: "规则组", value: "GPU云端渲染引擎排队组" },
        { label: "预约轮次", value: "第 1 轮" },
        { label: "预约时间", value: "3 分钟" },
        { label: "队列编号", value: "#Q-20260731-88" }
      ]
    },
    { 
      id: "r2", 
      category: "预约", 
      subcategory: "取消预约", 
      title: "排队任务取消通知",
      detail: "系统已为您取消预约：[离线批量去水印排队任务 #04]。", 
      status: "read", 
      time: "2026-07-30 09:30",
      details: [
        { label: "取消类型", value: "用户主动取消 / 超时自动取消" },
        { label: "任务名称", value: "离线批量去水印排队任务 #04" },
        { label: "退回积分", value: "0 积分 (未开始计算不扣分)" }
      ]
    },

    // 任务 (Task)
    { 
      id: "t1", 
      category: "任务", 
      subcategory: "收到新任务", 
      title: "指派新任务通知",
      detail: "您收到由【运营主管·王经理】指派的新任务《双十一鞋服爆款短片提审》。", 
      status: "unread", 
      time: "2026-07-31 14:50",
      details: [
        { label: "指派人", value: "运营主管·王经理" },
        { label: "任务标题", value: "双十一鞋服爆款短片提审" },
        { label: "优先级", value: "高优先级 (High)" },
        { label: "截止时间", value: "今日 20:00" }
      ]
    },
    { 
      id: "t2", 
      category: "任务", 
      subcategory: "任务关联新视频", 
      title: "任务关联新视频通知",
      detail: "任务《美妆多场景商详套图》已自动关联最新渲染出来的 5 条素材视频。", 
      status: "unread", 
      time: "2026-07-31 10:20",
      details: [
        { label: "关联任务", value: "美妆多场景商详套图" },
        { label: "新增视频", value: "5 条 (4K渲染纯享)" },
        { label: "生成时间", value: "2026-07-31 10:20:00" }
      ]
    },

    // 账号 (Account)
    { 
      id: "acc1", 
      category: "账号", 
      subcategory: "账号被锁定", 
      title: "账号安全风控预警",
      detail: "安全提醒：您的账号检测到异地登录尝试，触发风控安全保护锁定，请确认手机号认证。", 
      status: "unread", 
      time: "2026-07-31 08:30",
      details: [
        { label: "风控原因", value: "检测到异地 IP (上海市) 登录尝试" },
        { label: "保护状态", value: "账号临时锁定" },
        { label: "建议处理", value: "请使用绑定手机号 138****9988 获取 SMS 验证码解锁" }
      ]
    },
    { 
      id: "acc2", 
      category: "账号", 
      subcategory: "手机号解绑", 
      title: "备用手机号解绑通知",
      detail: "绑定的备用手机号 138****9988 解绑申请已被系统接受。", 
      status: "read", 
      time: "2026-07-28 15:00",
      details: [
        { label: "解绑号码", value: "138****9988" },
        { label: "申请时间", value: "2026-07-28 15:00:00" },
        { label: "状态", value: "解绑已生效" }
      ]
    },

    // 导出 (Export)
    { 
      id: "exp1", 
      category: "导出", 
      subcategory: "导出生成", 
      title: "导出打包生成完成",
      detail: "导出成功：您打包导出的《4K无水印爆款成品套包.zip (共12条)》生成完毕，可立即下载。", 
      status: "unread", 
      time: "2026-07-31 18:15",
      details: [
        { label: "文件名称", value: "4K无水印爆款成品套包.zip" },
        { label: "包含数量", value: "12 条视频成品" },
        { label: "文件大小", value: "320.4 MB" },
        { label: "网页链接", value: "http://sucaiwang.zhishangsoft.com/#/download-detail/882011", isLink: true }
      ]
    },
    { 
      id: "exp2", 
      category: "导出", 
      subcategory: "导出生成", 
      title: "文案汇总表导出完成",
      detail: "导出生成提醒：《全场景商详文案汇总.xlsx》已导出至云端资产库。", 
      status: "unread", 
      time: "2026-07-31 11:40",
      details: [
        { label: "文件名称", value: "全场景商详文案汇总.xlsx" },
        { label: "存储路径", value: "云端资产库 / 导出的表格" },
        { label: "生成时间", value: "2026-07-31 11:40:00" }
      ]
    },
    { 
      id: "exp3", 
      category: "导出", 
      subcategory: "导出生成", 
      title: "模特质感图集导出完成",
      detail: "导出生成提醒：《3D模特质感图集.zip》已成功保存。", 
      status: "unread", 
      time: "2026-07-30 16:20",
      details: [
        { label: "文件名称", value: "3D模特质感图集.zip" },
        { label: "素材包含", value: "24 张 4K 模特高质感商业图片" },
        { label: "生成时间", value: "2026-07-30 16:20:00" }
      ]
    }
  ]);

  const messagesList = propMessages || messages;

  const [drawerMessage, setDrawerMessage] = useState<any | null>(null);

  const [activeMessageCategory, setActiveMessageCategory] = useState<string>("审批待办");
  const [activeMessageSubcategory, setActiveMessageSubcategory] = useState<string>("all");

  // Helper calculation for unread counts
  const getCategoryUnreadCount = (catName: string) => {
    return messagesList.filter(m => m.category === catName && m.status === "unread").length;
  };

  const getSubcategoryUnreadCount = (catName: string, subName: string) => {
    return messagesList.filter(m => m.category === catName && m.subcategory === subName && m.status === "unread").length;
  };

  // ================= 3. TASK CENTER MODULE STATES =================
  const [allTasks] = useState<TaskItem[]>([
    {
      id: "tk1",
      title: "制作 3 条冬季女装微距质感短片",
      ownerType: "assigned",
      status: "pending",
      creatorOrAssignee: "运营主管·张姐",
      targetMetric: "转化率目标 > 3.8%",
      currentProgress: 2,
      totalProgress: 3,
      deadline: "今日 20:00",
      priority: "high",
      category: "爆款视频"
    },
    {
      id: "tk2",
      title: "对 10 条高曝光原片进行字幕擦除与去水印",
      ownerType: "assigned",
      status: "pending",
      creatorOrAssignee: "投放总监·王经理",
      targetMetric: "高清晰度极速提审",
      currentProgress: 6,
      totalProgress: 10,
      deadline: "明日 12:00",
      priority: "high",
      category: "视频处理"
    },
    {
      id: "tk3",
      title: "产出美妆护肤品多场景商详套图",
      ownerType: "assigned",
      status: "completed",
      creatorOrAssignee: "品牌设计·Mark",
      targetMetric: "详情页停留时长提升20%",
      currentProgress: 5,
      totalProgress: 5,
      deadline: "已达标",
      priority: "medium",
      category: "套图分析"
    },
    {
      id: "tk4",
      title: "AI数字人口播视频套件 (5组)",
      ownerType: "published",
      status: "completed",
      creatorOrAssignee: "短视频创作组·小李",
      targetMetric: "完成口播录制与渲染",
      currentProgress: 5,
      totalProgress: 5,
      deadline: "已达标",
      priority: "high",
      category: "数字人"
    },
    {
      id: "tk5",
      title: "针对数码新品进行爆款裂变重组",
      ownerType: "published",
      status: "pending",
      creatorOrAssignee: "内容运营·陈晨",
      targetMetric: "产出12条高去重裂变成品",
      currentProgress: 8,
      totalProgress: 12,
      deadline: "明日 18:00",
      priority: "medium",
      category: "爆款裂变"
    },
    {
      id: "tk6",
      title: "自动化千川投放链路推流测试",
      ownerType: "published",
      status: "pending",
      creatorOrAssignee: "技术对接·老张",
      targetMetric: "API 响应耗时 < 200ms",
      currentProgress: 1,
      totalProgress: 4,
      deadline: "后天 12:00",
      priority: "low",
      category: "投放对接"
    }
  ]);

  // ================= 4. MESSAGE CENTER MODAL STATES (右上角消息中心) =================
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [centerTypeFilter, setCenterTypeFilter] = useState<string>("全部类型");
  const [centerStatusFilter, setCenterStatusFilter] = useState<"全部" | "未读" | "已读">("全部");
  const [centerTimeFilter, setCenterTimeFilter] = useState<string>("全部时间");

  const totalUnreadCount = messagesList.filter(m => m.status === "unread").length;

  const markAllMessagesRead = () => {
    if (onMarkAllMessagesRead) onMarkAllMessagesRead();
    else setMessages(prev => prev.map(m => ({ ...m, status: "read" })));
  };

  const markSingleMessageRead = (id: string) => {
    if (onMarkMessageRead) onMarkMessageRead(id);
    else setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "read" } : m));
  };

  // Filter messages in Message Center modal
  const filteredCenterMessages = messagesList.filter(m => {
    // Type filter
    if (centerTypeFilter !== "全部类型") {
      if (MESSAGE_CATEGORIES.some(category => category.name === centerTypeFilter)) {
        if (m.category !== centerTypeFilter) return false;
      } else {
        if (m.subcategory !== centerTypeFilter) return false;
      }
    }
    // Status filter
    if (centerStatusFilter === "未读" && m.status !== "unread") return false;
    if (centerStatusFilter === "已读" && m.status !== "read") return false;
    
    // Time filter
    if (centerTimeFilter === "今天" && !m.time.includes("2026-08-19")) return false;
    if (centerTimeFilter === "近3天" && !["2026-08-19", "2026-08-18", "2026-08-17"].some(date => m.time.includes(date))) return false;

    return true;
  });

  // ================= 5. HELP CENTER MODAL STATES =================
  const [activeHelpModal, setActiveHelpModal] = useState<"docs" | "tutorial" | "feedback" | "service" | "faq" | null>(null);
  
  // Feedback form state
  const [feedbackType, setFeedbackType] = useState("功能建议");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Video Tutorial Player
  const [playingTutorialUrl, setPlayingTutorialUrl] = useState<string | null>(null);

  // FAQ Accordion
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  // Selected Update Log Modal
  const [selectedUpdateLog, setSelectedUpdateLog] = useState<UpdateLogItem | null>(null);

  // ================= 6. UPDATE LOG MODULE DATA =================
  const updateLogs: UpdateLogItem[] = [
    {
      version: "v2.8.5",
      date: "2026-07-28",
      title: "视频去水印与字幕擦除 V3 大模型重磅升级",
      tag: "算法升级",
      description: "基于全新时空注意力机制，水印擦除边缘细节保留度提升 45%，支持高清大尺寸视频超高精无痕修复。",
      contents: [
        "智能擦除边缘光影自然过渡，消除违禁水印与边框",
        "新增多音轨字幕文字精准定位与重构引擎",
        "云端并发 GPU 渲染速度提升 30%"
      ]
    },
    {
      version: "v2.8.0",
      date: "2026-07-18",
      title: "AI 数字人主播情感音色与多方言能力上线",
      tag: "新功能",
      description: "数字人分身支持粤语、四川话、东北话等多方言口播，以及带货高亢、情绪安利等多种音色风格切换。",
      contents: [
        "20 位高清超模数字人分身库全量上线",
        "口型匹配误差降低至 < 0.1 秒，唇形与语音高度同步",
        "支持自定义智能文案脚本与实时语速微调"
      ]
    },
    {
      version: "v2.7.2",
      date: "2026-07-08",
      title: "爆款裂变工作台全新重组算法",
      tag: "性能提升",
      description: "一键上传多条原片，平台自动完成分镜拆解、音画去重与视觉贴片，无缝对接主流电商投放平台。",
      contents: [
        "超高去重率算法保护广告账号防封卡审",
        "支持一键批量导出 4K 高码率成品套包",
        "新增千川 / 抖加平台 API 直连推送服务"
      ]
    },
    {
      version: "v2.6.8",
      date: "2026-06-28",
      title: "电商 AI 模特换衣与体型自定义引擎",
      tag: "体验优化",
      description: "支持批量上传多款服装图，智能适配欧美骨感、日系娇小、身材曲线等多种模特身材与逼真影棚光影。",
      contents: [
        "支持平铺服装图一键挂身并保持布料真实皱褶",
        "内置影棚 / 户外 / 居家 4 大常驻光影预设",
        "面料高精度微距质感还原"
      ]
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* TOP HEADER: TITLE & TOP-RIGHT MESSAGE CENTER BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>欢迎回到梦畅 AIGC 电商平台</span>
            </h1>
          </div>

          {/* MODULE 4 ENTRY: Top Right Message Center Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveScreen("message_center")}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-2xl shadow-xs flex items-center gap-2.5 transition-all cursor-pointer hover:border-purple-300 relative group"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-black">消息中心</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 1. 搜索模块 (SEARCH MODULE) - 放在最顶部                              */}
        {/* =================================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div>
                <h2 className="text-base font-black text-slate-900">全平台资源精准搜索</h2>
                <p className="mt-1 text-xs text-slate-400">支持成片、素材、脚本、图片与音频分类检索</p>
              </div>
            </div>
          </div>

          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleExecuteSearch} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                <div className="relative shrink-0 border-r border-slate-200 bg-slate-50">
                  <select
                    aria-label="资源搜索分类"
                    value={searchType}
                    onChange={(event) => {
                      setSearchType(event.target.value as ResourceSearchType);
                      setSearchPanelOpen(false);
                    }}
                    onFocus={() => setSearchPanelOpen(false)}
                    className="h-12 appearance-none bg-transparent pl-4 pr-10 text-sm font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    {RESOURCE_SEARCH_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>

                <Search className="ml-4 h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchPanelOpen(true)}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchPanelOpen(true);
                  }}
                  placeholder={`请输入${searchType}名称、分类或标签`}
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="mr-3 text-slate-400 hover:text-slate-700" title="清空关键词">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button type="submit" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-purple-600 px-7 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700">
                <Search className="h-4 w-4" />
                搜索
              </button>
            </form>

            {!searchPanelOpen && (
              <div className="mt-3 flex flex-wrap items-center gap-2 md:pl-28">
                <Flame className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500" />
                {RESOURCE_HOT_TAGS[searchType].slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => openResourceSearch(searchType, { tag })}
                    className="h-7 rounded-md bg-slate-100 px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-purple-600 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {searchPanelOpen && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[430px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="space-y-1">
                  {RESOURCE_SEARCH_TYPES.map((type) => (
                    <div key={type} className={`grid gap-3 rounded-lg px-3 py-3 md:grid-cols-[96px_minmax(0,1fr)] ${searchType === type ? "bg-purple-50/70" : "hover:bg-slate-50"}`}>
                      <button type="button" onClick={() => openResourceSearch(type)} className="flex h-7 items-center gap-1 text-sm font-black text-purple-600 hover:text-purple-800">
                        {type}管理
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {RESOURCE_HOT_TAGS[type].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => openResourceSearch(type, { tag })}
                            className="h-7 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-purple-600 hover:text-white"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 中间区域: 左侧 [消息通知] VS 右侧 [任务中心 + 帮助中心 上下堆叠]    */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 左侧 (7/12): 2. 消息通知模块 (MESSAGE NOTIFICATION MODULE) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">消息通知</h2>
                  <p className="text-[11px] text-slate-400">集中查看审批、任务、内容、直播与安全动态</p>
                </div>
              </div>

              <button
                onClick={() => setActiveScreen("message_center")}
                className="text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer shrink-0 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl transition-all"
              >
                <span>全部消息</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 Categories Tabs with Unread Badges */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
              {MESSAGE_CATEGORIES.map((cat) => {
                const unreadCount = getCategoryUnreadCount(cat.name);
                const isActive = activeMessageCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveMessageCategory(cat.name);
                      setActiveMessageSubcategory("all");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200/70 text-slate-700"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {unreadCount > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black inline-flex items-center justify-center min-w-[18px] ${
                        isActive ? "bg-white text-purple-700" : "bg-rose-500 text-white"
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Category Subcategories and Notifications */}
            {(() => {
              const currentCatConfig = MESSAGE_CATEGORIES.find(c => c.name === activeMessageCategory);
              if (!currentCatConfig) return null;

              const currentFilteredMessages = messagesList.filter(m => {
                const catMatch = m.category === activeMessageCategory;
                if (!catMatch) return false;
                if (activeMessageSubcategory !== "all" && m.subcategory !== activeMessageSubcategory) return false;
                return true;
              });

              return (
                <div className="space-y-2.5 flex-1 flex flex-col justify-start">
                  {/* Clickable Subcategory List with Unread Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 mr-0.5 shrink-0">分类细项:</span>
                    {(() => {
                      const catUnreadAll = messagesList.filter(m => m.category === activeMessageCategory && m.status === "unread").length;
                      return (
                        <button
                          onClick={() => setActiveMessageSubcategory("all")}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeMessageSubcategory === "all"
                              ? "bg-purple-600 text-white shadow-2xs font-black"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90"
                          }`}
                        >
                          <span>全部细项</span>
                          {catUnreadAll > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black inline-flex items-center justify-center min-w-[18px] ${
                              activeMessageSubcategory === "all" ? "bg-white text-purple-700" : "bg-rose-500 text-white"
                            }`}>
                              {catUnreadAll}
                            </span>
                          )}
                        </button>
                      );
                    })()}

                    {currentCatConfig.subcategories.map((sub) => {
                      const subUnread = getSubcategoryUnreadCount(activeMessageCategory, sub);
                      const isSubActive = activeMessageSubcategory === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => setActiveMessageSubcategory(isSubActive ? "all" : sub)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSubActive
                              ? "bg-purple-600 text-white shadow-2xs font-black"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90"
                          }`}
                        >
                          <span>{sub}</span>
                          {subUnread > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black inline-flex items-center justify-center min-w-[18px] ${
                              isSubActive ? "bg-white text-purple-700" : "bg-rose-500 text-white"
                            }`}>
                              {subUnread}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Notification List for this Category */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 flex-1 mt-1">
                    {currentFilteredMessages.length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        该细项下暂无消息通知
                      </div>
                    ) : (
                      currentFilteredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            markSingleMessageRead(msg.id);
                            setDrawerMessage(msg);
                          }}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                            msg.status === "unread"
                              ? "bg-purple-50/50 border-purple-200 hover:border-purple-300 shadow-2xs"
                              : "bg-slate-50/80 border-slate-200/80 opacity-80"
                          }`}
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {msg.status === "unread" && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                              )}
                              <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                                {msg.subcategory}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">{msg.time}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 leading-relaxed">
                              {msg.detail}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                            msg.status === "unread" ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-600"
                          }`}>
                            {msg.status === "unread" ? "未读" : "已读"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 右侧 (5/12): 上下堆叠 [3. 任务中心] 与 [5. 帮助中心] */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* 3. 任务中心 (TASK CENTER MODULE) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <ListTodo className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">任务中心</h2>
                    <p className="text-[11px] text-slate-400">三大类任务数量概览 (点击数字进入协作)</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToTaskTab) onNavigateToTaskTab("all");
                    else setActiveScreen("task_collaboration");
                  }}
                  className="text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer shrink-0 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl transition-all"
                >
                  <span>任务协作</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Three Task Categories Overview Cards */}
              <div className="space-y-2.5 flex-1 flex flex-col justify-around">
                {/* 1. 给我的任务 */}
                <div
                  onClick={() => {
                    if (onNavigateToTaskTab) onNavigateToTaskTab("to_me");
                    else setActiveScreen("task_collaboration");
                  }}
                  className="bg-slate-50 hover:bg-purple-50/60 border border-slate-200/90 hover:border-purple-300 p-3 rounded-2xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-600 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-900 group-hover:text-purple-800">给我的任务</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-bold">
                        待完成 <strong className="font-black">{allTasks.filter(t => t.ownerType === "assigned" && t.status === "pending").length}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-bold">
                        已达标 <strong className="font-black">{allTasks.filter(t => t.ownerType === "assigned" && t.status === "completed").length}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-purple-700 group-hover:scale-110 transition-transform">
                      {allTasks.filter(t => t.ownerType === "assigned").length} <span className="text-xs font-bold text-slate-500">项</span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-bold group-hover:underline">点击进入 →</span>
                  </div>
                </div>

                {/* 2. 我发布的任务 */}
                <div
                  onClick={() => {
                    if (onNavigateToTaskTab) onNavigateToTaskTab("my_published");
                    else setActiveScreen("task_collaboration");
                  }}
                  className="bg-slate-50 hover:bg-purple-50/60 border border-slate-200/90 hover:border-purple-300 p-3 rounded-2xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-900 group-hover:text-purple-800">我发布的任务</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-bold">
                        待完成 <strong className="font-black">{allTasks.filter(t => t.ownerType === "published" && t.status === "pending").length}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-bold">
                        已达标 <strong className="font-black">{allTasks.filter(t => t.ownerType === "published" && t.status === "completed").length}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-blue-700 group-hover:scale-110 transition-transform">
                      {allTasks.filter(t => t.ownerType === "published").length} <span className="text-xs font-bold text-slate-500">项</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold group-hover:underline">点击进入 →</span>
                  </div>
                </div>

                {/* 3. 全部任务 */}
                <div
                  onClick={() => {
                    if (onNavigateToTaskTab) onNavigateToTaskTab("all");
                    else setActiveScreen("task_collaboration");
                  }}
                  className="bg-slate-50 hover:bg-purple-50/60 border border-slate-200/90 hover:border-purple-300 p-3 rounded-2xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-800 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-900 group-hover:text-purple-800">全部任务</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-bold">
                        待完成 <strong className="font-black">{allTasks.filter(t => t.status === "pending").length}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-bold">
                        已达标 <strong className="font-black">{allTasks.filter(t => t.status === "completed").length}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-slate-900 group-hover:scale-110 transition-transform">
                      {allTasks.length} <span className="text-xs font-bold text-slate-500">项</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold group-hover:underline">点击进入 →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. 帮助中心 (HELP CENTER MODULE) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">帮助中心</h2>
                    <p className="text-[11px] text-slate-400">快速查阅文档、视频、客服与反馈</p>
                  </div>
                </div>
              </div>

              {/* 5 Feature Entries */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. 帮助文档 */}
                <button
                  onClick={() => setActiveHelpModal("docs")}
                  className="bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-300 p-2.5 rounded-xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-purple-700">帮助文档</span>
                </button>

                {/* 2. 视频教程 */}
                <button
                  onClick={() => setActiveHelpModal("tutorial")}
                  className="bg-slate-50 hover:bg-pink-50/70 border border-slate-200/80 hover:border-pink-300 p-2.5 rounded-xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                >
                  <Video className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-pink-700">视频教程</span>
                </button>

                {/* 3. 意见反馈 */}
                <button
                  onClick={() => setActiveHelpModal("feedback")}
                  className="hidden bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-300 p-2.5 rounded-xl flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-amber-700">意见反馈</span>
                </button>

                {/* 4. 联系客服 */}
                <button
                  onClick={() => setActiveHelpModal("service")}
                  className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 p-2.5 rounded-xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                >
                  <Headphones className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-emerald-700">联系客服</span>
                </button>

                {/* 5. 常见问题 */}
                <button
                  onClick={() => setActiveHelpModal("faq")}
                  className="bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 p-2.5 rounded-xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs col-span-2 sm:col-span-1"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-blue-700">常见问题</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* =================================================================== */}
        {/* 6. 更新记录模块 (UPDATE LOG MODULE) - 一横排小卡片极简布局              */}
        {/* =================================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">更新记录</h2>
                <p className="text-[11px] text-slate-400">算法迭代与功能发布日志 (点击小卡片查看完整详情)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {updateLogs.map((log, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedUpdateLog(log)}
                className="bg-slate-50 hover:bg-purple-50/50 border border-slate-200/90 hover:border-purple-300 p-3 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between shadow-2xs space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {log.version}
                      </span>
                      <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                        {log.tag}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">{log.date}</span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {log.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1 leading-snug">
                    {log.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] font-bold">
                  <span className="text-slate-400">点击查看详情</span>
                  <span className="text-purple-600 group-hover:underline flex items-center gap-0.5">
                    详情 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL: 消息中心 (MESSAGE CENTER FULL MODAL)                           */}
      {/* =================================================================== */}
      {isMessageCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">消息中心</h3>
                  <p className="text-[11px] text-slate-400">按消息类型、状态与时间筛选全平台通知</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={markAllMessagesRead}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>全部标为已读</span>
                </button>
                <button
                  onClick={() => setIsMessageCenterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Module (顶部筛选模块) */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. 消息类型 */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">消息类型</label>
                <select
                  value={centerTypeFilter}
                  onChange={(e) => setCenterTypeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="全部类型">全部类型</option>
                  <optgroup label="主分类">
                    {MESSAGE_CATEGORIES.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
                  </optgroup>
                  <optgroup label="具体细项">
                    {MESSAGE_CATEGORIES.flatMap(category => category.subcategories).map(subcategory => <option key={subcategory} value={subcategory}>{subcategory}</option>)}
                  </optgroup>
                </select>
              </div>

              {/* 2. 消息状态 */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">消息状态</label>
                <div className="flex bg-white p-0.5 border border-slate-200 rounded-xl text-xs font-bold">
                  {(["全部", "未读", "已读"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCenterStatusFilter(st)}
                      className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                        centerStatusFilter === st
                          ? "bg-purple-600 text-white font-black"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 消息时间 */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">消息时间</label>
                <select
                  value={centerTimeFilter}
                  onChange={(e) => setCenterTimeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="全部时间">全部时间</option>
                  <option value="今天">今天</option>
                  <option value="近3天">近3天</option>
                </select>
              </div>
            </div>

            {/* Message List (消息列表) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredCenterMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  没有找到符合筛选条件的消息
                </div>
              ) : (
                filteredCenterMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      markSingleMessageRead(msg.id);
                      setDrawerMessage(msg);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      msg.status === "unread"
                        ? "bg-purple-50/40 border-purple-200 hover:border-purple-300"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 状态 (未读/已读) */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          msg.status === "unread" ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                          {msg.status === "unread" ? "未读" : "已读"}
                        </span>

                        {/* 分类 */}
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded">
                          {msg.category} · {msg.subcategory}
                        </span>

                        {/* 时间 */}
                        <span className="text-[11px] text-slate-400 font-medium font-mono">{msg.time}</span>
                      </div>

                      {/* 消息详情 */}
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {msg.detail}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markSingleMessageRead(msg.id);
                        setDrawerMessage(msg);
                      }}
                      className="text-[11px] font-bold text-purple-600 hover:text-purple-800 shrink-0 cursor-pointer"
                    >
                      详情
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>当前列表显示 {filteredCenterMessages.length} 条消息</span>
              <button
                onClick={() => setIsMessageCenterOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODALS FOR HELP CENTER (DOCS, TUTORIALS, FEEDBACK, SERVICE, FAQ)     */}
      {/* =================================================================== */}
      
      {/* 1. HELP DOCS MODAL */}
      {activeHelpModal === "docs" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">平台帮助文档与操作指南</h3>
              </div>
              <button onClick={() => setActiveHelpModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs text-slate-700 leading-relaxed">
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <h4 className="font-extrabold text-purple-900 mb-1">💡 1. 如何使用快速创作模式？</h4>
                <p>在快速创作界面中，直接输入文案或参考提示词，支持一键上传商品素材图或痛点对比图，系统会自动调用 GPU 大模型集群生成 4K 高清成片。</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 mb-1">🚀 2. 视频去水印与裂变重组注意事项</h4>
                <p>支持批量上传长视频原片，算法会自动拆解高曝光分镜，并进行无痕字幕擦除与去重，可直接推送到千川投放户。</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 mb-1">📊 3. 算力消耗与扣费规则</h4>
                <p>图片渲染：1-2 算力/张；视频生成：10-25 算力/条。渲染失败将自动回退算力积分。</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-right">
              <button onClick={() => setActiveHelpModal(null)} className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIDEO TUTORIAL MODAL */}
      {activeHelpModal === "tutorial" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-pink-600" />
                <h3 className="text-base font-black text-slate-900">实操视频教程</h3>
              </div>
              <button onClick={() => { setActiveHelpModal(null); setPlayingTutorialUrl(null); }} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {playingTutorialUrl ? (
              <div className="space-y-3">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                  <video src={playingTutorialUrl} controls autoPlay className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setPlayingTutorialUrl(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  返回教程列表
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
                {[
                  { title: "3分钟学会爆款视频擦水印与高去重裂变", duration: "03:20", cover: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&fit=crop", video: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4" },
                  { title: "AI 数字人主播一键口播带货视频全流程", duration: "02:15", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop", video: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4" },
                  { title: "爆款痛点对比图与使用过程视频组装技巧", duration: "04:10", cover: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&fit=crop", video: "https://assets.mixkit.co/videos/preview/mixkit-woman-with-makeup-posing-near-flowers-40540-large.mp4" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPlayingTutorialUrl(item.video)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2 cursor-pointer hover:border-pink-300 transition-all"
                  >
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group">
                      <img src={item.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
                        {item.duration}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. FEEDBACK MODAL */}
      {activeHelpModal === "feedback" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">意见反馈</h3>
              </div>
              <button onClick={() => { setActiveHelpModal(null); setFeedbackSubmitted(false); }} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-slate-900">感谢您的宝贵建议！</h4>
                <p className="text-xs text-slate-500">产品与技术团队将优先处理您的反馈并不断提升软件品质。</p>
                <button onClick={() => { setActiveHelpModal(null); setFeedbackSubmitted(false); }} className="px-5 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                  关闭
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">反馈类型</label>
                  <div className="flex gap-2">
                    {["功能建议", "漏洞上报", "画质提升", "其他"].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFeedbackType(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          feedbackType === t ? "bg-amber-50 border-amber-300 text-amber-700" : "border-slate-200 text-slate-600"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">内容描述</label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="请详细说明您遇到的使用体验问题或功能诉求..."
                    className="w-full border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={!feedbackText.trim()}
                  onClick={() => setFeedbackSubmitted(true)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  提交意见反馈
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CUSTOMER SERVICE MODAL */}
      {activeHelpModal === "service" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">联系客服</h3>
              </div>
              <button onClick={() => setActiveHelpModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
                <Headphones className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">在线客服经理：梦畅客服小妹</h4>
                <p className="text-[11px] text-emerald-600 font-bold mt-0.5">● 当前状态：在线 (平均响应 &lt; 30秒)</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-600 space-y-1 text-left">
                <p>💬 微信专属客服: <span className="font-mono font-bold text-slate-900">mc_aigc_support_01</span></p>
                <p>📞 服务热线: <span className="font-mono font-bold text-slate-900">400-880-9922</span></p>
                <p>⏰ 服务时间: 周一至周日 09:00 - 24:00</p>
              </div>
            </div>

            <button
              onClick={() => {
                alert("已为您发起实时在线客服接入对话！");
                setActiveHelpModal(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              发起在线对话
            </button>
          </div>
        </div>
      )}

      {/* 5. FAQ MODAL */}
      {activeHelpModal === "faq" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">常见问题 (FAQ)</h3>
              </div>
              <button onClick={() => setActiveHelpModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {[
                { id: "faq-1", q: "1. 算力积分扣除规则是什么？渲染失败会退还吗？", a: "图片生成扣除1-2算力，视频生成扣除10-25算力。如遇渲染失败或异常中断，系统会自动全额退回算力。" },
                { id: "faq-2", q: "2. 生成的素材是否有版权风险？能否商业投放？", a: "梦畅 AIGC 生成的全部成片与素材均具备商业授权，可放心在抖音、千川、淘宝、小红书等平台投放。" },
                { id: "faq-3", q: "3. 如何提升裂变视频的平台去重率？", a: "建议搭配无痕去水印、画面微调调色以及 AI 数字人语音混音，去重过审率可达 98% 以上。" },
                { id: "faq-4", q: "4. 支持导出哪些视频与图册格式？", a: "默认导出 H.264 4K MP4 通用无损视频与 2K/4K 高清 PNG 图片包。" }
              ].map(faq => (
                <div key={faq.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs font-extrabold text-slate-800"
                  >
                    <span>{faq.q}</span>
                    {expandedFaqId === faq.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {expandedFaqId === faq.id && (
                    <div className="p-3 bg-white text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 text-right">
              <button onClick={() => setActiveHelpModal(null)} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 更新日志详情 */}
      {selectedUpdateLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
                    {selectedUpdateLog.version}
                  </span>
                  <span className="text-xs font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                    {selectedUpdateLog.tag}
                  </span>
                  <span className="text-xs font-medium text-slate-400 font-mono">
                    发布日期: {selectedUpdateLog.date}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 pt-1">
                  {selectedUpdateLog.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUpdateLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-xs text-slate-700 font-medium leading-relaxed">
              {selectedUpdateLog.description}
            </div>

            {/* Detailed Change Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>更新内容明细</span>
              </h4>
              <ul className="space-y-2 bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100">
                {selectedUpdateLog.contents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUpdateLog(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 消息详情 Slide-over Drawer (与消息中心中的消息详情格式一致) */}
      {drawerMessage && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-2xs animate-fade-in">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setDrawerMessage(null)} />

          {/* Drawer Panel */}
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-slate-200">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">消息详情</h2>
              <button
                onClick={() => setDrawerMessage(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
              {/* Message Title & Time */}
              <div>
                <h3 className="text-sm font-black text-slate-900">{drawerMessage.title || drawerMessage.subcategory}</h3>
                <p className="text-slate-400 font-mono text-xs mt-1">{drawerMessage.time}</p>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              {/* Key Value Details */}
              <div className="space-y-3 font-normal leading-relaxed">
                {(drawerMessage.details || [
                  { label: "消息分类", value: `${drawerMessage.category} - ${drawerMessage.subcategory}` },
                  { label: "消息内容", value: drawerMessage.detail }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="text-slate-600">
                      <span className="text-slate-600">{item.label}: </span>
                      {item.isLink ? (
                        <a
                          href={item.value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:underline inline-flex items-center gap-1 font-mono break-all"
                        >
                          <span>{item.value}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-800 break-words">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Credit Audit Approval Action Box */}
              {drawerMessage.approvalType === "credits" && (
                <ApprovalActionBox
                  message={drawerMessage}
                  onApprove={(id) => onApproveCredits && onApproveCredits(id)}
                  onReject={(id, reason) => onRejectCredits && onRejectCredits(id, reason)}
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
