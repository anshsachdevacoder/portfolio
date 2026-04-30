"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  LogOut, LayoutDashboard, Award, Briefcase, Calendar, Trophy, Image as ImageIcon, MessageSquare
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/sys-ops");
      else setAuthLoading(false);
    };
    checkUser();
  }, [router]);

  if (authLoading) return <div className="min-h-screen bg-darkBg flex items-center justify-center font-mono text-brandRed">Verifying Clearance...</div>;

  const sidebarLinks = [
    { href: "/sys-ops/dashboard/certificates", label: "Certificates", icon: Award },
    { href: "/sys-ops/dashboard/projects", label: "Projects", icon: Briefcase },
    { href: "/sys-ops/dashboard/events", label: "Events", icon: Calendar },
    { href: "/sys-ops/dashboard/achievements", label: "Achievements", icon: Trophy },
    { href: "/sys-ops/dashboard/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/sys-ops/dashboard/testimonials", label: "Testimonials", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-brandGray/10 border-b-2 md:border-b-0 md:border-r-2 border-brandGray flex flex-col sticky top-0 md:h-screen">
        <div className="p-6 border-b-2 border-brandGray">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <LayoutDashboard size={24} className="text-brandRed" /> SYS_OPS
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full flex items-center gap-3 p-3 text-sm font-bold uppercase transition-all duration-300 ${
                  isActive ? "bg-brandRed text-white brutal-border border-brandRed shadow-[0_0_15px_rgba(230,0,0,0.3)]" : "text-gray-400 hover:text-white hover:bg-brandGray/30 brutal-border border-transparent"
                }`}
              >
                <Icon size={18} /> {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-2 border-brandGray">
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/sys-ops'))} className="w-full flex items-center justify-center gap-2 p-3 border border-white/20 text-xs font-bold uppercase hover:bg-brandRed transition-colors text-gray-400">
            <LogOut size={16} /> Terminate
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>
        <div className="max-w-5xl relative z-10 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}