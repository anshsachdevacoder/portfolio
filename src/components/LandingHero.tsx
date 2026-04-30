export default function LandingHero() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b-2 border-brandGray">
            <div className="flex justify-between items-start z-10">
        <div className="brutal-border px-6 py-2 bg-brandGray/30 backdrop-blur-md">
          <span className="text-brandRed font-black tracking-widest text-sm">Online</span> 
        </div>
                <div className="flex flex-col items-end text-right">
          <div className="brutal-border px-4 py-2 bg-brandRed text-white font-black text-xs md:text-sm tracking-widest">
            11K+ LINKEDIN COMMUNITY
          </div>
          <span className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
            // 450K+ Impressions
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center z-10 mt-auto mb-auto">
        <p className="text-gray-400 font-mono mb-4 text-sm md:text-base uppercase tracking-widest flex items-center gap-2">
          <span className="w-8 h-[2px] bg-brandRed"></span>
          Cybersecurity & Leadership
        </p>
        <h1 className="text-6xl md:text-[8vw] font-black uppercase leading-[0.85] tracking-tight">
          Ansh Sachdeva
        </h1>
        <h2 className="text-3xl md:text-[4vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brandRed to-gray-500 mt-2 uppercase">
          Digital Architect
        </h2>
      </div>
      <div className="flex justify-between items-end z-10 font-mono text-xs text-gray-500 uppercase tracking-widest">
        <p>Location: India // Global Reach</p>
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span>Scroll to Init</span>
          <div className="w-[2px] h-12 bg-brandRed"></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none"></div>

    </section>
  );
}