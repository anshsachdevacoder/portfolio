"use client";

export default function AtAGlance() {
  const stats = [
    { value: "3+", label: "International", desc: "Global Events" },
    { value: "15+", label: "National", desc: "Participations" },
    { value: "50+", label: "Inter-University", desc: "Participations" },
    { value: "30+", label: "Events", desc: "Organized (IITs/NITs)" },
    { value: "400+", label: "Mentored", desc: "Students Guided" },
    { value: "70+", label: "Intra-University", desc: "Participations + Achievements" },
  ];
  const hexPositions = [
    "top-[0%] left-[50%]",   
    "top-[25%] left-[95%]",  
    "top-[75%] left-[95%]",  
    "top-[100%] left-[50%]",
    "top-[75%] left-[5%]",   
    "top-[25%] left-[5%]",
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10 flex flex-col items-center">
      
      <div className="w-full mb-16 md:mb-24 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-brandRed md:border-l-4 md:pl-4 inline-block md:block">
          At a Glance
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
          // The Network of Impact
        </p>
      </div>
            <div className="hidden md:flex relative w-[600px] h-[600px] items-center justify-center">
        <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
        <div className="absolute inset-12 border border-brandRed/20 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none"></div>
                <div className="relative z-20 w-56 h-56 rounded-full brutal-border bg-darkBg flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.15)]">
           <img 
             src="/hero-2.jpeg" 
             alt="Ansh Sachdeva Impact" 
             className="w-full h-full object-cover object-center"
           />
        </div>
                {stats.map((stat, index) => (
          <div 
            key={index}
            className={`absolute w-40 h-32 brutal-border bg-darkBg flex flex-col items-center justify-center p-4 transform -translate-x-1/2 -translate-y-1/2 shadow-xl hover:scale-110 hover:border-brandRed hover:shadow-[0_0_20px_rgba(230,0,0,0.3)] transition-all duration-300 group cursor-default z-10 ${hexPositions[index]}`}
          >
            <span className="text-3xl font-black text-white group-hover:text-brandRed transition-colors">
              {stat.value}
            </span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider mt-1 text-center">
              {stat.label}
            </span>
            <span className="text-[10px] text-gray-500 text-center leading-tight mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>
            <div className="w-full grid grid-cols-2 gap-4 md:hidden">
        <div className="col-span-2 flex justify-center mb-6">
          <div className="relative w-40 h-40 rounded-full brutal-border bg-darkBg flex items-center justify-center overflow-hidden">
             <img 
               src="/hero-2.jpeg" 
               alt="Ansh Sachdeva Impact" 
               className="w-full h-full object-cover object-center"
             />
          </div>
        </div>
                {stats.map((stat, index) => (
          <div key={index} className="brutal-border bg-brandGray/30 p-4 flex flex-col items-center justify-center text-center hover:border-brandRed transition-colors group">
             <span className="text-2xl font-black text-brandRed group-hover:text-white transition-colors">
              {stat.value}
            </span>
            <span className="text-xs font-bold text-white uppercase mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}