import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Check, Copy, Download, Loader2, Pencil, Plus, RefreshCw, Search, Send, Star, Trash2, X } from "lucide-react";
import OverlayPortal from "./overlays/OverlayPortal";
import AssetPagination from "./AssetPagination";
import { VideoStatusSelect } from "./ResourceEditDialog";
import { useAdStore } from "../lib/useAdStore";
import { AD_PLATFORMS, DEFAULT_AD_PARAMETERS, PLAN_WORDS, adCatalog, adId, cancelAdRecords, createAdRecords, getAdActor, isAdActive, nameWidth, readAdStore, resolveAdName, saveAdTemplate, updateAdStore, validateAdDraft, visibleAdAccounts, visibleAdRecords, type AdAccount, type AdDraft, type AdParameters, type AdPushRecord, type AdTemplate, type AdVideo, type DeliveryRow, type MarketingGoal } from "../lib/adPush";
export type { AdPushRecord } from "../lib/adPush";

const inputClass = "h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-500 disabled:bg-slate-50 disabled:text-slate-400";
const buttonClass = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
const primaryClass = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40";
const iconClass = "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100";
const emptyRow = (accountId: string): DeliveryRow => ({ id: adId(), accountId, douyinId: "", productId: "", storeId: "", planId: "" });

export function AdDialog({ title, children, footer, onClose, wide = false }: { title: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void; wide?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    root.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return <OverlayPortal ref={root} tabIndex={-1} layer="dialog" className="fixed inset-0 flex items-center justify-center bg-black/40 p-3 outline-none" role="dialog" aria-modal="true" aria-label={title} onKeyDown={e => {
    if (!root.current?.contains(e.target as Node)) return;
    if (e.key === "Escape") { e.stopPropagation(); onClose(); }
    if (e.key === "Tab") {
      const items = [...root.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === root.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      e.stopPropagation();
    }
  }}>
    <div className={`flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl ${wide ? "max-w-6xl" : "max-w-2xl"}`}>
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3"><h2 className="text-base font-bold text-slate-800">{title}</h2><button type="button" title={`关闭${title}`} onClick={onClose} className={iconClass}><X className="h-5 w-5" /></button></header>
      <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
      {footer && <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-3">{footer}</footer>}
    </div>
  </OverlayPortal>;
}
const ErrorLine = ({ text }: { text: string }) => text ? <p role="alert" className="flex items-start gap-2 text-sm text-rose-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{text}</p> : null;
const Field = ({ title, children }: { title: string; children: React.ReactNode }) => <label className="block min-w-0 space-y-2 text-xs font-semibold text-slate-600"><span>{title}</span>{children}</label>;
function Options({ label, values, value, onChange, disabled = [] }: { label: string; values: string[]; value: string; onChange: (v: string) => void; disabled?: string[] }) {
  return <fieldset className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]"><legend className="float-left pt-2 text-xs font-semibold text-slate-600">{label}</legend><div className="flex flex-wrap gap-3">{values.map(v => <label key={v} title={disabled.includes(v) ? "当前不支持，不可选" : v} className="relative cursor-pointer"><input className="peer sr-only" type="radio" name={label} checked={value === v} disabled={disabled.includes(v)} onChange={() => onChange(v)} /><span className="flex min-h-10 min-w-24 items-center justify-center rounded-md border border-slate-200 px-4 text-xs font-semibold text-slate-600 peer-checked:border-violet-500 peer-checked:text-violet-600 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-40">{v}</span></label>)}</div></fieldset>;
}
function ParameterFields({ goal, params, onChange }: { goal: MarketingGoal; params: AdParameters; onChange: (p: AdParameters) => void }) {
  const set = (key: keyof AdParameters, value: string | number | boolean) => onChange({ ...params, [key]: value });
  return <div className="space-y-5">
    <Options label="营销场景" values={goal === "推商品" ? ["日常销售", "新客转化", "新品起量"] : ["日常销售", "新客转化"]} value={params.scene} onChange={v => set("scene", v)} />
    {params.scene === "新客转化" && <Options label="新客类型" values={goal === "推商品" ? ["店铺新客"] : ["店铺新客", "品牌新客", "抖音号新客"]} value={params.newcomer} onChange={v => set("newcomer", v)} />}
    <Options label="广告类型" values={["通投广告", "搜索广告", "商城广告"]} disabled={["搜索广告", "商城广告"]} value={params.adType} onChange={v => set("adType", v)} />
    <Options label="推广方式" values={["自定义", "托管"]} disabled={["自定义"]} value={params.promotion} onChange={v => set("promotion", v)} />
    <label className="flex items-center gap-4 text-xs font-semibold text-slate-600"><span className="w-[120px]">智能优惠券</span><input type="checkbox" checked={params.coupon} onChange={e => set("coupon", e.target.checked)} className="h-4 w-4 accent-violet-600" />启用</label>
  </div>;
}

function TemplateEditor({ initial, goal, video, row, account, onClose, onSave }: { initial?: AdTemplate; goal: MarketingGoal; video: AdVideo; row?: DeliveryRow; account?: AdAccount; onClose: () => void; onSave: (t: AdTemplate) => void }) {
  const actor = getAdActor();
  const [template, setTemplate] = useState<AdTemplate>(() => initial ? structuredClone(initial) : { id: adId(), name: "", scope: "个人模板", ownerId: actor.id, platform: "巨量千川", goal, naming: "", suffix: "", params: { ...DEFAULT_AD_PARAMETERS } });
  const [step, setStep] = useState(1), [error, setError] = useState("");
  useEffect(() => setError(""), [template]);
  const namingRef = useRef<HTMLInputElement>(null);
  const insert = (word: string) => {
    const position = namingRef.current?.selectionStart ?? template.naming.length;
    const end = namingRef.current?.selectionEnd ?? position;
    const text = `{${word}}`;
    setTemplate(t => ({ ...t, naming: t.naming.slice(0, position) + text + t.naming.slice(end) }));
    requestAnimationFrame(() => { namingRef.current?.focus(); namingRef.current?.setSelectionRange(position + text.length, position + text.length); });
  };
  const save = () => { try { if (nameWidth(resolveAdName(template.naming, video, actor, template, row, account) + (template.suffix || "_YYYYMMDD_001")) > 110) throw new Error("计划名称超出110个字符（汉字按2个字符计算）"); const saved = saveAdTemplate(template); onSave(saved); } catch (e) { setError(e instanceof Error ? e.message : "保存失败，请检查浏览器存储"); } };
  return <AdDialog title="计划模板配置" wide onClose={onClose} footer={<><ErrorLine text={error} />{step === 2 && <button className={buttonClass} onClick={() => setStep(1)}>上一步</button>}<button className={buttonClass} onClick={onClose}>取消</button><button className={primaryClass} onClick={step === 1 ? () => setStep(2) : save}>{step === 1 ? "下一步" : "保存模板"}</button></>}>
    <nav className="mb-6 flex gap-5 border-b border-slate-200 pb-3 text-sm"><button onClick={() => setStep(1)} className={step === 1 ? "font-bold text-violet-600" : "text-slate-500"}>基础参数</button><button onClick={() => setStep(2)} className={step === 2 ? "font-bold text-violet-600" : "text-slate-500"}>投放设置</button></nav>
    {step === 1 ? <div className="space-y-6">
      <Field title="模板名称"><input autoFocus className={inputClass} value={template.name} maxLength={60} onChange={e => setTemplate(t => ({ ...t, name: e.target.value }))} placeholder="请输入模板名称" /></Field>
      <Field title="计划名称"><div className="flex flex-wrap items-center gap-3"><input ref={namingRef} className={`${inputClass} flex-1`} value={template.naming} onChange={e => setTemplate(t => ({ ...t, naming: e.target.value }))} placeholder="请选择词包" /><span className="text-xs text-slate-500">{template.suffix || "+ 自动编号"}</span></div></Field>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs"><span className="text-slate-500">动态词包：</span>{PLAN_WORDS.map(word => <button key={word} onClick={() => insert(word)} className="text-violet-600 hover:underline">{`{${word}}`}</button>)}</div>
      <p className="break-all text-xs text-slate-500">预览示例：{resolveAdName(template.naming, video, actor, template, row, account)}{template.suffix}</p>
      <Options label="模板类型" values={["个人模板", "公司模板"]} value={template.scope} onChange={v => setTemplate(t => ({ ...t, scope: v as AdTemplate["scope"] }))} />
      <p className="text-xs text-slate-600">巨量千川 / {goal}</p>
      <ParameterFields goal={goal} params={template.params} onChange={params => setTemplate(t => ({ ...t, params }))} />
    </div> : <div className="grid gap-5 sm:grid-cols-2">
      <Field title="日预算（元）"><input className={inputClass} type="number" min="0.01" step="0.01" value={template.params.budget} onChange={e => setTemplate(t => ({ ...t, params: { ...t.params, budget: Number(e.target.value) } }))} /></Field>
      <Field title="出价（元）"><input className={inputClass} type="number" min="0.01" step="0.01" value={template.params.bid} onChange={e => setTemplate(t => ({ ...t, params: { ...t.params, bid: Number(e.target.value) } }))} /></Field>
      <Field title="转化目标"><select className={inputClass} value={template.params.optimization} onChange={e => setTemplate(t => ({ ...t, params: { ...t.params, optimization: e.target.value } }))}><option>成交</option><option>支付ROI</option></select></Field>
      <Field title="优化周期"><select className={inputClass} value={template.params.period} onChange={e => setTemplate(t => ({ ...t, params: { ...t.params, period: e.target.value } }))}><option>1天</option><option>7天</option></select></Field>
      <p className="col-span-full text-xs text-amber-700">新建计划默认暂停，需在千川检查后手动开启。</p>
    </div>}
  </AdDialog>;
}

export function AdAccountPushWorkspace({ video, initialDraft, onClose, onCreate }: { video: AdVideo; initialDraft?: AdDraft; onClose: () => void; onCreate: (records: AdPushRecord[]) => void }) {
  const store = useAdStore(), actor = getAdActor();
  const [draft, setDraft] = useState<AdDraft>(() => initialDraft ? { ...structuredClone(initialDraft), templateIds: initialDraft.templateIds.filter(id => store.templates.some(t => t.id === id && (t.scope === "公司模板" || t.ownerId === actor.id) && t.goal === initialDraft.goal && t.platform === initialDraft.platform)) } : { platform: "巨量千川", method: "push", goal: "推商品", rows: [], templateIds: [], version: "转码后视频", naming: "{视频名称}", scheduledAt: "", creative: "单创意", successStatus: "已上机" });
  const [picker, setPicker] = useState(false), [picked, setPicked] = useState<string[]>([]), [search, setSearch] = useState("");
  const [scope, setScope] = useState("全部账户"), [groupId, setGroupId] = useState("");
  const [editor, setEditor] = useState<{ template?: AdTemplate } | null>(null), [deleting, setDeleting] = useState<AdTemplate | null>(null);
  const [error, setError] = useState(initialDraft && initialDraft.templateIds.length !== draft.templateIds.length ? "原模板已删除、不可见或不适用，请重新选择模板" : ""), [confirmFull, setConfirmFull] = useState(false), [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [scheduled, setScheduled] = useState(Boolean(initialDraft?.scheduledAt));
  const [templateScope, setTemplateScope] = useState("全部模板");
  const canPlan = actor.permissions.includes("uc_ad_plan_manage");
  const accounts = visibleAdAccounts(store, actor).filter(a => a.platform === draft.platform);
  const available = accounts.filter(a => {
    if (scope === "收藏账户" && !a.isStarred) return false;
    if (scope === "个人账户" && a.authorizedBy !== actor.name && a.user !== actor.name) return false;
    if (scope === "小组账户" && a.group !== actor.group) return false;
    if (scope === "分类账户" && !actor.categories.includes(a.category)) return false;
    if (scope === "公司分组" && groupId && !store.groups.find(g => g.id === groupId)?.accountIds.includes(a.id)) return false;
    const keywords = search.trim().split(/[，,\s]+/).filter(Boolean);
    return !keywords.length || keywords.some(k => `${a.name} ${a.id}`.toLowerCase().includes(k.toLowerCase()));
  });
  const templates = store.templates.filter(t => t.platform === draft.platform && t.goal === draft.goal && (t.scope === "公司模板" || t.ownerId === actor.id) && (templateScope === "全部模板" || t.scope === templateScope));
  const change = (patch: Partial<AdDraft>) => { setDraft(d => ({ ...d, ...patch })); setError(""); };
  const updateRow = (id: string, patch: Partial<DeliveryRow>) => change({ rows: draft.rows.map(r => r.id === id ? { ...r, ...patch } : r) });
  const submit = (confirmed = false) => {
    if (submittingRef.current) return;
    const current = readAdStore();
    const problem = scheduled && !draft.scheduledAt ? "请选择定时创建时间" : validateAdDraft(draft, current, getAdActor());
    if (problem) { setError(problem); setConfirmFull(false); return; }
    if (draft.method === "full_domain" && !confirmed) { setConfirmFull(true); return; }
    submittingRef.current = true; setSubmitting(true);
    try { const records = createAdRecords(draft, current, getAdActor(), video); onCreate(records); }
    catch (e) { setError(e instanceof Error ? e.message : "提交失败，请稍后再试"); submittingRef.current = false; setSubmitting(false); setConfirmFull(false); }
  };
  const openPicker = () => { setPicked([]); setSearch(""); setPicker(true); };
  const removeTemplate = () => {
    if (!canPlan) { setError("暂无管理投放计划权限"); setDeleting(null); return; }
    try { updateAdStore(s => ({ ...s, templates: s.templates.filter(t => t.id !== deleting?.id) })); change({ templateIds: draft.templateIds.filter(id => id !== deleting?.id) }); setDeleting(null); } catch { setError("删除失败，请检查浏览器存储"); }
  };
  return <OverlayPortal layer="modal" className="fixed inset-0 flex flex-col bg-slate-50 text-slate-800" role="dialog" aria-modal="true" aria-label="添加推送任务">
    <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3"><button title="返回成片详情" className={iconClass} onClick={onClose}><ArrowLeft className="h-5 w-5" /></button><Send className="h-5 w-5 text-violet-600" /><h1 className="text-base font-bold">添加推送任务</h1><span className="ml-auto rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">原型演示</span><button title="关闭推送任务" className={iconClass} onClick={onClose}><X className="h-5 w-5" /></button></header>
    <div className="min-h-0 flex-1 overflow-auto"><div className="mx-auto grid max-w-[1440px] gap-5 p-4 lg:grid-cols-[190px_minmax(0,1fr)]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">{AD_PLATFORMS.map(p => <button key={p} onClick={() => { change({ platform: p, method: "push", rows: [], templateIds: [] }); setGroupId(""); }} className={`min-h-10 shrink-0 rounded-md px-3 text-left text-sm ${draft.platform === p ? "bg-violet-100 font-semibold text-violet-700" : "text-slate-600 hover:bg-white"}`}>{p}</button>)}</nav>
      <main className="min-w-0 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3 border-b border-slate-200 py-4">{video.coverUrl && <img src={video.coverUrl} alt={video.title} className="h-16 w-24 shrink-0 rounded object-cover" />}<div className="min-w-0"><p className="break-all text-sm font-semibold">{video.title}</p><p className="mt-1 text-xs text-slate-500">成片ID：{video.id}</p></div></div>
        <section className="space-y-4 border-b border-slate-200 py-5"><h2 className="text-sm font-bold">推送方式</h2><div className="flex flex-wrap gap-3">{([{ key: "push", label: "仅推送" }, ...(draft.platform === "巨量千川" ? [{ key: "plan", label: "推送并搭建计划" }, { key: "full_domain", label: "全域推广" }] : [])] as const).map(m => <button key={m.key} aria-pressed={draft.method === m.key} disabled={m.key !== "push" && !canPlan} title={m.key !== "push" && !canPlan ? "暂无管理投放计划权限" : m.label} onClick={() => change({ method: m.key as AdDraft["method"], rows: [], templateIds: [] })} className={`${buttonClass} ${draft.method === m.key ? "border-violet-500 bg-violet-50 text-violet-700" : ""}`}>{m.label}</button>)}</div></section>
        {draft.method !== "push" && <section className="space-y-5 border-b border-slate-200 py-5"><Options label="营销目标" values={["推商品", "推直播间"]} value={draft.goal} onChange={v => change({ goal: v as MarketingGoal, templateIds: [], rows: draft.rows.map(r => ({ ...r, productId: "", planId: "" })) })} />{draft.method === "plan" && <Options label="创意方式" values={["单创意", "多创意"]} value={draft.creative} onChange={v => change({ creative: v as AdDraft["creative"] })} />}</section>}
        <section className="space-y-4 border-b border-slate-200 py-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">{draft.method === "push" ? "广告账户" : "投放明细"}</h2><button onClick={openPicker} className={buttonClass}><Plus className="h-4 w-4" />选择账户</button></div>
          <div className="overflow-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">广告账户</th>{draft.method !== "push" && <th className="p-3">抖音号</th>}{draft.method === "plan" && <>{draft.goal === "推商品" && <th className="p-3">商品</th>}<th className="p-3">店铺</th></>}{draft.method === "full_domain" && <th className="p-3">已有全域计划</th>}<th className="p-3">操作</th></tr></thead><tbody>
            {draft.rows.map(row => { const a = accounts.find(a => a.id === row.accountId), c = a && adCatalog(a); return <tr key={row.id} className="border-b border-slate-100"><td className="max-w-56 p-3"><p className="break-words font-semibold">{a?.name || "账户不可见"}</p><p className="mt-1 text-slate-400">{row.accountId}</p>{a?.status === "expired" && <span className="text-rose-600">已失效</span>}</td>
              {draft.method !== "push" && <td className="p-2"><select aria-label="抖音号" className={inputClass} value={row.douyinId} onChange={e => updateRow(row.id, { douyinId: e.target.value, storeId: "", productId: "", planId: "" })}><option value="">请选择</option>{c?.douyins.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}</select></td>}
              {draft.method === "plan" && <>{draft.goal === "推商品" && <td className="p-2"><select aria-label="商品" disabled={!row.douyinId} className={inputClass} value={row.productId} onChange={e => updateRow(row.id, { productId: e.target.value, storeId: c?.products.find(p => p.id === e.target.value)?.storeId || row.storeId })}><option value="">请选择商品</option>{c?.products.filter(p => (!row.storeId || p.storeId === row.storeId) && c.stores.some(s => s.id === p.storeId && s.douyinIds.includes(row.douyinId))).map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select></td>}<td className="p-2"><select aria-label="店铺" disabled={!row.douyinId} className={inputClass} value={row.storeId} onChange={e => updateRow(row.id, { storeId: e.target.value, productId: "" })}><option value="">请选择</option>{c?.stores.filter(s => s.douyinIds.includes(row.douyinId)).map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></td></>}
              {draft.method === "full_domain" && <td className="p-2"><select aria-label="已有全域计划" disabled={!row.douyinId} className={inputClass} value={row.planId} onChange={e => updateRow(row.id, { planId: e.target.value })}><option value="">请选择</option>{c?.plans.filter(p => p.goal === draft.goal && p.douyinId === row.douyinId).map(p => <option key={p.id} value={p.id}>{p.name} · {p.status}</option>)}</select></td>}
              <td className="p-2"><div className="flex">{draft.method !== "push" && <button title="新增组合" className={iconClass} onClick={() => change({ rows: [...draft.rows, emptyRow(row.accountId)] })}><Copy className="h-4 w-4" /></button>}<button title="删除明细" className={iconClass} onClick={() => change({ rows: draft.rows.filter(r => r.id !== row.id) })}><Trash2 className="h-4 w-4" /></button></div></td></tr>; })}
          </tbody></table>{!draft.rows.length && <div className="py-10 text-center text-xs text-slate-400">暂无数据</div>}</div>
        </section>
        {draft.method === "plan" && <section className="space-y-4 border-b border-slate-200 py-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-bold">计划模板</h2><div className="flex gap-2"><select aria-label="模板类型筛选" className={inputClass} value={templateScope} onChange={e => setTemplateScope(e.target.value)}><option>全部模板</option><option>个人模板</option><option>公司模板</option></select><button title="刷新模板数据" className={iconClass} onClick={() => updateAdStore(s => s)}><RefreshCw className="h-4 w-4" /></button><button onClick={() => setEditor({})} className={`${primaryClass} whitespace-nowrap`}><Plus className="h-4 w-4" />新建模板</button></div></div>
          {templates.map(t => <div key={t.id} className="flex items-center gap-3 border-b border-slate-100 py-3"><input aria-label={`选择模板 ${t.name}`} type="checkbox" className="h-4 w-4 accent-violet-600" checked={draft.templateIds.includes(t.id)} onChange={() => change({ templateIds: draft.templateIds.includes(t.id) ? draft.templateIds.filter(id => id !== t.id) : [...draft.templateIds, t.id] })} /><div className="min-w-0 flex-1"><p className="break-all text-sm font-semibold">{t.name}</p><p className="mt-1 text-xs text-slate-500">{t.scope} · {t.params.scene} · 日预算 ¥{t.params.budget} · {t.params.optimization} {t.params.bid}</p><p className="mt-1 break-all text-xs text-slate-400">{t.naming}{t.suffix}</p></div><button title={`编辑模板 ${t.name}`} className={iconClass} onClick={() => setEditor({ template: t })}><Pencil className="h-4 w-4" /></button><button title={`删除模板 ${t.name}`} className={iconClass} onClick={() => setDeleting(t)}><Trash2 className="h-4 w-4" /></button></div>)}
          {!templates.length && <p className="py-8 text-center text-xs text-slate-400">暂无模板</p>}
        </section>}
        <section className="space-y-4 py-5"><h2 className="text-sm font-bold">推送视频设置</h2><Options label="视频类型" values={["转码后视频", "原片"]} value={draft.version} onChange={v => change({ version: v as AdDraft["version"] })} /><label className="flex items-center gap-3 text-xs"><input className="accent-violet-600" type="checkbox" checked={scheduled} onChange={e => { setScheduled(e.target.checked); if (!e.target.checked) change({ scheduledAt: "" }); }} />定时创建</label>{scheduled && <Field title="创建时间"><input type="datetime-local" className={inputClass} value={draft.scheduledAt} onChange={e => change({ scheduledAt: e.target.value })} /></Field>}<Field title="视频推送至素材库名称"><input className={inputClass} value={draft.naming} onChange={e => change({ naming: e.target.value })} /></Field><div className="flex flex-wrap gap-3 text-xs">{["视频名称", "视频ID", "当前用户姓名", "日期(年月日)"].map(w => <button className="text-violet-600" key={w} onClick={() => change({ naming: draft.naming + `{${w}}` })}>{`{${w}}`}</button>)}</div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600"><span>推送成功后成片状态</span><select aria-label="推送成功后是否修改成片状态" className={inputClass + " max-w-40"} value={draft.successStatus ? "change" : "keep"} onChange={e => change({ successStatus: e.target.value === "change" ? "已上机" : "" })}><option value="change">修改状态</option><option value="keep">保持不变</option></select>{draft.successStatus && <VideoStatusSelect value={draft.successStatus} onChange={v => change({ successStatus: v })} />}</div>
          {draft.method === "plan" && <p className="text-xs text-amber-700">计划创建成功后默认暂停，由运营在千川检查后手动开启。</p>}
        </section>
      </main>
    </div></div>
    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3"><div className="mr-auto"><ErrorLine text={error} /></div><button className={buttonClass} onClick={onClose}>取消</button><button className={primaryClass} disabled={submitting} onClick={() => submit()}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}提交推送</button></footer>
    {picker && <AdDialog title="选择账户" wide onClose={() => setPicker(false)} footer={<><button className={buttonClass} onClick={() => setPicker(false)}>取消</button><button className={primaryClass} disabled={!picked.length} onClick={() => { change({ rows: [...draft.rows, ...picked.filter(id => draft.method !== "push" || !draft.rows.some(r => r.accountId === id)).map(emptyRow)] }); setPicker(false); }}>确定</button></>}>
      <div className="grid gap-5 md:grid-cols-2"><div className="min-w-0"><div className="flex flex-wrap gap-3 border-b border-slate-200 pb-3">{["收藏账户", "个人账户", "小组账户", "分类账户", "全部账户", "公司分组"].map(s => <button key={s} className={`text-xs ${s === scope ? "font-bold text-violet-600" : "text-slate-500"}`} onClick={() => setScope(s)}>{s}</button>)}</div><input autoFocus aria-label="搜索广告账户" className={`${inputClass} my-3`} placeholder="请输入账户名称/ID" value={search} onChange={e => setSearch(e.target.value)} />{scope === "公司分组" && <select aria-label="公司分组" className={`${inputClass} mb-3`} value={groupId} onChange={e => setGroupId(e.target.value)}><option value="">全部分组</option>{store.groups.filter(g => g.platform === draft.platform).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>}
      <label className="flex items-center gap-2 text-xs"><input aria-label="全选可用账户" type="checkbox" checked={available.some(a => a.status === "authorized") && available.filter(a => a.status === "authorized").every(a => picked.includes(a.id))} onChange={e => setPicked(e.target.checked ? [...new Set([...picked, ...available.filter(a => a.status === "authorized" && !a.revoked).map(a => a.id)])] : picked.filter(id => !available.some(a => a.id === id)))} />全选</label>
      <div className="mt-3 h-64 overflow-auto">{available.map(a => <div key={a.id} className="flex items-center gap-2 border-b border-slate-100 py-3"><label className={`flex min-w-0 flex-1 items-start gap-3 text-xs ${a.status === "expired" ? "text-slate-400" : "text-slate-700"}`}><input aria-label={a.name} disabled={a.status === "expired" || a.revoked} type="checkbox" className="mt-1 accent-violet-600" checked={picked.includes(a.id)} onChange={e => setPicked(e.target.checked ? [...picked, a.id] : picked.filter(id => id !== a.id))} /><span className="min-w-0"><span className="block break-words">{a.name}</span><span className="mt-1 block text-slate-400">{a.id} · {a.status === "expired" ? "已失效" : "已授权"}</span></span></label><button title={a.isStarred ? "取消收藏" : "收藏账户"} className={iconClass} onClick={() => updateAdStore(s => ({ ...s, accounts: s.accounts.map(x => x.id === a.id ? { ...x, isStarred: !x.isStarred } : x) }))}><Star className={`h-4 w-4 ${a.isStarred ? "fill-amber-400 text-amber-400" : ""}`} /></button></div>)}</div></div>
      <div className="min-w-0 border-l border-slate-200 pl-5"><h3 className="mb-3 text-sm font-semibold">已选账号（{picked.length}）</h3>{picked.map(id => <div key={id} className="flex items-center justify-between gap-2 border-b border-slate-100 py-3 text-xs"><span className="break-all">{accounts.find(a => a.id === id)?.name}</span><button title="移除账户" className={iconClass} onClick={() => setPicked(p => p.filter(x => x !== id))}><X className="h-4 w-4" /></button></div>)}</div></div>
    </AdDialog>}
    {editor && <TemplateEditor initial={editor.template} goal={draft.goal} video={video} row={draft.rows[0]} account={accounts.find(a => a.id === draft.rows[0]?.accountId)} onClose={() => setEditor(null)} onSave={t => { change({ templateIds: [...new Set([...draft.templateIds, t.id])] }); setEditor(null); }} />}
    {deleting && <AdDialog title="删除模板" onClose={() => setDeleting(null)} footer={<><button className={buttonClass} onClick={() => setDeleting(null)}>取消</button><button className={primaryClass} onClick={removeTemplate}>确定删除</button></>}><p className="text-sm">确定删除“{deleting.name}”？已创建任务保留当时的配置。</p></AdDialog>}
    {confirmFull && <AdDialog title="确认追加视频" onClose={() => setConfirmFull(false)} footer={<><button className={buttonClass} onClick={() => setConfirmFull(false)}>取消</button><button className={primaryClass} onClick={() => submit(true)}>确认追加</button></>}><p className="text-sm leading-6 text-amber-800">本次将向所选已有全域计划追加当前视频。新增视频可能进入投放链路；不会移除、替换原有视频，也不会变更计划的开启状态。</p></AdDialog>}
  </OverlayPortal>;
}

export function PushRecordsModal({ records: _records, videoId, onClose, onEdit }: { records?: AdPushRecord[]; videoId: string; onClose: () => void; onEdit: (draft: AdDraft) => void }) {
  const store = useAdStore(), actor = getAdActor();
  const [tab, setTab] = useState("推送视频"), [search, setSearch] = useState(""), [status, setStatus] = useState("");
  const [platform, setPlatform] = useState(""), [version, setVersion] = useState(""), [goal, setGoal] = useState("");
  const [start, setStart] = useState(""), [end, setEnd] = useState(""), [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20);
  const [detailId, setDetailId] = useState<string | null>(null), [selected, setSelected] = useState<string[]>([]), [confirmCancel, setConfirmCancel] = useState(false), [error, setError] = useState("");
  const related = visibleAdRecords(store, actor, videoId);
  const filtered = related.filter(r => (tab === "推送视频" || r.method !== "push") && (!platform || r.platform === platform) && (!version || r.snapshot.version === version) && (!goal || (r.method !== "push" && r.marketingGoal === goal)) && (!status || r.status === status) && (!search || [r.account, r.accountId, r.assetId, r.planId, r.templateName, r.taskId, r.operator].some(s => s.toLowerCase().includes(search.toLowerCase()))) && (!start || r.createdAt.slice(0, 10) >= start) && (!end || r.createdAt.slice(0, 10) <= end));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize))), rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const detail = related.find(r => r.id === detailId);
  const exportRecords = () => {
    const cells = [["视频ID", "账户ID", "任务ID", "素材ID", "计划ID", "状态", "失败原因", "操作人"], ...filtered.map(r => [r.videoId, r.accountId, r.taskId, r.assetId, r.planId, r.status, r.failureReason, r.operator])];
    const csv = cells.map(row => row.map(s => `"${(/^[=+@-]/.test(s) ? "'" : "") + s.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })), a = document.createElement("a"); a.href = url; a.download = "推送记录.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const edit = (r: AdPushRecord) => {
    if (!actor.permissions.includes("uc_ad_push")) return setError("暂无推送权限");
    if (r.method !== "push" && !actor.permissions.includes("uc_ad_plan_manage")) return setError("暂无管理投放计划权限");
    onEdit({ ...structuredClone(r.snapshot), scheduledAt: "" });
  };
  return <AdDialog title="推送记录" wide onClose={onClose} footer={<AssetPagination total={filtered.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={n => { setPageSize(n); setPage(1); }} />}>
    <div className="mb-4 flex gap-4 border-b border-slate-200 pb-3">{["推送视频", "创建计划记录"].map(t => <button key={t} onClick={() => { setTab(t); setPage(1); setSelected([]); }} className={`text-sm ${tab === t ? "font-bold text-violet-600" : "text-slate-500"}`}>{t}</button>)}</div>
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field title="账户 / 素材 / 计划 / 模板 / 任务 / 操作人"><input className={inputClass} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></Field><Field title="状态"><select className={inputClass} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">全部状态</option>{["待处理", "推送中", "审核中", "创建计划中", "推送成功", "推送失败", "已取消"].map(s => <option key={s}>{s}</option>)}</select></Field><Field title="开始日期"><input type="date" className={inputClass} value={start} onChange={e => { setStart(e.target.value); setPage(1); }} /></Field><Field title="结束日期"><input type="date" className={inputClass} min={start} value={end} onChange={e => { setEnd(e.target.value); setPage(1); }} /></Field></div>
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <Field title="广告平台"><select className={inputClass} value={platform} onChange={e => { setPlatform(e.target.value); setPage(1); }}><option value="">全部平台</option>{AD_PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></Field>
      <Field title="推送视频类型"><select className={inputClass} value={version} onChange={e => { setVersion(e.target.value); setPage(1); }}><option value="">全部类型</option><option>原片</option><option>转码后视频</option></select></Field>
      <Field title="营销目标"><select className={inputClass} value={goal} onChange={e => { setGoal(e.target.value); setPage(1); }}><option value="">全部目标</option><option>推商品</option><option>推直播间</option></select></Field>
    </div>
    <div className="mb-3 flex flex-wrap gap-3"><button className={buttonClass} onClick={() => { setSearch(""); setStatus(""); setStart(""); setEnd(""); setPlatform(""); setVersion(""); setGoal(""); setPage(1); setSelected([]); }}>重置</button><button className={buttonClass} disabled={!selected.length} onClick={() => setConfirmCancel(true)}>取消待处理任务（{selected.length}）</button><button className={buttonClass} onClick={exportRecords}><Download className="h-4 w-4" />导出</button></div><ErrorLine text={error} />
    <div className="overflow-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr>{["选择", "广告账户", "任务ID", "素材ID", tab === "推送视频" ? "推送状态 / 素材审核" : "计划 / 创建结果 / 投放状态", "任务状态", "失败原因", "操作人 / 创建时间", "操作"].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id} className="border-b border-slate-100"><td className="p-3"><input aria-label={`选择记录 ${r.id}`} type="checkbox" disabled={r.status !== "待处理"} checked={selected.includes(r.id)} onChange={e => setSelected(e.target.checked ? [...selected, r.id] : selected.filter(id => id !== r.id))} /></td><td className="max-w-52 break-words p-3">{r.account}<p className="mt-1 text-slate-400">{r.accountId}</p></td><td className="max-w-28 break-all p-3">{r.taskId}</td><td className="max-w-32 break-all p-3">{r.assetId || "--"}</td><td className="max-w-52 break-all p-3">{tab === "推送视频" ? <>{r.pushStatus}<p>{r.materialReview}</p></> : <>{r.planName}<p className="mt-1 text-slate-500">{r.planId || "--"}</p><p>{r.planResult} · {r.deliveryStatus}</p></>}</td><td className="p-3"><span className={`whitespace-nowrap ${r.status === "推送成功" ? "text-emerald-600" : r.status === "推送失败" ? "text-rose-600" : "text-slate-600"}`}>{isAdActive(r) && <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />}{r.status}</span></td><td className="max-w-40 p-3 text-rose-600">{r.failureReason || "--"}</td><td className="p-3">{r.operator}<p className="mt-1 text-slate-400">{r.createdAt}</p></td><td className="p-3"><button className="whitespace-nowrap text-violet-600" onClick={() => setDetailId(r.id)}>详情</button>{["推送失败", "已取消"].includes(r.status) && <button className="mt-2 block whitespace-nowrap text-violet-600" onClick={() => edit(r)}>重新编辑</button>}</td></tr>)}</tbody></table>{!rows.length && <p className="py-12 text-center text-sm text-slate-400">暂无数据</p>}</div>
    {detail && <AdDialog title="推送任务详情" onClose={() => setDetailId(null)}>
      <dl className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 text-xs">
        {Object.entries({
          "成片": detail.videoTitle,
          "广告平台": detail.platform,
          "广告账户": `${detail.account} (${detail.accountId})`,
          "推送方式": detail.method === "push" ? "仅推送" : detail.method === "plan" ? "推送并搭建计划" : "全域推广",
          "推送视频类型": detail.snapshot.version,
          "营销目标": detail.method === "push" ? "不涉及" : detail.marketingGoal,
          "抖音号ID": detail.snapshot.rows[0]?.douyinId || "不涉及",
          "店铺ID": detail.snapshot.rows[0]?.storeId || "不涉及",
          "商品ID": detail.snapshot.rows[0]?.productId || "不涉及",
          "素材ID": detail.assetId || "--",
          "素材名称": detail.assetName,
          "素材审核": detail.materialReview,
          "计划ID": detail.planId || "--",
          "计划名称": detail.planName || "--",
          "创建结果": detail.planResult,
          "计划审核": detail.planReview,
          "投放状态": detail.deliveryStatus,
          "推送后成片状态": detail.snapshot.successStatus || "保持不变",
          "失败原因": detail.failureReason || "--",
        }).map(([k, v]) => <React.Fragment key={k}><dt className="text-slate-500">{k}</dt><dd className="break-all text-slate-800">{v}</dd></React.Fragment>)}
      </dl>
      {detail.templateSnapshot && <div className="mt-5 border-t border-slate-200 pt-4">
        <h3 className="mb-2 text-sm font-semibold">历史模板配置</h3>
        <p className="text-xs leading-6">{detail.templateSnapshot.name} · {detail.templateSnapshot.params.scene} · 日预算 {detail.templateSnapshot.params.budget} 元 · 出价 {detail.templateSnapshot.params.bid} · {detail.templateSnapshot.params.optimization} · {detail.templateSnapshot.params.period}</p>
      </div>}
      <h3 className="mb-3 mt-5 text-sm font-semibold">执行日志</h3>
      {detail.logs.map((log, i) => <p key={i} className="mb-2 text-xs leading-5"><span className="mr-3 text-slate-400">{log.time}</span>{log.text}</p>)}
    </AdDialog>}
    {confirmCancel && <AdDialog title="取消待处理任务" onClose={() => setConfirmCancel(false)} footer={<><button className={buttonClass} onClick={() => setConfirmCancel(false)}>返回</button><button className={primaryClass} onClick={() => { try { cancelAdRecords(selected); setSelected([]); setConfirmCancel(false); } catch (e) { setError(e instanceof Error ? e.message : "取消失败"); setConfirmCancel(false); } }}>确定取消</button></>}><p className="text-sm">确定取消所选 {selected.length} 条待处理记录？已开始执行的任务无法取消。</p></AdDialog>}
  </AdDialog>;
}
