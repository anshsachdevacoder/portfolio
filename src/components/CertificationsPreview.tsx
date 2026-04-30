"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ExternalLink, ZoomIn } from "lucide-react";
import { supabase, Certificate } from "@/lib/supabase";

export default function CertificationsPreview() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    async function fetchPreviewCerts() {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (!error && data) setCerts(data);
      setLoading(false);
    }
    fetchPreviewCerts();
  }, []);

  useEffect(() => {
    if (selectedCert || isZoomed) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedCert, isZoomed]);

  return (
    <section id="certifications" className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-l-4 border-brandRed pl-4">
            Verified Archives
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
            // Certifications & Awards Preview
          </p>
        </div>
        <Link href="/certifications" className="px-8 py-3 bg-brandGray brutal-border text-white font-bold uppercase tracking-widest text-sm hover:bg-brandRed transition-all flex items-center gap-2">
          Access Full Database <span className="text-brandRed group-hover:text-white">→</span>
        </Link>
      </div>
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center font-mono text-brandRed animate-pulse">
          [FETCHING_DATA...]
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div 
              key={cert.id} 
              onClick={() => setSelectedCert(cert)}
              className="group relative brutal-border bg-darkBg overflow-hidden flex flex-col h-80 cursor-pointer hover:border-brandRed transition-colors"
            >
              <div className="relative w-full h-48 overflow-hidden bg-brandGray/30 border-b-2 border-brandGray group-hover:border-brandRed transition-colors">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-gray-600 text-xs">NO_IMG_DATA</div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 text-brandRed border border-brandRed/50 px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm">
                  {cert.category}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-grow justify-between bg-gradient-to-b from-transparent to-brandGray/10">
                <div>
                  <h3 className="font-bold text-lg leading-tight uppercase line-clamp-2 group-hover:text-brandRed transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-mono">
                    {cert.issuing_organization}
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-brandRed uppercase flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                  View Record →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-darkBg brutal-border border-brandRed flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.15)] animate-in fade-in zoom-in-95 duration-300">
                        <button 
              onClick={() => { setSelectedCert(null); setIsZoomed(false); }}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-brandRed text-white transition-colors brutal-border"
            >
              <X size={20} />
            </button>
            <div 
              className="group w-full md:w-3/5 bg-black/50 border-b-2 md:border-b-0 md:border-r-2 border-brandGray flex items-center justify-center p-4 min-h-[300px] relative cursor-zoom-in"
              onClick={() => { if (selectedCert.image_url) setIsZoomed(true); }}
            >
              {selectedCert.image_url ? (
                <>
                  <img src={selectedCert.image_url} alt={selectedCert.title} className="max-w-full max-h-[60vh] md:max-h-[80vh] object-contain brutal-border transition-transform group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 bg-black text-white px-4 py-2 font-mono text-xs uppercase brutal-border">
                      <ZoomIn size={16} className="text-brandRed" /> Click to Zoom
                    </div>
                  </div>
                </>
              ) : (
                <span className="font-mono text-gray-500">NO_VISUAL_DATA</span>
              )}
            </div>
            <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto">
              <span className="text-brandRed font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-brandRed rounded-full animate-pulse"></span>
                Record_{selectedCert.id.slice(0, 8)}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-2 leading-tight">
                {selectedCert.title}
              </h2>
              <p className="text-gray-400 font-mono text-sm uppercase mb-8 border-b border-white/10 pb-4">
                Issuing Org: <span className="text-white">{selectedCert.issuing_organization}</span>
              </p>

              <div className="space-y-6 mt-auto">
                <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">Classification</h4>
                  <span className="px-3 py-1 bg-brandGray text-white text-xs font-bold uppercase brutal-border">
                    {selectedCert.category}
                  </span>
                </div>

                {selectedCert.verification_url && (
                  <a 
                    href={selectedCert.verification_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-colors mt-8"
                  >
                    <ExternalLink size={18} /> Verify Credential
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isZoomed && selectedCert?.image_url && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={selectedCert.image_url} 
            alt="Zoomed Certificate" 
            className="max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
          />
          <span className="absolute bottom-6 font-mono text-xs text-gray-500 uppercase tracking-widest bg-black/50 px-4 py-2 border border-white/10">
            Click anywhere to close
          </span>
        </div>
      )}

    </section>
  );
}