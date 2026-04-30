"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Terminal, ShieldAlert } from "lucide-react";
export default function SysOpsLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("AUTHENTICATION FAILED: INVALID CREDENTIALS");
      setLoading(false);
    } else if (data.session) {
      router.push("/sys-ops/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-darkBg text-white flex items-center justify-center p-6 selection:bg-brandRed">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brandGray brutal-border border-brandRed/50">
            <Terminal size={24} className="text-brandRed" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white">
              SYS_OPS
            </h1>
            <p className="font-mono text-xs text-brandRed uppercase tracking-widest mt-1">
              Restricted Access
            </p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="brutal-border bg-brandGray/20 backdrop-blur-md p-8 space-y-6">
          
          {error && (
            <div className="flex items-start gap-2 bg-red-950/50 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400 tracking-wider">
              Admin_Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-darkBg brutal-border border-white/10 p-3 font-mono text-sm focus:outline-none focus:border-brandRed transition-colors"
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400 tracking-wider">
              Pass_Key
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-darkBg brutal-border border-white/10 p-3 font-mono text-sm focus:outline-none focus:border-brandRed transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Verifying..." : "Initialize Session"}
          </button>
        </form>

        <div className="mt-6 text-center font-mono text-[10px] text-gray-600 uppercase tracking-widest">
          Unauthorized access attempts are logged.
        </div>
      </div>
    </main>
  );
}