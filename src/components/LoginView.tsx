import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  RefreshCw,
  Sparkles,
  UserRound,
} from "lucide-react";

export type AppMode = "user" | "admin";

export interface PrototypeAccount {
  username: string;
  password: string;
  label: string;
  description: string;
  allowedModes: AppMode[];
  defaultMode: AppMode;
}

interface LoginViewProps {
  accounts: PrototypeAccount[];
  onLogin: (account: PrototypeAccount) => void;
}

const CAPTCHA_CODES = ["A8K6", "M4P9", "R7C2", "H6N3"];
const LOGIN_BACKGROUND =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=2200&auto=format&fit=crop&q=88";

export default function LoginView({ accounts, onLogin }: LoginViewProps) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [password, setPassword] = useState(accounts[0]?.password ?? "");
  const [captchaCode, setCaptchaCode] = useState(CAPTCHA_CODES[0]);
  const [captchaInput, setCaptchaInput] = useState(CAPTCHA_CODES[0]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const selectAccount = (account: PrototypeAccount) => {
    setSelectedAccount(account);
    setPassword(account.password);
    setCaptchaInput(captchaCode);
    setAccountMenuOpen(false);
    setError("");
  };

  const refreshCaptcha = () => {
    const currentIndex = CAPTCHA_CODES.indexOf(captchaCode);
    const nextCode = CAPTCHA_CODES[(currentIndex + 1) % CAPTCHA_CODES.length];
    setCaptchaCode(nextCode);
    setCaptchaInput(nextCode);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAccount) return;
    if (password !== selectedAccount.password) {
      setError("账号或密码不正确");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError("验证码不正确");
      return;
    }
    onLogin(selectedAccount);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-slate-900">
      <img
        src={LOGIN_BACKGROUND}
        alt="视频内容创作现场"
        className="absolute inset-0 h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.22)_0%,rgba(2,6,23,0.4)_46%,rgba(2,6,23,0.78)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center px-6 py-8 sm:px-10 lg:px-16">
        <section className="hidden flex-1 self-stretch py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-black">梦畅 AIGC</span>
          </div>
          <div className="max-w-xl pb-12 text-white">
            <h1 className="text-4xl font-black leading-tight">让每一次灵感，<br />都更快成为好内容</h1>
          </div>
        </section>

        <section className="ml-auto w-full max-w-[420px] rounded-lg border border-white/25 bg-white/96 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5 text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-lg font-black">梦畅 AIGC</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">账号登录</h2>
            <p className="mt-2 text-sm text-slate-500">欢迎使用梦畅 AIGC</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">账号</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex h-11 w-full items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-left transition-colors hover:border-slate-300"
                >
                  <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{selectedAccount.username}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {accountMenuOpen && (
                  <>
                    <button type="button" aria-label="关闭账号列表" className="fixed inset-0 z-20 cursor-default" onClick={() => setAccountMenuOpen(false)} />
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-xl">
                      {accounts.map((account) => (
                        <button
                          key={account.username}
                          type="button"
                          onClick={() => selectAccount(account)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                            <UserRound className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-slate-800">{account.username}</span>
                            <span className="mt-0.5 block text-[11px] text-slate-400">{account.description}</span>
                          </span>
                          {selectedAccount.username === account.username && <Check className="h-4 w-4 text-violet-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-xs font-bold text-slate-600">密码</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError(""); }}
                  className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-11 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  title={showPassword ? "隐藏密码" : "显示密码"}
                  className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="login-captcha" className="mb-2 block text-xs font-bold text-slate-600">验证码</label>
              <div className="flex gap-3">
                <input
                  id="login-captcha"
                  value={captchaInput}
                  maxLength={4}
                  onChange={(event) => { setCaptchaInput(event.target.value.toUpperCase()); setError(""); }}
                  className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold uppercase text-slate-800 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  title="刷新验证码"
                  className="group flex h-11 w-28 items-center justify-center gap-2 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                >
                  <span className="select-none font-mono text-lg font-black text-violet-700">{captchaCode}</span>
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-90" />
                </button>
              </div>
            </div>

            <div className="min-h-5 text-xs font-medium text-rose-600">{error}</div>

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-violet-600 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-700"
            >
              <LogIn className="h-4 w-4" />
              登录
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
