"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { X, ChevronLeft, ChevronRight, Layers, ImageIcon } from "lucide-react";

type Album = {
  id: string;
  title: string;
  caption: string;
  category: string;
  image_urls: string[];
};

const FILTERS = ["All", "Speaking", "Networking", "Hackathons", "Awards", "Community"];

export default function FullGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    async function fetchAllAlbums() {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setAlbums(data);
      setLoading(false);
    }
    fetchAllAlbums();
  }, []);
  useEffect(() => {
    if (selectedAlbum) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedAlbum]);

  const filteredAlbums = activeFilter === "All" 
    ? albums 
    : albums.filter(album => album.category === activeFilter);

  const openModal = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImgIndex(0);
  };

  const nextImg = () => {
    if (selectedAlbum && selectedAlbum.image_urls) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedAlbum.image_urls.length);
    }
  };

  const prevImg = () => {
    if (selectedAlbum && selectedAlbum.image_urls) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedAlbum.image_urls.length) % selectedAlbum.image_urls.length);
    }
  };

  return (
    <main className="min-h-screen bg-darkBg text-white selection:bg-brandRed selection:text-white pt-24 px-6 pb-32">
      <div className="max-w-7xl mx-auto">
                <div className="mb-12">
          <Link href="/#gallery" className="text-gray-500 font-mono text-sm hover:text-brandRed transition-colors flex items-center gap-2 mb-8 w-max">
            ← RETURN_TO_BASE
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight flex items-center gap-4">
            Visual <span className="text-brandRed">Archive.</span>
          </h1>
          <p className="text-gray-400 mt-4 font-mono text-base uppercase max-w-2xl">
            A comprehensive visual ledger of on-ground execution, networking, and community impact.
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
            [QUERYING_VISUAL_DATABASE...]
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <div 
                key={album.id} 
                onClick={() => openModal(album)}
                className="group relative w-full h-64 bg-brandGray/20 overflow-hidden brutal-border hover:border-brandRed transition-colors cursor-pointer"
              >
                {album.image_urls && album.image_urls.length > 0 ? (
                  <img 
                    src={album.image_urls[0]} 
                    alt={album.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-gray-600 flex-col gap-2">
                    <ImageIcon size={24} /> NO_IMAGES
                  </div>
                )}
                                <div className="absolute top-2 right-2 bg-black/80 text-brandRed border border-brandRed/50 px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm flex items-center gap-1 z-10">
                  <Layers size={10} /> {album.image_urls?.length || 0}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <span className="text-brandRed font-black text-[10px] uppercase tracking-widest mb-1">
                    {album.category}
                  </span>
                  <h3 className="text-white text-base md:text-lg font-black uppercase leading-tight">
                    {album.title}
                  </h3>
                </div>
              </div>
            ))}
            
            {filteredAlbums.length === 0 && (
              <div className="col-span-full py-12 text-center font-mono text-gray-500 uppercase border border-dashed border-gray-600">
                No visual records found for parameter: {activeFilter}
              </div>
            )}
          </div>
        )}
        {selectedAlbum && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-darkBg brutal-border border-brandRed flex flex-col lg:flex-row overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.2)] animate-in fade-in zoom-in-95 duration-300">
              
              <button onClick={() => setSelectedAlbum(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-brandRed text-white transition-colors brutal-border">
                <X size={20} />
              </button>
              <div className="w-full lg:w-2/3 bg-black flex flex-col relative min-h-[40vh] lg:min-h-full border-b-2 lg:border-b-0 lg:border-r-2 border-brandGray">
                                <div className="flex-1 flex items-center justify-center relative p-2 md:p-8">
                  {selectedAlbum.image_urls && selectedAlbum.image_urls.length > 0 ? (
                    <img 
                      src={selectedAlbum.image_urls[currentImgIndex]} 
                      alt={`${selectedAlbum.title} - ${currentImgIndex + 1}`} 
                      className="max-w-full max-h-[50vh] lg:max-h-[75vh] object-contain select-none" 
                    />
                  ) : (
                    <span className="font-mono text-gray-500">NO_VISUAL_DATA</span>
                  )}
                </div>
                {selectedAlbum.image_urls && selectedAlbum.image_urls.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white brutal-border hover:bg-brandRed hover:text-white transition-colors">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white brutal-border hover:bg-brandRed hover:text-white transition-colors">
                      <ChevronRight size={24} />
                    </button>
                                        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4">
                      {selectedAlbum.image_urls.map((_, idx) => (
                        <div key={idx} className={`h-1.5 transition-all duration-300 ${idx === currentImgIndex ? "w-8 bg-brandRed" : "w-2 bg-white/30"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="w-full lg:w-1/3 p-8 flex flex-col bg-darkBg">
                <span className="text-brandRed font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brandRed rounded-full animate-pulse"></span>
                  Album_{selectedAlbum.id.slice(0, 8)}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 leading-tight text-white">
                  {selectedAlbum.title}
                </h2>
                
                <div className="mb-8">
                   <span className="px-3 py-1 bg-brandGray text-white text-[10px] font-bold uppercase brutal-border">
                    {selectedAlbum.category}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm">
                  {selectedAlbum.caption}
                </p>
                {selectedAlbum.image_urls && selectedAlbum.image_urls.length > 0 && (
                  <div className="mt-auto pt-8 font-mono text-xs text-gray-500 uppercase tracking-widest text-right">
                    Image {currentImgIndex + 1} of {selectedAlbum.image_urls.length}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}