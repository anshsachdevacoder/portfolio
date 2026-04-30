"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Certificate } from "@/lib/supabase";
const FILTERS = ["All", "International", "National", "State", "Inter-University", "Intra-University"];
export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function fetchAllCerts() {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setCerts(data);
      }
      setLoading(false);
    }
    fetchAllCerts();
  }, []);

  const filteredCerts = activeFilter === "All" 
    ? certs 
    : certs.filter(cert => cert.category === activeFilter);

  return (
    <main className="min-h-screen bg-darkBg text-white selection:bg-brandRed selection:text-white pt-24 px-6 pb-32">
      <div className="max-w-7xl mx-auto">
         <div className="mb-12">
          <Link href="/" className="text-gray-500 font-mono text-sm hover:text-brandRed transition-colors flex items-center gap-2 mb-8">
            ← RETURN_TO_BASE
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight">
            Full <span className="text-brandRed">Archive.</span>
          </h1>
          <p className="text-gray-400 mt-4 font-mono text-base uppercase max-w-2xl">
            A comprehensive ledger of awards, certifications, and verified achievements.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mb-12 border-y-2 border-brandGray py-6">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-widest brutal-border transition-all duration-300 ${
                activeFilter === filter 
                  ? "bg-brandRed text-white border-brandRed shadow-[0_0_15px_rgba(230,0,0,0.4)]" 
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center font-mono text-brandRed animate-pulse">
            [QUERYING_DATABASE...]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCerts.map((cert) => (
              <div key={cert.id} className="group brutal-border bg-brandGray/10 flex flex-col h-full hover:border-brandRed transition-colors">
                <div className="relative w-full h-40 bg-black overflow-hidden">
                  {cert.image_url && (
                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <div className="absolute top-0 right-0 bg-brandRed text-white px-2 py-1 text-[10px] font-black uppercase">
                    {cert.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold uppercase text-sm leading-snug mb-2 group-hover:text-brandRed transition-colors">
                    {cert.title}
                  </h3>
                  <div className="mt-auto space-y-2">
                    <p className="text-[10px] text-gray-400 font-mono uppercase">
                      ORG: {cert.issuing_organization}
                    </p>
                    {cert.verification_url && (
                      <a 
                        href={cert.verification_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-block w-full text-center py-2 border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-colors"
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCerts.length === 0 && (
              <div className="col-span-full py-12 text-center font-mono text-gray-500 uppercase border border-dashed border-gray-600">
                No records found for query parameter: {activeFilter}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}