"use client";
import { useEffect, useState } from "react";
import { Quote, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 1. ADDED avatar_url TO THE TYPE
type Testimonial = {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar_url?: string; 
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. MODAL STATE
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setTestimonials(data);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTestimonial) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedTestimonial]);

  return (
    <section id="testimonials" className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10 border-b-2 border-brandGray">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-brandRed border-b-4 inline-block pb-2">
          Endorsements
        </h2>
        <p className="text-gray-400 mt-4 font-mono text-sm uppercase tracking-widest">
          // Peer & Superior Debriefs
        </p>
      </div>

      {loading ? (
        <div className="w-full py-12 text-center font-mono text-brandRed animate-pulse">
          [LOADING_ENDORSEMENTS...]
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.length === 0 ? (
            <div className="col-span-full p-8 text-center font-mono text-gray-500 border border-dashed border-gray-600">
              NO_ENDORSEMENTS_ON_FILE
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                onClick={() => setSelectedTestimonial(testimonial)}
                className="relative p-8 brutal-border bg-brandGray/10 flex flex-col hover:bg-brandGray/30 hover:border-brandRed transition-colors cursor-pointer group"
              >
                <Quote size={40} className="text-brandRed/20 absolute top-6 right-6 group-hover:text-brandRed/40 transition-colors" />
                
                <p className="text-gray-300 italic mb-8 relative z-10 leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4">
                  
                  {/* 3. FIXED AVATAR RENDERING ON THE CARD */}
                  <div className="w-10 h-10 bg-darkBg border border-brandRed flex items-center justify-center text-brandRed font-black uppercase shrink-0 overflow-hidden">
                    {testimonial.avatar_url ? (
                      <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      testimonial.name.charAt(0)
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white uppercase text-sm group-hover:text-brandRed transition-colors">{testimonial.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1">
                      {testimonial.role} {testimonial.organization && `// ${testimonial.organization}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. SPLIT-VIEW MODAL */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-darkBg brutal-border border-brandRed flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.15)] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-brandRed text-white transition-colors brutal-border"
            >
              <X size={20} />
            </button>

            {/* Left: Full Avatar Viewer */}
            <div className="w-full md:w-2/5 bg-black/50 border-b-2 md:border-b-0 md:border-r-2 border-brandGray flex items-center justify-center p-8 min-h-[250px] relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brandGray/20 to-transparent pointer-events-none"></div>
              {selectedTestimonial.avatar_url ? (
                <img 
                  src={selectedTestimonial.avatar_url.replace("w_200,h_200", "w_600,h_600")} // Ask Cloudinary for a higher res version for the modal!
                  alt={selectedTestimonial.name} 
                  className="w-full max-w-[250px] h-auto object-cover brutal-border shadow-2xl relative z-10" 
                />
              ) : (
                <div className="w-48 h-48 bg-darkBg border-2 border-brandRed flex items-center justify-center text-brandRed font-black uppercase text-6xl shadow-2xl relative z-10">
                  {selectedTestimonial.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Right: Full Endorsement Details */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col overflow-y-auto">
              <Quote size={48} className="text-brandRed/20 mb-6" />
              
              <p className="text-lg md:text-xl text-gray-300 italic mb-10 leading-relaxed">
                "{selectedTestimonial.content}"
              </p>

              <div className="mt-auto border-t border-brandGray pt-6">
                <span className="text-brandRed font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brandRed rounded-full animate-pulse"></span>
                  Verified Source
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-1 leading-tight text-white">
                  {selectedTestimonial.name}
                </h2>
                <p className="text-gray-400 font-mono text-sm uppercase">
                  {selectedTestimonial.role} {selectedTestimonial.organization && `// ${selectedTestimonial.organization}`}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}