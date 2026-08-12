import React, { useState } from "react";
import { Edit2, Trash2, Copy, Sparkles, AlertCircle, X } from "lucide-react";

export interface CategoryL2Node {
  id: string;
  name: string;
}

export interface CategoryL1Node {
  id: string;
  name: string;
  children: CategoryL2Node[];
}

export interface MainCategoryNode {
  id: string;
  name: string;
  children: CategoryL1Node[];
}

// Resource types that HAVE a Main Category (主类目)
const HAS_MAIN_CATEGORY_TYPES = ["成片", "脚本", "音频"];

// 3-Level Categories Data (成片, 脚本, 音频)
const INITIAL_CATEGORIES_3_DATA: Record<string, MainCategoryNode[]> = {
  "成片": [
    {
      id: "m-sp1",
      name: "美妆护肤",
      children: [
        {
          id: "sp1-c1",
          name: "彩妆护肤",
          children: [
            { id: "sp1-c1-1", name: "美妆-123456" },
            { id: "sp1-c1-2", name: "彩妆口播选辑" },
            { id: "sp1-c1-3", name: "护肤试用片" }
          ]
        },
        {
          id: "sp1-c2",
          name: "彩妆香水",
          children: [
            { id: "sp1-c2-1", name: "口播切片" },
            { id: "sp1-c2-2", name: "粉底隐形" },
            { id: "sp1-c2-3", name: "口红试色" }
          ]
        }
      ]
    },
    {
      id: "m-sp2",
      name: "草本初色内衣",
      children: [
        {
          id: "sp2-c1",
          name: "女士内衣",
          children: [
            { id: "sp2-c1-1", name: "抹胸款" },
            { id: "sp2-c1-2", name: "无钢圈" },
            { id: "sp2-c1-3", name: "聚拢款" }
          ]
        },
        {
          id: "sp2-c2",
          name: "塑身衣",
          children: [
            { id: "sp2-c2-1", name: "无痕塑形" },
            { id: "sp2-c2-2", name: "高弹透气" },
            { id: "sp2-c2-3", name: "收腹高腰" }
          ]
        }
      ]
    },
    {
      id: "m-sp3",
      name: "达人成片",
      children: [
        {
          id: "sp3-c1",
          name: "购买达人视频",
          children: [
            { id: "sp3-c1-1", name: "爆款走秀" },
            { id: "sp3-c1-2", name: "情侣套盒" }
          ]
        }
      ]
    },
    {
      id: "m-sp4",
      name: "短视频推广",
      children: [
        {
          id: "sp4-c1",
          name: "千川引流",
          children: [
            { id: "sp4-c1-1", name: "直播高光切片" }
          ]
        }
      ]
    }
  ],
  "脚本": [
    {
      id: "m-scr1",
      name: "美妆",
      children: [
        {
          id: "scr1-c1",
          name: "美妆护肤",
          children: [
            { id: "scr1-c1-1", name: "开场吸睛三秒" },
            { id: "scr1-c1-2", name: "痛点导入脚本" },
            { id: "scr1-c1-3", name: "成分对比拆解" }
          ]
        },
        {
          id: "scr1-c2",
          name: "彩妆香水",
          children: [
            { id: "scr1-c2-1", name: "试色种草" },
            { id: "scr1-c2-2", name: "妆容教程" }
          ]
        }
      ]
    },
    {
      id: "m-scr2",
      name: "个护家清",
      children: [
        {
          id: "scr2-c1",
          name: "传统滋补",
          children: [
            { id: "scr2-c1-1", name: "养生口服" },
            { id: "scr2-c1-2", name: "破壁灵芝" }
          ]
        }
      ]
    },
    {
      id: "m-scr3",
      name: "服饰内衣",
      children: [
        {
          id: "scr3-c1",
          name: "童装/童鞋",
          children: [
            { id: "scr3-c1-1", name: "亲子穿搭" },
            { id: "scr3-c1-2", name: "萌宝走秀" }
          ]
        }
      ]
    }
  ],
  "音频": [
    {
      id: "m-aud1",
      name: "美妆",
      children: [
        {
          id: "aud1-c1",
          name: "美妆护肤",
          children: [
            { id: "aud1-c1-1", name: "口播旁白" },
            { id: "aud1-c1-2", name: "女声温柔解说" },
            { id: "aud1-c1-3", name: "趣味音效" }
          ]
        },
        {
          id: "aud1-c2",
          name: "彩妆香水",
          children: [
            { id: "aud1-c2-1", name: "欢快BGM" },
            { id: "aud1-c2-2", name: "品牌调性" }
          ]
        }
      ]
    },
    {
      id: "m-aud2",
      name: "母婴宠物",
      children: [
        {
          id: "aud2-c1",
          name: "宠物食品",
          children: [
            { id: "aud2-c1-1", name: "猫粮" },
            { id: "aud2-c1-2", name: "狗粮" }
          ]
        },
        {
          id: "aud2-c2",
          name: "婴童用品",
          children: [
            { id: "aud2-c2-1", name: "促销大促" },
            { id: "aud2-c2-2", name: "轻快衬乐" }
          ]
        }
      ]
    },
    {
      id: "m-aud3",
      name: "食品饮料",
      children: [
        {
          id: "aud3-c1",
          name: "休闲零食",
          children: [
            { id: "aud3-c1-1", name: "吃播咔嚓声" },
            { id: "aud3-c1-2", name: "欢快节奏音效" }
          ]
        }
      ]
    }
  ]
};

// 2-Level Categories Data (素材, 图片 - NO Main Category)
const INITIAL_CATEGORIES_2_DATA: Record<string, CategoryL1Node[]> = {
  "素材": [
    {
      id: "mat-c1",
      name: "美妆",
      children: [
        { id: "mat-c1-1", name: "美妆原片" },
        { id: "mat-c1-2", name: "高清白底图" },
        { id: "mat-c1-3", name: "特写质感镜头" }
      ]
    },
    {
      id: "mat-c2",
      name: "服饰内衣",
      children: [
        { id: "mat-c2-1", name: "服饰穿搭" },
        { id: "mat-c2-2", name: "走秀动态视频" },
        { id: "mat-c2-3", name: "面料细节展示" }
      ]
    },
    {
      id: "mat-c3",
      name: "个护家清",
      children: [
        { id: "mat-c3-1", name: "洗护展示" },
        { id: "mat-c3-2", name: "对比体验" }
      ]
    }
  ],
  "图片": [
    {
      id: "img-c1",
      name: "电商营销",
      children: [
        { id: "img-c1-1", name: "主图宣发" },
        { id: "img-c1-2", name: "首图爆款精选" },
        { id: "img-c1-3", name: "利益点海报" }
      ]
    },
    {
      id: "img-c2",
      name: "详情页套图",
      children: [
        { id: "img-c2-1", name: "长图拼接组" },
        { id: "img-c2-2", name: "产品规格切点" }
      ]
    },
    {
      id: "img-c3",
      name: "模特切片",
      children: [
        { id: "img-c3-1", name: "正面展示图" },
        { id: "img-c3-2", name: "背面细节图" }
      ]
    }
  ]
};

export default function CategoryManagementSubView() {
  const resourceTypes = ["成片", "素材", "脚本", "图片", "音频"];
  const [activeResourceType, setActiveResourceType] = useState<string>("成片");

  // State for 3-level resource types (成片, 脚本, 音频)
  const [categories3Data, setCategories3Data] = useState<Record<string, MainCategoryNode[]>>(INITIAL_CATEGORIES_3_DATA);
  
  // State for 2-level resource types (素材, 图片)
  const [categories2Data, setCategories2Data] = useState<Record<string, CategoryL1Node[]>>(INITIAL_CATEGORIES_2_DATA);

  // Active resource type flag
  const hasMainCategory = HAS_MAIN_CATEGORY_TYPES.includes(activeResourceType);

  // Selected IDs for 3-level types
  const [selectedMainId, setSelectedMainId] = useState<string>("m-sp1");
  
  // Selected IDs for L1 and L2
  const [selectedL1Id, setSelectedL1Id] = useState<string>("sp1-c1");
  const [selectedL2Id, setSelectedL2Id] = useState<string | null>("sp1-c1-1");

  // Modal States
  type ModalType = "add_main" | "add_l1" | "add_l2" | "edit_main" | "edit_l1" | "edit_l2" | "delete_main" | "delete_l1" | "delete_l2";
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [targetCategory, setTargetCategory] = useState<{ id: string; name: string } | null>(null);
  const [inputCategoryName, setInputCategoryName] = useState<string>("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Derived current lists
  let currentMainList: MainCategoryNode[] = [];
  let currentL1List: CategoryL1Node[] = [];
  let currentL2List: CategoryL2Node[] = [];

  if (hasMainCategory) {
    currentMainList = categories3Data[activeResourceType] || [];
    const currentMainNode = currentMainList.find((item) => item.id === selectedMainId) || currentMainList[0];
    currentL1List = currentMainNode ? currentMainNode.children : [];
    const currentL1Node = currentL1List.find((item) => item.id === selectedL1Id) || currentL1List[0];
    currentL2List = currentL1Node ? currentL1Node.children : [];
  } else {
    currentL1List = categories2Data[activeResourceType] || [];
    const currentL1Node = currentL1List.find((item) => item.id === selectedL1Id) || currentL1List[0];
    currentL2List = currentL1Node ? currentL1Node.children : [];
  }

  // Switch Resource Tab
  const handleResourceTypeChange = (type: string) => {
    setActiveResourceType(type);
    const typeHasMain = HAS_MAIN_CATEGORY_TYPES.includes(type);

    if (typeHasMain) {
      const mainList = categories3Data[type] || [];
      if (mainList.length > 0) {
        setSelectedMainId(mainList[0].id);
        if (mainList[0].children.length > 0) {
          setSelectedL1Id(mainList[0].children[0].id);
          if (mainList[0].children[0].children.length > 0) {
            setSelectedL2Id(mainList[0].children[0].children[0].id);
          } else {
            setSelectedL2Id(null);
          }
        } else {
          setSelectedL1Id("");
          setSelectedL2Id(null);
        }
      } else {
        setSelectedMainId("");
        setSelectedL1Id("");
        setSelectedL2Id(null);
      }
    } else {
      const l1List = categories2Data[type] || [];
      if (l1List.length > 0) {
        setSelectedL1Id(l1List[0].id);
        if (l1List[0].children.length > 0) {
          setSelectedL2Id(l1List[0].children[0].id);
        } else {
          setSelectedL2Id(null);
        }
      } else {
        setSelectedL1Id("");
        setSelectedL2Id(null);
      }
    }
  };

  // Select Main Category (Only for 3-level)
  const handleSelectMain = (node: MainCategoryNode) => {
    setSelectedMainId(node.id);
    if (node.children.length > 0) {
      setSelectedL1Id(node.children[0].id);
      if (node.children[0].children.length > 0) {
        setSelectedL2Id(node.children[0].children[0].id);
      } else {
        setSelectedL2Id(null);
      }
    } else {
      setSelectedL1Id("");
      setSelectedL2Id(null);
    }
  };

  // Select L1 Category
  const handleSelectL1 = (node: CategoryL1Node) => {
    setSelectedL1Id(node.id);
    if (node.children.length > 0) {
      setSelectedL2Id(node.children[0].id);
    } else {
      setSelectedL2Id(null);
    }
  };

  // Open Add Modal
  const openAddModal = (level: "main" | "l1" | "l2") => {
    setInputCategoryName("");
    if (level === "main") {
      setModalType("add_main");
    } else if (level === "l1") {
      if (hasMainCategory) {
        const mainList = categories3Data[activeResourceType] || [];
        const currentMainNode = mainList.find((item) => item.id === selectedMainId) || mainList[0];
        if (!currentMainNode) {
          showToast("请先选择主类目");
          return;
        }
      }
      setModalType("add_l1");
    } else {
      if (!selectedL1Id && currentL1List.length === 0) {
        showToast("请先选择一级分类");
        return;
      }
      setModalType("add_l2");
    }
  };

  // Open Edit Modal
  const openEditModal = (level: "main" | "l1" | "l2", id: string, name: string) => {
    setTargetCategory({ id, name });
    setInputCategoryName(name);
    setModalType(level === "main" ? "edit_main" : level === "l1" ? "edit_l1" : "edit_l2");
  };

  // Open Delete Modal
  const openDeleteModal = (level: "main" | "l1" | "l2", id: string, name: string) => {
    setTargetCategory({ id, name });
    setModalType(level === "main" ? "delete_main" : level === "l1" ? "delete_l1" : "delete_l2");
  };

  // Confirm Modal Actions
  const handleModalConfirm = () => {
    if (!modalType) return;

    if (modalType === "add_main") {
      if (!inputCategoryName.trim()) {
        showToast("主类目名称不能为空");
        return;
      }
      const newId = `cat-main-${Date.now()}`;
      const newNode: MainCategoryNode = {
        id: newId,
        name: inputCategoryName.trim(),
        children: []
      };
      setCategories3Data((prev) => ({
        ...prev,
        [activeResourceType]: [...(prev[activeResourceType] || []), newNode]
      }));
      setSelectedMainId(newId);
      setSelectedL1Id("");
      setSelectedL2Id(null);
      showToast(`成功新增主类目: ${inputCategoryName.trim()}`);
    } else if (modalType === "add_l1") {
      if (!inputCategoryName.trim()) {
        showToast("分类名称不能为空");
        return;
      }
      const newL1Id = `cat-l1-${Date.now()}`;

      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: [...main.children, { id: newL1Id, name: inputCategoryName.trim(), children: [] }]
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const newNode: CategoryL1Node = {
            id: newL1Id,
            name: inputCategoryName.trim(),
            children: []
          };
          return { ...prev, [activeResourceType]: [...list, newNode] };
        });
      }

      setSelectedL1Id(newL1Id);
      setSelectedL2Id(null);
      showToast(`成功新增一级分类: ${inputCategoryName.trim()}`);
    } else if (modalType === "add_l2") {
      if (!inputCategoryName.trim()) {
        showToast("分类名称不能为空");
        return;
      }
      const newL2Id = `cat-l2-${Date.now()}`;

      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: main.children.map((l1) => {
                  if (l1.id === selectedL1Id) {
                    return {
                      ...l1,
                      children: [...l1.children, { id: newL2Id, name: inputCategoryName.trim() }]
                    };
                  }
                  return l1;
                })
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((l1) => {
            if (l1.id === selectedL1Id) {
              return {
                ...l1,
                children: [...l1.children, { id: newL2Id, name: inputCategoryName.trim() }]
              };
            }
            return l1;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      }

      setSelectedL2Id(newL2Id);
      showToast(`成功新增二级分类: ${inputCategoryName.trim()}`);
    } else if (modalType === "edit_main") {
      if (!inputCategoryName.trim() || !targetCategory) return;
      setCategories3Data((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((main) =>
          main.id === targetCategory.id ? { ...main, name: inputCategoryName.trim() } : main
        );
        return { ...prev, [activeResourceType]: nextList };
      });
      showToast(`已将主类目修改为: ${inputCategoryName.trim()}`);
    } else if (modalType === "edit_l1") {
      if (!inputCategoryName.trim() || !targetCategory) return;
      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: main.children.map((l1) =>
                  l1.id === targetCategory.id ? { ...l1, name: inputCategoryName.trim() } : l1
                )
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((l1) =>
            l1.id === targetCategory.id ? { ...l1, name: inputCategoryName.trim() } : l1
          );
          return { ...prev, [activeResourceType]: nextList };
        });
      }
      showToast(`已将一级分类修改为: ${inputCategoryName.trim()}`);
    } else if (modalType === "edit_l2") {
      if (!inputCategoryName.trim() || !targetCategory) return;
      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: main.children.map((l1) => {
                  if (l1.id === selectedL1Id) {
                    return {
                      ...l1,
                      children: l1.children.map((l2) =>
                        l2.id === targetCategory.id ? { ...l2, name: inputCategoryName.trim() } : l2
                      )
                    };
                  }
                  return l1;
                })
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((l1) => {
            if (l1.id === selectedL1Id) {
              return {
                ...l1,
                children: l1.children.map((l2) =>
                  l2.id === targetCategory.id ? { ...l2, name: inputCategoryName.trim() } : l2
                )
              };
            }
            return l1;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      }
      showToast(`已将二级分类修改为: ${inputCategoryName.trim()}`);
    } else if (modalType === "delete_main") {
      if (!targetCategory) return;
      setCategories3Data((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.filter((main) => main.id !== targetCategory.id);
        return { ...prev, [activeResourceType]: nextList };
      });
      if (selectedMainId === targetCategory.id) {
        setSelectedMainId("");
        setSelectedL1Id("");
        setSelectedL2Id(null);
      }
      showToast("主类目已成功删除");
    } else if (modalType === "delete_l1") {
      if (!targetCategory) return;
      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: main.children.filter((l1) => l1.id !== targetCategory.id)
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.filter((l1) => l1.id !== targetCategory.id);
          return { ...prev, [activeResourceType]: nextList };
        });
      }
      if (selectedL1Id === targetCategory.id) {
        setSelectedL1Id("");
        setSelectedL2Id(null);
      }
      showToast("一级分类已成功删除");
    } else if (modalType === "delete_l2") {
      if (!targetCategory) return;
      if (hasMainCategory) {
        setCategories3Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((main) => {
            if (main.id === selectedMainId) {
              return {
                ...main,
                children: main.children.map((l1) => {
                  if (l1.id === selectedL1Id) {
                    return {
                      ...l1,
                      children: l1.children.filter((l2) => l2.id !== targetCategory.id)
                    };
                  }
                  return l1;
                })
              };
            }
            return main;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      } else {
        setCategories2Data((prev) => {
          const list = prev[activeResourceType] || [];
          const nextList = list.map((l1) => {
            if (l1.id === selectedL1Id) {
              return {
                ...l1,
                children: l1.children.filter((l2) => l2.id !== targetCategory.id)
              };
            }
            return l1;
          });
          return { ...prev, [activeResourceType]: nextList };
        });
      }
      if (selectedL2Id === targetCategory.id) {
        setSelectedL2Id(null);
      }
      showToast("二级分类已成功删除");
    }

    setModalType(null);
    setTargetCategory(null);
    setInputCategoryName("");
  };

  const handleDuplicateMain = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = `${name}-副本`;
    const newId = `cat-main-${Date.now()}`;
    setCategories3Data((prev) => {
      const list = prev[activeResourceType] || [];
      const newNode: MainCategoryNode = { id: newId, name: newName, children: [] };
      return { ...prev, [activeResourceType]: [...list, newNode] };
    });
    showToast(`已复制主类目: ${newName}`);
  };

  const handleDuplicateL1 = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = `${name}-副本`;
    const newId = `cat-l1-${Date.now()}`;

    if (hasMainCategory) {
      setCategories3Data((prev) => {
        const list = prev[activeResourceType] || [];
        const nextList = list.map((main) => {
          if (main.id === selectedMainId) {
            return {
              ...main,
              children: [...main.children, { id: newId, name: newName, children: [] }]
            };
          }
          return main;
        });
        return { ...prev, [activeResourceType]: nextList };
      });
    } else {
      setCategories2Data((prev) => {
        const list = prev[activeResourceType] || [];
        const newNode: CategoryL1Node = { id: newId, name: newName, children: [] };
        return { ...prev, [activeResourceType]: [...list, newNode] };
      });
    }
    showToast(`已复制一级分类: ${newName}`);
  };

  const getModalTitle = () => {
    if (!modalType) return "";
    if (modalType.startsWith("add")) {
      if (modalType === "add_main") return "新增主类目";
      if (modalType === "add_l1") return "新增一级分类";
      return "新增二级分类";
    }
    if (modalType.startsWith("edit")) {
      if (modalType === "edit_main") return "编辑主类目";
      if (modalType === "edit_l1") return "编辑一级分类";
      return "编辑二级分类";
    }
    if (modalType === "delete_main") return "删除主类目";
    if (modalType === "delete_l1") return "删除一级分类";
    return "删除二级分类";
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

      {/* Top Resource Types Tabs */}
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

      {/* Columns Grid: 3 columns for 成片/脚本/音频; 2 columns for 素材/图片 */}
      <div className={`grid grid-cols-1 ${hasMainCategory ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5 items-start`}>
        
        {/* Column 1: 主类目 (Main Category Column) - Rendered ONLY if HAS_MAIN_CATEGORY_TYPES */}
        {hasMainCategory && (
          <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
            <div className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="font-bold text-slate-700 text-sm">主类目</span>
                <button
                  onClick={() => openAddModal("main")}
                  className="text-purple-600 hover:text-purple-700 border border-purple-300 hover:border-purple-400 bg-white hover:bg-purple-50 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  添加
                </button>
              </div>

              {/* List of Main Categories */}
              <div className="space-y-1">
                {currentMainList.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    暂无主类目，请点击上方“添加”
                  </div>
                ) : (
                  currentMainList.map((main) => {
                    const isSelected = main.id === selectedMainId;
                    return (
                      <div
                        key={main.id}
                        onClick={() => handleSelectMain(main)}
                        className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? "bg-purple-600 text-white font-bold shadow-xs"
                            : "hover:bg-slate-100 text-slate-700 font-medium"
                        }`}
                      >
                        <span className="text-xs truncate">{main.name}</span>
                        
                        {/* Action Icons */}
                        <div className={`flex items-center gap-1 ${isSelected ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100"}`}>
                          <button
                            onClick={(e) => handleDuplicateMain(main.name, e)}
                            className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-purple-600 hover:bg-slate-200"}`}
                            title="复制主类目"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal("main", main.id, main.name);
                            }}
                            className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-purple-600 hover:bg-slate-200"}`}
                            title="编辑名称"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal("main", main.id, main.name);
                            }}
                            className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-rose-600 hover:bg-slate-200"}`}
                            title="删除主类目"
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
        )}

        {/* Column 2: 一级分类 (First-level Category Column) */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
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
                <div className="text-center py-10 text-slate-400 text-xs">
                  暂无一级分类，请点击上方“添加”
                </div>
              ) : (
                currentL1List.map((node) => {
                  const isSelected = node.id === selectedL1Id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectL1(node)}
                      className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-purple-600 text-white font-bold shadow-xs"
                          : "hover:bg-slate-100 text-slate-700 font-medium"
                      }`}
                    >
                      <span className="text-xs truncate">{node.name}</span>
                      
                      {/* Action Icons */}
                      <div className={`flex items-center gap-1 ${isSelected ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100"}`}>
                        <button
                          onClick={(e) => handleDuplicateL1(node.name, e)}
                          className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-purple-600 hover:bg-slate-200"}`}
                          title="复制分类"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal("l1", node.id, node.name);
                          }}
                          className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-purple-600 hover:bg-slate-200"}`}
                          title="编辑名称"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal("l1", node.id, node.name);
                          }}
                          className={`p-1 rounded transition-colors ${isSelected ? "hover:bg-purple-500 text-purple-100" : "text-slate-400 hover:text-rose-600 hover:bg-slate-200"}`}
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

        {/* Column 3: 二级分类 (Second-level Category Column) */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
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
              {currentL2List.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  暂无二级分类，请点击上方“添加”
                </div>
              ) : (
                currentL2List.map((child) => {
                  const isSelected = child.id === selectedL2Id;
                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedL2Id(child.id)}
                      className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-purple-100 text-purple-800 font-bold border border-purple-300"
                          : "hover:bg-slate-100 text-slate-700 font-medium"
                      }`}
                    >
                      <span className="text-xs truncate">{child.name}</span>

                      {/* Action Icons */}
                      <div className={`flex items-center gap-1 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal("l2", child.id, child.name);
                          }}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100 transition-colors"
                          title="编辑名称"
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

      </div>

      {/* MODAL: Add / Edit Category Modal */}
      {(modalType?.startsWith("add") || modalType?.startsWith("edit")) && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-600 rounded-full" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {getModalTitle()}
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
                  <span className="text-rose-500 mr-0.5">*</span>名称
                </label>
                <input
                  type="text"
                  placeholder="请输入名称"
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

      {/* MODAL: Delete Category Confirmation Modal */}
      {(modalType?.startsWith("delete")) && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{getModalTitle()}</h3>
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
                请确认是否删除“{targetCategory?.name}”，删除后无法恢复
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
