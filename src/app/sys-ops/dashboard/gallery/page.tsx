"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Image as ImageIcon, AlertTriangle, Database, Trash2, Edit3, X, Star, Layers } from "lucide-react";

export default function GalleryModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [albums, setAlbums] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Networking");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchAllAlbums = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setAlbums(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllAlbums();
  }, [viewMode]);

  const handleDeployAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && !editId && existingImageUrls.length === 0) {
      return setStatusMsg({ text: "ERROR: VISUAL DATA REQUIRED", type: "error" });
    }

    setIsUploading(true);
    setStatusMsg(null);

    try {
      let finalImageUrls = existingImageUrls;

      if (files.length > 0) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "portfolio_uploads"); 
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error("Cloudinary upload failed");
          return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/");
        });
        finalImageUrls = await Promise.all(uploadPromises);
      }

      const payload = {
        title,
        caption,
        category,
        image_urls: finalImageUrls,
      };

      if (editId) {
        const { error } = await supabase.from('gallery').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "ALBUM ARCHIVE UPDATED", type: "success" });
      } else {
        const { error } = await supabase.from('gallery').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW ALBUM DEPLOYED TO GALLERY", type: "success" });
      }

      resetForm();
      setViewMode("manage");
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ text: "DEPLOYMENT FAILED: CHECK CONSOLE", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: Permanently delete this album?")) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchAllAlbums(); 
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    if (!currentStatus) {
      const featuredCount = albums.filter(a => a.is_featured).length;
      if (featuredCount >= 4) { 
        alert("MAXIMUM REACHED: You can only feature 4 albums on the homepage preview.");
        return;
      }
    }
    await supabase.from('gallery').update({ is_featured: !currentStatus }).eq('id', id);
    fetchAllAlbums();
  };

  const handleEdit = (album: any) => {
    setEditId(album.id);
    setTitle(album.title || "");
    setCaption(album.caption || "");
    setCategory(album.category || "Networking");
    setExistingImageUrls(album.image_urls || []);
    setFiles([]);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setTitle(""); setCaption(""); setCategory("Networking"); setFiles([]); setExistingImageUrls([]);
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Layers className="text-brandRed" /> Gallery Data_Core
        </h2>
        <div className="flex bg-brandGray/20 brutal-border p-1">
          <button onClick={() => { setViewMode("manage"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "manage" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Database size={14} className="inline mr-2 mb-0.5" /> Manage DB
          </button>
          <button onClick={() => { setViewMode("add"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "add" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Upload size={14} className="inline mr-2 mb-0.5" /> Upload Album
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 mb-6 font-mono text-xs uppercase flex items-center gap-2 ${statusMsg.type === "success" ? "bg-green-950/50 text-green-500" : "bg-red-950/50 text-brandRed"}`}>
          <AlertTriangle size={16} /> {statusMsg.text}
        </div>
      )}

      {viewMode === "manage" && (
        <div>
          {isFetching ? (
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_ALBUM_ARCHIVES...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map(album => (
                <div key={album.id} className="brutal-border bg-brandGray/10 flex flex-col group relative overflow-hidden">
                                    <div className="w-full h-48 bg-black relative border-b border-brandGray">
                    {album.image_urls && album.image_urls.length > 0 ? (
                      <img src={album.image_urls[0]} alt={album.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center font-mono text-gray-500">NO_IMAGES</div>
                    )}
                                        <button 
                      onClick={() => handleToggleFeature(album.id, album.is_featured)}
                      className={`absolute top-2 left-2 p-2 brutal-border backdrop-blur-sm transition-colors z-20 ${album.is_featured ? "bg-yellow-500 text-black border-yellow-500" : "bg-black/50 text-gray-400 hover:text-yellow-500"}`}
                      title="Feature on Homepage"
                    >
                      <Star size={14} className={album.is_featured ? "fill-black" : ""} />
                    </button>
                    <div className="absolute top-2 right-2 bg-black/80 text-brandRed border border-brandRed/50 px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm flex items-center gap-1">
                      <Layers size={10} /> {album.image_urls?.length || 0}
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <h3 className="font-bold uppercase text-sm mb-1 line-clamp-1">{album.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase">{album.category}</p>
                  </div>

                  <div className="flex border-t border-brandGray">
                    <button onClick={() => handleEdit(album)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-brandGray/30 transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(album.id)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-brandRed hover:bg-red-950/30 transition-colors border-l border-brandGray">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {albums.length === 0 && <div className="col-span-full py-8 text-center text-gray-500 font-mono">NO_ALBUMS_FOUND</div>}
            </div>
          )}
        </div>
      )}

      {viewMode === "add" && (
        <form onSubmit={handleDeployAlbum} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING ALBUM_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Album Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="e.g. Smart India Hackathon Finals" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Classification Tag</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors uppercase font-bold">
                <option value="Speaking">Speaking & Leadership</option>
                <option value="Networking">Networking</option>
                <option value="Hackathons">Hackathons & Tech</option>
                <option value="Awards">Awards & Honors</option>
                <option value="Community">Community Events</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Context / Caption</label>
              <input type="text" required value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Brief description of the event..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Visual Assets (Select Multiple Images)</label>
            <div className="relative border-2 border-dashed border-brandGray hover:border-brandRed transition-colors bg-brandGray/10 p-12 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className={`mb-4 ${files.length > 0 ? "text-brandRed" : "text-gray-500"}`} size={32} />
              <span className="font-mono text-sm text-center text-gray-400">
                {files.length > 0 ? `[ATTACHED: ${files.length} FILES]` : editId && existingImageUrls.length > 0 ? `[KEEPING ${existingImageUrls.length} EXISTING IMAGES - UPLOAD NEW TO REPLACE]` : "CLICK OR DRAG MULTIPLE IMAGES HERE"}
              </span>
            </div>
          </div>

          <button disabled={isUploading} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isUploading ? "OPTIMIZING & TRANSMITTING BATCH..." : editId ? "UPDATE ALBUM ARCHIVE" : "INJECT ALBUM INTO GALLERY"}
          </button>
        </form>
      )}
    </div>
  );
}   