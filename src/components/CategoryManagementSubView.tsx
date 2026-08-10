import React, { useState } from "react";
import { Plus, Edit2, Trash2, Copy, Sparkles, Check, AlertCircle, X, SlidersHorizontal } from "lucide-react";

export interface CategoryNode {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

const INITIAL_CATEGORIES_DATA: Record<string, CategoryNode[]> = {
  "成片": [
    {
      id: "c1",
      name: "彩妆",
      children: [
        { id: "c1-1", name: "美妆-123456" },
        { id: "c1-2", name: "彩妆口播选辑" },
        { id: "c1-3", name: "护肤试用片" }
      ]
    },
    {
      id: "c2",
      name: "个护",
      children: [
        { id: "c2-1", name: "洗发水评测" },
        { id: "c2-2", name: "沐浴露推广" }
      ]
    },
    {
      id: "c3",
      name: "个护2",
      children: [{ id: "c3-1", name: "身体乳系列" }]
    },
    {
      id: "c4",
      name: "7.4—一级分类21",
      children: [{ id: "c4-1", name: "二级测试分类1" }]
    },
    {
      id: "c5",
      name: "7.4—一级分类22",
      children: [{ id: "c5-1", name: "二级测试分类2" }]
    }
  ],
  "素材": [
    {
      id: "m1",
      name: "美妆原片",
      children: [{ id: "m1-1", name: "高清无底白底图" }]
    },
    {
      id: "m2",
      name: "服饰穿搭",
      children: [{ id: "m2-1", name: "走秀动态视频" }]
    }
  ],
  "脚本": [
    {
      id: "scr1",
      name: "电商带货脚本",
      children: [{ id: "scr1-1", name: "开场吸睛三秒" }]
    }
  ],
  "图片": [
    {
      id: "img1",
      name: "主图宣发",
      children: [{ id: "img1-1", name: "首图爆款精选" }]
    },
    {
      id: "img2",
      name: "详情页套图",
      children: [{ id: "img2-1", name: "长图拼接组" }]
    }
  ],
  "音频": [
    {
      id: "aud1",
      name: "口播旁白",
      children: [{ id: "aud1-1", name: "女声温柔解说" }]
    },
    {
      id: "aud2",
      name: "BGM衬乐",
      children: [{ id: "aud2-1", name: "欢快节奏音效" }]
    }
  ]
};

export default function CategoryManagementSubView() {
  const resourceTypes = ["成片", "素材", "脚本", "图片", "音频"];
  const [activeResourceType, setActiveResourceType] = useState<string>("成片");

  // Category data state
  const [categoriesData, setCategoriesData] = useState<Record<string, CategoryNode[]>>(INITIAL_CATEGORIES_DATA);

  // Selected First level category ID
  const [selectedL1Id, setSelectedL1Id] = useState<string>("c1");
  // Selected Second level category ID
  const [selectedL2Id, setSelectedL2Id] = useState<string | null>("c1-1");

  // Settings Panel state (Category Functions & Permissions)
  const [allowUpload, setAllowUpload] = useState<boolean>(true);
  const [viewScope, setViewScope] = useState<"all" | "specified">("all");
  const [downloadScope, setDownloadScope] = useState<"all" | "specified">("all");
  const [pushScope, setPushScope] = useState<"all" | "specified">("all");
  const [enableAiTagging, setEnableAiTagging] = useState<boolean>(false);

  // Modal States
  const [modalType, setModalType] = useState<"add_l1" | "add_l2" | "edit_l1" | "edit_l2" | "delete_l1" | "delete_l2" | null>(null);
  const [targetCategory, setTargetCategory] = useState<{ id: string; name: string } | null>(null);
  const [inputCategoryName, setInputCategoryName] = useState<string>("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentL1List = categoriesData[activeResourceType] || [];
  const currentL1Node = currentL1List.find((item) => item.id === selectedL1Id) || currentL1List[0];
  const currentL2List = currentL1Node ? currentL1Node.children : [];

  // Switch Resource Tab
  const handleResourceTypeChange = (type: string) => {
    setActiveResourceType(type);
    const list = categoriesData[type] || [];
    if (list.length > 0) {
      setSelectedL1Id(list[0].id);
      if (list[0].children.length > 0) {
        setSelectedL2Id(list[0].children[0].id);
      } else {
        setSelectedL2Id(null);
      }
    } else {
      setSelectedL1Id("");
      setSelectedL2Id(null);
    }
  };

  // Select L1 Category
  const handleSelectL1 = (node: CategoryNode) => {
    setSelectedL1Id(node.id);
    if (node.children.length > 0) {
      setSelectedL2Id(node.children[0].id);
    } else {
      setSelectedL2Id(null);
    }
  };

  // Open Add Modal
  const openAddModal = (level: "l1" | "l2") => {
    setInputCategoryName("");
    if (level === "l1") {
      setModalType("add_l1");
    } else {
      if (!currentL1Node) {
        showToast("请先选择一级分类");
        return;
      }
      setModalType("add_l2");
    }
  };

  // Open Edit Modal
  const openEditModal = (level: "l1" | "l2", id: string, name: string) => {
    setTargetCategory({ id, name });
    setInputCategoryName(name);
    setModalType(level === "l1" ? "edit_l1" : "edit_l2");
  };

  // Open Delete Modal
  const openDeleteModal = (level: "l1" | "l2", id: string, name: string) => {
    setTargetCategory({ id, name });
    setModalType(level === "l1" ? "delete_l1" : "delete_l2");
  };

  // Confirm Modal Actions
  const handleModalConfirm = () => {
    if (!modalType) return;

    if (modalType === "add_l1") {
      if (!inputCategoryName.trim()) {
        showToast("分类名称不能为空");
        return;
      }
      const newId = `cat-l1-${Date.now()}`;
      const newNode: CategoryNode = {
        id: newId,
        name: inputCategoryName.trim(),
        children: []
      };
      setCategoriesData((prev) => ({
        ...prev,
        [activeResourceType]: [...(prev[activeResourceType] || []), newNode]
      }));
      setSelectedL1Id(newId);
      setSelectedL2Id(null);
      showToast(`成功新增一级分类: ${inputCategoryName.trim()}`);
    } else if (modalType === "add_l2") {
      if (!inputCategoryName.trim()) {
        showToast("分类名称不能为空");
        return;
      }
      const newL2Id = `cat-l2-${Date.now()}`;
      setCategoriesData((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((item) => {
          if (item.id === selectedL1Id) {
            return {
              ...item,
              children: [...item.children, { id: newL2Id, name: inputCategoryName.trim() }]
            };
          }
          return item;
        });
        return { ...prev, [activeResourceType]: nextList };
      });
      setSelectedL2Id(newL2Id);
      showToast(`成功新增二级分类: ${inputCategoryName.trim()}`);
    } else if (modalType === "edit_l1") {
      if (!inputCategoryName.trim() || !targetCategory) return;
      setCategoriesData((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((item) =>
          item.id === targetCategory.id ? { ...item, name: inputCategoryName.trim() } : item
        );
        return { ...prev, [activeResourceType]: nextList };
      });
      showToast(`已将分类修改为: ${inputCategoryName.trim()}`);
    } else if (modalType === "edit_l2") {
      if (!inputCategoryName.trim() || !targetCategory) return;
      setCategoriesData((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((item) => {
          if (item.id === selectedL1Id) {
            return {
              ...item,
              children: item.children.map((child) =>
                child.id === targetCategory.id ? { ...child, name: inputCategoryName.trim() } : child
              )
            };
          }
          return item;
        });
        return { ...prev, [activeResourceType]: nextList };
      });
      showToast(`已将二级分类修改为: ${inputCategoryName.trim()}`);
    } else if (modalType === "delete_l1") {
      if (!targetCategory) return;
      setCategoriesData((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.filter((item) => item.id !== targetCategory.id);
        return { ...prev, [activeResourceType]: nextList };
      });
      if (selectedL1Id === targetCategory.id) {
        setSelectedL1Id("");
        setSelectedL2Id(null);
      }
      showToast("分类已成功删除");
    } else if (modalType === "delete_l2") {
      if (!targetCategory) return;
      setCategoriesData((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((item) => {
          if (item.id === selectedL1Id) {
            return {
              ...item,
              children: item.children.filter((child) => child.id !== targetCategory.id)
            };
          }
          return item;
        });
        return { ...prev, [activeResourceType]: nextList };
      });
      if (selectedL2Id === targetCategory.id) {
        setSelectedL2Id(null);
      }
      showToast("二级分类已成功删除");
    }

    setModalType(null);
    setTargetCategory(null);
    setInputCategoryName("");
  };

  const handleDuplicateL1 = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = `${name}-副本`;
    const newId = `cat-l1-${Date.now()}`;
    setCategoriesData((prev) => {
      const list = prev[activeResourceType] || [];
      const newNode: CategoryNode = { id: newId, name: newName, children: [] };
      return { ...prev, [activeResourceType]: [...list, newNode] };
    });
    showToast(`已复制分类: ${newName}`);
  };

  return (
    <div className="space-y-5 text-slate-800 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/80 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Resource Types Tabs (Exact style as Image 1 & 3) */}
      <div className="border-b border-slate-200/80 flex items-center gap-8 px-2 overflow-x-auto text-sm font-medium">
        {resourceTypes.map((type) => {
          const isActive = activeResourceType === type;
          return (
            <button
              key={type}
              onClick={() => handleResourceTypeChange(type)}
              className={`pb-3.5 transition-all cursor-pointer whitespace-nowrap relative ${
                isActive
                  ? "text-purple-600 font-bold border-b-2 border-purple-600 -mb-[1px]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Main Grid: L1 Category Column, L2 Category Column, Category Functions & Permissions Column */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Column 1: 一级分类 (First-level Category Column) */}
        <div className="md:col-span-4 bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-700 text-sm">一级分类</span>
              <button
                onClick={() => openAddModal("l1")}
                className="text-purple-600 hover:text-purple-700 border border-purple-300 hover:border-purple-400 bg-white hover:bg-purple-50 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                添加
              </button>
            </div>

            {/* List of L1 Categories */}
            <div className="space-y-1">
              {currentL1List.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">暂无一级分类，点击添加</div>
              ) : (
                currentL1List.map((item) => {
                  const isSelected = selectedL1Id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectL1(item)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-white text-purple-600 font-bold shadow-2xs border border-purple-100"
                          : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
                      }`}
                    >
                      <span className="text-sm truncate flex-1">{item.name}</span>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDuplicateL1(item.name, e)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100 transition-colors"
                          title="复制分类"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal("l1", item.id, item.name);
                          }}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100 transition-colors"
                          title="编辑分类"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal("l1", item.id, item.name);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                          title="删除分类"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 2: 二级分类 (Second-level Category Column) */}
        <div className="md:col-span-4 bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-700 text-sm">二级分类</span>
              <button
                onClick={() => openAddModal("l2")}
                className="text-purple-600 hover:text-purple-700 border border-purple-300 hover:border-purple-400 bg-white hover:bg-purple-50 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                添加
              </button>
            </div>

            {/* List of L2 Categories */}
            <div className="space-y-1">
              {!currentL1Node ? (
                <div className="text-center py-12 text-slate-400 text-xs">请先选择一级分类</div>
              ) : currentL2List.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">暂无二级分类，点击添加</div>
              ) : (
                currentL2List.map((child) => {
                  const isSelected = selectedL2Id === child.id;
                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedL2Id(child.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-white text-purple-600 font-bold shadow-2xs border border-purple-100"
                          : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
                      }`}
                    >
                      <span className="text-sm truncate flex-1">{child.name}</span>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal("l2", child.id, child.name);
                          }}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100 transition-colors"
                          title="编辑分类"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal("l2", child.id, child.name);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                          title="删除分类"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 3: 分类功能 & 分类权限 (Category Settings Column - Image 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs min-h-[420px] flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            {/* 分类功能 */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">分类功能</h3>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-600 font-medium">上传</span>
                <button
                  type="button"
                  onClick={() => setAllowUpload(!allowUpload)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    allowUpload ? "bg-purple-600 justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>
            </div>

            {/* 分类权限 */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">分类权限</h3>
                <button
                  onClick={() => showToast("已启动批量修改分类权限")}
                  className="text-purple-600 hover:text-purple-700 text-xs font-bold cursor-pointer"
                >
                  批量修改
                </button>
              </div>

              {/* 谁能查看 */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 font-medium">谁能查看</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="viewScope"
                      checked={viewScope === "all"}
                      onChange={() => setViewScope("all")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>不限</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="viewScope"
                      checked={viewScope === "specified"}
                      onChange={() => setViewScope("specified")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>指定范围</span>
                  </label>
                </div>
              </div>

              {/* 谁能下载 */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 font-medium">谁能下载</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="downloadScope"
                      checked={downloadScope === "all"}
                      onChange={() => setDownloadScope("all")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>不限</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="downloadScope"
                      checked={downloadScope === "specified"}
                      onChange={() => setDownloadScope("specified")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>指定范围</span>
                  </label>
                </div>
              </div>

              {/* 谁能推送 */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 font-medium">谁能推送</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="pushScope"
                      checked={pushScope === "all"}
                      onChange={() => setPushScope("all")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>不限</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="pushScope"
                      checked={pushScope === "specified"}
                      onChange={() => setPushScope("specified")}
                      className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>指定范围</span>
                  </label>
                </div>
              </div>

              {/* AI智能识别标签 */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600 font-medium">AI智能识别标签</span>
                <button
                  type="button"
                  onClick={() => setEnableAiTagging(!enableAiTagging)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    enableAiTagging ? "bg-purple-600 justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => showToast("分类权限与功能配置已保存")}
              className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-8 py-2 rounded-xl transition-all cursor-pointer shadow-md text-xs"
            >
              保存
            </button>
          </div>

        </div>

      </div>

      {/* MODAL: Add / Edit Category Modal (Image 1 & 2) */}
      {(modalType === "add_l1" || modalType === "add_l2" || modalType === "edit_l1" || modalType === "edit_l2") && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-600 rounded-full" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {modalType.startsWith("add") ? "新增分类" : "编辑分类"}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700 shrink-0 w-20 text-right">
                  <span className="text-rose-500 mr-0.5">*</span>分类名称
                </label>
                <input
                  type="text"
                  placeholder="请输入分类名称"
                  value={inputCategoryName}
                  onChange={(e) => setInputCategoryName(e.target.value)}
                  autoFocus
                  className="flex-1 border border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold px-5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-6 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Category Confirmation Modal (Image 3) */}
      {(modalType === "delete_l1" || modalType === "delete_l2") && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">删除分类</h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                请确认是否删除该分类，删除后无法恢复
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold px-5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-bold px-6 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
