"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: form.get("phone"), password: form.get("password") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push(data.role === "ADMIN" ? "/admin" : "/dashboard"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تسجيل الدخول"); } finally { setLoading(false); }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <div className="toast-error" role="alert">{error}</div>}
      <div><label className="label" htmlFor="phone">رقم الهاتف</label><input className="field" id="phone" name="phone" inputMode="numeric" autoComplete="tel" placeholder="01xxxxxxxxx" required /></div>
      <div><div className="mb-2 flex items-center justify-between"><label className="label !mb-0" htmlFor="password">كلمة المرور</label><Link href="/forgot-password" className="text-xs font-bold text-[#e5692f]">نسيت كلمة المرور؟</Link></div><input className="field" id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required /></div>
      <button className="btn-primary w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={19}/> : <ArrowLeft size={19}/>}تسجيل الدخول</button>
      <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/><span>أو للمعاينة</span><span className="h-px flex-1 bg-slate-200"/></div>
      <Link href="/admin/courses" className="btn-secondary w-full border-[#f3a27b] text-[#bd4d1f]"><ShieldCheck size={19}/>دخول سريع كـ Admin</Link>
      <p className="text-center text-sm text-slate-500">ليس لديك حساب؟ <Link className="font-extrabold text-[#e5692f]" href="/register">أنشئ حسابًا جديدًا</Link></p>
    </form>
  );
}
