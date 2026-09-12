import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { AD_STORE_KEY, DEFAULT_AD_PARAMETERS, adCatalog, advanceAdStore, authorizeAdAccount, cancelAdRecords, canSeeAdAccount, createAdRecords, createAdStore, getAdActor, readAdStore, resolveAdName, revokeAdAccounts, saveAdTemplate, updateAdStore, validateAdDraft, validateAdTemplate, visibleAdRecords, type AdDraft, type AdTemplate } from "../src/lib/adPush";
import { saveResourceEdits } from "../src/lib/useResourceEdits";

const values = new Map<string, string>();
const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
const target = new EventTarget();
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
Object.defineProperty(globalThis, "window", { value: Object.assign(target, { localStorage: storage, sessionStorage: storage }), configurable: true });
const video = { id: "test-video", title: "测试视频", author: "测试作者" };
const draft = (): AdDraft => ({ platform: "巨量千川", method: "push", goal: "推商品", rows: [{ id: "row1", accountId: "2881940182740113", douyinId: "", productId: "", storeId: "", planId: "" }], templateIds: [], version: "原片", naming: "{视频名称}", scheduledAt: "", creative: "单创意" });
const planDraft = () => {
  const d = draft(); d.method = "plan"; d.templateIds = ["template-qc-demo"];
  const c = adCatalog(readAdStore().accounts.find(a => a.id === d.rows[0].accountId)!);
  Object.assign(d.rows[0], { douyinId: c.douyins[0].id, storeId: c.stores[0].id, productId: c.products[0].id });
  return d;
};
beforeEach(() => { values.clear(); storage.setItem("mengchang_prototype_session", JSON.stringify({ username: "chaojiguanliyuan" })); storage.setItem(AD_STORE_KEY, JSON.stringify(createAdStore())); });

test("push permission and account visibility are independent gates", () => {
  const s = readAdStore(), actor = getAdActor(), a = s.accounts.find(a => a.id === draft().rows[0].accountId)!;
  assert.equal(validateAdDraft(draft(), s, { ...actor, permissions: [] }), "暂无推送权限");
  assert.equal(canSeeAdAccount(a, { ...s, visibility: "personal" }, { ...actor, name: "其他成员" }), false);
  const restricted = { ...s, groups: s.groups.map(g => ({ ...g, viewUsers: ["其他成员"], viewTeam: "", viewGroup: "" })) };
  assert.equal(canSeeAdAccount(a, restricted, actor), false);
  assert.equal(validateAdDraft(draft(), restricted, actor).includes("无操作权限"), true);
});
test("new account is ungrouped and private; reauthorization upserts", () => {
  authorizeAdAccount("巨量千川", "fresh", "新账户");
  let s = readAdStore(); const a = s.accounts.find(a => a.id === "fresh")!;
  assert.equal(a.group, "");
  assert.equal(canSeeAdAccount(a, s, { ...getAdActor(), name: "普通用户" }), false);
  authorizeAdAccount("巨量千川", "fresh", "更新账户名"); s = readAdStore();
  assert.equal(s.accounts.filter(a => a.id === "fresh").length, 1);
  assert.ok(adCatalog(s.accounts.find(a => a.id === "fresh")!).douyins.length);
});
test("only-push needs no product, store or template", () => assert.equal(validateAdDraft(draft(), readAdStore(), getAdActor()), ""));
test("plan requires both permissions and account-scoped objects", () => {
  const d = planDraft(), s = readAdStore(), actor = getAdActor();
  assert.equal(validateAdDraft(d, s, { ...actor, permissions: ["uc_ad_push"] }), "暂无管理投放计划权限");
  d.rows[0].productId = "wrong-account-product";
  assert.match(validateAdDraft(d, s, actor), /补全/);
});
test("same account may repeat with distinct Douyin and store combinations", () => {
  const d = planDraft(); d.rows.push({ ...d.rows[0], id: "row2" });
  assert.match(validateAdDraft(d, readAdStore(), getAdActor()), /不能重复/);
  const c = adCatalog(readAdStore().accounts.find(a => a.id === d.rows[0].accountId)!);
  d.rows[1].douyinId = c.douyins[1].id;
  assert.equal(validateAdDraft(d, readAdStore(), getAdActor()), "");
  assert.equal(createAdRecords(d, readAdStore(), getAdActor(), video).length, 2);
});
test("live-room plan needs no product", () => {
  const d = planDraft(); d.goal = "推直播间"; d.rows[0].productId = "";
  const s = readAdStore(); s.templates[0].goal = "推直播间";
  assert.equal(validateAdDraft(d, s, getAdActor()), "");
});
test("template needs dynamic word and preserves click order with fixed text", () => {
  const t = { ...readAdStore().templates[0], naming: "固定文字" };
  assert.match(validateAdTemplate(t), /动态词包/);
  assert.equal(resolveAdName("前缀{视频作者}_{视频名称}", video, getAdActor()), "前缀测试作者_测试视频");
});
test("template number is generated on save and survives editing", () => {
  const t: AdTemplate = { ...readAdStore().templates[0], id: "new-template", suffix: "", params: { ...DEFAULT_AD_PARAMETERS } };
  const saved = saveAdTemplate(t), other = saveAdTemplate({ ...t, id: "other-template" });
  assert.match(saved.suffix, /^_\d{8}_\d{3,}$/);
  assert.notEqual(saved.suffix, other.suffix);
  assert.equal(saveAdTemplate({ ...saved, name: "已编辑" }).suffix, saved.suffix);
});
test("task snapshot survives editing and deletion of template", () => {
  const records = createAdRecords(planDraft(), readAdStore(), getAdActor(), video);
  updateAdStore(s => ({ ...s, records, templates: [] }));
  assert.equal(readAdStore().records[0].templateSnapshot?.name, "千川日常销售");
});
test("multiple accounts produce separate platform material IDs", () => {
  const d = draft(); d.rows.push({ ...d.rows[0], id: "r2", accountId: "2881940182740114" });
  const now = Date.now(), s = readAdStore(); s.records = createAdRecords(d, s, getAdActor(), video, now);
  const completed = advanceAdStore(s, now + 10000);
  assert.ok(completed.records.every(r => r.status === "推送成功"));
  assert.equal(new Set(completed.records.map(r => r.assetId)).size, 2);
});
test("new plan completes paused with independent review fields", () => {
  const s = readAdStore(), now = Date.now(); s.records = createAdRecords(planDraft(), s, getAdActor(), video, now);
  const r = advanceAdStore(s, now + 10000).records[0];
  assert.equal(r.deliveryStatus, "已暂停"); assert.equal(r.materialReview, "审核通过"); assert.equal(r.planReview, "审核通过"); assert.ok(r.planId);
});
test("full-domain appends exactly once and preserves existing videos and status", () => {
  const s = readAdStore(), d = draft(), now = Date.now(); d.method = "full_domain";
  const a = s.accounts.find(a => a.id === d.rows[0].accountId)!, p = adCatalog(a).plans[0];
  Object.assign(d.rows[0], { douyinId: p.douyinId, planId: p.id });
  s.records = createAdRecords(d, s, getAdActor(), video, now);
  const next = advanceAdStore(s, now + 10000), final = advanceAdStore(next, now + 11000);
  const result = adCatalog(final.accounts.find(a => a.id === d.rows[0].accountId)!).plans[0];
  assert.deepEqual(result.videoIds, ["existing-video", video.id]); assert.equal(result.status, p.status); assert.equal(next, final);
});
test("active task blocks batch revoke; cancelling queued task allows revoke", () => {
  const d = draft(); d.scheduledAt = new Date(Date.now() + 3600000).toISOString();
  const records = createAdRecords(d, readAdStore(), getAdActor(), video);
  updateAdStore(s => ({ ...s, records }));
  assert.throws(() => revokeAdAccounts([d.rows[0].accountId, "2881940182740114"], d.platform), /进行中/);
  assert.equal(readAdStore().accounts.find(a => a.id === "2881940182740114")!.status, "authorized");
  cancelAdRecords(records.map(r => r.id)); revokeAdAccounts([d.rows[0].accountId], d.platform);
  assert.equal(readAdStore().accounts.find(a => a.id === d.rows[0].accountId)!.revoked, true);
  assert.equal(readAdStore().records.length, 1);
});
test("expired during execution fails only that account; other results retained", () => {
  const s = readAdStore(), d = draft(), now = Date.now(); d.rows.push({ ...d.rows[0], id: "row2", accountId: "2881940182740114" });
  s.records = createAdRecords(d, s, getAdActor(), video, now);
  s.accounts = s.accounts.map(a => a.id === d.rows[0].accountId ? { ...a, status: "expired" } : a);
  const result = advanceAdStore(s, now + 10000);
  assert.deepEqual(result.records.map(r => r.status), ["推送失败", "推送成功"]);
});
test("records filter by video and visible account, not operator", () => {
  const s = readAdStore(), actor = getAdActor();
  assert.equal(visibleAdRecords(s, actor, "fv1").length, 2);
  assert.equal(visibleAdRecords(s, actor, "other-video").length, 0);
  assert.equal(visibleAdRecords({ ...s, visibility: "personal" }, { ...actor, name: "普通用户" }, "fv1").length, 0);
});
test("resource status update merges without removing existing metadata", () => {
  assert.ok(saveResourceEdits("finished", { fv1: { status: "待审核", tags: ["原标签"] } }));
  assert.ok(saveResourceEdits("finished", { fv1: { status: "已上机" } }));
  assert.deepEqual(JSON.parse(storage.getItem("mengchang-resource-edits-v1-finished")!).fv1, { status: "已上机", tags: ["原标签"] });
});
