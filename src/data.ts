import { GalleryItem, Asset, Task, CreditTransaction, AppMessage } from "./types";

export const INITIAL_MESSAGES: AppMessage[] = [
  {
    id: "msg_init_credits_1",
    category: "审核",
    subcategory: "积分审核",
    type: "积分审核",
    title: "【积分申请】待部门部长审核",
    detail: "申请人【梁靖淇】发起【500 积分】算力补给申请，请审批。关联项目：千川服装爆款视频批量生成。",
    status: "unread",
    time: "2026-08-06 10:15:20",
    isRedDot: true,
    summary: "申请人: 梁靖淇 | 申请积分: 500 | 审批部长: 张总 (品牌一部部长)",
    approvalType: "credits",
    approvalStatus: "pending",
    applicantName: "梁靖淇",
    managerName: "张总 (品牌一部部长)",
    creditsAmount: 500,
    reason: "千川服装爆款视频批量生成与4K画质增强渲染",
    details: [
      { label: "申请人", value: "梁靖淇" },
      { label: "所属部门", value: "AIGC爆款内容拆解部" },
      { label: "申请积分数量", value: "500 积分" },
      { label: "审批部长/主管", value: "张总 (品牌一部部长)" },
      { label: "关联业务项目", value: "千川服装爆款视频批量生成" },
      { label: "申请原因用途", value: "千川服装爆款视频批量生成与4K画质增强渲染" },
      { label: "提交时间", value: "2026-08-06 10:15:20" },
      { label: "当前审核状态", value: "待审核 (Pending)" }
    ]
  },
  { 
    id: "m1", 
    category: "创作", 
    subcategory: "上传视频", 
    type: "上传视频",
    title: "视频上传成功",
    detail: "视频《冬季风衣短视频_01.mp4》上传成功，可前往创作工作台进行下一步编辑与智能渲染。", 
    status: "unread", 
    time: "2026-08-05 18:20:00",
    details: [
      { label: "修改人", value: "致上运营团队" },
      { label: "关联文件", value: "冬季风衣短视频_01.mp4" },
      { label: "处理状态", value: "上传成功 - 已分配智能剪辑节点" }
    ]
  },
  { 
    id: "a1", 
    category: "卡审", 
    subcategory: "视频审核不通过", 
    type: "审核不通过",
    title: "文案/视频审核不通过",
    detail: "审核驳回：视频《补水面膜对比》因出现极限修辞词汇“最顶级”被平台卡审驳回，请修正文案。", 
    status: "unread", 
    time: "2026-08-04 17:45:00",
    details: [
      { label: "修改人", value: "致上运营团队" },
      { label: "修改前后", value: "修改前 -> 审核驳回" },
      { label: "文案内容", value: "好看好🙋！！这个补水面膜效果真的是最顶级的了..." },
      { label: "修改文案备注", value: "最顶级" }
    ]
  },
  { 
    id: "r1", 
    category: "审核", 
    subcategory: "轮到你的预约", 
    type: "编辑视频",
    title: "轮到你预约计算",
    detail: "GPU 专属云端渲染排队提醒：轮到您的 [4K 爆款裂变生成] 任务开始计算，预计耗时 3 分钟。", 
    status: "read", 
    time: "2026-08-03 16:10:00",
    details: [
      { label: "规则组", value: "GPU云端渲染引擎排队组" },
      { label: "预约轮次", value: "第 1 轮" },
      { label: "预约时间", value: "3 分钟" }
    ]
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "极简日系高奢美妆主视觉视频",
    author: "Mika_Design",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-blue-glass-bottle-with-dropper-44365-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80",
    likes: 1240,
    views: 8900,
    category: "视频",
    duration: "12s",
    prompt: "A bottle of luxury cosmetic serum on a minimalist beige sand surface, soft studio lighting, organic shadows, high-end editorial product video",
    tags: ["美妆", "日化", "极简高奢", "大理石晨光"]
  },
  {
    id: "g2",
    title: "时尚轻奢真丝吊带裙换装视频",
    author: "电商爆款制造机",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&auto=format&fit=crop&q=80",
    likes: 852,
    views: 12400,
    category: "视频",
    duration: "10s",
    prompt: "An elegant female model wearing a luxurious champagne silk slip dress, walking gracefully in a sunlit neutral modern apartment",
    tags: ["女装", "轻奢", "真丝材质", "模特换衣", "爆款推流"]
  },
  {
    id: "g3",
    title: "多功能不粘锅户外场景画质增强",
    author: "Chef_Creative",
    authorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-cooking-in-a-pan-40502-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
    likes: 412,
    views: 3100,
    category: "视频",
    duration: "15s",
    prompt: "Vegetables sizzling in a premium non-stick pan, steam rising, professional food commercial lighting, macro view",
    tags: ["厨具", "美食带货", "户外烹饪", "高清重设", "大理石温和"]
  },
  {
    id: "g4",
    title: "智能运动手表多机位动态展示视频",
    author: "Tech_Reviewer",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-smart-watch-with-black-screen-40503-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    likes: 981,
    views: 6540,
    category: "视频",
    duration: "8s",
    prompt: "Premium smart wristwatch on a dark dynamic cyber background with circular light neon rings, hyperrealistic 3D render movie",
    tags: ["数码配件", "智能穿戴", "科技霓虹", "多机位渲染", "3D质感"]
  },
  {
    id: "g5",
    title: "法式复古高帮帆布鞋户外场景视频",
    author: "SoleMate",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-running-shoes-being-tied-41711-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    likes: 1540,
    views: 11000,
    category: "视频",
    duration: "15s",
    prompt: "Retro canvas sneakers on a charming Parisian stone street, sunbeams filtering through autumn leaves, commercial layout",
    tags: ["鞋履", "复古经典", "场景化套图", "法式街头", "爆款详情"]
  },
  {
    id: "g6",
    title: "奢华金箔高脚杯澄澈饮品倾倒视频",
    author: "Mika_Design",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-orange-juice-into-a-glass-41712-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    likes: 672,
    views: 4200,
    category: "视频",
    duration: "10s",
    prompt: "Gold rimmed luxury glass filling with sparkling orange beverage, caustics light effect, exquisite tabletop styling",
    tags: ["餐饮玻璃", "金箔奢华", "光影折射", "Caustics特效", "餐桌美学"]
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: "a1",
    name: "雅诗兰黛精华空瓶_主图主体.png",
    type: "image",
    url: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&auto=format&fit=crop&q=80",
    size: "1.2 MB",
    createdAt: "2026-07-08 14:20",
    category: "我的素材"
  },
  {
    id: "a2",
    name: "智能蓝牙音箱白色_高对比度.png",
    type: "image",
    url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80",
    size: "980 KB",
    createdAt: "2026-07-08 15:30",
    category: "我的素材"
  },
  {
    id: "a3",
    name: "模特红裙走秀素材_原图.mp4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4",
    size: "18.4 MB",
    createdAt: "2026-07-07 11:15",
    category: "我的素材"
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "t_old_1",
    name: "兰蔻小黑瓶商详套图 (4张)",
    type: "detail_set",
    status: "completed",
    progress: 100,
    inputFiles: ["雅诗兰黛精华空瓶_主图主体.png"],
    outputFiles: [
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80"
    ],
    createdAt: "2026-07-08 18:00",
    creditsCost: 4.0
  },
  {
    id: "t_old_2",
    name: "去除视频右下角水印_15s",
    type: "watermark",
    status: "completed",
    progress: 100,
    inputFiles: ["模特红裙走秀素材_原图.mp4"],
    createdAt: "2026-07-08 16:12",
    creditsCost: 2.5
  }
];

export const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "tx1",
    type: "recharge",
    tool: "系统赠送",
    amount: 100.00,
    time: "2026-07-07 00:00:00",
    remark: "新人注册赠送体验积分"
  },
  {
    id: "tx2",
    type: "consume",
    tool: "商详套图",
    amount: -4.00,
    time: "2026-07-08 18:00:00",
    remark: "生成兰蔻小黑瓶套图(4张)"
  },
  {
    id: "tx3",
    type: "consume",
    tool: "水印擦除",
    amount: -2.50,
    time: "2026-07-08 16:12:00",
    remark: "视频去水印 [模特红裙走秀素材_原图.mp4]"
  }
];

export const REFERENCE_SLIDER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
    title: "1. 首页 / 主视觉图",
    desc: "用清晰主体、品牌氛围和核心利益点，快速建立商品第一印象。"
  },
  {
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    title: "2. 卖点细节拆解",
    desc: "微距透视搭配核心功效标签，突出产品科研硬实力与活性配方。"
  },
  {
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    title: "3. 场景化生活应用",
    desc: "置入高端居家化妆台、自然晨光场景，让买家对产品产生日常代入感。"
  },
  {
    url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80",
    title: "4. 参数对比与评测",
    desc: "以网格背景、清晰参数和简洁配图，完成信息闭环，加速购买决策。"
  }
];
