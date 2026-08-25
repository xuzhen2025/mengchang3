import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowUp, Check, CheckCircle2, ChevronDown, Copy, Download, Eye,
  FileText, Film, History, Image as ImageIcon, Link2, Loader2,
  MessageSquare, MoreHorizontal, Package, Palette, Play, Plus, Search,
  RefreshCw, Settings, Sparkles, Square, Trash2, Upload,
  Video, WandSparkles, X
} from "lucide-react";
import { Task } from "../types";
import UploadFinishedVideoModal from "./UploadFinishedVideoModal";

type StepType = "analysis" | "script" | "preview" | "final";
type SessionStatus = "queue" | "generating" | "completed" | "failed" | "cancelled";

interface ProductSelection {
  id: string;
  name: string;
  image: string;
  source: "douyin" | "images" | "local" | "conversation";
}

interface ReferenceVideoSelection {
  id: string;
  name: string;
  cover: string;
  duration: string;
  size: string;
}

interface ScriptSelection {
  id: string;
  name: string;
  category: string;
  status: string;
  author: string;
  updatedAt: string;
}

interface SourceVideoSelection {
  id: string;
  name: string;
  cover: string;
  status: string;
  section: "成片" | "素材" | "本地上传";
  category: string;
  author: string;
  durationSeconds: number;
  duration: string;
  size: string;
  tags: string[];
}

interface CreativeItem {
  id: number;
  title: string;
  angle: string;
  script: string;
}

interface PreviewItem {
  id: string;
  name: string;
  cover: string;
  selected: boolean;
}

interface FinalVideoItem {
  id: string;
  name: string;
  cover: string;
  duration: string;
  selected: boolean;
}

interface ResultRecord {
  id: string;
  step: StepType;
  title: string;
  version?: number;
  time: string;
  snapshot: {
    demand: string;
    product?: ProductSelection;
    productName: string;
    industry: string;
    category: string;
    sellingPoints: string[];
    painPoints: string[];
    targetGroups: string[];
    scenarios: string[];
    specs: string[];
    discountInfo: string;
    creatives: CreativeItem[];
    previews: PreviewItem[];
    finals: FinalVideoItem[];
  };
}

interface AgentSession {
  id: string;
  title: string;
  prompt: string;
  mode: "step" | "one_click";
  currentStep: StepType;
  availableSteps: StepType[];
  status: SessionStatus;
  progress: number;
  creditsCost: number;
  updatedAt: string;
  demand: string;
  productName: string;
  industry: string;
  category: string;
  sellingPoints: string[];
  painPoints: string[];
  targetGroups: string[];
  scenarios: string[];
  specs: string[];
  discountInfo: string;
  creatives: CreativeItem[];
  previews: PreviewItem[];
  finals: FinalVideoItem[];
  timeline: ResultRecord[];
  versionCounts: Record<"analysis" | "script", number>;
  activeVersions: Record<"analysis" | "script", number>;
  awaitingProduct?: boolean;
  product?: ProductSelection;
  conversation?: Array<{ role: "user" | "agent"; content: string }>;
}

interface AgentCreationViewProps {
  credits: number;
  activeTask?: Task;
  onSyncTask: (task: Task, creditsCharge?: number) => void;
  onCancelTask: (taskId: string) => void;
  onOpenQueue: () => void;
  onSessionChange: (sessionId: string | null) => void;
  onUploadVideos: (videos: Array<{ name: string; cover: string }>) => void;
  onBack: () => void;
}

const STORAGE_KEY = "mengchang_agent_sessions_v2";
const REFERENCE_STORAGE_KEY = "mengchang_agent_reference_videos";
const STEP_META: Array<{ id: StepType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "analysis", label: "需求分析", icon: FileText },
  { id: "script", label: "创意与分镜", icon: WandSparkles },
  { id: "preview", label: "视频预览", icon: Play },
  { id: "final", label: "视频成片", icon: Video }
];

const SAMPLE_COVERS = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=720&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=720&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=720&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=720&auto=format&fit=crop&q=85"
];

const IMAGE_LIBRARY: ProductSelection[] = [
  { id: "img-1", name: "防晒植物提取精华液展图.jpg", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", source: "images" },
  { id: "img-2", name: "无痕防晒冰丝丝袜场景模特图.png", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80", source: "images" },
  { id: "img-4", name: "草本护肤成分拆解对比展图.png", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80", source: "images" },
  { id: "img-8", name: "高奢护肤瓶身渲染特写.jpg", image: "https://images.unsplash.com/photo-1608248597261-833257058444?w=600&auto=format&fit=crop&q=80", source: "images" }
];

const REFERENCE_VIDEOS: ReferenceVideoSelection[] = [
  { id: "ref-1", name: "夏日防晒实测高转化素材.mp4", cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", duration: "00:28", size: "24.6 MB" },
  { id: "ref-2", name: "通勤穿搭口播投放素材.mp4", cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80", duration: "00:42", size: "38.1 MB" },
  { id: "ref-3", name: "厨房清洁前后对比素材.mp4", cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80", duration: "00:35", size: "31.8 MB" }
];

const SCRIPT_OPTIONS: ScriptSelection[] = [
  { id: "S-10291", name: "脚本 1 - 口播温和洁面破圈案", category: "个护家清 / 洗发护发", status: "待审核", author: "致上编导", updatedAt: "2026-08-04 14:20" },
  { id: "S-10292", name: "玻璃油膜擦雨天实测分镜", category: "汽车用品 / 清洁养护", status: "审核通过", author: "徐振", updatedAt: "2026-08-18 10:32" },
  { id: "S-10293", name: "高腰塑身裤痛点反转脚本", category: "服饰内衣 / 女士内衣", status: "审核通过", author: "汤小真", updatedAt: "2026-08-20 16:08" }
];

const SOURCE_VIDEOS: SourceVideoSelection[] = [
  { id: "110332274", name: "复古耳环动态奢感视频.mp4", cover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80", status: "待审核", section: "成片", category: "服饰内衣 / 饰品", author: "刘弯", durationSeconds: 15, duration: "00:15", size: "14.2 MB", tags: ["达人成片", "高端质感"] },
  { id: "110332275", name: "水光针去黄测评爆款对比.mp4", cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", status: "审核通过", section: "成片", category: "美妆护肤 / 面部护理", author: "张小花", durationSeconds: 30, duration: "00:30", size: "24.1 MB", tags: ["对比实测", "爆款短视频"] },
  { id: "110332301", name: "风衣面料防风细节原始素材.mp4", cover: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80", status: "未审核", section: "素材", category: "服饰内衣 / 面料展示", author: "梁浩然", durationSeconds: 18, duration: "00:18", size: "28.7 MB", tags: ["产品名称", "空镜"] },
  { id: "110332302", name: "冰丝面料拉伸微距素材.mp4", cover: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80", status: "审核通过", section: "素材", category: "服饰内衣 / 商品实拍", author: "徐振", durationSeconds: 24, duration: "00:24", size: "35.4 MB", tags: ["面料展示", "仅看我的"] },
  { id: "110332303", name: "不粘锅煎蛋过程原始素材.mp4", cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80", status: "审核驳回", section: "素材", category: "日用百货 / 厨房用品", author: "赵铁柱", durationSeconds: 42, duration: "00:42", size: "51.2 MB", tags: ["产品实拍", "使用过程"] }
];

const STYLE_VIDEO_POOL = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/5823543/5823543-hd_1920_1080_25fps.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
  "https://media.w3.org/2010/05/video/movie_300.mp4"
];

const STYLE_COVER_POOL = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=720&auto=format&fit=crop&q=82",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=720&auto=format&fit=crop&q=82"
];

const styleDirection = (name: string, index: number) => ({
  name,
  video: STYLE_VIDEO_POOL[index % STYLE_VIDEO_POOL.length],
  cover: STYLE_COVER_POOL[index % STYLE_COVER_POOL.length]
});

const STYLE_OPTIONS = [
  {
    name: "品牌高级质感风",
    visual: "精致柔光 + 低饱和统一色调 + 极简构图 + 大量留白，重点突出产品肌理与质感，画面干净无冗余元素。光影考究（常用蝴蝶光、侧逆光勾勒轮廓），多采用慢镜头、电影级运镜，整体精致度与高级感拉满。",
    directions: ["轻奢极简风", "院线专业风", "高端商务风", "侘寂质感风"].map((name, index) => styleDirection(name, index)),
    categories: "高客单价护肤 / 美妆、珠宝腕表、高端家电、轻奢服饰、香氛、奢侈品",
    positioning: "用于品牌形象塑造、高净值人群破圈、拉升产品溢价，适合品牌广告与精准人群千川投放；缺点是硬广感较强，泛流量下完播率偏低。"
  },
  {
    name: "街拍生活氛围感",
    visual: "户外自然光影 + 动态抓拍感 + 城市 / 自然街景，画面松弛有呼吸感，色调多为暖调胶片感或清透日系感。不刻意摆拍，主打“随手拍的日常美感”，人物状态自然松弛。",
    directions: ["都市通勤风", "美式复古街拍", "Citywalk 日常感", "日系治愈街景", "户外露营风"].map((name, index) => styleDirection(name, index + 1)),
    categories: "服饰鞋包、配饰墨镜、防晒用品、便携数码、茶饮、户外装备",
    positioning: "穿搭、生活类种草素材的核心风格，用户代入感强、完播率高，是服饰、配饰类目的跑量主力风格。"
  },
  {
    name: "居家原生生活感",
    visual: "真实居家场景（客厅、厨房、卧室、浴室）+ 自然光为主 + 生活化细节痕迹，构图随意自然，无刻意精致布景，画面“不完美但真实”，主打普通人的日常代入感。",
    directions: ["温馨治愈居家风", "沉浸式宅家风", "厨房烟火气", "浴室洗漱日常", "租房改造风"].map((name, index) => styleDirection(name, index + 2)),
    categories: "家居清洁、日用百货、小家电、食品零食、母婴用品、洗护用品",
    positioning: "全品类通用的跑量风格，生活化场景天然降低广告感，用户信任度高、转化稳定，是剧情种草、好物分享类素材的首选。"
  },
  {
    name: "硬核实测真实感",
    visual: "近距离怼拍产品 + 原相机直出质感 + 无多余修饰，光线直白甚至略显“粗糙”，全程无明显剪辑感。画面优先级完全让位于效果展示，主打“眼见为实”的说服力。",
    directions: ["暴力测试风", "原相机测评风", "实验室专业风", "工地 / 户外硬核风"].map((name, index) => styleDirection(name, index + 3)),
    categories: "功能性清洁品、美妆遮瑕 / 底妆、五金工具、汽车用品、防水耐磨产品、建材",
    positioning: "高转化、高 ROI 的核心素材风格，用直观效果戳中痛点，信任度极强；缺点是开头钩子弱时完播率偏低，需配合强痛点文案。"
  },
  {
    name: "口播原生纪实感",
    visual: "近景大头构图 + 普通背景（白墙 / 居家 / 办公室）+ 自然打光，无精致妆造与专业布景，接近普通人随手拍的分享视频，“素人感”“真实感”拉满。",
    directions: ["素人分享风", "博主种草风", "专家科普风", "办公室闲聊风", "宝妈真实反馈"].map((name, index) => styleDirection(name, index + 4)),
    categories: "全品类通吃，尤其美妆护肤、食品保健品、知识付费、日用百货",
    positioning: "最低成本、最高产能的铺量风格，制作周期短、可批量复制，是千川矩阵号、多账号跑量的核心素材；缺点是同质化严重，需强话术钩子留人。"
  },
  {
    name: "国潮东方美学风",
    visual: "中式传统元素 + 对称构图 + 柔和漫射光，色调以赭石、青灰、朱砂等传统色系为主，搭配水墨、木纹、瓷器、宣纸等道具，主打东方雅致意境与文化氛围感。",
    directions: ["新中式轻奢风", "古风意境风", "非遗国风", "禅意茶系风"].map((name, index) => styleDirection(name, index + 5)),
    categories: "国风美妆、草本护肤、茶叶茶具、中式家居、汉服配饰、滋补养生品",
    positioning: "精准触达国风人群，强化品牌文化调性，适合差异化竞争；泛流量下受众面较窄，更适合定向投放。"
  },
  {
    name: "科技未来工业风",
    visual: "冷色调金属质感 + 暗调环境光 + 科技蓝 / 紫光点缀，线条硬朗锐利，多实验室、工业场景，突出技术感与专业属性，运镜多为机械感推拉、环绕。",
    directions: ["赛博科技风", "实验室专业风", "工业硬核风", "数码极简风"].map((name, index) => styleDirection(name, index + 6)),
    categories: "数码 3C、智能家电、男士护肤、汽车用品、黑科技产品、功能性保健品",
    positioning: "强化产品技术背书，触达男性、科技爱好者人群，适合突出成分、技术、功能的产品。"
  },
  {
    name: "复古怀旧年代感",
    visual: "胶片颗粒质感 + 暖黄复古色调 + 年代感场景道具，主打情怀共鸣，画面自带故事感，常用 80 / 90 年代老街、老房子、旧物件等场景元素。",
    directions: ["港风复古", "90 年代怀旧风", "美式复古", "民国复古风"].map((name, index) => styleDirection(name, index + 7)),
    categories: "怀旧零食、老国货、复古服饰、文创周边、情怀类产品",
    positioning: "靠情怀拉升完播率与记忆点，适合老品牌翻新、怀旧向产品，差异化竞争优势明显。"
  }
];

const nowText = () => new Date().toISOString().replace("T", " ").slice(0, 16);
const shortTime = () => new Date().toTimeString().slice(0, 5);
const cloneItems = <T,>(items: T[]) => items.map((item) => ({ ...item }));
const productDisplayName = (product?: ProductSelection) => product?.name.replace(/\.(jpg|jpeg|png|webp)$/i, "") || "待补充商品名称";

const createCreatives = (start: number): CreativeItem[] => [
  { id: start + 1, title: "雨天视线危机", angle: "痛点实测", script: "雨刮越刮越模糊？用真实雨天场景对比清洁前后的玻璃透光效果。" },
  { id: start + 2, title: "夜间炫光对比", angle: "场景转化", script: "用对向车灯炫光切入，展示擦拭后的清晰视野，强化安全驾驶价值。" },
  { id: start + 3, title: "30秒快速去膜", angle: "效率展示", script: "计时完成涂抹、擦拭和冲洗，用完整操作过程证明简单易用。" }
];

const createPreviews = (): PreviewItem[] => [
  { id: `preview_${Date.now()}_1`, name: "推荐", cover: SAMPLE_COVERS[0], selected: true },
  { id: `preview_${Date.now()}_2`, name: "备用", cover: SAMPLE_COVERS[1], selected: true }
];

const createFinals = (previews: PreviewItem[]): FinalVideoItem[] =>
  previews.filter((item) => item.selected).map((item, index) => ({
    id: `final_${Date.now()}_${index}`,
    name: `${item.name}版_玻璃油膜擦营销成片.mp4`,
    cover: item.cover,
    duration: index % 2 === 0 ? "00:28" : "00:30",
    selected: true
  }));

const recordFor = (session: AgentSession, step: StepType, title: string, version?: number): ResultRecord => ({
  id: `result_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  step,
  title,
  version,
  time: shortTime(),
  snapshot: {
    demand: session.demand,
    product: session.product ? { ...session.product } : undefined,
    productName: session.productName,
    industry: session.industry,
    category: session.category,
    sellingPoints: [...session.sellingPoints],
    painPoints: [...session.painPoints],
    targetGroups: [...session.targetGroups],
    scenarios: [...session.scenarios],
    specs: [...session.specs],
    discountInfo: session.discountInfo,
    creatives: cloneItems(session.creatives),
    previews: cloneItems(session.previews),
    finals: cloneItems(session.finals)
  }
});

const makeBaseSession = (prompt: string, mode: AgentSession["mode"]): AgentSession => ({
  id: `agent_${Date.now()}`,
  title: prompt.slice(0, 24) || "玻璃油膜擦营销视频",
  prompt,
  mode,
  currentStep: "analysis",
  availableSteps: ["analysis"],
  status: "generating",
  progress: 18,
  creditsCost: mode === "one_click" ? 5 : 0,
  updatedAt: nowText(),
  demand: "围绕雨天和夜间驾驶视线模糊的真实痛点，突出快速去油膜、操作简单和提升行车安全。",
  productName: "玻璃油膜清洁擦",
  industry: "汽车用品",
  category: "汽车清洁养护 / 玻璃清洁",
  sellingPoints: ["强力去油膜", "擦拭无残留", "不伤玻璃", "自带海绵擦头"],
  painPoints: ["雨天玻璃油膜导致视线模糊", "夜间会车容易产生炫光", "普通清洁剂难以彻底去除油膜"],
  targetGroups: ["经常夜间驾驶的车主", "雨季用车频繁的人群", "注重日常养车的用户"],
  scenarios: ["雨天出行前清洁挡风玻璃", "夜间驾驶前快速去膜", "日常洗车后的玻璃养护"],
  specs: ["自带海绵擦头", "适用于汽车前挡风玻璃", "便携瓶身设计"],
  discountInfo: "暂无优惠信息",
  creatives: [],
  previews: [],
  finals: [],
  timeline: [],
  versionCounts: { analysis: 1, script: 0 },
  activeVersions: { analysis: 1, script: 0 }
});

const withProductAnalysis = (session: AgentSession, product: ProductSelection): AgentSession => {
  const name = product.name.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  if (/吹风机/.test(name)) {
    return {
      ...session,
      product,
      productName: name,
      industry: "3C及电器 / 个护健康电器",
      category: "美发电器 / 高速吹风机",
      demand: "围绕快速干发、低噪护发和轻巧易握的使用体验，突出高速风力与负离子护发效果，通过日常洗发后的真实场景建立购买理由。",
      sellingPoints: ["高速气流快速干发", "蓝光负离子恒温护发", "低噪运行不打扰他人", "机身轻巧长时间握持不费力", "多档风力与温度可调"],
      painPoints: ["传统吹风机噪音大，容易吵醒身边人", "普通吹风机风力不足，长发吹干耗时长", "高温直吹容易让头发干枯毛躁", "机身过重，长时间举着吹手臂酸痛", "高端吹风机价格偏高，平价款品质难保障"],
      targetGroups: ["注重护发的长发女性", "日常洗头频繁的学生党", "追求高性价比的租房人群", "在意吹发噪音的家庭用户", "美发从业者"],
      scenarios: ["日常居家快速吹干头发", "宿舍日常吹发使用", "差旅行便携使用", "美发店造型吹发使用", "睡前洗头后快速吹干"],
      specs: ["多档风力与温度可调", "蓝光负离子护发功能", "2400W 大功率", "轻量便携机身"],
      discountInfo: "暂无优惠信息"
    };
  }
  if (/防晒|精华|护肤|面膜/.test(name)) {
    return {
      ...session,
      product,
      productName: name,
      industry: "美妆护肤",
      category: "面部护理 / 功效护肤",
      demand: `围绕${name}的成分、肤感和使用前后效果，结合通勤与户外场景展示核心功效。`,
      sellingPoints: ["清爽不黏腻", "温和亲肤", "日常易用", "效果可感知"],
      painPoints: ["厚重肤感影响后续上妆", "敏感肌担心成分刺激", "日常护理步骤繁琐"],
      targetGroups: ["关注成分的年轻消费者", "通勤上班族", "追求高效护肤的人群"],
      scenarios: ["早间通勤护肤", "户外活动前使用", "晚间日常护理"],
      specs: ["轻盈肤感", "便携包装", "适合日常使用"],
      discountInfo: "暂无优惠信息"
    };
  }
  return {
    ...session,
    product,
    productName: name,
    industry: "电商零售",
    category: "待补充具体品类",
    demand: `围绕${name}的核心使用场景与真实痛点，展示产品功能、使用过程和效果差异，形成清晰的购买理由。`,
    sellingPoints: ["核心功能突出", "使用简单", "效果直观", "适配日常场景"],
    painPoints: ["现有产品使用体验不佳", "难以直观看到使用效果", "同类商品选择成本高"],
    targetGroups: [`有${name}相关使用需求的消费者`, "关注实际效果的人群", "重视性价比的用户"],
    scenarios: ["日常家庭使用", "需要快速解决问题时使用", "购买同类商品前对比选择"],
    specs: ["核心功能配置", "便携易用设计", "适配常见使用环境"],
    discountInfo: "暂无优惠信息"
  };
};

const makeDemoSession = (task: Task): AgentSession => {
  const base = makeBaseSession(task.name, "step");
  const creatives = createCreatives(0);
  const previews = createPreviews();
  const finals = createFinals(previews);
  const completed = task.status === "completed";
  const session: AgentSession = {
    ...base,
    id: task.id,
    title: task.name,
    prompt: task.name,
    currentStep: completed ? "final" : "script",
    availableSteps: completed ? ["analysis", "script", "preview", "final"] : ["analysis", "script"],
    status: task.status === "failed" ? "failed" : task.status === "cancelled" ? "cancelled" : "completed",
    progress: task.progress,
    creditsCost: task.creditsCost,
    updatedAt: task.createdAt,
    creatives,
    previews: completed ? previews : [],
    finals: completed ? finals : [],
    versionCounts: { analysis: 1, script: 1 },
    activeVersions: { analysis: 1, script: 1 }
  };
  const timeline = [
    recordFor(session, "analysis", "需求分析", 1),
    recordFor(session, "script", "创意与分镜", 1)
  ];
  if (completed) timeline.push(recordFor(session, "preview", "视频预览"), recordFor(session, "final", "视频成片"));
  return { ...session, timeline };
};

const loadStoredSession = (id: string) => {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, AgentSession>;
    const stored = sessions[id];
    if (!stored) return null;
    return {
      ...stored,
      productName: stored.productName || productDisplayName(stored.product),
      industry: stored.industry || "待补充商品行业",
      category: stored.category || "待补充商品品类",
      sellingPoints: stored.sellingPoints || [],
      painPoints: stored.painPoints || [],
      targetGroups: stored.targetGroups || [],
      scenarios: stored.scenarios || [],
      specs: stored.specs || [],
      discountInfo: stored.discountInfo || "暂无优惠信息"
    };
  } catch {
    return null;
  }
};

export default function AgentCreationView({
  credits,
  activeTask,
  onSyncTask,
  onCancelTask,
  onOpenQueue,
  onSessionChange,
  onUploadVideos,
  onBack
}: AgentCreationViewProps) {
  const [session, setSession] = useState<AgentSession | null>(() =>
    activeTask ? loadStoredSession(activeTask.id) || makeDemoSession(activeTask) : null
  );
  const [idea, setIdea] = useState("");
  const [homeMenu, setHomeMenu] = useState<"product" | "reference" | "source" | null>(null);
  const [homeModal, setHomeModal] = useState<"product_link" | "product_image" | "reference" | "script" | "sources" | "settings" | "style" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductSelection | null>(null);
  const [selectedReference, setSelectedReference] = useState<ReferenceVideoSelection | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptSelection | null>(null);
  const [selectedSources, setSelectedSources] = useState<SourceVideoSelection[]>([]);
  const [videoDuration, setVideoDuration] = useState(45);
  const [videoRatio, setVideoRatio] = useState<"9:16" | "16:9">("9:16");
  const [removeWatermark, setRemoveWatermark] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [referenceHistory, setReferenceHistory] = useState<ReferenceVideoSelection[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(REFERENCE_STORAGE_KEY) || "[]") as ReferenceVideoSelection[];
      return [...stored, ...REFERENCE_VIDEOS.filter((item) => !stored.some((saved) => saved.id === item.id))];
    } catch {
      return REFERENCE_VIDEOS;
    }
  });
  const [selectedCreativeId, setSelectedCreativeId] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [generatingLabel, setGeneratingLabel] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadItems, setUploadItems] = useState<FinalVideoItem[]>([]);
  const [detailVideo, setDetailVideo] = useState<FinalVideoItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRef = useRef<AgentSession | null>(session);

  useEffect(() => {
    try {
      localStorage.setItem(REFERENCE_STORAGE_KEY, JSON.stringify(referenceHistory));
    } catch {
      // Browser storage is optional for the prototype.
    }
  }, [referenceHistory]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    if (!activeTask) return;
    setSession((current) => current?.id === activeTask.id
      ? current
      : loadStoredSession(activeTask.id) || makeDemoSession(activeTask));
  }, [activeTask?.id]);

  useEffect(() => {
    if (!session) return;
    sessionRef.current = session;
    try {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, AgentSession>;
      sessions[session.id] = session;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Browser storage is optional for the prototype.
    }
  }, [session]);

  useEffect(() => {
    if (!session || !activeTask || activeTask.id !== session.id) return;
    if (activeTask.status === "cancelled" && session.status === "generating") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGeneratingLabel("");
      setSession((current) => current ? { ...current, status: "cancelled", progress: activeTask.progress } : current);
    }
  }, [activeTask?.status, activeTask?.id]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const toTask = (value: AgentSession): Task => ({
    id: value.id,
    name: value.title,
    type: "video_gen",
    status: value.status,
    progress: value.progress,
    inputFiles: [value.product?.image || SAMPLE_COVERS[0]],
    outputFiles: value.finals.map((item) => item.cover),
    createdAt: value.updatedAt,
    creditsCost: value.creditsCost,
    source: "agent",
    category: "agent",
    autoProgress: false,
    agentStage: value.currentStep
  });

  const sync = (value: AgentSession, charge = 0) => onSyncTask(toTask(value), charge);

  const finishStart = (base: AgentSession, oneClick: boolean) => {
    timerRef.current = setTimeout(() => {
      const current = sessionRef.current;
      if (!current || current.id !== base.id || current.status === "cancelled") return;
      let next: AgentSession = { ...current, status: "completed", progress: 100, updatedAt: nowText() };
      const analysis = recordFor(next, "analysis", "需求分析", 1);
      if (oneClick) {
        const previews = createPreviews();
        next = { ...next, currentStep: "final", availableSteps: ["analysis", "final"], previews, finals: createFinals(previews) };
        next = { ...next, timeline: [analysis, recordFor(next, "final", "视频成片")] };
      } else {
        next = { ...next, timeline: [analysis] };
      }
      sessionRef.current = next;
      setSession(next);
      setGeneratingLabel("");
      sync(next);
    }, 1200);
  };

  const startCreation = () => {
    const prompt = idea.trim() || (selectedProduct ? `用${selectedProduct.name}拍一条营销视频` : selectedReference ? "参考样片写一份分镜脚本" : "开始 Agent 创作");
    const initial = makeBaseSession(prompt, "step");
    const base = selectedProduct ? withProductAnalysis(initial, selectedProduct) : initial;
    onSessionChange(base.id);

    if (!selectedProduct) {
      const waiting: AgentSession = {
        ...base,
        status: "queue",
        progress: 0,
        availableSteps: [],
        awaitingProduct: true,
        conversation: [
          { role: "user", content: prompt },
          { role: "agent", content: selectedReference ? "我还不清楚您要制作分镜脚本的商品信息，请补充商品名称、相关介绍或商品 ID。" : "为了帮您制作合适的电商营销视频，请补充具体商品信息，例如商品名称、所属品类、品牌或款式。" }
        ]
      };
      sessionRef.current = waiting;
      setSession(waiting);
      sync(waiting);
      return;
    }

    sessionRef.current = base;
    setSession(base);
    setGeneratingLabel("正在分析需求");
    sync(base);
    finishStart(base, false);
  };

  const confirmProductInConversation = () => {
    if (!session?.awaitingProduct || (!chatInput.trim() && !selectedProduct)) return;
    const product = selectedProduct || {
      id: `conversation_${Date.now()}`,
      name: chatInput.trim(),
      image: SAMPLE_COVERS[0],
      source: "conversation" as const
    };
    const userMessage = chatInput.trim() || `我的商品是${product.name}`;
    const working: AgentSession = {
      ...withProductAnalysis(session, product),
      title: product.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").slice(0, 24),
      prompt: `${session.prompt} ${userMessage}`.trim(),
      product,
      awaitingProduct: false,
      conversation: [...(session.conversation || []), { role: "user", content: userMessage }, { role: "agent", content: "商品信息已确认，正在为您进行需求分析。" }],
      status: "generating",
      progress: 18,
      availableSteps: ["analysis"],
      updatedAt: nowText()
    };
    setChatInput("");
    sessionRef.current = working;
    setSession(working);
    setGeneratingLabel("正在分析需求");
    sync(working);
    finishStart(working, false);
  };

  const runGeneration = (
    label: string,
    targetStep: StepType,
    charge: number,
    build: (current: AgentSession) => AgentSession
  ) => {
    if (!session || session.status === "generating") return;
    if (credits < charge) {
      showToast("积分不足");
      return;
    }
    const working = {
      ...session,
      status: "generating" as const,
      progress: 38,
      creditsCost: session.creditsCost + charge,
      updatedAt: nowText()
    };
    setSession(working);
    sessionRef.current = working;
    setGeneratingLabel(label);
    sync(working, charge);
    timerRef.current = setTimeout(() => {
      const current = sessionRef.current;
      if (!current || current.id !== working.id || current.status === "cancelled") return;
      const built = build(current);
      const completed = { ...built, currentStep: targetStep, status: "completed" as const, progress: 100, updatedAt: nowText() };
      sessionRef.current = completed;
      setSession(completed);
      setGeneratingLabel("");
      sync(completed);
    }, 1200);
  };

  const generateScripts = () => runGeneration("正在生成创意与分镜", "script", 0, (current) => {
    const version = current.versionCounts.script + 1;
    const next: AgentSession = {
      ...current,
      availableSteps: Array.from(new Set([...current.availableSteps, "script"])) as StepType[],
      creatives: [...current.creatives, ...createCreatives(current.creatives.length)],
      versionCounts: { ...current.versionCounts, script: version },
      activeVersions: { ...current.activeVersions, script: version }
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "script", "创意与分镜", version)] };
  });

  const generatePreviews = () => runGeneration("正在生成视频预览", "preview", 0, (current) => {
    const next = {
      ...current,
      availableSteps: Array.from(new Set([...current.availableSteps, "preview"])) as StepType[],
      previews: createPreviews(),
      finals: []
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "preview", "视频预览")] };
  });

  const generateFinals = () => runGeneration("正在生成视频成片", "final", 5, (current) => {
    const next = {
      ...current,
      availableSteps: Array.from(new Set([...current.availableSteps, "final"])) as StepType[],
      finals: createFinals(current.previews)
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "final", "视频成片")] };
  });

  const stopGeneration = () => {
    if (!session || session.status !== "generating") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const cancelled = { ...session, status: "cancelled" as const, progress: Math.max(session.progress, 38), updatedAt: nowText() };
    sessionRef.current = cancelled;
    setSession(cancelled);
    setGeneratingLabel("");
    onCancelTask(session.id);
  };

  const retryGeneration = () => {
    if (!session) return;
    if (session.currentStep === "analysis") generateScripts();
    else if (session.currentStep === "script") generatePreviews();
    else generateFinals();
  };

  const restoreResult = (record: ResultRecord) => {
    if (!session || session.status === "generating") return;
    setSession({
      ...session,
      currentStep: record.step,
      demand: record.snapshot.demand,
      product: record.snapshot.product ? { ...record.snapshot.product } : session.product,
      productName: record.snapshot.productName || session.productName,
      industry: record.snapshot.industry || session.industry,
      category: record.snapshot.category || session.category,
      sellingPoints: [...(record.snapshot.sellingPoints || session.sellingPoints)],
      painPoints: [...(record.snapshot.painPoints || session.painPoints)],
      targetGroups: [...(record.snapshot.targetGroups || session.targetGroups)],
      scenarios: [...(record.snapshot.scenarios || session.scenarios)],
      specs: [...(record.snapshot.specs || session.specs)],
      discountInfo: record.snapshot.discountInfo || session.discountInfo,
      creatives: cloneItems(record.snapshot.creatives),
      previews: cloneItems(record.snapshot.previews),
      finals: cloneItems(record.snapshot.finals),
      activeVersions: record.step === "analysis" && record.version
        ? { ...session.activeVersions, analysis: record.version }
        : record.step === "script" && record.version
          ? { ...session.activeVersions, script: record.version }
          : session.activeVersions
    });
  };

  const submitChat = () => {
    if (!session || !chatInput.trim() || session.status === "generating") return;
    const request = chatInput.trim();
    setChatInput("");
    runGeneration("正在按要求调整", session.currentStep, 0, (current) => {
      let next = { ...current };
      let version: number | undefined;
      if (current.currentStep === "analysis") {
        version = current.versionCounts.analysis + 1;
        next = {
          ...next,
          demand: `${current.demand} 调整要求：${request}`,
          versionCounts: { ...current.versionCounts, analysis: version },
          activeVersions: { ...current.activeVersions, analysis: version }
        };
      } else if (current.currentStep === "script") {
        version = current.versionCounts.script + 1;
        next = {
          ...next,
          creatives: current.creatives.map((item, index) => index === 0 ? { ...item, script: `${item.script} ${request}` } : item),
          versionCounts: { ...current.versionCounts, script: version },
          activeVersions: { ...current.activeVersions, script: version }
        };
      } else if (current.currentStep === "preview") {
        next = { ...next, previews: current.previews.map((item) => ({ ...item, name: item.name.includes("调整") ? item.name : `${item.name}·调整` })) };
      } else {
        next = { ...next, finals: current.finals.map((item) => ({ ...item, name: item.name.replace(".mp4", "_调整版.mp4") })) };
      }
      return { ...next, timeline: [...next.timeline, recordFor(next, current.currentStep, `按要求调整：${request.slice(0, 12)}`, version)] };
    });
  };

  const openUpload = (items: FinalVideoItem[]) => {
    if (items.length === 0) {
      showToast("请先选择视频");
      return;
    }
    setUploadItems(items);
    setUploadOpen(true);
    setDetailVideo(null);
  };

  const startNewSession = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSession(null);
    sessionRef.current = null;
    setGeneratingLabel("");
    setUploadOpen(false);
    setIdea("");
    setSelectedProduct(null);
    setSelectedReference(null);
    setSelectedScript(null);
    setSelectedSources([]);
    setSelectedStyle("");
    setHomeMenu(null);
    onSessionChange(null);
  };

  const selectedFinals = useMemo(() => session?.finals.filter((item) => item.selected) || [], [session?.finals]);
  const canStart = Boolean(idea.trim() || selectedProduct || selectedReference || selectedScript || selectedSources.length);

  if (uploadOpen) {
    return (
      <div className="relative flex h-full min-h-0 flex-1 flex-col">
        {toast && <Toast message={toast} />}
        <UploadFinishedVideoModal
          key={uploadItems.map((item) => item.id).join("_")}
          isOpen
          isPage
          initialFiles={uploadItems.map((item) => ({ name: item.name, type: "video/mp4" }))}
          stayOpenOnPublish
          onClose={() => setUploadOpen(false)}
          onPublishSuccess={(message) => {
            onUploadVideos(uploadItems.map((item) => ({ name: item.name, cover: item.cover })));
            showToast(message);
          }}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col bg-slate-50 text-slate-800">
        {toast && <Toast message={toast} />}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />返回</button>
          <button onClick={onOpenQueue} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><History className="h-4 w-4" />历史任务</button>
        </header>
        <main className="flex flex-1 justify-center overflow-y-auto px-5 py-12">
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600 text-white"><Sparkles className="h-5 w-5" /></div>
              <h1 className="text-2xl font-bold text-slate-900">想做什么视频？</h1>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors focus-within:border-violet-400">
              {(selectedProduct || selectedReference || selectedScript || selectedSources.length > 0 || selectedStyle) && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedProduct && <SelectionChip icon={Package} label={selectedProduct.name} image={selectedProduct.image} onRemove={() => setSelectedProduct(null)} />}
                  {selectedReference && <SelectionChip icon={Video} label={selectedReference.name} image={selectedReference.cover} onRemove={() => setSelectedReference(null)} />}
                  {selectedScript && <SelectionChip icon={FileText} label={selectedScript.name} onRemove={() => setSelectedScript(null)} />}
                  {selectedSources.length > 0 && <SelectionChip icon={Film} label={`视频原料 ${selectedSources.length} 个`} onRemove={() => setSelectedSources([])} />}
                  {selectedStyle && <SelectionChip icon={Palette} label={selectedStyle} onRemove={() => setSelectedStyle("")} />}
                </div>
              )}
              <textarea value={idea} onChange={(event) => setIdea(event.target.value)} rows={5} placeholder="发送给 Agent" className="w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400" />
              <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  <HomeMenuButton icon={Package} label="商品" active={homeMenu === "product" || !!selectedProduct} onClick={() => setHomeMenu(homeMenu === "product" ? null : "product")}>
                    {homeMenu === "product" && <MenuPopup>
                      <MenuAction icon={Link2} label="输入商品信息" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_link"); }} />
                      <MenuAction icon={ImageIcon} label="添加商品图" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_image"); }} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={Video} label="参考" active={homeMenu === "reference" || !!selectedReference} onClick={() => setHomeMenu(homeMenu === "reference" ? null : "reference")}>
                    {homeMenu === "reference" && <MenuPopup>
                      <MenuAction icon={History} label="历史投放素材" disabled={!!selectedReference} onClick={() => { setHomeMenu(null); setHomeModal("reference"); }} />
                      <LocalReferenceAction disabled={!!selectedReference} onUploaded={(item) => { setReferenceHistory((items) => [item, ...items]); setSelectedReference(item); setHomeMenu(null); }} showToast={showToast} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={FileText} label="脚本/原料" active={homeMenu === "source" || !!selectedScript || selectedSources.length > 0} onClick={() => setHomeMenu(homeMenu === "source" ? null : "source")}>
                    {homeMenu === "source" && <MenuPopup>
                      <MenuAction icon={FileText} label="从脚本管理选择" disabled={!!selectedScript} onClick={() => { setHomeMenu(null); setHomeModal("script"); }} />
                      <MenuAction icon={Film} label="从资源库选择原料" onClick={() => { setHomeMenu(null); setHomeModal("sources"); }} />
                      <LocalSourceAction onUploaded={(items) => { setSelectedSources((current) => [...current, ...items].slice(0, 100)); setHomeMenu(null); }} showToast={showToast} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={Settings} label={`${videoDuration}秒 · ${videoRatio}`} active={homeModal === "settings"} onClick={() => { setHomeMenu(null); setHomeModal("settings"); }} />
                  <HomeMenuButton icon={Palette} label={selectedStyle || "风格"} active={homeModal === "style" || !!selectedStyle} onClick={() => { setHomeMenu(null); setHomeModal("style"); }} />
                </div>
                <button onClick={startCreation} disabled={!canStart} title="发送" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400"><ArrowUp className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => setIdea("用我的「商品」拍一条营销视频")} className="rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-600 hover:border-violet-300 hover:text-violet-700">用商品拍一条营销视频</button>
              <button onClick={() => setIdea("参考「参考视频」的拍法，给「商品」写一份分镜脚本")} className="rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-600 hover:border-violet-300 hover:text-violet-700">参考样片写分镜脚本</button>
            </div>
          </div>
        </main>

        {homeModal === "product_link" && <ProductLinkModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); setHomeModal(null); }} />}
        {homeModal === "product_image" && <ProductImageModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); setHomeModal(null); }} />}
        {homeModal === "reference" && <ReferenceVideoModal items={referenceHistory} selected={selectedReference} onDelete={(id) => { setReferenceHistory((items) => items.filter((item) => item.id !== id)); if (selectedReference?.id === id) setSelectedReference(null); }} onClose={() => setHomeModal(null)} onConfirm={(item) => { setSelectedReference(item); setHomeModal(null); }} />}
        {homeModal === "script" && <ScriptSelectorModal selected={selectedScript} onClose={() => setHomeModal(null)} onConfirm={(item) => { setSelectedScript(item); setHomeModal(null); }} />}
        {homeModal === "sources" && <SourceSelectorModal selected={selectedSources} onClose={() => setHomeModal(null)} onConfirm={(items) => { setSelectedSources(items); setHomeModal(null); }} showToast={showToast} />}
        {homeModal === "settings" && <SettingsModal duration={videoDuration} ratio={videoRatio} removeWatermark={removeWatermark} onClose={() => setHomeModal(null)} onConfirm={(settings) => { setVideoDuration(settings.duration); setVideoRatio(settings.ratio); setRemoveWatermark(settings.removeWatermark); setHomeModal(null); }} />}
        {homeModal === "style" && <StyleModal value={selectedStyle} onClose={() => setHomeModal(null)} onConfirm={(value) => { setSelectedStyle(value); setHomeModal(null); }} />}
      </div>
    );
  }

  if (session.awaitingProduct) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col bg-slate-50 text-slate-800">
        {toast && <Toast message={toast} />}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />返回</button>
          <button onClick={onOpenQueue} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><History className="h-4 w-4" />历史任务</button>
        </header>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden px-5 py-6">
          <div className="flex-1 space-y-5 overflow-y-auto pb-5">
            {(session.conversation || []).map((message, index) => message.role === "user"
              ? <div key={index} className="flex justify-end"><p className="max-w-xl rounded-lg bg-violet-600 px-4 py-3 text-sm leading-6 text-white">{message.content}</p></div>
              : <p key={index} className="max-w-2xl text-sm leading-7 text-slate-600">{message.content}</p>)}
          </div>
          <div className="rounded-lg border border-violet-300 bg-white p-3 shadow-sm">
            {selectedProduct && <div className="mb-2"><SelectionChip icon={Package} label={selectedProduct.name} image={selectedProduct.image} onRemove={() => setSelectedProduct(null)} /></div>}
            <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} rows={3} placeholder="补充商品信息" className="w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-slate-400" />
            <div className="mt-2 flex items-center justify-between">
              <div className="relative">
                <HomeMenuButton icon={Package} label="商品" active={homeMenu === "product" || !!selectedProduct} onClick={() => setHomeMenu(homeMenu === "product" ? null : "product")}>
                  {homeMenu === "product" && <MenuPopup>
                    <MenuAction icon={Link2} label="输入商品信息" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_link"); }} />
                    <MenuAction icon={ImageIcon} label="添加商品图" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_image"); }} />
                  </MenuPopup>}
                </HomeMenuButton>
              </div>
              <button onClick={confirmProductInConversation} disabled={!chatInput.trim() && !selectedProduct} title="发送" className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white disabled:bg-slate-200 disabled:text-slate-400"><ArrowUp className="h-4 w-4" /></button>
            </div>
          </div>
        </main>
        {homeModal === "product_link" && <ProductLinkModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); setHomeModal(null); }} />}
        {homeModal === "product_image" && <ProductImageModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); setHomeModal(null); }} />}
      </div>
    );
  }

  const currentCreative = session.creatives.find((item) => item.id === selectedCreativeId) || session.creatives[0];

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col bg-slate-50 text-slate-800">
      {toast && <Toast message={toast} />}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} title="返回" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0"><h1 className="truncate text-sm font-bold text-slate-900">{session.title}</h1><p className="mt-0.5 text-[11px] text-slate-400">{session.mode === "one_click" ? "一键成片" : "分步创作"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={startNewSession} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Plus className="mr-1 inline h-3.5 w-3.5" />新建创作</button>
          <button onClick={onOpenQueue} title="历史任务" className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><History className="h-4 w-4" /></button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <nav className="flex h-12 shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-5" aria-label="创作阶段">
          {STEP_META.filter((item) => session.availableSteps.includes(item.id)).map((item, index, items) => {
            const Icon = item.icon;
            const active = session.currentStep === item.id;
            return <React.Fragment key={item.id}><button onClick={() => session.status !== "generating" && setSession({ ...session, currentStep: item.id })} className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold transition-colors ${active ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}><Icon className="h-3.5 w-3.5" />{item.label}</button>{index < items.length - 1 && <span className="mx-1 h-px w-5 bg-slate-200" />}</React.Fragment>;
          })}
        </nav>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px] overflow-hidden">
        <main className="relative min-w-0 overflow-y-auto bg-slate-50 px-5 pb-0 pt-5">
          {session.status === "generating" ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /><p className="mt-4 text-sm font-semibold text-slate-700">{generatingLabel}</p><button onClick={stopGeneration} className="mt-5 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Square className="h-3.5 w-3.5" />停止生成</button></div>
          ) : session.status === "failed" ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><X className="h-5 w-5" /></div><p className="mt-4 text-sm font-semibold">当前阶段生成失败</p><button onClick={retryGeneration} className="mt-5 flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white"><RefreshCw className="h-3.5 w-3.5" />重新生成</button></div>
          ) : (
            <>
              {session.currentStep === "analysis" && <AnalysisPanel session={session} setSession={setSession} />}
              {session.currentStep === "script" && <ScriptPanel session={session} setSession={setSession} currentCreative={currentCreative} selectedCreativeId={selectedCreativeId} setSelectedCreativeId={setSelectedCreativeId} />}
              {session.currentStep === "preview" && <PreviewPanel session={session} setSession={setSession} />}
              {session.currentStep === "final" && <FinalPanel session={session} setSession={setSession} selectedFinals={selectedFinals} openUpload={openUpload} setDetailVideo={setDetailVideo} showToast={showToast} />}
            </>
          )}

          {session.status !== "generating" && session.status !== "failed" && (
            <div className="sticky bottom-0 z-20 -mx-5 mt-6 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-sm">
              {session.currentStep === "analysis" && <>
                <button onClick={() => runGeneration("正在生成视频成片", "final", 5, (current) => { const previews = createPreviews(); const next = { ...current, availableSteps: Array.from(new Set([...current.availableSteps, "final"])) as StepType[], previews, finals: createFinals(previews) }; return { ...next, timeline: [...next.timeline, recordFor(next, "final", "视频成片")] }; })} className="rounded-md border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">一键成片</button>
                <button onClick={generateScripts} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700">生成创意与分镜</button>
              </>}
              {session.currentStep === "script" && <button onClick={generatePreviews} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700">生成视频预览</button>}
              {session.currentStep === "preview" && <button onClick={generateFinals} disabled={session.previews.every((item) => !item.selected)} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40">生成视频成片</button>}
              {session.currentStep === "final" && <button onClick={() => openUpload(selectedFinals)} className="flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700"><Upload className="h-4 w-4" />上传资源库</button>}
            </div>
          )}
        </main>

        <aside className="flex min-h-0 flex-col border-l border-slate-200 bg-white">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4"><MessageSquare className="h-4 w-4 text-violet-600" /><h2 className="text-xs font-bold text-slate-800">创作记录</h2></div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {session.timeline.map((record) => {
                const meta = STEP_META.find((item) => item.id === record.step)!;
                const Icon = meta.icon;
                const active = session.currentStep === record.step && session.timeline[session.timeline.length - 1]?.id === record.id;
                return <button key={record.id} onClick={() => restoreResult(record)} className={`w-full rounded-md border p-3 text-left transition-colors ${active ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="flex items-start gap-2"><span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">{record.title}</p><p className="mt-1 text-[10px] text-slate-400">{meta.label}{record.version ? ` · 第${record.version}版` : ""} · {record.time}</p></div></div></button>;
              })}
            </div>
          </div>
          <div className="shrink-0 border-t border-slate-200 p-3">
            <div className="flex items-end gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 focus-within:border-violet-400">
              <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitChat(); } }} rows={2} placeholder="告诉 Agent 如何调整" className="min-w-0 flex-1 resize-none bg-transparent text-xs leading-5 outline-none placeholder:text-slate-400" />
              <button onClick={submitChat} disabled={!chatInput.trim() || session.status === "generating"} title="发送" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
            </div>
          </div>
        </aside>
        </div>
      </div>

      {detailVideo && <VideoDetail video={detailVideo} onClose={() => setDetailVideo(null)} onUpload={() => openUpload([detailVideo])} showToast={showToast} />}
    </div>
  );
}

function PanelHeader({ title, count, active, onChange }: { title: string; count?: number; active?: number; onChange?: (value: number) => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {count && count > 0 ? <label className="relative"><select value={active} onChange={(event) => onChange?.(Number(event.target.value))} className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none">{Array.from({ length: count }, (_, index) => <option key={index + 1} value={index + 1}>第{index + 1}版</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" /></label> : null}
    </div>
  );
}

function AnalysisPanel({ session, setSession }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>> }) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const image = session.product?.image || SAMPLE_COVERS[0];
  const updateList = (field: "sellingPoints" | "painPoints" | "targetGroups" | "scenarios" | "specs", items: string[]) => setSession({ ...session, [field]: items });
  return (
    <div className="mx-auto max-w-5xl">
      <PanelHeader title="需求分析" count={session.versionCounts.analysis} active={session.activeVersions.analysis} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, analysis: value } })} />
      <div className="space-y-7">
        <section>
          <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-900">商品参考图</h3><p className="mt-1 text-xs text-slate-400">{session.productName}</p></div></div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="group relative h-36 w-36 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
              <img src={image} alt={session.productName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-slate-900/55 group-hover:flex">
                <button onClick={() => setImagePreviewOpen(true)} className="flex h-8 items-center gap-1 rounded-md bg-white px-2.5 text-[11px] font-semibold text-slate-700"><Eye className="h-3.5 w-3.5" />查看大图</button>
                <button onClick={() => setImagePickerOpen(true)} className="flex h-8 items-center gap-1 rounded-md bg-violet-600 px-2.5 text-[11px] font-semibold text-white"><ImageIcon className="h-3.5 w-3.5" />替换</button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold text-slate-900">商品详细信息</h3>
          <div className="grid grid-cols-2 gap-3">
            <AnalysisTextField label="商品名称" value={session.productName} onChange={(productName) => setSession({ ...session, productName })} />
            <AnalysisTextField label="商品行业" value={session.industry} onChange={(industry) => setSession({ ...session, industry })} />
            <AnalysisTextField label="商品品类" value={session.category} onChange={(category) => setSession({ ...session, category })} />
            <AnalysisTextField label="优惠信息" value={session.discountInfo} onChange={(discountInfo) => setSession({ ...session, discountInfo })} />
          </div>
        </section>

        <section className="grid grid-cols-2 items-start gap-3">
          <AnalysisListField label="商品卖点" items={session.sellingPoints} onChange={(items) => updateList("sellingPoints", items)} />
          <AnalysisListField label="商品痛点" items={session.painPoints} onChange={(items) => updateList("painPoints", items)} />
          <AnalysisListField label="目标人群" items={session.targetGroups} onChange={(items) => updateList("targetGroups", items)} />
          <AnalysisListField label="适用人群和场景" items={session.scenarios} onChange={(items) => updateList("scenarios", items)} />
          <AnalysisListField label="商品规格" items={session.specs} onChange={(items) => updateList("specs", items)} />
        </section>
      </div>

      {imagePickerOpen && <AnalysisImagePicker current={session.product || null} onClose={() => setImagePickerOpen(false)} onConfirm={(product) => { setSession({ ...session, product }); setImagePickerOpen(false); }} />}
      {imagePreviewOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/65 p-5" onMouseDown={(event) => event.target === event.currentTarget && setImagePreviewOpen(false)}>
          <div className="relative max-h-[88vh] max-w-4xl overflow-hidden rounded-lg bg-white p-2 shadow-2xl"><img src={image} alt={session.productName} className="max-h-[82vh] max-w-full object-contain" referrerPolicy="no-referrer" /><button onClick={() => setImagePreviewOpen(false)} title="关闭" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-slate-900/70 text-white"><X className="h-4 w-4" /></button></div>
        </div>
      )}
    </div>
  );
}

function AnalysisTextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="rounded-lg border border-slate-200 bg-white p-4"><span className="block text-xs font-semibold text-slate-500">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-8 w-full border-0 bg-transparent p-0 text-sm text-slate-800 outline-none" /></label>;
}

function AnalysisListField({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const addItem = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-xs font-bold text-slate-800">{label}</h4>
      <div className="mt-3 space-y-1.5">
        {items.map((item, index) => <div key={`${label}-${index}`} className="group flex min-h-8 items-center gap-2 rounded-md px-2 hover:bg-slate-50"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" /><input value={item} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="min-w-0 flex-1 border-0 bg-transparent py-1 text-xs leading-5 text-slate-700 outline-none" /><button onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} title="删除" className="hidden h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 group-hover:flex"><Trash2 className="h-3.5 w-3.5" /></button></div>)}
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addItem(); } }} placeholder={`添加${label}`} className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 text-xs outline-none focus:border-violet-400" /><button onClick={addItem} disabled={!draft.trim()} title="添加" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white disabled:bg-slate-200 disabled:text-slate-400"><Plus className="h-3.5 w-3.5" /></button></div>
    </section>
  );
}

function AnalysisImagePicker({ current, onClose, onConfirm }: { current: ProductSelection | null; onClose: () => void; onConfirm: (product: ProductSelection) => void }) {
  const [tab, setTab] = useState<"library" | "local">("library");
  const [selected, setSelected] = useState<ProductSelection | null>(current);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const localUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelected({ id: `analysis-local-${Date.now()}`, name: file.name, image: String(reader.result), source: "local" });
    reader.readAsDataURL(file);
  };
  return <ModalFrame title="替换参考图" onClose={onClose} width="max-w-3xl" footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!selected} onClick={() => selected && onConfirm(selected)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认替换</button></>}>
    <div className="p-5">
      <div className="mb-5 flex items-center gap-1 border-b border-slate-200"><button onClick={() => setTab("library")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "library" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>图片管理</button><button onClick={() => setTab("local")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "local" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>本地上传</button></div>
      {tab === "library" ? <div className="grid grid-cols-4 gap-3">{IMAGE_LIBRARY.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={`overflow-hidden rounded-md border bg-white text-left ${selected?.id === item.id ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300"}`}><div className="relative aspect-square"><img src={item.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />{selected?.id === item.id && <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white"><Check className="h-3 w-3" /></span>}</div><p className="truncate px-2 py-2 text-[11px] text-slate-600">{item.name}</p></button>)}</div> : <div><button onClick={() => uploadRef.current?.click()} className="flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-violet-400 hover:text-violet-700"><Upload className="h-6 w-6" /><span className="mt-3 text-xs font-semibold">点击选择本地图片</span></button><input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(event) => localUpload(event.target.files?.[0])} />{selected?.source === "local" && <div className="mt-4 flex items-center gap-3 rounded-md border border-violet-200 bg-violet-50 p-3"><img src={selected.image} alt="" className="h-14 w-14 rounded object-cover" /><p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{selected.name}</p><button onClick={() => setSelected(null)} title="删除"><Trash2 className="h-4 w-4 text-slate-400" /></button></div>}</div>}
    </div>
  </ModalFrame>;
}

function ScriptPanel({ session, setSession, currentCreative, selectedCreativeId, setSelectedCreativeId }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>>; currentCreative?: CreativeItem; selectedCreativeId: number; setSelectedCreativeId: (id: number) => void }) {
  return (
    <div className="mx-auto max-w-5xl">
      <PanelHeader title="创意与分镜" count={session.versionCounts.script} active={session.activeVersions.script} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, script: value } })} />
      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-4">
        <div className="space-y-2">{session.creatives.map((item) => <button key={item.id} onClick={() => setSelectedCreativeId(item.id)} className={`w-full rounded-lg border p-3 text-left ${selectedCreativeId === item.id ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-800">创意 {item.id}</span><span className="rounded bg-white px-1.5 py-1 text-[10px] text-slate-500">{item.angle}</span></div><p className="mt-2 truncate text-xs text-slate-600">{item.title}</p></button>)}</div>
        {currentCreative && <section className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-violet-600">创意 {currentCreative.id}</p><h3 className="mt-1 text-base font-bold text-slate-900">{currentCreative.title}</h3></div><button title="更多" className="rounded p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button></div><label className="mt-5 block text-xs font-semibold text-slate-500">分镜脚本</label><textarea value={currentCreative.script} onChange={(event) => setSession({ ...session, creatives: session.creatives.map((item) => item.id === currentCreative.id ? { ...item, script: event.target.value } : item) })} rows={7} className="mt-2 w-full resize-none rounded-md border border-slate-200 p-3 text-sm leading-7 outline-none focus:border-violet-400" /><div className="mt-4 grid grid-cols-3 gap-3">{["痛点开场", "产品实测", "行动引导"].map((shot, index) => <div key={shot} className="rounded-md bg-slate-50 p-3"><span className="text-[10px] text-slate-400">镜头 {index + 1}</span><p className="mt-1 text-xs font-semibold text-slate-700">{shot}</p></div>)}</div></section>}
      </div>
    </div>
  );
}

function PreviewPanel({ session, setSession }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>> }) {
  const copyPreview = (item: PreviewItem) => {
    const alternatives = session.previews.filter((preview) => preview.name.startsWith("备选")).length;
    setSession({ ...session, previews: [...session.previews, { ...item, id: `preview_copy_${Date.now()}`, name: `备选${alternatives + 1}`, selected: true }] });
  };
  return (
    <div className="mx-auto max-w-5xl">
      <PanelHeader title="视频预览" />
      <div className="grid grid-cols-2 gap-4">
        {session.previews.map((item) => <article key={item.id} className={`overflow-hidden rounded-lg border bg-white ${item.selected ? "border-violet-400" : "border-slate-200"}`}><div className="relative aspect-video bg-slate-900"><img src={item.cover} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /><div className="absolute inset-0 flex items-center justify-center bg-black/10"><button title="播放预览" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow"><Play className="ml-0.5 h-4 w-4 fill-current" /></button></div><button onClick={() => setSession({ ...session, previews: session.previews.map((preview) => preview.id === item.id ? { ...preview, selected: !preview.selected } : preview) })} title={item.selected ? "取消选择" : "选择"} className={`absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded border ${item.selected ? "border-violet-600 bg-violet-600 text-white" : "border-white bg-white/80 text-transparent"}`}><Check className="h-3.5 w-3.5" /></button></div><div className="flex items-center justify-between p-3"><div><p className="text-xs font-bold text-slate-800">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">30秒 · 9:16</p></div><button onClick={() => copyPreview(item)} title="复制为备选" className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><Copy className="h-3.5 w-3.5" /></button></div></article>)}
      </div>
    </div>
  );
}

function FinalPanel({ session, setSession, selectedFinals, openUpload, setDetailVideo, showToast }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>>; selectedFinals: FinalVideoItem[]; openUpload: (items: FinalVideoItem[]) => void; setDetailVideo: (item: FinalVideoItem) => void; showToast: (message: string) => void }) {
  const allSelected = session.finals.length > 0 && session.finals.every((item) => item.selected);
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">视频成片</h2><label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500"><button onClick={() => setSession({ ...session, finals: session.finals.map((item) => ({ ...item, selected: !allSelected })) })} className={`flex h-4 w-4 items-center justify-center rounded border ${allSelected ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white"}`}><Check className="h-3 w-3" /></button>全选</label></div>
      <div className="grid grid-cols-2 gap-4">
        {session.finals.map((item, index) => <article key={item.id} className={`overflow-hidden rounded-lg border bg-white ${item.selected ? "border-violet-400" : "border-slate-200"}`}><div className="relative aspect-video bg-slate-900"><img src={item.cover} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /><button onClick={() => setSession({ ...session, finals: session.finals.map((video) => video.id === item.id ? { ...video, selected: !video.selected } : video) })} title={item.selected ? "取消选择" : "选择"} className={`absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded border ${item.selected ? "border-violet-600 bg-violet-600 text-white" : "border-white bg-white/80 text-transparent"}`}><Check className="h-3.5 w-3.5" /></button><span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-1 text-[10px] text-white">{item.duration}</span>{index === 0 && <span className="absolute right-2 top-2 rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white">推荐</span>}</div><div className="p-3"><p className="truncate text-xs font-bold text-slate-800">{item.name}</p><div className="mt-3 flex gap-2"><button onClick={() => setDetailVideo(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" />详情</button><button onClick={() => openUpload([item])} title="上传资源库" className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Upload className="h-3.5 w-3.5" /></button><button onClick={() => showToast("已开始下载")} title="下载" className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Download className="h-3.5 w-3.5" /></button></div></div></article>)}
      </div>
      {selectedFinals.length > 0 && <p className="mt-3 text-right text-[11px] text-slate-400">已选择 {selectedFinals.length} 个视频</p>}
    </div>
  );
}

function VideoDetail({ video, onClose, onUpload, showToast }: { video: FinalVideoItem; onClose: () => void; onUpload: () => void; showToast: (message: string) => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/55 p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h3 className="text-sm font-bold text-slate-900">{video.name}</h3><p className="mt-1 text-xs text-slate-400">{video.duration} · 9:16</p></div><button onClick={onClose} title="关闭" className="rounded p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-[minmax(0,1fr)_220px]"><div className="relative aspect-video bg-black"><img src={video.cover} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" /><button className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-violet-700"><Play className="ml-0.5 h-5 w-5 fill-current" /></button></div><div className="p-5"><p className="text-xs font-semibold text-slate-500">视频信息</p><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between"><dt className="text-slate-400">尺寸</dt><dd className="text-slate-700">1080 × 1920</dd></div><div className="flex justify-between"><dt className="text-slate-400">格式</dt><dd className="text-slate-700">MP4</dd></div><div className="flex justify-between"><dt className="text-slate-400">来源</dt><dd className="text-slate-700">Agent 创作</dd></div></dl><div className="mt-6 space-y-2"><button onClick={onUpload} className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 py-2.5 text-xs font-semibold text-white hover:bg-violet-700"><Upload className="h-4 w-4" />上传资源库</button><button onClick={() => showToast("已开始下载")} className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Download className="h-4 w-4" />下载</button></div></div></div>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return <div className="fixed left-1/2 top-5 z-[150] flex -translate-x-1/2 items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{message}</div>;
}

function SelectionChip({ icon: Icon, label, image, onRemove }: { icon: React.ComponentType<{ className?: string }>; label: string; image?: string; onRemove: () => void }) {
  return (
    <span className="group inline-flex h-9 max-w-[260px] items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-2 text-xs font-semibold text-violet-700">
      {image ? <img src={image} alt="" className="h-6 w-6 rounded object-cover" referrerPolicy="no-referrer" /> : <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
      <button onClick={onRemove} title="移除" className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-violet-400 hover:bg-violet-100 hover:text-violet-700"><X className="h-3 w-3" /></button>
    </span>
  );
}

function HomeMenuButton({ icon: Icon, label, active, onClick, children }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; onClick: () => void; children?: React.ReactNode }) {
  return (
    <div className="relative">
      <button onClick={onClick} className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 font-semibold transition-colors ${active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-100"}`}><Icon className="h-3.5 w-3.5" /><span className="max-w-[120px] truncate">{label}</span></button>
      {children}
    </div>
  );
}

function MenuPopup({ children }: { children: React.ReactNode }) {
  return <div className="absolute bottom-full left-0 z-40 mb-2 w-52 rounded-md border border-slate-200 bg-white p-1.5 shadow-xl">{children}</div>;
}

function MenuAction({ icon: Icon, label, disabled, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; disabled?: boolean; onClick: () => void }) {
  return <button disabled={disabled} onClick={onClick} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"><Icon className="h-3.5 w-3.5" />{label}</button>;
}

function LocalReferenceAction({ disabled, onUploaded, showToast }: { disabled?: boolean; onUploaded: (item: ReferenceVideoSelection) => void; showToast: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const upload = (file?: File) => {
    if (!file) return;
    if (!/\.(mp4|mov)$/i.test(file.name)) return showToast("仅支持 MP4、MOV 格式");
    if (file.size > 500 * 1024 * 1024) return showToast("参考视频不能超过 500MB");
    onUploaded({ id: `ref-local-${Date.now()}`, name: file.name, cover: SAMPLE_COVERS[1], duration: "00:30", size: `${(file.size / 1024 / 1024).toFixed(1)} MB` });
  };
  return <><button disabled={disabled} onClick={() => inputRef.current?.click()} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"><Upload className="h-3.5 w-3.5" />本地上传</button><input ref={inputRef} type="file" accept=".mp4,.mov,video/mp4,video/quicktime" className="hidden" onChange={(event) => upload(event.target.files?.[0])} /></>;
}

function LocalSourceAction({ onUploaded, showToast }: { onUploaded: (items: SourceVideoSelection[]) => void; showToast: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const upload = (files?: FileList | null) => {
    if (!files?.length) return;
    const valid = Array.from(files).filter((file) => /\.(mp4|mov)$/i.test(file.name));
    if (valid.length !== files.length) showToast("原料仅支持视频格式");
    if (valid.length > 20) return showToast("所选视频合计时长不能超过 10 分钟");
    onUploaded(valid.map((file, index) => ({ id: `local-${Date.now()}-${index}`, name: file.name, cover: SAMPLE_COVERS[index % SAMPLE_COVERS.length], status: "本地文件", section: "本地上传", category: "本地上传", author: "当前用户", durationSeconds: 30, duration: "00:30", size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, tags: [] })));
  };
  return <><button onClick={() => inputRef.current?.click()} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"><Upload className="h-3.5 w-3.5" />本地上传原料</button><input ref={inputRef} type="file" multiple accept="video/*,.mp4,.mov" className="hidden" onChange={(event) => upload(event.target.files)} /></>;
}

function ModalFrame({ title, width = "max-w-3xl", children, footer, onClose }: { title: string; width?: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`flex max-h-[86vh] w-full ${width} flex-col overflow-hidden rounded-lg bg-white shadow-2xl`}>
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5"><h3 className="text-sm font-bold text-slate-900">{title}</h3><button onClick={onClose} title="关闭" className="rounded p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

function ProductLinkModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (product: ProductSelection) => void }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const product: ProductSelection = { id: "353829104771", name: "Bestore 负离子高速吹风机", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=600&auto=format&fit=crop&q=80", source: "douyin" };
  return <ModalFrame title="输入商品信息" onClose={onClose} footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!searched} onClick={() => onConfirm(product)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认</button></>}>
    <div className="p-5">
      <label className="mb-2 block text-xs font-semibold text-slate-700">抖音商品链接或商品 ID</label>
      <div className="flex gap-2"><input value={query} onChange={(event) => { setQuery(event.target.value); setSearched(false); }} placeholder="粘贴抖音商品链接或输入商品 ID" className="h-10 flex-1 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /><button disabled={!query.trim()} onClick={() => setSearched(true)} className="rounded-md bg-violet-600 px-5 text-xs font-semibold text-white disabled:opacity-40">搜索</button></div>
      {searched && <button onClick={() => undefined} className="mt-5 flex w-full items-center gap-3 rounded-md border border-violet-300 bg-violet-50 p-3 text-left"><img src={product.image} alt="" className="h-16 w-16 rounded object-cover" referrerPolicy="no-referrer" /><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{product.name}</p><p className="mt-1 text-xs text-slate-500">商品 ID：{product.id}</p></div><CheckCircle2 className="ml-auto h-5 w-5 text-violet-600" /></button>}
    </div>
  </ModalFrame>;
}

function ProductImageModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (product: ProductSelection) => void }) {
  const [selected, setSelected] = useState<ProductSelection | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const localUpload = (file?: File) => {
    if (!file) return;
    setSelected({ id: `product-local-${Date.now()}`, name: file.name, image: URL.createObjectURL(file), source: "local" });
  };
  return <ModalFrame title="添加商品图" onClose={onClose} footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!selected} onClick={() => selected && onConfirm(selected)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认选择</button></>}>
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500">从图片管理选择一张商品图</p><button onClick={() => uploadRef.current?.click()} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Upload className="h-3.5 w-3.5" />本地上传</button><input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(event) => localUpload(event.target.files?.[0])} /></div>
      <div className="grid grid-cols-4 gap-3">{IMAGE_LIBRARY.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={`overflow-hidden rounded-md border bg-white text-left ${selected?.id === item.id ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300"}`}><div className="relative aspect-square"><img src={item.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />{selected?.id === item.id && <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white"><Check className="h-3 w-3" /></span>}</div><p className="truncate px-2 py-2 text-[11px] text-slate-600">{item.name}</p></button>)}</div>
      {selected?.source === "local" && <div className="mt-4 flex items-center gap-3 rounded-md border border-violet-200 bg-violet-50 p-3"><img src={selected.image} alt="" className="h-12 w-12 rounded object-cover" /><p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{selected.name}</p><button onClick={() => setSelected(null)} title="删除"><Trash2 className="h-4 w-4 text-slate-400" /></button></div>}
    </div>
  </ModalFrame>;
}

function ReferenceVideoModal({ items, selected, onDelete, onClose, onConfirm }: { items: ReferenceVideoSelection[]; selected: ReferenceVideoSelection | null; onDelete: (id: string) => void; onClose: () => void; onConfirm: (item: ReferenceVideoSelection) => void }) {
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ReferenceVideoSelection | null>(selected);
  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  return <ModalFrame title="选择参考视频" onClose={onClose} footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!draft} onClick={() => draft && onConfirm(draft)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认选择</button></>}>
    <div className="p-5"><div className="relative mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索历史投放素材" className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400" /></div>
      <div className="grid grid-cols-3 gap-3">{filtered.map((item) => <button key={item.id} onClick={() => setDraft(item)} className={`group overflow-hidden rounded-md border bg-white text-left ${draft?.id === item.id ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300"}`}><div className="relative aspect-video"><img src={item.cover} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /><span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">{item.duration}</span><span onClick={(event) => { event.stopPropagation(); onDelete(item.id); if (draft?.id === item.id) setDraft(null); }} title="删除历史素材" className="absolute right-2 top-2 hidden h-7 w-7 items-center justify-center rounded bg-black/65 text-white group-hover:flex"><Trash2 className="h-3.5 w-3.5" /></span>{draft?.id === item.id && <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white"><Check className="h-3 w-3" /></span>}</div><div className="p-2.5"><p className="truncate text-xs font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.size}</p></div></button>)}</div>
    </div>
  </ModalFrame>;
}

function ScriptSelectorModal({ selected, onClose, onConfirm }: { selected: ScriptSelection | null; onClose: () => void; onConfirm: (item: ScriptSelection) => void }) {
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ScriptSelection | null>(selected);
  const filtered = SCRIPT_OPTIONS.filter((item) => `${item.name}${item.id}${item.category}`.toLowerCase().includes(search.toLowerCase()));
  return <ModalFrame title="从脚本管理选择" onClose={onClose} width="max-w-4xl" footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!draft} onClick={() => draft && onConfirm(draft)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认选择</button></>}>
    <div className="p-5"><div className="mb-4 grid grid-cols-[1fr_160px_160px] gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索脚本名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none" /></div><select className="rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部分类</option><option>个护家清</option><option>服饰内衣</option></select><select className="rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部状态</option><option>审核通过</option><option>待审核</option></select></div>
      <div className="overflow-hidden rounded-md border border-slate-200"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">脚本名称 / ID</th><th className="px-3 py-3">分类</th><th className="px-3 py-3">状态</th><th className="px-3 py-3">上传人</th><th className="px-3 py-3">更新时间</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => setDraft(item)} className={`cursor-pointer border-t border-slate-100 ${draft?.id === item.id ? "bg-violet-50" : "hover:bg-slate-50"}`}><td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded-full border ${draft?.id === item.id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>{draft?.id === item.id && <Check className="h-2.5 w-2.5" />}</span></td><td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td><td className="px-3 py-3 text-slate-500">{item.category}</td><td className="px-3 py-3"><span className="rounded bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">{item.status}</span></td><td className="px-3 py-3 text-slate-500">{item.author}</td><td className="px-3 py-3 text-slate-400">{item.updatedAt}</td></tr>)}</tbody></table></div>
    </div>
  </ModalFrame>;
}

function SourceSelectorModal({ selected, onClose, onConfirm, showToast }: { selected: SourceVideoSelection[]; onClose: () => void; onConfirm: (items: SourceVideoSelection[]) => void; showToast: (message: string) => void }) {
  const [draft, setDraft] = useState(selected);
  const [tab, setTab] = useState<"全部" | "成片" | "素材">("全部");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("全部状态");
  const [author, setAuthor] = useState("全部上传人");
  const [onlyMine, setOnlyMine] = useState(false);
  const totalSeconds = draft.reduce((sum, item) => sum + item.durationSeconds, 0);
  const filtered = SOURCE_VIDEOS.filter((item) => (tab === "全部" || item.section === tab) && (status === "全部状态" || item.status === status) && (author === "全部上传人" || item.author === author) && (!onlyMine || item.author === "徐振") && `${item.name}${item.id}${item.category}${item.tags.join("")}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = (item: SourceVideoSelection) => {
    if (draft.some((video) => video.id === item.id)) return setDraft(draft.filter((video) => video.id !== item.id));
    if (draft.length >= 100) return showToast("视频原料不能超过 100 个文件");
    if (totalSeconds + item.durationSeconds > 600) return showToast("视频原料合计时长不能超过 10 分钟");
    setDraft([...draft, item]);
  };
  return <ModalFrame title="选择视频原料" onClose={onClose} width="max-w-6xl" footer={<><div className="mr-auto text-xs text-slate-500">已选 <b className="text-violet-700">{draft.length}</b> / 100 个 · 总时长 <b className="text-violet-700">{Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, "0")}</b> / 10:00</div><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!draft.length} onClick={() => onConfirm(draft)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认选择</button></>}>
    <div className="p-5">
      <div className="mb-4 flex items-center gap-1 border-b border-slate-200">{(["全部", "成片", "素材"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === item ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>{item}</button>)}</div>
      <div className="mb-4 grid grid-cols-[130px_130px_130px_130px_1fr_auto] gap-2"><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部一级分类</option><option>服饰内衣</option><option>美妆护肤</option><option>日用百货</option></select><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部二级分类</option><option>商品实拍</option><option>面料展示</option><option>厨房用品</option></select><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部标签</option><option>产品实拍</option><option>对比实测</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部状态</option><option>审核通过</option><option>待审核</option><option>未审核</option><option>审核驳回</option></select><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索文件名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none" /></div><label className="flex h-9 items-center gap-2 whitespace-nowrap px-2 text-xs text-slate-600"><input type="checkbox" checked={onlyMine} onChange={(event) => setOnlyMine(event.target.checked)} className="accent-violet-600" />仅看我的</label></div>
      <div className="mb-3 flex justify-end"><select value={author} onChange={(event) => setAuthor(event.target.value)} className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部上传人</option><option>徐振</option><option>刘弯</option><option>张小花</option><option>梁浩然</option><option>赵铁柱</option></select></div>
      <div className="overflow-hidden rounded-md border border-slate-200"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">文件缩略图</th><th className="px-3 py-3">文件名称 / ID</th><th className="px-3 py-3">状态</th><th className="px-3 py-3">所在分类</th><th className="px-3 py-3">上传人</th><th className="px-3 py-3">时长</th><th className="px-3 py-3">大小</th></tr></thead><tbody>{filtered.map((item) => { const checked = draft.some((video) => video.id === item.id); return <tr key={item.id} onClick={() => toggle(item)} className={`cursor-pointer border-t border-slate-100 ${checked ? "bg-violet-50" : "hover:bg-slate-50"}`}><td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>{checked && <Check className="h-2.5 w-2.5" />}</span></td><td className="px-3 py-2"><img src={item.cover} alt="" className="h-10 w-16 rounded object-cover" referrerPolicy="no-referrer" /></td><td className="max-w-[220px] px-3 py-3"><p className="truncate font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td><td className="px-3 py-3"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{item.status}</span></td><td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.section}</p><p className="mt-1 text-[10px] text-slate-400">{item.category}</p></td><td className="px-3 py-3 text-slate-500">{item.author}</td><td className="px-3 py-3 text-slate-500">{item.duration}</td><td className="px-3 py-3 text-slate-500">{item.size}</td></tr>; })}</tbody></table></div>
    </div>
  </ModalFrame>;
}

function SettingsModal({ duration, ratio, removeWatermark, onClose, onConfirm }: { duration: number; ratio: "9:16" | "16:9"; removeWatermark: boolean; onClose: () => void; onConfirm: (value: { duration: number; ratio: "9:16" | "16:9"; removeWatermark: boolean }) => void }) {
  const [draftDuration, setDraftDuration] = useState(duration);
  const [draftRatio, setDraftRatio] = useState(ratio);
  const [draftWatermark, setDraftWatermark] = useState(removeWatermark);
  return <ModalFrame title="生成设置" onClose={onClose} width="max-w-lg" footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button onClick={() => onConfirm({ duration: draftDuration, ratio: draftRatio, removeWatermark: draftWatermark })} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white">确认</button></>}>
    <div className="space-y-6 p-5"><div><div className="mb-3 flex items-center justify-between"><label className="text-xs font-semibold text-slate-700">视频时长</label><div className="flex items-center gap-1"><input type="number" min={15} max={120} value={draftDuration} onChange={(event) => setDraftDuration(Math.min(120, Math.max(15, Number(event.target.value))))} className="h-8 w-16 rounded-md border border-slate-200 text-center text-xs outline-none" /><span className="text-xs text-slate-400">秒</span></div></div><input type="range" min={15} max={120} step={5} value={draftDuration} onChange={(event) => setDraftDuration(Number(event.target.value))} className="w-full accent-violet-600" /><div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>15秒</span><span>120秒</span></div></div>
      <div><label className="mb-3 block text-xs font-semibold text-slate-700">视频比例</label><div className="grid grid-cols-2 gap-2">{(["9:16", "16:9"] as const).map((item) => <button key={item} onClick={() => setDraftRatio(item)} className={`rounded-md border py-3 text-xs font-semibold ${draftRatio === item ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600"}`}>{item}</button>)}</div></div>
      <div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-700">去水印</label><button onClick={() => setDraftWatermark(!draftWatermark)} className={`relative h-6 w-11 rounded-full transition-colors ${draftWatermark ? "bg-violet-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${draftWatermark ? "left-6" : "left-1"}`} /></button></div>
    </div>
  </ModalFrame>;
}

function StyleModal({ value, onClose, onConfirm }: { value: string; onClose: () => void; onConfirm: (value: string) => void }) {
  const initialCategory = Math.max(0, STYLE_OPTIONS.findIndex((category) => category.directions.some((direction) => direction.name === value)));
  const [active, setActive] = useState(initialCategory);
  const [draft, setDraft] = useState(value);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const category = STYLE_OPTIONS[active];
  const selectCategory = (index: number) => {
    setActive(index);
    window.requestAnimationFrame(() => contentRef.current?.scrollTo({ top: 0 }));
  };
  return <ModalFrame title="视频营销视觉风格库" onClose={onClose} width="max-w-6xl" footer={<><button disabled={!draft} onClick={() => setDraft("")} className="mr-auto rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 disabled:opacity-40">清除已选风格</button>{draft && <span className="text-xs text-slate-500">已选：<b className="text-violet-700">{draft}</b></span>}<button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button onClick={() => onConfirm(draft)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white">确认应用</button></>}>
    <div className="grid h-[min(560px,calc(86vh-124px))] min-h-0 grid-cols-[210px_minmax(0,1fr)] overflow-hidden">
      <div className="overflow-y-auto border-r border-slate-200 bg-slate-50 p-3">{STYLE_OPTIONS.map((item, index) => { const selected = item.directions.some((direction) => direction.name === draft); return <button key={item.name} onClick={() => selectCategory(index)} className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-xs font-semibold ${active === index ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white"}`}><span className="min-w-0 flex-1">{item.name}</span>{selected && <Check className={`h-3.5 w-3.5 shrink-0 ${active === index ? "text-white" : "text-violet-600"}`} />}</button>; })}</div>
      <div ref={contentRef} className="overflow-y-auto p-5">
        <div className="border-b border-slate-200 pb-5">
          <h4 className="text-lg font-bold text-slate-900">{category.name}</h4>
          <div className="mt-4 space-y-3 text-xs leading-6">
            <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-3"><span className="font-semibold text-slate-500">核心视觉</span><p className="text-slate-600">{category.visual}</p></div>
          </div>
        </div>
        <div className="pt-5"><div className="mb-3 flex items-center justify-between"><h5 className="text-sm font-bold text-slate-900">细分方向</h5><span className="text-[11px] text-slate-400">{category.directions.length} 个方向</span></div><div className="grid grid-cols-2 gap-3 xl:grid-cols-3">{category.directions.map((direction) => <StyleDirectionCard key={direction.name} direction={direction} selected={draft === direction.name} onSelect={() => setDraft(direction.name)} />)}</div></div>
      </div>
    </div>
  </ModalFrame>;
}

function StyleDirectionCard({ direction, selected, onSelect }: { direction: { name: string; video: string; cover: string }; selected: boolean; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };
  return <button onClick={onSelect} onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop} className={`overflow-hidden rounded-md border bg-white text-left transition-colors ${selected ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200 hover:border-violet-300"}`}><div className="relative aspect-video overflow-hidden bg-slate-900"><video ref={videoRef} src={direction.video} poster={direction.cover} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />{!playing && <span className="absolute inset-0 flex items-center justify-center bg-slate-900/15"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow"><Play className="ml-0.5 h-4 w-4 fill-current" /></span></span>}{selected && <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white"><Check className="h-3 w-3" /></span>}</div><p className="px-3 py-2.5 text-xs font-semibold text-slate-700">{direction.name}</p></button>;
}
