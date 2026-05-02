"use client";
import { motion } from "framer-motion";

const skillCategories = [
  {
    id: "01",
    title: "Technical Skills",
    skills: ["Web Dev", "Cybersecurity", "Problem Solving", "Gen AI", "Data Analysis", "Project Dev"],
    color: "from-brandRed/20 to-transparent"
  },
  {
    id: "02",
    title: "Core Competencies",
    skills: ["Leadership", "Event Planning", "Public Speaking", "Strategy", "Decision Making", "Community"],
    color: "from-gray-800 to-transparent"
  },
  {
    id: "03",
    title: "Professional Skills",
    skills: ["Project Management", "Time Management", "Stakeholders", "Pitching", "Networking"],
    color: "from-gray-800 to-transparent"
  },
  {
    id: "04",
    title: "Personal Traits",
    skills: ["Consistency", "Growth Mindset", "Adaptability", "Initiative", "Resilience"],
    color: "from-brandRed/20 to-transparent"
  }
];

export default function Skills() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10">
            <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-l-4 border-brandRed pl-4">
          Skill Set
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
          // Technical & Leadership Stack
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`relative p-8 brutal-border bg-brandGray/20 hover:bg-brandGray/40 transition-all duration-500 group overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <span className="relative z-10 block font-mono text-brandRed text-sm font-bold mb-4">
              SEC_FILE_{cat.id}
            </span>

            <h3 className="relative z-10 text-2xl font-black uppercase mb-8 group-hover:tracking-wider transition-all">
              {cat.title}
            </h3>

            <div className="relative z-10 flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-tighter border border-white/10 bg-black/40 group-hover:border-brandRed/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 flex items-end justify-end p-1">
               <div className="w-full h-[1px] bg-white/10 group-hover:bg-brandRed transition-colors"></div>
               <div className="absolute right-0 bottom-0 w-[1px] h-full bg-white/10 group-hover:bg-brandRed transition-colors"></div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute -bottom-10 right-0 pointer-events-none opacity-[0.02] select-none">
        <h4 className="text-[20vw] font-black leading-none">SKILLS</h4>
      </div>

    </section>
  );
}