import React, { useEffect, useState } from "react";
import { Download, FileOutput, Film, LogIn, Search, Send, Upload, RefreshCw, XCircle, Pencil } from "lucide-react";
import AssetPagination from "./AssetPagination";
import { AdDialog, buttonClass, primaryClass, inputClass } from "./AdPushDialogs";
import { PushRecordsModal } from "./AdAccountPush";
import AdPushWorkspace from "./AdPushWorkspace";
import { getAdActor, updateAdStore, type AdDraft, type AdPushRecord, type AdVideo } from "../lib/adPush";
import { useAdStore } from "../lib/useAdStore";
import { changeDerivations, DERIVATION_STATUSES, derivationOutput, seedDerivationExamples, useDerivationRecords, validateDerivationSelection } from "../lib/videoDerivation";
import { downloadHistoryMedia, exportHistoryCsv, seedOperationExamples, useOperationRecords, type OperationKind, type OperationRecord } from "../lib/operationHistory";

const tabs = [
  { id: "derivation", name: "衍生视频记录", icon: Film }, { id: "push", name: "推送视频记录", icon: Send },
  { id: "upload", name: "上传文件记录", icon: Upload }, { id: "export", name: "导出记录", icon: FileOutput },
  { id: "download", name: "下载记录", icon: Download }, { id: "login", name: "登录记录", icon: LogIn },
] as const;
type Tab = typeof tabs[number]["id"];
const date = (time: number) => new Date(time).toLocaleString("sv-SE");
const includes = (text: string, value: string) => text.toLowerCase().includes(value.trim().toLowerCase());
const statusClass = (status: string) => status === "成功" ? "text-emerald-600" : status === "失败" ? "text-rose-600" : status === "处理中" || status === "待衍生" ? "text-amber-600" : "text-slate-500";
const th = "px-3 py-3 text-left font-medium text-slate-500 whitespace-nowrap";
const td = "px-3 py-3 align-top";
const seededPushOwners = new Set<string>();

function seedLinkedPushExample(ownerId: string, name: string) {
  if (seededPushOwners.has(ownerId)) return;
  seededPushOwners.add(ownerId);
  updateAdStore(store => {
    const output = derivationOutput(`DER-DEMO-${ownerId}-1`, ownerId);
    const sample = store.records[0];
    if (!output || !sample || store.records.some(r => r.id === `push-example-${ownerId}`)) return store;
    const createdAt = date(output.createdAt + 10000);
    const record: AdPushRecord = { ...sample, id: `push-example-${ownerId}`, taskId: `PUSH-DEMO-${ownerId}`, operatorId: ownerId, operator: name, sourceVideo: output.source,
      derivativeId: output.id, videoId: output.source.id, videoTitle: output.source.title, assetId: "QC-MAT-260918-001", assetName: output.name,
      status: "推送成功", pushStatus: "推送成功", materialReview: "审核通过", method: "push", planId: "", planName: "", planResult: "不涉及", planReview: "不涉及", deliveryStatus: "不涉及",
      failureReason: "", createdAt, updatedAt: createdAt, startedAt: output.createdAt + 10000, snapshot: { ...sample.snapshot, method: "push", derivation: undefined },
      logs: [{ time: createdAt, text: "衍生视频已推送至千川素材库" }] };
    return { ...store, records: [...store.records, record] };
  });
}

export default function OperationRecordsView() {
  const actor = getAdActor();
  return <OperationRecords key={actor.id} ownerId={actor.id} ownerName={actor.name} />;
}
function OperationRecords({ ownerId, ownerName }: { ownerId: string; ownerName: string }) {
  const [tab, setTab] = useState<Tab>("derivation");
  const [push, setPush] = useState<{ videos: AdVideo[]; draft?: AdDraft } | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { seedDerivationExamples(ownerId); seedOperationExamples(ownerId); seedLinkedPushExample(ownerId, ownerName); }, [ownerId, ownerName]);
  const editPush = (draft: AdDraft, record?: AdPushRecord) => {
    if (!record || record.operatorId !== ownerId) return;
    const output = record.derivativeId ? derivationOutput(record.derivativeId, ownerId) : undefined;
    if (record.derivativeId && output?.status !== "成功") { setMessage("衍生文件尚不可用，请在衍生视频记录中处理后再推送"); return; }
    setPush({ draft: { ...draft, derivation: undefined }, videos: [{ ...(record.sourceVideo || { id: record.videoId, title: record.videoTitle }), derivativeId: record.derivativeId }] });
  };
  return <div data-testid="operation-records" className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50 text-slate-800">
    <div className="shrink-0 px-5 pb-1 pt-4">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1.5" role="tablist" aria-label="操作记录分类">
        {tabs.map(({ id, name, icon: Icon }) => <button role="tab" aria-selected={tab === id} key={id} onClick={() => { setTab(id); setMessage(""); }} className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-bold ${tab === id ? "border-purple-200 bg-white text-violet-600 shadow-xs" : "border-transparent text-slate-600 hover:bg-slate-100"}`}><Icon size={16} />{name}</button>)}
      </div>
    </div>
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-white" role="tabpanel">
      {message && <div role="status" className="mx-5 mt-4 flex items-center justify-between bg-violet-50 px-4 py-3 text-sm text-violet-700">{message}<button aria-label="关闭提示" onClick={() => setMessage("")}><XCircle size={16} /></button></div>}
      {tab === "derivation" ? <DerivationHistory ownerId={ownerId} ownerName={ownerName} onPush={videos => setPush({ videos })} onEditPush={editPush} />
        : tab === "push" ? <PushRecordsModal embedded currentUserOnly onClose={() => {}} onEdit={editPush} />
        : <SimpleHistory key={tab} kind={tab} ownerId={ownerId} ownerName={ownerName} />}
    </main>
    {push && <AdPushWorkspace video={push.videos[0]} videos={push.videos} initialDraft={push.draft} onClose={() => setPush(null)} onCreate={records => {
      updateAdStore(store => ({ ...store, records: [...records, ...store.records] })); setPush(null); setTab("push"); setMessage(`已提交 ${records.length} 条推送记录`);
    }} />}
  </div>;
}

const emptyFilters = { video: "", status: "", push: "", asset: "", title: "", note: "", start: "", end: "" };
function DerivationHistory({ ownerId, ownerName, onPush, onEditPush }: { ownerId: string; ownerName: string; onPush: (videos: AdVideo[]) => void; onEditPush: (draft: AdDraft, record?: AdPushRecord) => void }) {
  const all = useDerivationRecords(), store = useAdStore();
  const [draft, setDraft] = useState(emptyFilters), [filters, setFilters] = useState(emptyFilters);
  const [selected, setSelected] = useState<string[]>([]), [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20);
  const [action, setAction] = useState<{ kind: "cancel" | "retry" | "delete" | "note"; ids: string[] } | null>(null);
  const [note, setNote] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null), [linkedId, setLinkedId] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const own = all.filter(r => r.ownerId === ownerId);
  const linked = (id: string) => store.records.filter(r => r.operatorId === ownerId && r.derivativeId === id);
  const filtered = own.filter(r => includes(`${r.source.id} ${r.id}`, filters.video) && (!filters.status || r.status === filters.status) && includes(`${r.source.title} ${r.name}`, filters.title) && includes(r.note, filters.note)
    && (!filters.push || linked(r.id).some(p => includes(`${p.id} ${p.taskId}`, filters.push))) && (!filters.asset || linked(r.id).some(p => includes(p.assetId, filters.asset)))
    && (!filters.start || date(r.createdAt).slice(0, 10) >= filters.start) && (!filters.end || date(r.createdAt).slice(0, 10) <= filters.end)).sort((a, b) => b.createdAt - a.createdAt);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize))), rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const preview = own.find(r => r.id === previewId && r.status === "成功");
  const chosen = own.filter(r => selected.includes(r.id));
  const eligible = (status: string) => chosen.length > 0 && chosen.every(r => r.status === status);
  const ask = (kind: NonNullable<typeof action>["kind"], ids = selected) => { setError(""); setNote(ids.length === 1 ? own.find(r => r.id === ids[0])?.note || "" : ""); setAction({ kind, ids }); };
  const download = async (ids: string[]) => {
    setBusy(true); setError(""); let succeeded = 0;
    try { const outputs = validateDerivationSelection(ids, ownerId, ["成功"]); for (const output of outputs) { await downloadHistoryMedia(output.url, output.name); succeeded++; } setNotice(`已发起 ${succeeded} 个视频的下载`); }
    catch (e) { setError(`${succeeded ? `已发起 ${succeeded} 个下载；` : ""}${e instanceof Error ? e.message : "下载失败"}`); }
    finally { setBusy(false); }
  };
  const push = (ids: string[]) => {
    try { onPush(validateDerivationSelection(ids, ownerId, ["成功"]).map(r => ({ ...r.source, videoUrl: r.url, derivativeId: r.id }))); }
    catch (e) { setError(e instanceof Error ? e.message : "视频不可用"); }
  };
  const applyFilters = () => {
    if (draft.start && draft.end && draft.end < draft.start) { setError("结束日期不能早于开始日期"); return; }
    setFilters({ ...draft }); setSelected([]); setPage(1); setError("");
  };
  const field = (key: keyof typeof draft, placeholder: string) => <input aria-label={placeholder} placeholder={placeholder} className={inputClass} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />;
  return <div className="min-w-0 p-5" data-testid="derivation-history">
    <form onSubmit={e => { e.preventDefault(); applyFilters(); }}>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {field("video", "视频ID")}<select aria-label="衍生状态" className={inputClass} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}><option value="">全部状态</option>{DERIVATION_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        <input aria-label="操作人" className={inputClass} readOnly value={ownerName} />{field("push", "推送记录ID")}{field("asset", "素材ID")}{field("title", "视频标题")}{field("note", "备注关键词")}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input aria-label="开始日期" type="date" className={`${inputClass} !w-40 max-w-full`} value={draft.start} onChange={e => setDraft({ ...draft, start: e.target.value })} /><span className="text-xs text-slate-400">至</span><input aria-label="结束日期" type="date" min={draft.start} className={`${inputClass} !w-40 max-w-full`} value={draft.end} onChange={e => setDraft({ ...draft, end: e.target.value })} />
        <button type="submit" className={primaryClass}><Search size={14} />查询</button><button type="button" className={buttonClass} onClick={() => { setDraft(emptyFilters); setFilters(emptyFilters); setSelected([]); setPage(1); setError(""); }}>重置</button>
        <button type="button" className={primaryClass} disabled={!eligible("失败")} onClick={() => ask("retry")}><RefreshCw size={14} />批量重试</button>
        <button type="button" className={primaryClass} disabled={!eligible("待衍生")} onClick={() => ask("cancel")}><XCircle size={14} />批量取消</button>
        <button type="button" className={primaryClass} disabled={!eligible("成功")} onClick={() => push(selected)}><Send size={14} />批量推送</button>
        <button type="button" className={primaryClass} disabled={!eligible("成功") || busy} onClick={() => void download(selected)}><Download size={14} />批量下载</button>
        <button type="button" className={primaryClass} disabled={!chosen.length} onClick={() => ask("note")}><Pencil size={14} />批量备注</button>
        <button type="button" className={primaryClass} onClick={() => { exportHistoryCsv("衍生视频记录.csv", [["视频ID", "视频标题", "衍生视频ID", "衍生视频", "素材ID", "状态", "是否卡审", "操作人", "衍生时间", "更新时间", "推送记录ID", "备注", "系统信息"], ...filtered.map(r => [r.source.id, r.source.title, r.id, r.name, linked(r.id).map(p => p.assetId).filter(Boolean).join(";"), r.status, r.reviewBlocked === null ? "--" : r.reviewBlocked ? "是" : "否", ownerName, date(r.createdAt), date(r.updatedAt), linked(r.id).map(p => p.id).join(";"), r.note, r.message])], "衍生视频记录"); setNotice(`已导出 ${filtered.length} 条记录`); }}><FileOutput size={14} />导出</button>
      </div>
    </form>
    {error && <p role="alert" className="mb-3 text-sm text-rose-600">{error}</p>}{notice && <p role="status" className="mb-3 text-sm text-emerald-600">{notice}</p>}
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[1510px] text-xs"><thead className="bg-slate-50"><tr>
        <th className={th}><input aria-label="选择本页全部记录" type="checkbox" checked={rows.length > 0 && rows.every(r => selected.includes(r.id))} onChange={e => setSelected(e.target.checked ? [...new Set([...selected, ...rows.map(r => r.id)])] : selected.filter(id => !rows.some(r => r.id === id)))} /></th>
        {["视频标题", "衍生视频", "素材ID", "衍生状态", "是否卡审", "操作人", "衍生时间", "更新时间", "推送记录ID", "备注", "操作", "系统信息"].map(h => <th key={h} className={th} title={h === "素材ID" ? "衍生视频推送至千川素材库后，展示返回的素材ID；未推送或推送未成功时为空。" : undefined}>{h}</th>)}
      </tr></thead><tbody>{rows.map(r => { const pushes = linked(r.id), assets = [...new Set(pushes.map(p => p.assetId).filter(Boolean))]; return <tr key={r.id} data-testid={`derivation-row-${r.status}`} className="border-b border-slate-100 hover:bg-slate-50/60">
        <td className={td}><input type="checkbox" aria-label={`选择衍生记录 ${r.id}`} checked={selected.includes(r.id)} onChange={e => setSelected(e.target.checked ? [...selected, r.id] : selected.filter(id => id !== r.id))} /></td>
        <td className={`${td} max-w-48`}><p className="break-words leading-5">{r.source.title}</p><p className="mt-1 text-slate-400">{r.source.id}</p></td>
        <td className={`${td} max-w-44`}><button disabled={r.status !== "成功"} onClick={() => setPreviewId(r.id)} className="text-left text-violet-600 disabled:text-slate-400">{r.source.coverUrl && <img src={r.source.coverUrl} alt="" className="mb-2 h-14 w-20 rounded object-cover" />}<span className="break-words">{r.name}</span></button><p className="mt-1 max-w-40 break-all text-[10px] text-slate-400">{r.id}</p></td>
        <td className={`${td} max-w-36 break-all`}>{assets.length > 0 ? <button className="text-violet-600" onClick={() => setLinkedId(r.id)}>{assets.length === 1 ? assets[0] : `${assets.length} 个素材ID`}</button> : "--"}</td>
        <td className={`${td} whitespace-nowrap ${statusClass(r.status)}`}>{r.status}</td><td className={td}>{r.reviewBlocked === null ? "--" : r.reviewBlocked ? "是" : "否"}</td><td className={`${td} whitespace-nowrap`}>{ownerName}</td>
        <td className={`${td} w-28 leading-5`}>{date(r.createdAt)}</td><td className={`${td} w-28 leading-5`}>{date(r.updatedAt)}</td>
        <td className={`${td} max-w-36 break-all`}>{pushes.length ? <button className="text-left text-violet-600" onClick={() => setLinkedId(r.id)}>{pushes.length === 1 ? pushes[0].taskId : `${pushes.length} 条推送记录`}</button> : "--"}</td>
        <td className={`${td} max-w-36 break-words`}>{r.note || "--"}</td>
        <td className={td}><div className="flex w-28 flex-wrap gap-x-3 gap-y-2 text-violet-600">
          {r.status === "成功" && <><button onClick={() => setPreviewId(r.id)}>预览</button><button onClick={() => push([r.id])}>推送</button><button disabled={busy} onClick={() => void download([r.id])}>下载</button><button className="text-rose-600" onClick={() => ask("delete", [r.id])}>删除</button></>}
          {r.status === "待衍生" && <button onClick={() => ask("cancel", [r.id])}>取消</button>}{r.status === "失败" && <button onClick={() => ask("retry", [r.id])}>重试</button>}<button onClick={() => ask("note", [r.id])}>备注</button>
        </div></td><td className={`${td} max-w-40 break-words leading-5 text-slate-500`}>{r.message}</td>
      </tr>; })}</tbody></table>{!rows.length && <p className="py-16 text-center text-sm text-slate-400">暂无数据</p>}
    </div>
    <AssetPagination total={filtered.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />
    {preview && <AdDialog title={preview.name} onClose={() => setPreviewId(null)}><video src={preview.url} controls autoPlay className="max-h-[65vh] w-full bg-black" /></AdDialog>}
    {linkedId && <PushRecordsModal currentUserOnly derivativeId={linkedId} onClose={() => setLinkedId(null)} onEdit={(draft, record) => { setLinkedId(null); onEditPush(draft, record); }} />}
    {action && <AdDialog title={{ cancel: "取消衍生", retry: "重试衍生", delete: "删除衍生视频", note: "修改备注" }[action.kind]} onClose={() => setAction(null)} footer={<><button className={buttonClass} onClick={() => setAction(null)}>返回</button><button className={primaryClass} onClick={() => {
      try { changeDerivations(action.ids, ownerId, action.kind, note); if (action.kind === "cancel") updateAdStore(s => ({ ...s, records: s.records.map(r => r.operatorId === ownerId && r.derivativeId && action.ids.includes(r.derivativeId) && r.status === "待处理" ? { ...r, status: "已取消", pushStatus: "已取消", updatedAt: date(Date.now()), logs: [...r.logs, { time: date(Date.now()), text: "衍生已取消，停止关联推送" }] } : r) })); setSelected([]); setNotice(`已处理 ${action.ids.length} 条记录`); setAction(null); }
      catch (e) { setError(e instanceof Error ? e.message : "操作失败"); setAction(null); }
    }}>确认</button></>}>
      {action.kind === "note" ? <textarea aria-label="记录备注" maxLength={200} className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm" value={note} onChange={e => setNote(e.target.value)} /> : <p className="text-sm leading-6">{action.kind === "delete" ? "确认删除该衍生视频文件？记录及原视频保留，删除后无法预览、下载或推送。" : action.kind === "cancel" ? `确认取消 ${action.ids.length} 条待衍生任务？关联的待执行推送也将取消。` : `确认重试 ${action.ids.length} 条失败记录？重试后将更新原记录。`}</p>}
    </AdDialog>}
  </div>;
}

function SimpleHistory({ kind, ownerId, ownerName }: { kind: OperationKind; ownerId: string; ownerName: string }) {
  const all = useOperationRecords(), [search, setSearch] = useState(""), [status, setStatus] = useState(""), [type, setType] = useState(""), [start, setStart] = useState(""), [end, setEnd] = useState("");
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20), [detail, setDetail] = useState<OperationRecord | null>(null), [error, setError] = useState("");
  const own = all.filter(r => r.ownerId === ownerId && r.kind === kind);
  const filtered = own.filter(r => includes(`${r.name} ${r.resourceId || ""}`, search) && (!status || r.status === status) && (!type || r.type === type) && (!start || date(r.createdAt).slice(0, 10) >= start) && (!end || date(r.createdAt).slice(0, 10) <= end)).sort((a, b) => b.createdAt - a.createdAt);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize))), rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <div className="min-w-0 p-5">
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <input aria-label="记录搜索" placeholder={kind === "login" ? "账号" : "文件名称 / 文件ID"} className={inputClass} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <select aria-label="记录类型" className={inputClass} value={type} onChange={e => { setType(e.target.value); setPage(1); }}><option value="">{kind === "login" ? "全部浏览器" : "全部类型"}</option>{[...new Set(own.map(r => r.type))].map(t => <option key={t}>{t}</option>)}</select>
      <select aria-label="记录状态" className={inputClass} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">全部状态</option>{[...new Set(own.map(r => r.status))].map(s => <option key={s}>{s}</option>)}</select>
      <input type="date" aria-label="开始日期" className={inputClass} value={start} onChange={e => { setStart(e.target.value); setPage(1); }} /><input type="date" aria-label="结束日期" min={start} className={inputClass} value={end} onChange={e => { setEnd(e.target.value); setPage(1); }} />
      <button className={buttonClass} onClick={() => { setSearch(""); setType(""); setStatus(""); setStart(""); setEnd(""); setPage(1); }}>重置</button>
    </div>
    {error && <p role="alert" className="mb-3 text-sm text-rose-600">{error}</p>}
    <div className="max-w-full overflow-x-auto"><table className="w-full min-w-[840px] text-xs"><thead className="bg-slate-50"><tr>{[kind === "login" ? "登录账号" : "文件名称", kind === "login" ? "浏览器" : "类型", "状态", "操作人", "操作时间", "系统信息", "操作"].map(h => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
      <td className={`${td} max-w-64 break-words`}>{r.name}{r.resourceId && <p className="mt-1 text-slate-400">{r.resourceId}</p>}</td><td className={td}>{r.type}</td><td className={`${td} ${statusClass(r.status)}`}>{r.status}</td><td className={td}>{ownerName}</td><td className={td}>{date(r.createdAt)}</td><td className={`${td} max-w-64 text-slate-500`}>{r.message}</td>
      <td className={td}><button className="text-violet-600" onClick={() => setDetail(r)}>详情</button>{kind === "export" && r.status === "成功" && r.url && <button className="ml-3 text-violet-600" onClick={() => { void downloadHistoryMedia(r.url!, r.name, "导出文件").catch(e => setError(e.message)); }}>下载</button>}</td>
    </tr>)}</tbody></table>{!rows.length && <p className="py-16 text-center text-sm text-slate-400">暂无数据</p>}</div>
    <AssetPagination total={filtered.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />
    {detail && <AdDialog title="记录详情" onClose={() => setDetail(null)}><dl className="grid grid-cols-[85px_minmax(0,1fr)] gap-4 text-sm">{Object.entries({ "记录ID": detail.id, [kind === "login" ? "账号" : "文件名称"]: detail.name, "类型": detail.type, "文件ID": detail.resourceId || "--", "文件大小": detail.size || "--", "状态": detail.status, "操作人": ownerName, "操作时间": date(detail.createdAt), "系统信息": detail.message }).map(([label, value]) => <React.Fragment key={label}><dt className="text-slate-500">{label}</dt><dd className="break-all">{value}</dd></React.Fragment>)}</dl></AdDialog>}
  </div>;
}
