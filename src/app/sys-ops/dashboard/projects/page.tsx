"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Briefcase, AlertTriangle, Database, Trash2, Edit3, X, ExternalLink, Code } from "lucide-react";

export default function ProjectsModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [techStack, setTechStack] = useState(""); 
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fetchAllProjects = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setAllProjects(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllProjects();
  }, [viewMode]);

  const handleDeployProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUploading(true);
    setStatusMsg(null);

    try {
      let finalImageUrl = existingImageUrl;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "portfolio_uploads"); 
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
        const cloudinaryData = await cloudinaryRes.json();
        
        if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");
        finalImageUrl = cloudinaryData.secure_url;
      }

      const techArray = techStack
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const payload = {
        title,
        description,
        live_link: liveLink || null,
        github_link: githubLink || null,
        tech_stack: techArray,
        image_url: finalImageUrl || null,
      };
      if (editId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "PROJECT ARCHITECTURE UPDATED", type: "success" });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW PROJECT DEPLOYED TO MAINNET", type: "success" });
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
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this project?")) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchAllProjects(); 
  };

  const handleEdit = (proj: any) => {
    setEditId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setLiveLink(proj.live_link || "");
    setGithubLink(proj.github_link || "");
    setTechStack(proj.tech_stack ? proj.tech_stack.join(", ") : "");
    setExistingImageUrl(proj.image_url || "");
    setFile(null);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setTitle(""); setDescription(""); setLiveLink(""); setGithubLink(""); setTechStack(""); setFile(null); setExistingImageUrl("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Briefcase className="text-brandRed" /> Projects Data_Core
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
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_PROJECT_REPOSITORIES...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {allProjects.map(proj => (
                <div key={proj.id} className="brutal-border bg-brandGray/10 flex flex-col group relative overflow-hidden hover:border-brandRed transition-colors">
                                    <div className="w-full h-40 bg-black relative border-b border-brandGray">
                    {proj.image_url ? (
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-gray-600 text-xs uppercase">No Visual Interface</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black uppercase text-xl mb-2 text-white group-hover:text-brandRed transition-colors">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mb-6 line-clamp-3 leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {proj.tech_stack?.slice(0, 4).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-darkBg border border-white/10 text-[10px] font-mono text-gray-400 uppercase">{tech}</span>
                      ))}
                      {proj.tech_stack?.length > 4 && <span className="px-2 py-1 text-[10px] font-mono text-brandRed">+{proj.tech_stack.length - 4} MORE</span>}
                    </div>
                    <div className="flex gap-4 mt-auto mb-4 border-t border-white/10 pt-4">
                      {proj.live_link && <a href={proj.live_link} target="_blank" rel="noreferrer" className="text-brandRed hover:text-white"><ExternalLink size={16} /></a>}
                      {proj.github_link && <a href={proj.github_link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white"><Code size={16} /></a>}
                    </div>
                  </div>
                  <div className="flex border-t border-brandGray">
                    <button onClick={() => handleEdit(proj)} className="flex-1 py-4 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-brandGray/30 transition-colors">
                      <Edit3 size={14} /> Edit Data
                    </button>
                    <button onClick={() => handleDelete(proj.id)} className="flex-1 py-4 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-brandRed hover:bg-red-950/30 transition-colors border-l border-brandGray">
                      <Trash2 size={14} /> Terminate
                    </button>
                  </div>
                </div>
              ))}
              {allProjects.length === 0 && <div className="col-span-full py-8 text-center text-gray-500 font-mono">NO_PROJECTS_FOUND_IN_DATABASE</div>}
            </div>
          )}
        </div>
      )}
      {viewMode === "add" && (
        <form onSubmit={handleDeployProject} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING PROJECT RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Project Code Name (Title)</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Project Name" />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Mission Parameters (Description)</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors leading-relaxed" placeholder="Detail the problem solved, architectural decisions, and final outcomes..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Live Deployment URL (Optional)</label>
              <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Source Repository URL (Optional)</label>
              <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Technology Stack (Comma Separated)</label>
            <input type="text" required value={techStack} onChange={(e) => setTechStack(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors font-mono" placeholder="separate the tech stack using comma eg: React, Node.js, PostgreSQL" />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Visual Interface (Image File - Optional)</label>
            <div className="relative border-2 border-dashed border-brandGray hover:border-brandRed transition-colors bg-brandGray/10 p-12 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className={`mb-4 ${file ? "text-brandRed" : "text-gray-500"}`} size={32} />
              <span className="font-mono text-sm text-center text-gray-400">
                {file ? `[ATTACHED: ${file.name}]` : editId && existingImageUrl ? "[KEEPING EXISTING PREVIEW - CLICK TO REPLACE]" : "CLICK TO BROWSE OR DRAG UI SCREENSHOT HERE"}
              </span>
            </div>
          </div>

          <button disabled={isUploading} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isUploading ? "UPLOADING ASSETS & INJECTING DATA..." : editId ? "OVERWRITE PROJECT RECORD" : "INITIATE PROJECT DEPLOYMENT"}
          </button>
        </form>
      )}
    </div>
  );
}