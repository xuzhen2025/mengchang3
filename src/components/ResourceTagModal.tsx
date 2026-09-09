import React, { useState } from "react";
import { X } from "lucide-react";
import OverlayPortal from "./overlays/OverlayPortal";
import { PERSONAL_TAG_GROUPS, PUBLIC_TAG_GROUPS } from "../data/videoResourceOptions";

interface ResourceTagModalProps {
  kind: "public" | "personal";
  initialTags?: string[];
  title?: string;
  requireSelection?: boolean;
  publicGroups?: Record<string, string[]>;
  personalGroups?: Record<string, string[]>;
  onClose: () => void;
  onConfirm: (tags: string[]) => boolean | void;
  showToast: (message: string) => void;
}

export default function ResourceTagModal({
  kind, initialTags = [], title, requireSelection = false,
  publicGroups = PUBLIC_TAG_GROUPS, personalGroups = PERSONAL_TAG_GROUPS,
  onClose, onConfirm, showToast,
}: ResourceTagModalProps) {
  const [publicGroupSearch, setPublicGroupSearch] = useState("");
  const [publicSubSearch, setPublicSubSearch] = useState("");
  const [selectedPublicGroupKey, setSelectedPublicGroupKey] = useState(Object.keys(publicGroups)[0] || "");
  const [tempAddedPublicTags, setTempAddedPublicTags] = useState<string[]>([...initialTags]);
  const [personalGroupSearch, setPersonalGroupSearch] = useState("");
  const [personalSubSearch, setPersonalSubSearch] = useState("");
  const [selectedPersonalGroupKey, setSelectedPersonalGroupKey] = useState(Object.keys(personalGroups)[0] || "");
  const [tempAddedPersonalTags, setTempAddedPersonalTags] = useState<string[]>([...initialTags]);
  return <>
      {/* 关联个人标签 Modal */}
      {kind === "personal" && (
        <OverlayPortal role="dialog" aria-modal="true" aria-label={title || "关联个人标签"} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[calc(100dvh-32px)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900">{title || "关联个人标签"}</h3>
              </div>
              <button
                onClick={() => onClose()}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <button
                  onClick={() => showToast("进入编辑个人标签模式")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  编辑个人标签
                </button>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    标签组
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      value={personalGroupSearch}
                      onChange={(e) => setPersonalGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(personalGroups)
                        .filter(g => g.includes(personalGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPersonalGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPersonalGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    子标签
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      value={personalSubSearch}
                      onChange={(e) => setPersonalSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(personalGroups[selectedPersonalGroupKey] || [])
                        .filter(sub => sub.includes(personalSubSearch.trim()))
                        .map((subTag) => {
                          const isChecked = tempAddedPersonalTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== subTag));
                                  } else {
                                    setTempAddedPersonalTags([...tempAddedPersonalTags, subTag]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80">
                    已添加标签
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPersonalTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未添加标签
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tempAddedPersonalTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPersonalTags(tempAddedPersonalTags.filter(t => t !== tag))}
                              className="text-purple-400 hover:text-rose-500 ml-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => onClose()}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                disabled={requireSelection && tempAddedPersonalTags.length === 0}
                onClick={() => {
                  if (onConfirm(tempAddedPersonalTags) === false) return;
                  onClose();
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                确定
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}

      {/* 关联公共标签 Modal */}
      {kind === "public" && (
        <OverlayPortal role="dialog" aria-modal="true" aria-label={title || (kind === "public" ? "关联公共标签" : "关联个人标签")} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[calc(100dvh-32px)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                <h3 className="text-base font-extrabold text-slate-900">{title || "关联公共标签"}</h3>
              </div>
              <button
                onClick={() => onClose()}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:h-[380px]">
                {/* Col 1: 标签组 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>标签组</span>
                    <button
                      onClick={() => showToast("已刷新标签组")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      刷新
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签组名称"
                      value={publicGroupSearch}
                      onChange={(e) => setPublicGroupSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {Object.keys(publicGroups)
                        .filter(g => g.includes(publicGroupSearch.trim()))
                        .map((group) => (
                          <div
                            key={group}
                            onClick={() => setSelectedPublicGroupKey(group)}
                            className={`px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                              selectedPublicGroupKey === group
                                ? "text-purple-600 font-bold bg-purple-50/80"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {group}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Col 2: 子标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>子标签</span>
                    <button
                      onClick={() => showToast("弹出添加子标签弹窗")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      + 添加子标签
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col overflow-hidden">
                    <input
                      type="text"
                      placeholder="请输入标签名称"
                      value={publicSubSearch}
                      onChange={(e) => setPublicSubSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 mb-2.5"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {(publicGroups[selectedPublicGroupKey] || [])
                        .filter(sub => sub.includes(publicSubSearch.trim()))
                        .map((subTag) => {
                          const isChecked = tempAddedPublicTags.includes(subTag);
                          return (
                            <label
                              key={subTag}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-purple-700 select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== subTag));
                                  } else {
                                    setTempAddedPublicTags([...tempAddedPublicTags, subTag]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                              />
                              <span>{subTag}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Col 3: 已添加标签 */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white min-h-[180px]">
                  <div className="bg-slate-100/90 text-slate-700 text-xs font-bold py-2.5 px-3.5 border-b border-slate-200/80 flex items-center justify-between">
                    <span>已添加标签</span>
                    <button
                      onClick={() => showToast("已保存当前选择为预设")}
                      className="text-purple-600 hover:underline text-xs font-normal cursor-pointer"
                    >
                      保存为预设
                    </button>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    {tempAddedPublicTags.length === 0 ? (
                      <div className="text-slate-400 text-xs pt-4 text-left">
                        暂未添加标签
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {tempAddedPublicTags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-slate-50 border border-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium hover:bg-slate-100/80 transition-colors"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => setTempAddedPublicTags(tempAddedPublicTags.filter(t => t !== tag))}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => onClose()}
                className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                disabled={requireSelection && tempAddedPublicTags.length === 0}
                onClick={() => {
                  if (onConfirm(tempAddedPublicTags) === false) return;
                  onClose();
                }}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                确定
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}

  </>;
}
