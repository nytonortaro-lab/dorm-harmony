"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setMessage("注册成功，已自动登录。");
        router.push("/");
        router.refresh();
      } else {
        setMessage("注册成功。请检查邮箱完成验证后再登录。");
      }

      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("登录成功，正在跳转...");
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">DormHarmony</h1>
        <p className="mt-3 text-slate-600">
          {mode === "login" ? "登录你的账号" : "创建一个新账号"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                placeholder="输入用户名"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="输入邮箱"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="输入密码"
              required
            />
          </div>

          {message && (
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading
              ? "处理中..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          {mode === "login" ? "还没有账号？" : "已经有账号了？"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
            }}
            className="font-medium text-slate-900 underline"
          >
            {mode === "login" ? "去注册" : "去登录"}
          </button>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm text-slate-900 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}