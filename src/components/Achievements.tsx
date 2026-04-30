"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Achievement = {
  id: string;
  date: string;
  title: string;
  description: string;
};

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setAchievements(data);
      setLoading(false);
    }
    fetchAchievements();
  }, []);

  return (
    <section id="achievements" className="relative w-full max-w-4xl mx-auto px-6 py-32 z-10 pt-24 border-b-2 border-brandGray">
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-brandRed md:border-l-4 md:pl-4 inline-block md:block">
          Track Record
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
          // Major Milestones & Wins
        </p>
      </div>

      {loading ? (
        <div className="w-full py-12 text-center font-mono text-brandRed animate-pulse">
          [EXTRACTING_RECORDS...]
        </div>
      ) : (
        <div className="relative border-l-2 border-brandGray/50 ml-4 md:ml-8 space-y-12 pb-12">
          {achievements.length === 0 ? (
            <div className="pl-8 text-gray-500 font-mono text-sm">NO_MILESTONES_FOUND</div>
          ) : (
            achievements.map((item, index) => (
              <div key={item.id} className="relative pl-8 md:pl-12 group">
                <div className="absolute w-4 h-4 bg-darkBg border-2 border-brandRed rounded-full -left-[9px] top-1.5 group-hover:bg-brandRed group-hover:shadow-[0_0_15px_rgba(230,0,0,0.6)] transition-all duration-300"></div>
                
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                  <span className="font-mono text-brandRed text-sm font-bold uppercase tracking-widest shrink-0">
                    {item.date}
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide group-hover:text-brandRed transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed md:w-5/6 text-sm">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}