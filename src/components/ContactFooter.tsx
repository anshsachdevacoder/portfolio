"use client";
import { Mail, MapPin, Link2, Terminal } from "lucide-react";
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ContactFooter() {
  return (
    <footer className="relative w-full border-t-2 border-brandGray bg-darkBg overflow-hidden z-10 pt-24 pb-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="flex items-center gap-2 text-brandRed font-mono text-sm uppercase tracking-widest mb-6">
              <Terminal size={16} />
              <span>Initiate_Contact_Protocol</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6">
              Let's Build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandRed to-gray-500">
                Something.
              </span>
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-md">
              Whether it's a high-stakes project, a leadership role, or a speaking engagement, I am ready for deployment.
            </p>
          </div>
          
          <div className="flex flex-col justify-center space-y-6">
                        <a 
              href="https://www.linkedin.com/in/ansh-sachdeva-a14559289/" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-between brutal-border bg-brandGray/20 p-6 hover:bg-brandRed transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Link2 size={32} className="text-gray-400 group-hover:text-white transition-colors" />
                <div>
                  <h3 className="font-black text-xl uppercase tracking-wider group-hover:text-white">Join the Network</h3>
                  <p className="font-mono text-xs text-brandRed group-hover:text-white/80 uppercase">11K+ Community // 450K+ Impressions</p>
                </div>
              </div>
              <span className="font-black text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </a>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <a 
                href="mailto:anshsachdeva.in@gmail.com" 
                className="group flex items-center gap-4 brutal-border bg-brandGray/10 p-4 hover:border-white transition-colors"
              >
                <Mail size={24} className="text-brandRed group-hover:text-white" />
                <span className="font-bold text-sm uppercase tracking-wider text-gray-300 group-hover:text-white">Email Me</span>
              </a>
                            <a 
                href="https://www.linkedin.com/in/ansh-sachdeva-a14559289/" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-4 brutal-border bg-brandGray/10 p-4 hover:border-white transition-colors"
              >
                <LinkedinIcon className="w-6 h-6 text-brandRed group-hover:text-white" />
                <span className="font-bold text-sm uppercase tracking-wider text-gray-300 group-hover:text-white">LinkedIn</span>
              </a>
            </div>
            
            <div className="flex items-center gap-4 brutal-border bg-transparent p-4 border-dashed">
              <MapPin size={24} className="text-gray-500" />
              <span className="font-mono text-xs text-gray-500 uppercase">Base Location: India // Operating Globally</span>
            </div>

          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-gray-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Ansh Sachdeva. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-2">
            System Status: <span className="w-2 h-2 rounded-full bg-brandRed animate-pulse"></span> Online
          </p>
        </div>

      </div>
    </footer>
  );
}