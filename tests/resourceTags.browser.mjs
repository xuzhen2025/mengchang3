import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { chromium, expect } = createRequire(import.meta.url)("playwright/test");
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(12000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("dialog", (dialog) => dialog.accept());
const button = (name) => page.getByRole("button", { name, exact: true });
const publicName = "\u79cb\u5b63\u901a\u52e4\u7a7f\u642d";
const renamed = "\u79cb\u5b63\u901a\u52e4\u5b9e\u62cd";
const personalName = "\u672c\u6708\u590d\u6295\u5907\u9009";
const personalRenamed = "\u672c\u6708\u590d\u6295\u7cbe\u9009";
const expectTagFormFields = async () => {
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator("textarea")).toHaveCount(2);
  await expect(dialog.locator('input[type="date"]')).toHaveCount(2);
  await expect(dialog.locator('select, input[type="file"]')).toHaveCount(0);
  await expect(dialog.getByText("AI\u8bc6\u522b\u65b9\u5411", { exact: true })).toHaveCount(0);
  await expect(dialog.getByText("\u56fe\u7247\u63cf\u8ff0", { exact: true })).toHaveCount(0);
};
const switchMode = async (mode) => {
  await page.locator("#btn-client-mode-dropdown").click();
  await button(mode === "admin" ? "\u7ba1\u7406\u7aef" : "\u7528\u6237\u7aef").click();
};
const publicAdmin = async () => {
  await switchMode("admin");
  await button("\u516c\u5171\u6807\u7b7e").click();
};
const resources = async () => {
  await page.locator("#sidebar-item-home").click();
  await page.locator("#sidebar-item-resources").click();
};
const upload = async (label) => {
  await resources();
  await button("\u4e0a\u4f20\u6587\u4ef6").click();
  await page.getByRole("button", { name: new RegExp(`^${label}`) }).click();
};

try {
  await page.addInitScript(() => localStorage.setItem("mengchang_prototype_session", JSON.stringify({ username: "chaojiguanliyuan", mode: "admin" })));
  await page.goto(process.env.PREVIEW_URL || "http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await button("\u516c\u5171\u6807\u7b7e").click();
  await button("\u65b0\u589e").click();
  await expectTagFormFields();
  await page.getByRole("dialog").getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\u79f0", { exact: true })).toBeVisible();
  await page.getByRole("dialog").locator("textarea").first().fill(publicName);
  await page.getByRole("dialog").locator('input[type="date"]').first().fill("2026-09-01");
  await page.getByRole("dialog").locator('input[type="date"]').last().fill("2026-12-31");
  await page.getByRole("dialog").locator("textarea").last().fill("Autumn campaign");
  await page.screenshot({ path: "tmp/public-tag-form.png" });
  await page.getByRole("dialog").getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
  await expect(page.getByTitle(`\u7f16\u8f91\u6807\u7b7e ${publicName}`)).toBeVisible();
  const createdTag = await page.evaluate(async name => (await import("/src/lib/resourceTags.ts")).resourceTagStore.getPublicGroups().flatMap(group => group.subTags).find(tag => tag.name === name), publicName);
  assert.equal(createdTag.startDate, "2026-09-01");
  assert.equal(createdTag.endDate, "2026-12-31");
  assert.equal(createdTag.description, "Autumn campaign");
  assert.ok(!("aiDirection" in createdTag) && !("imageUrl" in createdTag));
  await switchMode("user");

  for (const label of ["\u4e0a\u4f20\u56fe\u7247", "\u4e0a\u4f20\u97f3\u9891", "\u4e0a\u4f20\u811a\u672c", "\u4e0a\u4f20\u89c6\u9891"]) {
    await upload(label);
    await expect(page.getByText(publicName, { exact: true })).toBeVisible();
    await expect(page.getByText("\u5185\u5bb9\u6392\u671f", { exact: true })).toBeVisible();
    await expect(page.getByText(/Zs\u6d4b\u8bd5/)).toHaveCount(0);
    console.log(`PASS: shared tag sources in ${label}`);
    if (label !== "\u4e0a\u4f20\u89c6\u9891") await button("\u8fd4\u56de\u5217\u8868").click();
  }
  await page.locator("label").filter({ hasText: publicName }).getByRole("checkbox").check();
  await page.locator('input[type="file"][accept*="video"]').first().setInputFiles({ name: "tag-linked-video.mp4", mimeType: "video/mp4", buffer: Buffer.from("prototype fixture") });
  await button("\u53d1\u5e03").click();
  await expect.poll(async () => (await page.evaluate(async () => (await import("/src/lib/resourceUploads.ts")).getUploadedResources())).length).toBe(1);
  await expect(page.getByText("tag-linked-video.mp4", { exact: true }).first()).toBeVisible();
  const publishedId = await page.evaluate(async () => (await import("/src/lib/resourceUploads.ts")).getUploadedResources()[0].id);
  await page.getByText("tag-linked-video.mp4", { exact: true }).first().click();
  await expect(button("+ \u6dfb\u52a0\u516c\u5171\u6807\u7b7e")).toBeVisible();
  await expect(page.getByText(publicName, { exact: true })).toBeVisible();
  console.log("PASS: video upload saves selected tags and appears in list/detail");

  await resources();
  const batchIds = [publishedId, "fv1"];
  const beforeBatch = await page.evaluate(async (ids) => {
    const { resourceTagStore } = await import("/src/lib/resourceTags.ts");
    return ids.map(id => resourceTagStore.project("finished", { id }));
  }, [...batchIds, "fv2"]);
  for (const id of batchIds) {
    const card = page.locator(`[data-video-id="${id}"]`);
    await card.hover();
    await card.getByTitle("\u9009\u62e9\u6b64\u9879", { exact: true }).click();
  }
  for (const [kind, label, tag] of [
    ["publicTags", "\u6dfb\u52a0\u516c\u5171\u6807\u7b7e", publicName],
    ["personalTags", "\u6dfb\u52a0\u4e2a\u4eba\u6807\u7b7e", "\u672c\u5468\u4e3b\u63a8"],
  ]) {
    await button("\u6dfb\u52a0\u6807\u7b7e").click();
    await page.getByRole("menuitem", { name: label, exact: true }).click();
    const batchDialog = page.getByRole("dialog", { name: label, exact: true });
    await batchDialog.getByRole("checkbox", { name: tag, exact: true }).check();
    await batchDialog.getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
    const assigned = await page.evaluate(async (ids) => {
      const { resourceTagStore } = await import("/src/lib/resourceTags.ts");
      return ids.map(id => resourceTagStore.project("finished", { id }));
    }, [...batchIds, "fv2"]);
    for (let i = 0; i < batchIds.length; i++) {
      assert.deepEqual(new Set(assigned[i][kind]), new Set([...beforeBatch[i][kind], tag]));
    }
    assert.deepEqual(assigned[2], beforeBatch[2]);
  }
  console.log("PASS: batch public/personal tags preserve existing tags and unselected resources");

  await publicAdmin();
  await page.evaluate(async name => {
    const { resourceTagStore } = await import("/src/lib/resourceTags.ts");
    resourceTagStore.setPublicGroups(groups => groups.map(group => ({ ...group, subTags: group.subTags.map(tag => tag.name === name ? { ...tag, aiDirection: "legacy-direction", imageUrl: "/legacy-tag.png" } : tag) })));
  }, publicName);
  await page.getByTitle(`\u7f16\u8f91\u6807\u7b7e ${publicName}`).click();
  await expectTagFormFields();
  await expect(page.getByRole("dialog").locator('input[type="date"]').first()).toHaveValue("2026-09-01");
  await expect(page.getByRole("dialog").locator('input[type="date"]').last()).toHaveValue("2026-12-31");
  await expect(page.getByRole("dialog").locator("textarea").last()).toHaveValue("Autumn campaign");
  await page.getByRole("dialog").locator("textarea").first().fill(renamed);
  await page.getByRole("dialog").getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
  const editedTag = await page.evaluate(async name => (await import("/src/lib/resourceTags.ts")).resourceTagStore.getPublicGroups().flatMap(group => group.subTags).find(tag => tag.name === name), renamed);
  assert.deepEqual(editedTag, { ...createdTag, name: renamed, aiDirection: "legacy-direction", imageUrl: "/legacy-tag.png" });
  await switchMode("user");
  await resources();
  await button("\u5546\u54c1\u5356\u70b9").hover();
  await button(renamed).click();
  await expect(page.getByTestId("finished-video-card")).toHaveCount(2);
  await button("\u91cd\u7f6e\u516c\u5171\u6807\u7b7e").click();
  console.log("PASS: renamed public tag filters the resources assigned through upload and batch editing");
  await page.getByText("tag-linked-video.mp4", { exact: true }).first().click();
  await expect(page.getByText(renamed, { exact: true })).toBeVisible();
  await expect(page.getByText(publicName, { exact: true })).toHaveCount(0);

  await button("+ \u6dfb\u52a0\u4e2a\u4eba\u6807\u7b7e").click();
  await button("\u7f16\u8f91\u4e2a\u4eba\u6807\u7b7e").click();
  const manager = page.getByRole("dialog", { name: "\u7f16\u8f91\u4e2a\u4eba\u6807\u7b7e", exact: true });
  await manager.getByRole("button", { name: "\u65b0\u589e", exact: true }).click();
  await page.getByPlaceholder("\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\u79f0", { exact: true }).last().fill(personalName);
  await button("\u786e\u8ba4\u65b0\u589e").click();
  await button("\u5173\u95ed\u6807\u7b7e\u7ba1\u7406").click();
  const selector = page.getByRole("dialog", { name: "\u5173\u8054\u4e2a\u4eba\u6807\u7b7e", exact: true });
  await selector.getByRole("checkbox", { name: personalName, exact: true }).check();
  await button("\u7f16\u8f91\u4e2a\u4eba\u6807\u7b7e").click();
  await manager.getByTitle(`\u7f16\u8f91\u4e2a\u4eba\u6807\u7b7e ${personalName}`).click();
  await page.getByPlaceholder("\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\u79f0", { exact: true }).last().fill(personalRenamed);
  await button("\u4fdd\u5b58").click();
  await button("\u5173\u95ed\u6807\u7b7e\u7ba1\u7406").click();
  await expect(selector.getByRole("checkbox", { name: personalRenamed })).toBeChecked();
  await selector.getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
  await expect(page.getByText(personalRenamed, { exact: true })).toBeVisible();
  const count = await page.evaluate(async (name) => (await import("/src/lib/resourceTags.ts")).resourceTagStore.getPersonalTags().find((tag) => tag.name === name).resourceIds.length, personalRenamed);
  assert.equal(count, 1);
  console.log("PASS: personal manager creation/rename, open draft and resource counts stay linked");

  await publicAdmin();
  await page.getByText(renamed, { exact: true }).locator("..").getByTitle("\u79fb\u9664\u6b64\u6807\u7b7e").click();
  await switchMode("user");
  await resources();
  await page.getByText("tag-linked-video.mp4", { exact: true }).first().click();
  await expect(page.getByText(renamed, { exact: true })).toHaveCount(0);
  assert.deepEqual(await page.evaluate(async (id) => (await import("/src/lib/resourceTags.ts")).resourceTagStore.project("finished", { id }).publicTags, publishedId), []);
  console.log("PASS: public deletion unlinks the tag, uploaded resource remains");
  for (const [tab, scope, id, title] of [
    ["\u56fe\u7247\u7ba1\u7406", "images", "img-1", "\u9632\u6652\u690d\u7269\u63d0\u53d6\u7cbe\u534e\u6db2\u5c55\u56fe.jpg"],
    ["\u97f3\u9891\u7ba1\u7406", "audio", "aud-1", "\u73b0\u5728\u6d01\u7259"],
    ["\u811a\u672c\u7ba1\u7406", "scripts", "S-10291", "\u811a\u672c 1 - \u53e3\u64ad\u6e29\u548c\u6d01\u9762\u7834\u5708\u6848"],
  ]) {
    await resources();
    await button(tab).click();
    await page.getByText(title, { exact: true }).first().click();
    await page.getByRole("button", { name: /\u6dfb\u52a0\u516c\u5171\u6807\u7b7e/ }).click();
    const chooser = page.getByRole("dialog", { name: "\u5173\u8054\u516c\u5171\u6807\u7b7e" });
    await chooser.getByRole("checkbox", { name: "\u9ad8\u5f39\u900f\u6c14", exact: true }).check();
    await chooser.getByRole("button", { name: "\u786e\u5b9a", exact: true }).click();
    assert.ok(await page.evaluate(async ({scope, id}) => (await import("/src/lib/resourceTags.ts")).resourceTagStore.project(scope, {id}).publicTags.includes("\u9ad8\u5f39\u900f\u6c14"), {scope, id}));
    await resources();
    await button(tab).click();
    await page.getByText(title, { exact: true }).first().click();
    await page.getByRole("button", { name: /\u6dfb\u52a0\u516c\u5171\u6807\u7b7e/ }).click();
    await expect(chooser.getByRole("checkbox", { name: "\u9ad8\u5f39\u900f\u6c14", exact: true })).toBeChecked();
    await chooser.getByRole("button", { name: "\u53d6\u6d88", exact: true }).click();
    console.log(`PASS: ${scope} detail uses shared selector and retains edits after reopening`);
  }
  await page.screenshot({ path: "tmp/resource-tags-linked.png" });
  await page.reload({ waitUntil: "domcontentloaded" });
  const fresh = await page.evaluate(async ({ publicName, renamed, personalName, personalRenamed }) => {
    const { resourceTagStore } = await import("/src/lib/resourceTags.ts");
    return [
      resourceTagStore.entries("public").some(tag => [publicName, renamed].includes(tag.name)),
      resourceTagStore.entries("personal").some(tag => [personalName, personalRenamed].includes(tag.name)),
      resourceTagStore.project("finished", { id: "fv1" }).publicTags.includes(publicName),
    ];
  }, { publicName, renamed, personalName, personalRenamed });
  assert.deepEqual(fresh, [false, false, false]);
  console.log("PASS: new visit resets custom catalogs and tag assignments");
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
