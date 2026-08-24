export type AssetLibraryType = "finished" | "viral" | "template" | "component" | "ad_delivery" | "archive" | "trash";

export interface AssetVersion {
  id: string;
  version: string;
  label: string;
  url: string;
  updatedAt: string;
  updatedBy: string;
  changelog: string;
  fileSize: string;
  isCurrent?: boolean;
}

export interface RawMaterialRelation {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "script";
  url?: string;
  role: string;
}

export interface AssetPerformance {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  completionRate: string;
  gmv: number;
  roi: number;
  orders: number;
  conversionRate: string;
}

export interface AssetFileInfo {
  size: string;
  resolution: string;
  duration: string;
  format: string;
  bitrate?: string;
  aspectRatio?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document" | "template";
  url: string;
  size: string;
  createdAt: string;
  category?: string;
  resourceCategory?: "成片" | "素材" | "脚本" | "图片" | "音频";
  source?: "resource_library" | "task_collaboration" | "ai_generation";
  publicTags?: string[];
  coverUrl?: string;
  status?: string;
  
  // Rich Asset Library extensions
  libraryType?: AssetLibraryType;
  isViral?: boolean;
  viralRank?: "S级" | "A级" | "B级" | "非爆款";
  version?: string;
  versions?: AssetVersion[];
  rawMaterials?: RawMaterialRelation[];
  creator?: string;
  project?: string;
  platforms?: string[];
  deliveryStatus?: "未投放" | "投放中" | "已结束" | "已暂停";
  performance?: AssetPerformance;
  tags?: string[];
  copyrightStatus?: "已授权" | "自有版权" | "待核验" | "商业专有";
  permission?: "内部使用" | "对外分发" | "商业全渠道授权";
  expireDate?: string;
  notes?: string;
  fileInfo?: AssetFileInfo;
  deletedAt?: string;
}

export type GenerationTaskCategory =
  | "agent"
  | "quick_creation"
  | "watermark"
  | "subtitle"
  | "enhance"
  | "digital_human"
  | "model_change"
  | "fission"
  | "ai_video"
  | "ai_image";

export interface Task {
  id: string;
  name: string;
  type: "detail_set" | "video" | "watermark" | "subtitle" | "enhance" | "digital_human" | "model_change" | "video_gen" | "image_gen" | "fission";
  status: "queue" | "generating" | "completed" | "failed" | "cancelled";
  progress: number;
  inputFiles: string[];
  outputFiles?: string[];
  createdAt: string;
  creditsCost: number;
  source?: "agent" | "tool";
  category?: GenerationTaskCategory;
  autoProgress?: boolean;
  cancelledAt?: string;
  refundedCredits?: number;
  failureReason?: string;
  agentStage?: "analysis" | "script" | "preview" | "final";
}

export interface CreditTransaction {
  id: string;
  type: "recharge" | "consume" | "refund";
  tool?: string;
  amount: number;
  time: string;
  date?: string;
  remark?: string;
  note?: string;
  balance?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  type: "image" | "video";
  url: string;
  coverUrl?: string;
  likes: number;
  views: number;
  category: string;
  prompt?: string;
  duration?: string;
  tags?: string[];
}

export type ActiveScreen = "home" | "quick_creation" | "agent_creation" | "video_remake" | "ai_video" | "ai_image" | "canvas" | "live_management" | "assets" | "detail_set" | "enhance" | "watermark" | "subtitle" | "fission" | "credits" | "resources" | "materials" | "finished_videos" | "scripts" | "images" | "audio" | "ad_delivery" | "same_style_video" | "account_management" | "task_collaboration" | "message_center";

export type ResourceSearchType = "成片" | "素材" | "脚本" | "图片" | "音频";

export interface ResourceSearchIntent {
  type: ResourceSearchType;
  query?: string;
  tag?: string;
  openDetail?: boolean;
  requestId: number;
}

export interface MessageResourceLink {
  id: string;
  name: string;
  type: ResourceSearchType;
}

export interface MessageDetailItem {
  label: string;
  value: string;
  isLink?: boolean;
}

export interface AppMessage {
  id: string;
  category: string;
  subcategory: string;
  type?: string;
  title: string;
  detail: string;
  status: "unread" | "read";
  time: string;
  summary?: string;
  categoryName?: string;
  isRedDot?: boolean;
  details: MessageDetailItem[];

  // Prototype event metadata used to demonstrate source, recipient and destination.
  eventCode?: string;
  template?: "approval" | "task" | "resource" | "live" | "security";
  severity?: "info" | "success" | "warning" | "danger";
  actorName?: string;
  recipientNames?: string[];
  sourceType?: string;
  sourceId?: string;
  businessStatus?: string;
  actionLabel?: string;
  actionScreen?: ActiveScreen;
  relatedResources?: MessageResourceLink[];

  // Approval specific fields
  approvalType?: "credits";
  approvalStatus?: "pending" | "approved" | "rejected";
  applicantName?: string;
  managerName?: string;
  creditsAmount?: number;
  reason?: string;
  rejectReason?: string;
}
