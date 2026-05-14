"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Certificate } from "@/lib/supabase";
import { Search, X, ExternalLink, ZoomIn } from "lucide-react";

const FILTERS = ["All", "International", "National", "State", "Inter-University", "Intra-University", "Workshop", "Courses"];

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

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
  const filteredCerts = certs.filter((cert) => {
    const matchesFilter = activeFilter === "All" || cert.category === activeFilter;
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-darkBg text-white pt-24 px-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-gray-500 font-mono text-sm hover:text-brandRed transition-colors flex items-center gap-2 mb-8 w-max">
            ← RETURN_TO_BASE
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight">
            Full <span className="text-brandRed">Archive.</span>
          </h1>
          <p className="text-gray-400 mt-4 font-mono text-base uppercase max-w-2xl">
            A comprehensive ledger of awards, certifications, and verified achievements.
          </p>
        </div>
        <div className="space-y-6 mb-12">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text"
              placeholder="SEARCH_BY_CERTIFICATE_NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brandGray/10 border-2 border-brandGray p-4 pl-12 text-sm font-mono focus:outline-none focus:border-brandRed transition-colors uppercase"
            />
          </div>

          <div className="flex flex-wrap gap-3 border-y-2 border-brandGray py-6">
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
        </div>

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center font-mono text-brandRed animate-pulse">
            [QUERYING_DATABASE...]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id} 
                onClick={() => setSelectedCert(cert)}
                className="brutal-border bg-brandGray/10 flex flex-col h-full cursor-pointer border-brandGray hover:border-brandRed transition-colors"
              >
                <div className="relative w-full h-40 bg-black overflow-hidden">
                  {cert.image_url && (
                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover opacity-80" />
                  )}
                  <div className="absolute top-0 right-0 bg-brandRed text-white px-2 py-1 text-[10px] font-black uppercase">
                    {cert.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold uppercase text-sm leading-snug mb-2">
                    {cert.title}
                  </h3>
                  <div className="mt-auto">
                    <p className="text-[10px] text-gray-400 font-mono uppercase">
                      ORG: {cert.issuing_organization}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCerts.length === 0 && (
              <div className="col-span-full py-12 text-center font-mono text-gray-500 uppercase border border-dashed border-gray-600">
                NO_RECORDS_MATCH_QUERY: {searchQuery || activeFilter}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          ></div>
          <div className="relative w-full max-w-6xl bg-darkBg brutal-border border-brandRed flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-brandRed text-white hover:bg-white hover:text-brandRed transition-colors"
            >
              <X size={24} />
            </button>
            <div className="md:w-2/3 bg-black flex items-center justify-center overflow-auto p-4 border-b md:border-b-0 md:border-r border-brandGray">
              <div className="relative group cursor-zoom-in">
                <img 
                  src={selectedCert.image_url} 
                  alt={selectedCert.title} 
                  className="max-w-full max-h-[70vh] object-contain shadow-2xl"
                />
              </div>
            </div>
            <div className="md:w-1/3 p-8 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-brandRed font-mono text-xs uppercase tracking-widest border-b border-brandRed/30 pb-1">
                  {selectedCert.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase mt-4 leading-tight">
                  {selectedCert.title}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 font-mono text-[10px] uppercase">Issuing Organization</p>
                  <p className="font-bold text-lg uppercase tracking-wide">{selectedCert.issuing_organization}</p>
                </div>

                {selectedCert.verification_url && (
                  <a 
                    href={selectedCert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-brandRed text-white px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-brandRed transition-all w-full justify-center"
                  >
                    Verify Credential <ExternalLink size={18} />
                  </a>
                )}
              </div>

              <div className="pt-6 border-t border-brandGray">
                <p className="text-gray-500 font-mono text-[10px] uppercase">
                  Log ID: {selectedCert.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}