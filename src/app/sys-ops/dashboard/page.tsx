import { Terminal } from "lucide-react";

export default function DashboardRoot() {
  return (
    <div className="brutal-border bg-darkBg p-12 text-center shadow-2xl animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[60vh] border-dashed border-gray-600">
      <Terminal size={64} className="text-brandRed mb-6 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-4 tracking-widest">
        System <span className="text-brandRed">Online.</span>
      </h1>
      <p className="font-mono text-sm text-gray-400 max-w-md mx-auto leading-relaxed uppercase">
        Welcome to the SYS_OPS CMS. <br /><br />
        Select a data module from the sidebar to initiate database management and content injection.
      </p>
    </div>
  );
}