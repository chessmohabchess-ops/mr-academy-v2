"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const f = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["fullName", "phone", "guardianPhone", "motherPhone", "email", "password"].map((key) => [key, f.get(key)]));
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/dashboard"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر إنشاء الحساب"); } finally { setLoading(false); }
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {error && <div className="toast-error sm:col-span-2" role="alert">{error}</div>}
      <div className="sm:col-span-2"><label className="label" htmlFor="fullName">الاسم الثلاثي *</label><input className="field" id="fullName" name="fullName" autoComplete="name" required /></div>
      <div><label className="label" htmlFor="phone">رقم هاتف الطالب *</label><input className="field" id="phone" name="phone" inputMode="numeric" placeholder="01xxxxxxxxx" required /></div>
      <div><label className="label" htmlFor="guardianPhone">رقم هاتف ولي الأمر *</label><input className="field" id="guardianPhone" name="guardianPhone" inputMode="numeric" placeholder="01xxxxxxxxx" required /></div>
      <div><label className="label" htmlFor="motherPhone">رقم هاتف الأم *</label><input className="field" id="motherPhone" name="motherPhone" inputMode="numeric" placeholder="01xxxxxxxxx" required /></div>
      <div><label className="label" htmlFor="email">البريد الإلكتروني <span className="font-normal text-slate-400">(اختياري)</span></label><input className="field" id="email" name="email" type="email" autoComplete="email" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="password">كلمة المرور *</label><input className="field" id="password" name="password" type="password" minLength={8} autoComplete="new-password" required /><p className="mt-1.5 text-xs text-slate-400">8 أحرف على الأقل، ولا تشاركها مع أي شخص.</p></div>
      <button className="btn-primary sm:col-span-2" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={19}/> : <ArrowLeft size={19}/>}إنشاء حساب الطالب</button>
      <p className="text-center text-sm text-slate-500 sm:col-span-2">لديك حساب؟ <Link className="font-extrabold text-[#e5692f]" href="/login">سجل الدخول</Link></p>
    </form>
  );
}
