import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  Video, 
  Settings, 
  Play, 
  Upload, 
  Plus, 
  FileText, 
  Check, 
  ArrowUp, 
  ArrowLeft, 
  ChevronRight, 
  Layers, 
  Smile, 
  Trash2, 
  Edit, 
  Sliders, 
  RefreshCw, 
  Download, 
  Share2, 
  Image as ImageIcon,
  HelpCircle,
  Scissors,
  Clapperboard,
  FileVideo,
  ExternalLink,
  MessageSquare,
  UserCheck,
  X
} from "lucide-react";
import { Task, GalleryItem, Asset } from "../types";

interface AgentCreationViewProps {
  credits: number;
  onAddTask: (
    type: "detail_set" | "watermark" | "subtitle" | "enhance" | "video_gen" | "image_gen" | "fission",
    name: string,
    inputFiles: string[],
    creditsCost: number
  ) => void;
  onBack: () => void;
}

type StepType = "analysis" | "script" | "preview" | "final";

// Mock Database for Products and Assets
const PRESET_PRODUCTS = [
  {
    id: "p1",
    name: "官方正品 玻璃油膜擦",
    industry: "汽车-汽车售后市场-美容维修/汽保工具",
    category: "汽车用品-美容维修/汽保工具-车用清洗/除蜡/除胶剂",
    image: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?w=400&auto=format&fit=crop",
    sellingPoints: [
      "强力去油膜，告别炫光",
      "速净无残留，玻璃透亮",
      "不伤车漆，持久防雨防雾",
      "使用简单，自带海绵擦拭头"
    ],
    painPoints: [
      "汽车玻璃油膜严重，影响夜间/雨天驾驶视线",
      "雨天雨刮器越刮越模糊，存在严重驾驶安全隐患",
      "传统去油膜打蜡方法费时费力，操作繁琐",
      "普通玻璃清洗剂无法彻底清除顽固化学油污"
    ],
    targetUsers: "所有车主、经常夜间驾驶者、雨季地区驾驶员、爱车DIY保养群体",
    scenarios: "雨天行车视线受阻、夜间对向车灯炫光严重、长期露天停放受油烟污染的汽车",
    specs: "150ml/瓶 附带专用擦拭布和精细研磨海绵",
    discount: "今日下单享【买一送一】，送汽车车窗防雾喷剂，限时立减20元！"
  },
  {
    id: "p2",
    name: "日系极简 氨基酸洁面乳",
    industry: "美妆个护-面部清洁-洗面奶",
    category: "个护化妆-面部清洁-洁面乳/洁面膏",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop",
    sellingPoints: [
      "高纯度双重氨基酸，温和清洁不紧绷",
      "微米级细腻泡沫，深层净透毛孔污垢",
      "添加积雪草提取物，舒缓修护受损屏障",
      "无香精无色素，敏感肌专研安全配方"
    ],
    painPoints: [
      "普通洗面奶清洁过度，导致面部红肿脱皮、紧绷难受",
      "油性皮肤毛孔粗大、黑头反复，洗不干净",
      "敏感肌肤角质层薄，使用刺激性产品容易过敏发红"
    ],
    targetUsers: "精致白领、18-35岁男女群体、敏感肌肤人群、干性与混油皮患者",
    scenarios: "晨间温和洁面、晚间卸妆残留二次清洁、换季敏感期维稳洁肤",
    specs: "120g/支",
    discount: "限时买二赠一，领券立减15元，加赠旅行体验装！"
  }
];

interface SubStyle {
  name: string;
  videoUrl: string;
  caseTitle: string;
}

interface StyleCategory {
  name: string;
  coreVisual: string;
  subDirections: SubStyle[];
  suitedCategories: string;
  placementTarget: string;
}

const STYLE_CATEGORIES: StyleCategory[] = [
  {
    name: "品牌高级质感风",
    coreVisual: "精致柔光 + 低饱和统一色调 + 极简构图 + 大量留白，重点突出产品肌理与质感，画面干净无冗余元素。光影考究（常用蝴蝶光、侧逆光勾勒轮廓），多采用慢镜头、电影级运镜，整体精致度与高级感拉满。",
    suitedCategories: "高客单价护肤 / 美妆、珠宝腕表、高端家电、轻奢服饰、香氛、奢侈品",
    placementTarget: "用于品牌形象塑造、高净值人群破圈、拉升产品溢价，适合品牌广告与精准人群千川投放；缺点是硬广感较强，泛流量下完播率偏低。",
    subDirections: [
      { name: "轻奢极简风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4", caseTitle: "《逆龄紧致精华》奢华极简推介" },
      { name: "院线专业风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-medical-professional-holding-syringe-41716-large.mp4", caseTitle: "《科学实验室》专业配方严选" },
      { name: "高端商务风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-smart-watch-41715-large.mp4", caseTitle: "《黑曜智能旗舰》商务精英臻选" },
      { name: "侘寂质感风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-exterior-42861-large.mp4", caseTitle: "《自然木意》侘寂生活美学" }
    ]
  },
  {
    name: "街拍生活氛围感",
    coreVisual: "户外自然光影 + 动态抓拍感 + 城市 / 自然街景，画面松弛有呼吸感，色调多为暖调胶片感或清透日系感。不刻意摆拍，主打 “随手拍的日常美感”，人物状态自然松弛。",
    suitedCategories: "服饰鞋包、配饰墨镜、防晒用品、便携数码、茶饮、户外装备",
    placementTarget: "穿搭、生活类种草素材的核心风格，用户代入感强、完播率高，是服饰、配饰类目的跑量主力风格。",
    subDirections: [
      { name: "都市通勤风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4", caseTitle: "《真丝赫本裙》都市通勤魅力" },
      { name: "美式复古街拍", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-night-shoot-32213-large.mp4", caseTitle: "《霓虹幻彩》美式街头复古走秀" },
      { name: "Citywalk 日常感", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-running-shoes-being-tied-41711-large.mp4", caseTitle: "《漫步巴黎》经典帆布鞋Citywalk" },
      { name: "日系治愈街景", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-walking-down-a-busy-city-street-41718-large.mp4", caseTitle: "《东京漫步》晴空治愈随行拍" },
      { name: "户外露营风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-friends-toasting-marshmallows-over-a-campfire-41719-large.mp4", caseTitle: "《旷野营地》多功能户外保暖装" }
    ]
  },
  {
    name: "居家原生生活感",
    coreVisual: "真实居家场景（客厅、厨房、卧室、浴室）+ 自然光为主 + 生活化细节痕迹，构图随意自然，无刻意精致布景，画面 “不完美但真实”，主打普通人的日常代入感。",
    suitedCategories: "家居清洁、日用百货、小家电、食品零食、母婴用品、洗护用品",
    placementTarget: "全品类通用的跑量风格，生活化场景天然降低广告感，用户信任度高、转化稳定，是剧情种草、好物分享类素材的首选。",
    subDirections: [
      { name: "温馨治愈居家风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-her-living-room-41611-large.mp4", caseTitle: "《温暖午后》宅家办公好物分享" },
      { name: "沉浸式宅家风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cozy-living-room-with-a-burning-fireplace-43093-large.mp4", caseTitle: "《壁炉夜话》极度舒适加湿器测试" },
      { name: "厨房烟火气", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4", caseTitle: "《大厨美味》高纯铁不粘锅实炒" },
      { name: "浴室洗漱日常", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-creme-on-her-face-in-bathroom-41717-large.mp4", caseTitle: "《清晨唤醒》温和洁面慕斯测评" },
      { name: "租房改造风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-living-room-interior-design-with-plants-41720-large.mp4", caseTitle: "《一平米治愈》绿植架收纳改造" }
    ]
  },
  {
    name: "硬核实测真实感",
    coreVisual: "近距离怼拍产品 + 原相机直出质感 + 无多余修饰，光线直白甚至略显 “粗糙”，全程无明显剪辑感。画面优先级完全让位于效果展示，主打 “眼见为实” 的说服力。",
    suitedCategories: "功能性清洁品、美妆遮瑕 / 底妆、五金工具、汽车用品、防水耐磨产品、建材",
    placementTarget: "高转化、高 ROI 的核心素材风格，用直观效果戳中痛点，信任度极强；缺点是开头钩子弱时完播率偏低，需配合强痛点文案。",
    subDirections: [
      { name: "暴力测试风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-smart-watch-with-black-screen-40503-large.mp4", caseTitle: "《硬核抗震》军工智能手表锤击" },
      { name: "原相机测评风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-smartphone-screen-display-41721-large.mp4", caseTitle: "《强光不反光》抗蓝光钢化膜原相机实拍" },
      { name: "实验室专业风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chemist-mixing-chemicals-in-a-lab-41722-large.mp4", caseTitle: "《10倍去渍》多功能清洁剂化学反应实测" },
      { name: "工地 / 户外硬核风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-construction-worker-at-a-site-41723-large.mp4", caseTitle: "《防水耐刮》防爆级安全工装实战" }
    ]
  },
  {
    name: "口播原生纪实感",
    coreVisual: "近景大头构图 + 普通背景（白墙 / 居家 / 办公室）+ 自然打光，无精致妆造与专业布景，接近普通人随手拍的分享视频，“素人感”“真实感” 拉满。",
    suitedCategories: "全品类通吃，尤其美妆护肤、食品保健品、知识付费、日用百货",
    placementTarget: "最低成本、最高产能的铺量风格，制作周期短、可批量复制，是千川矩阵号、多账号跑量的核心素材；缺点是同质化严重，需强话术钩子留人。",
    subDirections: [
      { name: "素人分享风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-the-camera-40291-large.mp4", caseTitle: "《闺蜜悄悄话》熬夜党气色好物实拍" },
      { name: "博主种草风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-camera-recording-vlog-41724-large.mp4", caseTitle: "《美妆博主》夏日持妆底油保姆级解析" },
      { name: "专家科普风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-teacher-explaining-formulas-on-a-whiteboard-41725-large.mp4", caseTitle: "《营养学教授》代餐粉选购避坑指南" },
      { name: "办公室闲聊风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coworkers-chatting-at-the-office-41726-large.mp4", caseTitle: "《打工人午休》办公室必备护腰垫安利" },
      { name: "宝妈真实反馈", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-happy-mother-playing-with-her-baby-in-bed-41727-large.mp4", caseTitle: "《育儿日常》抑菌亲肤纯棉尿布推荐" }
    ]
  },
  {
    name: "国潮东方美学风",
    coreVisual: "中式传统元素 + 对称构图 + 柔和漫射光，色调以传统色系为主，搭配水墨、木纹、瓷器、宣纸等道具，主打东方雅致意境与文化氛围感。",
    suitedCategories: "国风美妆、草本护肤、茶叶茶具、中式家居、汉服配饰、滋补养生品",
    placementTarget: "精准触达国风人群，强化品牌文化调性，适合差异化竞争；泛流量下受众面较窄，更适合定向投放。",
    subDirections: [
      { name: "新中式轻奢风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-orange-juice-into-a-glass-41712-large.mp4", caseTitle: "《新中式轻奢》金缕描边对杯艺术大片" },
      { name: "古风意境风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-with-japanese-parasol-posing-41728-large.mp4", caseTitle: "《水墨江南》古法桃花胭脂非遗摄影" },
      { name: "非遗国风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-craftsman-sculpting-pottery-clay-on-a-wheel-41729-large.mp4", caseTitle: "《匠心泥骨》手作柴烧紫砂茶壶纪录" },
      { name: "禅意茶系风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-tea-from-teapot-41730-large.mp4", caseTitle: "《一叶知秋》高山古树普洱禅意冲泡" }
    ]
  },
  {
    name: "科技未来工业风",
    coreVisual: "冷色调金属质感 + 暗调环境光 + 科技蓝 / 紫光点缀，线条硬朗锐利，多实验室、工业场景，突出技术感与专业属性，运镜多为机械感推拉、环绕。",
    suitedCategories: "数码 3C、智能家电、男士护肤、汽车用品、黑科技产品、功能性保健品",
    placementTarget: "强化产品技术背书，触达男性、科技爱好者人群，适合突出成分、技术、功能的产品。",
    subDirections: [
      { name: "赛博科技风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-neon-sign-glowing-in-the-dark-41731-large.mp4", caseTitle: "《赛博迷影》电竞级机械发光键盘狂热模式" },
      { name: "实验室专业风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-scientist-looking-at-microscope-41732-large.mp4", caseTitle: "《微观修护》多肽多重屏障修护机制3D动画" },
      { name: "工业硬核风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-welder-working-with-sparkles-41733-large.mp4", caseTitle: "《火花飞溅》钛合金专业随车测温仪灼烧" },
      { name: "数码极简风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-laptop-on-a-desk-with-minimalist-aesthetic-41734-large.mp4", caseTitle: "《极客桌面》铝合金支架超薄拓展坞极简展示" }
    ]
  },
  {
    name: "复古怀旧年代感",
    coreVisual: "胶片颗粒质感 + 暖黄复古色调 + 年代感场景道具，主打情怀共鸣，画面自带故事感，常用 80/90 年代老街、老房子、旧物件等场景元素。",
    suitedCategories: "怀旧零食、老国货、复古服饰、文创周边、情怀类产品",
    placementTarget: "靠情怀拉升完播率与记忆点，适合老品牌翻新、怀旧向产品，差异化竞争优势明显。",
    subDirections: [
      { name: "港风复古", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-retro-neon-sign-flickering-at-night-41735-large.mp4", caseTitle: "《九龙霓虹》高腰复古牛仔裤摩登画报" },
      { name: "90 年代怀旧风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vintage-cassette-player-playing-music-41736-large.mp4", caseTitle: "《磁带旧时光》香蕉威化饼干童年味道" },
      { name: "美式复古", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-classic-car-driving-down-highway-41737-large.mp4", caseTitle: "《横跨加州》美式古着棒球夹克落日自驾" },
      { name: "民国复古风", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vintage-gramophone-playing-vinyl-record-41738-large.mp4", caseTitle: "《留声余音》国货桂花雪花膏东方雅韵" }
    ]
  }
];

export default function AgentCreationView({
  credits,
  onAddTask,
  onBack
}: AgentCreationViewProps) {
  // Navigation inside the component
  const [creationStage, setCreationStage] = useState<"welcome" | "workspace">("welcome");
  const [currentStep, setCurrentStep] = useState<StepType>("analysis");

  // Style selector states
  const [selectedMainStyle, setSelectedMainStyle] = useState("");
  const [selectedSubStyle, setSelectedSubStyle] = useState("");
  const [draftMainStyle, setDraftMainStyle] = useState("");
  const [draftSubStyle, setDraftSubStyle] = useState("");
  const [hoveredSubStyle, setHoveredSubStyle] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  // Input states in Welcome Page
  const [inputIdea, setInputIdea] = useState("");
  
  // Selection States
  const [selectedProduct, setSelectedProduct] = useState(PRESET_PRODUCTS[0]);
  const [videoLength, setVideoLength] = useState<number>(30); // 20-120
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [removeWatermark, setRemoveWatermark] = useState(true);

  // References List
  const [productImages, setProductImages] = useState<string[]>([selectedProduct.image]);
  const [references, setReferences] = useState<string[]>([
    "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=400&auto=format&fit=crop"
  ]);
  const [scripts, setScripts] = useState<string[]>([
    "【第一人称反转】雨天行车视线模糊，一招拯救老司机的尴尬时刻"
  ]);

  // Modals / Dropdowns in Dialogue
  const [openDropdown, setOpenDropdown] = useState<"product" | "reference" | "script" | "setting" | null>(null);

  // Editable Product Fields for Workspace (Step 1: 需求分析)
  const splitStringToList = (val: string | string[]): string[] => {
    if (Array.isArray(val)) return [...val];
    if (!val) return [];
    return val.split(/[，、,;\n]+/).map(s => s.trim()).filter(Boolean);
  };

  const [prodName, setProdName] = useState(selectedProduct.name);
  const [prodIndustry, setProdIndustry] = useState(selectedProduct.industry);
  const [prodCategory, setProdCategory] = useState(selectedProduct.category);
  const [prodSellingPoints, setProdSellingPoints] = useState<string[]>([...selectedProduct.sellingPoints]);
  const [prodPainPoints, setProdPainPoints] = useState<string[]>([...selectedProduct.painPoints]);
  const [prodTargetUsers, setProdTargetUsers] = useState<string[]>(() => splitStringToList(selectedProduct.targetUsers));
  const [prodScenarios, setProdScenarios] = useState<string[]>(() => splitStringToList(selectedProduct.scenarios));
  const [prodSpecs, setProdSpecs] = useState<string[]>(() => splitStringToList(selectedProduct.specs));
  const [prodDiscount, setProdDiscount] = useState<string[]>(() => splitStringToList(selectedProduct.discount));

  // Chat/Dialogue history on the right
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "agent"; text: string; time: string; button?: { label: string; action: () => void } }>>([
    {
      sender: "agent",
      text: "Hi! 我是您的即创电商营销AI助手。我已经加载了您选择的商品「官方正品 玻璃油膜擦」并完成其需求和商品分析。您可以在左侧面板查看、直接修改所有的卖点、痛点、规格和适用场景。确认这些核心元素准确无误后，我们将一键生成多套创意方案及分镜脚本！",
      time: "18:09",
      button: {
        label: "生成创意和分镜脚本 ✦0",
        action: () => handleGenerateScripts()
      }
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Step 2: Generated Creative Ideas & Storyboards
  const [selectedIdeaIdx, setSelectedIdeaIdx] = useState(0);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [scriptIdeas, setScriptIdeas] = useState([
    {
      title: "创意1：情景剧惊险反转",
      summary: "前段通过第一人称视角呈现雨天开慢车视线极度模糊、差点擦碰路人的惊险场景，制造强烈的安全焦虑悬念；后段无缝过渡到解决救星——玻璃油膜擦的实测去污去眩光对比，最后以限时买一送一口播福利完美收尾。",
      coreSellingPoint: "解决雨刮刮不干净、夜晚炫光问题；使用自带海绵擦一抹亮晶，简单无门槛。",
      subjectSetting: {
        product: "官方正品 玻璃油膜擦 (自带强力海绵刷头，无需二次配布)",
        characters: "私家车老车主（陈先生，35岁，眼神充满焦虑到释怀）"
      },
      scenes: [
        {
          num: 1,
          duration: "5s",
          description: "【安全痛点画面】大雨倾盆，前挡风玻璃一片雾蒙蒙，对面车灯晃眼。雨刮来回刮，却越刮越糊。驾驶员陈先生双手紧握方向盘，眉头紧锁，突然前方有行人横穿，惊险刹车！",
          image: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=300&auto=format&fit=crop",
          audio: "（人声旁白，紧张焦急）这油膜也太吓人了！下雨刮不干净，晚上对光晃得什么都看不清，每次下雨开车都跟开盲盒一样，魂都要吓掉了！"
        },
        {
          num: 2,
          duration: "8s",
          description: "【产品登场讲解】画面切到晴天或者地库。一瓶绿色的‘玻璃油膜擦’特写。陈先生拔下盖子，直接把自带的强力海绵擦贴在车玻璃上，绕圈擦拭，透明的研磨膏体快速带走油污。",
          image: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?w=300&auto=format&fit=crop",
          audio: "（旁白，转为轻松轻快）别慌！今天给你强势安利这个去油膜神器！不用买乱七八糟的喷剂，自带海绵擦头，开盖直接往玻璃上擦就完事了！"
        },
        {
          num: 3,
          duration: "10s",
          description: "【极度爽快对比】视频一分为二。左边是没有擦过的半边玻璃，泼水上去立刻成股聚水、模糊不清；右边是擦拭过的，泼水瞬间滑落，呈现绝对通透、水滴完全不留痕、宛如没有玻璃的视觉效果！",
          image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300&auto=format&fit=crop",
          audio: "（欢快动感BGM）看这逆天对比！用它擦过的地方，泼水成流不挂水！油膜、虫胶、鸟屎一并擦得干干净净。玻璃亮得像隐形了一样！安全感直接拉满！"
        },
        {
          num: 4,
          duration: "7s",
          description: "【优惠促销收尾】陈先生站在车前，手持两瓶玻璃油膜擦对镜头竖起大拇指，下方浮现【买一送一，限时立减20】优惠海报，字幕闪烁。",
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop",
          audio: "（激昂促销主播音）今天即创独家新客粉丝节，买一瓶直接送一瓶！还倒贴一瓶防雾喷剂！现在点击下方链接，不到两杯奶茶钱，保你全家一整年行车安全！"
        }
      ]
    },
    {
      title: "创意2：极限硬核测视",
      summary: "利用极端的泥浆、油污泼洒测试，凸显油膜擦的超强分解和清洁效率。配以节奏感极强的电子摇滚乐，突出产品的‘科技、快捷、一次见效’卖点，主打数码年轻科技感，快速种草。",
      coreSellingPoint: "一涂一冲即净，10倍去油污，温和不伤玻璃与胶条。",
      subjectSetting: {
        product: "官方正品 玻璃油膜擦 (纳米无损研磨配方)",
        characters: "硬核评测主播（小张，25岁，爽快干练）"
      },
      scenes: [
        {
          num: 1,
          duration: "6s",
          description: "【极端测试开头】主播小张直接将一盆夹杂着废机油和泥沙的脏水狠狠泼洒在一辆豪车的前档玻璃上，瞬间玻璃一片漆黑粘稠。小张对镜头挑衅微笑。",
          image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&auto=format&fit=crop",
          audio: "（高燃快节奏）大家都知道车玻璃上的顽固油膜有多难洗！今天我们玩个大的，废机油加黄泥，看看这个所谓的‘神级油膜擦’能不能洗干净！"
        },
        {
          num: 2,
          duration: "9s",
          description: "【纳米擦拭特写】主播拿出玻璃油膜擦，手起刀落，在粘稠泥尘上用力涂抹出一道雪白、干净的通道，玻璃内侧特写显示膏体瞬间乳化油脂。",
          image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=300&auto=format&fit=crop",
          audio: "（音效：滋滋乳化声）它里面有微米级除油粒子和表面活性剂，遇到油脂秒乳化。不需要沾水，直接擦。看看这一抹，是不是瞬间就透了！"
        },
        {
          num: 3,
          duration: "8s",
          description: "【清水冲洗震撼】高压水枪直接对着玻璃喷射。乳白色泡沫和废油污瞬间被卷走，整块玻璃在阳光下反射出犹如镜面一般的极光折射，毫无死角，没有一丝眩光残留。",
          image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=300&auto=format&fit=crop",
          audio: "（音效：哗啦水流声）来，清水一冲！油污泥沙完全不粘，水滴自动滑成一条线！隔着玻璃看外面，高清得像不存在一样！这就是无损抛光的力量！"
        },
        {
          num: 4,
          duration: "7s",
          description: "【秒变新车福利】展示精美包装。主播把两瓶油膜擦塞给旁边欢呼的同事，右侧大字体显示【抢购专享，今日买一送一】。",
          image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=300&auto=format&fit=crop",
          audio: "（促销）真金不怕火炼！不用去4S店花大几百抛光，自己动手5分钟，省时省力。今天官方福利买一送一，下方链接赶紧抢，慢了就没货了！"
        }
      ]
    }
  ]);

  // Step 3: Video Preview States (Horizontal interactive clips)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(15);
  const [selectedPreviewSceneIdx, setSelectedPreviewSceneIdx] = useState(0);
  const [videoDuration, setVideoDuration] = useState("00:30");
  const [videoTimeline, setVideoTimeline] = useState([
    { id: 1, title: "画面1：雨天视线受阻", length: "5.0s", url: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=300&auto=format&fit=crop" },
    { id: 2, title: "画面2：拿出油膜擦", length: "8.0s", url: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?w=300&auto=format&fit=crop" },
    { id: 3, title: "画面3：泼水强力爽快对比", length: "10.0s", url: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300&auto=format&fit=crop" },
    { id: 4, title: "画面4：买一送一抢购结尾", length: "7.0s", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop" }
  ]);
  const [previewMaterialList, setPreviewMaterialList] = useState([
    { id: "m1", name: "雨中驾车主视角.mp4", type: "video", url: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=300" },
    { id: "m2", name: "车漆去污实拍.jpg", type: "image", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300" },
    { id: "m3", name: "雨刷高速刮水.mp4", type: "video", url: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=300" },
    { id: "m4", name: "玻璃亮面泼水.mp4", type: "video", url: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300" }
  ]);

  // Step 4: Finished Videos ("视频成片")
  const [isRenderingFinal, setIsRenderingFinal] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<Array<{ id: string; title: string; filename: string; cover: string; url: string; time: string; reviewPassed: boolean }>>([]);

  // Sync edited product states when product is changed
  useEffect(() => {
    setProdName(selectedProduct.name);
    setProdIndustry(selectedProduct.industry);
    setProdCategory(selectedProduct.category);
    setProdSellingPoints([...selectedProduct.sellingPoints]);
    setProdPainPoints([...selectedProduct.painPoints]);
    setProdTargetUsers(splitStringToList(selectedProduct.targetUsers));
    setProdScenarios(splitStringToList(selectedProduct.scenarios));
    setProdSpecs(splitStringToList(selectedProduct.specs));
    setProdDiscount(splitStringToList(selectedProduct.discount));
    setProductImages([selectedProduct.image]);
  }, [selectedProduct]);

  // Handle entering creative workspace from welcome screen
  const handleStartCreation = (presetPromptText?: string) => {
    let baseText = presetPromptText || inputIdea || "用商品拍一条营销视频";
    if (selectedSubStyle) {
      baseText = `${baseText} (营销风格偏好: ${selectedMainStyle} - ${selectedSubStyle})`;
    }
    
    setCreationStage("workspace");
    setCurrentStep("analysis");

    // Add logging message from agent in chat history
    const welcomeMsg = `您刚才发起了：『${baseText}』的创作。我已针对商品进行智能提炼并融入「${selectedSubStyle || "默认"}」风格特征，生成了专属的【核心词条分析图谱】。请看左侧的需求看板，您可以随时在上面直接修改任何词条，以精准修正AI的创意定位。`;
    setChatHistory([
      {
        sender: "user",
        text: baseText,
        time: new Date().toLocaleTimeString().slice(0, 5)
      },
      {
        sender: "agent",
        text: welcomeMsg,
        time: new Date().toLocaleTimeString().slice(0, 5),
        button: {
          label: "开始生成创意和分镜脚本 ✦0",
          action: () => handleGenerateScripts()
        }
      }
    ]);
  };

  // Triggering Step 2: Generates script ideas
  const handleGenerateScripts = () => {
    setIsGeneratingScripts(true);
    setCurrentStep("script");
    setChatHistory(prev => [
      ...prev,
      {
        sender: "user",
        text: "生成创意和分镜脚本 ✦0",
        time: new Date().toLocaleTimeString().slice(0, 5)
      },
      {
        sender: "agent",
        text: "正在根据您的需求定位和卖点，生成创意大纲和分镜脚本。此过程预计耗时5-10秒，请稍等...",
        time: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);

    setTimeout(() => {
      setIsGeneratingScripts(false);
      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          text: "✨ 已经为您定制生成了 2 套极富带货穿透力的爆款视频分镜脚本。创意1主打『反转家庭情景剧』，通过下雨刮不干净的强烈危险制造悬念；创意2则是『硬核极端泼脏水测试』，能让科技控快速下单。您在左边点击切换，即可细看详细分镜镜头、主体台词等，确认后我们可以一键预览高拟真合成效果！",
          time: new Date().toLocaleTimeString().slice(0, 5),
          button: {
            label: "生成视频预览 ✦5",
            action: () => handleGeneratePreview()
          }
        }
      ]);
    }, 4000);
  };

  // Triggering Step 3: Video Preview Rendering
  const handleGeneratePreview = () => {
    setCurrentStep("preview");
    setChatHistory(prev => [
      ...prev,
      {
        sender: "user",
        text: "生成视频预览 ✦5",
        time: new Date().toLocaleTimeString().slice(0, 5)
      },
      {
        sender: "agent",
        text: "🎬 正在将分镜脚本的台词与AI渲染库中的高清汽车、雨天及洗车实景画面进行精准合成。正在为您加载渲染轴...",
        time: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          text: "🌟 渲染完成！视频预览已经生成。您可以通过左下方的视频播放器查看合成后的流体物理效果、配音语调和分镜转场。点击各个分镜节点可以精准定位修改，您觉得满意就可以一键合成最终的两套高清免除水印的成品了！",
          time: new Date().toLocaleTimeString().slice(0, 5),
          button: {
            label: "开始生成最终成片 ✦5",
            action: () => handleGenerateFinal()
          }
        }
      ]);
    }, 2000);
  };

  // Triggering Step 4: Final Completed Videos
  const handleGenerateFinal = () => {
    setIsRenderingFinal(true);
    setCurrentStep("final");
    setChatHistory(prev => [
      ...prev,
      {
        sender: "user",
        text: "开始生成最终成片 ✦5",
        time: new Date().toLocaleTimeString().slice(0, 5)
      },
      {
        sender: "agent",
        text: "🔥 已经启动了 Sora-Turbo-v2.5 双副本高清流式并行合成队列！预计需要生成两套不同剪辑节奏和微调文案的高级成片。正在为您渲染中...",
        time: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);

    // Add to main tasks in parent component
    onAddTask("video_gen", `即创成片: ${prodName}`, [productImages[0]], 5);

    setTimeout(() => {
      setIsRenderingFinal(false);
      const nowStr = new Date().toISOString().replace("T", " ").slice(0, 16).replace(/-/g, ".");
      setCompletedVideos([
        {
          id: "cv1",
          title: "情景剧反转版 - 这挡风玻璃油膜太吓人了！",
          filename: "Agent成片_20260716_104033_0.mp4",
          cover: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&auto=format&fit=crop",
          url: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
          time: nowStr,
          reviewPassed: true
        },
        {
          id: "cv2",
          title: "极限泥沙泼洒测试版 - 物理抛光一擦即净",
          filename: "Agent成片_20260716_104033_1.mp4",
          cover: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?w=500&auto=format&fit=crop",
          url: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
          time: nowStr,
          reviewPassed: true
        }
      ]);

      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          text: "🎉 恭喜！双版爆款营销成片已全部极速渲染完成，并且通过了各大主流投放平台的素材合规性初审（安全去水印、格式完全符合9:16、画质全4K提升）。您现在可以点击下载视频、也可以直接复制脚本或一键分发到广告媒体！如果觉得某些部分可以更好，随时可在上方下拉中切回前面的『需求分析』、『分镜脚本』或『视频预览』进行编辑修改，再次点击生成！",
          time: new Date().toLocaleTimeString().slice(0, 5)
        }
      ]);
    }, 4500);
  };

  // Chat message submission
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [
      ...prev,
      {
        sender: "user",
        text: userMsg,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);

    // Simple auto-reply rules to make chat feel extremely real and smart
    setTimeout(() => {
      let reply = "收到您的建议！我已经记录下您的反馈。左边的所有字段和脚本内容现在都是直接可编辑的，您可以双击进行文字微调。您想让我直接以此方向重新精调并重新预览视频吗？";
      if (userMsg.includes("修改") || userMsg.includes("变") || userMsg.includes("价格") || userMsg.includes("活动")) {
        reply = "明白了！我已在后台更新了商品定位设置。请查看左侧面板，您现在可以直接看到更新的内容。随时可以点击『一键成片』或下方的生成按钮哦！";
      } else if (userMsg.includes("下载") || userMsg.includes("导出")) {
        reply = "您好，视频下载链接已准备好。您可以把鼠标悬停在左边最终成片卡片上，点击『下载视频』按钮，即可将4K高清无水印视频保存到您的设备。";
      } else if (userMsg.includes("剧情") || userMsg.includes("搞笑") || userMsg.includes("专业")) {
        reply = "收到！已为您重新优化文案库的腔调和演员台词。您可以在『创意和分镜脚本』步骤中看到新加入的配音台词了！";
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          text: reply,
          time: new Date().toLocaleTimeString().slice(0, 5)
        }
      ]);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-800 overflow-hidden relative font-sans">
      
      {/* ----------------- 1. TOP HEADER NAVIGATION ----------------- */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-15 select-none shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="text-sm font-black text-slate-800">
              Agent创作
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert("当前工作流属于专属爆款视频生成服务，系统已接入深度推理大语言模型与Sora超分辨率引擎。")}
            className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3.5 py-2 rounded-xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            <span>历史任务</span>
          </button>
        </div>
      </header>

      {/* ----------------- 2. WELCOME PAGE WITH INTERACTIVE DIALOGUE ----------------- */}
      {creationStage === "welcome" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-y-auto">
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-15 pointer-events-none" />

          <div className="w-full max-w-3xl z-10 space-y-8 text-center px-4">
            
            {/* Ambient greeting text */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
                Hi, 今天有什么新想法...
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                输入您的营销爆点，让 AI 自动为您解析商品、定制创意并生成引流视频
              </p>
            </div>

            {/* Glowing Dialogue Box */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-r from-purple-200 via-indigo-100 to-pink-200 shadow-[0_10px_30px_rgba(168,85,247,0.06)]">
              <div className="bg-white rounded-[22px] p-4 flex flex-col justify-between min-h-[160px] gap-4">
                
                {/* Textarea */}
                <textarea
                  value={inputIdea}
                  onChange={(e) => setInputIdea(e.target.value)}
                  placeholder="输入想法、商品、原料或上传参考素材，可以帮助Agent更好地创作"
                  className="w-full bg-transparent border-0 p-1 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 resize-none min-h-[80px] outline-none leading-relaxed"
                />

                {/* Bottom Row inside Box */}
                <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-slate-100 gap-3">
                  
                  {/* Left Function Entries */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    
                    {/* Function 1: 商品 */}
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === "product" ? null : "product")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                          openDropdown === "product" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>商品</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {openDropdown === "product" && (
                        <div className="absolute left-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl w-[320px] md:w-[360px] z-30 text-left space-y-4">
                          <h4 className="text-xs font-black text-slate-700 pb-1.5 border-b border-slate-100">
                            商品设定
                          </h4>
                          <div className="space-y-3 text-xs">
                            {/* Input link */}
                            <div className="space-y-1">
                              <span className="text-slate-500 font-bold block">1. 输入商品链接</span>
                              <div className="flex gap-1.5">
                                <input 
                                  type="text" 
                                  placeholder="粘贴淘宝/京东/抖店/拼多多商品链接..." 
                                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] flex-1 text-slate-700 outline-none focus:border-purple-500"
                                />
                                <button 
                                  onClick={() => {
                                    alert("商品链接解析成功！自动拉取主图和详情信息。");
                                    setOpenDropdown(null);
                                  }}
                                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 rounded-lg font-bold"
                                >
                                  解析
                                </button>
                              </div>
                            </div>

                            {/* select from product library */}
                            <div className="space-y-1.5">
                              <span className="text-slate-500 font-bold block">2. 从商品库选择推荐爆款</span>
                              <div className="grid grid-cols-2 gap-2">
                                {PRESET_PRODUCTS.map(p => (
                                  <button
                                    key={p.id}
                                    onClick={() => {
                                      setSelectedProduct(p);
                                      setOpenDropdown(null);
                                      alert(`已加载商品「${p.name}」核心语料背景。`);
                                    }}
                                    className={`p-2 rounded-lg border text-left flex items-center gap-2 ${
                                      selectedProduct.id === p.id ? "bg-purple-50 border-purple-300 text-purple-600 font-bold" : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                                    }`}
                                  >
                                    <img src={p.image} className="w-8 h-8 rounded object-cover" />
                                    <span className="truncate flex-1 font-bold scale-90">{p.name.replace("官方正品 ", "")}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Upload image */}
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                              <button 
                                onClick={() => {
                                  alert("模拟调用本地摄像头/图库：上传图片成功！已加入当前素材序列。");
                                  setOpenDropdown(null);
                                }}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl py-2 flex items-center justify-center gap-1 font-bold"
                              >
                                <Upload className="w-3.5 h-3.5 text-purple-500" />
                                <span>本地上传图片</span>
                              </button>
                              <button 
                                onClick={() => {
                                  alert("已为您从MC公共原料资产库中检索对齐3张高清无底色白底图！");
                                  setOpenDropdown(null);
                                }}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl py-2 flex items-center justify-center gap-1 font-bold"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                                <span>原料库选择</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Function 2: 参考 */}
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === "reference" ? null : "reference")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                          openDropdown === "reference" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>参考</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {openDropdown === "reference" && (
                        <div className="absolute left-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl w-[300px] z-30 text-left space-y-3">
                          <h4 className="text-xs font-black text-slate-700 pb-1 border-b border-slate-100">参考视频模板/素材</h4>
                          
                          <div className="space-y-2">
                            <span className="text-[11px] text-slate-500 font-bold block">1. 历史高点击投放素材视频</span>
                            <div className="space-y-1.5">
                              <button 
                                onClick={() => {
                                  setReferences(["https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=300"]);
                                  alert("已应用爆款投放视频模版：[痛点反馈-剧情反转篇-32万赞]");
                                  setOpenDropdown(null);
                                }}
                                className="w-full bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-[11px] flex items-center gap-2 text-slate-650 hover:text-slate-800 text-left"
                              >
                                <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[8px] font-mono border border-red-100">10W+跑量</span>
                                <span className="truncate flex-1 font-medium">雨天家庭剧痛点反转视频模板</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setReferences(["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300"]);
                                  alert("已应用爆款投放视频模版：[科技感泼脏水评测篇]");
                                  setOpenDropdown(null);
                                }}
                                className="w-full bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-[11px] flex items-center gap-2 text-slate-650 hover:text-slate-800 text-left"
                              >
                                <span className="bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded text-[8px] font-mono border border-purple-100">5W+转化</span>
                                <span className="truncate flex-1 font-medium">主播硬核极端实测对比视频模板</span>
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <button 
                              onClick={() => {
                                alert("本地视频文件解析完毕！AI已深度捕获其运镜模式、BGM节奏和文案架构。");
                                setOpenDropdown(null);
                              }}
                              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1"
                            >
                              <Upload className="w-3.5 h-3.5 text-indigo-500" />
                              <span>本地上传视频</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Function: 风格 */}
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setDraftMainStyle(selectedMainStyle);
                          setDraftSubStyle(selectedSubStyle);
                          const idx = STYLE_CATEGORIES.findIndex(cat => cat.name === selectedMainStyle);
                          setActiveCategoryIdx(idx >= 0 ? idx : 0);
                          setIsStyleModalOpen(true);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                          selectedSubStyle ? "bg-purple-55 bg-purple-50 border-purple-300 text-purple-600 font-bold" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>风格: {selectedSubStyle || "全部"}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>

                    {/* Function 3: 添加脚本或者原料 */}
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === "script" ? null : "script")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                          openDropdown === "script" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>脚本/原料</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {openDropdown === "script" && (
                        <div className="absolute left-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl w-[260px] z-30 text-left space-y-3">
                          <h4 className="text-xs font-black text-slate-700 pb-1 border-b border-slate-100">添加创意背景原料</h4>
                          <div className="space-y-1.5">
                            <button 
                              onClick={() => {
                                const sc = prompt("请输入你想让AI吸纳的分镜脚本/产品文案/台词思路：", "比如：第一步拍摄泼水对比，然后主播口播，接着限时抢购...");
                                if (sc) {
                                  setScripts([...scripts, sc]);
                                  alert("自定义创意文案脚本加入成功！");
                                }
                                setOpenDropdown(null);
                              }}
                              className="w-full bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 hover:text-slate-900 flex items-center gap-2"
                            >
                              <FileText className="w-3.5 h-3.5 text-pink-500" />
                              <span className="text-left font-medium">手工添加创意脚本</span>
                            </button>
                            <button 
                              onClick={() => {
                                alert("已从您之前在成片管理及画布中编辑的高清镜头包中拉取了3段音频和4段空镜头！");
                                setOpenDropdown(null);
                              }}
                              className="w-full bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 hover:text-slate-900 flex items-center gap-2"
                            >
                              <Layers className="w-3.5 h-3.5 text-purple-500" />
                              <span className="text-left font-medium">关联我的音视频原料</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Function 4: 设置 */}
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === "setting" ? null : "setting")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                          openDropdown === "setting" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>设置</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {openDropdown === "setting" && (
                        <div className="absolute left-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl w-[280px] z-30 text-left space-y-4">
                          <h4 className="text-xs font-black text-slate-700 pb-1.5 border-b border-slate-100">参数配置</h4>
                          
                          {/* Length Selection */}
                          <div className="space-y-1.5 text-xs">
                            <span className="text-slate-500 font-bold block">1. 视频长度 (20 - 120 秒)</span>
                            <div className="flex gap-1.5">
                              {[20, 30, 60, 120].map((len) => (
                                <button
                                  key={len}
                                  onClick={() => setVideoLength(len)}
                                  className={`flex-1 py-1 px-2 rounded-lg border text-center font-mono text-[11px] ${
                                    videoLength === len ? "bg-purple-50 border-purple-300 text-purple-600 font-bold" : "bg-slate-50 border-slate-200 text-slate-600"
                                  }`}
                                >
                                  {len}s
                                </button>
                              ))}
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="120" 
                              value={videoLength}
                              onChange={(e) => setVideoLength(Number(e.target.value))}
                              className="w-full accent-purple-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                              <span>当前: {videoLength} 秒</span>
                            </div>
                          </div>

                          {/* Aspect Ratio Selection */}
                          <div className="space-y-1.5 text-xs">
                            <span className="text-slate-500 font-bold block">2. 视频画面比例</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setAspectRatio("9:16")}
                                className={`flex-1 py-1.5 rounded-lg border text-center font-bold flex items-center justify-center gap-1 ${
                                  aspectRatio === "9:16" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                <span className="block w-2.5 h-4 bg-slate-400 rounded-xs" />
                                <span>9:16 竖屏</span>
                              </button>
                              <button
                                onClick={() => setAspectRatio("16:9")}
                                className={`flex-1 py-1.5 rounded-lg border text-center font-bold flex items-center justify-center gap-1 ${
                                  aspectRatio === "16:9" ? "bg-purple-50 border-purple-300 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                <span className="block w-4 h-2.5 bg-slate-400 rounded-xs" />
                                <span>16:9 横屏</span>
                              </button>
                            </div>
                          </div>

                          {/* Watermark toggle */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                            <span className="text-slate-500 font-bold">3. 是否自动去水印并补足</span>
                            <button
                              onClick={() => setRemoveWatermark(!removeWatermark)}
                              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                                removeWatermark ? "bg-purple-600" : "bg-slate-200"
                              }`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${removeWatermark ? "translate-x-5" : ""}`} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Send Action */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">✦ 0 pt</span>
                    <button 
                      onClick={() => handleStartCreation()}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all shadow-md shadow-purple-500/20"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Quick choices suggestions (Pills) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
              <button 
                onClick={() => handleStartCreation(`用爆款【${selectedProduct.name.replace("官方正品 ", "")}】拍一条带反转家庭痛点剧情的营销视频。`)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm scale-95 hover:scale-100 font-medium"
              >
                <span>用商品拍一条营销视频</span>
                <ArrowUp className="w-3.5 h-3.5 text-slate-400 rotate-45" />
              </button>

              <button 
                onClick={() => handleStartCreation(`参考【家庭剧痛点反转视频模板】，为【${selectedProduct.name.replace("官方正品 ", "")}】提炼卖点，编写4个镜头的分镜脚本。`)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm scale-95 hover:scale-100 font-medium"
              >
                <span>参考样片写分镜脚本</span>
                <ArrowUp className="w-3.5 h-3.5 text-slate-400 rotate-45" />
              </button>
            </div>

          </div>

          {/* Quick tips */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 select-none">
            即创 AIGC 旗舰工作台 ✦ 支持全自动化镜头匹配、去水印和高保真多音色配音联动
          </div>

        </div>
      )}

      {/* ----------------- 3. ACTIVE INTERACTIVE WORKSPACE ----------------- */}
      {creationStage === "workspace" && (
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100 relative">
          
          {/* ==================== LEFT & MIDDLE WORKSPACE COLUMN (70% width) ==================== */}
          <div className="lg:col-span-8 flex flex-col h-full border-r border-slate-200 relative overflow-hidden bg-white">
            
            {/* Top Step selection Bar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  当前步骤：
                </span>
                
                {/* Steps Dropdown Selector */}
                <div className="relative">
                  <select
                    value={currentStep}
                    onChange={(e) => setCurrentStep(e.target.value as StepType)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs text-purple-600 font-extrabold focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer pr-8 appearance-none min-w-[140px]"
                  >
                    <option value="analysis">需求分析</option>
                    <option value="script">创意和分镜脚本</option>
                    <option value="preview">视频预览</option>
                    <option value="final">视频成片</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-purple-500 pointer-events-none" />
                </div>
              </div>

              {/* Status Pill Indicator */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold">
                  {currentStep === "analysis" && "已提炼商品图谱，支持即刻编辑"}
                  {currentStep === "script" && "已生成爆款分镜，支持添加镜头"}
                  {currentStep === "preview" && "已生成预览音轨，正在支持微调"}
                  {currentStep === "final" && "高清成片已就绪，通过初审核验"}
                </span>
              </div>
            </div>

            {/* Render Stage Area (Scrollable pane) */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-24">
              
              {/* ============ STEP 1: 需求分析 PANEL ============ */}
              {currentStep === "analysis" && (
                <div className="space-y-6 text-left">
                  
                  {/* Title heading */}
                  <div className="pb-3 border-b border-slate-200">
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="text-purple-500">✦</span> 
                      <span>商品需求定位及分析看板</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      AI已根据商品库深度学习提炼以下关键参数。您可以直接在输入框和列表中双击、直接编辑修改，以引导创意走向。
                    </p>
                  </div>

                  {/* Basic information container */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-black text-purple-600 uppercase tracking-wider">
                      一、商品基础信息
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Left: Product Images upload and management */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-500 font-bold block">商品主图 / 物料素材图片</span>
                        <div className="grid grid-cols-2 gap-2">
                          {productImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                              <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button 
                                onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-red-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newImg = prompt("请输入你想添加的商品图片URL:", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400");
                              if (newImg) setProductImages([...productImages, newImg]);
                            }}
                            className="aspect-square border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100/40 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-all cursor-pointer"
                          >
                            <Plus className="w-5 h-5 mb-1 text-slate-400" />
                            <span className="text-[10px] font-bold">继续添加</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Category and Industry Info */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-500 font-bold block">商品名称</label>
                          <input 
                            type="text" 
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 font-bold block">商品所属行业</label>
                            <input 
                              type="text" 
                              value={prodIndustry}
                              onChange={(e) => setProdIndustry(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 font-bold block">商品品类</label>
                            <input 
                              type="text" 
                              value={prodCategory}
                              onChange={(e) => setProdCategory(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Deep analytical insights card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
                    <h3 className="text-xs font-black text-pink-600 uppercase tracking-wider">
                      二、商品核心分析语料（可直接增删编辑）
                    </h3>

                    {/* Selling Points & Pain Points Unified Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Selling Points */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-emerald-600 flex items-center justify-between">
                          <span>🎯 商品卖点</span>
                          <button 
                            onClick={() => setProdSellingPoints([...prodSellingPoints, "新增卖点描述..."])}
                            className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodSellingPoints.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodSellingPoints];
                                  temp[i] = e.target.value;
                                  setProdSellingPoints(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setProdSellingPoints(prodSellingPoints.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pain Points */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-amber-600 flex items-center justify-between">
                          <span>⚡ 商品痛点</span>
                          <button 
                            onClick={() => setProdPainPoints([...prodPainPoints, "新增痛点描述..."])}
                            className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodPainPoints.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodPainPoints];
                                  temp[i] = e.target.value;
                                  setProdPainPoints(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setProdPainPoints(prodPainPoints.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Target Users */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-blue-600 flex items-center justify-between">
                          <span>👥 目标人群</span>
                          <button 
                            onClick={() => setProdTargetUsers([...prodTargetUsers, "新增目标人群描述..."])}
                            className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodTargetUsers.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodTargetUsers];
                                  temp[i] = e.target.value;
                                  setProdTargetUsers(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setProdTargetUsers(prodTargetUsers.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Applicable Users */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-indigo-600 flex items-center justify-between">
                          <span>📍 适用人群</span>
                          <button 
                            onClick={() => setProdScenarios([...prodScenarios, "新增适用人群与场景..."])}
                            className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodScenarios.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodScenarios];
                                  temp[i] = e.target.value;
                                  setProdScenarios(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setProdScenarios(prodScenarios.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-slate-600 flex items-center justify-between">
                          <span>📦 商品规格</span>
                          <button 
                            onClick={() => setProdSpecs([...prodSpecs, "新增规格描述..."])}
                            className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodSpecs.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodSpecs];
                                  temp[i] = e.target.value;
                                  setProdSpecs(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setProdSpecs(prodSpecs.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Discount Info */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-extrabold text-pink-600 flex items-center justify-between">
                          <span>🎁 优惠信息</span>
                          <button 
                            onClick={() => setProdDiscount([...prodDiscount, "新增优惠活动描述..."])}
                            className="text-[10px] bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            + 添加
                          </button>
                        </span>
                        
                        <div className="space-y-1.5 pt-1">
                          {prodDiscount.map((point, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                              <input 
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const temp = [...prodDiscount];
                                  temp[i] = e.target.value;
                                  setProdDiscount(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-700 outline-none focus:ring-0 flex-1 border-b border-transparent hover:border-slate-200 focus:border-purple-500 font-semibold text-pink-600"
                              />
                              <button 
                                onClick={() => setProdDiscount(prodDiscount.filter((_, idx) => idx !== i))}
                                className="text-slate-500 hover:text-red-400 opacity-60 hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ============ STEP 2: 创意和分镜脚本 PANEL ============ */}
              {currentStep === "script" && (
                <div className="space-y-6 text-left relative min-h-[300px]">
                  
                  {isGeneratingScripts ? (
                    /* Beautiful Loading / waiting stage screen */
                    <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin" />
                        <Sparkles className="w-8 h-8 text-pink-500 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      
                      <div className="space-y-2 max-w-md">
                        <h3 className="text-base font-black text-slate-800">
                          即创 AIGC 创意及分镜脚本极速架构中...
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          我们正在提炼「{prodName}」的黄金卖点。深度融和 ✦ 买一送一 ✦ 痛点反转模式。正在调取电商带货脚本公式生成中...
                        </p>
                      </div>

                      <div className="w-64 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-4/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : null}

                  {/* Split structure: Left side vertical tab list of multiple ideas */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    
                    {/* Left Column (Creative Idea selector tab list) */}
                    <div className="lg:col-span-4 space-y-3 shrink-0">
                      <span className="text-[11px] text-slate-500 font-black tracking-wider block uppercase">
                        AI 智能生成的多版方案
                      </span>
                      
                      <div className="space-y-2">
                        {scriptIdeas.map((idea, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedIdeaIdx(idx)}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                              selectedIdeaIdx === idx 
                                ? "bg-purple-50 border-2 border-purple-500 shadow-md shadow-purple-500/5" 
                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start ${
                              idx === 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-pink-50 text-pink-600 border border-pink-100"
                            }`}>
                              {idx === 0 ? "创意1: 爆款口播" : "创意2: 情景剧混剪"}
                            </span>
                            <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-relaxed">
                              {idea.title.split("：")[1]}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-3 leading-normal">
                              {idea.summary}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                        <h5 className="text-[10px] font-black text-slate-500">💡 创意评级</h5>
                        <p className="text-[9px] text-slate-400 leading-normal font-medium">
                          方案由DALL-E运镜逻辑深度优选。支持一键点击视频预览直接生成对应的动态画面与旁白音频。
                        </p>
                      </div>
                    </div>

                    {/* Middle Column (Display selected creative details) */}
                    <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-5">
                      
                      {/* Overview section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-600 uppercase tracking-widest block">
                            创意设定
                          </span>
                          <button 
                            onClick={() => alert(`完整创意配置说明：\n\n大纲: ${scriptIdeas[selectedIdeaIdx].summary}\n\n建议主播音色：晓婷 (成熟带货款)\nBGM：快节奏强弱对比纯音乐`)}
                            className="text-[10px] text-pink-600 hover:text-pink-500 font-bold"
                          >
                            查看完整创意 &gt;
                          </button>
                        </div>
                        <textarea
                          value={scriptIdeas[selectedIdeaIdx].summary}
                          onChange={(e) => {
                            const temp = [...scriptIdeas];
                            temp[selectedIdeaIdx].summary = e.target.value;
                            setScriptIdeas(temp);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-purple-500 min-h-[80px]"
                        />
                      </div>

                      {/* 1. Subject setup */}
                      <div className="space-y-3 bg-white border border-slate-200 rounded-2xl p-4">
                        <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <span className="text-pink-500">1.</span>
                          <span>主体设定</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Product block */}
                          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex gap-3">
                            <img src={productImages[0]} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="text-left space-y-1">
                              <span className="text-[10px] text-slate-400 font-black">推广商品</span>
                              <input 
                                type="text"
                                value={scriptIdeas[selectedIdeaIdx].subjectSetting.product}
                                onChange={(e) => {
                                  const temp = [...scriptIdeas];
                                  temp[selectedIdeaIdx].subjectSetting.product = e.target.value;
                                  setScriptIdeas(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 outline-none focus:ring-0 font-bold"
                              />
                            </div>
                          </div>

                          {/* Character/Anchor block */}
                          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex gap-3">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-12 h-12 rounded-lg object-cover" />
                            <div className="text-left space-y-1">
                              <span className="text-[10px] text-slate-400 font-black">人物形象 / 主播类型</span>
                              <input 
                                type="text"
                                value={scriptIdeas[selectedIdeaIdx].subjectSetting.characters}
                                onChange={(e) => {
                                  const temp = [...scriptIdeas];
                                  temp[selectedIdeaIdx].subjectSetting.characters = e.target.value;
                                  setScriptIdeas(temp);
                                }}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 outline-none focus:ring-0 font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Scenes Description */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <span className="text-purple-500">2.</span>
                          <span>分镜镜号描述列表</span>
                        </h4>

                        <div className="space-y-3">
                          {scriptIdeas[selectedIdeaIdx].scenes.map((scene, sIdx) => (
                            <div key={sIdx} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start shadow-sm">
                              
                              {/* Left frame preview */}
                              <div className="w-full md:w-28 shrink-0 space-y-1">
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                                  <img src={scene.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <span className="absolute top-1 left-1 bg-black/70 text-[9px] text-white font-mono px-1 rounded font-bold">
                                    镜头 {scene.num}
                                  </span>
                                  <span className="absolute bottom-1 right-1 bg-purple-600 text-[8px] text-white px-1 rounded font-bold font-mono">
                                    {scene.duration}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const newUrl = prompt("更换当前分镜画面的参考图链接:", scene.image);
                                    if (newUrl) {
                                      const temp = [...scriptIdeas];
                                      temp[selectedIdeaIdx].scenes[sIdx].image = newUrl;
                                      setScriptIdeas(temp);
                                    }
                                  }}
                                  className="w-full py-1 text-center bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 font-bold cursor-pointer"
                                >
                                  更换分镜参考图
                                </button>
                              </div>

                              {/* Right detailed settings */}
                              <div className="flex-1 space-y-2 text-left w-full">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400 font-black">镜头动作与细节描述</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-slate-500 font-mono">长度:</span>
                                    <input 
                                      type="text" 
                                      value={scene.duration}
                                      onChange={(e) => {
                                        const temp = [...scriptIdeas];
                                        temp[selectedIdeaIdx].scenes[sIdx].duration = e.target.value;
                                        setScriptIdeas(temp);
                                      }}
                                      className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-700 w-10 font-mono text-center outline-none"
                                    />
                                  </div>
                                </div>

                                <textarea 
                                  value={scene.description}
                                  onChange={(e) => {
                                    const temp = [...scriptIdeas];
                                    temp[selectedIdeaIdx].scenes[sIdx].description = e.target.value;
                                    setScriptIdeas(temp);
                                  }}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-purple-500 leading-relaxed min-h-[60px]"
                                />

                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-400 font-black block">主播语音旁白 / 拟合音轨</span>
                                  <input 
                                    type="text" 
                                    value={scene.audio}
                                    onChange={(e) => {
                                      const temp = [...scriptIdeas];
                                      temp[selectedIdeaIdx].scenes[sIdx].audio = e.target.value;
                                      setScriptIdeas(temp);
                                    }}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-pink-600 font-medium outline-none focus:border-pink-500"
                                  />
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ============ STEP 3: 视频预览 PANEL ============ */}
              {currentStep === "preview" && (
                <div className="space-y-6 text-left">
                  
                  {/* Title */}
                  <div className="pb-2 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Clapperboard className="w-4 h-4 text-purple-600" />
                        <span>合成预览视轨调节舱</span>
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        在这里可针对各个镜号自动匹配的视频素材进行预览，播放音频配音并更换原料。
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => alert("正在通过AI自动调音纠错，音画同步差值计算正常！")}
                        className="bg-purple-50 border border-purple-200 text-purple-600 px-3 py-1.5 rounded-xl text-[10px] font-black"
                      >
                        智能调音同步
                      </button>
                    </div>
                  </div>

                  {/* Main dual pane: Player on left, detail config on right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left: Video Player */}
                    <div className="lg:col-span-7 space-y-4">
                      
                      {/* Player container */}
                      <div className="relative aspect-[9/16] max-w-[280px] mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-black group shadow-2xl">
                        
                        {/* Mock image for running clip */}
                        <img 
                          src={videoTimeline[selectedPreviewSceneIdx].url} 
                          className="w-full h-full object-cover transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />

                        {/* Overlapping subtitler */}
                        <div className="absolute bottom-16 left-4 right-4 bg-black/65 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center space-y-1">
                          <span className="text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-mono uppercase font-bold block w-max mx-auto">
                            分镜 {selectedPreviewSceneIdx + 1} 实时字幕与配音
                          </span>
                          <p className="text-[10px] text-white leading-relaxed font-bold font-sans">
                            {scriptIdeas[selectedIdeaIdx].scenes[selectedPreviewSceneIdx]?.audio || "正在匹配音符旁白..."}
                          </p>
                        </div>

                        {/* Top layout metrics overlay */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between text-[9px] font-mono font-bold text-white/95 bg-black/70 p-2 rounded-xl backdrop-blur-xs border border-white/5">
                          <span>Sora Turbo v2.5</span>
                          <span className="text-purple-400 font-bold">去水印已激活</span>
                        </div>

                        {/* Play/Pause hover toggle overlay */}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                          >
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </button>
                        </div>
                      </div>

                      {/* Video Player Timings slider */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <button 
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="text-purple-600 hover:text-purple-500 font-extrabold flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isPlayingVideo ? "正在放音" : "点击试听"}</span>
                          </button>
                          <span className="text-slate-500 font-bold">00:12 / {videoDuration}</span>
                        </div>
                        
                        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${videoProgress}%` }} />
                        </div>

                        {/* Horizontal storyboard frames selector */}
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          {videoTimeline.map((item, idx) => {
                            const isSel = selectedPreviewSceneIdx === idx;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedPreviewSceneIdx(idx);
                                  setVideoProgress(idx * 25 + 10);
                                }}
                                className={`p-1.5 rounded-xl border text-left space-y-1 transition-all ${
                                  isSel ? "bg-purple-50 border-2 border-purple-500" : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 relative">
                                  <img src={item.url} className="w-full h-full object-cover" />
                                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[7px] text-slate-300 px-1 rounded font-mono font-bold">
                                    {item.length}
                                  </span>
                                </div>
                                <div className="text-[8px] font-black text-slate-600 truncate block text-center">
                                  画面 {idx + 1}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Right: Detailed Sources and raw resources matcher */}
                    <div className="lg:col-span-5 space-y-4">
                      
                      {/* Current segment specs card */}
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                        <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
                          当前画面原料详情
                        </span>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-200/40">
                            <span className="text-slate-500">原料来源</span>
                            <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-purple-100/60">
                              AI 原创画质补足
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/40">
                            <span className="text-slate-500">原料时长</span>
                            <span className="font-mono font-semibold text-slate-700">8.0 秒</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">所用片段</span>
                            <span className="font-mono font-semibold text-pink-600">0.0s - 8.0s</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => {
                              const promptText = prompt("编辑该画面对应的高精合成提示词:", "雨天大灯爆闪，折射出晶莹剔透的水气泡 and 反光，高奢商业感。");
                              if (promptText) alert("镜头生成指令已追加更新！生成视频时将重组此渲染轴。");
                            }}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold border border-slate-200 flex items-center justify-center gap-1"
                          >
                            <Scissors className="w-3.5 h-3.5 text-slate-500" />
                            <span>裁剪/微调镜头</span>
                          </button>
                          <button 
                            onClick={() => {
                              alert("已触发AI对该镜头的二次研磨！稍后将展示在您的原料备选区。");
                            }}
                            className="flex-1 py-1.5 bg-white hover:bg-purple-50 text-purple-600 rounded-xl text-[10px] font-bold border border-purple-200 flex items-center justify-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
                            <span>重构此分镜</span>
                          </button>
                        </div>
                      </div>

                      {/* Materials block */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 text-left shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-800">备选原料资源包</span>
                          <button 
                            onClick={() => {
                              alert("已经调用算力集群，额外并发拉取4段更柔和的主题片段！已加载至下方备选队列中。");
                              setPreviewMaterialList([
                                ...previewMaterialList,
                                { id: "m5", name: "微距流沙水Caustic效果.mp4", type: "video", url: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?w=300" }
                              ]);
                            }}
                            className="text-[10px] text-purple-600 hover:text-purple-500 font-bold"
                          >
                            生成更多
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {previewMaterialList.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                const temp = [...videoTimeline];
                                temp[selectedPreviewSceneIdx].url = m.url;
                                temp[selectedPreviewSceneIdx].title = m.name;
                                setVideoTimeline(temp);
                                alert(`已将分镜【${selectedPreviewSceneIdx + 1}】的底色画面替换为「${m.name}」！`);
                              }}
                              className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-600 transition-all flex items-center gap-2 text-left group"
                            >
                              <div className="w-10 h-8 rounded overflow-hidden shrink-0 bg-slate-200 relative">
                                <img src={m.url} className="w-full h-full object-cover" />
                                <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[7px] text-white font-bold opacity-0 group-hover:opacity-100">
                                  使用
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-black text-slate-700 truncate">{m.name}</p>
                                <p className="text-[7px] text-slate-400 uppercase font-mono font-bold">{m.type}</p>
                              </div>
                            </button>
                          ))}

                          <button 
                            onClick={() => {
                              const newLink = prompt("请输入您想追加的高清背景图/视频链接:", "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400");
                              if (newLink) {
                                setPreviewMaterialList([
                                  ...previewMaterialList,
                                  { id: "m_new_" + Date.now(), name: "外链导入素材.jpg", type: "image", url: newLink }
                                ]);
                              }
                            }}
                            className="border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-slate-400 h-11 cursor-pointer transition-all"
                          >
                            <Plus className="w-4 h-4 text-slate-500" />
                            <span className="text-[8px] font-bold">手动追加</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ============ STEP 4: 视频成片 PANEL ============ */}
              {currentStep === "final" && (
                <div className="space-y-6 text-left relative min-h-[300px]">
                  
                  {isRenderingFinal && (
                    <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-pink-500 animate-spin" />
                        <Video className="w-8 h-8 text-pink-500 absolute inset-0 m-auto animate-bounce" />
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <h3 className="text-base font-black text-slate-800">Sora 集群正在渲染双拷贝高清成片...</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          我们正在对视频字幕进行毫秒级OCR对齐、融合音轨并输出无底色水印的超高清广告视频。
                        </p>
                      </div>
                      <div className="w-48 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-2/3 rounded-full animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Header metadata */}
                  <div className="pb-3 border-b border-slate-200">
                    <h2 className="text-base font-black text-slate-850 flex items-center gap-2">
                      <span className="text-purple-600">✦</span>
                      <span>已为您渲染生成的 4K 超清免去水印成片</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      成片已对齐投放平台规格。您可直接保存高品质视频或分发至抖音/快手/小红书投放模块。即使成片已生成，您依然可以随时在此步骤上方下拉切换回【需求分析】或【分镜脚本】更改内容再次极速生成！
                    </p>
                  </div>

                  {/* Grid showing finished videos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {completedVideos.map((video) => (
                      <div key={video.id} className="bg-white border border-slate-200 rounded-3xl p-4 space-y-4 shadow-sm hover:border-purple-600 transition-all group relative overflow-hidden">
                        
                        {/* Vertical card thumbnail */}
                        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={video.cover} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                          
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 text-[9px] font-bold">
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>素材初审已通过</span>
                            </span>
                            <span className="bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-lg w-max backdrop-blur-xs">
                              AI 智能合成
                            </span>
                          </div>

                          {/* Watermark cleared indicator */}
                          <div className="absolute top-3 right-3 bg-black/60 text-[8px] font-mono font-bold text-white px-2 py-1 rounded-lg border border-white/5 backdrop-blur-xs">
                            无水印 4K
                          </div>

                          {/* Duration badge */}
                          <div className="absolute bottom-3 right-3 bg-black/80 text-[10px] font-mono text-white px-2 py-1 rounded-lg">
                            00:30
                          </div>

                          {/* Hover Play action icon overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                alert(`正在播放成品广告视频 [${video.filename}]...\n\n音频: ${scriptIdeas[selectedIdeaIdx].scenes[0]?.audio || ""}`);
                              }}
                              className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            >
                              <Play className="w-6 h-6 fill-current ml-1" />
                            </button>
                          </div>
                        </div>

                        {/* Text summary info */}
                        <div className="space-y-2 text-left">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                            {video.filename}
                          </span>
                          <h3 className="text-xs font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                            {video.title}
                          </h3>
                          
                          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                            <span>创建于: {video.time}</span>
                            <span className="font-mono text-purple-600">评分: 9.8/10</span>
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button 
                            onClick={() => {
                              alert(`已成功将视频广告素材「${video.filename}」打包高品质无损下载！文件大小 24.5 MB。`);
                            }}
                            className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1"
                          >
                            <Download className="w-4 h-4 text-slate-500" />
                            <span>下载视频</span>
                          </button>
                          <button 
                            onClick={() => {
                              alert(`已将本广告素材直接推送到「投放管理」页面，已预配主流多账户托管接口！`);
                            }}
                            className="py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-purple-900/10"
                          >
                            <Share2 className="w-4 h-4 text-purple-200" />
                            <span>一键分发投放</span>
                          </button>
                        </div>

                      </div>
                    ))}

                    {completedVideos.length === 0 && !isRenderingFinal && (
                      <div className="col-span-2 py-12 border border-dashed border-slate-200 rounded-3xl text-center space-y-4">
                        <span className="text-4xl block">🎬</span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-500">暂无已生成的成品视频</h4>
                          <p className="text-xs text-slate-400">
                            请在下方或者右侧对话中，点击「一键成片」或「生成视频预览」以启动 Sora 高清集群渲染。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* Combined Panel Bottom Sticky Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 p-4 flex items-center justify-between z-10">
              
              <div className="text-xs text-slate-400 max-w-sm hidden md:block">
                直接在左侧编辑，或输入框告诉即创如何修改
              </div>

              {/* Core trigger actions */}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleGenerateFinal}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>一键成片</span>
                  <span className="text-amber-500 font-mono scale-90">✦ 5</span>
                </button>

                <button
                  onClick={() => {
                    if (currentStep === "analysis") {
                      handleGenerateScripts();
                    } else if (currentStep === "script") {
                      handleGeneratePreview();
                    } else if (currentStep === "preview") {
                      handleGenerateFinal();
                    } else {
                      alert("已经成功生成最终成片！您可以从顶部选择回到前面的任意步骤重新调整修改。");
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-purple-900/20"
                >
                  <span>
                    {currentStep === "analysis" && "生成创意/脚本"}
                    {currentStep === "script" && "生成视频预览"}
                    {currentStep === "preview" && "生成视频成片"}
                    {currentStep === "final" && "重新渲染新版本"}
                  </span>
                  <span className="text-purple-200 font-mono scale-90">✦ 0 pt</span>
                </button>
              </div>

            </div>

          </div>

          {/* ==================== RIGHT DIALOGUE / CHAT COLUMN (30% width) ==================== */}
          <div className="lg:col-span-4 flex flex-col h-full bg-slate-50/50 border-l border-slate-200 overflow-hidden relative">
            
            {/* Right column header info */}
            <div className="p-4 border-b border-slate-200 bg-slate-100/40 flex items-center justify-between shrink-0">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>即创 AI 实时沟通舱</span>
              </span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                GPT-4o PRO
              </span>
            </div>

            {/* Chat History log list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-24">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col space-y-1 max-w-[90%] text-left ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[9px] text-slate-400 font-mono px-1">
                    {msg.sender === "user" ? "我的修改意图" : "即创Agent"} · {msg.time}
                  </span>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-purple-600 text-white rounded-tr-none shadow-md" 
                      : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.text}

                    {/* Integrated flow trigger button inside agent message */}
                    {msg.button && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={msg.button.action}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-purple-500/20"
                        >
                          <span>{msg.button.label}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dialog Log Bottom Input box */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200/80 z-10">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex flex-col justify-between gap-1.5 focus-within:border-purple-500 hover:border-slate-300 transition-all">
                
                {/* Input text field */}
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChat();
                  }}
                  placeholder="可以随时告诉我的想法..."
                  className="w-full bg-transparent border-0 p-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-0"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200">
                  <div className="flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>支持用纯文本指令直接驱动修改左侧词条</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]">✦ 0 pt</span>
                    <button
                      onClick={handleSendChat}
                      className="w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {isStyleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in text-slate-800">
          <div className="bg-white border border-slate-150 rounded-2xl w-full max-w-5xl overflow-hidden animate-scale-up flex flex-col h-[85vh] shadow-2xl">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    视频营销视觉风格库
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-normal">
                  请选择符合您的产品调性与投放定位的黄金视觉规范与细分创意方向
                </p>
              </div>
              <button 
                onClick={() => setIsStyleModalOpen(false)}
                className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-white relative">
              {/* Left Column - List of 8 Styles */}
              <div className="w-full md:w-1/4 border-r border-slate-100 overflow-y-auto bg-slate-50/50 p-5 space-y-1.5 shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-2 border-b border-slate-100/60 mb-2">
                  核心主视觉风格
                </div>
                {STYLE_CATEGORIES.map((category, idx) => {
                  const isActive = activeCategoryIdx === idx;
                  const isSelectedCategory = draftMainStyle === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setActiveCategoryIdx(idx);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                        isActive 
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm font-semibold" 
                          : isSelectedCategory
                          ? "bg-purple-50/60 border-purple-200 text-purple-700 font-semibold"
                          : "bg-white hover:bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-medium">{category.name}</div>
                        {isSelectedCategory && (
                          <div className={`text-[9px] ${isActive ? "text-slate-300" : "text-purple-500"} font-medium truncate mt-0.5`}>
                            已选: {draftSubStyle}
                          </div>
                        )}
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-50 ${isActive ? "text-white" : "text-slate-400"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Area - Shared scroll container for Specifications & Sub directions */}
              <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col md:flex-row gap-6 relative">
                
                {/* Middle Specifications */}
                <div className="flex-1 space-y-5 text-left border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest font-mono">
                      Specifications
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                      {STYLE_CATEGORIES[activeCategoryIdx].name}
                    </h4>
                  </div>

                  {/* Core Visual specification */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      ✦ 核心视觉特征 (Core Visual)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100/80 p-3.5 rounded-xl font-normal">
                      {STYLE_CATEGORIES[activeCategoryIdx].coreVisual}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        适配品类
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed px-1">
                        {STYLE_CATEGORIES[activeCategoryIdx].suitedCategories}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        投放定位
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed px-1">
                        {STYLE_CATEGORIES[activeCategoryIdx].placementTarget}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Sub Directions */}
                <div className="w-full md:w-80 space-y-3 shrink-0">
                  <div className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-150 flex items-center justify-between text-left">
                    <span>细分创意方向 (最终选项)</span>
                    <span className="text-[10px] text-slate-400 font-normal">悬停左侧预览视频</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {STYLE_CATEGORIES[activeCategoryIdx].subDirections.map((subDir) => {
                      const isSelected = draftSubStyle === subDir.name;
                      const isHovered = hoveredSubStyle === subDir.name;
                      return (
                        <div key={subDir.name} className="relative">
                          <button
                            onMouseEnter={() => setHoveredSubStyle(subDir.name)}
                            onMouseLeave={() => setHoveredSubStyle(null)}
                            onClick={() => {
                              setDraftMainStyle(STYLE_CATEGORIES[activeCategoryIdx].name);
                              setDraftSubStyle(subDir.name);
                            }}
                            className={`w-full p-3 rounded-xl text-left transition-all border cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-purple-50/50 border-purple-500 text-purple-700 font-bold shadow-xs"
                                : isHovered
                                ? "bg-slate-50 border-purple-300 text-slate-900 shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs block font-semibold">{subDir.name}</span>
                              <span className="text-[9px] text-slate-400 block font-normal">悬停预览案例 · 点击选择</span>
                            </div>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-purple-500 bg-purple-500 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </span>
                          </button>

                          {/* Hover Video Preview Popup on Left side of option */}
                          {isHovered && (
                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-none animate-fade-in text-white">
                              {/* Header */}
                              <div className="px-3 py-2 bg-slate-900/90 flex items-center justify-between border-b border-slate-800">
                                <span className="text-[9px] font-bold text-purple-400 font-mono tracking-wider flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                  案例视频效果预览
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono truncate max-w-[100px]">
                                  {subDir.name}
                                </span>
                              </div>

                              {/* Video Box */}
                              <div className="aspect-video bg-black relative overflow-hidden">
                                <video
                                  src={subDir.videoUrl}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
                                  <span className="text-[10px] text-slate-200 font-medium truncate drop-shadow-md">
                                    {subDir.caseTitle}
                                  </span>
                                  <span className="text-[8px] bg-purple-600/80 px-1 py-0.5 rounded font-mono font-bold shrink-0 ml-1">
                                    1080P
                                  </span>
                                </div>
                              </div>

                              {/* Arrow indicator on right edge pointing towards option button */}
                              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-950 border-t border-r border-slate-800 rotate-45" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between shrink-0">
              {/* Clear button - disabled if draftSubStyle is empty */}
              <div>
                <button
                  disabled={!draftSubStyle}
                  onClick={() => {
                    setDraftMainStyle("");
                    setDraftSubStyle("");
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    draftSubStyle 
                      ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-600 cursor-pointer" 
                      : "bg-slate-100 border-slate-200 text-slate-400 opacity-55 cursor-not-allowed"
                  }`}
                >
                  清除已选风格
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsStyleModalOpen(false)}
                  className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setSelectedMainStyle(draftMainStyle);
                    setSelectedSubStyle(draftSubStyle);
                    setIsStyleModalOpen(false);
                    if (draftSubStyle) {
                      alert(`风格应用成功：\n${draftMainStyle} ➔ ${draftSubStyle}`);
                    } else {
                      alert("已恢复全部默认风格");
                    }
                  }}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/10"
                >
                  确认应用风格
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
