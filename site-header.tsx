import Link from "next/link";
import { BookOpen, LayoutDashboard, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="MR-Academy الرئيسية">
          <span className="brand-mark">MR</span>
          <span><b className="block text-[17px] text-[#071c34]">MR-Academy</b><small className="block text-[10px] font-bold text-slate-500">اتعلم بذكاء</small></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex" aria-label="التنقل الرئيسي">
          <Link href="/courses" className="hover:text-[#f37a3d]">الكورسات</Link>
          <Link href="/#why" className="hover:text-[#f37a3d]">لماذا نحن؟</Link>
          <Link href="/#support" className="hover:text-[#f37a3d]">الدعم</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="btn-primary !min-h-10 !rounded-xl !px-3 text-sm"><LayoutDashboard size={17} />لوحتي</Link>
          ) : (
            <><Link href="/login" className="btn-secondary !min-h-10 !px-3 text-sm"><LogIn size={17} />دخول</Link><Link href="/register" className="btn-primary hidden !min-h-10 !px-3 text-sm sm:inline-flex"><BookOpen size={17} />ابدأ الآن</Link></>
          )}
        </div>
      </div>
    </header>
  );
}
