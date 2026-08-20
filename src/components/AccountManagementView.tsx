import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  FolderPlus, 
  ShieldCheck, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Building2, 
  Key, 
  FileText, 
  Download, 
  Upload, 
  Share2, 
  Copy, 
  RotateCcw, 
  Eye, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Layers, 
  Shield, 
  Sliders, 
  UserCheck, 
  UserX, 
  QrCode, 
  Phone, 
  Mail, 
  Globe,
  MoreVertical,
  CheckSquare,
  Square,
  ShieldAlert,
  ListFilter,
  Bell,
  Coins,
  Wallet,
  CreditCard,
  HelpCircle,
  Gift,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

// --- Notification Interfaces ---
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channels: {
    system: boolean;
    mobile: boolean;
    feishu?: boolean;
  };
  hasCustomConfig?: boolean;
}

export interface NotificationCategory {
  id: string;
  title: string;
  items: NotificationItem[];
}

export interface CustomCreditConfig {
  id: string;
  name: string;
  dailyLimit: string;
  monthlyLimit: string;
  applicableUser: string;
  creator: string;
  enabled: boolean;
  createdAt: string;
}

export const RECHARGE_TIERS = [
  {
    title: "积分轻享",
    badge: "送5%",
    creditsDisplay: "10,500",
    creditsNum: 10500,
    baseCredits: 10000,
    bonusCredits: 500,
    price: 1000,
    originalPrice: 1050,
    savePrice: 50,
    bonusValue: 50,
    includesText: "包含: 基础10000+加赠500"
  },
  {
    title: "积分畅享",
    badge: "送8%",
    creditsDisplay: "54,000",
    creditsNum: 54000,
    baseCredits: 50000,
    bonusCredits: 4000,
    price: 5000,
    originalPrice: 5400,
    savePrice: 400,
    bonusValue: 400,
    includesText: "包含: 基础50000+加赠4000"
  },
  {
    title: "积分悦享",
    badge: "送12%",
    creditsDisplay: "112,000",
    creditsNum: 112000,
    baseCredits: 100000,
    bonusCredits: 12000,
    price: 10000,
    originalPrice: 11200,
    savePrice: 1200,
    bonusValue: 1200,
    includesText: "包含: 基础100000+加赠12000"
  },
  {
    title: "积分尊享",
    badge: "送15%",
    creditsDisplay: "230,000",
    creditsNum: 230000,
    baseCredits: 200000,
    bonusCredits: 30000,
    price: 20000,
    originalPrice: 23000,
    savePrice: 3000,
    bonusValue: 3000,
    includesText: "包含: 基础200000+加赠30000"
  }
];

export const USER_SPEND_SUMMARIES = [
  { id: "1", user: "梁靖淇", group: "抖音", team: "抖音投流组", totalSpend: 1575 },
  { id: "2", user: "邱倩瑶", group: "投流二组", team: "抖音投流组", totalSpend: 585 },
  { id: "3", user: "彭昊", group: "视频号", team: "视频号投流组", totalSpend: 225 }
];

export const DETAILED_SPEND_RECORDS = [
  { id: "d1", user: "梁靖淇", group: "抖音", type: "AI视频批量生成", credits: 150, business: "抖音爆款鞋服视频", time: "2026-08-02 14:20:10" },
  { id: "d2", user: "梁靖淇", group: "抖音", type: "智能脚本改写", credits: 25, business: "美妆脚本变体", time: "2026-08-02 11:05:30" },
  { id: "d3", user: "邱倩瑶", group: "投流二组", type: "数字人口播生成", credits: 200, business: "投流广告视频#04", time: "2026-08-01 16:45:00" },
  { id: "d4", user: "彭昊", group: "视频号", type: "AI语音合成", credits: 15, business: "口播配音剪辑", time: "2026-08-01 09:30:12" },
  { id: "d5", user: "梁靖淇", group: "抖音", type: "智能分镜解析", credits: 40, business: "爆款对标视频撕裂", time: "2026-07-31 18:12:05" }
];

export const INITIAL_NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "creation",
    title: "创作通知",
    items: [
      {
        id: "upload_video",
        title: "上传视频",
        description: "在资源库里面点击上传成片时，选择了上传并提示某人后生成的提示信息",
        enabled: true,
        channels: { system: true, mobile: true }
      },
      {
        id: "edit_video",
        title: "编辑视频",
        description: "编辑资源库内容的基础信息后生成的提示信息",
        enabled: true,
        channels: { system: true, mobile: true }
      },
      {
        id: "video_status_change",
        title: "视频状态修改",
        description: "编辑资源库内容的基础信息或视频状态被修改后生成的提示信息",
        enabled: true,
        channels: { system: true, mobile: true },
        hasCustomConfig: true
      }
    ]
  },
  {
    id: "audit",
    title: "卡审通知",
    items: [
      {
        id: "video_audit_failed",
        title: "视频审核不通过",
        description: "视频审核不通过时，视频上传者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      }
    ]
  },
  {
    id: "booking",
    title: "预约通知",
    items: [
      {
        id: "turn_to_book",
        title: "轮到你预约",
        description: "预约规则为按轮次预约，到预约时间时，可预约者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      },
      {
        id: "booked_by_others",
        title: "被预约",
        description: "被预约后，预约规则设定者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true },
        hasCustomConfig: true
      },
      {
        id: "cancel_booking",
        title: "取消预约",
        description: "预约取消后，预约规则设定者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true },
        hasCustomConfig: true
      }
    ]
  },
  {
    id: "task",
    title: "任务通知",
    items: [
      {
        id: "publish_edit_task",
        title: "发布/编辑任务",
        description: "任务创建成功时，下单运营和被指派者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      },
      {
        id: "task_link_video",
        title: "任务关联视频",
        description: "任务成功关联视频、图片、文案、音频时，任务创建者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      }
    ]
  },
  {
    id: "account",
    title: "账号通知",
    items: [
      {
        id: "phone_unbind",
        title: "手机号解绑",
        description: "账号解绑了手机号，管理员收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      },
      {
        id: "account_locked",
        title: "账号被锁定",
        description: "账号5次输入错误密码后被锁定，管理员收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      }
    ]
  },
  {
    id: "export",
    title: "导出通知",
    items: [
      {
        id: "export_complete",
        title: "导出完成",
        description: "创作报表、任务报表、预约记录、计划报表、广告主报表、视频报表、投放报表、标签报表、TikTok店铺数据报表、TikTok订单数据报表、数据洞察报表导出任务生成后，操作导出者收到消息提醒",
        enabled: true,
        channels: { system: true, mobile: true }
      }
    ]
  }
];

// --- Interfaces & Types ---
export interface DeptNode {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  manager: string;
  phone: string;
  memberCount: number;
  quota: number;
  levelType?: "company" | "department" | "group";
  type: "投放组" | "内容组" | "剪辑组" | "编导组" | "运营组" | "直播组" | "行政财务" | "综合部门" | "公司";
  description: string;
  createdAt: string;
  status: "active" | "disabled";
}

export interface AccountMember {
  id: string;
  employeeNo: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  deptId: string;
  secondaryDeptIds?: string[];
  roleIds: string[];
  roleName: string;
  dataScope: "all" | "dept_tree" | "self";
  status: "normal" | "disabled" | "pending" | "suspended" | "retired" | "bound";
  boundAccount?: string;
  createdAt: string;
  lastActiveAt: string;
  logCount: number;
  remark?: string;
}

export interface PermissionActions {
  read: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  download: boolean;
  share: boolean;
  publish: boolean; // 一键投放
  approve: boolean; // 审批
}

export interface ModulePermission {
  moduleKey: string;
  moduleName: string;
  actions: PermissionActions;
}

export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface RolePermission {
  id: string;
  name: string;
  code: string;
  type: "preset" | "custom";
  category?: "default" | "other"; // "默认角色" or "其他角色"
  description: string;
  memberCount: number;
  dataScope: "all" | "dept_tree" | "self";
  enabled?: boolean;
  checkedKeys?: string[];
  permissions: ModulePermission[];
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  actionType: "账号创建" | "角色权限变更" | "部门更替" | "账户授权" | "状态变更" | "密码重置" | "一键投放" | "敏感解绑" | "消息通知";
  targetName: string;
  ip: string;
  timestamp: string;
  status: "success" | "warning" | "failed";
  details: string;
}

// System Available Modules for Permission Matrix
const ALL_MODULES = [
  { key: "materials", name: "资源库 - 素材管理 (原始片源/图片/音频)" },
  { key: "assets", name: "资产库与爆款库 (成片/模板/视觉组件)" },
  { key: "finished_videos", name: "资源库 - 成片管理与AI生成 (HappyHorse/Seedance)" },
  { key: "ad_delivery", name: "投放分发与广告主账号 (千川/金牛/TikTok)" },
  { key: "analytics", name: "数据分析与爆款归因看板" },
  { key: "account_org", name: "账号组织架构与角色权限" }
];

const DEFAULT_ACTIONS: PermissionActions = {
  read: true,
  create: true,
  edit: true,
  delete: false,
  download: true,
  share: true,
  publish: false,
  approve: false
};

// INITIAL MOCK DATA
export const INITIAL_DEPTS: DeptNode[] = [
  {
    id: "dept_root",
    name: "梦畅AIGC",
    code: "HQ-001",
    parentId: null,
    manager: "张总 (CEO / 创始人)",
    phone: "13800138000",
    memberCount: 28,
    quota: 50,
    levelType: "company",
    type: "公司",
    description: "梦畅AIGC企业最高控制与全局调度中心",
    createdAt: "2025-12-16",
    status: "active"
  },
  {
    id: "dept_1",
    name: "电商投放一部",
    code: "MKT-01",
    parentId: "dept_root",
    manager: "王大锤",
    phone: "13912345678",
    memberCount: 8,
    quota: 15,
    levelType: "department",
    type: "投放组",
    description: "主攻千川女装与珠宝类目爆款直接投放",
    createdAt: "2026-01-10",
    status: "active"
  },
  {
    id: "dept_1_1",
    name: "女装千川放量组",
    code: "MKT-01-A",
    parentId: "dept_1",
    manager: "刘小青",
    phone: "13911112222",
    memberCount: 4,
    quota: 8,
    levelType: "group",
    type: "投放组",
    description: "专注女装类目高ROI千川跑量与人群包画像定向",
    createdAt: "2026-03-10",
    status: "active"
  },
  {
    id: "dept_1_2",
    name: "美妆珠宝爆款组",
    code: "MKT-01-B",
    parentId: "dept_1",
    manager: "赵千川",
    phone: "13933334444",
    memberCount: 4,
    quota: 7,
    levelType: "group",
    type: "投放组",
    description: "主攻美妆与高客单珠宝ROI放量",
    createdAt: "2026-03-12",
    status: "active"
  },
  {
    id: "dept_2",
    name: "品牌效果投放部",
    code: "MKT-02",
    parentId: "dept_root",
    manager: "李阿牛",
    phone: "13788889999",
    memberCount: 6,
    quota: 10,
    levelType: "department",
    type: "投放组",
    description: "负责腾讯AD视频号与快手磁力金牛放量",
    createdAt: "2026-02-01",
    status: "active"
  },
  {
    id: "dept_3",
    name: "AIGC爆款内容拆解部",
    code: "CNT-01",
    parentId: "dept_root",
    manager: "陈编导",
    phone: "13655554444",
    memberCount: 7,
    quota: 12,
    levelType: "department",
    type: "编导组",
    description: "负责千川热门对标视频拆解与AI画质/脚本复刻",
    createdAt: "2026-02-15",
    status: "active"
  },
  {
    id: "dept_3_1",
    name: "千川剧本拆解小组",
    code: "CNT-01-A",
    parentId: "dept_3",
    manager: "孙剧本",
    phone: "13611223344",
    memberCount: 3,
    quota: 6,
    levelType: "group",
    type: "编导组",
    description: "对标千川Top100爆款前3秒黄金Hook拆解",
    createdAt: "2026-04-01",
    status: "active"
  },
  {
    id: "dept_4",
    name: "视频智能剪辑中心",
    code: "EDT-01",
    parentId: "dept_root",
    manager: "张剪辑",
    phone: "13566667777",
    memberCount: 5,
    quota: 10,
    levelType: "department",
    type: "剪辑组",
    description: "HappyHorse 与 Seedance 2.0 AI批量精剪与首尾帧微调",
    createdAt: "2026-03-01",
    status: "active"
  },
  {
    id: "dept_5",
    name: "达人代运营项目部",
    code: "KOL-01",
    parentId: "dept_root",
    manager: "张小花",
    phone: "13422223333",
    memberCount: 2,
    quota: 8,
    levelType: "department",
    type: "运营组",
    description: "KOL达人招募、切片授权与直播间分发",
    createdAt: "2026-04-12",
    status: "active"
  }
];

export const APP_PERMISSION_TREE: PermissionNode[] = [
  {
    id: "home",
    label: "首页",
    children: [
      { id: "home_view", label: "查看首页看板" },
      { id: "home_quick_entry", label: "快捷入口导航" },
      { id: "home_system_notice", label: "系统公告与动态" },
    ]
  },
  {
    id: "quick_creation",
    label: "快速创作",
    children: [
      { id: "qc_detail_set", label: "商详套图拆解与生成" },
      { id: "qc_enhance", label: "画质一键修复与增强" },
      { id: "qc_watermark", label: "智能水印字幕" },
      { id: "qc_fission", label: "素材矩阵爆款裂变" },
    ]
  },
  {
    id: "agent_creation",
    label: "Agent 创作",
    children: [
      { id: "agent_view", label: "查看 Agent 工作流" },
      { id: "agent_run", label: "运行 Agent 自动化生产" },
      { id: "agent_config", label: "自定义 Agent 指令与提示词" },
    ]
  },
  {
    id: "video_remake",
    label: "爆款复刻",
    children: [
      { id: "remake_view", label: "查看爆款复刻列表" },
      { id: "remake_create", label: "发起爆款复刻任务" },
      { id: "remake_mapping", label: "角色/场景/道具镜头映射" },
      { id: "remake_script_breakdown", label: "爆款视频脚本拆解" },
    ]
  },
  {
    id: "ai_video",
    label: "AI视频",
    children: [
      { id: "aivideo_view", label: "查看 AI 视频列表" },
      { id: "aivideo_generate", label: "AI 生成视频 (文生/图生)" },
      { id: "aivideo_motion", label: "动作迁移与姿态控制" },
      { id: "aivideo_keyframe", label: "首尾帧与控制卡打点" },
    ]
  },
  {
    id: "ai_image",
    label: "AI图片",
    children: [
      { id: "aiimg_view", label: "查看 AI 图片列表" },
      { id: "aiimg_generate", label: "生成 AI 套图" },
      { id: "aiimg_matting", label: "智能人像与商品抠图" },
      { id: "aiimg_enhance", label: "图片高清无损放大" },
    ]
  },
  {
    id: "canvas",
    label: "画布",
    children: [
      { id: "canvas_view", label: "查看工作区画布" },
      { id: "canvas_edit", label: "多轨剪辑与节点编排" },
      { id: "canvas_export", label: "导出画布工程与视频" },
    ]
  },
  {
    id: "task_collaboration",
    label: "任务协作",
    children: [
      { id: "task_view", label: "查看任务协作列表" },
      { id: "task_create", label: "指派与新建协作任务" },
      { id: "task_update", label: "更新任务状态与进度" },
      { id: "task_comment", label: "任务评论与附件上传" },
    ]
  },
  {
    id: "materials",
    label: "素材管理",
    children: [
      { id: "mat_view", label: "查看素材列表" },
      { id: "mat_upload", label: "上传素材" },
      { id: "mat_download", label: "下载素材" },
      { id: "mat_batch_category", label: "批量修改分类" },
      { id: "mat_edit_title", label: "修改标题与标签" },
      { id: "mat_status", label: "画面利用与状态标记" },
      { id: "mat_pin", label: "素材置顶" },
      { id: "mat_export_excel", label: "导出素材 Excel" },
    ]
  },
  {
    id: "finished_videos",
    label: "成片管理",
    children: [
      { id: "finished_edit_info", label: "修改视频信息" },
      { id: "finished_download_transcode", label: "下载转码视频" },
      { id: "finished_audit_log", label: "查看操作记录" },
      { id: "finished_share", label: "分享" },
      { id: "finished_interaction_data", label: "查看互动数据" },
      { id: "finished_download_project", label: "下载工程文件" },
      { id: "finished_upload_project", label: "上传工程文件" },
      { id: "finished_mat_data", label: "查看素材数据" },
      { id: "finished_referenced_shots", label: "查看引用视频镜头" },
      { id: "finished_batch_category", label: "批量修改分类" },
      { id: "finished_status", label: "修改状态" },
      { id: "finished_pin", label: "合集置顶" },
    ]
  },
  {
    id: "assets_library",
    label: "资产库",
    children: [
      { id: "asset_view", label: "查看资源库" },
      { id: "asset_upload", label: "资源上传" },
      { id: "asset_category", label: "分类管理" },
      { id: "asset_delete", label: "资源删除" },
    ]
  },
  {
    id: "ad_delivery",
    label: "数据分析",
    children: [
      { id: "ad_view", label: "查看数据看板" },
      { id: "ad_bind", label: "广告账户绑定" },
      { id: "ad_publish", label: "一键开户建组" },
      { id: "ad_export", label: "导出广告报表" },
    ]
  },
  {
    id: "account_management",
    label: "系统管理",
    children: [
      { id: "sys_users", label: "人员与账号管理" },
      { id: "sys_roles", label: "角色与权限管理" },
      { id: "sys_audit", label: "操作审计日志" },
      { id: "sys_auth", label: "第三方账号授权" },
    ]
  }
];

export const ALL_PERMISSION_KEYS = [
  "home_view", "home_quick_entry", "home_system_notice",
  "qc_detail_set", "qc_enhance", "qc_watermark", "qc_fission",
  "agent_view", "agent_run", "agent_config",
  "remake_view", "remake_create", "remake_mapping", "remake_script_breakdown",
  "aivideo_view", "aivideo_generate", "aivideo_motion", "aivideo_keyframe",
  "aiimg_view", "aiimg_generate", "aiimg_matting", "aiimg_enhance",
  "canvas_view", "canvas_edit", "canvas_export",
  "task_view", "task_create", "task_update", "task_comment",
  "mat_view", "mat_upload", "mat_download", "mat_batch_category", "mat_edit_title", "mat_status", "mat_pin", "mat_export_excel",
  "finished_edit_info", "finished_download_transcode", "finished_audit_log", "finished_share", "finished_interaction_data", "finished_download_project", "finished_upload_project", "finished_mat_data", "finished_referenced_shots", "finished_batch_category", "finished_status", "finished_pin",
  "asset_view", "asset_upload", "asset_category", "asset_delete",
  "ad_view", "ad_bind", "ad_publish", "ad_export",
  "sys_users", "sys_roles", "sys_audit", "sys_auth"
];

const CREATION_KEYS = [
  "home_view", "home_quick_entry",
  "qc_detail_set", "qc_enhance", "qc_watermark",
  "agent_view", "agent_run",
  "remake_view", "remake_create", "remake_mapping",
  "aivideo_view", "aivideo_generate",
  "aiimg_view", "aiimg_generate",
  "canvas_view", "canvas_edit",
  "task_view", "task_update", "task_comment",
  "mat_view", "mat_upload", "mat_download",
  "finished_edit_info", "finished_download_transcode", "finished_share", "finished_mat_data", "finished_referenced_shots",
  "asset_view", "asset_upload"
];

const INITIAL_ROLES: RolePermission[] = [
  // 默认角色
  {
    id: "role_staff",
    name: "普通员工",
    code: "STAFF",
    type: "preset",
    category: "default",
    description: "标准员工基础权限，支持剪辑、素材与爆款复刻协作",
    memberCount: 18,
    dataScope: "self",
    enabled: true,
    checkedKeys: CREATION_KEYS,
    permissions: [],
    updatedAt: "2026-07-24 10:00"
  },
  
  // 其他角色
  {
    id: "role_super_admin",
    name: "超级管理员",
    code: "SUPER_ADMIN",
    type: "preset",
    category: "other",
    description: "全站最高控制权限，全选所有业务模块与系统管理权限",
    memberCount: 2,
    dataScope: "all",
    enabled: true,
    checkedKeys: ALL_PERMISSION_KEYS,
    permissions: [],
    updatedAt: "2026-07-24 09:00"
  },
  
  // 其他角色
  {
    id: "role_photo_edit",
    name: "摄影+剪辑",
    code: "PHOTO_EDIT",
    type: "preset",
    category: "other",
    description: "拍摄素材采集与AI剪辑成片一体化配置",
    memberCount: 6,
    dataScope: "self",
    enabled: true,
    checkedKeys: [...CREATION_KEYS, "finished_upload", "finished_edit_title", "mat_batch_category", "mat_status"],
    permissions: [],
    updatedAt: "2026-07-23 15:20"
  },
  {
    id: "role_director_assist",
    name: "编导助理",
    code: "DIRECTOR_ASSIST",
    type: "preset",
    category: "other",
    description: "辅助爆款分镜拆解、剧本复刻与素材归类",
    memberCount: 4,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["remake_view", "remake_create", "remake_mapping", "aivideo_script", "task_view", "task_update", "mat_view", "finished_view"],
    permissions: [],
    updatedAt: "2026-07-22 14:10"
  },
  {
    id: "role_content_edit",
    name: "内容部剪辑",
    code: "CONTENT_EDIT",
    type: "preset",
    category: "other",
    description: "内容中心专用精剪与字幕合成岗位",
    memberCount: 8,
    dataScope: "self",
    enabled: true,
    checkedKeys: CREATION_KEYS,
    permissions: [],
    updatedAt: "2026-07-21 11:30"
  },
  {
    id: "role_transition_pitcher",
    name: "(过渡性角色) 投手+编导",
    code: "PITCH_DIR",
    type: "custom",
    category: "other",
    description: "兼任千川建组投放与爆款视频拆解复刻",
    memberCount: 2,
    dataScope: "dept_tree",
    enabled: true,
    checkedKeys: [...CREATION_KEYS, "ad_view", "ad_publish", "ad_export", "finished_ad_data"],
    permissions: [],
    updatedAt: "2026-07-20 18:00"
  },
  {
    id: "role_pitcher",
    name: "投手",
    code: "PITCHER",
    type: "preset",
    category: "other",
    description: "负责广告主账号建组、消耗跟踪与一键同步投放",
    memberCount: 12,
    dataScope: "dept_tree",
    enabled: true,
    checkedKeys: ["finished_view", "finished_ad_data", "finished_export_ad", "ad_view", "ad_bind", "ad_publish", "ad_export"],
    permissions: [],
    updatedAt: "2026-07-20 16:45"
  },
  {
    id: "role_editor",
    name: "剪辑",
    code: "EDITOR",
    type: "preset",
    category: "other",
    description: "负责视频精剪、爆款微调与画质一键增强",
    memberCount: 9,
    dataScope: "self",
    enabled: true,
    checkedKeys: CREATION_KEYS,
    permissions: [],
    updatedAt: "2026-07-19 12:00"
  },
  {
    id: "role_cameraman",
    name: "摄影",
    code: "CAMERAMAN",
    type: "preset",
    category: "other",
    description: "现场素材拍摄、样片采集与原片批量归档",
    memberCount: 3,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["mat_view", "mat_upload", "mat_download", "mat_pin", "asset_view", "asset_upload"],
    permissions: [],
    updatedAt: "2026-07-18 10:20"
  },
  {
    id: "role_copywriter",
    name: "文案",
    code: "COPYWRITER",
    type: "preset",
    category: "other",
    description: "AI文案写作、Hook爆点拆解与标题文案批注",
    memberCount: 5,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["aivideo_script", "qc_subtitles", "finished_edit_title", "mat_edit_title", "task_view"],
    permissions: [],
    updatedAt: "2026-07-17 15:00"
  },
  {
    id: "role_model",
    name: "模特",
    code: "MODEL",
    type: "preset",
    category: "other",
    description: "数字形象、出镜素材确认与成品合集查看",
    memberCount: 4,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["mat_view", "finished_view", "task_view"],
    permissions: [],
    updatedAt: "2026-07-16 09:30"
  },
  {
    id: "role_brand_planner",
    name: "品牌策划",
    code: "BRAND_PLANNER",
    type: "preset",
    category: "other",
    description: "品牌视觉风格设定与商详视觉卡片审核",
    memberCount: 2,
    dataScope: "dept_tree",
    enabled: true,
    checkedKeys: ["qc_detail", "aiimg_view", "aiimg_generate", "finished_view", "mat_view"],
    permissions: [],
    updatedAt: "2026-07-15 17:10"
  },
  {
    id: "role_star_biz",
    name: "星图商务",
    code: "STAR_BIZ",
    type: "preset",
    category: "other",
    description: "星图达人接单、第三方视频引用与合作对接",
    memberCount: 3,
    dataScope: "dept_tree",
    enabled: true,
    checkedKeys: ["tp_view", "tp_import", "tp_export", "tp_tags", "finished_view"],
    permissions: [],
    updatedAt: "2026-07-14 11:20"
  },
  {
    id: "role_live_assist",
    name: "直播助理",
    code: "LIVE_ASSIST",
    type: "preset",
    category: "other",
    description: "直播间切片推流、实时挂车与现场协助",
    memberCount: 5,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["finished_view", "mat_view", "task_view", "task_update"],
    permissions: [],
    updatedAt: "2026-07-13 19:00"
  },
  {
    id: "role_live_anchor",
    name: "直播主播",
    code: "LIVE_ANCHOR",
    type: "preset",
    category: "other",
    description: "直播出镜与录屏切片归档授权",
    memberCount: 6,
    dataScope: "self",
    enabled: true,
    checkedKeys: ["finished_view", "mat_view"],
    permissions: [],
    updatedAt: "2026-07-12 16:10"
  },
  {
    id: "role_live_head",
    name: "直播负责人",
    code: "LIVE_HEAD",
    type: "preset",
    category: "other",
    description: "直播部门业务统筹、排期与切片发布管理",
    memberCount: 2,
    dataScope: "dept_tree",
    enabled: true,
    checkedKeys: ["finished_view", "finished_upload", "mat_view", "task_view", "task_create", "ad_view"],
    permissions: [],
    updatedAt: "2026-07-11 14:00"
  },
  {
    id: "role_ops_head",
    name: "运营负责人",
    code: "OPS_HEAD",
    type: "preset",
    category: "other",
    description: "整体电商运营策略、投放效果监控与大盘调度",
    memberCount: 3,
    dataScope: "all",
    enabled: true,
    checkedKeys: ALL_PERMISSION_KEYS.filter(k => !k.startsWith("sys_")),
    permissions: [],
    updatedAt: "2026-07-10 10:00"
  },
  {
    id: "role_content_head",
    name: "内容负责人",
    code: "CONTENT_HEAD",
    type: "preset",
    category: "other",
    description: "内容生产质量控制、AI复刻模版审批与团队质检",
    memberCount: 2,
    dataScope: "all",
    enabled: true,
    checkedKeys: ALL_PERMISSION_KEYS.filter(k => k !== "sys_roles" && k !== "sys_users"),
    permissions: [],
    updatedAt: "2026-07-09 15:40"
  }
];

export const INITIAL_MEMBERS: AccountMember[] = [
  {
    id: "mem_1001",
    employeeNo: "ZS-001",
    name: "张总",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    phone: "13800138000",
    email: "zhang@dreamchang.com",
    deptId: "dept_root",
    roleIds: ["role_super_admin"],
    roleName: "超级管理员",
    dataScope: "all",
    status: "normal",
    createdAt: "2025-12-16",
    lastActiveAt: "2026-07-24 20:15",
    logCount: 142,
    remark: "创始人 & CEO"
  },
  {
    id: "mem_1002",
    employeeNo: "ZS-002",
    name: "王大锤",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
    phone: "13912345678",
    email: "wang@dreamchang.com",
    deptId: "dept_1",
    roleIds: ["role_dept_head"],
    roleName: "部门负责人/主管",
    dataScope: "dept_tree",
    status: "normal",
    createdAt: "2026-01-10",
    lastActiveAt: "2026-07-24 19:40",
    logCount: 89,
    remark: "电商投放一部总监"
  },
  {
    id: "mem_1003",
    employeeNo: "ZS-003",
    name: "张小花",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    phone: "13422223333",
    email: "zhangxh@dreamchang.com",
    deptId: "dept_1",
    roleIds: ["role_pitcher"],
    roleName: "广告投手 (Media Buyer)",
    dataScope: "self",
    status: "normal",
    createdAt: "2026-01-12",
    lastActiveAt: "2026-07-24 18:22",
    logCount: 64,
    remark: "千川爆款女装主投手"
  },
  {
    id: "mem_1004",
    employeeNo: "ZS-004",
    name: "李阿牛",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop",
    phone: "13788889999",
    email: "li@dreamchang.com",
    deptId: "dept_2",
    roleIds: ["role_dept_head"],
    roleName: "部门负责人/主管",
    dataScope: "dept_tree",
    status: "normal",
    createdAt: "2026-02-01",
    lastActiveAt: "2026-07-24 17:05",
    logCount: 51,
    remark: "腾讯与快手渠道负责人"
  },
  {
    id: "mem_1005",
    employeeNo: "ZS-005",
    name: "赵铁柱",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop",
    phone: "13511112222",
    email: "zhao@dreamchang.com",
    deptId: "dept_2",
    roleIds: ["role_pitcher"],
    roleName: "广告投手 (Media Buyer)",
    dataScope: "self",
    status: "normal",
    createdAt: "2026-02-10",
    lastActiveAt: "2026-07-24 15:30",
    logCount: 38
  },
  {
    id: "mem_1006",
    employeeNo: "ZS-006",
    name: "陈编导",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    phone: "13655554444",
    email: "chen@dreamchang.com",
    deptId: "dept_3",
    roleIds: ["role_editor"],
    roleName: "AI视频剪辑师",
    dataScope: "dept_tree",
    status: "normal",
    createdAt: "2026-02-15",
    lastActiveAt: "2026-07-24 14:10",
    logCount: 72,
    remark: "负责脚本拆解与爆款Hook研究"
  },
  {
    id: "mem_1007",
    employeeNo: "ZS-007",
    name: "刘财务",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    phone: "13977778888",
    email: "liu@dreamchang.com",
    deptId: "dept_root",
    roleIds: ["role_analyst"],
    roleName: "数据分析与财务观察员",
    dataScope: "all",
    status: "normal",
    createdAt: "2026-03-01",
    lastActiveAt: "2026-07-23 16:45",
    logCount: 19,
    remark: "监控充值扣费与投放ROI"
  },
  {
    id: "mem_1008",
    employeeNo: "ZS-008",
    name: "孙实习",
    phone: "13899990000",
    email: "sun@dreamchang.com",
    deptId: "dept_4",
    roleIds: ["role_editor"],
    roleName: "AI视频剪辑师",
    dataScope: "self",
    status: "pending",
    createdAt: "2026-07-20",
    lastActiveAt: "尚未登录",
    logCount: 0,
    remark: "新邀请剪辑师，等待激活"
  }
];

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "log_1",
    actorName: "张总 (CEO)",
    actorRole: "超级管理员",
    actionType: "角色权限变更",
    targetName: "王大锤 (部门负责人)",
    ip: "110.88.23.104",
    timestamp: "2026-07-24 20:12",
    status: "success",
    details: "向角色【部门负责人】授与【一键同步投放】控制面板按钮权限"
  },
  {
    id: "log_2",
    actorName: "王大锤",
    actorRole: "部门负责人",
    actionType: "账户授权",
    targetName: "巨量千川-黄金海岸推广账户 (174950182740)",
    ip: "110.88.24.18",
    timestamp: "2026-07-24 19:35",
    status: "success",
    details: "将千川广告主账号映射指派给投手: 张小花"
  },
  {
    id: "log_3",
    actorName: "张小花",
    actorRole: "广告投手",
    actionType: "一键投放",
    targetName: "成片《夏日复古法式耳环15秒爆款》",
    ip: "110.88.24.99",
    timestamp: "2026-07-24 18:20",
    status: "success",
    details: "成功将成片推送至巨量千川账户 (预算: ¥1,000/天)"
  },
  {
    id: "log_4",
    actorName: "张总 (CEO)",
    actorRole: "超级管理员",
    actionType: "账号创建",
    targetName: "孙实习 (sun@dreamchang.com)",
    ip: "110.88.23.104",
    timestamp: "2026-07-20 11:30",
    status: "success",
    details: "发送组织邀请链接并设定角色为【AI视频剪辑师】"
  }
];

export default function AccountManagementView() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"depts" | "members" | "credits" | "audit">("credits");

  // --- Credits / Points Management State ---
  const [creditMode, setCreditMode] = useState<"quota" | "wallet">("quota");
  const [creditsSubTab, setCreditsSubTab] = useState<"config" | "details">("config");
  const [detailsSubTab, setDetailsSubTab] = useState<"user_summary" | "detail_list">("user_summary");

  // Balance stats state
  const [remainingCredits, setRemainingCredits] = useState(2615);
  const [normalRecharge, setNormalRecharge] = useState(0);
  const [giftRecharge, setGiftRecharge] = useState(5000);
  const [actualSpend, setActualSpend] = useState(2385);

  // Global quota config state
  const [globalDailyLimit, setGlobalDailyLimit] = useState("300");
  const [globalMonthlyLimit, setGlobalMonthlyLimit] = useState("10000");

  // Custom credit config state
  const [customConfigs, setCustomConfigs] = useState<CustomCreditConfig[]>([
    {
      id: "cc_1",
      name: "特殊",
      dailyLimit: "3000",
      monthlyLimit: "0",
      applicableUser: "梁靖淇",
      creator: "焕丽女王",
      enabled: true,
      createdAt: "2026-04-22 17:00:12"
    }
  ]);

  // Custom credit config filters
  const [customFilterName, setCustomFilterName] = useState("");
  const [customFilterUser, setCustomFilterUser] = useState("all");
  const [customFilterStatus, setCustomFilterStatus] = useState("all");

  // Custom credit config modal state
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [editingCustomConfig, setEditingCustomConfig] = useState<CustomCreditConfig | null>(null);
  const [customForm, setCustomForm] = useState({
    name: "",
    applicableUser: "梁靖淇",
    dailyLimit: "",
    monthlyLimit: "",
    enabled: true
  });

  // Recharge Modal state
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeTierIndex, setRechargeTierIndex] = useState(3); // default 创意尊享
  const [corporateModalOpen, setCorporateModalOpen] = useState(false);

  // Details filters
  const [detailsUserFilter, setDetailsUserFilter] = useState("all");
  const [detailsStartDate, setDetailsStartDate] = useState("");
  const [detailsEndDate, setDetailsEndDate] = useState("");
  const [selectedUserDetailName, setSelectedUserDetailName] = useState<string | null>(null);

  // Credit Handlers
  const handleSaveGlobalQuota = () => {
    appendAuditLog("消息通知", "积分管理", `更新全局配置：每日限制${globalDailyLimit || 0}，每月限制${globalMonthlyLimit || 0}`);
    showToast("✅ 全局积分额度保存成功！");
  };

  const handleOpenCustomModal = (item?: CustomCreditConfig) => {
    if (item) {
      setEditingCustomConfig(item);
      setCustomForm({
        name: item.name,
        applicableUser: item.applicableUser,
        dailyLimit: item.dailyLimit,
        monthlyLimit: item.monthlyLimit,
        enabled: item.enabled
      });
    } else {
      setEditingCustomConfig(null);
      setCustomForm({
        name: "",
        applicableUser: members[0]?.name || "梁靖淇",
        dailyLimit: "",
        monthlyLimit: "",
        enabled: true
      });
    }
    setCustomModalOpen(true);
  };

  const handleSaveCustomConfig = () => {
    if (!customForm.name.trim()) {
      showToast("⚠️ 请输入配置名称");
      return;
    }
    if (editingCustomConfig) {
      setCustomConfigs(prev => prev.map(c => c.id === editingCustomConfig.id ? {
        ...c,
        name: customForm.name.trim(),
        applicableUser: customForm.applicableUser,
        dailyLimit: customForm.dailyLimit,
        monthlyLimit: customForm.monthlyLimit,
        enabled: customForm.enabled
      } : c));
      showToast("✅ 已成功更新个性化配置");
    } else {
      const newConfig: CustomCreditConfig = {
        id: `cc_${Date.now()}`,
        name: customForm.name.trim(),
        applicableUser: customForm.applicableUser,
        dailyLimit: customForm.dailyLimit,
        monthlyLimit: customForm.monthlyLimit,
        creator: "焕丽女王",
        enabled: customForm.enabled,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setCustomConfigs(prev => [newConfig, ...prev]);
      showToast("✅ 已成功新增个性化配置");
    }
    setCustomModalOpen(false);
  };

  const handleDeleteCustomConfig = (id: string) => {
    if (confirm("确定要删除该个性化配置吗？")) {
      setCustomConfigs(prev => prev.filter(c => c.id !== id));
      showToast("🗑️ 已删除个性化配置");
    }
  };

  const handleToggleCustomConfig = (id: string) => {
    setCustomConfigs(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    showToast("⚡ 状态已更替");
  };

  const handleSimulatePayment = () => {
    const tier = RECHARGE_TIERS[rechargeTierIndex];
    setRemainingCredits(prev => prev + tier.creditsNum);
    setNormalRecharge(prev => prev + tier.baseCredits);
    setGiftRecharge(prev => prev + tier.bonusCredits);
    showToast(`🎉 充值成功！已实时到账 ${tier.creditsDisplay} 积分`);
    setRechargeModalOpen(false);
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationCategory[]>(() => {
    const saved = localStorage.getItem("cloud_video_notification_settings");
    if (!saved) return INITIAL_NOTIFICATION_CATEGORIES;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_NOTIFICATION_CATEGORIES;
    }
  });

  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<string[]>([]);
  const [configModalItem, setConfigModalItem] = useState<{
    catId: string;
    itemId: string;
    title: string;
    description: string;
  } | null>(null);
  const [customDescInput, setCustomDescInput] = useState("");

  // Spend config modal state for "当日消耗增长"
  const [spendModalOpen, setSpendModalOpen] = useState(false);
  const [spendModalCatId, setSpendModalCatId] = useState("");
  const [spendValue, setSpendValue] = useState("10000");
  const [growthValue, setGrowthValue] = useState("30");

  const handleOpenSpendModal = (catId: string, item: NotificationItem) => {
    setSpendModalCatId(catId);
    const spendMatch = item.description.match(/当日消耗大于\s*([0-9a-zA-Z_x]+||\d+)(?:¥)?/);
    const growthMatch = item.description.match(/涨幅大于\s*([0-9a-zA-Z_x]+||\d+)(?:%)?/);
    
    // Parse existing numbers or fall back to default
    const foundSpend = item.description.match(/(\d+)\s*¥/);
    const foundGrowth = item.description.match(/(\d+)\s*%/);

    setSpendValue(foundSpend ? foundSpend[1] : "10000");
    setGrowthValue(foundGrowth ? foundGrowth[1] : "30");
    setSpendModalOpen(true);
  };

  const handleSaveSpendConfig = () => {
    const sVal = spendValue.trim() || "10000";
    const gVal = growthValue.trim() || "30";
    const newDesc = `当日消耗大于 ${sVal}¥ 并且涨幅大于 ${gVal}%，管理员收到消息提醒`;

    setNotifications(prev => prev.map(cat => {
      if (cat.id !== spendModalCatId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== "daily_spend_growth") return item;
          return { ...item, description: newDesc };
        })
      };
    }));

    showToast("✅ 已成功保存【当日消耗增长】配置");
    setSpendModalOpen(false);
  };

  const toggleCollapseCategory = (catId: string) => {
    setCollapsedCategoryIds(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleToggleEnable = (catId: string, itemId: string) => {
    setNotifications(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, enabled: !item.enabled };
        })
      };
    }));
  };

  const handleToggleChannel = (catId: string, itemId: string, channelKey: "mobile" | "feishu") => {
    setNotifications(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            channels: {
              ...item.channels,
              [channelKey]: !item.channels[channelKey]
            }
          };
        })
      };
    }));
  };

  const handleOpenConfigModal = (catId: string, item: NotificationItem) => {
    setConfigModalItem({
      catId,
      itemId: item.id,
      title: item.title,
      description: item.description
    });
    setCustomDescInput(item.description);
  };

  const handleSaveConfigModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configModalItem) return;
    const trimmed = customDescInput.trim();
    if (!trimmed) {
      showToast("场景规则描述不能为空", "error");
      return;
    }
    setNotifications(prev => prev.map(cat => {
      if (cat.id !== configModalItem.catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== configModalItem.itemId) return item;
          return { ...item, description: trimmed };
        })
      };
    }));
    showToast(`✅ 已更新【${configModalItem.title}】的场景提醒规则`);
    setConfigModalItem(null);
  };

  const handleSaveNotificationSettings = () => {
    localStorage.setItem("cloud_video_notification_settings", JSON.stringify(notifications));
    appendAuditLog("消息通知", "消息通知偏好", "成功更新并持久化保存系统的消息通知偏好设置");
    showToast("✅ 消息通知设置保存成功！");
  };

  // Local Storage state hooks
  const [depts, setDepts] = useState<DeptNode[]>(() => {
    const saved = localStorage.getItem("cloud_video_depts");
    return saved ? JSON.parse(saved) : INITIAL_DEPTS;
  });

  const [members, setMembers] = useState<AccountMember[]>(() => {
    const saved = localStorage.getItem("cloud_video_members");
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [roles, setRoles] = useState<RolePermission[]>(() => {
    const saved = localStorage.getItem("cloud_video_roles");
    if (!saved) return INITIAL_ROLES;
    try {
      const parsed: RolePermission[] = JSON.parse(saved);
      let staffRole = parsed.find(r => r.id === "role_staff" || r.name === "普通员工");
      if (!staffRole) {
        staffRole = {
          id: "role_staff",
          name: "普通员工",
          code: "STAFF",
          type: "preset",
          category: "default",
          description: "标准员工基础权限，支持剪辑、素材与爆款复刻协作",
          memberCount: 18,
          dataScope: "self",
          enabled: true,
          checkedKeys: CREATION_KEYS,
          permissions: [],
          updatedAt: "2026-07-24 10:00"
        };
      } else {
        staffRole = { ...staffRole, id: "role_staff", name: "普通员工", category: "default" as const };
      }

      const otherRoles = parsed
        .filter(r => r.id !== "role_staff" && r.name !== "普通员工")
        .map(r => ({ ...r, category: "other" as const }));

      return [staffRole, ...otherRoles];
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("cloud_video_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("cloud_video_depts", JSON.stringify(depts));
  }, [depts]);

  useEffect(() => {
    localStorage.setItem("cloud_video_members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("cloud_video_roles", JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem("cloud_video_logs", JSON.stringify(logs));
  }, [logs]);

  // Toast State
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper audit logger
  const appendAuditLog = (actionType: AuditLog["actionType"], targetName: string, details: string) => {
    const newLog: AuditLog = {
      id: "log_" + Date.now(),
      actorName: "当前账户 (管理员)",
      actorRole: "超级管理员",
      actionType,
      targetName,
      ip: "127.0.0.1 (本地局域网)",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "success",
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // --- Search & Filtering States ---
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberFilterDept, setMemberFilterDept] = useState("all");
  const [memberFilterRole, setMemberFilterRole] = useState("all");
  const [memberFilterStatus, setMemberFilterStatus] = useState("all");

  // Selected Members for Bulk Action
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // --- Modals State ---
  // Dept Modal
  const [deptModal, setDeptModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: DeptNode } | null>(null);
  const [deptForm, setDeptForm] = useState({
    name: "",
    code: "",
    levelType: "department" as "department" | "group",
    parentId: "dept_root",
    manager: "",
    phone: "",
    quota: 10,
    type: "投放组" as DeptNode["type"],
    description: ""
  });

  // Member Modal
  const DEFAULT_PLATFORM_PASSWORD = "Dc@20258888";
  const [memberModal, setMemberModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: AccountMember } | null>(null);
  const [resetPasswordModal, setResetPasswordModal] = useState<{
    open: boolean;
    member: AccountMember;
    resetType: "default" | "custom" | "random";
    customPassword: string;
    notifyUser: boolean;
    forceNextChange: boolean;
  } | null>(null);
  const getDeptAndGroupFromId = (id: string, deptsList: DeptNode[]) => {
    const item = deptsList.find(d => d.id === id);
    if (!item) {
      const defaultDept = deptsList.find(d => d.parentId === "dept_root" || d.id === "dept_root" || d.levelType === "department");
      return { deptId: defaultDept?.id || "dept_root", groupId: "" };
    }
    const parent = deptsList.find(d => d.id === item.parentId);
    if (parent && parent.id !== "dept_root") {
      return { deptId: parent.id, groupId: item.id };
    } else {
      return { deptId: item.id, groupId: "" };
    }
  };

  const [memberForm, setMemberForm] = useState({
    name: "",
    employeeNo: "",
    phone: "",
    email: "",
    selectedDeptId: "",
    selectedGroupId: "",
    deptId: "",
    roleId: "",
    dataScope: "self" as AccountMember["dataScope"],
    status: "normal" as AccountMember["status"],
    boundAccount: "巨量千川-千川主账号01 (1776342461268999)",
    remark: ""
  });

  // Quick Invite Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteDeptId, setInviteDeptId] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  // Role Edit Modal
  const [roleModal, setRoleModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: RolePermission } | null>(null);
  const [roleForm, setRoleForm] = useState<{
    name: string;
    code: string;
    category: "default" | "other";
    description: string;
    dataScope: RolePermission["dataScope"];
    permissions: ModulePermission[];
  }>({
    name: "",
    code: "",
    category: "other",
    description: "",
    dataScope: "self",
    permissions: ALL_MODULES.map(m => ({ moduleKey: m.key, moduleName: m.name, actions: { ...DEFAULT_ACTIONS } }))
  });

  // --- Tab 3: Tree Permission State & Helpers ---
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role_staff");
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    new Set([
      "home",
      "quick_creation",
      "agent_creation",
      "video_remake",
      "ai_video",
      "ai_image",
      "canvas",
      "task_collaboration",
      "materials",
      "finished_videos",
      "assets_library",
      "ad_delivery",
      "account_management"
    ])
  );

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const toggleExpand = (nodeId: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getAllLeafKeys = (node: PermissionNode): string[] => {
    if (!node.children || node.children.length === 0) {
      return [node.id];
    }
    return node.children.flatMap(getAllLeafKeys);
  };

  const getAllNodeKeys = (node: PermissionNode): string[] => {
    let keys = [node.id];
    if (node.children) {
      node.children.forEach(child => {
        keys = keys.concat(getAllNodeKeys(child));
      });
    }
    return keys;
  };

  const getNodeStatus = (node: PermissionNode, checkedSet: Set<string>): "checked" | "unchecked" | "indeterminate" => {
    const leaves = getAllLeafKeys(node);
    const checkedLeaves = leaves.filter(k => checkedSet.has(k));
    if (checkedLeaves.length === leaves.length) return "checked";
    if (checkedLeaves.length === 0) return "unchecked";
    return "indeterminate";
  };

  const handleToggleNode = (node: PermissionNode) => {
    if (!selectedRole) return;
    const currentCheckedSet = new Set(selectedRole.checkedKeys || []);
    const status = getNodeStatus(node, currentCheckedSet);
    const keysToModify = getAllNodeKeys(node);

    let newCheckedSet = new Set(currentCheckedSet);
    if (status === "checked") {
      keysToModify.forEach(k => newCheckedSet.delete(k));
    } else {
      keysToModify.forEach(k => newCheckedSet.add(k));
    }

    const updatedKeys = Array.from(newCheckedSet);
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, checkedKeys: updatedKeys } : r));
  };

  const handleToggleRoleEnabled = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, enabled: !(r.enabled ?? true) } : r));
  };

  const handleSelectAllTree = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, checkedKeys: ALL_PERMISSION_KEYS } : r));
  };

  const handleClearAllTree = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, checkedKeys: [] } : r));
  };

  const handleCopyRole = (roleToCopy: RolePermission, e: React.MouseEvent) => {
    e.stopPropagation();
    if (roleToCopy.category === "default" || roleToCopy.id === "role_staff") {
      showToast("默认角色【普通员工】不可复制", "error");
      return;
    }
    const newRole: RolePermission = {
      id: "role_" + Date.now(),
      name: `${roleToCopy.name} (副本)`,
      code: `${roleToCopy.code}_COPY`,
      type: "custom",
      category: "other",
      description: roleToCopy.description,
      memberCount: 0,
      dataScope: roleToCopy.dataScope,
      enabled: roleToCopy.enabled ?? true,
      checkedKeys: [...(roleToCopy.checkedKeys || [])],
      permissions: roleToCopy.permissions || [],
      updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16)
    };
    setRoles(prev => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    appendAuditLog("角色权限变更", newRole.name, `复制创建角色【${newRole.name}】`);
    showToast(`✅ 已复制创建【${newRole.name}】，请在右侧勾选所需权限`);
  };

  const handleSaveRolePermissions = () => {
    if (!selectedRole) return;
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, updatedAt: timestamp } : r));
    appendAuditLog("角色权限变更", selectedRole.name, `保存角色【${selectedRole.name}】的权限配置`);
    showToast(`✅ 角色【${selectedRole.name}】权限配置已保存！`);
  };

  // Tree Node Renderer Component
  const renderTreeNode = (node: PermissionNode, depth = 0) => {
    const currentCheckedSet = new Set(selectedRole?.checkedKeys || []);
    const status = getNodeStatus(node, currentCheckedSet);
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.id);

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-purple-50/40 transition-colors ${
            depth === 0 ? "font-bold text-slate-900 border-b border-slate-100 py-2" : "text-slate-700"
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {/* Expand Arrow */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(node.id)}
              className="w-4 h-4 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Checkbox */}
          <button
            type="button"
            onClick={() => handleToggleNode(node)}
            className={`w-4 h-4 rounded border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
              status === "checked"
                ? "bg-purple-600 border-purple-600 text-white shadow-2xs"
                : status === "indeterminate"
                ? "bg-purple-600 border-purple-600 text-white shadow-2xs"
                : "border-slate-300 bg-white hover:border-purple-400"
            }`}
          >
            {status === "checked" && <Check className="w-3 h-3 stroke-[3]" />}
            {status === "indeterminate" && <div className="w-2 h-0.5 bg-white rounded-full" />}
          </button>

          {/* Label */}
          <span 
            onClick={() => handleToggleNode(node)}
            className="select-none cursor-pointer text-xs font-semibold hover:text-purple-700"
          >
            {node.label}
          </span>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Batch Import Modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");

  // ================= DEPARTMENT HANDLERS =================
  const handleOpenAddDept = (parentDeptId?: string, targetLevelType?: "department" | "group") => {
    let resolvedLevelType: "department" | "group" = targetLevelType || "department";
    if (!targetLevelType) {
      if (parentDeptId && parentDeptId !== "dept_root") {
        resolvedLevelType = "group";
      } else {
        resolvedLevelType = "department";
      }
    }

    const firstDept = depts.find(d => d.parentId === "dept_root" && d.id !== "dept_root")?.id || "dept_1";
    const defaultParentId = resolvedLevelType === "department" ? "dept_root" : (parentDeptId && parentDeptId !== "dept_root" ? parentDeptId : firstDept);

    setDeptForm({
      name: "",
      code: (resolvedLevelType === "group" ? "GRP-" : "DEPT-") + Math.floor(100 + Math.random() * 900),
      levelType: resolvedLevelType,
      parentId: defaultParentId,
      manager: "",
      phone: "",
      quota: resolvedLevelType === "group" ? 5 : 10,
      type: "投放组",
      description: ""
    });
    setDeptModal({ open: true, mode: "add" });
  };

  const handleOpenEditDept = (dept: DeptNode) => {
    const rawType = dept.levelType === "company" ? "department" : dept.levelType;
    const resolvedLevelType: "department" | "group" = rawType || (dept.parentId === "dept_root" ? "department" : "group");

    setDeptForm({
      name: dept.name,
      code: dept.code,
      levelType: resolvedLevelType,
      parentId: dept.parentId || "dept_root",
      manager: dept.manager,
      phone: dept.phone,
      quota: dept.quota,
      type: dept.type,
      description: dept.description
    });
    setDeptModal({ open: true, mode: "edit", data: dept });
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim()) {
      showToast("名称不能为空", "error");
      return;
    }

    // Force parentId rule:
    // If levelType === "department", parent MUST be "dept_root" (Company: 梦畅AIGC)
    let finalParentId = deptForm.parentId;
    if (deptForm.levelType === "department") {
      finalParentId = "dept_root";
    }

    if (deptModal?.mode === "add") {
      const newDept: DeptNode = {
        id: "dept_" + Date.now(),
        name: deptForm.name,
        code: deptForm.code || (deptForm.levelType === "group" ? "GRP-NEW" : "DEPT-NEW"),
        parentId: finalParentId,
        levelType: deptForm.levelType,
        manager: deptForm.manager || "未设定",
        phone: deptForm.phone || "-",
        memberCount: 0,
        quota: deptForm.quota || 10,
        type: deptForm.type,
        description: deptForm.description || (deptForm.levelType === "group" ? "全新设立分组" : "全新设立部门"),
        createdAt: new Date().toISOString().slice(0, 10),
        status: "active"
      };
      setDepts([...depts, newDept]);
      appendAuditLog("部门更替", newDept.name, `新建${deptForm.levelType === "group" ? "分组" : "部门"}【${newDept.name}】(编号: ${newDept.code})`);
      showToast(`✅ 成功创建${deptForm.levelType === "group" ? "分组" : "部门"}【${newDept.name}】！`);
    } else if (deptModal?.data) {
      const updated = depts.map(d => {
        if (d.id === deptModal.data!.id) {
          return {
            ...d,
            name: deptForm.name,
            code: deptForm.code,
            parentId: finalParentId,
            levelType: deptForm.levelType,
            manager: deptForm.manager,
            phone: deptForm.phone,
            quota: deptForm.quota,
            type: deptForm.type,
            description: deptForm.description
          };
        }
        return d;
      });
      setDepts(updated);
      appendAuditLog("部门更替", deptForm.name, `更新${deptForm.levelType === "group" ? "分组" : "部门"}【${deptForm.name}】的基本配置与信息`);
      showToast(`✅ ${deptForm.levelType === "group" ? "分组" : "部门"}【${deptForm.name}】配置更新成功！`);
    }
    setDeptModal(null);
  };

  const handleDeleteDept = (id: string) => {
    const dept = depts.find(d => d.id === id);
    if (!dept) return;

    // Check members inside
    const memberInDept = members.filter(m => m.deptId === id);
    if (memberInDept.length > 0) {
      if (!confirm(`部门【${dept.name}】下目前尚有 ${memberInDept.length} 名成员，解散后人员将被移至根组织。是否确定继续解散？`)) {
        return;
      }
      setMembers(prev => prev.map(m => m.deptId === id ? { ...m, deptId: "dept_root" } : m));
    } else {
      if (!confirm(`确定要解散并注销部门【${dept.name}】吗？此操作无法撤销。`)) return;
    }

    setDepts(prev => prev.filter(d => d.id !== id));
    appendAuditLog("部门更替", dept.name, `解散部门【${dept.name}】，原成员已安全重定向`);
    showToast(`🗑️ 部门【${dept.name}】已成功解散！`);
  };

  // ================= MEMBER HANDLERS =================
  const handleMemberDeptChange = (newDeptId: string) => {
    const groups = depts.filter(g => g.parentId === newDeptId);
    const newGroupId = groups[0]?.id || "";
    const finalDeptId = newGroupId || newDeptId;
    setMemberForm(prev => ({
      ...prev,
      selectedDeptId: newDeptId,
      selectedGroupId: newGroupId,
      deptId: finalDeptId
    }));
  };

  const handleMemberGroupChange = (newGroupId: string) => {
    const finalDeptId = newGroupId || memberForm.selectedDeptId;
    setMemberForm(prev => ({
      ...prev,
      selectedGroupId: newGroupId,
      deptId: finalDeptId
    }));
  };

  const handleOpenAddMember = () => {
    const nextNo = "ZS-" + Math.floor(100 + Math.random() * 900);
    const firstDept = depts.find(d => d.parentId === "dept_root" && d.id !== "dept_root") || depts.find(d => d.id === "dept_root") || depts[0];
    const selDeptId = firstDept?.id || "dept_root";
    const availableGroups = depts.filter(g => g.parentId === selDeptId);
    const selGroupId = availableGroups[0]?.id || "";
    const finalDeptId = selGroupId || selDeptId;

    setMemberForm({
      name: "",
      employeeNo: nextNo,
      phone: "",
      email: "",
      selectedDeptId: selDeptId,
      selectedGroupId: selGroupId,
      deptId: finalDeptId,
      roleId: roles[2]?.id || roles[0]?.id || "",
      dataScope: "self",
      status: "normal",
      boundAccount: "巨量千川-千川主账号01 (1776342461268999)",
      remark: ""
    });
    setMemberModal({ open: true, mode: "add" });
  };

  const handleOpenEditMember = (m: AccountMember) => {
    const { deptId: selDeptId, groupId: selGroupId } = getDeptAndGroupFromId(m.deptId, depts);
    setMemberForm({
      name: m.name,
      employeeNo: m.employeeNo,
      phone: m.phone,
      email: m.email,
      selectedDeptId: selDeptId,
      selectedGroupId: selGroupId,
      deptId: selGroupId || selDeptId || m.deptId,
      roleId: m.roleIds[0] || "",
      dataScope: m.dataScope || "self",
      status: m.status,
      boundAccount: m.boundAccount || "巨量千川-千川主账号01 (1776342461268999)",
      remark: m.remark || ""
    });
    setMemberModal({ open: true, mode: "edit", data: m });
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) {
      showToast("成员姓名不能为空", "error");
      return;
    }
    if (!memberForm.phone.trim() || memberForm.phone.length < 8) {
      showToast("请输入有效手机号码", "error");
      return;
    }

    const matchedRole = roles.find(r => r.id === memberForm.roleId);
    const roleName = matchedRole ? matchedRole.name : "普通成员";

    if (memberModal?.mode === "add") {
      const newMember: AccountMember = {
        id: "mem_" + Date.now(),
        employeeNo: memberForm.employeeNo || "ZS-" + Math.floor(Math.random() * 899 + 100),
        name: memberForm.name,
        phone: memberForm.phone,
        email: memberForm.email || `${memberForm.phone}@dreamchang.com`,
        deptId: memberForm.deptId || "dept_root",
        roleIds: memberForm.roleId ? [memberForm.roleId] : [],
        roleName,
        dataScope: memberForm.dataScope,
        status: memberForm.status,
        boundAccount: memberForm.boundAccount,
        createdAt: new Date().toISOString().slice(0, 10),
        lastActiveAt: "刚刚注册",
        logCount: 0,
        remark: memberForm.remark
      };

      setMembers([newMember, ...members]);
      // Update dept count
      setDepts(prev => prev.map(d => d.id === newMember.deptId ? { ...d, memberCount: d.memberCount + 1 } : d));

      appendAuditLog("账号创建", newMember.name, `手动录入成员【${newMember.name}】(${newMember.employeeNo})，角色设为【${roleName}】`);
      showToast(`✅ 成员【${newMember.name}】账号录入成功！`);
    } else if (memberModal?.data) {
      const prevDeptId = memberModal.data.deptId;
      const updated = members.map(m => {
        if (m.id === memberModal.data!.id) {
          return {
            ...m,
            name: memberForm.name,
            employeeNo: memberForm.employeeNo,
            phone: memberForm.phone,
            email: memberForm.email,
            deptId: memberForm.deptId,
            roleIds: [memberForm.roleId],
            roleName,
            dataScope: memberForm.dataScope,
            status: memberForm.status,
            boundAccount: memberForm.boundAccount,
            remark: memberForm.remark
          };
        }
        return m;
      });

      setMembers(updated);

      // Recalculate dept member counts if dept changed
      if (prevDeptId !== memberForm.deptId) {
        setDepts(prev => prev.map(d => {
          if (d.id === prevDeptId) return { ...d, memberCount: Math.max(0, d.memberCount - 1) };
          if (d.id === memberForm.deptId) return { ...d, memberCount: d.memberCount + 1 };
          return d;
        }));
      }

      appendAuditLog("角色权限变更", memberForm.name, `修改成员【${memberForm.name}】系统角色为【${roleName}】，数据范围为【${memberForm.dataScope}】`);
      showToast(`✅ 成员【${memberForm.name}】配置保存成功！`);
    }

    setMemberModal(null);
  };

  const handleToggleMemberStatus = (m: AccountMember) => {
    const nextStatus: AccountMember["status"] = m.status === "normal" ? "disabled" : "normal";
    setMembers(prev => prev.map(item => item.id === m.id ? { ...item, status: nextStatus } : item));
    appendAuditLog("状态变更", m.name, `调整账号【${m.name}】状态为【${nextStatus === "normal" ? "正常启用" : "禁用停用"}】`);
    showToast(`已${nextStatus === "normal" ? "解封" : "停用"}账号【${m.name}】`);
  };

  const handleDeleteMember = (id: string) => {
    const m = members.find(item => item.id === id);
    if (!m) return;
    if (!confirm(`确定要彻底注销并删除成员【${m.name}】吗？`)) return;

    setMembers(prev => prev.filter(item => item.id !== id));
    setDepts(prev => prev.map(d => d.id === m.deptId ? { ...d, memberCount: Math.max(0, d.memberCount - 1) } : d));

    appendAuditLog("敏感解绑", m.name, `注销系统成员【${m.name}】账号及其绑定的千川权限`);
    showToast(`🗑️ 成员【${m.name}】已被彻底移除！`);
  };

  // Reset Password Handlers
  const handleOpenResetPassword = (m: AccountMember) => {
    setResetPasswordModal({
      open: true,
      member: m,
      resetType: "default",
      customPassword: DEFAULT_PLATFORM_PASSWORD,
      notifyUser: true,
      forceNextChange: true
    });
  };

  const handleConfirmResetPassword = () => {
    if (!resetPasswordModal) return;
    const { member, resetType, customPassword, notifyUser } = resetPasswordModal;

    let finalPwd = DEFAULT_PLATFORM_PASSWORD;
    if (resetType === "custom" && customPassword.trim()) {
      finalPwd = customPassword.trim();
    } else if (resetType === "random") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
      finalPwd = Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    }

    appendAuditLog(
      "密码重置",
      member.name,
      `管理员重置了成员【${member.name}】（${member.phone || member.email}）的登录密码为【${finalPwd}】${notifyUser ? "，并向其发送了通知" : ""}`
    );

    try {
      navigator.clipboard.writeText(finalPwd);
      showToast(`🔑 成员【${member.name}】登录密码已重置为 [${finalPwd}]，已自动复制剪贴板！`);
    } catch {
      showToast(`🔑 成员【${member.name}】登录密码已成功重置为：${finalPwd}`);
    }

    setResetPasswordModal(null);
  };

  const handleBatchResetPassword = () => {
    if (selectedMemberIds.length === 0) return;
    const count = selectedMemberIds.length;
    if (!confirm(`确定要为选中的 ${count} 位成员重置登录密码为初始默认密码 [${DEFAULT_PLATFORM_PASSWORD}] 吗？`)) return;

    const memberNames = members.filter(m => selectedMemberIds.includes(m.id)).map(m => m.name).join("、");
    appendAuditLog("密码重置", `批量(${count}人)`, `批量重置成员【${memberNames}】的登录密码为初始默认密码 [${DEFAULT_PLATFORM_PASSWORD}]`);

    try {
      navigator.clipboard.writeText(DEFAULT_PLATFORM_PASSWORD);
      showToast(`🔑 已为选中的 ${count} 位成员批量重置登录密码为：${DEFAULT_PLATFORM_PASSWORD}（已复制）`);
    } catch {
      showToast(`🔑 已为选中的 ${count} 位成员批量重置登录密码为：${DEFAULT_PLATFORM_PASSWORD}`);
    }

    setSelectedMemberIds([]);
  };

  // Generate Quick Invite Link
  const handleOpenInviteModal = () => {
    setInviteDeptId(depts[0]?.id || "dept_root");
    setInviteRoleId(roles[2]?.id || roles[0]?.id || "");
    const generated = `https://sucaicloud.com/invite/join?org=dreamchang&dept=${depts[0]?.id || "root"}&code=${Math.random().toString(36).substring(2, 8)}`;
    setInviteLink(generated);
    setInviteModalOpen(true);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast("📋 专属邀请加入链接已成功复制到剪贴板！");
  };

  // Bulk Operations
  const handleSelectAllMembers = () => {
    if (selectedMemberIds.length === filteredMembers.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(filteredMembers.map(m => m.id));
    }
  };

  const handleBatchStatusChange = (status: AccountMember["status"]) => {
    if (selectedMemberIds.length === 0) return;
    setMembers(prev => prev.map(m => selectedMemberIds.includes(m.id) ? { ...m, status } : m));
    appendAuditLog("状态变更", `批量(${selectedMemberIds.length}人)`, `批量更改状态为: ${status}`);
    showToast(`已对所选 ${selectedMemberIds.length} 位成员执行批量状态变更`);
    setSelectedMemberIds([]);
  };

  // CSV Import
  const handleConfirmImportCsv = () => {
    if (!importCsvText.trim()) {
      showToast("请输入或粘贴 CSV 数据", "error");
      return;
    }
    const lines = importCsvText.trim().split("\n");
    let addedCount = 0;

    const newMems: AccountMember[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 2 && parts[0] !== "姓名") {
        const name = parts[0];
        const phone = parts[1];
        const roleStr = parts[2] || "广告投手 (Media Buyer)";
        const email = parts[3] || `${phone}@dreamchang.com`;

        newMems.push({
          id: "mem_csv_" + Date.now() + "_" + idx,
          employeeNo: "ZS-" + (500 + idx),
          name,
          phone,
          email,
          deptId: depts[1]?.id || "dept_root",
          roleIds: [roles[2]?.id || roles[0]?.id || ""],
          roleName: roleStr,
          dataScope: "self",
          status: "normal",
          createdAt: new Date().toISOString().slice(0, 10),
          lastActiveAt: "批量导入待激活",
          logCount: 0
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setMembers([...newMems, ...members]);
      appendAuditLog("账号创建", `CSV批量导入`, `批量导入成功 ${addedCount} 名人员`);
      showToast(`🎉 成功批量导入 ${addedCount} 名成员账号！`);
      setImportCsvText("");
      setImportModalOpen(false);
    } else {
      showToast("解析数据格式错误，请按 [姓名,手机号,角色,邮箱] 填写", "error");
    }
  };

  // Export CSV
  const handleExportMembersCsv = () => {
    const header = "工号,姓名,手机号,邮箱,部门,角色,数据权限,状态,创建日期\n";
    const body = filteredMembers.map(m => {
      const deptName = depts.find(d => d.id === m.deptId)?.name || "主公司";
      return `"${m.employeeNo}","${m.name}","${m.phone}","${m.email}","${deptName}","${m.roleName}","${m.dataScope}","${m.status}","${m.createdAt}"`;
    }).join("\n");

    const blob = new Blob(["\uFEFF" + header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `云视频管家_组织人员导出一览表_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("📥 组织人员表 CSV 导出完毕！");
  };

  // ================= ROLE HANDLERS =================
  const handleOpenAddRole = () => {
    setRoleForm({
      name: "",
      code: "ROLE_CUSTOM_" + Math.floor(Math.random() * 899 + 100),
      category: "other",
      description: "",
      dataScope: "self",
      permissions: ALL_MODULES.map(m => ({
        moduleKey: m.key,
        moduleName: m.name,
        actions: { ...DEFAULT_ACTIONS }
      }))
    });
    setRoleModal({ open: true, mode: "add" });
  };

  const handleOpenEditRole = (role: RolePermission) => {
    setRoleForm({
      name: role.name,
      code: role.code,
      category: role.category || "other",
      description: role.description,
      dataScope: role.dataScope,
      permissions: JSON.parse(JSON.stringify(role.permissions))
    });
    setRoleModal({ open: true, mode: "edit", data: role });
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = roleForm.name.trim();
    if (!trimmedName) {
      showToast("请填写角色名称", "error");
      return;
    }

    if (roleModal?.mode === "add") {
      const newRole: RolePermission = {
        id: "role_" + Date.now(),
        name: trimmedName,
        code: roleForm.code || ("ROLE_CUSTOM_" + Date.now().toString().slice(-4)),
        type: "custom",
        category: "other",
        description: roleForm.description.trim() || "自定义部门角色",
        memberCount: 0,
        dataScope: roleForm.dataScope || "self",
        enabled: true,
        checkedKeys: ["home_view", "home_quick_entry"],
        permissions: [],
        updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16)
      };
      setRoles(prev => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      appendAuditLog("角色权限变更", newRole.name, `新建角色【${newRole.name}】并定位进行权限勾选`);
      showToast(`✅ 角色【${newRole.name}】已创建！请在右侧勾选控制权限`);
    } else if (roleModal?.data) {
      const updated = roles.map(r => {
        if (r.id === roleModal.data!.id) {
          return {
            ...r,
            name: trimmedName,
            description: roleForm.description.trim(),
            updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16)
          };
        }
        return r;
      });
      setRoles(updated);
      appendAuditLog("角色权限变更", trimmedName, `修改角色【${trimmedName}】名称及描述`);
      showToast(`✅ 角色【${trimmedName}】修改成功！`);
    }

    setRoleModal(null);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (!role) return;
    if (role.category === "default" || role.id === "role_staff") {
      showToast("默认角色【普通员工】不可删除", "error");
      return;
    }
    if (!confirm(`确定要删除角色【${role.name}】吗？`)) return;

    setRoles(prev => prev.filter(r => r.id !== id));
    if (selectedRoleId === id) {
      setSelectedRoleId("role_staff");
    }
    appendAuditLog("角色权限变更", role.name, `删除角色【${role.name}】`);
    showToast(`🗑️ 角色【${role.name}】已成功删除`);
  };

  // Toggle single action inside Role Matrix Form
  const handleToggleMatrixAction = (moduleKey: string, actionKey: keyof PermissionActions) => {
    setRoleForm(prev => {
      const updatedPerms = prev.permissions.map(pm => {
        if (pm.moduleKey === moduleKey) {
          return {
            ...pm,
            actions: {
              ...pm.actions,
              [actionKey]: !pm.actions[actionKey]
            }
          };
        }
        return pm;
      });
      return { ...prev, permissions: updatedPerms };
    });
  };

  // Toggle whole column in Role Matrix
  const handleToggleMatrixColumn = (actionKey: keyof PermissionActions, enableAll: boolean) => {
    setRoleForm(prev => {
      const updatedPerms = prev.permissions.map(pm => ({
        ...pm,
        actions: {
          ...pm.actions,
          [actionKey]: enableAll
        }
      }));
      return { ...prev, permissions: updatedPerms };
    });
  };

  // --- Member Filtering Logic ---
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.phone.includes(memberSearchQuery) ||
      m.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.employeeNo.toLowerCase().includes(memberSearchQuery.toLowerCase());

    const matchesDept = memberFilterDept === "all" || m.deptId === memberFilterDept;
    const matchesRole = memberFilterRole === "all" || m.roleIds.includes(memberFilterRole);
    const matchesStatus = memberFilterStatus === "all" || m.status === memberFilterStatus;

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 space-y-6">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border animate-bounce ${
          toast.type === "success" ? "bg-emerald-900/90 text-white border-emerald-500/40" :
          toast.type === "error" ? "bg-rose-900/90 text-white border-rose-500/40" :
          "bg-slate-900/90 text-white border-slate-700"
        }`}>
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Workspace Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-purple-500/15 shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>系统管理</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenInviteModal}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>快捷邀请成员</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("credits")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "credits"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>积分管理</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "audit"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>系统操作安全日志 ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: 组织部门架构 (DEPARTMENT ARCHITECTURE TREE LIST VIEW) */}
      {activeTab === "depts" && (() => {
        // Build Ordered Dept Tree List
        const orderedDeptList: Array<DeptNode & { depth: number; parentName: string }> = [];
        const processedSet = new Set<string>();

        const addChildrenNodes = (parentId: string | null, depth: number) => {
          const children = depts.filter(d => d.parentId === parentId);
          for (const child of children) {
            if (processedSet.has(child.id)) continue;
            processedSet.add(child.id);
            const parent = depts.find(p => p.id === child.parentId);
            orderedDeptList.push({
              ...child,
              depth,
              parentName: parent ? parent.name : "无 (1级顶级根节点)"
            });
            addChildrenNodes(child.id, depth + 1);
          }
        };

        addChildrenNodes(null, 0);

        // Fallback for any orphan departments
        for (const d of depts) {
          if (!processedSet.has(d.id)) {
            const parent = depts.find(p => p.id === d.parentId);
            orderedDeptList.push({
              ...d,
              depth: 1,
              parentName: parent ? parent.name : "已知顶级节点"
            });
          }
        }

        // Search & Filter state inside Tab
        return (
          <div className="space-y-6">
            {/* Dept Summary & Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">最高公司实体</p>
                  <p className="text-sm font-bold text-slate-900 truncate">梦畅AIGC</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">组织架构标准</p>
                  <p className="text-sm font-bold text-slate-900 truncate">公司 &gt; 部门 &gt; 分组 &gt; 人员</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">部门 / 分组数量</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {depts.filter(d => d.parentId === "dept_root" && d.id !== "dept_root").length} 部门 / {depts.filter(d => d.parentId && d.parentId !== "dept_root").length} 分组
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">总在职成员/编制</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{members.length} / 50 人</p>
                </div>
              </div>
            </div>

            {/* Tree List Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-black text-slate-800">组织部门架构表 (公司 &gt; 部门 &gt; 分组 &gt; 人员)</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddDept("dept_root", "department")}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增部门/分组</span>
                  </button>
                </div>
              </div>

              {/* Department Tree Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-4 min-w-[280px]">组织架构名称 & 节点级别</th>
                      <th className="p-4 min-w-[110px]">编号</th>
                      <th className="p-4 min-w-[160px]">上级层级</th>
                      <th className="p-4 min-w-[110px]">职责类型</th>
                      <th className="p-4 min-w-[130px]">负责人</th>
                      <th className="p-4 min-w-[150px]">编制与现有成员</th>
                      <th className="p-4 min-w-[90px]">状态</th>
                      <th className="p-4 text-right min-w-[180px]">架构管理操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {orderedDeptList.map((d) => {
                      const deptMembers = members.filter(m => m.deptId === d.id);
                      const isRoot = d.id === "dept_root";
                      const isDept = !isRoot && d.parentId === "dept_root";
                      const isGroup = !isRoot && d.parentId !== "dept_root";

                      // Calculate indent spacing based on tree depth
                      const indentPadding = d.depth === 0 ? "pl-4" : d.depth === 1 ? "pl-9" : "pl-16";

                      return (
                        <tr key={d.id} className={`hover:bg-purple-50/30 transition-colors ${isRoot ? "bg-purple-50/20 font-bold" : ""}`}>
                          {/* Column 1: Department Name & Hierarchy visual */}
                          <td className={`p-4 ${indentPadding}`}>
                            <div className="flex items-center gap-2.5">
                              {/* Tree branch connector graphic for child nodes */}
                              {d.depth > 0 && (
                                <span className="text-purple-400 font-mono font-bold flex items-center shrink-0 select-none">
                                  <span className="text-purple-300 mr-0.5">└──</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                                </span>
                              )}

                              <div className={`p-2 rounded-xl shrink-0 ${
                                isRoot 
                                  ? "bg-purple-600 text-white shadow-xs" 
                                  : isDept 
                                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                                  : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                              }`}>
                                <Building2 className="w-4 h-4" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-black text-slate-900 ${isRoot ? "text-sm text-purple-950" : "text-xs"}`}>
                                    {d.name}
                                  </span>

                                  {isRoot && (
                                    <span className="bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                                      1级公司
                                    </span>
                                  )}

                                  {isDept && (
                                    <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-purple-200">
                                      部门
                                    </span>
                                  )}

                                  {isGroup && (
                                    <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                                      分组
                                    </span>
                                  )}
                                </div>

                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-md">
                                  {d.description || "暂无职能说明"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Code */}
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                              {d.code}
                            </span>
                          </td>

                          {/* Column 3: Parent Department Name */}
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                              isRoot 
                                ? "bg-slate-100 text-slate-400 border border-slate-200" 
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}>
                              <Building2 className="w-3 h-3" />
                              <span>{isRoot ? "无上级 (最高公司)" : d.parentName}</span>
                            </span>
                          </td>

                          {/* Column 4: Type Tag */}
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                              {d.type}
                            </span>
                          </td>

                          {/* Column 5: Manager */}
                          <td className="p-4">
                            <div className="font-bold text-slate-800">
                              <span>{d.manager || "未设定"}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{d.phone}</p>
                          </td>

                          {/* Column 6: Member Count & Quota */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px] font-mono font-bold">
                                <span className="text-purple-700">{deptMembers.length} 人在职</span>
                                <span className="text-slate-400">上限 {d.quota}</span>
                              </div>
                              <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-purple-600 h-full rounded-full transition-all" 
                                  style={{ width: `${Math.min(100, (deptMembers.length / d.quota) * 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>

                          {/* Column 7: Status */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              正常启用
                            </span>
                          </td>

                          {/* Column 8: Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isRoot && (
                                <button
                                  onClick={() => handleOpenAddDept("dept_root", "department")}
                                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-purple-200"
                                  title="在公司下新增部门/分组"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>新增部门/分组</span>
                                </button>
                              )}

                              {isDept && (
                                <button
                                  onClick={() => handleOpenAddDept(d.id, "group")}
                                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-purple-200"
                                  title="在部门下新增分组"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>新增分组</span>
                                </button>
                              )}

                              {isGroup && (
                                <button
                                  onClick={() => {
                                    setActiveTab("members");
                                    setMemberFilterDept(d.id);
                                  }}
                                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-indigo-200"
                                  title="查看分组成员"
                                >
                                  <Users className="w-3 h-3 text-indigo-600" />
                                  <span>查看人员 ({deptMembers.length})</span>
                                </button>
                              )}


                              <button
                                onClick={() => handleOpenEditDept(d)}
                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title={isRoot ? "修改公司信息" : isDept ? "修改部门配置" : "修改分组配置"}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {!isRoot && (
                                <button
                                  onClick={() => handleDeleteDept(d.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title={isDept ? "解散此部门" : "解散此分组"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: 人员账号管理 (MEMBER MANAGEMENT) */}
      {activeTab === "members" && (
        <div className="space-y-5">
          
          {/* Action & Filter Toolbar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">企业人员与账号一览</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">支持按手机号/邮箱快捷邀请、CSV批量导入导出、变更角色与数据全生命周期管理</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportMembersCsv}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出人员表 (CSV)</span>
                </button>

                <button
                  onClick={() => setImportModalOpen(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>批量导入人员</span>
                </button>

                <button
                  onClick={handleOpenAddMember}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>新增人员</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              
              {/* Search Box */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="搜索姓名 / 手机号 / 邮箱 / 工号..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                />
              </div>

              {/* Department Filter */}
              <div>
                <select
                  value={memberFilterDept}
                  onChange={(e) => setMemberFilterDept(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="all">全部组织部门</option>
                  {depts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={memberFilterRole}
                  onChange={(e) => setMemberFilterRole(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="all">全部系统角色</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={memberFilterStatus}
                  onChange={(e) => setMemberFilterStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="all">全部账号状态</option>
                  <option value="normal">正常启用</option>
                  <option value="bound">账号绑定</option>
                  <option value="pending">待激活邀请</option>
                  <option value="disabled">已禁用封禁</option>
                </select>
              </div>

            </div>

            {/* Bulk Action Controls if items selected */}
            {selectedMemberIds.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 flex items-center justify-between text-xs animate-fade-in">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                  已选中 <strong className="text-rose-600 font-black">{selectedMemberIds.length}</strong> 位成员
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBatchStatusChange("normal")}
                    className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer hover:bg-emerald-700"
                  >
                    批量解封启用
                  </button>
                  <button
                    onClick={() => handleBatchStatusChange("disabled")}
                    className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg cursor-pointer hover:bg-rose-700"
                  >
                    批量停用禁用
                  </button>
                  <button
                    onClick={handleBatchResetPassword}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>批量重置密码</span>
                  </button>
                  <button
                    onClick={() => setSelectedMemberIds([])}
                    className="px-2.5 py-1 text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
                  >
                    取消选择
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-[10.5px] uppercase font-bold tracking-wider">
                    <th className="p-4 w-10 text-center">
                      <button onClick={handleSelectAllMembers} className="cursor-pointer">
                        {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">成员基础信息</th>
                    <th className="p-4">所属部门</th>
                    <th className="p-4">绑定岗位角色</th>
                    <th className="p-4">账号状态</th>
                    <th className="p-4">注册/活跃时间</th>
                    <th className="p-4 text-right">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMembers.map((m) => {
                    const dept = depts.find(d => d.id === m.deptId);
                    const isSelected = selectedMemberIds.includes(m.id);

                    return (
                      <tr
                        key={m.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          isSelected ? "bg-purple-50/40" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              if (isSelected) setSelectedMemberIds(selectedMemberIds.filter(id => id !== m.id));
                              else setSelectedMemberIds([...selectedMemberIds, m.id]);
                            }}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 text-sm">{m.name}</span>
                                <span className="text-[9.5px] bg-slate-100 font-mono text-slate-500 px-1.5 py-0.2 rounded font-bold">
                                  {m.employeeNo}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                <span>{m.phone}</span>
                                <span>•</span>
                                <span>{m.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {dept ? (
                            <span className="bg-purple-50 text-purple-900 text-xs px-2.5 py-1 rounded-full border border-purple-200/80 font-bold">
                              {dept.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">未分配部门</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className="bg-indigo-50 text-indigo-900 text-xs px-2.5 py-1 rounded-full border border-indigo-200/80 font-bold">
                            {m.roleName}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === "normal" ? "bg-emerald-100 text-emerald-800" :
                            m.status === "bound" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                            m.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {m.status === "normal" ? "正常" : m.status === "bound" ? "账号绑定" : m.status === "pending" ? "待激活" : "已停用"}
                          </span>
                          {m.status === "bound" && m.boundAccount && (
                            <div className="text-[10px] text-purple-600 font-mono mt-0.5 truncate max-w-[130px]" title={m.boundAccount}>
                              {m.boundAccount}
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-mono text-[11px] text-slate-500">
                          <div>{m.createdAt}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{m.lastActiveAt}</div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleMemberStatus(m)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                m.status === "normal" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={m.status === "normal" ? "停用账号" : "解封账号"}
                            >
                              {m.status === "normal" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleOpenEditMember(m)}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="编辑角色与部门"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenResetPassword(m)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="重置登录密码"
                            >
                              <Key className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="注销删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 bg-white">
                        <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold">未找到符合条件的人员信息</p>
                        <p className="text-[10px] text-slate-400 mt-1">请尝试清空筛选条件或点击右上角“新增人员”</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      {/* TAB 5: 积分管理 (CREDITS MANAGEMENT) */}
      {activeTab === "credits" && (
        <div className="space-y-6 animate-fade-in font-sans">
          {/* Header Bar with Title and Mode Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>积分管理</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                当前模式: <strong className="text-purple-700">{creditMode === "quota" ? "配额模式" : "钱包模式"}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextMode = creditMode === "quota" ? "wallet" : "quota";
                  setCreditMode(nextMode);
                  showToast(`已切换为【${nextMode === "quota" ? "配额模式" : "钱包模式"}】`);
                }}
                className="text-purple-600 hover:text-purple-700 font-bold text-xs cursor-pointer flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>与 {creditMode === "quota" ? "钱包模式" : "配额模式"} 切换</span>
              </button>
            </div>
          </div>

          {/* Top 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: 剩余积分 */}
            <div className="bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border border-purple-100 rounded-2xl p-5 shadow-2xs flex items-center gap-4 relative overflow-hidden">
              <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-sm shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">剩余积分</div>
                <div className="text-2xl font-black text-purple-700 tracking-tight">
                  {remainingCredits.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Card 2: 普通充值 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">普通充值</div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {normalRecharge.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Card 3: 赠送充值 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">赠送充值</div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {giftRecharge.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Card 4: 实际消耗 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                  <span>实际消耗</span>
                  <span title="统计所有成员在创作中消耗的实际积分">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {actualSpend.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar & Recharge Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 gap-3">
            <div className="flex items-center gap-6 text-sm font-extrabold">
              <button
                type="button"
                onClick={() => setCreditsSubTab("config")}
                className={`pb-2 relative transition-colors cursor-pointer ${
                  creditsSubTab === "config" ? "text-purple-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>积分配置</span>
                {creditsSubTab === "config" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setCreditsSubTab("details")}
                className={`pb-2 relative transition-colors cursor-pointer ${
                  creditsSubTab === "details" ? "text-purple-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>积分明细</span>
                {creditsSubTab === "details" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            </div>

            {/* Recharge Action Button */}
            <button
              type="button"
              onClick={() => setRechargeModalOpen(true)}
              className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Wallet className="w-4 h-4" />
              <span>积分充值 &gt;</span>
            </button>
          </div>

          {/* SUB-VIEW 1: 积分配置 (CREDITS CONFIG) */}
          {creditsSubTab === "config" && (
            <div className="space-y-8 animate-fade-in">
              {/* SECTION 1: 全局配置 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">全局配置</h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/70 rounded-full text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>全局配置为所有用户统一设置可使用的积分额度</span>
                  </div>
                </div>

                <div className="space-y-3.5 max-w-xl text-xs pt-2">
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-slate-600 font-bold text-right shrink-0">每日限制</label>
                    <input
                      type="text"
                      value={globalDailyLimit}
                      onChange={(e) => setGlobalDailyLimit(e.target.value)}
                      className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-slate-500">个积分/人 <span className="text-slate-400">(0或放空为不限制)</span></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-20 text-slate-600 font-bold text-right shrink-0">每月限制</label>
                    <input
                      type="text"
                      value={globalMonthlyLimit}
                      onChange={(e) => setGlobalMonthlyLimit(e.target.value)}
                      className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-slate-500">个积分/人 <span className="text-slate-400">(0或放空为不限制)</span></span>
                  </div>

                  <div className="pt-2 pl-23">
                    <button
                      type="button"
                      onClick={handleSaveGlobalQuota}
                      className="px-6 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 个性化配置 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">个性化配置</h3>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/70 rounded-full text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>针对特定用户或用户群体设置专属的可使用积分额度</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCustomModal()}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新增个性化配置</span>
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <input
                    type="text"
                    value={customFilterName}
                    onChange={(e) => setCustomFilterName(e.target.value)}
                    placeholder="请输入名称"
                    className="w-40 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />

                  <select
                    value={customFilterUser}
                    onChange={(e) => setCustomFilterUser(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-500 bg-white cursor-pointer"
                  >
                    <option value="all">请选择账户</option>
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>

                  <select
                    value={customFilterStatus}
                    onChange={(e) => setCustomFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-500 bg-white cursor-pointer"
                  >
                    <option value="all">全部状态</option>
                    <option value="enabled">已启用</option>
                    <option value="disabled">已禁用</option>
                  </select>

                  <button
                    type="button"
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    查询
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold text-[11px]">
                        <th className="py-3 px-5">名称</th>
                        <th className="py-3 px-5">积分配置明细</th>
                        <th className="py-3 px-5">适用用户</th>
                        <th className="py-3 px-5">创建人</th>
                        <th className="py-3 px-5 text-center">开关</th>
                        <th className="py-3 px-5">创建时间</th>
                        <th className="py-3 px-5 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 font-medium text-slate-700">
                      {customConfigs
                        .filter(c => !customFilterName || c.name.includes(customFilterName))
                        .filter(c => customFilterUser === "all" || c.applicableUser === customFilterUser)
                        .filter(c => customFilterStatus === "all" || (customFilterStatus === "enabled" ? c.enabled : !c.enabled))
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-purple-50/20 transition-colors">
                            <td className="py-3.5 px-5 font-bold text-slate-900">{item.name}</td>
                            <td className="py-3.5 px-5 text-slate-600">
                              每日限制{item.dailyLimit || "0"}个积分 每月限制{item.monthlyLimit || "0"}个积分
                            </td>
                            <td className="py-3.5 px-5 font-bold text-slate-800">{item.applicableUser}</td>
                            <td className="py-3.5 px-5 text-slate-600">{item.creator}</td>
                            <td className="py-3.5 px-5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCustomConfig(item.id)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  item.enabled ? "bg-purple-600" : "bg-slate-200"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                    item.enabled ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="py-3.5 px-5 text-slate-400 text-[11px] font-mono">{item.createdAt}</td>
                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleOpenCustomModal(item)}
                                className="text-purple-600 hover:text-purple-700 font-extrabold mr-3 cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomConfig(item.id)}
                                className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>共 {customConfigs.length} 条</span>
                  <div className="flex items-center gap-3">
                    <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-700">
                      <option>50条/页</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
                      <span className="w-6 h-6 rounded bg-purple-600 text-white font-bold flex items-center justify-center">1</span>
                      <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&gt;</button>
                    </div>
                    <span>前往 <input type="text" defaultValue="1" className="w-8 border border-slate-200 rounded px-1 py-0.5 text-center text-xs" /> 页</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: 积分明细 (CREDITS DETAILS) */}
          {creditsSubTab === "details" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6 animate-fade-in">
              {/* Nested Sub Tabs: 个人消耗汇总 vs 消耗明细 */}
              <div className="flex items-center gap-6 border-b border-slate-100 pb-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setDetailsSubTab("user_summary"); setSelectedUserDetailName(null); }}
                  className={`relative transition-colors cursor-pointer ${
                    detailsSubTab === "user_summary" ? "text-purple-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>个人消耗汇总</span>
                  {detailsSubTab === "user_summary" && (
                    <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDetailsSubTab("detail_list")}
                  className={`relative transition-colors cursor-pointer ${
                    detailsSubTab === "detail_list" ? "text-purple-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>消耗明细 {selectedUserDetailName ? `(${selectedUserDetailName})` : ""}</span>
                  {detailsSubTab === "detail_list" && (
                    <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                  )}
                </button>
              </div>

              {/* Filter Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={detailsUserFilter}
                    onChange={(e) => setDetailsUserFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-purple-500 bg-white cursor-pointer"
                  >
                    <option value="all">请选择账户</option>
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="date"
                      value={detailsStartDate}
                      onChange={(e) => setDetailsStartDate(e.target.value)}
                      className="focus:outline-none bg-transparent"
                    />
                    <span>至</span>
                    <input
                      type="date"
                      value={detailsEndDate}
                      onChange={(e) => setDetailsEndDate(e.target.value)}
                      className="focus:outline-none bg-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    查询
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("📥 已将消耗表导出为 Excel 文件")}
                  className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>excel导出 ∨</span>
                </button>
              </div>

              {/* Table for 个人消耗汇总 */}
              {detailsSubTab === "user_summary" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold text-[11px]">
                          <th className="py-3 px-5">用户账号</th>
                          <th className="py-3 px-5">分组</th>
                          <th className="py-3 px-5">部门</th>
                          <th className="py-3 px-5">总消耗 ⇅</th>
                          <th className="py-3 px-5 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80 font-medium text-slate-700">
                        {USER_SPEND_SUMMARIES
                          .filter(s => detailsUserFilter === "all" || s.user === detailsUserFilter)
                          .map((row) => (
                            <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                              <td className="py-3.5 px-5 font-bold text-slate-900">{row.user}</td>
                              <td className="py-3.5 px-5 text-slate-600">{row.group}</td>
                              <td className="py-3.5 px-5 text-slate-600">{row.team}</td>
                              <td className="py-3.5 px-5 font-bold text-purple-700">{row.totalSpend}</td>
                              <td className="py-3.5 px-5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedUserDetailName(row.user);
                                    setDetailsSubTab("detail_list");
                                  }}
                                  className="text-purple-600 hover:text-purple-700 font-extrabold cursor-pointer hover:underline"
                                >
                                  明细
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                    <span>共 {USER_SPEND_SUMMARIES.length} 条</span>
                    <div className="flex items-center gap-3">
                      <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-700">
                        <option>50条/页</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
                        <span className="w-6 h-6 rounded bg-purple-600 text-white font-bold flex items-center justify-center">1</span>
                        <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&gt;</button>
                      </div>
                      <span>前往 <input type="text" defaultValue="1" className="w-8 border border-slate-200 rounded px-1 py-0.5 text-center text-xs" /> 页</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Table for 消耗明细 */}
              {detailsSubTab === "detail_list" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold text-[11px]">
                          <th className="py-3 px-5">用户账号</th>
                          <th className="py-3 px-5">分组</th>
                          <th className="py-3 px-5">消耗类型</th>
                          <th className="py-3 px-5">消耗积分</th>
                          <th className="py-3 px-5">关联业务/视频</th>
                          <th className="py-3 px-5">消耗时间</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80 font-medium text-slate-700">
                        {DETAILED_SPEND_RECORDS
                          .filter(r => !selectedUserDetailName || r.user === selectedUserDetailName)
                          .filter(r => detailsUserFilter === "all" || r.user === detailsUserFilter)
                          .map((row) => (
                            <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                              <td className="py-3.5 px-5 font-bold text-slate-900">{row.user}</td>
                              <td className="py-3.5 px-5 text-slate-600">{row.group}</td>
                              <td className="py-3.5 px-5 text-slate-800 font-semibold">{row.type}</td>
                              <td className="py-3.5 px-5 font-extrabold text-rose-600">-{row.credits}</td>
                              <td className="py-3.5 px-5 text-slate-600">{row.business}</td>
                              <td className="py-3.5 px-5 text-slate-400 text-[11px] font-mono">{row.time}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                    <span>共 {DETAILED_SPEND_RECORDS.length} 条</span>
                    <div className="flex items-center gap-3">
                      <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-700">
                        <option>50条/页</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
                        <span className="w-6 h-6 rounded bg-purple-600 text-white font-bold flex items-center justify-center">1</span>
                        <button type="button" className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">&gt;</button>
                      </div>
                      <span>前往 <input type="text" defaultValue="1" className="w-8 border border-slate-200 rounded px-1 py-0.5 text-center text-xs" /> 页</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: 系统操作安全日志 (AUDIT LOGS) */}
      {activeTab === "audit" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>企业敏感操作与全路径安全日志</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                实时不可篡改审计全链条操作：包含角色调整、账户授权、成片一键投放、状态切换及密码重置
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-[10.5px] uppercase font-bold tracking-wider">
                    <th className="p-4">操作时间</th>
                    <th className="p-4">操作主体 (人员/角色)</th>
                    <th className="p-4">动作类型</th>
                    <th className="p-4">受控目标/对象</th>
                    <th className="p-4">详情日志描述</th>
                    <th className="p-4">客户端 IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 font-mono">
                  {logs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 text-slate-500">{lg.timestamp}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900">{lg.actorName}</span>
                        <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {lg.actorRole}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-50 text-purple-800 text-[10px] px-2.5 py-1 rounded-full font-bold border border-purple-200">
                          {lg.actionType}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{lg.targetName}</td>
                      <td className="p-4 text-slate-600 font-sans max-w-md truncate" title={lg.details}>
                        {lg.details}
                      </td>
                      <td className="p-4 text-slate-400">{lg.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DEPARTMENT / GROUP FORM ================= */}
      {deptModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-purple-400" />
                <span>
                  {deptModal.mode === "add"
                    ? `新增${deptForm.levelType === "group" ? "分组" : "部门"}`
                    : `编辑${deptForm.levelType === "group" ? "分组" : "部门"}配置`}
                </span>
              </span>
              <button onClick={() => setDeptModal(null)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="p-6 space-y-4 text-xs">
              {/* Level Type Selector (only when non-root node) */}
              {deptModal.data?.id !== "dept_root" && (
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">架构节点类型</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl font-bold text-center">
                    <button
                      type="button"
                      onClick={() => setDeptForm({ ...deptForm, levelType: "department", parentId: "dept_root" })}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        deptForm.levelType === "department"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      2级部门 (下设于公司)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const firstDept = depts.find(d => d.parentId === "dept_root" && d.id !== "dept_root")?.id || "dept_1";
                        setDeptForm({ ...deptForm, levelType: "group", parentId: firstDept });
                      }}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        deptForm.levelType === "group"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      3级分组 (下设于部门)
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">
                    {deptForm.levelType === "group" ? "分组名称 *" : "部门名称 *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder={deptForm.levelType === "group" ? "如: 千川剧本拆解小组" : "如: 电商投放三部"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">编号 (Code)</label>
                  <input
                    type="text"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">上级归属节点</label>
                {deptForm.levelType === "department" ? (
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-between">
                    <span>梦畅AIGC (最高公司)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">1级公司</span>
                  </div>
                ) : (
                  <select
                    value={deptForm.parentId}
                    onChange={(e) => setDeptForm({ ...deptForm, parentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {depts
                      .filter(d => d.parentId === "dept_root" && d.id !== "dept_root" && d.id !== deptModal.data?.id)
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.name} (部门)</option>
                      ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">负责人</label>
                  <input
                    type="text"
                    value={deptForm.manager}
                    onChange={(e) => setDeptForm({ ...deptForm, manager: e.target.value })}
                    placeholder="输入姓名 (如: 王大锤)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">编制数上限</label>
                  <input
                    type="number"
                    value={deptForm.quota}
                    onChange={(e) => setDeptForm({ ...deptForm, quota: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">职责简述</label>
                <textarea
                  rows={2}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="请输入主要业务责任与核心关注指标..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setDeptModal(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MEMBER FORM ================= */}
      {memberModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>{memberModal.mode === "add" ? "录入人员账号" : "编辑修改成员资料与角色"}</span>
              </span>
              <button onClick={() => setMemberModal(null)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">真实姓名 *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="如: 张小花"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">工号 (Employee ID)</label>
                  <input
                    type="text"
                    value={memberForm.employeeNo}
                    onChange={(e) => setMemberForm({ ...memberForm, employeeNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">手机号码 *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="138xxxx1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">工作邮箱</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    placeholder="username@dreamchang.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">所属部门 *</label>
                  <select
                    value={memberForm.selectedDeptId}
                    onChange={(e) => handleMemberDeptChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {depts
                      .filter(d => d.parentId === "dept_root" || d.id === "dept_root" || d.levelType === "department" || d.levelType === "company")
                      .map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">所属分组</label>
                  <select
                    value={memberForm.selectedGroupId}
                    onChange={(e) => handleMemberGroupChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {depts.filter(g => g.parentId === memberForm.selectedDeptId).length > 0 ? (
                      <>
                        <option value="">-- 选择分组 (可选) --</option>
                        {depts
                          .filter(g => g.parentId === memberForm.selectedDeptId)
                          .map(g => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                      </>
                    ) : (
                      <option value="">暂无下属分组</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">绑定岗位角色</label>
                  <select
                    value={memberForm.roleId}
                    onChange={(e) => setMemberForm({ ...memberForm, roleId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">账号状态</label>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="normal">正常启用</option>
                    <option value="bound">账号绑定</option>
                    <option value="pending">待激活 (发邀请短信)</option>
                    <option value="disabled">已禁用停用</option>
                  </select>
                </div>
              </div>

              {/* Conditional Bound Account Selector */}
              {memberForm.status === "bound" && (
                <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3 text-xs text-purple-900 space-y-1.5 animate-fade-in">
                  <label className="font-bold block text-purple-900">选择绑定的广告/媒体账号</label>
                  <select
                    value={memberForm.boundAccount}
                    onChange={(e) => setMemberForm({ ...memberForm, boundAccount: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-bold text-xs text-purple-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="巨量千川-千川主账号01 (1776342461268999)">巨量千川 - 千川主账号01 (1776342461268999)</option>
                    <option value="巨量千川-服装旗舰店账号 (1776342461268888)">巨量千川 - 服装旗舰店账号 (1776342461268888)</option>
                    <option value="抖音官方蓝V-美妆爆款运营账户">抖音官方蓝V - 美妆爆款运营账户</option>
                    <option value="快手磁力金牛-磁力推广01账户">快手磁力金牛 - 磁力推广01账户</option>
                    <option value="小红书聚光-品牌推广账户">小红书聚光 - 品牌推广账户</option>
                  </select>
                </div>
              )}

              {/* Password Info & Reset Trigger */}
              {memberModal.mode === "add" ? (
                <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3 text-xs text-purple-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-600" />
                    <span>平台登录密码说明</span>
                  </div>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    首次新增用户系统将分配默认登录密码 <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono font-bold text-purple-800">{DEFAULT_PLATFORM_PASSWORD}</code>。后续用户修改密码后若遗忘，随时可在账号列表中点击 <strong className="text-purple-900 font-extrabold">【重置密码】</strong> 进行恢复。
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-600" />
                      <span>平台登录密码管理</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      默认密码: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-slate-700">{DEFAULT_PLATFORM_PASSWORD}</code>。如成员遗忘个人修改后的密码，可直接重置。
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const mData = memberModal.data;
                      setMemberModal(null);
                      if (mData) handleOpenResetPassword(mData);
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl border border-amber-200 text-xs cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>重置密码</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setMemberModal(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  保存成员信息
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {resetPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>重置人员平台登录密码</span>
              </span>
              <button onClick={() => setResetPasswordModal(null)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* User Badge Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                <img
                  src={resetPasswordModal.member.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                  alt={resetPasswordModal.member.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <span>{resetPasswordModal.member.name}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                      {resetPasswordModal.member.roleName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    手机: {resetPasswordModal.member.phone || "未设置"} | 工号: {resetPasswordModal.member.employeeNo || "未分配"}
                  </div>
                </div>
              </div>

              {/* Reset Mode Selection */}
              <div className="space-y-2">
                <label className="text-slate-600 font-bold block">选择密码重置模式</label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    resetPasswordModal.resetType === "default"
                      ? "bg-purple-50/60 border-purple-300 ring-1 ring-purple-400 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}>
                    <input
                      type="radio"
                      name="resetType"
                      checked={resetPasswordModal.resetType === "default"}
                      onChange={() => setResetPasswordModal({ ...resetPasswordModal, resetType: "default", customPassword: DEFAULT_PLATFORM_PASSWORD })}
                      className="mt-0.5 accent-purple-600"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>恢复平台默认初始密码</span>
                        <code className="bg-white px-2 py-0.5 rounded border border-purple-200 font-mono font-bold text-purple-700">
                          {DEFAULT_PLATFORM_PASSWORD}
                        </code>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        推荐选项，格式统一便于团队账号重置与通知
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    resetPasswordModal.resetType === "random"
                      ? "bg-purple-50/60 border-purple-300 ring-1 ring-purple-400 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}>
                    <input
                      type="radio"
                      name="resetType"
                      checked={resetPasswordModal.resetType === "random"}
                      onChange={() => setResetPasswordModal({ ...resetPasswordModal, resetType: "random" })}
                      className="mt-0.5 accent-purple-600"
                    />
                    <div>
                      <div className="font-bold">随机生成 8 位高强度密码</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        随机混合包含大小写字母、数字与特殊字符
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    resetPasswordModal.resetType === "custom"
                      ? "bg-purple-50/60 border-purple-300 ring-1 ring-purple-400 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}>
                    <input
                      type="radio"
                      name="resetType"
                      checked={resetPasswordModal.resetType === "custom"}
                      onChange={() => setResetPasswordModal({ ...resetPasswordModal, resetType: "custom", customPassword: "" })}
                      className="mt-0.5 accent-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-bold">手动指定新密码</div>
                      {resetPasswordModal.resetType === "custom" && (
                        <input
                          type="text"
                          value={resetPasswordModal.customPassword}
                          onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, customPassword: e.target.value })}
                          placeholder="请输入 6~20 位新密码"
                          className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-purple-600"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={resetPasswordModal.notifyUser}
                    onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, notifyUser: e.target.checked })}
                    className="accent-purple-600 rounded"
                  />
                  <span>通过短信 / 工作通知向该成员推送新密码凭证</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={resetPasswordModal.forceNextChange}
                    onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, forceNextChange: e.target.checked })}
                    className="accent-purple-600 rounded"
                  />
                  <span>要求该成员下次登录时必须强制修改密码</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setResetPasswordModal(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPassword}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  <span>确认重置密码</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK INVITE ================= */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>生成专属邀请加入链接</span>
              </span>
              <button onClick={() => setInviteModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">预指派部门</label>
                <select
                  value={inviteDeptId}
                  onChange={(e) => setInviteDeptId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  {depts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">预赋予角色</label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-2">
                <span className="font-bold text-purple-900 block text-[11px]">生成链接 (有效期 7 天):</span>
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-mono text-[11px] text-purple-800 font-bold select-all"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制邀请链接</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ROLE FORM (ADD / EDIT NAME) ================= */}
      {roleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>{roleModal.mode === "add" ? "新增角色" : `重命名 / 修改角色 - ${roleModal.data?.name}`}</span>
              </span>
              <button onClick={() => setRoleModal(null)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">角色名称 *</label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="例如：爆款编导 / 资深千川投手"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-purple-500 text-sm"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">角色职责描述</label>
                <input
                  type="text"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="说明角色的主要职责与控制权限范畴（选填）"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              {roleModal.mode === "add" && (
                <div className="bg-purple-50 p-3 rounded-xl text-purple-800 text-[11px] leading-relaxed border border-purple-200">
                  💡 确认创建角色后，系统将回到角色与权限矩阵并自动选中该新角色，您可在右侧树状结构中直接勾选配置对应权限。
                </div>
              )}

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setRoleModal(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {roleModal.mode === "add" ? "确认创建" : "保存修改"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BATCH CSV IMPORT ================= */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>批量导入组织成员账号</span>
              </span>
              <button onClick={() => setImportModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-600 space-y-1 font-mono text-[11px]">
                <p className="font-bold text-slate-800 font-sans">数据格式规范说明 (每行一个人):</p>
                <p className="text-purple-700">姓名, 手机号, 角色, 邮箱</p>
                <p className="text-slate-400 text-[10px]">示例: 张三, 13800001111, 广告投手 (Media Buyer), zhangsan@dreamchang.com</p>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">粘贴 CSV 批量数据文本</label>
                <textarea
                  rows={6}
                  value={importCsvText}
                  onChange={(e) => setImportCsvText(e.target.value)}
                  placeholder="张三, 13800001111, 广告投手, zhangsan@dreamchang.com&#10;李四, 13900002222, AI视频剪辑师, lisi@dreamchang.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImportCsv}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  解析并导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SPEND GROWTH CONFIG (当日消耗增长配置) ================= */}
      {spendModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-3xl w-full p-6 text-slate-800 animate-fade-in relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  当日消耗增长配置
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSpendModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Trigger Rule */}
            <div className="space-y-3 mb-8">
              <div className="text-xs font-bold text-slate-700">触发规则</div>
              <div className="flex items-center gap-2.5 text-xs whitespace-nowrap">
                {/* Dropdown 1 */}
                <div className="relative shrink-0">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer">
                    <option>当日消耗大于</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Amount Input */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-purple-500 shrink-0">
                  <input
                    type="text"
                    value={spendValue}
                    onChange={(e) => setSpendValue(e.target.value)}
                    placeholder="请输入金额数值"
                    className="px-3 py-2 w-40 font-medium text-slate-800 focus:outline-none text-xs"
                  />
                  <div className="px-3 py-2 bg-slate-50 border-l border-slate-200 text-slate-400 text-xs font-medium select-none">
                    ¥
                  </div>
                </div>

                {/* Operator */}
                <span className="text-slate-700 font-bold text-xs px-1 shrink-0">并且</span>

                {/* Dropdown 2 */}
                <div className="relative shrink-0">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer">
                    <option>涨幅大于</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Growth Input */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-purple-500 shrink-0">
                  <input
                    type="text"
                    value={growthValue}
                    onChange={(e) => setGrowthValue(e.target.value)}
                    placeholder="请输入涨幅百分比"
                    className="px-3 py-2 w-40 font-medium text-slate-800 focus:outline-none text-xs"
                  />
                  <div className="px-3 py-2 bg-slate-50 border-l border-slate-200 text-slate-400 text-xs font-medium select-none">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSpendModalOpen(false)}
                className="px-5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveSpendConfig}
                className="px-5 py-1.5 bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NOTIFICATION CONFIG ================= */}
      {configModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-sm font-black flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                <span>修改场景提醒规则 - {configModalItem.title}</span>
              </span>
              <button onClick={() => setConfigModalItem(null)} className="p-1 hover:bg-slate-800 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveConfigModal} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">消息类型</label>
                <input
                  type="text"
                  disabled
                  value={configModalItem.title}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">场景说明 / 触发规则阈值 *</label>
                <textarea
                  rows={3}
                  required
                  value={customDescInput}
                  onChange={(e) => setCustomDescInput(e.target.value)}
                  placeholder="请输入场景提醒说明规则..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setConfigModalItem(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  保存规则
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 新增/编辑个性化配置 ================= */}
      {customModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden text-slate-800">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#7C3AED] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  {editingCustomConfig ? "编辑个性化配置" : "新增个性化配置"}
                </h3>
              </div>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCustomConfig();
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">
                  <span className="text-rose-500 mr-1">*</span>名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入名称"
                  value={customForm.name}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">
                  <span className="text-rose-500 mr-1">*</span>适用用户
                </label>
                <select
                  value={customForm.applicableUser}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, applicableUser: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800 cursor-pointer"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">每日限制</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="请输入限制数量"
                    value={customForm.dailyLimit}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, dailyLimit: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                  />
                  <span className="text-slate-500 whitespace-nowrap">个积分/人 <span className="text-slate-400 text-[11px]">(0或放空为不限制)</span></span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">每月限制</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="请输入限制数量"
                    value={customForm.monthlyLimit}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                  />
                  <span className="text-slate-500 whitespace-nowrap">个积分/人 <span className="text-slate-400 text-[11px]">(0或放空为不限制)</span></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-slate-700 font-bold">开关状态</label>
                <button
                  type="button"
                  onClick={() => setCustomForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    customForm.enabled ? "bg-purple-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      customForm.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
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

      {/* ================= MODAL: 积分充值 ================= */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-black tracking-tight">积分充值</h3>
              </div>
              <button
                onClick={() => setRechargeModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-xl cursor-pointer text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Left Column: Select Tier */}
              <div className="md:col-span-8 p-6 space-y-6">
                <div className="text-sm font-extrabold text-slate-900">请选择适合您的方案</div>

                {/* 4 Tiers Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {RECHARGE_TIERS.map((tier, idx) => {
                    const isSelected = rechargeTierIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setRechargeTierIndex(idx)}
                        className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between h-48 ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/40 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20"
                            : "border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Bonus Tag */}
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full shadow-2xs">
                            {tier.badge}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-black text-slate-800">{tier.title}</div>
                          <div className="text-lg font-black text-purple-700 mt-2">
                            {tier.creditsDisplay} <span className="text-[10px] font-bold text-slate-500">积分</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            {tier.includesText}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-slate-900">¥ {tier.price}</span>
                            <span className="text-[10px] text-slate-400 line-through">¥{tier.originalPrice}</span>
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            立省 ¥{tier.savePrice}
                          </div>
                        </div>

                        {/* Selected Check Icon */}
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-tl-xl rounded-br-xl">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Enterprise Corporate Transfer Promo Card */}
                <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span>企业大额充值推荐：对公转账</span>
                      <span className="px-1.5 py-0.2 bg-purple-600 text-white text-[9px] rounded font-bold">推荐</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl">
                      对公充值 5000元 起充，单次充值 5万元 以上尊享 20% 最高加赠比例（未满5万元亦享对应阶梯加赠），支持开具增值税专用发票。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCorporateModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    获取对公账户
                  </button>
                </div>
              </div>

              {/* Right Column: Checkout & Payment QR Code */}
              <div className="md:col-span-4 p-6 bg-slate-50/50 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-sm font-extrabold text-slate-900">购买方案</div>

                  {/* Summary Lines */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">{RECHARGE_TIERS[rechargeTierIndex].baseCredits.toLocaleString()} 积分</span>
                      <span className="font-extrabold text-slate-900">¥ {RECHARGE_TIERS[rechargeTierIndex].price}</span>
                    </div>
                    <div className="flex justify-between items-center text-purple-700 font-medium">
                      <span>活动赠送 {RECHARGE_TIERS[rechargeTierIndex].bonusCredits.toLocaleString()} 积分</span>
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-purple-700">¥ 0</span>
                        <span className="text-[10px] text-slate-400 line-through">¥{RECHARGE_TIERS[rechargeTierIndex].bonusValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>支付宝扫码支付</span>
                    </div>

                    {/* QR Code Mock Graphic */}
                    <div className="w-36 h-36 mx-auto bg-slate-900 p-2.5 rounded-2xl shadow-inner flex items-center justify-center relative group">
                      <div className="w-full h-full bg-white rounded-xl p-2 flex flex-col justify-between items-center relative overflow-hidden">
                        <div className="grid grid-cols-5 gap-1 w-full h-full">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={`rounded-[2px] ${i % 2 === 0 || i % 3 === 0 ? "bg-slate-900" : "bg-purple-100"}`} />
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-purple-600 bg-white p-1 rounded-lg shadow-sm" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-black text-slate-900">
                        ¥ {RECHARGE_TIERS[rechargeTierIndex].price}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-extrabold mt-0.5">
                        已优惠 ¥{RECHARGE_TIERS[rechargeTierIndex].savePrice}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>模拟扫码支付完成</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: 对公转账流程 ================= */}
      {corporateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden text-slate-800">
            {/* Header with back button */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400">积分充值</span>
                <span className="text-slate-300">&gt;</span>
                <button
                  onClick={() => setCorporateModalOpen(false)}
                  className="text-purple-600 hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>对公转账流程</span>
                </button>
              </div>
              <button
                onClick={() => setCorporateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 Card: 对公汇款 */}
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-200/60">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-black">1</span>
                    <span>第一步：对公汇款</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">账户名称：</span><span className="font-bold text-slate-900">厦门致上信息科技有限公司</span></div>
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">开户银行：</span><span className="font-medium text-slate-800">中国建设银行股份有限公司厦门滨东支行</span></div>
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">银行账号：</span><span className="font-mono font-bold text-purple-700">35101510001052510799</span></div>
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">汇款金额：</span><span className="font-bold text-emerald-600">¥5,000起充</span></div>
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">汇款备注：</span><span className="text-slate-600">公司名称+积分充值 <br /><span className="text-[11px] text-amber-600">(请尽量备注，有备注可更快为您充值到账~)</span></span></div>
                    <div className="flex"><span className="w-20 text-slate-400 shrink-0">联行号：</span><span className="font-mono text-slate-700">105393000499</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("账户名称：厦门致上信息科技有限公司\n开户银行：中国建设银行股份有限公司厦门滨东支行\n银行账号：35101510001052510799\n联行号：105393000499");
                      showToast("📋 已复制对公账户全套信息至剪贴板");
                    }}
                    className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制对公账户信息</span>
                  </button>
                </div>

                {/* Step 2 Card: 联系客服 */}
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-200/60">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-black">2</span>
                      <span>第二步：联系客服，完成积分充值</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      转账完成后，请提供订单号/银行盖章回执单，联系云视频管家客服。我们会尽快为您完成充值~
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span>客服专线：400-880-9988</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span>企业邮箱：vip@cloudvideo.com</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast("💬 已发起专属客服对话框，客服离线留言将在10分钟内响应");
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>联系专属客服充值</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
