import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  Bot,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Video,
  WandSparkles,
  X
} from "lucide-react";
import { GenerationTaskCategory, Task } from "../types";

interface TaskQueuePanelProps {
  tasks: Task[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cancelTask: (taskId: string) => void;
  restartTask: (taskId: string) => void;
  viewResult: (taskId: string) => void;
}

const CATEGORY_META: Record<GenerationTaskCategory, { label: string; shortLabel: string }> = {
  agent: { label: "Agent创作", shortLabel: "Agent" },
  quick_creation: { label: "快速创作", shortLabel: "快速创作" },
  watermark: { label: "视频去水印", shortLabel: "视频去水印" },
  subtitle: { label: "字幕擦除", shortLabel: "字幕擦除" },
  enhance: { label: "画质增强", shortLabel: "画质增强" },
  digital_human: { label: "数字人分身", shortLabel: "数字人分身" },
  model_change: { label: "模特换衣", shortLabel: "模特换衣" },
  fission: { label: "爆款复刻", shortLabel: "爆款复刻" },
  ai_video: { label: "AI视频素材", shortLabel: "AI视频素材" },
  ai_image: { label: "AI图片素材", shortLabel: "AI图片素材" }
};

const ALL_CATEGORIES: GenerationTaskCategory[] = [
  "agent",
  "quick_creation",
  "watermark",
  "subtitle",
  "enhance",
  "digital_human",
  "model_change",
  "fission",
  "ai_video",
  "ai_image"
];

const STATUS_META: Record<Task["status"], { label: string; className: string }> = {
  queue: { label: "排队中", className: "bg-slate-100 text-slate-700" },
  generating: { label: "生成中", className: "bg-blue-50 text-blue-700" },
  completed: { label: "生成成功", className: "bg-emerald-50 text-emerald-700" },
  failed: { label: "生成失败", className: "bg-rose-50 text-rose-700" },
  cancelled: { label: "已取消", className: "bg-amber-50 text-amber-700" }
};

const getTaskCategory = (task: Task): GenerationTaskCategory => {
  if (task.category) return task.category;
  if (task.source === "agent") return "agent";
  if (task.type === "watermark") return "watermark";
  if (task.type === "subtitle") return "subtitle";
  if (task.type === "enhance") return "enhance";
  if (task.type === "digital_human") return "digital_human";
  if (task.type === "model_change") return "model_change";
  if (task.type === "fission") return "fission";
  if (task.type === "video_gen") return "ai_video";
  if (task.type === "image_gen") return "ai_image";
  return "quick_creation";
};

const getTimestamp = (value: string) => {
  const timestamp = Date.parse(value.replace(/-/g, "/"));
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getDateLabel = (date: string) => {
  const [, month = "", day = ""] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
};

export default function TaskQueuePanel({ tasks, isOpen, setIsOpen, cancelTask, restartTask, viewResult }: TaskQueuePanelProps) {
  const [tab, setTab] = useState<"recent" | "all">("recent");
  const [recentCategory, setRecentCategory] = useState<"agent" | "tool">("agent");
  const [allCategory, setAllCategory] = useState<"all" | GenerationTaskCategory>("all");

  const activeCount = tasks.filter((task) => task.status === "queue" || task.status === "generating").length;
  const queueCount = tasks.filter((task) => task.status === "queue").length;
  const generatingCount = tasks.filter((task) => task.status === "generating").length;
  const failedCount = tasks.filter((task) => task.status === "failed").length;

  const sortedTasks = useMemo(
    () => [...tasks].sort((left, right) => getTimestamp(right.createdAt) - getTimestamp(left.createdAt)),
    [tasks]
  );
  const recentPool = useMemo(() => sortedTasks.slice(0, 20), [sortedTasks]);
  const visibleTasks = useMemo(() => {
    if (tab === "recent") {
      return recentPool.filter((task) => recentCategory === "agent" ? getTaskCategory(task) === "agent" : getTaskCategory(task) !== "agent");
    }
    return allCategory === "all" ? sortedTasks : sortedTasks.filter((task) => getTaskCategory(task) === allCategory);
  }, [allCategory, recentCategory, recentPool, sortedTasks, tab]);
  const groupedTasks = useMemo(() => visibleTasks.reduce<Array<{ date: string; tasks: Task[] }>>((groups, task) => {
    const date = task.createdAt.slice(0, 10);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.date === date) lastGroup.tasks.push(task);
    else groups.push({ date, tasks: [task] });
    return groups;
  }, []), [visibleTasks]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title={activeCount > 0 ? `当前有 ${activeCount} 个任务进行中` : "打开任务队列"}
        className="fixed right-0 top-1/2 z-50 flex min-h-32 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-l-lg border border-r-0 border-violet-200 bg-white px-2.5 py-3 text-violet-700 shadow-lg transition-colors hover:bg-violet-50"
      >
        {activeCount > 0 && <Loader2 className="h-4 w-4 animate-spin" />}
        <span className="text-[11px] font-bold [writing-mode:vertical-lr]">{activeCount > 0 ? `${activeCount}个任务` : "任务队列"}</span>
      </button>
    );
  }

  return (
    <aside className="relative z-50 flex h-screen w-[390px] shrink-0 flex-col border-l border-slate-200 bg-white text-slate-800 shadow-2xl">
      <header className="border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-bold">任务队列</h2>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{tasks.length}</span>
          </div>
          <button onClick={() => setIsOpen(false)} title="收起任务队列" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50 py-2.5 text-center text-[11px]">
          <div className="border-r border-slate-200"><p className="text-slate-400">排队中</p><p className="mt-0.5 font-mono font-bold text-slate-700">{queueCount}</p></div>
          <div className="border-r border-slate-200"><p className="text-slate-400">生成中</p><p className="mt-0.5 font-mono font-bold text-blue-700">{generatingCount}</p></div>
          <div><p className="text-slate-400">生成失败</p><p className="mt-0.5 font-mono font-bold text-rose-600">{failedCount}</p></div>
        </div>
      </header>

      <div className="border-b border-slate-200 px-3 pt-3">
        <div className="flex items-center gap-6">
          <button onClick={() => setTab("recent")} className={`relative pb-2 text-sm font-bold ${tab === "recent" ? "text-violet-700" : "text-slate-500 hover:text-slate-800"}`}>近期任务{tab === "recent" && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded bg-violet-600" />}</button>
          <button onClick={() => setTab("all")} className={`relative pb-2 text-sm font-bold ${tab === "all" ? "text-violet-700" : "text-slate-500 hover:text-slate-800"}`}>全部任务{tab === "all" && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded bg-violet-600" />}</button>
        </div>
      </div>

      <div className="border-b border-slate-100 px-3 py-3">
        {tab === "recent" ? (
          <div className="flex gap-2">
            {([{"value":"agent","label":"Agent创作"},{"value":"tool","label":"工具"}] as const).map((item) => (
              <button key={item.value} onClick={() => setRecentCategory(item.value)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${recentCategory === item.value ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-1.5 gap-y-2">
            <button onClick={() => setAllCategory("all")} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${allCategory === "all" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>全部</button>
            {ALL_CATEGORIES.map((category) => <button key={category} onClick={() => setAllCategory(category)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${allCategory === category ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{CATEGORY_META[category].shortLabel}</button>)}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {groupedTasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Sparkles className="h-6 w-6" /></div><p className="text-xs font-semibold text-slate-600">该分类暂无任务</p></div>
        ) : groupedTasks.map((group) => (
          <section key={group.date}>
            <div className="sticky top-0 z-10 bg-white/95 py-2 text-[11px] font-bold text-slate-500 backdrop-blur-sm">{getDateLabel(group.date)}</div>
            <div className="space-y-2.5">
              {group.tasks.map((task) => {
                const category = getTaskCategory(task);
                const isAgent = category === "agent";
                const status = STATUS_META[task.status];
                const canCancel = task.status === "queue" || task.status === "generating";
                const canRestart = task.status === "failed" || task.status === "cancelled";
                const preview = task.outputFiles?.[0] || task.inputFiles.find((file) => /^https?:\/\//.test(file));
                const estimatedMinutes = Math.max(1, Math.ceil((100 - task.progress) / 12));
                const PreviewIcon = category === "agent" ? Bot : category === "ai_image" ? ImageIcon : category === "ai_video" ? Video : WandSparkles;
                return (
                  <article key={task.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-slate-300">
                    <div className="flex gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : <PreviewIcon className="h-6 w-6 text-slate-300" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2"><p className="line-clamp-2 text-xs font-bold leading-5 text-slate-800">{task.name}</p><span className={`shrink-0 rounded px-2 py-1 text-[10px] font-semibold ${status.className}`}>{status.label}</span></div>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400"><span>{CATEGORY_META[category].label}</span><span className="font-mono">{task.createdAt.slice(11)}</span></div>
                        <div className="mt-1.5 text-[10px] text-slate-500">消耗积分 <span className="font-mono font-bold text-amber-600">-{task.creditsCost.toFixed(2)}</span>{(task.refundedCredits || 0) > 0 && <span className="ml-2 text-emerald-600">已退回 {task.refundedCredits?.toFixed(2)}</span>}</div>
                      </div>
                    </div>

                    {(task.status === "queue" || task.status === "generating") && (
                      <div className="mt-3 rounded-md bg-slate-50 p-2.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500"><span className="flex items-center gap-1">{task.status === "queue" ? <Clock3 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}{task.status === "queue" ? "等待计算资源" : `预计约 ${estimatedMinutes} 分钟完成`}</span><span className="font-mono font-bold">{task.progress}%</span></div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-slate-200"><div className={`h-full rounded ${task.status === "queue" ? "bg-slate-400" : "bg-blue-600"}`} style={{ width: `${Math.max(task.progress, 3)}%` }} /></div>
                      </div>
                    )}
                    {task.status === "failed" && <p className="mt-2 flex items-start gap-1.5 rounded bg-rose-50 p-2 text-[10px] leading-4 text-rose-700"><AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />{task.failureReason || "生成过程异常，任务已停止。"}</p>}
                    {task.status === "cancelled" && <p className="mt-2 flex items-start gap-1.5 rounded bg-amber-50 p-2 text-[10px] leading-4 text-amber-700"><Ban className="mt-0.5 h-3 w-3 shrink-0" />{task.refundedCredits === task.creditsCost ? "排队阶段取消，积分已全额退回。" : "生成阶段取消，已发生的计算消耗不退回。"}</p>}

                    <div className="mt-2.5 flex justify-end gap-1.5 border-t border-slate-100 pt-2.5">
                      {canCancel && <button onClick={() => cancelTask(task.id)} className="flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><X className="h-3 w-3" />取消任务</button>}
                      {isAgent && <button onClick={() => viewResult(task.id)} className="flex items-center gap-1 rounded bg-violet-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-700"><Eye className="h-3 w-3" />{canRestart ? "继续创作" : "进入会话"}</button>}
                      {!isAgent && canRestart && <button onClick={() => restartTask(task.id)} className="flex items-center gap-1 rounded bg-violet-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-700"><RotateCcw className="h-3 w-3" />重新生成</button>}
                      {!isAgent && task.status === "completed" && <><button onClick={() => viewResult(task.id)} className="flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3 w-3" />查看结果</button><button className="flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><Download className="h-3 w-3" />下载</button></>}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-[11px] text-slate-500">
        {tab === "recent" ? <>近期任务仅展示最近20条，更多请查看 <button onClick={() => setTab("all")} className="font-bold text-violet-700 hover:underline">全部任务</button></> : <>当前共 {visibleTasks.length} 条任务，全部历史任务长期保留</>}
      </footer>
    </aside>
  );
}
