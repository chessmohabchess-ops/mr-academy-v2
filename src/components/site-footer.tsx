import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="support" className="bg-[#071c34] py-12 text-white">
      <div className="container-shell grid gap-9 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div><div className="mb-4 flex items-center gap-3"><span className="brand-mark">MR</span><b className="text-xl">MR-Academy</b></div><p className="max-w-md text-sm leading-7 text-slate-300">تعليم عربي احترافي، محتوى منظم، ومتابعة حقيقية تساعد كل طالب على الوصول لهدفه بثقة.</p></div>
        <div><h2 className="mb-4 font-extrabold">روابط سريعة</h2><div className="grid gap-3 text-sm text-slate-300"><Link href="/courses">كل الكورسات</Link><Link href="/login">تسجيل الدخول</Link><Link href="/register">إنشاء حساب</Link></div></div>
        <div><h2 className="mb-4 font-extrabold">الدعم</h2><a className="mb-3 flex items-center gap-2 text-sm text-slate-300" href="tel:01023316767"><Phone size={16}/>01023316767</a><a className="btn-primary !min-h-11" href="https://wa.me/201023316767" target="_blank" rel="noreferrer"><MessageCircle size={18}/>تواصل مع الدعم</a></div>
      </div>
      <div className="container-shell mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} MR-Academy — جميع الحقوق محفوظة</div>
    </footer>
  );
}
