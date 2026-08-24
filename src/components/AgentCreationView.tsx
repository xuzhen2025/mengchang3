import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowUp, Check, CheckCircle2, ChevronDown, Copy, Download, Eye,
  FileText, History, Loader2, MessageSquare, MoreHorizontal, Play, Plus,
  RefreshCw, Sparkles, Square, Upload, Video, WandSparkles, X
} from "lucide-react";
import { Task } from "../types";
import UploadFinishedVideoModal from "./UploadFinishedVideoModal";

type StepType = "analysis" | "script" | "preview" | "final";
type SessionStatus = "generating" | "completed" | "failed" | "cancelled";

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
  sellingPoints: string[];
  audience: string;
  creatives: CreativeItem[];
  previews: PreviewItem[];
  finals: FinalVideoItem[];
  timeline: ResultRecord[];
  versionCounts: Record<"analysis" | "script", number>;
  activeVersions: Record<"analysis" | "script", number>;
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

const nowText = () => new Date().toISOString().replace("T", " ").slice(0, 16);
const shortTime = () => new Date().toTimeString().slice(0, 5);
const cloneItems = <T,>(items: T[]) => items.map((item) => ({ ...item }));

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
  sellingPoints: ["强力去油膜", "擦拭无残留", "不伤玻璃", "自带海绵擦头"],
  audience: "经常夜间驾驶、雨季用车及注重日常养车的车主",
  creatives: [],
  previews: [],
  finals: [],
  timeline: [],
  versionCounts: { analysis: 1, script: 0 },
  activeVersions: { analysis: 1, script: 0 }
});

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
    return sessions[id] || null;
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
  const [idea, setIdea] = useState("为玻璃油膜擦生成一条突出雨天行车安全的电商营销视频");
  const [selectedCreativeId, setSelectedCreativeId] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [generatingLabel, setGeneratingLabel] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadItems, setUploadItems] = useState<FinalVideoItem[]>([]);
  const [detailVideo, setDetailVideo] = useState<FinalVideoItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRef = useRef<AgentSession | null>(session);

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
    inputFiles: [SAMPLE_COVERS[0]],
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

  const startCreation = (mode: AgentSession["mode"]) => {
    const charge = mode === "one_click" ? 5 : 0;
    if (credits < charge) {
      showToast("积分不足");
      return;
    }
    const base = makeBaseSession(idea.trim(), mode);
    sessionRef.current = base;
    setSession(base);
    onSessionChange(base.id);
    setGeneratingLabel(mode === "one_click" ? "正在生成成片" : "正在分析需求");
    sync(base, charge);
    finishStart(base, mode === "one_click");
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
    onSessionChange(null);
  };

  const selectedFinals = useMemo(() => session?.finals.filter((item) => item.selected) || [], [session?.finals]);

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
        <main className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-3xl">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600 text-white"><Sparkles className="h-6 w-6" /></div>
              <h1 className="text-2xl font-bold text-slate-900">Agent 创作</h1>
              <p className="mt-2 text-sm text-slate-500">输入需求，生成电商营销视频</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus-within:border-violet-400">
              <textarea value={idea} onChange={(event) => setIdea(event.target.value)} rows={4} placeholder="描述商品、卖点和想要的视频效果" className="w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400" />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-slate-100"><Plus className="h-4 w-4" />添加参考</button>
                  <span>9:16</span><span>30秒</span>
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={!idea.trim()} onClick={() => startCreation("one_click")} className="rounded-md border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">一键成片</button>
                  <button disabled={!idea.trim()} onClick={() => startCreation("step")} className="flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40">开始创作<ArrowUp className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {["突出产品痛点", "生成口播种草", "制作实测对比"].map((text) => <button key={text} onClick={() => setIdea(`${text}：${idea}`)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 hover:border-violet-300 hover:text-violet-700">{text}</button>)}
            </div>
          </div>
        </main>
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

      <div className="grid min-h-0 flex-1 grid-cols-[148px_minmax(0,1fr)_300px] overflow-hidden">
        <aside className="border-r border-slate-200 bg-white p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold text-slate-400">创作阶段</p>
          <div className="space-y-1">
            {STEP_META.filter((item) => session.availableSteps.includes(item.id)).map((item, index) => {
              const Icon = item.icon;
              const active = session.currentStep === item.id;
              return <button key={item.id} onClick={() => session.status !== "generating" && setSession({ ...session, currentStep: item.id })} className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-xs font-semibold ${active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"}`}><span className={`flex h-6 w-6 items-center justify-center rounded ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-3.5 w-3.5" /></span><span className="flex-1">{item.label}</span>{index < session.availableSteps.length - 1 && <Check className="h-3.5 w-3.5 text-emerald-500" />}</button>;
            })}
          </div>
        </aside>

        <main className="relative min-w-0 overflow-y-auto bg-slate-50 px-5 pb-24 pt-5">
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
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-sm">
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
  return (
    <div className="mx-auto max-w-4xl">
      <PanelHeader title="需求分析" count={session.versionCounts.analysis} active={session.activeVersions.analysis} onChange={(value) => setSession({ ...session, activeVersions: { ...session.activeVersions, analysis: value } })} />
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5"><label className="text-xs font-semibold text-slate-500">创作目标</label><textarea value={session.demand} onChange={(event) => setSession({ ...session, demand: event.target.value })} rows={4} className="mt-2 w-full resize-none rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-violet-400" /></section>
        <div className="grid grid-cols-2 gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="text-xs font-semibold text-slate-500">核心卖点</h3><div className="mt-3 flex flex-wrap gap-2">{session.sellingPoints.map((point) => <span key={point} className="rounded bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700">{point}</span>)}</div></section>
          <section className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="text-xs font-semibold text-slate-500">目标人群</h3><textarea value={session.audience} onChange={(event) => setSession({ ...session, audience: event.target.value })} rows={3} className="mt-2 w-full resize-none border-0 p-0 text-sm leading-6 outline-none" /></section>
        </div>
      </div>
    </div>
  );
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
