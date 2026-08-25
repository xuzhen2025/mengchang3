import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import RightQueue from "./components/TaskQueuePanel";
import MaterialSelector from "./components/MaterialSelector";
import CreditsDashboard from "./components/CreditsDashboard";
import HomeView from "./components/HomeView";
import QuickCreationView from "./components/QuickCreationView";
import DetailSetsView from "./components/DetailSetsView";
import QualityEnhanceView from "./components/QualityEnhanceView";
import WatermarkSubtitleView from "./components/WatermarkSubtitleView";
import AiVideoView from "./components/AiVideoView";
import AiImageView from "./components/AiImageView";
import AssetsView from "./components/AssetsView";
import InfiniteCanvasView from "./components/InfiniteCanvasView";
import LiveManagementView from "./components/LiveManagementView";
import ResourcesView from "./components/ResourcesView";
import MaterialsView from "./components/MaterialsView";
import FinishedVideosView from "./components/FinishedVideosView";
import AdDeliveryView from "./components/AdDeliveryView";
import SameStyleVideoView from "./components/SameStyleVideoView";
import AgentCreationView from "./components/AgentCreationView";
import VideoRemakeView from "./components/VideoRemakeView";
import FissionView from "./components/FissionView";
import AccountManagementView from "./components/AccountManagementView";
import TaskCollaborationView, { TaskItem } from "./components/TaskCollaborationView";
import MessageCenterWorkspace from "./components/MessageCenterWorkspace";
import AdminView from "./components/AdminView";
import LoginView, { AppMode, PrototypeAccount } from "./components/LoginView";
import LogoutConfirmDialog from "./components/LogoutConfirmDialog";

import { 
  INITIAL_GALLERY, 
  INITIAL_ASSETS, 
  INITIAL_TASKS, 
  INITIAL_TRANSACTIONS,
  INITIAL_MESSAGES
} from "./data";
import { Asset, Task, CreditTransaction, GalleryItem, ActiveScreen, AppMessage, ResourceSearchIntent } from "./types";
import { Sparkles, Layers, Sliders, ChevronRight, Play } from "lucide-react";

const AUTH_STORAGE_KEY = "mengchang_prototype_session";

const PROTOTYPE_ACCOUNTS: PrototypeAccount[] = [
  {
    username: "chaojiguanliyuan",
    password: "123456",
    label: "超级管理员",
    description: "用户端与管理端",
    allowedModes: ["user", "admin"],
    defaultMode: "user",
  },
  {
    username: "putongyonghu",
    password: "123456",
    label: "普通用户",
    description: "仅用户端",
    allowedModes: ["user"],
    defaultMode: "user",
  },
  {
    username: "guanliyuan",
    password: "123456",
    label: "管理员",
    description: "仅管理端",
    allowedModes: ["admin"],
    defaultMode: "admin",
  },
];

interface PersistedSession {
  username: string;
  mode: AppMode;
}

const readPersistedSession = (): PersistedSession | null => {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as PersistedSession;
    const account = PROTOTYPE_ACCOUNTS.find((item) => item.username === parsed.username);
    if (!account) return null;
    return {
      username: account.username,
      mode: account.allowedModes.includes(parsed.mode) ? parsed.mode : account.defaultMode,
    };
  } catch {
    return null;
  }
};

export default function App() {
  const initialSession = readPersistedSession();
  const [session, setSession] = useState<PersistedSession | null>(initialSession);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // Navigation & UI States (supports back stack)
  const [screenHistory, setScreenHistory] = useState<ActiveScreen[]>(["home"]);
  const activeScreen = screenHistory[screenHistory.length - 1] || "home";
  const [selectedTaskForCollaboration, setSelectedTaskForCollaboration] = useState<TaskItem | null>(null);
  const [selectedTaskTabForCollaboration, setSelectedTaskTabForCollaboration] = useState<"to_me" | "my_published" | "all">("all");
  const [resourceSearchIntent, setResourceSearchIntent] = useState<ResourceSearchIntent | null>(null);
  const [activeAgentSessionId, setActiveAgentSessionId] = useState<string | null>(null);

  const handleNavigate = (screen: ActiveScreen) => {
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
  };

  const handleBack = () => {
    setScreenHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return ["home"];
    });
  };

  const handleSidebarNavigate = (screen: ActiveScreen) => {
    if (screen === "resources") {
      setResourceSearchIntent(null);
    }
    if (screen === "agent_creation") {
      setActiveAgentSessionId(null);
    }
    setScreenHistory([screen]);
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Mode switching state (用户端 vs 管理端)
  const [appMode, setAppMode] = useState<AppMode>(initialSession?.mode ?? "user");
  const [adminActiveScreen, setAdminActiveScreen] = useState<string>("content_management");

  const currentAccount = session
    ? PROTOTYPE_ACCOUNTS.find((account) => account.username === session.username) ?? null
    : null;

  const handleLogin = (account: PrototypeAccount) => {
    const nextSession = { username: account.username, mode: account.defaultMode };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setAppMode(account.defaultMode);
    setScreenHistory(["home"]);
    setAdminActiveScreen("content_management");
  };

  const handleModeChange = (mode: AppMode) => {
    if (!currentAccount?.allowedModes.includes(mode)) return;
    const nextSession = { username: currentAccount.username, mode };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setAppMode(mode);
    setIsQueueOpen(false);
  };

  const handleConfirmLogout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setLogoutDialogOpen(false);
    setSession(null);
    setAppMode("user");
    setScreenHistory(["home"]);
    setAdminActiveScreen("content_management");
    setIsQueueOpen(false);
  };

  // App core states
  const [credits, setCredits] = useState(100.00);
  const [extraRequestedCredits, setExtraRequestedCredits] = useState(350.00);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<AppMessage[]>(INITIAL_MESSAGES);

  // Credit Application Workflow (Closed-Loop)
  const handleRequestCredits = (amount: number, reason: string) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    
    const newMsg: AppMessage = {
      id: `msg_credits_app_${Date.now()}`,
      category: "审批待办",
      subcategory: "积分申请",
      type: "积分申请",
      title: `额外积分申请: ${amount} 积分`,
      detail: `申请人: 算法推荐部 - 汤小真 申请积分: ${amount} 积分 申请说明: ${reason} 审批状态: 待审核`,
      summary: `申请人: 算法推荐部 - 汤小真 申请积分: ${amount} 积分 申请说明: ${reason}`,
      status: "unread",
      time: timeStr,
      isRedDot: true,
      eventCode: "CREDIT_APPLICATION_SUBMITTED",
      template: "approval",
      severity: "warning",
      actorName: "汤小真（申请人）",
      recipientNames: ["李部长（审批人）"],
      sourceType: "积分申请单",
      sourceId: `CA-${Date.now()}`,
      businessStatus: "待审批",
      approvalType: "credits",
      approvalStatus: "pending",
      creditsAmount: amount,
      applicantName: "算法推荐部 - 汤小真",
      managerName: "技术研发部 - 李部长",
      details: [
        { label: "申请人", value: "算法推荐部 - 汤小真" },
        { label: "申请部门", value: "算法推荐部" },
        { label: "申请积分", value: `${amount} 积分` },
        { label: "申请说明", value: reason },
        { label: "审核部长", value: "技术研发部 - 李部长" },
        { label: "审批状态", value: "待审核" }
      ]
    };

    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleApproveCredits = (msgId: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg) return;

    const amount = targetMsg.creditsAmount || 0;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    // 1. Update target audit message status
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          return {
            ...m,
            approvalStatus: "approved",
            details: (m.details || []).map((d) =>
              d.label === "审批状态" ? { label: "审批状态", value: "已审核通过" } : d
            )
          };
        }
        return m;
      })
    );

    // 2. Add credits to user
    setExtraRequestedCredits((prev) => prev + amount);

    // 3. Record transaction
    const newTx: CreditTransaction = {
      id: `tx_app_${Date.now()}`,
      type: "recharge",
      amount: amount,
      date: timeStr.slice(0, 10),
      time: timeStr.slice(11, 19),
      note: `额外积分申请审核通过 (+${amount} 积分)`,
      balance: credits + amount
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 4. Create result notification for applicant
    const resultMsg: AppMessage = {
      id: `msg_credits_res_${Date.now()}`,
      category: "审批待办",
      subcategory: "积分申请",
      type: "积分申请",
      title: `积分申请审核结果: 通过`,
      detail: `您申请的 ${amount} 额外积分已由李部长审核通过！积分已自动存入您的账户。`,
      summary: `审核通过！+${amount} 积分已自动到账。`,
      status: "unread",
      time: timeStr,
      isRedDot: true,
      eventCode: "CREDIT_APPLICATION_APPROVED",
      template: "approval",
      severity: "success",
      actorName: "李部长（审批人）",
      recipientNames: ["汤小真（申请人）"],
      sourceType: "积分申请单",
      sourceId: targetMsg.sourceId,
      businessStatus: "已通过",
      approvalStatus: "approved",
      creditsAmount: amount,
      details: [
        { label: "申请结果", value: "审核通过" },
        { label: "发放积分", value: `+${amount} 积分` },
        { label: "审核部长", value: "技术研发部 - 李部长" },
        { label: "备注说明", value: "审核通过，已自动充值到当月剩余积分" }
      ]
    };

    setMessages((prev) => [resultMsg, ...prev]);
  };

  const handleRejectCredits = (msgId: string, rejectReason: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg) return;

    const amount = targetMsg.creditsAmount || 0;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    // 1. Update target audit message status
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          return {
            ...m,
            approvalStatus: "rejected",
            rejectReason,
            details: (m.details || []).map((d) =>
              d.label === "审批状态" ? { label: "审批状态", value: `已驳回 (原因: ${rejectReason})` } : d
            )
          };
        }
        return m;
      })
    );

    // 2. Create result notification for applicant
    const resultMsg: AppMessage = {
      id: `msg_credits_res_${Date.now()}`,
      category: "审批待办",
      subcategory: "积分申请",
      type: "积分申请",
      title: `积分申请审核结果: 拒绝`,
      detail: `您申请的 ${amount} 额外积分未通过审核。拒绝原因：${rejectReason}`,
      summary: `审核驳回！原因: ${rejectReason}`,
      status: "unread",
      time: timeStr,
      isRedDot: true,
      eventCode: "CREDIT_APPLICATION_REJECTED",
      template: "approval",
      severity: "warning",
      actorName: "李部长（审批人）",
      recipientNames: ["汤小真（申请人）"],
      sourceType: "积分申请单",
      sourceId: targetMsg.sourceId,
      businessStatus: "已拒绝",
      approvalStatus: "rejected",
      rejectReason,
      creditsAmount: amount,
      details: [
        { label: "申请结果", value: "审核拒绝" },
        { label: "申请积分", value: `${amount} 积分` },
        { label: "审核部长", value: "技术研发部 - 李部长" },
        { label: "拒绝原因", value: rejectReason }
      ]
    };

    setMessages((prev) => [resultMsg, ...prev]);
  };

  const handleMarkMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read", isRedDot: false } : m))
    );
  };

  const handleMarkAllMessagesRead = () => {
    setMessages((prev) =>
      prev.map((m) => ({ ...m, status: "read", isRedDot: false }))
    );
  };

  // Material Selector Modal config
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorCallback, setSelectorCallback] = useState<((selectedUrls: string[]) => void) | null>(null);

  // Preset states for 一键同款
  const [presetPrompt, setPresetPrompt] = useState<string>("");
  const [presetReferences, setPresetReferences] = useState<string[]>([]);
  const [selectedSameStyleItem, setSelectedSameStyleItem] = useState<GalleryItem | null>(null);

  // Background ticker simulating GPU cloud rendering
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        let updated = false;
        const next = prevTasks.map((t) => {
          if (t.autoProgress === false) return t;
          if (t.status === "queue") {
            updated = true;
            return { ...t, status: "generating", progress: 10 };
          }
          if (t.status === "generating") {
            updated = true;
            const nextProgress = t.progress + Math.floor(Math.random() * 20 + 10);
            if (nextProgress >= 100) {
              // Complete task!
              triggerTaskCompletedEffects(t);
              return { ...t, status: "completed", progress: 100 };
            }
            return { ...t, progress: nextProgress };
          }
          return t;
        });
        return updated ? (next as Task[]) : prevTasks;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [tasks]);

  const triggerTaskCompletedEffects = (task: Task) => {
    // Generate beautiful assets dynamically upon completion
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
    
    if (task.type === "detail_set") {
      const outputUrls = [
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80"
      ];
      
      const newAssets: Asset[] = outputUrls.map((url, i) => ({
        id: `gen_asset_${Date.now()}_${i}`,
        name: `商详分析输出_${task.name.slice(0,6)}_${i+1}.png`,
        type: "image",
        url,
        size: "1.8 MB",
        createdAt: timestamp,
        category: "AI商品套图",
        resourceCategory: "图片",
        source: "ai_generation",
        creator: "徐振",
        publicTags: ["AI生成", "商品套图"]
      }));

      const newGalleryItem: GalleryItem = {
        id: `gen_g_${Date.now()}`,
        title: `AI生成: ${task.name}`,
        author: "MC电商至尊",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
        type: "image",
        url: outputUrls[0],
        likes: 12,
        views: 45,
        category: "图片",
        prompt: "Completed AIGC E-commerce commercial pack render"
      };

      setAssets((prev) => [...newAssets, ...prev]);
      setGalleryItems((prev) => [newGalleryItem, ...prev]);
      
      // Update task itself with output links
      setTimeout(() => {
        setTasks((current) => 
          current.map((ct) => ct.id === task.id ? { ...ct, outputFiles: outputUrls } : ct)
        );
      }, 100);

    } else if (task.type === "video_gen") {
      const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-wearing-a-silk-dress-posing-41710-large.mp4";
      const coverUrl = "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop&q=80";
      
      const newAsset: Asset = {
        id: `gen_asset_${Date.now()}`,
        name: `AI视频生成成果_${timestamp.replace(":", "_")}.mp4`,
        type: "video",
        url: videoUrl,
        size: "14.2 MB",
        createdAt: timestamp,
        category: "AI商品成片",
        resourceCategory: "成片",
        source: "ai_generation",
        creator: "徐振",
        publicTags: ["AI生成", "商品成片"],
        coverUrl
      };

      const newGalleryItem: GalleryItem = {
        id: `gen_g_${Date.now()}`,
        title: `生成视频: ${task.name.replace("AI 视频生成: ", "")}`,
        author: "MC电商至尊",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
        type: "video",
        url: videoUrl,
        coverUrl,
        likes: 5,
        views: 18,
        category: "视频",
        duration: "15s"
      };

      setAssets((prev) => [newAsset, ...prev]);
      setGalleryItems((prev) => [newGalleryItem, ...prev]);
      
      setTimeout(() => {
        setTasks((current) => 
          current.map((ct) => ct.id === task.id ? { ...ct, outputFiles: [videoUrl] } : ct)
        );
      }, 100);

    } else if (task.type === "image_gen") {
      const imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
      
      const newAsset: Asset = {
        id: `gen_asset_${Date.now()}`,
        name: `AI商业图像绘制_${timestamp.replace(":", "_")}.png`,
        type: "image",
        url: imageUrl,
        size: "2.1 MB",
        createdAt: timestamp,
        category: "AI商品场景图",
        resourceCategory: "图片",
        source: "ai_generation",
        creator: "徐振",
        publicTags: ["AI生成", "商品场景图"]
      };

      const newGalleryItem: GalleryItem = {
        id: `gen_g_${Date.now()}`,
        title: `生成图片: ${task.name.replace("AI 商业绘图: ", "")}`,
        author: "MC电商至尊",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
        type: "image",
        url: imageUrl,
        likes: 2,
        views: 10,
        category: "图片"
      };

      setAssets((prev) => [newAsset, ...prev]);
      setGalleryItems((prev) => [newGalleryItem, ...prev]);

      setTimeout(() => {
        setTasks((current) => 
          current.map((ct) => ct.id === task.id ? { ...ct, outputFiles: [imageUrl] } : ct)
        );
      }, 100);
    }
  };

  // State operations
  const handleAddTask = (
    type: Task["type"],
    name: string,
    inputFiles: string[],
    creditsCost: number,
    source: "agent" | "tool" = "tool"
  ) => {
    if (credits < creditsCost) {
      alert("余额不足！请开通 VIP 订阅方案或在可用积分中心兑换卡密添加额度。");
      return;
    }

    // Deduct points
    setCredits((prev) => prev - creditsCost);

    // Create task
    const id = "t_" + Date.now();
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
    const newTask: Task = {
      id,
      name,
      type,
      status: "queue",
      progress: 0,
      inputFiles,
      createdAt: timestamp,
      creditsCost,
      source,
      category: source === "agent" ? "agent" : (
        type === "watermark" ? "watermark" :
        type === "subtitle" ? "subtitle" :
        type === "enhance" ? "enhance" :
        type === "digital_human" ? "digital_human" :
        type === "model_change" ? "model_change" :
        type === "fission" ? "fission" :
        type === "video_gen" ? "ai_video" :
        type === "image_gen" ? "ai_image" : "quick_creation"
      )
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add logging ledger record
    const toolLabel = 
      type === "detail_set" ? "商详套图" : 
      type === "watermark" ? "水印擦除" :
      type === "subtitle" ? "字幕擦除" :
      type === "enhance" ? "画质增强" :
      type === "digital_human" ? "数字人分身" :
      type === "model_change" ? "模特换衣" :
      type === "fission" ? "爆款复刻" :
      type === "video_gen" ? (source === "agent" ? "Agent创作" : "AI视频素材") :
      type === "image_gen" ? (source === "agent" ? "Agent创作" : "AI图片素材") : "快速创作";

    const newTx: CreditTransaction = {
      id: "tx_" + Date.now(),
      type: "consume",
      tool: toolLabel,
      amount: -creditsCost,
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      remark: `生成/处理: ${name}`
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Force open tasks queue to show progress - disabled to keep queue closed by default
    // setIsQueueOpen(true);
  };

  const handleSyncAgentTask = (nextTask: Task, creditsCharge: number = 0) => {
    setTasks((current) => {
      const exists = current.some((task) => task.id === nextTask.id);
      return exists
        ? current.map((task) => task.id === nextTask.id ? { ...task, ...nextTask } : task)
        : [nextTask, ...current];
    });

    if (creditsCharge > 0) {
      setCredits((current) => current - creditsCharge);
      setTransactions((current) => [{
        id: `tx_agent_${Date.now()}`,
        type: "consume",
        tool: "Agent创作",
        amount: -creditsCharge,
        time: new Date().toISOString().replace("T", " ").slice(0, 19),
        remark: `Agent生成：${nextTask.name}`
      }, ...current]);
    }
  };

  const handleAddCredits = (amount: number, remark: string) => {
    setCredits((prev) => prev + amount);

    const newTx: CreditTransaction = {
      id: "tx_recharge_" + Date.now(),
      type: "recharge",
      tool: "系统赠送",
      amount,
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      remark
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Asset manipulations
  const handleUploadAsset = (file: { name: string; type: "image" | "video" | "audio"; url: string; size: string }) => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
    const newAsset: Asset = {
      id: "asset_upload_" + Date.now(),
      name: file.name,
      type: file.type,
      url: file.url,
      size: file.size,
      createdAt: timestamp,
      category: file.type === "image" ? "商品图片" : file.type === "audio" ? "音频素材" : "视频素材",
      resourceCategory: file.type === "image" ? "图片" : file.type === "audio" ? "音频" : "素材",
      source: "resource_library",
      creator: "徐振",
      publicTags: ["个人上传"]
    };
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleUploadAgentVideos = (videos: Array<{ name: string; cover: string }>) => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
    const uploadedAssets: Asset[] = videos.map((video, index) => ({
      id: `agent_upload_${Date.now()}_${index}`,
      name: video.name,
      type: "video",
      url: video.cover,
      coverUrl: video.cover,
      size: "24.5 MB",
      createdAt: timestamp,
      category: "AI生成成片",
      resourceCategory: "成片",
      source: "resource_library",
      creator: "徐振",
      publicTags: ["AI生成", "电商营销"],
      status: "未审核"
    }));
    setAssets((current) => [...uploadedAssets, ...current]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleRenameAsset = (id: string, newName: string) => {
    setAssets(assets.map((a) => a.id === id ? { ...a, name: newName } : a));
  };

  // Material picker trigger helper
  const handleOpenMaterialSelector = (callback: (selectedUrls: string[]) => void) => {
    setSelectorCallback(() => callback);
    setSelectorOpen(true);
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((t) => t.status === "queue" || t.status === "generating"));
  };

  const handleCancelGenerationTask = (taskId: string) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target || !["queue", "generating"].includes(target.status)) return;

    const cancelledAt = new Date().toISOString().replace("T", " ").slice(0, 19);
    const refund = target.status === "queue" ? target.creditsCost : 0;
    setTasks((current) => current.map((task) => task.id === taskId ? {
      ...task,
      status: "cancelled",
      cancelledAt,
      refundedCredits: refund
    } : task));

    if (refund > 0) {
      setCredits((current) => current + refund);
      setTransactions((current) => [{
        id: `tx_cancel_refund_${Date.now()}`,
        type: "refund",
        tool: "AI任务取消",
        amount: refund,
        time: cancelledAt,
        remark: `排队阶段取消，退回全部积分：${target.name}`
      }, ...current]);
    }
  };

  const handleRestartGenerationTask = (taskId: string) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target || !["failed", "cancelled"].includes(target.status)) return;
    if (credits < target.creditsCost) {
      alert("积分不足，无法重新生成");
      return;
    }

    const restartedAt = new Date().toISOString().replace("T", " ").slice(0, 19);
    setCredits((current) => current - target.creditsCost);
    setTasks((current) => current.map((task) => task.id === taskId ? {
      ...task,
      status: "queue",
      progress: 0,
      createdAt: restartedAt.slice(0, 16),
      cancelledAt: undefined,
      refundedCredits: undefined,
      failureReason: undefined,
      outputFiles: undefined
    } : task));
    setTransactions((current) => [{
      id: `tx_restart_${Date.now()}`,
      type: "consume",
      tool: "重新生成",
      amount: -target.creditsCost,
      time: restartedAt,
      remark: `重新提交任务：${target.name}`
    }, ...current]);
  };

  // Rendering screen router
  const renderMainView = () => {
    if (appMode === "admin") {
      return (
        <AdminView 
          adminActiveScreen={adminActiveScreen} 
          onTriggerTask={handleAddTask}
          onOpenTaskQueue={() => setIsQueueOpen(true)}
          onLogout={() => setLogoutDialogOpen(true)}
        />
      );
    }

    switch (activeScreen) {
      case "home":
        return (
          <HomeView
            setActiveScreen={handleNavigate}
            onNavigateToTaskTab={(tab) => {
              setSelectedTaskTabForCollaboration(tab);
              handleNavigate("task_collaboration");
            }}
            onOpenMaterialSelector={handleOpenMaterialSelector}
            messages={messages}
            onApproveCredits={handleApproveCredits}
            onRejectCredits={handleRejectCredits}
            onMarkMessageRead={handleMarkMessageRead}
            onMarkAllMessagesRead={handleMarkAllMessagesRead}
            onSearchResources={(intent) => {
              setResourceSearchIntent({ ...intent, requestId: Date.now() });
              handleNavigate("resources");
            }}
          />
        );
      case "quick_creation":
        return (
          <QuickCreationView
            galleryItems={galleryItems}
            setActiveScreen={handleNavigate}
            onOpenMaterialSelector={handleOpenMaterialSelector}
            onAddTask={handleAddTask}
            onAddCredits={handleAddCredits}
            onUseSamePrompt={(type, prompt, refUrl, item) => {
              if (item) {
                setSelectedSameStyleItem(item);
                handleNavigate("same_style_video");
              } else {
                setPresetPrompt(prompt);
                setPresetReferences(refUrl ? [refUrl] : []);
                handleNavigate(type === "video" ? "ai_video" : "ai_image");
              }
            }}
          />
        );
      case "detail_set":
        return (
          <DetailSetsView
            onBack={handleBack}
            onAddTask={handleAddTask}
            onAddCredits={handleAddCredits}
            onOpenMaterialSelector={handleOpenMaterialSelector}
          />
        );
      case "enhance":
        return (
          <QualityEnhanceView
            onBack={handleBack}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
          />
        );
      case "watermark":
        return (
          <WatermarkSubtitleView
            type="watermark"
            onBack={handleBack}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
          />
        );
      case "subtitle":
        return (
          <WatermarkSubtitleView
            type="subtitle"
            onBack={handleBack}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
          />
        );
      case "ai_video":
        return (
          <AiVideoView
            onBack={() => {
              setPresetPrompt("");
              setPresetReferences([]);
              handleBack();
            }}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
            galleryItems={galleryItems}
            presetPrompt={presetPrompt}
            presetReferences={presetReferences}
            onClearPreset={() => {
              setPresetPrompt("");
              setPresetReferences([]);
            }}
          />
        );
      case "ai_image":
        return (
          <AiImageView
            onBack={() => {
              setPresetPrompt("");
              setPresetReferences([]);
              handleBack();
            }}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
            galleryItems={galleryItems}
            presetPrompt={presetPrompt}
            presetReferences={presetReferences}
            onClearPreset={() => {
              setPresetPrompt("");
              setPresetReferences([]);
            }}
          />
        );
      case "assets":
        return (
          <AssetsView />
        );
      case "credits":
        return (
          <CreditsDashboard
            credits={credits}
            extraRequestedCredits={extraRequestedCredits}
            transactions={transactions}
            assets={assets}
            onAddCredits={handleAddCredits}
            onRequestCredits={handleRequestCredits}
            onLogout={() => setLogoutDialogOpen(true)}
          />
        );
      
      case "canvas":
        return (
          <InfiniteCanvasView
            onBack={handleBack}
            onOpenMaterialSelector={handleOpenMaterialSelector}
          />
        );

      case "live_management":
        return <LiveManagementView />;

      case "task_collaboration":
        return (
          <TaskCollaborationView
            onNavigateToDelivery={() => handleNavigate("ad_delivery")}
            onNavigateToMaterials={() => handleNavigate("materials")}
            initialDetailTask={selectedTaskForCollaboration}
            onClearInitialDetailTask={() => setSelectedTaskForCollaboration(null)}
            initialTab={selectedTaskTabForCollaboration}
          />
        );

      case "message_center":
        return (
          <MessageCenterWorkspace
            onBack={handleBack}
            setActiveScreen={handleNavigate}
            messages={messages}
            onApproveCredits={handleApproveCredits}
            onRejectCredits={handleRejectCredits}
            onMarkMessageRead={handleMarkMessageRead}
            onMarkAllMessagesRead={handleMarkAllMessagesRead}
            onOpenResource={(resource) => {
              setResourceSearchIntent({ type: resource.type, query: resource.name, openDetail: true, requestId: Date.now() });
              handleNavigate("resources");
            }}
          />
        );

      case "resources":
      case "materials":
      case "finished_videos":
      case "scripts":
        return (
          <ResourcesView
            initialSearch={resourceSearchIntent}
            onClearInitialSearch={() => setResourceSearchIntent(null)}
            initialTab={
              activeScreen === "materials" ? "materials" :
              activeScreen === "scripts" ? "scripts" : "finished_videos"
            }
            onTriggerTask={(type, name, inputFiles, cost) => {
              handleAddTask(type, name, inputFiles, cost);
            }}
            onNavigateToDelivery={() => {
              handleNavigate("ad_delivery");
            }}
            onNavigateToTaskDetail={(task) => {
              setSelectedTaskForCollaboration(task);
              handleNavigate("task_collaboration");
            }}
          />
        );

      case "ad_delivery":
        return (
          <AdDeliveryView />
        );

      case "account_management":
        return (
          <AccountManagementView />
        );

      case "same_style_video":
        return (
          <SameStyleVideoView
            selectedItem={selectedSameStyleItem || galleryItems[0]}
            onBack={() => {
              setSelectedSameStyleItem(null);
              handleBack();
            }}
            onAddTask={(type, name, inputFiles, creditsCost) => {
              handleAddTask(type, name, inputFiles, creditsCost);
            }}
            credits={credits}
          />
        );
      
      case "agent_creation":
        return (
          <AgentCreationView
            credits={credits}
            activeTask={activeAgentSessionId ? tasks.find((task) => task.id === activeAgentSessionId) : undefined}
            onSyncTask={handleSyncAgentTask}
            onCancelTask={handleCancelGenerationTask}
            onOpenQueue={() => setIsQueueOpen(true)}
            onSessionChange={setActiveAgentSessionId}
            onUploadVideos={handleUploadAgentVideos}
            onBack={handleBack}
          />
        );
      
      case "fission":
        return (
          <FissionView
            onBack={handleBack}
            onAddTask={handleAddTask}
            onOpenMaterialSelector={handleOpenMaterialSelector}
            credits={credits}
          />
        );

      case "video_remake":
        return (
          <VideoRemakeView
            onBack={handleBack}
            onAddTask={handleAddTask}
            credits={credits}
          />
        );
      
      default:
        return <div className="text-slate-100 p-6">Screen Coming soon...</div>;
    }
  };

  if (!session || !currentAccount) {
    return <LoginView accounts={PROTOTYPE_ACCOUNTS} onLogin={handleLogin} />;
  }

  return (
    <div className="w-screen h-screen flex bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={handleSidebarNavigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        credits={credits + extraRequestedCredits}
        openCreditsModal={() => handleNavigate("credits")}
        openAdminProfile={() => setAdminActiveScreen("admin_profile")}
        appMode={appMode}
        setAppMode={handleModeChange}
        allowedModes={currentAccount.allowedModes}
        adminActiveScreen={adminActiveScreen}
        setAdminActiveScreen={setAdminActiveScreen}
      />

      {/* 2. Main Workspace screen router */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {renderMainView()}
      </main>

      {/* 3. Right task queue drawer */}
      {appMode !== "admin" && (
        <RightQueue
          tasks={tasks}
          isOpen={isQueueOpen}
          setIsOpen={setIsQueueOpen}
          cancelTask={handleCancelGenerationTask}
          restartTask={handleRestartGenerationTask}
          viewResult={(taskId) => {
            const task = tasks.find((item) => item.id === taskId);
            if (task?.source === "agent" || task?.category === "agent") {
              setActiveAgentSessionId(taskId);
              setScreenHistory(["agent_creation"]);
              setIsQueueOpen(false);
              return;
            }
            handleNavigate("resources");
          }}
        />
      )}

      {/* 4. Global Assets selector popup */}
      {selectorOpen && (
        <MaterialSelector
          isOpen={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          assets={assets}
          onUploadAsset={handleUploadAsset}
          onSelectMaterials={(urls) => {
            if (selectorCallback) {
              selectorCallback(urls);
            }
          }}
          maxSelections={5}
        />
      )}

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
