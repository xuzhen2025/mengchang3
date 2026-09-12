import { INITIAL_AD_ACCOUNTS, INITIAL_AD_GROUPS } from "../data/adAccounts";

export const AD_STORE_KEY = "mengchang-ad-workflow-v2";
export const AD_CHANGE_EVENT = "mengchang-ad-workflow-change";
export const AD_PLATFORMS = ["巨量千川", "巨量广告", "巨量本地推", "磁力智投", "磁力金牛", "腾讯ADQ", "淘宝超级短视频", "百度营销", "抖音号作品", "TikTok for Business", "TikTok Video", "快手号作品", "Bilibili", "小红书聚光", "小红书乘风", "Bilibili三连推广", "TikTok"];
export type MarketingGoal = "推商品" | "推直播间";
export type PushMethod = "push" | "plan" | "full_domain";
export type AdPushStatus = "待处理" | "推送中" | "审核中" | "创建计划中" | "推送成功" | "推送失败" | "已取消";
export interface AdAccount {
  id: string; name: string; platform: string; status: "authorized" | "expired";
  category: string; group: string; user: string; remark: string; isStarred: boolean;
  authorizedBy?: string; revoked?: boolean; syncedAt?: string; syncError?: string; catalog?: AdCatalog;
}
export interface AdAccountGroup { id: string; name: string; platform: string; viewTeam: string; viewGroup: string; viewUsers: string[]; accountIds: string[]; }
export interface AdActor { id: string; name: string; team: string; group: string; categories: string[]; permissions: string[]; }
export interface AdParameters {
  scene: string; newcomer: string; adType: string; promotion: string; coupon: boolean;
  budget: number; bid: number; optimization: string; period: string;
}
export const DEFAULT_AD_PARAMETERS: AdParameters = { scene: "日常销售", newcomer: "店铺新客", adType: "通投广告", promotion: "托管", coupon: false, budget: 300, bid: 2, optimization: "成交", period: "7天" };
export interface AdTemplate { id: string; name: string; scope: "个人模板" | "公司模板"; ownerId: string; platform: string; goal: MarketingGoal; naming: string; suffix: string; params: AdParameters; }
export interface DeliveryRow { id: string; accountId: string; douyinId: string; productId: string; storeId: string; planId: string; }
export interface AdVideo { id: string; title: string; coverUrl?: string; author?: string; editedAt?: string; }
export interface AdDraft { platform: string; method: PushMethod; goal: MarketingGoal; rows: DeliveryRow[]; templateIds: string[]; version: "原片" | "转码后视频"; naming: string; scheduledAt: string; creative: "单创意" | "多创意"; successStatus?: string; }
export interface AdPushRecord {
  id: string; taskId: string; kind: "push_video"; videoId: string; videoTitle: string; platform: string;
  accountId: string; account: string; method: PushMethod; marketingGoal: MarketingGoal;
  assetId: string; assetName: string; planId: string; planName: string; templateName: string;
  status: AdPushStatus; pushStatus: string; materialReview: string; planResult: string; planReview: string; deliveryStatus: string;
  failureReason: string; operator: string; operatorId: string; createdAt: string; updatedAt: string; startedAt: number;
  snapshot: AdDraft; templateSnapshot?: AdTemplate; logs: { time: string; text: string }[]; applied?: boolean; resourceStateApplied?: boolean;
}
export interface AdStore { accounts: AdAccount[]; groups: AdAccountGroup[]; templates: AdTemplate[]; records: AdPushRecord[]; visibility: "all" | "personal" | "group" | "category"; sequence: number; }
export const adDate = (date = new Date()) => date.toLocaleString("sv-SE");
export const adId = () => crypto.randomUUID();
const QC = "288194018274011";
export function createAdStore(): AdStore {
  const accounts: AdAccount[] = INITIAL_AD_ACCOUNTS.map(a => ({ ...a, authorizedBy: "徐振" }));
  accounts.push(...[3, 4, 5].map((n): AdAccount => ({ id: QC + n, name: ["梦畅美妆旗舰店-千川主账户", "悦己珠宝直播间-千川账户", "轻氧服饰直营-千川账户"][n - 3], platform: "巨量千川", status: n === 5 ? "expired" : "authorized", category: "千川引流", group: "千川第一组", user: "徐振", authorizedBy: "徐振", remark: n === 5 ? "授权已过期" : "", isStarred: n === 3 })));
  const store: AdStore = { accounts, groups: [...INITIAL_AD_GROUPS, { id: "AG-QC", platform: "巨量千川", name: "千川运营账户", viewTeam: "", viewGroup: "", viewUsers: [], accountIds: accounts.filter(a => a.platform === "巨量千川").map(a => a.id) }], templates: [], records: [], visibility: "all", sequence: 0 };
  const template: AdTemplate = { id: "template-qc-demo", name: "千川日常销售", ownerId: "chaojiguanliyuan", scope: "公司模板", platform: "巨量千川", goal: "推商品", naming: "{日期(月日)}_{模板名称}", suffix: "_20260909_001", params: { ...DEFAULT_AD_PARAMETERS } };
  store.templates = [template]; store.sequence = 1;
  const a = accounts.find(a => a.id === QC + "3")!, catalog = adCatalog(a);
  const draft: AdDraft = { platform: "巨量千川", method: "plan", goal: "推商品", rows: [{ id: "demo-row", accountId: a.id, douyinId: catalog.douyins[0].id, storeId: catalog.stores[0].id, productId: catalog.products[0].id, planId: "" }], templateIds: [template.id], version: "原片", naming: "{视频名称}", scheduledAt: "", creative: "单创意" };
  const actor: AdActor = { id: "chaojiguanliyuan", name: "徐振", team: "电商事业部", group: "千川第一组", categories: ["千川引流"], permissions: ["uc_ad_push", "uc_ad_plan_manage"] };
  const [sample] = createAdRecords(draft, store, actor, { id: "fv1", title: "0730-8835-鲁月园-复古耳环动态奢感视频.mp4", author: "鲁月园" }, new Date("2026-09-09T09:00:00").getTime());
  store.records = [
    { ...sample, id: "demo-material-rejected", taskId: "DEMO-PUSH-001", operator: "张小梅", operatorId: "demo-member", status: "推送失败", assetId: "DEMO-MAT-QC-001", pushStatus: "推送成功", materialReview: "审核驳回", planResult: "未创建", failureReason: "示例：素材包含无法验证的功效承诺，审核驳回", logs: [{ time: sample.createdAt, text: "素材上传成功" }, { time: sample.createdAt, text: "素材审核驳回，未创建计划" }] },
    { ...sample, id: "demo-plan-rejected", taskId: "DEMO-PUSH-002", status: "推送失败", assetId: "DEMO-MAT-QC-002", pushStatus: "推送成功", materialReview: "审核通过", planId: "DEMO-PLAN-002", planResult: "创建成功", planReview: "审核驳回", deliveryStatus: "已暂停", failureReason: "示例：计划资质信息不完整，审核驳回", logs: [{ time: sample.createdAt, text: "素材审核通过，计划创建成功" }, { time: sample.createdAt, text: "计划审核驳回，保持暂停" }] },
  ];
  return store;
}

// Prototype identities use the same persisted session and role matrix as the app.
export function getAdActor(): AdActor {
  let session: { username?: string } = {};
  let roles: { id: string; enabled?: boolean; checkedKeys?: string[] }[] = [];
  try { session = JSON.parse(localStorage.getItem("mengchang_prototype_session") || "{}"); roles = JSON.parse(localStorage.getItem("cloud_video_roles_v2") || "[]"); } catch { /* Use a fail-closed session below. */ }
  const admin = session.username === "chaojiguanliyuan" || session.username === "guanliyuan";
  const role = roles.find(r => r.id === (admin ? "role_super_admin" : "role_staff"));
  const permissions = role ? role.enabled === false ? [] : role.checkedKeys || [] : admin ? ["uc_ad_push", "uc_ad_plan_manage", "ab_ad_group_manage", "ab_system_setting_manage"] : [];
  return { id: session.username || "anonymous", name: admin ? "徐振" : "普通用户", team: "电商事业部", group: "千川第一组", categories: ["千川引流"], permissions };
}
export function canSeeAdAccount(account: AdAccount, store: AdStore, actor: AdActor): boolean {
  const personal = account.authorizedBy === actor.name || account.user === actor.name;
  const systemAllows = store.visibility === "all" || (store.visibility === "personal" && personal) || (store.visibility === "group" && (personal || account.group === actor.group)) || (store.visibility === "category" && actor.categories.includes(account.category));
  const groups = store.groups.filter(g => g.platform === account.platform && g.accountIds.includes(account.id));
  const groupAllows = groups.length ? groups.some(g => (!g.viewTeam && !g.viewGroup && !g.viewUsers.length) || g.viewTeam === actor.team || g.viewGroup === actor.group || g.viewUsers.includes(actor.name)) : personal;
  return systemAllows && groupAllows;
}
export function visibleAdAccounts(store: AdStore, actor: AdActor) { return store.accounts.filter(a => canSeeAdAccount(a, store, actor)); }
export function visibleAdRecords(store: AdStore, actor: AdActor, videoId: string) {
  const ids = new Set(visibleAdAccounts(store, actor).map(a => `${a.platform}:${a.id}`));
  return store.records.filter(r => r.videoId === videoId && ids.has(`${r.platform}:${r.accountId}`));
}

export interface AdCatalog {
  douyins: { id: string; name: string }[];
  stores: { id: string; name: string; douyinIds: string[] }[];
  products: { id: string; name: string; storeId: string }[];
  plans: { id: string; name: string; douyinId: string; goal: MarketingGoal; status: string; videoIds: string[] }[];
}
// Account-scoped fixtures stand in for platform synchronization, never a global option list.
export function adCatalog(account: AdAccount): AdCatalog {
  if (account.catalog) return account.catalog;
  const id = account.id;
  const douyins = [1, 2].map(n => ({ id: `${id}-dy${n}`, name: `${account.name.split("-")[0]} · 抖音号${n}` }));
  const stores = [1, 2].map(n => ({ id: `${id}-store${n}`, name: `旗舰店${n} (${id.slice(-4)})`, douyinIds: douyins.map(d => d.id) }));
  return { douyins, stores, products: stores.flatMap(s => [1, 2].map(n => ({ id: `${s.id}-p${n}`, name: n === 1 ? "ELL卸妆油" : "复古耳环", storeId: s.id }))), plans: douyins.flatMap(d => (["推商品", "推直播间"] as MarketingGoal[]).map(goal => ({ id: `${d.id}-${goal}`, name: `${goal}全域放量计划 (${d.id.slice(-5)})`, douyinId: d.id, goal, status: "投放中", videoIds: ["existing-video"] }))) };
}
export const PLAN_WORDS = ["日期(月日)", "日期(年月日)", "当前时间", "剪辑时间", "推广方式", "转化目标", "优化周期", "模板名称", "视频名称", "视频作者", "抖音号名称"];
export function resolveAdName(pattern: string, video: AdVideo, actor: AdActor, template?: AdTemplate, row?: DeliveryRow, account?: AdAccount, now = new Date()): string {
  const date = adDate(now), catalog = account && adCatalog(account);
  const values: Record<string, string> = { "日期(月日)": date.slice(5, 10).replace("-", ""), "日期(年月日)": date.slice(0, 10).replaceAll("-", ""), "当前时间": date.slice(11).replaceAll(":", ""), "剪辑时间": video.editedAt || date.slice(0, 10), "推广方式": template?.params.promotion || "托管", "转化目标": template?.params.optimization || "成交", "优化周期": template?.params.period || "7天", "模板名称": template?.name || "模板", "视频名称": video.title, "视频作者": video.author || actor.name, "抖音号名称": catalog?.douyins.find(d => d.id === row?.douyinId)?.name || "示例抖音号", "视频ID": video.id, "当前用户姓名": actor.name };
  return pattern.replace(/\{([^{}]+)\}/g, (match, key) => values[key] ?? match);
}
export const nameWidth = (text: string) => [...text].reduce((n, c) => n + (c.charCodeAt(0) > 127 ? 2 : 1), 0);
export function validateAdTemplate(template: AdTemplate): string {
  if (!template.name.trim()) return "请输入模板名称";
  if (!PLAN_WORDS.some(w => template.naming.includes(`{${w}}`))) return "至少添加一个动态词包后才能保存模板";
  const words: string[] = template.naming.match(/\{[^{}]*\}/g) ?? [];
  if (words.some(w => !PLAN_WORDS.includes(w.slice(1, -1)))) return "计划名称包含不支持的动态词包";
  if (!Number.isFinite(template.params.budget) || template.params.budget <= 0 || !Number.isFinite(template.params.bid) || template.params.bid <= 0) return "预算和出价必须大于0";
  return "";
}
export function validateAdDraft(draft: AdDraft, store: AdStore, actor: AdActor): string {
  if (!actor.permissions.includes("uc_ad_push")) return "暂无推送权限";
  if (draft.method !== "push" && !actor.permissions.includes("uc_ad_plan_manage")) return "暂无管理投放计划权限";
  if (!draft.rows.length) return "请至少选择一个广告账户";
  if (!draft.naming.trim()) return "请输入视频推送至素材库名称";
  if (draft.scheduledAt && (!Number.isFinite(Date.parse(draft.scheduledAt)) || Date.parse(draft.scheduledAt) <= Date.now())) return "定时创建时间必须晚于当前时间";
  const combos = new Set<string>();
  for (const [i, row] of draft.rows.entries()) {
    const a = store.accounts.find(a => a.id === row.accountId && a.platform === draft.platform);
    if (!a || !canSeeAdAccount(a, store, actor) || a.status !== "authorized" || a.revoked) return `明细${i + 1}的账户不可用或无操作权限，本次操作无法执行`;
    const c = adCatalog(a);
    if (draft.method !== "push") {
      if (!c.douyins.some(d => d.id === row.douyinId)) return `请补全明细${i + 1}的抖音号`;
      if (draft.method === "plan" && (!c.stores.some(s => s.id === row.storeId && s.douyinIds.includes(row.douyinId)) || (draft.goal === "推商品" && !c.products.some(p => p.id === row.productId && p.storeId === row.storeId)))) return `请补全明细${i + 1}的店铺${draft.goal === "推商品" ? "和商品" : ""}`;
      if (draft.method === "full_domain" && !c.plans.some(p => p.id === row.planId && p.douyinId === row.douyinId && p.goal === draft.goal)) return `请选择明细${i + 1}中当前账户的已有全域计划`;
    }
    const combo = draft.method === "push" ? row.accountId : draft.method === "plan" ? `${row.accountId}:${row.douyinId}:${row.storeId}` : `${row.accountId}:${row.planId}`;
    if (combos.has(combo)) return draft.method === "plan" ? "同一广告账户的抖音号与店铺组合不能重复" : "请勿重复选择同一推送目标";
    combos.add(combo);
  }
  if (draft.method === "plan" && (!draft.templateIds.length || draft.templateIds.some(id => !store.templates.some(t => t.id === id && t.platform === draft.platform && t.goal === draft.goal && (t.scope === "公司模板" || t.ownerId === actor.id))))) return "请选择适用于当前平台及营销目标的模板";
  return "";
}
export function createAdRecords(draft: AdDraft, store: AdStore, actor: AdActor, video: AdVideo, now = Date.now()): AdPushRecord[] {
  const error = validateAdDraft(draft, store, actor);
  if (error) throw new Error(error);
  const taskId = `PUSH-${adId()}`, time = adDate(new Date(now));
  const templates = draft.method === "plan" ? store.templates.filter(t => draft.templateIds.includes(t.id)) : [undefined];
  return draft.rows.flatMap(row => templates.map(template => {
    const account = store.accounts.find(a => a.id === row.accountId && a.platform === draft.platform)!;
    const plan = draft.method === "full_domain" ? adCatalog(account).plans.find(p => p.id === row.planId) : undefined;
    const planName = template ? resolveAdName(template.naming, video, actor, template, row, account, new Date(now)) + template.suffix : plan?.name || "";
    if (template && nameWidth(planName) > 110) throw new Error("计划名称超出110个字符（汉字按2个字符计算），请编辑模板缩短名称");
    return { id: adId(), taskId, kind: "push_video", videoId: video.id, videoTitle: video.title, platform: draft.platform, accountId: account.id, account: account.name, method: draft.method, marketingGoal: draft.goal, assetId: "", assetName: resolveAdName(draft.naming, video, actor, undefined, row, account, new Date(now)), planId: plan?.id || "", planName, templateName: template?.name || "", status: "待处理", pushStatus: "待处理", materialReview: "未提交", planResult: draft.method === "push" ? "不涉及" : "待处理", planReview: draft.method === "push" ? "不涉及" : "未提交", deliveryStatus: plan?.status || "未创建", failureReason: "", operator: actor.name, operatorId: actor.id, createdAt: time, updatedAt: time, startedAt: draft.scheduledAt ? Date.parse(draft.scheduledAt) : now, snapshot: structuredClone({ ...draft, rows: [row], templateIds: template ? [template.id] : [] }), templateSnapshot: template && structuredClone(template), logs: [{ time, text: "推送任务已提交" }] } satisfies AdPushRecord;
  }));
}
export const isAdActive = (r: AdPushRecord) => ["待处理", "推送中", "审核中", "创建计划中"].includes(r.status);
export function advanceAdRecords(records: AdPushRecord[], accounts: AdAccount[], now = Date.now()): AdPushRecord[] {
  return records.map(r => {
    if (!isAdActive(r) || now < r.startedAt) return r;
    const elapsed = now - r.startedAt, a = accounts.find(a => a.id === r.accountId && a.platform === r.platform);
    let status: AdPushStatus = elapsed < 1000 ? "待处理" : elapsed < 2500 ? "推送中" : elapsed < 5000 ? "审核中" : r.method !== "push" && elapsed < 7500 ? "创建计划中" : "推送成功";
    const failure = !a || a.status === "expired" || a.revoked ? "账户授权已失效，请由管理员重新授权后重新编辑" : "";
    if (failure) status = "推送失败";
    if (status === r.status) return r;
    const uploaded = elapsed >= 2500 && !failure, passed = elapsed >= 5000 && !failure, success = status === "推送成功", time = adDate(new Date(now));
    return { ...r, status, updatedAt: time, failureReason: failure, assetId: uploaded ? r.assetId || `MAT-${AD_PLATFORMS.indexOf(r.platform)}-${r.accountId}-${r.videoId}-${r.snapshot.version === "原片" ? "O" : "T"}` : r.assetId, pushStatus: uploaded ? "推送成功" : failure && !r.assetId ? "推送失败" : r.assetId ? "推送成功" : status, materialReview: passed ? "审核通过" : uploaded ? "审核中" : r.materialReview, planResult: r.method === "push" ? "不涉及" : success ? r.method === "plan" ? "创建成功" : "追加成功" : failure ? "失败" : passed ? r.method === "plan" ? "创建计划中" : "追加中" : "待处理", planId: success && r.method === "plan" ? `PLAN-${r.id}` : r.planId, planReview: r.method === "push" ? "不涉及" : success ? "审核通过" : passed ? "审核中" : r.planReview, deliveryStatus: success && r.method === "plan" ? "已暂停" : r.deliveryStatus, logs: [...r.logs, { time, text: failure || (success && r.method === "plan" ? "计划创建成功，默认暂停" : status) }] };
  });
}
export function readAdStore(): AdStore {
  try { const parsed = JSON.parse(localStorage.getItem(AD_STORE_KEY) || "null"); if (parsed && Array.isArray(parsed.accounts) && Array.isArray(parsed.records)) return parsed; } catch { /* Start only this prototype's store when missing or unreadable. */ }
  return createAdStore();
}
export function updateAdStore(update: (store: AdStore) => AdStore): AdStore {
  const next = update(readAdStore());
  localStorage.setItem(AD_STORE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(AD_CHANGE_EVENT));
  return next;
}
export function saveAdTemplate(template: AdTemplate): AdTemplate {
  if (!getAdActor().permissions.includes("uc_ad_plan_manage")) throw new Error("暂无管理投放计划权限");
  const error = validateAdTemplate(template); if (error) throw new Error(error);
  let saved = template;
  updateAdStore(store => {
    const existing = store.templates.find(t => t.id === template.id);
    if (existing?.scope === "个人模板" && existing.ownerId !== getAdActor().id) throw new Error("暂无此模板操作权限");
    const sequence = template.suffix ? store.sequence : store.sequence + 1;
    saved = { ...template, suffix: template.suffix || `_${adDate().slice(0, 10).replaceAll("-", "")}_${String(sequence).padStart(3, "0")}` };
    return { ...store, sequence, templates: [saved, ...store.templates.filter(t => t.id !== saved.id)] };
  });
  return saved;
}
export function cancelAdRecords(ids: string[]): void {
  const actor = getAdActor();
  updateAdStore(store => {
    const current = advanceAdStore(store);
    const targets = current.records.filter(r => ids.includes(r.id));
    if (!targets.length || targets.length !== new Set(ids).size) throw new Error("所选记录已发生变化，请刷新后重新选择");
    if (!actor.permissions.includes("uc_ad_push") || targets.some(r => r.status !== "待处理" || (r.method !== "push" && !actor.permissions.includes("uc_ad_plan_manage")) || !visibleAdRecords(store, actor, r.videoId).some(v => v.id === r.id))) throw new Error("存在无操作权限或已开始执行的记录，本次操作无法执行");
    return { ...current, records: current.records.map(r => ids.includes(r.id) ? { ...r, status: "已取消", pushStatus: "已取消", planResult: r.method === "push" ? "不涉及" : "已取消", updatedAt: adDate(), logs: [...r.logs, { time: adDate(), text: "用户取消待处理任务" }] } : r) };
  });
}
export function revokeAdAccounts(ids: string[], platform: string): void {
  if (!getAdActor().permissions.includes("ab_ad_group_manage")) throw new Error("暂无管理广告组权限");
  updateAdStore(store => {
    const records = advanceAdRecords(store.records, store.accounts);
    if (records.some(r => r.platform === platform && ids.includes(r.accountId) && isAdActive(r))) throw new Error("当前账户有进行中的推送任务");
    return { ...store, records, accounts: store.accounts.map(a => a.platform === platform && ids.includes(a.id) ? { ...a, status: "expired", revoked: true } : a) };
  });
}

export function authorizeAdAccount(platform: string, id: string, name: string): void {
  const actor = getAdActor();
  if (!actor.permissions.includes("ab_ad_group_manage")) throw new Error("暂无管理广告组权限");
  if (!id || !name) throw new Error("请选择需要授权的广告账户");
  updateAdStore(store => {
    const existing = store.accounts.find(a => a.platform === platform && a.id === id);
    const account: AdAccount = existing
      ? { ...existing, name, status: "authorized", revoked: false, syncError: "", syncedAt: adDate() }
      : { id, name, platform, status: "authorized", category: "", group: "", user: actor.name, authorizedBy: actor.name, remark: "", isStarred: false, syncedAt: adDate() };
    account.catalog = adCatalog(account);
    return { ...store, accounts: [account, ...store.accounts.filter(a => a.platform !== platform || a.id !== id)] };
  });
}

// Only successful appends change the existing plan's material list; its status is preserved.
export function advanceAdStore(store: AdStore, now = Date.now()): AdStore {
  const records = advanceAdRecords(store.records, store.accounts, now);
  let accounts = store.accounts;
  const applied = records.map(r => {
    if (r.method !== "full_domain" || r.status !== "推送成功" || r.applied) return r;
    accounts = accounts.map(a => a.id !== r.accountId || a.platform !== r.platform ? a : { ...a, catalog: { ...adCatalog(a), plans: adCatalog(a).plans.map(p => p.id !== r.planId ? p : { ...p, videoIds: [...new Set([...p.videoIds, r.videoId])] }) } });
    return { ...r, applied: true };
  });
  return applied.some((r, i) => r !== store.records[i]) ? { ...store, records: applied, accounts } : store;
}
