import { useSyncExternalStore } from "react";

export type OperationKind = "upload" | "export" | "download" | "login";
export interface OperationRecord {
  id: string; ownerId: string; kind: OperationKind; name: string; type: string;
  status: "成功" | "失败" | "已发起"; createdAt: number; message: string;
  resourceId?: string; size?: string; url?: string; example?: boolean;
}
let records: OperationRecord[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getOperationRecords = () => records;
export const useOperationRecords = () => useSyncExternalStore(subscribe, getOperationRecords);
export function operationUser(): string {
  try { return JSON.parse(localStorage.getItem("mengchang_prototype_session") || "{}").username || ""; }
  catch { return ""; }
}
export function recordOperation(input: Omit<OperationRecord, "id" | "createdAt" | "ownerId"> & { ownerId?: string; createdAt?: number }) {
  const ownerId = input.ownerId ?? operationUser();
  if (!ownerId || ownerId === "anonymous") return;
  const record = { ...input, ownerId, id: crypto.randomUUID(), createdAt: input.createdAt ?? Date.now() };
  records = [record, ...records]; emit();
  return record;
}
export function recordLogin(ownerId: string, success: boolean, message = "") {
  const browser = typeof navigator === "undefined" ? "浏览器" : /Edg\//.test(navigator.userAgent) ? "Microsoft Edge" : /Chrome\//.test(navigator.userAgent) ? "Chrome" : "浏览器";
  recordOperation({ ownerId, kind: "login", name: ownerId, type: browser, status: success ? "成功" : "失败", message: message || "账号密码登录" });
}
export function recordDownload(name: string, type: string, success = true, ownerId = operationUser(), message = "") {
  recordOperation({ ownerId, kind: "download", name, type, status: success ? "已发起" : "失败", message: message || (success ? "已提交浏览器下载" : "文件下载失败") });
}
export function startFileDownload(url: string, name: string) {
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
}
export async function downloadHistoryMedia(url: string, name: string, type = "衍生视频") {
  const ownerId = operationUser();
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("文件不可用，请稍后重试");
    const blob = await response.blob();
    if (!blob.size || blob.type.includes("text/html")) throw new Error("文件已失效，请重新获取");
    const objectUrl = URL.createObjectURL(blob);
    startFileDownload(objectUrl, name);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    recordDownload(name, type, true, ownerId);
  } catch (error) {
    recordDownload(name, type, false, ownerId, error instanceof Error ? error.message : "下载失败");
    throw error;
  }
}
export function recordExport(blob: Blob, name: string, type: string) {
  const url = URL.createObjectURL(blob);
  // Export artifacts remain available for re-download during this prototype visit.
  recordOperation({ kind: "export", name, type, status: "成功", size: `${(blob.size / 1024).toFixed(1)} KB`, url, message: "导出文件已生成" });
}
export function exportHistoryCsv(name: string, cells: (string | number)[][], type: string) {
  const csv = cells.map(row => row.map(value => {
    const text = String(value), safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  recordExport(blob, name, type);
  const url = URL.createObjectURL(blob); startFileDownload(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
const seeded = new Set<string>();
export function seedOperationExamples(ownerId: string) {
  if (!ownerId || seeded.has(ownerId)) return;
  seeded.add(ownerId);
  const now = Date.now();
  const exportUrl = URL.createObjectURL(new Blob(["\uFEFF视频ID,视频标题,状态\r\nFV-260918-026,焕肤精华_投放版.mp4,成功"], { type: "text/csv;charset=utf-8" }));
  const examples: Omit<OperationRecord, "id" | "ownerId" | "createdAt">[] = [
    { kind: "export", name: "衍生视频记录_20260918.csv", type: "衍生视频记录", status: "成功", message: "导出文件已生成", size: "0.1 KB", url: exportUrl },
    { kind: "upload", name: "秋季焕肤精华_产品特写.mp4", type: "素材", status: "成功", message: "护肤 / 精华", size: "28.6 MB", resourceId: "SC-260918-031" },
    { kind: "upload", name: "轻氧跑鞋_外部参考.mp4", type: "第三方", status: "成功", message: "服饰 / 运动鞋", size: "42.8 MB", resourceId: "TP-260918-006" },
    { kind: "upload", name: "秋季焕肤精华_主图.jpg", type: "图片", status: "成功", message: "商品图 / 护肤", size: "2.4 MB", resourceId: "IMG-260918-015" },
    { kind: "upload", name: "清爽护肤_口播配音.mp3", type: "音频", status: "成功", message: "配音 / 商品口播", size: "1.8 MB", resourceId: "AUD-260918-007" },
    { kind: "upload", name: "精华口播_脚本.txt", type: "脚本", status: "成功", message: "产品介绍 / 护肤", size: "6.2 KB", resourceId: "TXT-260918-009" },
    { kind: "upload", name: "焕肤精华_投放版.mp4", type: "成片", status: "成功", message: "护肤 / 精华", size: "38.5 MB", resourceId: "FV-260918-026" },
    { kind: "upload", name: "跑鞋开箱_补拍.mp4", type: "素材", status: "失败", message: "传输中断，文件未入库", size: "56.2 MB" },
    { kind: "export", name: "推送视频记录.csv", type: "推送视频记录", status: "失败", message: "导出任务中断，请从原列表重新导出" },
    { kind: "download", name: "焕肤精华_投放版.mp4", type: "成片", status: "已发起", message: "已提交浏览器下载" },
    { kind: "download", name: "历史成片.mp4", type: "成片", status: "失败", message: "文件已删除或链接失效" },
    { kind: "login", name: ownerId, type: "Microsoft Edge", status: "成功", message: "账号密码登录" },
    { kind: "login", name: ownerId, type: "Microsoft Edge", status: "失败", message: "密码验证失败" },
  ];
  records = [...records, ...examples.map((row, index) => ({ ...row, ownerId, id: `example-${ownerId}-${index}`, createdAt: now - (index + 1) * 3600000, example: true }))];
  emit();
}
