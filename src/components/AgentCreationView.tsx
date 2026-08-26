import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowUp, AtSign, Check, CheckCircle2, ChevronDown, Copy, Download, Eye,
  FileText, Film, History, Image as ImageIcon, Link2, Loader2,
  MessageSquare, MoreHorizontal, Package, Palette, Play, Plus, Search,
  RefreshCw, Settings, Sparkles, Square, Trash2, Upload,
  Video, Volume2, WandSparkles, X
} from "lucide-react";
import { Task } from "../types";
import UploadFinishedVideoModal from "./UploadFinishedVideoModal";

type StepType = "analysis" | "script" | "preview" | "final";
type SessionStatus = "queue" | "generating" | "completed" | "failed" | "cancelled";
type HomePromptPart = "product_info" | `product_batch:${string}` | "reference" | "script" | "sources" | "style";

interface HomePromptPartValue {
  lead: string;
  label: string;
  promptLabel?: string;
  prefix?: string;
  image?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProductSelection {
  id: string;
  name: string;
  image: string;
  source: "douyin" | "images" | "local" | "conversation";
  primaryCategory?: string;
  secondaryCategory?: string;
  tags?: string[];
  author?: string;
  status?: string;
  size?: string;
  resolution?: string;
}

interface ProductImageBatch {
  id: string;
  images: ProductSelection[];
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
  source?: "library" | "manual";
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
  overview: string;
  recommendation: string;
  sellingPointSummary: string;
  presentation: string;
  character: string;
  voice: string;
  productImages: ProductSelection[];
  subjects: CreativeSubject[];
  shots: Array<{
    id: number;
    summary: string;
    dialogue?: string;
    visual?: string;
    dialogueLines: Array<{ id: string; subjectId: string; text: string }>;
    visualLines: Array<{ id: string; subjectIds: string[]; text: string }>;
  }>;
}

type CreativeSubjectKind = "product" | "person" | "narrator";

interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

interface CreativeSubject {
  id: string;
  kind: CreativeSubjectKind;
  name: string;
  description: string;
  image?: string;
  voices: VoiceOption[];
  activeVoiceId?: string;
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
  instruction?: string;
  time: string;
  snapshot: {
    demand: string;
    product?: ProductSelection;
    productImages: ProductSelection[];
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
  productImages: ProductSelection[];
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
const HOME_PROMPT_PREFIX = "请结合使用已投放素材和原料库为我生成一个短视频广告，";
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
  { id: "img-1", name: "防晒植物提取精华液展图.jpg", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "美妆护肤", secondaryCategory: "商品主图", tags: ["产品实拍", "成分党"], author: "致上互娱", status: "审核通过", size: "2.4 MB", resolution: "1080x1440" },
  { id: "img-2", name: "无痕防晒冰丝丝袜场景模特图.png", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "服饰内衣", secondaryCategory: "模特展示", tags: ["模特出镜", "清凉冰丝"], author: "汤小真", status: "待审核", size: "1.8 MB", resolution: "800x1200" },
  { id: "img-3", name: "夏日爆款产品宣发主图.jpg", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "日用百货", secondaryCategory: "宣发主图", tags: ["爆款", "活动促销"], author: "致上互娱", status: "审核通过", size: "4.5 MB", resolution: "1920x1080" },
  { id: "img-4", name: "草本护肤成分拆解对比展图.png", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "美妆护肤", secondaryCategory: "成分展示", tags: ["对比实测"], author: "汤小真", status: "审核通过", size: "3.1 MB", resolution: "1080x1080" },
  { id: "img-5", name: "防晒霜SPF50权威检测图.jpg", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "美妆护肤", secondaryCategory: "资质证明", tags: ["成分党", "检测报告"], author: "致上互娱", status: "未审核", size: "1.2 MB", resolution: "1080x1920" },
  { id: "img-6", name: "补水面膜水分提升对比实验图.jpg", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "美妆护肤", secondaryCategory: "效果对比", tags: ["对比实测"], author: "徐振", status: "审核通过", size: "2.9 MB", resolution: "1080x1440" },
  { id: "img-7", name: "夏日清凉草本展示图.jpg", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "食品饮料", secondaryCategory: "商品主图", tags: ["清凉夏日", "产品实拍"], author: "美妆设计组", status: "待审核", size: "5.4 MB", resolution: "2000x2000" },
  { id: "img-8", name: "高奢护肤瓶身渲染特写.jpg", image: "https://images.unsplash.com/photo-1608248597261-833257058444?w=600&auto=format&fit=crop&q=80", source: "images", primaryCategory: "美妆护肤", secondaryCategory: "商品主图", tags: ["高端质感", "3D渲染"], author: "汤小真", status: "审核通过", size: "3.8 MB", resolution: "1440x1920" }
];

const REFERENCE_VIDEOS: ReferenceVideoSelection[] = [
  { id: "ref-1", name: "夏日防晒实测高转化素材.mp4", cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80", duration: "00:28", size: "24.6 MB" },
  { id: "ref-2", name: "通勤穿搭口播投放素材.mp4", cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80", duration: "00:42", size: "38.1 MB" },
  { id: "ref-3", name: "厨房清洁前后对比素材.mp4", cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80", duration: "00:35", size: "31.8 MB" }
];

const SCRIPT_OPTIONS: ScriptSelection[] = [
  { id: "S-10291", name: "脚本 1 - 口播温和洁面破圈案", category: "个护家清 / 洗发护发", status: "待审核", author: "致上编导", updatedAt: "2026-08-04 14:20", source: "library" },
  { id: "S-10292", name: "玻璃油膜擦雨天实测分镜", category: "汽车用品 / 清洁养护", status: "审核通过", author: "徐振", updatedAt: "2026-08-18 10:32", source: "library" },
  { id: "S-10293", name: "高腰塑身裤痛点反转脚本", category: "服饰内衣 / 女士内衣", status: "审核通过", author: "汤小真", updatedAt: "2026-08-20 16:08", source: "library" }
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
const cloneCreatives = (items: CreativeItem[]) => items.map((item) => ({
  ...item,
  productImages: cloneItems(item.productImages || []),
  subjects: (item.subjects || []).map((subject) => ({ ...subject, voices: cloneItems(subject.voices || []) })),
  shots: item.shots.map((shot) => ({
    ...shot,
    dialogueLines: cloneItems(shot.dialogueLines || []),
    visualLines: (shot.visualLines || []).map((line) => ({ ...line, subjectIds: [...line.subjectIds] }))
  }))
}));
const productDisplayName = (product?: ProductSelection) => product?.name.replace(/\.(jpg|jpeg|png|webp)$/i, "") || "待补充商品名称";

const PERSON_IMAGES = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
];

const createVoice = (id: string, name: string, description: string): VoiceOption => ({ id, name, description });
const createFallbackProductImage = (productName: string): ProductSelection => ({ id: "creative-product-default", name: `${productName}.jpg`, image: SAMPLE_COVERS[0], source: "conversation", status: "AI生成" });

const createSubjects = (creativeIndex: number, productName: string): CreativeSubject[] => {
  const product: CreativeSubject = { id: "product", kind: "product", name: "商品", description: productName, voices: [] };
  const personOne: CreativeSubject = {
    id: "person-1",
    kind: "person",
    name: creativeIndex === 1 ? "大刘" : "人物形象 1",
    description: creativeIndex === 1 ? "私家车车主，沉稳理性，日常通勤中非常关注夜间驾驶安全。" : "一位注重生活品质和驾驶安全的年轻车主，表达自然可信。",
    image: PERSON_IMAGES[0],
    voices: [createVoice("voice-1", "音色 1", "青年男性，广告口播风格，音色清晰稳重，语速适中")],
    activeVoiceId: "voice-1"
  };
  const personTwo: CreativeSubject = {
    id: "person-2",
    kind: "person",
    name: "小敏",
    description: "大刘的妻子，年轻干练，表达轻松直接，适合生活化对话。",
    image: PERSON_IMAGES[1],
    voices: [createVoice("voice-1", "音色 1", "青年女性，生活化表达，音色明亮自然，语速适中")],
    activeVoiceId: "voice-1"
  };
  const narrator: CreativeSubject = {
    id: "narrator",
    kind: "narrator",
    name: "旁白",
    description: "广告旁白音色，专业清晰，节奏稳健，重点信息有强调。",
    voices: [createVoice("voice-1", "音色 1", "青年男性，广告旁白风格，专业讲解口吻，音色清晰稳重")],
    activeVoiceId: "voice-1"
  };
  if (creativeIndex % 3 === 0) return [product, personOne, narrator];
  if (creativeIndex % 3 === 1) return [product, personOne, personTwo];
  return [product, personOne];
};

const createShotRows = (shots: Array<{ id: number; summary: string; dialogue: string; visual: string }>, subjects: CreativeSubject[]) => {
  const people = subjects.filter((subject) => subject.kind === "person");
  const narrator = subjects.find((subject) => subject.kind === "narrator");
  return shots.map((shot, index) => {
    const primarySpeaker = narrator || people[index % Math.max(people.length, 1)] || subjects[0];
    const secondarySpeaker = people[index % Math.max(people.length, 1)] || primarySpeaker;
    return {
      ...shot,
      dialogueLines: [
        { id: `${shot.id}-dialogue-1`, subjectId: primarySpeaker.id, text: shot.dialogue },
        { id: `${shot.id}-dialogue-2`, subjectId: secondarySpeaker.id, text: index === 0 ? "别急，用这款玻璃油膜清洁擦，自己就能快速处理。" : "操作简单，擦完以后玻璃清楚多了。" }
      ],
      visualLines: [
        { id: `${shot.id}-visual-1`, subjectIds: people[0] ? [people[0].id] : [], text: shot.visual },
        { id: `${shot.id}-visual-2`, subjectIds: ["product"], text: "特写展示产品外观和实际使用过程，品牌与核心卖点清晰可见。" }
      ]
    };
  });
};

const CREATIVE_DETAILS = [
  {
    title: "雨天视线危机",
    angle: "痛点实测",
    overview: "从雨天挡风玻璃油膜造成视线模糊的真实痛点切入，通过清洁前后的直观对比，突出产品快速去膜、恢复通透视野的效果。",
    recommendation: "以“雨天视线模糊”这一高频驾驶安全隐患为切入点，先建立车主焦虑，再用清洁前后对比直接证明产品效果，购买理由清晰。",
    sellingPointSummary: "强力去油膜、擦拭无残留、视野通透、自带海绵擦头",
    presentation: "雨天实景痛点 + 半边玻璃清洁对比 + 清洁后驾驶视角展示",
    character: "一位注重行车安全的年轻男车主，穿深色休闲上衣，表达自然可信。",
    voice: "沉稳男声，语速适中，重点信息清晰有力。",
    shots: [
      { id: 1, summary: "痛点前置，引发用户共鸣", dialogue: "一下雨，挡风玻璃就像蒙了一层雾，雨刮越刮反而越模糊。", visual: "雨天车内第一视角，雨刮扫过后玻璃仍有大片油膜与光晕，驾驶员皱眉观察前方。" },
      { id: 2, summary: "产品实测，展示去膜效果", dialogue: "用它在玻璃上轻轻擦几遍，冲水后油膜很快就被带走了。", visual: "近景展示玻璃油膜清洁擦，完成涂抹、擦拭和冲水；画面保留一半未清洁区域形成直观对比。" },
      { id: 3, summary: "效果收束，强化安全价值", dialogue: "玻璃重新透亮，雨天和夜间开车都安心多了。", visual: "切回驾驶视角，挡风玻璃清晰通透，路面与车灯轮廓清楚，产品定格收尾。" }
    ]
  },
  {
    title: "夜间炫光对比",
    angle: "场景转化",
    overview: "聚焦夜间会车时油膜放大灯光炫光的问题，通过左右分屏对比清洁效果，将玻璃清洁与夜间驾驶安全直接关联。",
    recommendation: "夜间灯光炫光的视觉冲击强，能够快速抓住车主注意力；分屏对比降低理解成本，并自然承接产品的安全价值。",
    sellingPointSummary: "快速去膜、减少炫光、不伤玻璃、便携易用",
    presentation: "夜间会车场景 + 左右分屏效果对比 + 车内口播推荐",
    character: "一位有多年驾驶经验的通勤车主，形象干净利落，语气理性。",
    voice: "成熟男声，口吻克制，突出真实使用体验。",
    shots: [
      { id: 1, summary: "夜间炫光制造视觉钩子", dialogue: "晚上会车最怕这种一圈圈的炫光，路况根本看不清。", visual: "夜间道路第一视角，对向车灯在油膜玻璃上形成明显光晕，快速拉近危险感。" },
      { id: 2, summary: "分屏对比强化产品效果", dialogue: "清洁以后再看，灯光边缘清楚多了，玻璃也没有残留。", visual: "左右分屏展示清洁前后的同一路况，右侧炫光显著减少，并穿插产品擦拭特写。" },
      { id: 3, summary: "使用场景转化", dialogue: "经常夜间开车的朋友，车里备一支真的很实用。", visual: "车主在停车位旁展示产品，随后放入车门储物格，叠加便携易用卖点。" }
    ]
  },
  {
    title: "30秒快速去膜",
    angle: "效率展示",
    overview: "用30秒计时挑战串联完整使用过程，以快节奏实操证明产品操作简单、清洁高效，适合日常洗车和出行前快速处理。",
    recommendation: "明确的时间承诺能够形成强钩子，完整操作过程提升可信度，也能直接回应用户担心步骤复杂、费时费力的问题。",
    sellingPointSummary: "30秒快速清洁、步骤简单、自带擦头、冲水即净",
    presentation: "倒计时挑战 + 连续操作实拍 + 完成效果验收",
    character: "一位行动利落的年轻女车主，日常穿搭，表达轻松自然。",
    voice: "清爽女声，节奏明快，带轻微挑战感。",
    shots: [
      { id: 1, summary: "时间挑战建立期待", dialogue: "挡风玻璃有油膜？给我30秒，马上处理干净。", visual: "车主指向油膜明显的挡风玻璃，画面右上角出现30秒倒计时。" },
      { id: 2, summary: "连续实操证明简单高效", dialogue: "打开、涂匀、来回擦拭，再用清水一冲就可以。", visual: "连续近景拍摄产品开盖、海绵擦头涂抹、擦拭与冲水动作，倒计时持续运行。" },
      { id: 3, summary: "验收结果推动转化", dialogue: "时间到，玻璃透亮不留痕，自己在家就能轻松搞定。", visual: "倒计时停在30秒内，镜头贴近展示玻璃通透效果，车主举起产品完成推荐。" }
    ]
  }
];

const createCreatives = (start: number, productName = "玻璃油膜清洁擦", productImages: ProductSelection[] = []): CreativeItem[] => CREATIVE_DETAILS.map((item, index) => {
  const subjects = createSubjects(index, productName);
  const creativeProductImages = productImages.length ? cloneItems(productImages) : [createFallbackProductImage(productName)];
  return {
    id: start + index + 1,
    ...item,
    script: item.overview,
    productImages: creativeProductImages,
    subjects,
    shots: createShotRows(item.shots, subjects)
  };
});

const normalizeCreatives = (items: CreativeItem[] = [], productName = "玻璃油膜清洁擦", productImages: ProductSelection[] = []) => items.map((item, index) => {
  const fallback = CREATIVE_DETAILS[index % CREATIVE_DETAILS.length];
  const subjects = item.subjects?.length
    ? item.subjects.map((subject) => ({ ...subject, voices: subject.voices?.length ? cloneItems(subject.voices) : [createVoice("voice-1", "音色 1", subject.description)] }))
    : createSubjects(index, productName);
  const generatedShots = createShotRows(fallback.shots, subjects);
  return {
    ...fallback,
    ...item,
    overview: item.overview || item.script || fallback.overview,
    recommendation: item.recommendation || fallback.recommendation,
    sellingPointSummary: item.sellingPointSummary || fallback.sellingPointSummary,
    presentation: item.presentation || fallback.presentation,
    character: item.character || fallback.character,
    voice: item.voice || fallback.voice,
    productImages: item.productImages?.length ? cloneItems(item.productImages) : productImages.length ? cloneItems(productImages) : [createFallbackProductImage(productName)],
    subjects,
    shots: (item.shots?.length ? item.shots : generatedShots).map((shot, shotIndex) => ({
      ...shot,
      dialogueLines: shot.dialogueLines?.length ? cloneItems(shot.dialogueLines) : generatedShots[shotIndex]?.dialogueLines || [],
      visualLines: shot.visualLines?.length ? shot.visualLines.map((line) => ({ ...line, subjectIds: [...line.subjectIds] })) : generatedShots[shotIndex]?.visualLines || []
    }))
  };
});

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

const recordFor = (session: AgentSession, step: StepType, title: string, version?: number, instruction?: string): ResultRecord => ({
  id: `result_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  step,
  title,
  version,
  instruction,
  time: shortTime(),
  snapshot: {
    demand: session.demand,
    product: session.product ? { ...session.product } : undefined,
    productImages: cloneItems(session.productImages),
    productName: session.productName,
    industry: session.industry,
    category: session.category,
    sellingPoints: [...session.sellingPoints],
    painPoints: [...session.painPoints],
    targetGroups: [...session.targetGroups],
    scenarios: [...session.scenarios],
    specs: [...session.specs],
    discountInfo: session.discountInfo,
    creatives: cloneCreatives(session.creatives),
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
  productImages: [],
  creatives: [],
  previews: [],
  finals: [],
  timeline: [],
  versionCounts: { analysis: 1, script: 0 },
  activeVersions: { analysis: 1, script: 0 }
});

const withProductAnalysis = (session: AgentSession, product: ProductSelection, productImages?: ProductSelection[]): AgentSession => {
  const name = product.name.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  const base = {
    ...session,
    product,
    productImages: productImages?.length ? cloneItems(productImages) : session.productImages.length ? session.productImages : [product]
  };
  if (/吹风机/.test(name)) {
    return {
      ...base,
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
      ...base,
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
    ...base,
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
  const creatives = createCreatives(0, base.productName, base.productImages);
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
      productImages: stored.productImages?.length ? stored.productImages : stored.product ? [stored.product] : [],
      productName: stored.productName || productDisplayName(stored.product),
      industry: stored.industry || "待补充商品行业",
      category: stored.category || "待补充商品品类",
      sellingPoints: stored.sellingPoints || [],
      painPoints: stored.painPoints || [],
      targetGroups: stored.targetGroups || [],
      scenarios: stored.scenarios || [],
      specs: stored.specs || [],
      discountInfo: stored.discountInfo || "暂无优惠信息",
      creatives: normalizeCreatives(stored.creatives, stored.productName || productDisplayName(stored.product), stored.productImages?.length ? stored.productImages : stored.product ? [stored.product] : [])
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
  const [productImageBatches, setProductImageBatches] = useState<ProductImageBatch[]>([]);
  const [selectedReference, setSelectedReference] = useState<ReferenceVideoSelection | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptSelection | null>(null);
  const [selectedSources, setSelectedSources] = useState<SourceVideoSelection[]>([]);
  const [videoDuration, setVideoDuration] = useState(45);
  const [videoRatio, setVideoRatio] = useState<"9:16" | "16:9">("9:16");
  const [removeWatermark, setRemoveWatermark] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [homePromptOrder, setHomePromptOrder] = useState<HomePromptPart[]>([]);
  const homePromptEditorRef = useRef<HTMLSpanElement | null>(null);
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
  const productImagesForCreation = [
    ...(selectedProduct ? [selectedProduct] : []),
    ...productImageBatches.flatMap((batch) => batch.images)
  ].filter((image, index, images) => images.findIndex((item) => item.id === image.id) === index).slice(0, 6);
  const productImageCount = productImagesForCreation.length;
  const productForCreation = productImagesForCreation[0] || null;

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

  const appendPromptPart = (part: HomePromptPart) => {
    setHomePromptOrder((current) => current.includes(part) ? current : [...current, part]);
  };

  const removePromptPart = (part: HomePromptPart) => {
    setHomePromptOrder((current) => current.filter((item) => item !== part));
    if (part === "product_info") setSelectedProduct(null);
    if (part.startsWith("product_batch:")) {
      const batchId = part.slice("product_batch:".length);
      setProductImageBatches((current) => current.filter((batch) => batch.id !== batchId));
    }
    if (part === "reference") setSelectedReference(null);
    if (part === "script") setSelectedScript(null);
    if (part === "sources") setSelectedSources([]);
    if (part === "style") setSelectedStyle("");
  };

  const addProductImageBatch = (images: ProductSelection[], includeInPrompt = true) => {
    if (!images.length) return;
    const batch: ProductImageBatch = { id: `batch-${Date.now()}`, images };
    setProductImageBatches((current) => [...current, batch]);
    if (includeInPrompt) appendPromptPart(`product_batch:${batch.id}`);
    setHomeModal(null);
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
    inputFiles: value.productImages.length ? value.productImages.map((item) => item.image) : [value.product?.image || SAMPLE_COVERS[0]],
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

  const getHomePromptPart = (part: HomePromptPart): HomePromptPartValue | null => {
    if (part === "product_info" && selectedProduct) {
      return { lead: "商品是", label: selectedProduct.name, image: selectedProduct.image, icon: Package };
    }
    if (part.startsWith("product_batch:")) {
      const batch = productImageBatches.find((item) => `product_batch:${item.id}` === part);
      if (!batch?.images.length) return null;
      return {
        lead: "商品图片是",
        label: batch.images.length === 1 ? batch.images[0].name : `等 ${batch.images.length} 张商品图`,
        prefix: "商品图：",
        image: batch.images[0].image,
        icon: ImageIcon
      };
    }
    if (part === "reference" && selectedReference) {
      return { lead: "用上参考视频", label: selectedReference.name, image: selectedReference.cover, icon: Video };
    }
    if (part === "script" && selectedScript) {
      const shortLabel = selectedScript.source === "manual" && Array.from(selectedScript.name).length > 8
        ? `${Array.from(selectedScript.name).slice(0, 8).join("")}...`
        : selectedScript.name;
      return { lead: "脚本是", label: shortLabel, promptLabel: selectedScript.name, icon: FileText };
    }
    if (part === "sources" && selectedSources.length > 0) {
      return {
        lead: "用上上传原料",
        label: selectedSources.length === 1
          ? selectedSources[0].name
          : `等 ${selectedSources.length} 个原料`,
        prefix: selectedSources.length === 1 ? undefined : "原料包：",
        image: selectedSources[0].cover,
        icon: Film,
      };
    }
    if (part === "style" && selectedStyle) {
      return { lead: "视频风格是", label: selectedStyle, icon: Palette };
    }
    return null;
  };

  const activeHomePromptParts = homePromptOrder
    .map((part) => ({ part, value: getHomePromptPart(part) }))
    .filter((item): item is { part: HomePromptPart; value: NonNullable<ReturnType<typeof getHomePromptPart>> } => Boolean(item.value));

  const buildHomePrompt = () => {
    if (activeHomePromptParts.length === 0) return idea.trim();
    let value = `${HOME_PROMPT_PREFIX}${idea.trim()}`;
    activeHomePromptParts.forEach(({ value: part }) => {
      value += /[，,。；;!?！？]\s*$/.test(value) ? " " : "，";
      value += `${part.lead}${part.prefix || ""}${part.promptLabel || part.label}`;
    });
    return value.trim();
  };

  const startCreation = () => {
    const prompt = buildHomePrompt() || "开始 Agent 创作";
    const initial = makeBaseSession(prompt, "step");
    const base = productForCreation ? withProductAnalysis(initial, productForCreation, productImagesForCreation) : initial;
    base.conversation = [
      { role: "user", content: prompt },
      { role: "agent", content: "我已经收到请求，将先分析商品信息，再根据分析结果继续生成后续内容。" }
    ];
    onSessionChange(base.id);

    if (!productForCreation) {
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
    if (!session?.awaitingProduct || (!chatInput.trim() && !productForCreation)) return;
    const product = productForCreation || {
      id: `conversation_${Date.now()}`,
      name: chatInput.trim(),
      image: SAMPLE_COVERS[0],
      source: "conversation" as const
    };
    const userMessage = chatInput.trim() || `我的商品是${product.name}`;
    const working: AgentSession = {
      ...withProductAnalysis(session, product, productImagesForCreation.length ? productImagesForCreation : [product]),
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
      creatives: [...current.creatives, ...createCreatives(current.creatives.length, current.productName, current.productImages)],
      versionCounts: { ...current.versionCounts, script: version },
      activeVersions: { ...current.activeVersions, script: version }
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "script", "创意与分镜", version, "生成创意与分镜")] };
  });

  const generatePreviews = () => runGeneration("正在生成视频预览", "preview", 0, (current) => {
    const next = {
      ...current,
      availableSteps: Array.from(new Set([...current.availableSteps, "preview"])) as StepType[],
      previews: createPreviews(),
      finals: []
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "preview", "视频预览", undefined, "生成视频预览")] };
  });

  const generateFinals = () => runGeneration("正在生成视频成片", "final", 5, (current) => {
    const next = {
      ...current,
      availableSteps: Array.from(new Set([...current.availableSteps, "final"])) as StepType[],
      finals: createFinals(current.previews)
    };
    return { ...next, timeline: [...next.timeline, recordFor(next, "final", "视频成片", undefined, "生成视频成片")] };
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
      productImages: record.snapshot.productImages?.length ? cloneItems(record.snapshot.productImages) : session.productImages,
      productName: record.snapshot.productName || session.productName,
      industry: record.snapshot.industry || session.industry,
      category: record.snapshot.category || session.category,
      sellingPoints: [...(record.snapshot.sellingPoints || session.sellingPoints)],
      painPoints: [...(record.snapshot.painPoints || session.painPoints)],
      targetGroups: [...(record.snapshot.targetGroups || session.targetGroups)],
      scenarios: [...(record.snapshot.scenarios || session.scenarios)],
      specs: [...(record.snapshot.specs || session.specs)],
      discountInfo: record.snapshot.discountInfo || session.discountInfo,
      creatives: normalizeCreatives(record.snapshot.creatives, record.snapshot.productName || session.productName, record.snapshot.productImages || session.productImages),
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
      return { ...next, timeline: [...next.timeline, recordFor(next, current.currentStep, `按要求调整：${request.slice(0, 12)}`, version, request)] };
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
    setProductImageBatches([]);
    setSelectedReference(null);
    setSelectedScript(null);
    setSelectedSources([]);
    setSelectedStyle("");
    setHomePromptOrder([]);
    setHomeMenu(null);
    onSessionChange(null);
  };

  const selectedFinals = useMemo(() => session?.finals.filter((item) => item.selected) || [], [session?.finals]);
  const canStart = Boolean(idea.trim() || productForCreation || selectedReference || selectedScript || selectedSources.length || selectedStyle);

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
              <div
                className="flex min-h-[120px] flex-wrap content-start items-center gap-x-1 gap-y-2 text-sm leading-7 text-slate-800"
                onClick={(event) => {
                  if (event.target === event.currentTarget) homePromptEditorRef.current?.focus();
                }}
              >
                {activeHomePromptParts.length > 0 && <span>{HOME_PROMPT_PREFIX}</span>}
                <EditablePromptText
                  editorRef={homePromptEditorRef}
                  value={idea}
                  onChange={setIdea}
                  inline={activeHomePromptParts.length > 0}
                  placeholder={activeHomePromptParts.length > 0 ? "" : "发送给 Agent"}
                />
                {activeHomePromptParts.map(({ part, value }, index) => {
                  const needsSeparator = index > 0 || (Boolean(idea.trim()) && !/[，,。；;!?！？]\s*$/.test(idea));
                  return (
                    <React.Fragment key={part}>
                      <span className="whitespace-nowrap">{needsSeparator ? "，" : ""}{value.lead}</span>
                      <SelectionChip compact icon={value.icon} prefix={value.prefix} label={value.label} image={value.image} onRemove={() => removePromptPart(part)} />
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  <HomeMenuButton icon={Package} label="商品" active={homeMenu === "product" || !!selectedProduct || productImageCount > 0} onClick={() => setHomeMenu(homeMenu === "product" ? null : "product")}>
                    {homeMenu === "product" && <MenuPopup>
                      <MenuAction icon={Link2} label="输入商品信息" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_link"); }} />
                      <MenuAction icon={ImageIcon} label="添加商品图" disabled={productImageCount >= 6} onClick={() => { setHomeMenu(null); setHomeModal("product_image"); }} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={Video} label="参考" active={homeMenu === "reference"} disabled={!!selectedReference} disabledHint="已添加参考视频" onClick={() => setHomeMenu(homeMenu === "reference" ? null : "reference")}>
                    {homeMenu === "reference" && <MenuPopup>
                      <MenuAction icon={History} label="历史投放素材" disabled={!!selectedReference} onClick={() => { setHomeMenu(null); setHomeModal("reference"); }} />
                      <LocalReferenceAction disabled={!!selectedReference} onUploaded={(item) => { setReferenceHistory((items) => [item, ...items]); setSelectedReference(item); appendPromptPart("reference"); setHomeMenu(null); }} showToast={showToast} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={FileText} label="脚本/原料" active={homeMenu === "source" || !!selectedScript || selectedSources.length > 0} onClick={() => setHomeMenu(homeMenu === "source" ? null : "source")}>
                    {homeMenu === "source" && <MenuPopup>
                      <MenuAction icon={FileText} label="添加脚本" disabled={!!selectedScript} onClick={() => { setHomeMenu(null); setHomeModal("script"); }} />
                      <MenuAction icon={Film} label="添加原料" onClick={() => { setHomeMenu(null); setHomeModal("sources"); }} />
                    </MenuPopup>}
                  </HomeMenuButton>
                  <HomeMenuButton icon={Settings} label={`${videoDuration}秒 · ${videoRatio}`} active={homeModal === "settings"} onClick={() => { setHomeMenu(null); setHomeModal("settings"); }} />
                  <HomeMenuButton icon={Palette} label="风格" active={homeModal === "style" || !!selectedStyle} onClick={() => { setHomeMenu(null); setHomeModal("style"); }} />
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

        {homeModal === "product_link" && <ProductLinkModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); appendPromptPart("product_info"); setHomeModal(null); }} />}
        {homeModal === "product_image" && <ProductImageModal existingCount={productImageCount} onClose={() => setHomeModal(null)} onConfirm={(images) => addProductImageBatch(images)} showToast={showToast} />}
        {homeModal === "reference" && <ReferenceVideoModal items={referenceHistory} selected={selectedReference} onDelete={(id) => { setReferenceHistory((items) => items.filter((item) => item.id !== id)); if (selectedReference?.id === id) removePromptPart("reference"); }} onClose={() => setHomeModal(null)} onConfirm={(item) => { setSelectedReference(item); appendPromptPart("reference"); setHomeModal(null); }} />}
        {homeModal === "script" && <ScriptSelectorModal selected={selectedScript} onClose={() => setHomeModal(null)} onConfirm={(item) => { setSelectedScript(item); appendPromptPart("script"); setHomeModal(null); }} />}
        {homeModal === "sources" && <SourceSelectorModal selected={selectedSources} onClose={() => setHomeModal(null)} onConfirm={(items) => { setSelectedSources(items); if (items.length) appendPromptPart("sources"); else removePromptPart("sources"); setHomeModal(null); }} showToast={showToast} />}
        {homeModal === "settings" && <SettingsModal duration={videoDuration} ratio={videoRatio} removeWatermark={removeWatermark} onClose={() => setHomeModal(null)} onConfirm={(settings) => { setVideoDuration(settings.duration); setVideoRatio(settings.ratio); setRemoveWatermark(settings.removeWatermark); setHomeModal(null); }} />}
        {homeModal === "style" && <StyleModal value={selectedStyle} onClose={() => setHomeModal(null)} onConfirm={(value) => { setSelectedStyle(value); if (value) appendPromptPart("style"); else removePromptPart("style"); setHomeModal(null); }} />}
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
            {(selectedProduct || productImageBatches.length > 0) && <div className="mb-2 flex flex-wrap gap-2">
              {selectedProduct && <SelectionChip icon={Package} label={selectedProduct.name} image={selectedProduct.image} onRemove={() => setSelectedProduct(null)} />}
              {productImageBatches.map((batch) => <SelectionChip key={batch.id} icon={ImageIcon} prefix="商品图：" label={batch.images.length === 1 ? batch.images[0].name : `等 ${batch.images.length} 张商品图`} image={batch.images[0].image} onRemove={() => setProductImageBatches((current) => current.filter((item) => item.id !== batch.id))} />)}
            </div>}
            <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} rows={3} placeholder="补充商品信息" className="w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-slate-400" />
            <div className="mt-2 flex items-center justify-between">
              <div className="relative">
                <HomeMenuButton icon={Package} label="商品" active={homeMenu === "product" || !!selectedProduct || productImageCount > 0} onClick={() => setHomeMenu(homeMenu === "product" ? null : "product")}>
                  {homeMenu === "product" && <MenuPopup>
                    <MenuAction icon={Link2} label="输入商品信息" disabled={!!selectedProduct} onClick={() => { setHomeMenu(null); setHomeModal("product_link"); }} />
                    <MenuAction icon={ImageIcon} label="添加商品图" disabled={productImageCount >= 6} onClick={() => { setHomeMenu(null); setHomeModal("product_image"); }} />
                  </MenuPopup>}
                </HomeMenuButton>
              </div>
              <button onClick={confirmProductInConversation} disabled={!chatInput.trim() && !productForCreation} title="发送" className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white disabled:bg-slate-200 disabled:text-slate-400"><ArrowUp className="h-4 w-4" /></button>
            </div>
          </div>
        </main>
        {homeModal === "product_link" && <ProductLinkModal onClose={() => setHomeModal(null)} onConfirm={(product) => { setSelectedProduct(product); setHomeModal(null); }} />}
        {homeModal === "product_image" && <ProductImageModal existingCount={productImageCount} onClose={() => setHomeModal(null)} onConfirm={(images) => addProductImageBatch(images, false)} showToast={showToast} />}
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
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_390px] overflow-hidden">
        <main className="relative min-w-0 overflow-y-auto bg-slate-50 px-5 pb-0 pt-5">
          {session.status === "generating" ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /><p className="mt-4 text-sm font-semibold text-slate-700">{generatingLabel}</p><button onClick={stopGeneration} className="mt-5 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Square className="h-3.5 w-3.5" />停止生成</button></div>
          ) : session.status === "failed" ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><X className="h-5 w-5" /></div><p className="mt-4 text-sm font-semibold">当前阶段生成失败</p><button onClick={retryGeneration} className="mt-5 flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white"><RefreshCw className="h-3.5 w-3.5" />重新生成</button></div>
          ) : (
            <>
              {session.currentStep === "analysis" && <AnalysisPanel session={session} setSession={setSession} showToast={showToast} />}
              {session.currentStep === "script" && <ScriptPanel session={session} setSession={setSession} currentCreative={currentCreative} selectedCreativeId={selectedCreativeId} setSelectedCreativeId={setSelectedCreativeId} showToast={showToast} />}
              {session.currentStep === "preview" && <PreviewPanel session={session} setSession={setSession} />}
              {session.currentStep === "final" && <FinalPanel session={session} setSession={setSession} selectedFinals={selectedFinals} openUpload={openUpload} setDetailVideo={setDetailVideo} showToast={showToast} />}
            </>
          )}

          {session.status !== "generating" && session.status !== "failed" && (
            <div className="sticky bottom-0 z-20 -mx-5 mt-6 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-sm">
              {session.currentStep === "analysis" && <>
                <button onClick={() => runGeneration("正在生成视频成片", "final", 5, (current) => { const previews = createPreviews(); const next = { ...current, availableSteps: Array.from(new Set([...current.availableSteps, "final"])) as StepType[], previews, finals: createFinals(previews) }; return { ...next, timeline: [...next.timeline, recordFor(next, "final", "视频成片", undefined, "一键成片")] }; })} className="rounded-md border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">一键成片</button>
                <button onClick={generateScripts} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700">生成创意与分镜</button>
              </>}
              {session.currentStep === "script" && <button onClick={generatePreviews} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700">生成视频预览</button>}
              {session.currentStep === "preview" && <button onClick={generateFinals} disabled={session.previews.every((item) => !item.selected)} className="rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40">生成视频成片</button>}
              {session.currentStep === "final" && <button onClick={() => openUpload(selectedFinals)} className="flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700"><Upload className="h-4 w-4" />上传资源库</button>}
            </div>
          )}
        </main>

        <ConversationPanel session={session} chatInput={chatInput} setChatInput={setChatInput} submitChat={submitChat} restoreResult={restoreResult} />
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

function ConversationPanel({ session, chatInput, setChatInput, submitChat, restoreResult }: { session: AgentSession; chatInput: string; setChatInput: (value: string) => void; submitChat: () => void; restoreResult: (record: ResultRecord) => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messages = session.conversation?.length ? session.conversation : [
    { role: "user" as const, content: session.prompt },
    { role: "agent" as const, content: "我已经收到请求，将先分析商品信息，再根据分析结果继续生成后续内容。" }
  ];

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [session.timeline.length, session.status, messages.length]);

  const resultTitle = (record: ResultRecord) => {
    if (record.step === "analysis") return `${session.productName}的需求分析`;
    if (record.step === "script") return `${session.productName}的分镜`;
    if (record.step === "preview") return `${session.productName}的预览`;
    return `${session.productName}的${record.snapshot.finals.length || session.finals.length}个成片`;
  };

  const resultDescription = (record: ResultRecord) => {
    if (record.step === "analysis") return `已完成${session.productName}的需求和商品分析，可在左侧查看并修改详细内容。`;
    if (record.step === "script") return `已生成${record.snapshot.creatives.length}套创意与分镜脚本，可在左侧选择并查看详细内容。`;
    if (record.step === "preview") return `已生成${record.snapshot.previews.length}个视频预览，可在左侧查看并选择需要继续生成的版本。`;
    return `已生成${record.snapshot.finals.length}个最终成片，可在左侧查看完整视频结果。`;
  };

  return (
    <aside className="flex min-h-0 w-[390px] flex-col border-l border-slate-200 bg-white">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4"><MessageSquare className="h-4 w-4 text-violet-600" /><h2 className="text-xs font-bold text-slate-800">创作记录</h2></div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <React.Fragment key={`message-${index}`}>
              {message.role === "user" ? (
                <div className="flex justify-end"><div className="max-w-[88%] rounded-lg bg-violet-600 px-3.5 py-2.5 text-xs leading-5 text-white">{message.content}</div></div>
              ) : (
                <p className="text-xs leading-6 text-slate-600">{message.content}</p>
              )}
              {index === 0 && session.productImages[0] && (
                <div className="flex justify-end"><div className="flex w-64 items-center gap-3 rounded-lg border border-violet-200 bg-violet-50 p-2.5"><img src={session.productImages[0].image} alt="" className="h-12 w-12 shrink-0 rounded object-cover" referrerPolicy="no-referrer" /><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{session.productName}</p><p className="mt-1 text-[10px] text-slate-400">商品 · 共 {session.productImages.length} 张参考图</p></div></div></div>
              )}
            </React.Fragment>
          ))}

          {session.timeline.map((record) => {
            const meta = STEP_META.find((item) => item.id === record.step)!;
            const Icon = meta.icon;
            const active = session.currentStep === record.step && session.timeline[session.timeline.length - 1]?.id === record.id;
            return (
              <div key={record.id} className="space-y-3">
                {record.instruction && <div className="flex justify-end"><div className="max-w-[88%] rounded-lg bg-violet-600 px-3.5 py-2.5 text-xs leading-5 text-white">{record.instruction}</div></div>}
                <button onClick={() => restoreResult(record)} className={`w-[82%] rounded-lg border p-3 text-left transition-colors ${active ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
                  <div className="flex items-start gap-2.5"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${active ? "bg-violet-600 text-white" : "bg-white text-violet-600"}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-800">{resultTitle(record)}</p><p className="mt-1.5 text-[10px] text-slate-400">查看详情 <span className="mx-1">|</span> {record.time}{record.version ? ` · 第${record.version}版` : ""}</p></div></div>
                </button>
                <p className="text-xs leading-6 text-slate-600">{resultDescription(record)}</p>
              </div>
            );
          })}

          {session.status === "generating" && <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />Agent 正在处理当前指令</div>}
        </div>
      </div>
      <div className="shrink-0 border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 focus-within:border-violet-400 focus-within:bg-white">
          <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitChat(); } }} rows={3} placeholder="可以随时告诉我你的想法" className="min-w-0 flex-1 resize-none bg-transparent text-xs leading-5 outline-none placeholder:text-slate-400" />
          <button onClick={submitChat} disabled={!chatInput.trim() || session.status === "generating"} title="发送" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400"><ArrowUp className="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
  );
}

function AnalysisPanel({ session, setSession, showToast }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>>; showToast: (message: string) => void }) {
  const [imagePicker, setImagePicker] = useState<{ mode: "add" | "replace"; index?: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<ProductSelection | null>(null);
  const images = session.productImages || [];
  const updateImages = (productImages: ProductSelection[]) => setSession({ ...session, productImages, product: productImages[0] });
  const updateList = (field: "sellingPoints" | "painPoints" | "targetGroups" | "scenarios" | "specs", items: string[]) => setSession({ ...session, [field]: items });
  return (
    <div className="mx-auto max-w-5xl">
      <PanelHeader title={session.productName} count={session.versionCounts.analysis} active={session.activeVersions.analysis} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, analysis: value } })} />
      <p className="mb-6 text-base font-bold text-violet-700">商品分析信息</p>
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-bold text-slate-900">1. 商品参考图</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-600">上传丰富的参考图有助于提升模型的生成质量</p>
              {images.length < 6 && <button onClick={() => setImagePicker({ mode: "add" })} className="flex shrink-0 items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"><Plus className="h-3.5 w-3.5" />添加参考图</button>}
            </div>
            <div className="flex min-h-36 flex-wrap content-start gap-3 p-4">
              {images.map((image, index) => (
                <div key={`${image.id}-${index}`} className="group relative h-28 w-28 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <button onClick={() => setPreviewImage(image)} title="查看大图" className="h-full w-full"><img src={image.image} alt={image.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" /></button>
                  <div className="absolute right-1.5 top-1.5 hidden flex-col gap-1 group-hover:flex">
                    <button onClick={() => updateImages(images.filter((_, itemIndex) => itemIndex !== index))} title="删除图片" className="flex h-7 w-7 items-center justify-center rounded bg-slate-900/75 text-white hover:bg-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setImagePicker({ mode: "replace", index })} title="替换图片" className="flex h-7 w-7 items-center justify-center rounded bg-slate-900/75 text-white hover:bg-violet-600"><RefreshCw className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              {images.length === 0 && <div className="flex min-h-28 w-full items-center justify-center text-xs text-slate-400">暂无参考图</div>}
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold text-slate-900">2. 商品详细信息</h3>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <AnalysisTextField label="商品名称" value={session.productName} onChange={(productName) => setSession({ ...session, productName })} />
            <AnalysisTextField label="商品行业" value={session.industry} onChange={(industry) => setSession({ ...session, industry })} />
            <AnalysisTextField label="商品品类" value={session.category} onChange={(category) => setSession({ ...session, category })} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <AnalysisListField label="商品卖点" items={session.sellingPoints} onChange={(items) => updateList("sellingPoints", items)} />
          <AnalysisListField label="商品痛点" items={session.painPoints} onChange={(items) => updateList("painPoints", items)} />
          <AnalysisListField label="目标人群" items={session.targetGroups} onChange={(items) => updateList("targetGroups", items)} />
          <AnalysisListField label="适用人群和场景" items={session.scenarios} onChange={(items) => updateList("scenarios", items)} />
          <AnalysisListField label="商品规格" items={session.specs} onChange={(items) => updateList("specs", items)} />
          <AnalysisTextField label="优惠信息" value={session.discountInfo} onChange={(discountInfo) => setSession({ ...session, discountInfo })} large />
        </section>
      </div>

      {imagePicker && <ProductImageModal
        existingCount={images.length}
        mode={imagePicker.mode}
        excludedIds={images.filter((_, index) => imagePicker.mode === "add" || index !== imagePicker.index).map((image) => image.id)}
        onClose={() => setImagePicker(null)}
        onConfirm={(selected) => {
          if (imagePicker.mode === "replace" && imagePicker.index !== undefined) updateImages(images.map((image, index) => index === imagePicker.index ? selected[0] : image));
          else updateImages([...images, ...selected].slice(0, 6));
          setImagePicker(null);
        }}
        showToast={showToast}
      />}
      {previewImage && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/65 p-5" onMouseDown={(event) => event.target === event.currentTarget && setPreviewImage(null)}>
          <div className="relative max-h-[88vh] max-w-4xl overflow-hidden rounded-lg bg-white p-2 shadow-2xl"><img src={previewImage.image} alt={previewImage.name} className="max-h-[82vh] max-w-full object-contain" referrerPolicy="no-referrer" /><button onClick={() => setPreviewImage(null)} title="关闭" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-slate-900/70 text-white"><X className="h-4 w-4" /></button></div>
        </div>
      )}
    </div>
  );
}

function AnalysisTextField({ label, value, onChange, large = false }: { label: string; value: string; onChange: (value: string) => void; large?: boolean }) {
  return <label className={`rounded-lg border border-slate-200 bg-white p-4 ${large ? "min-h-[168px]" : ""}`}><span className={`block font-semibold ${large ? "text-sm text-slate-900" : "text-xs text-slate-500"}`}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className={`${large ? "mt-4" : "mt-2"} h-8 w-full border-0 bg-transparent p-0 text-sm text-slate-800 outline-none`} /></label>;
}

function AnalysisListField({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const addItem = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };
  return (
    <section className="group rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between"><h4 className="text-sm font-bold text-slate-900">{label}</h4><button onClick={() => setEditing((value) => !value)} title={editing ? "完成编辑" : "编辑"} className="flex h-7 w-7 items-center justify-center rounded text-slate-400 opacity-0 hover:bg-violet-50 hover:text-violet-700 group-hover:opacity-100">{editing ? <Check className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}</button></div>
      <div className="mt-3 space-y-1.5">
        {items.map((item, index) => editing ? <div key={`${label}-${index}`} className="flex min-h-8 items-center gap-2 rounded-md bg-slate-50 px-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" /><input value={item} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="min-w-0 flex-1 border-0 bg-transparent py-1 text-xs leading-5 text-slate-700 outline-none" /><button onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} title="删除" className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div> : <div key={`${label}-${index}`} className="flex gap-2 text-xs leading-6 text-slate-600"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" /><span>{item}</span></div>)}
      </div>
      {editing && <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addItem(); } }} placeholder={`添加${label}`} className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 text-xs outline-none focus:border-violet-400" /><button onClick={addItem} disabled={!draft.trim()} title="添加" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white disabled:bg-slate-200 disabled:text-slate-400"><Plus className="h-3.5 w-3.5" /></button></div>}
    </section>
  );
}

function ScriptPanel({ session, setSession, currentCreative, selectedCreativeId, setSelectedCreativeId, showToast }: { session: AgentSession; setSession: React.Dispatch<React.SetStateAction<AgentSession | null>>; currentCreative?: CreativeItem; selectedCreativeId: number; setSelectedCreativeId: (id: number) => void; showToast: (message: string) => void }) {
  const [expandedCreativeId, setExpandedCreativeId] = useState<number | null>(null);
  const [subjectDraft, setSubjectDraft] = useState<{ subjectId: string; productImages: ProductSelection[]; voices: VoiceOption[]; activeVoiceId?: string } | null>(null);
  const [imagePicker, setImagePicker] = useState<{ mode: "add" | "replace"; index?: number } | null>(null);
  const [voiceEditorOpen, setVoiceEditorOpen] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState("");
  const displayCreative = useMemo(() => currentCreative
    ? normalizeCreatives(session.creatives, session.productName, session.productImages).find((creative) => creative.id === currentCreative.id)
    : undefined, [currentCreative, session.creatives, session.productImages, session.productName]);

  const updateCreative = (updater: (creative: CreativeItem) => CreativeItem) => {
    if (!currentCreative) return;
    setSession((current) => {
      if (!current) return current;
      const normalized = normalizeCreatives(current.creatives, current.productName, current.productImages);
      return { ...current, creatives: current.creatives.map((creative, index) => creative.id === currentCreative.id ? updater(normalized[index]) : creative) };
    });
  };

  const updateDialogueLine = (shotId: number, lineId: string, text: string) => updateCreative((creative) => ({
    ...creative,
    shots: creative.shots.map((shot) => shot.id === shotId ? { ...shot, dialogueLines: shot.dialogueLines.map((line) => line.id === lineId ? { ...line, text } : line) } : shot)
  }));

  const updateVisualLine = (shotId: number, lineId: string, patch: Partial<{ text: string; subjectIds: string[] }>) => updateCreative((creative) => ({
    ...creative,
    shots: creative.shots.map((shot) => shot.id === shotId ? { ...shot, visualLines: shot.visualLines.map((line) => line.id === lineId ? { ...line, ...patch } : line) } : shot)
  }));

  const openSubject = (subject: CreativeSubject) => {
    setSubjectDraft({
      subjectId: subject.id,
      productImages: cloneItems(displayCreative?.productImages?.length ? displayCreative.productImages : session.productImages),
      voices: cloneItems(subject.voices),
      activeVoiceId: subject.activeVoiceId
    });
    setVoiceEditorOpen(false);
    setVoiceDraft("");
  };

  const applySubjectDraft = () => {
    if (!subjectDraft || !currentCreative) return;
    updateCreative((creative) => ({
      ...creative,
      productImages: subjectDraft.subjectId === "product" ? cloneItems(subjectDraft.productImages) : creative.productImages,
      subjects: creative.subjects.map((subject) => subject.id === subjectDraft.subjectId ? { ...subject, voices: cloneItems(subjectDraft.voices), activeVoiceId: subjectDraft.activeVoiceId } : subject)
    }));
    setSubjectDraft(null);
    showToast("已应用到当前创意");
  };

  const selectedSubject = displayCreative?.subjects.find((subject) => subject.id === subjectDraft?.subjectId);

  if (displayCreative && selectedSubject && subjectDraft) {
    return (
      <div className="mx-auto max-w-6xl">
        <PanelHeader title="创意与分镜" count={session.versionCounts.script} active={session.activeVersions.script} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, script: value } })} />
        <SubjectDetailPanel
          subject={selectedSubject}
          draft={subjectDraft}
          productName={session.productName}
          voiceEditorOpen={voiceEditorOpen}
          voiceDraft={voiceDraft}
          onBack={() => setSubjectDraft(null)}
          onApply={applySubjectDraft}
          onVoiceDraftChange={setVoiceDraft}
          onToggleVoiceEditor={() => setVoiceEditorOpen((value) => !value)}
          onAddVoice={() => {
            const description = voiceDraft.trim();
            if (!description) return;
            const nextNumber = subjectDraft.voices.length + 1;
            const id = `voice-${Date.now()}`;
            setSubjectDraft({ ...subjectDraft, voices: [...subjectDraft.voices, createVoice(id, `音色 ${nextNumber}`, description)], activeVoiceId: id });
            setVoiceDraft("");
            setVoiceEditorOpen(false);
          }}
          onSelectVoice={(activeVoiceId) => setSubjectDraft({ ...subjectDraft, activeVoiceId })}
          onAddImage={() => setImagePicker({ mode: "add" })}
          onReplaceImage={(index) => setImagePicker({ mode: "replace", index })}
          onDeleteImage={(index) => {
            if (subjectDraft.productImages.length <= 1) return showToast("至少保留一张商品参考图");
            setSubjectDraft({ ...subjectDraft, productImages: subjectDraft.productImages.filter((_, imageIndex) => imageIndex !== index) });
          }}
        />
        {imagePicker && (
          <ProductImageModal
            existingCount={subjectDraft.productImages.length}
            mode={imagePicker.mode}
            excludedIds={subjectDraft.productImages.map((item) => item.id)}
            onClose={() => setImagePicker(null)}
            onConfirm={(images) => {
              const productImages = imagePicker.mode === "replace" && imagePicker.index !== undefined
                ? subjectDraft.productImages.map((image, index) => index === imagePicker.index ? images[0] : image)
                : [...subjectDraft.productImages, ...images].slice(0, 6);
              setSubjectDraft({ ...subjectDraft, productImages });
              setImagePicker(null);
            }}
            showToast={showToast}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PanelHeader title="创意与分镜" count={session.versionCounts.script} active={session.activeVersions.script} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, script: value } })} />
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[157px_minmax(0,1fr)]">
        <div className="flex gap-2 overflow-x-auto pb-1 xl:sticky xl:top-0 xl:block xl:space-y-2 xl:overflow-visible xl:pb-0">
          {session.creatives.map((item) => (
            <button key={item.id} onClick={() => { setSelectedCreativeId(item.id); setExpandedCreativeId(null); }} className={`w-full min-w-[150px] rounded-lg border p-3 text-left transition-colors xl:min-w-0 ${selectedCreativeId === item.id ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-200"}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-slate-800">创意 {item.id}</span><span className={`shrink-0 rounded px-1.5 py-1 text-[10px] ${selectedCreativeId === item.id ? "bg-white text-violet-700" : "bg-slate-100 text-slate-500"}`}>{item.angle}</span></div>
              <p className="mt-2 text-xs font-semibold text-slate-700">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{item.overview}</p>
            </button>
          ))}
        </div>
        {displayCreative && (
          <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="px-4 py-5 xl:px-6">
              <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><p className="text-xs font-semibold text-violet-600">创意 {displayCreative.id}</p><span className="rounded bg-violet-50 px-2 py-1 text-[10px] text-violet-700">{displayCreative.angle}</span></div><h3 className="mt-2 text-lg font-bold text-slate-900">{displayCreative.title}</h3></div><button title="更多" className="rounded p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button></div>
              <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3.5"><p className="text-xs font-bold text-slate-700">创意概述</p><p className="mt-2 text-sm leading-7 text-slate-600">{displayCreative.overview}</p></div>
              <button onClick={() => setExpandedCreativeId(expandedCreativeId === displayCreative.id ? null : displayCreative.id)} className="mt-4 flex items-center gap-1.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700">
                {expandedCreativeId === displayCreative.id ? "收起完整创意" : "查看完整创意"}<ChevronDown className={`h-4 w-4 transition-transform ${expandedCreativeId === displayCreative.id ? "rotate-180" : "-rotate-90"}`} />
              </button>
              {expandedCreativeId === displayCreative.id && (
                <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                  <CreativeReadOnlySection index="一" title="推荐理由" content={displayCreative.recommendation} />
                  <CreativeReadOnlySection index="二" title="核心卖点" content={displayCreative.sellingPointSummary} />
                  <CreativeReadOnlySection index="三" title="卖点表现形式" content={displayCreative.presentation} />
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 px-4 py-6 xl:px-6">
              <h3 className="text-lg font-bold text-violet-700">分镜脚本</h3>
              <h4 className="mt-6 text-sm font-bold text-slate-900">1. 主体设定</h4>
              <div className="mt-3 flex flex-wrap gap-3">
                {displayCreative.subjects.map((subject) => (
                  <SubjectSettingCard key={subject.id} subject={subject.kind === "product" ? { ...subject, description: session.productName } : subject} productImages={displayCreative.productImages.length ? displayCreative.productImages : session.productImages} onOpen={() => openSubject(subject)} />
                ))}
              </div>
              <h4 className="mt-7 text-sm font-bold text-slate-900">2. 分镜描述</h4>
              <div className="mt-4 space-y-5">
                {displayCreative.shots.map((shot) => (
                  <article key={shot.id}>
                    <div className="mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" /><p className="text-xs font-bold text-slate-700">镜头 {shot.id}：{shot.summary}</p></div>
                    <div className="grid grid-cols-1 rounded-lg border border-slate-200 xl:grid-cols-2">
                      <div className="border-b border-slate-200 xl:border-b-0 xl:border-r"><span className="block rounded-tl-lg bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700">人物台词</span>{shot.dialogueLines.map((line) => <StoryboardLineEditor key={line.id} type="dialogue" text={line.text} subjects={displayCreative.subjects} subjectIds={[line.subjectId]} productImages={displayCreative.productImages} onTextChange={(text) => updateDialogueLine(shot.id, line.id, text)} />)}</div>
                      <div><span className="block rounded-tr-lg bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700">画面描述</span>{shot.visualLines.map((line) => <StoryboardLineEditor key={line.id} type="visual" text={line.text} subjects={displayCreative.subjects} subjectIds={line.subjectIds} productImages={displayCreative.productImages} onTextChange={(text) => updateVisualLine(shot.id, line.id, { text })} onSubjectsChange={(subjectIds) => updateVisualLine(shot.id, line.id, { subjectIds })} />)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CreativeReadOnlySection({ index, title, content }: { index: string; title: string; content: string }) {
  return <section><h4 className="text-sm font-bold text-slate-900">{index}、{title}</h4><p className="mt-2 text-sm leading-7 text-slate-600">{content}</p></section>;
}

function SubjectSettingCard({ subject, productImages, onOpen }: { subject: CreativeSubject; productImages: ProductSelection[]; onOpen: () => void }) {
  const isProduct = subject.kind === "product";
  const isNarrator = subject.kind === "narrator";
  return (
    <button onClick={onOpen} className="group relative min-w-[150px] max-w-[220px] basis-[150px] grow rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:border-violet-300 hover:bg-violet-50/30">
      <div className="flex h-12 items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold text-slate-800">{subject.name}</p><TruncatedSubjectDescription subject={subject} productImages={productImages} /></div>{!isProduct && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white text-slate-500"><Volume2 className="h-3.5 w-3.5" /></span>}</div>
      {isProduct ? <ProductImageGrid images={productImages} /> : isNarrator ? <div className="mt-2 flex h-[180px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-white"><Volume2 className="h-10 w-10 text-slate-300" /></div> : <img src={subject.image} alt={subject.name} className="mt-2 h-[180px] w-full rounded-md object-cover" referrerPolicy="no-referrer" />}
    </button>
  );
}

function ProductImageGrid({ images }: { images: ProductSelection[] }) {
  const shown = images.slice(0, 4);
  return <div className={`mt-2 grid h-[180px] overflow-hidden rounded-md bg-white ${shown.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>{shown.map((image, index) => <div key={image.id} className="relative min-h-0"><img src={image.image} alt={image.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />{index === 3 && images.length > 4 && <span className="absolute inset-0 flex items-center justify-center bg-slate-900/65 text-base font-bold text-white">+{images.length - 3}</span>}</div>)}</div>;
}

function TruncatedSubjectDescription({ subject, productImages }: { subject: CreativeSubject; productImages: ProductSelection[] }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [showDetail, setShowDetail] = useState(false);
  const checkOverflow = () => {
    const element = textRef.current;
    setShowDetail(Boolean(element && element.scrollWidth > element.clientWidth));
  };
  return <div className="relative"><p ref={textRef} onMouseEnter={checkOverflow} onMouseLeave={() => setShowDetail(false)} className="mt-1 max-w-[154px] truncate text-[11px] leading-5 text-slate-500">{subject.description}</p>{showDetail && <SubjectTooltip subject={subject} productImages={productImages} compact />}</div>;
}

function SubjectTooltip({ subject, productImages, compact = false }: { subject: CreativeSubject; productImages: ProductSelection[]; compact?: boolean }) {
  const image = subject.kind === "product" ? productImages[0]?.image : subject.image;
  return (
    <div className={`absolute left-0 top-full z-50 mt-2 hidden w-64 rounded-lg border border-violet-200 bg-white p-3 text-left shadow-xl group-hover:block ${compact ? "block" : ""}`}>
      <div className="flex gap-3">{image ? <img src={image} alt="" className="h-16 w-12 shrink-0 rounded object-cover" referrerPolicy="no-referrer" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-violet-50 text-violet-600"><Volume2 className="h-5 w-5" /></div>}<div className="min-w-0"><p className="text-xs font-bold text-slate-800">{subject.name}</p><p className="mt-1 text-[11px] leading-5 text-slate-600">{subject.description}</p></div></div>
    </div>
  );
}

function SubjectTag({ subject, productImages, removable = false, onRemove }: { subject: CreativeSubject; productImages: ProductSelection[]; removable?: boolean; onRemove?: () => void }) {
  return (
    <span className="group relative inline-flex shrink-0 items-center gap-1 rounded bg-violet-50 px-1.5 py-1 text-[11px] font-semibold text-violet-700">
      {subject.kind === "narrator" ? <Volume2 className="h-3 w-3" /> : subject.kind === "product" ? <Package className="h-3 w-3" /> : subject.image ? <img src={subject.image} alt="" className="h-4 w-4 rounded object-cover" referrerPolicy="no-referrer" /> : null}
      {subject.name}
      {removable && <button onClick={onRemove} title={`移除${subject.name}`} className="ml-0.5 flex h-4 w-4 items-center justify-center rounded text-violet-400 hover:bg-violet-100 hover:text-rose-600"><X className="h-3 w-3" /></button>}
      <SubjectTooltip subject={subject} productImages={productImages} />
    </span>
  );
}

function StoryboardLineEditor({ type, text, subjects, subjectIds, productImages, onTextChange, onSubjectsChange }: { type: "dialogue" | "visual"; text: string; subjects: CreativeSubject[]; subjectIds: string[]; productImages: ProductSelection[]; onTextChange: (text: string) => void; onSubjectsChange?: (subjectIds: string[]) => void }) {
  const [mentionOpen, setMentionOpen] = useState(false);
  const selectedSubjects = subjectIds.map((id) => subjects.find((subject) => subject.id === id)).filter((subject): subject is CreativeSubject => Boolean(subject));
  const availableSubjects = subjects.filter((subject) => !subjectIds.includes(subject.id));
  return (
    <div className="relative flex min-h-[86px] items-start gap-2 border-t border-slate-100 p-3 first:border-t-0">
      <div className="flex max-w-[42%] flex-wrap gap-1">{selectedSubjects.map((subject) => <SubjectTag key={subject.id} subject={subject} productImages={productImages} removable={type === "visual"} onRemove={() => onSubjectsChange?.(subjectIds.filter((id) => id !== subject.id))} />)}</div>
      <textarea
        aria-label={type === "dialogue" ? "人物台词" : "画面描述"}
        value={text}
        onChange={(event) => {
          const value = event.target.value;
          onTextChange(value);
          setMentionOpen(type === "visual" && /@[^@\s]*$/.test(value));
        }}
        onKeyDown={(event) => { if (event.key === "Escape") setMentionOpen(false); }}
        rows={3}
        className="min-h-[72px] min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 text-xs leading-6 text-slate-600 outline-none [field-sizing:content]"
      />
      {type === "visual" && mentionOpen && (
        <div className="absolute left-3 top-[72px] z-40 w-48 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
          <p className="px-2 py-1 text-[10px] text-slate-400">选择当前创意主体</p>
          {availableSubjects.length ? availableSubjects.map((subject) => <button key={subject.id} onClick={() => { onTextChange(text.replace(/@[^@\s]*$/, "")); onSubjectsChange?.([...subjectIds, subject.id]); setMentionOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-slate-700 hover:bg-violet-50"><AtSign className="h-3.5 w-3.5 text-violet-500" />{subject.name}</button>) : <p className="px-2 py-2 text-xs text-slate-400">当前主体均已关联</p>}
        </div>
      )}
    </div>
  );
}

function SubjectDetailPanel({ subject, draft, productName, voiceEditorOpen, voiceDraft, onBack, onApply, onVoiceDraftChange, onToggleVoiceEditor, onAddVoice, onSelectVoice, onAddImage, onReplaceImage, onDeleteImage }: { subject: CreativeSubject; draft: { subjectId: string; productImages: ProductSelection[]; voices: VoiceOption[]; activeVoiceId?: string }; productName: string; voiceEditorOpen: boolean; voiceDraft: string; onBack: () => void; onApply: () => void; onVoiceDraftChange: (value: string) => void; onToggleVoiceEditor: () => void; onAddVoice: () => void; onSelectVoice: (id: string) => void; onAddImage: () => void; onReplaceImage: (index: number) => void; onDeleteImage: (index: number) => void }) {
  const isProduct = subject.kind === "product";
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4"><button onClick={onBack} title="返回分镜脚本" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /></button><div><h3 className="text-base font-bold text-slate-900">{isProduct ? productName : `${subject.name}设定`}</h3><p className="mt-1 text-xs text-slate-400">仅修改当前创意</p></div></div>
      {isProduct ? (
        <div className="p-5">
          <div className="flex items-center justify-between"><div><h4 className="text-sm font-bold text-slate-900">商品参考图 <span className="font-normal text-slate-400">{draft.productImages.length}/6</span></h4><p className="mt-1 text-xs text-slate-400">至少保留一张商品参考图</p></div>{draft.productImages.length < 6 && <button onClick={onAddImage} className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"><Plus className="h-3.5 w-3.5" />添加参考图</button>}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{draft.productImages.map((image, index) => <article key={`${image.id}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"><img src={image.image} alt={image.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" /><div className="absolute inset-0 flex items-start justify-end gap-1.5 bg-slate-900/0 p-2 opacity-0 transition group-hover:bg-slate-900/20 group-hover:opacity-100"><button onClick={() => onDeleteImage(index)} title={draft.productImages.length <= 1 ? "至少保留一张图片" : "删除图片"} className="flex h-7 w-7 items-center justify-center rounded bg-slate-900/75 text-white hover:bg-rose-600"><Trash2 className="h-3.5 w-3.5" /></button><button onClick={() => onReplaceImage(index)} title="替换图片" className="flex h-7 w-7 items-center justify-center rounded bg-slate-900/75 text-white hover:bg-violet-600"><RefreshCw className="h-3.5 w-3.5" /></button></div></article>)}</div>
        </div>
      ) : (
        <div className={`grid gap-5 p-5 ${subject.kind === "person" ? "xl:grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-1"}`}>
          {subject.kind === "person" && <img src={subject.image} alt={subject.name} className="aspect-[3/4] w-full rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" />}
          <div className="min-w-0"><section className="rounded-lg border border-slate-200 bg-slate-50 p-4"><h4 className="text-xs font-bold text-slate-800">{subject.kind === "person" ? "形象描述" : "旁白描述"}</h4><p className="mt-2 text-xs leading-6 text-slate-600">{subject.description}</p></section><div className="mt-5 flex items-center justify-between"><h4 className="text-sm font-bold text-slate-900">音色</h4><button onClick={onToggleVoiceEditor} className="text-xs font-semibold text-violet-700 hover:text-violet-800">编辑音色</button></div><div className="mt-3 flex flex-wrap gap-2">{draft.voices.map((voice) => <button key={voice.id} onClick={() => onSelectVoice(voice.id)} className={`min-w-[108px] rounded-lg border px-4 py-3 text-left ${draft.activeVoiceId === voice.id ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-200"}`}><span className="text-xs font-bold text-slate-700">{voice.name}</span><span className="mt-1 block max-w-[180px] truncate text-[10px] text-slate-400">{voice.description}</span></button>)}</div>{draft.activeVoiceId && <section className="mt-3 rounded-lg border border-slate-200 p-4"><div className="flex items-center justify-between"><h4 className="text-xs font-bold text-slate-800">音色描述</h4><button title="试听音色" className="flex h-7 w-7 items-center justify-center rounded bg-violet-50 text-violet-700"><Volume2 className="h-3.5 w-3.5" /></button></div><p className="mt-2 text-xs leading-6 text-slate-600">{draft.voices.find((voice) => voice.id === draft.activeVoiceId)?.description}</p></section>}{voiceEditorOpen && <section className="mt-3 rounded-lg border border-violet-200 bg-violet-50/30 p-3"><textarea value={voiceDraft} onChange={(event) => onVoiceDraftChange(event.target.value)} placeholder="描述希望生成的音色，例如：年轻女性，表达自然，语速稍快" rows={3} className="w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-xs leading-6 outline-none focus:border-violet-400" /><div className="mt-2 flex justify-end"><button disabled={!voiceDraft.trim()} onClick={onAddVoice} className="rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">生成音色</button></div></section>}</div>
        </div>
      )}
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button onClick={onBack} className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">取消</button><button onClick={onApply} disabled={isProduct && !draft.productImages.length} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:bg-slate-200">应用</button></div>
    </section>
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

function EditablePromptText({ editorRef, value, onChange, placeholder, inline }: { editorRef?: React.RefObject<HTMLSpanElement | null>; value: string; onChange: (value: string) => void; placeholder: string; inline: boolean }) {
  const internalRef = useRef<HTMLSpanElement | null>(null);
  const ref = editorRef || internalRef;

  useEffect(() => {
    const element = ref.current;
    if (!element || document.activeElement === element || element.textContent === value) return;
    element.textContent = value;
  }, [value]);

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="发送给 Agent"
      data-placeholder={placeholder}
      onInput={(event) => onChange(event.currentTarget.textContent || "")}
      className={`${inline ? "inline-block min-w-0" : "block w-full min-h-[112px]"} whitespace-pre-wrap break-words outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]`}
    />
  );
}

function SelectionChip({ icon: Icon, prefix, label, image, onRemove, compact = false }: { icon: React.ComponentType<{ className?: string }>; prefix?: string; label: string; image?: string; onRemove: () => void; compact?: boolean }) {
  return (
    <span className={`group inline-flex ${compact ? "h-8" : "h-9"} max-w-[280px] items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-2 text-xs font-semibold text-violet-700`}>
      {!image && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {prefix && <span className="shrink-0">{prefix}</span>}
      {image && <img src={image} alt="" className={`${compact ? "h-5 w-5" : "h-6 w-6"} shrink-0 rounded object-cover`} referrerPolicy="no-referrer" />}
      <span className="truncate">{label}</span>
      <button onClick={onRemove} title="移除" className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-violet-400 hover:bg-violet-100 hover:text-violet-700"><X className="h-3 w-3" /></button>
    </span>
  );
}

function HomeMenuButton({ icon: Icon, label, active, disabled = false, disabledHint, onClick, children }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; disabled?: boolean; disabledHint?: string; onClick: () => void; children?: React.ReactNode }) {
  return (
    <div className="group/menu relative">
      <button disabled={disabled} onClick={onClick} className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 font-semibold transition-colors ${disabled ? "cursor-not-allowed text-slate-300" : active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-100"}`}><Icon className="h-3.5 w-3.5" /><span className="max-w-[120px] truncate">{label}</span></button>
      {disabled && disabledHint && <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover/menu:block">{disabledHint}<span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-800" /></span>}
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

function ProductImageModal({ existingCount, mode = "add", excludedIds = [], onClose, onConfirm, showToast }: { existingCount: number; mode?: "add" | "replace"; excludedIds?: string[]; onClose: () => void; onConfirm: (images: ProductSelection[]) => void; showToast: (message: string) => void }) {
  const [tab, setTab] = useState<"library" | "local">("library");
  const [selected, setSelected] = useState<ProductSelection[]>([]);
  const [primaryCategory, setPrimaryCategory] = useState("全部一级分类");
  const [secondaryCategory, setSecondaryCategory] = useState("全部二级分类");
  const [tag, setTag] = useState("全部标签");
  const [status, setStatus] = useState("全部状态");
  const [author, setAuthor] = useState("全部上传人");
  const [onlyMine, setOnlyMine] = useState(false);
  const [search, setSearch] = useState("");
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const capacity = mode === "replace" ? 1 : Math.max(0, 6 - existingCount);
  const filtered = IMAGE_LIBRARY.filter((item) =>
    !excludedIds.includes(item.id) &&
    (primaryCategory === "全部一级分类" || item.primaryCategory === primaryCategory) &&
    (secondaryCategory === "全部二级分类" || item.secondaryCategory === secondaryCategory) &&
    (tag === "全部标签" || item.tags?.includes(tag)) &&
    (status === "全部状态" || item.status === status) &&
    (author === "全部上传人" || item.author === author) &&
    (!onlyMine || item.author === "徐振") &&
    `${item.name}${item.id}${item.primaryCategory}${item.secondaryCategory}${item.tags?.join("")}`.toLowerCase().includes(search.toLowerCase())
  );
  const toggle = (item: ProductSelection) => {
    if (selected.some((image) => image.id === item.id)) {
      setSelected((current) => current.filter((image) => image.id !== item.id));
      return;
    }
    if (selected.length >= capacity) {
      if (mode === "replace") return setSelected([item]);
      return showToast("商品图片最多上传 6 张");
    }
    setSelected((current) => [...current, item]);
  };
  const localUpload = async (files?: FileList | null) => {
    if (!files?.length) return;
    const remaining = mode === "replace" ? 1 : capacity - selected.length;
    if (remaining <= 0) return showToast("商品图片最多上传 6 张");
    const accepted: ProductSelection[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!/\.(jpe?g|png|webp|bmp|tiff?|gif)$/i.test(file.name)) {
        showToast("仅支持 jpeg、png、webp、bmp、tiff、gif 格式");
        continue;
      }
      if (file.size >= 30 * 1024 * 1024) {
        showToast("单张图片需小于 30MB");
        continue;
      }
      const imageUrl = URL.createObjectURL(file);
      const dimensions = await new Promise<{ width: number; height: number } | null>((resolve) => {
        const image = new window.Image();
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => resolve(null);
        image.src = imageUrl;
      });
      if (!dimensions || dimensions.width < 300 || dimensions.width > 6000 || dimensions.height < 300 || dimensions.height > 6000 || dimensions.width / dimensions.height < 0.4 || dimensions.width / dimensions.height > 2.5) {
        URL.revokeObjectURL(imageUrl);
        showToast("图片尺寸或宽高比不符合要求");
        continue;
      }
      accepted.push({ id: `product-local-${Date.now()}-${accepted.length}`, name: file.name, image: imageUrl, source: "local", status: "本地文件", author: "当前用户", size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, resolution: `${dimensions.width}x${dimensions.height}` });
    }
    if (files.length > remaining) showToast(`本次最多还可添加 ${remaining} 张商品图`);
    setSelected((current) => mode === "replace" ? accepted.slice(0, 1) : [...current, ...accepted]);
    if (uploadRef.current) uploadRef.current.value = "";
  };
  return <ModalFrame title={mode === "replace" ? "替换参考图" : "添加商品图"} onClose={onClose} width="max-w-6xl" footer={<><div className="mr-auto text-xs text-slate-500">已选 <b className="text-violet-700">{selected.length}</b> 张{mode === "add" ? ` · 还可添加 ${capacity - selected.length} 张` : ""}</div><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!selected.length} onClick={() => onConfirm(selected)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">{mode === "replace" ? "确认替换" : "确认选择"}</button></>}>
    <div className="p-5">
      <div className="mb-5 flex items-center gap-1 border-b border-slate-200">
        <button onClick={() => setTab("library")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "library" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>图片管理</button>
        <button onClick={() => setTab("local")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "local" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>本地上传</button>
      </div>
      {tab === "library" ? <>
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-[130px_130px_130px_130px_minmax(180px,1fr)_auto]">
          <select value={primaryCategory} onChange={(event) => setPrimaryCategory(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部一级分类</option><option>美妆护肤</option><option>服饰内衣</option><option>日用百货</option><option>食品饮料</option></select>
          <select value={secondaryCategory} onChange={(event) => setSecondaryCategory(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部二级分类</option><option>商品主图</option><option>模特展示</option><option>成分展示</option><option>效果对比</option></select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部标签</option><option>产品实拍</option><option>对比实测</option><option>高端质感</option></select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部状态</option><option>审核通过</option><option>待审核</option><option>未审核</option></select>
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索图片名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-violet-400" /></div>
          <label className="flex h-9 items-center gap-2 whitespace-nowrap px-2 text-xs text-slate-600"><input type="checkbox" checked={onlyMine} onChange={(event) => setOnlyMine(event.target.checked)} className="accent-violet-600" />仅看我的</label>
        </div>
        <div className="mb-3 flex justify-end"><select value={author} onChange={(event) => setAuthor(event.target.value)} className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部上传人</option><option>徐振</option><option>致上互娱</option><option>汤小真</option><option>美妆设计组</option></select></div>
        <div className="overflow-x-auto rounded-md border border-slate-200"><table className="min-w-[860px] w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">图片缩略图</th><th className="px-3 py-3">文件名称 / ID</th><th className="px-3 py-3">状态</th><th className="px-3 py-3">分类 / 标签</th><th className="px-3 py-3">上传人</th><th className="px-3 py-3">分辨率</th><th className="px-3 py-3">大小</th></tr></thead><tbody>{filtered.map((item) => { const checked = selected.some((image) => image.id === item.id); return <tr key={item.id} onClick={() => toggle(item)} className={`cursor-pointer border-t border-slate-100 ${checked ? "bg-violet-50" : "hover:bg-slate-50"}`}><td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>{checked && <Check className="h-2.5 w-2.5" />}</span></td><td className="px-3 py-2"><img src={item.image} alt="" className="h-12 w-12 rounded object-cover" referrerPolicy="no-referrer" /></td><td className="max-w-[220px] px-3 py-3"><p className="truncate font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td><td className="px-3 py-3"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{item.status}</span></td><td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.primaryCategory} / {item.secondaryCategory}</p><p className="mt-1 text-[10px] text-slate-400">{item.tags?.join("、")}</p></td><td className="px-3 py-3 text-slate-500">{item.author}</td><td className="px-3 py-3 text-slate-500">{item.resolution}</td><td className="px-3 py-3 text-slate-500">{item.size}</td></tr>; })}</tbody></table></div>
      </> : <div>
        <button onClick={() => uploadRef.current?.click()} className="flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-violet-400 hover:text-violet-700"><Upload className="h-6 w-6" /><span className="mt-3 text-xs font-semibold">点击选择本地图片</span></button>
        <input ref={uploadRef} type="file" multiple={mode === "add"} accept=".jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,.gif,image/*" className="hidden" onChange={(event) => localUpload(event.target.files)} />
        <p className="mt-3 text-center text-xs leading-6 text-slate-400">支持上传本地图片文件，图片格式：jpeg、 png、 webp、 bmp、 tiff、 gif，单张图片大小≤30MB。<br />图片宽高比需在 (0.4, 2.5) 之间，宽高像素需在 (300px, 6000px) 之间。<br />仅支持上传非人脸图，请仔细查看要求并确保上传素材为您原创或已取得合法授权。</p>
        {selected.some((item) => item.source === "local") && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{selected.filter((item) => item.source === "local").map((item) => <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 p-2"><img src={item.image} alt="" className="h-11 w-11 rounded object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.resolution} · {item.size}</p></div><button onClick={() => toggle(item)} title="删除" className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>}
      </div>}
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
  const [tab, setTab] = useState<"manual" | "library">("manual");
  const [manualText, setManualText] = useState(selected?.source === "manual" ? selected.name : "");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ScriptSelection | null>(selected?.source === "library" ? selected : null);
  const filtered = SCRIPT_OPTIONS.filter((item) => `${item.name}${item.id}${item.category}`.toLowerCase().includes(search.toLowerCase()));
  const confirm = () => {
    if (tab === "manual" && manualText.trim()) {
      onConfirm({ id: `manual-${Date.now()}`, name: manualText.trim(), category: "手动输入", status: "当前输入", author: "当前用户", updatedAt: nowText(), source: "manual" });
      return;
    }
    if (tab === "library" && draft) onConfirm(draft);
  };
  const canConfirm = tab === "manual" ? Boolean(manualText.trim()) : Boolean(draft);
  return <ModalFrame title="添加脚本" onClose={onClose} width="max-w-4xl" footer={<><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!canConfirm} onClick={confirm} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认</button></>}>
    <div className="p-5">
      <div className="mb-5 flex items-center gap-1 border-b border-slate-200"><button onClick={() => setTab("manual")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "manual" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>输入脚本</button><button onClick={() => setTab("library")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${tab === "library" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>脚本管理</button></div>
      {tab === "manual" ? <div className="relative"><textarea value={manualText} maxLength={1000} onChange={(event) => setManualText(event.target.value)} rows={14} placeholder="请输入脚本内容" className="w-full resize-none rounded-md border border-slate-200 p-4 pb-9 text-sm leading-7 outline-none focus:border-violet-400" /><span className="absolute bottom-3 right-3 text-[11px] text-slate-400">{manualText.length}/1000</span></div> : <>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_160px_160px]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索脚本名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none" /></div><select className="rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部分类</option><option>个护家清</option><option>服饰内衣</option></select><select className="rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部状态</option><option>审核通过</option><option>待审核</option></select></div>
        <div className="overflow-x-auto rounded-md border border-slate-200"><table className="min-w-[720px] w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">脚本名称 / ID</th><th className="px-3 py-3">分类</th><th className="px-3 py-3">状态</th><th className="px-3 py-3">上传人</th><th className="px-3 py-3">更新时间</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => setDraft(item)} className={`cursor-pointer border-t border-slate-100 ${draft?.id === item.id ? "bg-violet-50" : "hover:bg-slate-50"}`}><td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded-full border ${draft?.id === item.id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>{draft?.id === item.id && <Check className="h-2.5 w-2.5" />}</span></td><td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td><td className="px-3 py-3 text-slate-500">{item.category}</td><td className="px-3 py-3"><span className="rounded bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">{item.status}</span></td><td className="px-3 py-3 text-slate-500">{item.author}</td><td className="px-3 py-3 text-slate-400">{item.updatedAt}</td></tr>)}</tbody></table></div>
      </>}
    </div>
  </ModalFrame>;
}

function SourceSelectorModal({ selected, onClose, onConfirm, showToast }: { selected: SourceVideoSelection[]; onClose: () => void; onConfirm: (items: SourceVideoSelection[]) => void; showToast: (message: string) => void }) {
  const [draft, setDraft] = useState(selected);
  const [sourceTab, setSourceTab] = useState<"library" | "local">("library");
  const [sectionTab, setSectionTab] = useState<"全部" | "成片" | "素材">("全部");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("全部状态");
  const [author, setAuthor] = useState("全部上传人");
  const [onlyMine, setOnlyMine] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const totalSeconds = draft.reduce((sum, item) => sum + item.durationSeconds, 0);
  const filtered = SOURCE_VIDEOS.filter((item) => (sectionTab === "全部" || item.section === sectionTab) && (status === "全部状态" || item.status === status) && (author === "全部上传人" || item.author === author) && (!onlyMine || item.author === "徐振") && `${item.name}${item.id}${item.category}${item.tags.join("")}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = (item: SourceVideoSelection) => {
    if (draft.some((video) => video.id === item.id)) return setDraft(draft.filter((video) => video.id !== item.id));
    if (draft.length >= 100) return showToast("视频原料不能超过 100 个文件");
    if (totalSeconds + item.durationSeconds > 600) return showToast("视频原料合计时长不能超过 10 分钟");
    setDraft([...draft, item]);
  };
  const uploadLocal = (files?: FileList | null) => {
    if (!files?.length) return;
    const accepted: SourceVideoSelection[] = [];
    let nextSeconds = totalSeconds;
    let nextCount = draft.length;
    for (const file of Array.from(files)) {
      if (!/\.(mp4|mpeg|mov)$/i.test(file.name)) {
        showToast("原料仅支持 mp4、mpeg、mov 格式");
        continue;
      }
      if (file.size >= 1000 * 1024 * 1024) {
        showToast("单个视频需小于 1000MB");
        continue;
      }
      const assumedDuration = 30;
      if (nextCount >= 100 || nextSeconds + assumedDuration > 600) {
        showToast("视频原料最多 100 个，合计时长不超过 10 分钟");
        break;
      }
      accepted.push({ id: `local-${Date.now()}-${accepted.length}`, name: file.name, cover: SAMPLE_COVERS[(draft.length + accepted.length) % SAMPLE_COVERS.length], status: "本地文件", section: "本地上传", category: "本地上传", author: "当前用户", durationSeconds: assumedDuration, duration: "00:30", size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, tags: [] });
      nextCount += 1;
      nextSeconds += assumedDuration;
    }
    setDraft((current) => [...current, ...accepted]);
    if (uploadRef.current) uploadRef.current.value = "";
  };
  const localItems = draft.filter((item) => item.section === "本地上传");
  return <ModalFrame title="添加原料" onClose={onClose} width="max-w-6xl" footer={<><div className="mr-auto text-xs text-slate-500">已选 <b className="text-violet-700">{draft.length}</b> / 100 个 · 总时长 <b className="text-violet-700">{Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, "0")}</b> / 10:00</div><button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">取消</button><button disabled={!draft.length} onClick={() => onConfirm(draft)} className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">确认选择</button></>}>
    <div className="p-5">
      <div className="mb-5 flex items-center gap-1 border-b border-slate-200"><button onClick={() => setSourceTab("library")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${sourceTab === "library" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>资源库</button><button onClick={() => setSourceTab("local")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${sourceTab === "local" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>本地上传</button></div>
      {sourceTab === "library" ? <>
        <div className="mb-4 flex items-center gap-1 border-b border-slate-200">{(["全部", "成片", "素材"] as const).map((item) => <button key={item} onClick={() => setSectionTab(item)} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${sectionTab === item ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}>{item}</button>)}</div>
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-[130px_130px_130px_130px_minmax(180px,1fr)_auto]"><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部一级分类</option><option>服饰内衣</option><option>美妆护肤</option><option>日用百货</option></select><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部二级分类</option><option>商品实拍</option><option>面料展示</option><option>厨房用品</option></select><select className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部标签</option><option>产品实拍</option><option>对比实测</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部状态</option><option>审核通过</option><option>待审核</option><option>未审核</option><option>审核驳回</option></select><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索文件名称或 ID" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none" /></div><label className="flex h-9 items-center gap-2 whitespace-nowrap px-2 text-xs text-slate-600"><input type="checkbox" checked={onlyMine} onChange={(event) => setOnlyMine(event.target.checked)} className="accent-violet-600" />仅看我的</label></div>
        <div className="mb-3 flex justify-end"><select value={author} onChange={(event) => setAuthor(event.target.value)} className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-600"><option>全部上传人</option><option>徐振</option><option>刘弯</option><option>张小花</option><option>梁浩然</option><option>赵铁柱</option></select></div>
        <div className="overflow-x-auto rounded-md border border-slate-200"><table className="min-w-[900px] w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">文件缩略图</th><th className="px-3 py-3">文件名称 / ID</th><th className="px-3 py-3">状态</th><th className="px-3 py-3">所在分类</th><th className="px-3 py-3">上传人</th><th className="px-3 py-3">时长</th><th className="px-3 py-3">大小</th></tr></thead><tbody>{filtered.map((item) => { const checked = draft.some((video) => video.id === item.id); return <tr key={item.id} onClick={() => toggle(item)} className={`cursor-pointer border-t border-slate-100 ${checked ? "bg-violet-50" : "hover:bg-slate-50"}`}><td className="px-4 py-3"><span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"}`}>{checked && <Check className="h-2.5 w-2.5" />}</span></td><td className="px-3 py-2"><img src={item.cover} alt="" className="h-10 w-16 rounded object-cover" referrerPolicy="no-referrer" /></td><td className="max-w-[220px] px-3 py-3"><p className="truncate font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.id}</p></td><td className="px-3 py-3"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{item.status}</span></td><td className="px-3 py-3"><p className="font-semibold text-slate-700">{item.section}</p><p className="mt-1 text-[10px] text-slate-400">{item.category}</p></td><td className="px-3 py-3 text-slate-500">{item.author}</td><td className="px-3 py-3 text-slate-500">{item.duration}</td><td className="px-3 py-3 text-slate-500">{item.size}</td></tr>; })}</tbody></table></div>
      </> : <div>
        <button onClick={() => uploadRef.current?.click()} className="flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-violet-400 hover:text-violet-700"><Upload className="h-6 w-6" /><span className="mt-3 text-xs font-semibold">点击选择本地视频</span></button>
        <input ref={uploadRef} type="file" multiple accept=".mp4,.mpeg,.mov,video/mp4,video/mpeg,video/quicktime" className="hidden" onChange={(event) => uploadLocal(event.target.files)} />
        <p className="mt-3 text-center text-xs leading-6 text-slate-400">视频格式: mp4、mpeg、mov,宽高无限制, 大小&lt;1000M<br />建议1280*720&lt;尺寸&lt;3840*2160, 2s&lt;时长&lt;600s<br />*尺寸超出建议范围可能导致生成时间超长或效果不佳<br />请确保您上传素材为您原创或已取得合法授权</p>
        {localItems.length > 0 && <div className="mt-4 space-y-2">{localItems.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-md border border-slate-200 p-2.5"><img src={item.cover} alt="" className="h-11 w-16 rounded object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.duration} · {item.size}</p></div><button onClick={() => toggle(item)} title="删除" className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>}
      </div>}
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
