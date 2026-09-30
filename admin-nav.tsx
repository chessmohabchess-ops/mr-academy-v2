"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, ClipboardCheck, CreditCard, FileClock, GraduationCap, LayoutDashboard, LogOut, Percent, Settings, ShoppingBag, Users } from "lucide-react";

const items = [
  ["/admin", "نظرة عامة", LayoutDashboard], ["/admin/students", "الطلاب", Users], ["/admin/courses", "الكورسات", BookOpen],
  ["/admin/orders", "الطلبات", ShoppingBag], ["/admin/payments", "المدفوعات", CreditCard], ["/admin/quizzes", "الاختبارات", ClipboardCheck],
  ["/admin/coupons", "الكوبونات", Percent], ["/admin/analytics", "التحليلات", BarChart3], ["/admin/audit-logs", "سجل النشاط", FileClock], ["/admin/settings", "الإعدادات", Settings],
] as const;
export function AdminNav(){const path=usePathname();return <aside className="hidden min-h-screen w-[250px] shrink-0 bg-[#071c34] p-5 text-white lg:block"><Link href="/" className="mb-9 flex items-center gap-3"><span className="brand-mark">MR</span><span><b className="block">MR-Academy</b><small className="text-[10px] text-slate-400">لوحة الإدارة</small></span></Link><nav className="space-y-1">{items.map(([href,label,Icon])=><Link key={href} href={href} className={`admin-nav-link ${path===href?"active":""}`}><Icon size={18}/>{label}</Link>)}</nav><div className="mt-8 border-t border-white/10 pt-5"><Link href="/" className="admin-nav-link"><GraduationCap size={18}/>عرض المنصة</Link><button onClick={()=>fetch('/api/auth/logout',{method:'POST'}).then(()=>location.href='/')} className="admin-nav-link w-full"><LogOut size={18}/>تسجيل الخروج</button></div></aside>}
