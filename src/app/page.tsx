import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "إنشاء حساب طالب" };
export default function RegisterPage() {
  return <main className="min-h-screen bg-[#f5f8fb] py-8"><div className="container-shell"><Link href="/" className="mb-7 inline-flex items-center gap-3"><span className="brand-mark">MR</span><b className="text-xl text-[#071c34]">MR-Academy</b></Link><div className="grid overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-[.72fr_1.28fr]"><aside className="hero-grid bg-[#071c34] p-8 text-white md:p-10"><p className="text-sm font-extrabold text-[#ff9a64]">ابدأ رحلتك</p><h1 className="mt-3 text-3xl font-black leading-snug">حساب واحد، وكل تعليمك في مكان واحد.</h1><div className="mt-9 space-y-5 text-sm text-slate-200">{["تابع تقدمك درسًا بدرس", "اختبارات ونتائج محفوظة", "محتوى آمن ومتاح لك فقط"].map((text)=><p className="flex items-center gap-3" key={text}><CheckCircle2 className="text-[#ff8b4e]" size={20}/>{text}</p>)}</div></aside><section className="p-6 md:p-10"><h2 className="text-2xl font-black text-[#071c34]">إنشاء حساب طالب جديد</h2><p className="mb-7 mt-2 text-sm text-slate-500">أدخل بيانات صحيحة لنقدر نتابع معك ومع ولي أمرك عند الحاجة.</p><RegisterForm /></section></div></div></main>;
}
