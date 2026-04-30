"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { X, ChevronLeft, ChevronRight, Layers } from "lucide-react";

type Album = {
  id: string;
  title: string;
  caption: string;
  category: string;
  image_urls: string[];
};

export default function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Carousel State
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    async function fetchGalleryPreview() {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_featured', true) // Only fetch featured for the homepage
        .order('created_at', { ascending: false })
        .limit(4); // Limit to 4 for a clean grid
      if (!error && data) setAlbums(data);
      setLoading(false);
    }
    fetchGalleryPreview();
  }, []);

  useEffect(() => {
    if (selectedAlbum) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedAlbum]);

  const openModal = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImgIndex(0); // Always start at the first image
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
    <section id="gallery" className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10 border-b-2 border-brandGray">
      
      {/* Header & View All Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-l-4 border-brandRed pl-4">
            Visual Archives
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
            // On-Ground Execution & Impact
          </p>
        </div>
        <Link href="/gallery" className="px-8 py-3 bg-brandGray brutal-border text-white font-bold uppercase tracking-widest text-sm hover:bg-brandRed transition-all flex items-center gap-2">
          Access Full Gallery <span className="text-brandRed group-hover:text-white">→</span>
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center font-mono text-brandRed animate-pulse">
          [DECRYPTING_VISUAL_DATA...]
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.length === 0 ? (
            <div className="col-span-full p-8 text-center font-mono text-gray-500 border border-dashed border-gray-600">
              NO_FEATURED_ALBUMS_FOUND
            </div>
          ) : (
            albums.map((album) => (
              <div 
                key={album.id} 
                onClick={() => openModal(album)}
                className="group relative w-full h-64 md:h-80 bg-brandGray/20 overflow-hidden brutal-border hover:border-brandRed transition-colors cursor-pointer"
              >
                {album.image_urls && album.image_urls.length > 0 && (
                  <img 
                    src={album.image_urls[0]} 
                    alt={album.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                )}
                
                {/* Image Count Badge */}
                <div className="absolute top-2 right-2 bg-black/80 text-brandRed border border-brandRed/50 px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm flex items-center gap-1 z-10">
                  <Layers size={10} /> {album.image_urls?.length || 0}
                </div>

                {/* Normal Hover Overlay (Slides up to reveal Title & Category) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <span className="text-brandRed font-black text-[10px] uppercase tracking-widest mb-1">
                    {album.category}
                  </span>
                  <h3 className="text-white text-lg font-black uppercase leading-tight">
                    {album.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ALBUM CAROUSEL MODAL */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-darkBg brutal-border border-brandRed flex flex-col lg:flex-row overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.2)] animate-in fade-in zoom-in-95 duration-300">
            
            <button onClick={() => setSelectedAlbum(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-brandRed text-white transition-colors brutal-border">
              <X size={20} />
            </button>

            {/* Left: Interactive Image Carousel */}
            <div className="w-full lg:w-2/3 bg-black flex flex-col relative min-h-[40vh] lg:min-h-full border-b-2 lg:border-b-0 lg:border-r-2 border-brandGray">
              
              {/* The Image */}
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

              {/* Carousel Controls (Only show if multiple images) */}
              {selectedAlbum.image_urls && selectedAlbum.image_urls.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white brutal-border hover:bg-brandRed hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white brutal-border hover:bg-brandRed hover:text-white transition-colors">
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Indicator Dots */}
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4">
                    {selectedAlbum.image_urls.map((_, idx) => (
                      <div key={idx} className={`h-1.5 transition-all duration-300 ${idx === currentImgIndex ? "w-8 bg-brandRed" : "w-2 bg-white/30"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: Album Details */}
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

              {/* Progress counter at bottom */}
              {selectedAlbum.image_urls && selectedAlbum.image_urls.length > 0 && (
                <div className="mt-auto pt-8 font-mono text-xs text-gray-500 uppercase tracking-widest text-right">
                  Image {currentImgIndex + 1} of {selectedAlbum.image_urls.length}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}