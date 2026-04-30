"use client";
import { useState } from "react";

export default function WhatIBring() {
  const [activeTab, setActiveTab] = useState<"TECH" | "LEADERSHIP">("TECH");

  const marqueeText = activeTab === "TECH" 
    ? "CYBERSECURITY • PROBLEM SOLVER • BUILDER • " 
    : "LEADERSHIP • STRATEGY • EXECUTION • ";

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden border-b-2 border-brandGray">
            <div className="absolute inset-0 flex items-center z-0 pointer-events-none select-none overflow-hidden">
        <div className="w-[200%] flex animate-marquee">
           <h1 className="text-[14vw] font-black text-white/5 leading-none whitespace-nowrap">
             {marqueeText}{marqueeText}{marqueeText}{marqueeText}
           </h1>
        </div>
      </div>

      <div className="absolute inset-y-0 right-1/4 w-32 md:w-48 bg-brandRed z-0 transform -skew-x-6 drop-shadow-2xl opacity-90"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 space-y-8">
          <div className="inline-flex items-center bg-brandGray rounded-full p-1 border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveTab("TECH")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
                activeTab === "TECH" 
                  ? "bg-brandRed text-white shadow-[0_0_15px_rgba(230,0,0,0.5)]" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tech Focus
            </button>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mx-1 text-xs text-gray-500 font-bold">
              OR
            </div>
            <button
              onClick={() => setActiveTab("LEADERSHIP")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
                activeTab === "LEADERSHIP" 
                  ? "bg-brandRed text-white shadow-[0_0_15px_rgba(230,0,0,0.5)]" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Leadership
            </button>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl md:text-6xl font-black leading-tight uppercase tracking-tight">
              What I Bring <br />
              <span className="text-brandRed">To The Table.</span>
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg font-medium">
              {activeTab === "TECH"
                ? "I bring a problem-solving mindset backed by execution. From building projects to presenting them under evaluation, I focus on delivering outcomes—not just ideas."
                : "I bring leadership that translates into execution and results. I understand how to align teams, make decisions under uncertainty, and ensure smooth execution."}
            </p>
          </div>
        </div>
                <div className="md:w-1/2 flex justify-center mt-16 md:mt-0 relative">
          <div className="relative w-[300px] h-[450px] z-20 brutal-border bg-darkBg overflow-hidden group">
             <img 
               src="/hero-1.jpeg" 
               alt="Ansh Sachdeva" 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
             />
            
          </div>
        </div>

      </div>
    </section>
  );
}