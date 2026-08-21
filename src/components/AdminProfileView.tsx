import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  KeyRound,
  Laptop,
  LockKeyhole,
  Mail,
  MapPin,
  MonitorSmartphone,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  User,
  UserCog,
  X,
} from "lucide-react";

type ProfileTab = "profile" | "permissions" | "security";

interface AdminProfileViewProps {
  onOpenPermissionMatrix?: () => void;
}

const AVATAR_URL = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop";
const INPUT_CLASS = "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-purple-500 focus:bg-white";

const permissionGroups = [
  { name: "内容管理", count: 8, items: ["查看资源库", "管理资源", "管理分类", "管理视频状态", "管理脚本状态", "管理任务字段", "管理标签", "管理脚本模板"] },
  { name: "组织、人员与权限", count: 7, items: ["查看组织部门", "管理部门", "查看人员账号", "邀请人员", "管理人员账号", "查看角色权限", "分配角色"] },
  { name: "安全与审计", count: 5, items: ["查看操作记录", "导出操作记录", "查看数据导出记录", "核查高风险导出", "查看登录记录"] },
  { name: "平台配置", count: 6, items: ["配置消息通知规则", "配置水印", "配置系统参数", "配置自动化标签", "管理广告组", "管理多站点同步"] },
  { name: "积分管理", count: 6, items: ["查看企业积分账户", "充值与调整积分", "查看积分申请", "审批积分申请", "导出积分记录", "配置积分规则"] },
];

const operationRows = [
  { id: "LOG-1005", action: "编辑公共标签", object: "首发素材", time: "2026-08-21 13:20:10", result: "成功" },
  { id: "LOG-1002", action: "审批积分申请", object: "CA-20260821-018", time: "2026-08-21 11:42:08", result: "成功" },
  { id: "LOG-0998", action: "恢复资源", object: "夏季清凉女装成片", time: "2026-08-21 10:16:35", result: "成功" },
  { id: "LOG-0991", action: "修改角色权限", object: "直播运营", time: "2026-08-20 18:32:14", result: "成功" },
  { id: "LOG-0986", action: "导出人员列表", object: "账号与人员数据", time: "2026-08-20 16:05:27", result: "成功" },
];

const initialLoginRows = [
  { id: "L-1001", device: "Windows 11 · Microsoft Edge", icon: Laptop, ip: "110.88.24.18", location: "福建省厦门市", time: "2026-08-21 09:08:12", status: "当前会话" },
  { id: "L-1000", device: "iPhone 15 Pro · Safari", icon: Smartphone, ip: "223.104.47.36", location: "福建省厦门市", time: "2026-08-20 22:31:46", status: "已登录" },
  { id: "L-0999", device: "macOS · Google Chrome", icon: Laptop, ip: "110.88.24.18", location: "福建省厦门市", time: "2026-08-19 14:22:09", status: "已退出" },
  { id: "L-0998", device: "Windows 11 · Microsoft Edge", icon: Laptop, ip: "183.252.19.52", location: "福建省泉州市", time: "2026-08-18 08:46:51", status: "已退出" },
];

export default function AdminProfileView({ onOpenPermissionMatrix }: AdminProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [profile, setProfile] = useState({
    name: "徐振",
    phone: "13800138000",
    email: "xuzhen@dreamchang.com",
    title: "平台负责人",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [loginRows, setLoginRows] = useState(initialLoginRows);

  const permissionCount = useMemo(
    () => permissionGroups.reduce((total, group) => total + group.count, 0),
    []
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const openEditModal = () => {
    setDraftProfile(profile);
    setShowEditModal(true);
  };

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setProfile(draftProfile);
    setShowEditModal(false);
    showToast("个人资料已更新");
  };

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    if (!passwordForm.current) {
      setPasswordError("请输入当前密码");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("新密码至少需要 8 位");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("两次输入的新密码不一致");
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ current: "", next: "", confirm: "" });
    showToast("登录密码已更新");
  };

  const logoutOtherDevices = () => {
    setLoginRows((rows) => rows.map((row) => row.status === "已登录" ? { ...row, status: "已退出" } : row));
    setShowLogoutModal(false);
    showToast("其他设备会话已退出");
  };

  const tabs: { id: ProfileTab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "个人资料", icon: User },
    { id: "permissions", label: "角色与权限", icon: ShieldCheck },
    { id: "security", label: "登录与安全", icon: LockKeyhole },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-5 text-slate-800">
      {toast && (
        <div className="fixed right-5 top-5 z-[120] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <UserCog className="h-5 w-5 text-purple-600" />
              管理端个人中心
            </h1>
            <p className="mt-1 text-xs text-slate-400">管理员资料、当前权限和账号安全</p>
          </div>
          <div className="flex w-full flex-wrap rounded-lg border border-slate-200 bg-slate-100 p-1 lg:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    activeTab === tab.id ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <img src={AVATAR_URL} alt="管理员头像" className="h-16 w-16 rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" title="当前在线" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{profile.name}</h2>
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">超级管理员</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">账号正常</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">管理员账号：admin_xuzhen · 工号：ZS-001 · {profile.title}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />梦畅AIGC · 高管层</span>
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />最近登录 2026-08-21 09:08</span>
                </p>
              </div>
            </div>
            {activeTab === "profile" && (
              <button type="button" onClick={openEditModal} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-700">
                <Edit3 className="h-4 w-4" />编辑资料
              </button>
            )}
          </div>
        </section>

        {activeTab === "profile" && (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-extrabold text-slate-900">
                <User className="h-4 w-4 text-purple-600" />基础信息
              </h3>
              <dl className="mt-4 grid gap-4 text-xs sm:grid-cols-2 xl:grid-cols-1">
                <div><dt className="text-slate-400">姓名</dt><dd className="mt-1 font-bold text-slate-800">{profile.name}</dd></div>
                <div><dt className="text-slate-400">管理岗位</dt><dd className="mt-1 font-bold text-slate-800">{profile.title}</dd></div>
                <div><dt className="text-slate-400">所属组织</dt><dd className="mt-1 font-bold text-slate-800">梦畅AIGC / 高管层</dd></div>
                <div><dt className="text-slate-400">手机号码</dt><dd className="mt-1 flex items-center gap-1.5 font-bold text-slate-800"><Phone className="h-3.5 w-3.5 text-slate-400" />{profile.phone}</dd></div>
                <div><dt className="text-slate-400">工作邮箱</dt><dd className="mt-1 flex items-center gap-1.5 font-bold text-slate-800"><Mail className="h-3.5 w-3.5 text-slate-400" />{profile.email}</dd></div>
                <div><dt className="text-slate-400">账号创建时间</dt><dd className="mt-1 font-bold text-slate-800">2025-05-16 10:30:00</dd></div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Clock3 className="h-4 w-4 text-purple-600" />最近操作</h3>
                <span className="text-[11px] text-slate-400">最近 5 条</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500">
                    <tr><th className="px-4 py-2.5">操作时间</th><th className="px-4 py-2.5">操作类型</th><th className="px-4 py-2.5">操作对象</th><th className="px-4 py-2.5">结果</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {operationRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono text-slate-400">{row.time}</td>
                        <td className="px-4 py-3 font-bold text-slate-700">{row.action}</td>
                        <td className="px-4 py-3 text-slate-600">{row.object}</td>
                        <td className="px-4 py-3"><span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{row.result}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4"><p className="text-[11px] font-bold text-purple-600">当前角色</p><p className="mt-2 text-lg font-black text-purple-950">超级管理员</p><p className="mt-1 text-[11px] text-purple-700">角色编码 SUPER_ADMIN</p></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-bold text-slate-400">数据范围</p><p className="mt-2 text-lg font-black text-slate-900">全部数据</p><p className="mt-1 text-[11px] text-slate-500">覆盖全部公司、部门与人员</p></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-bold text-slate-400">功能权限</p><p className="mt-2 text-lg font-black text-slate-900">{permissionCount} 项</p><p className="mt-1 text-[11px] text-slate-500">用户端与管理端权限已生效</p></div>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><ShieldCheck className="h-4 w-4 text-purple-600" />管理端权限摘要</h3><p className="mt-1 text-[11px] text-slate-400">角色权限最后更新于 2026-08-20 18:32</p></div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowPermissionModal(true)} className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" />查看明细</button>
                  <button type="button" onClick={onOpenPermissionMatrix} className="flex h-8 items-center gap-1.5 rounded-lg bg-purple-600 px-3 text-xs font-bold text-white hover:bg-purple-700"><UserCog className="h-3.5 w-3.5" />权限矩阵</button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {permissionGroups.map((group) => (
                  <div key={group.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between"><span className="text-xs font-extrabold text-slate-800">{group.name}</span><span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{group.count}/{group.count}</span></div>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500">{group.items.join("、")}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-extrabold text-slate-900"><KeyRound className="h-4 w-4 text-purple-600" />密码安全</h3>
                <div className="py-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-700">登录密码</span><span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">安全</span></div><p className="mt-2 text-[11px] text-slate-400">上次修改：2026-07-18 16:20</p></div>
                <button type="button" onClick={() => setShowPasswordModal(true)} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"><KeyRound className="h-4 w-4" />修改密码</button>
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><MonitorSmartphone className="h-4 w-4 text-purple-600" />登录会话</h3>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">当前有 2 个设备保持登录。</p>
                <button type="button" onClick={() => setShowLogoutModal(true)} className="mt-4 flex h-9 w-full items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100">退出其他设备</button>
              </section>
            </div>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-sm font-extrabold text-slate-900">最近登录记录</h3><p className="mt-1 text-[11px] text-slate-400">仅显示当前管理员最近 4 条记录</p></div>
              <div className="divide-y divide-slate-100">
                {loginRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Icon className="h-4 w-4" /></div><div><p className="text-xs font-bold text-slate-800">{row.device}</p><p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{row.location}</span><span className="font-mono">{row.ip}</span><span>{row.time}</span></p></div></div>
                      <span className={`w-fit rounded-md px-2 py-1 text-[10px] font-bold ${row.status === "当前会话" ? "bg-purple-100 text-purple-700" : row.status === "已登录" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{row.status}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      {showEditModal && (
        <Modal title="编辑个人资料" icon={Edit3} onClose={() => setShowEditModal(false)}>
          <form onSubmit={saveProfile} className="space-y-4 p-5">
            <Field label="姓名"><input required value={draftProfile.name} onChange={(event) => setDraftProfile({ ...draftProfile, name: event.target.value })} className={INPUT_CLASS} /></Field>
            <Field label="管理岗位"><input required value={draftProfile.title} onChange={(event) => setDraftProfile({ ...draftProfile, title: event.target.value })} className={INPUT_CLASS} /></Field>
            <Field label="手机号码"><input required value={draftProfile.phone} onChange={(event) => setDraftProfile({ ...draftProfile, phone: event.target.value })} className={INPUT_CLASS} /></Field>
            <Field label="工作邮箱"><input type="email" required value={draftProfile.email} onChange={(event) => setDraftProfile({ ...draftProfile, email: event.target.value })} className={INPUT_CLASS} /></Field>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setShowEditModal(false)} className="h-9 px-4 text-xs font-bold text-slate-500">取消</button><button type="submit" className="flex h-9 items-center gap-1.5 rounded-lg bg-purple-600 px-4 text-xs font-bold text-white"><Save className="h-4 w-4" />保存</button></div>
          </form>
        </Modal>
      )}

      {showPasswordModal && (
        <Modal title="修改登录密码" icon={KeyRound} onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={savePassword} className="space-y-4 p-5">
            {passwordError && <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700"><AlertTriangle className="h-4 w-4" />{passwordError}</div>}
            <Field label="当前密码"><input type="password" value={passwordForm.current} onChange={(event) => setPasswordForm({ ...passwordForm, current: event.target.value })} className={INPUT_CLASS} /></Field>
            <Field label="新密码"><input type="password" value={passwordForm.next} onChange={(event) => setPasswordForm({ ...passwordForm, next: event.target.value })} className={INPUT_CLASS} placeholder="至少 8 位" /></Field>
            <Field label="确认新密码"><input type="password" value={passwordForm.confirm} onChange={(event) => setPasswordForm({ ...passwordForm, confirm: event.target.value })} className={INPUT_CLASS} /></Field>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setShowPasswordModal(false)} className="h-9 px-4 text-xs font-bold text-slate-500">取消</button><button type="submit" className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white"><KeyRound className="h-4 w-4" />确认修改</button></div>
          </form>
        </Modal>
      )}

      {showPermissionModal && (
        <Modal title="当前角色权限明细" icon={ShieldCheck} onClose={() => setShowPermissionModal(false)} wide>
          <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5">
            {permissionGroups.map((group) => (
              <div key={group.name} className="rounded-lg border border-slate-200 p-4"><div className="flex items-center justify-between"><h4 className="text-xs font-extrabold text-slate-900">{group.name}</h4><span className="text-[10px] font-bold text-emerald-600">全部授权</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{group.items.map((item) => <div key={item} className="flex items-center gap-2 text-[11px] text-slate-600"><span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>{item}</div>)}</div></div>
            ))}
          </div>
          <div className="flex justify-end border-t border-slate-100 px-5 py-4"><button type="button" onClick={() => setShowPermissionModal(false)} className="h-9 rounded-lg bg-purple-600 px-5 text-xs font-bold text-white">知道了</button></div>
        </Modal>
      )}

      {showLogoutModal && (
        <Modal title="退出其他设备" icon={MonitorSmartphone} onClose={() => setShowLogoutModal(false)}>
          <div className="p-5"><div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-xs font-extrabold text-amber-900">确认退出其他已登录设备？</p><p className="mt-1 text-[11px] leading-5 text-amber-700">当前浏览器不会退出，其他设备需要重新验证账号和密码。</p></div></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowLogoutModal(false)} className="h-9 px-4 text-xs font-bold text-slate-500">取消</button><button type="button" onClick={logoutOtherDevices} className="h-9 rounded-lg bg-rose-600 px-4 text-xs font-bold text-white">确认退出</button></div></div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>{children}</label>;
}

function Modal({ title, icon: Icon, onClose, children, wide = false }: { title: string; icon: typeof User; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Icon className="h-4 w-4 text-purple-600" />{title}</h3><button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700" title="关闭"><X className="h-4 w-4" /></button></div>
        {children}
      </div>
    </div>
  );
}
