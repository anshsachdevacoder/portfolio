"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, MessageSquare, AlertTriangle, Database, Trash2, Edit3, X, Quote } from "lucide-react";

export default function TestimonialsModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fetchAllTestimonials = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllTestimonials();
  }, [viewMode]);

  const handleDeployTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setStatusMsg(null);

    try {
      let finalAvatarUrl = existingAvatarUrl;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "portfolio_uploads"); 
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
        const cloudinaryData = await cloudinaryRes.json();
        
        if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");
                finalAvatarUrl = cloudinaryData.secure_url.replace("/upload/", "/upload/c_fill,g_face,w_200,h_200,f_auto,q_auto/");
      }

      const payload = {
        name,
        role,
        organization: organization || null,
        content,
        avatar_url: finalAvatarUrl || null,
      };

      if (editId) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "ENDORSEMENT LOG UPDATED", type: "success" });
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW ENDORSEMENT DEPLOYED", type: "success" });
      }

      resetForm();
      setViewMode("manage");
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ text: "DEPLOYMENT FAILED: CHECK CONSOLE", type: "error" });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently erase this endorsement?")) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchAllTestimonials(); 
  };

  const handleEdit = (testim: any) => {
    setEditId(testim.id);
    setName(testim.name);
    setRole(testim.role);
    setOrganization(testim.organization || "");
    setContent(testim.content);
    setExistingAvatarUrl(testim.avatar_url || "");
    setFile(null);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setName(""); setRole(""); setOrganization(""); setContent(""); setFile(null); setExistingAvatarUrl("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <MessageSquare className="text-brandRed" /> Endorsements Data_Core
        </h2>
        <div className="flex bg-brandGray/20 brutal-border p-1">
          <button onClick={() => { setViewMode("manage"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "manage" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Database size={14} className="inline mr-2 mb-0.5" /> Manage DB
          </button>
          <button onClick={() => { setViewMode("add"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "add" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Upload size={14} className="inline mr-2 mb-0.5" /> Inject New
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 mb-6 font-mono text-xs uppercase flex items-center gap-2 ${statusMsg.type === "success" ? "bg-green-950/50 text-green-500 border border-green-500/50" : "bg-red-950/50 text-brandRed border border-brandRed/50"}`}>
          <AlertTriangle size={16} /> {statusMsg.text}
        </div>
      )}
      {viewMode === "manage" && (
        <div>
          {isFetching ? (
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_ENDORSEMENT_LOGS...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testimonials.map((testim) => (
                <div key={testim.id} className="brutal-border bg-brandGray/10 flex flex-col group hover:border-brandRed transition-colors relative">
                  <Quote size={32} className="text-brandRed/20 absolute top-4 right-4" />
                  
                  <div className="p-6 flex-1 z-10">
                    <p className="text-sm text-gray-300 italic leading-relaxed mb-6">"{testim.content}"</p>
                    
                    <div className="flex items-center gap-4 border-t border-brandGray/50 pt-4">
                      <div className="w-12 h-12 bg-darkBg border border-brandRed flex items-center justify-center shrink-0 overflow-hidden">
                        {testim.avatar_url ? (
                          <img src={testim.avatar_url} alt={testim.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-brandRed font-black uppercase text-lg">{testim.name.charAt(0)}</span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm group-hover:text-brandRed transition-colors">{testim.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">
                          {testim.role} {testim.organization && `// ${testim.organization}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-brandGray">
                    <button onClick={() => handleEdit(testim)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-brandGray/30 transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(testim.id)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-brandRed hover:bg-red-950/30 transition-colors border-l border-brandGray">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && <div className="col-span-full py-8 text-center text-gray-500 font-mono border-dashed border border-brandGray">NO_ENDORSEMENTS_FOUND</div>}
            </div>
          )}
        </div>
      )}

      {viewMode === "add" && (
        <form onSubmit={handleDeployTestimonial} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING ENDORSEMENT RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Identity (Name)</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Name" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Position / Title</label>
              <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Position or Title" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Organization (Optional)</label>
            <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Organization" />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Debrief Statement (Testimonial Quote)</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors leading-relaxed" placeholder="Enter the exact endorsement text here..." />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Avatar / Headshot (Optional)</label>
            <div className="relative border-2 border-dashed border-brandGray hover:border-brandRed transition-colors bg-brandGray/10 p-8 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className={`mb-2 ${file ? "text-brandRed" : "text-gray-500"}`} />
              <span className="font-mono text-xs text-center text-gray-400">
                {file ? `[ATTACHED: ${file.name}]` : editId && existingAvatarUrl ? "[KEEPING EXISTING AVATAR - CLICK TO REPLACE]" : "CLICK TO BROWSE OR DRAG HEADSHOT HERE"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-brandRed mt-2 uppercase text-center tracking-widest">
              // System will auto-detect faces and crop to a square format.
            </p>
          </div>

          <button disabled={isDeploying} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isDeploying ? "TRANSMITTING DATA..." : editId ? "UPDATE ENDORSEMENT" : "INJECT ENDORSEMENT LOG"}
          </button>
        </form>
      )}
    </div>
  );
}