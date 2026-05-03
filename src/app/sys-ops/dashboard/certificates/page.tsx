"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Award, AlertTriangle, Database, Trash2, Edit3, X } from "lucide-react";

export default function CertificationsModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [certs, setCerts] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("National");
  const [organization, setOrganization] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchAllCerts = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    if (data) setCerts(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllCerts();
  }, [viewMode]);

  const handleDeployCert = async (e: React.FormEvent) => {
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
        
        finalImageUrl = cloudinaryData.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
      }

      const payload = {
        title,
        category,
        issuing_organization: organization,
        verification_url: verificationUrl || null,
        image_url: finalImageUrl || null,
      };

      if (editId) {
        const { error } = await supabase.from('certificates').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "CERTIFICATION ARCHIVE UPDATED", type: "success" });
      } else {
        const { error } = await supabase.from('certificates').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW CERTIFICATION DEPLOYED", type: "success" });
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
    if (!window.confirm("WARNING: Permanently delete this certification?")) return;
    await supabase.from('certificates').delete().eq('id', id);
    fetchAllCerts(); 
  };

  const handleEdit = (cert: any) => {
    setEditId(cert.id);
    setTitle(cert.title || "");
    setCategory(cert.category || "National");
    setOrganization(cert.issuing_organization || "");
    setVerificationUrl(cert.verification_url || "");
    setExistingImageUrl(cert.image_url || "");
    setFile(null);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setTitle(""); setCategory("National"); setOrganization(""); setVerificationUrl(""); setFile(null); setExistingImageUrl("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Award className="text-brandRed" /> Certifications Data_Core
        </h2>
        <div className="flex bg-brandGray/20 brutal-border p-1">
          <button onClick={() => { setViewMode("manage"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "manage" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Database size={14} className="inline mr-2 mb-0.5" /> Manage DB
          </button>
          <button onClick={() => { setViewMode("add"); resetForm(); setStatusMsg(null); }} className={`px-6 py-2 text-xs font-bold uppercase ${viewMode === "add" ? "bg-brandRed text-white" : "text-gray-400 hover:text-white"}`}>
            <Upload size={14} className="inline mr-2 mb-0.5" /> Upload New
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
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_CERTIFICATE_ARCHIVES...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map(cert => (
                <div key={cert.id} className="brutal-border bg-brandGray/10 flex flex-col group relative overflow-hidden">
                  <div className="w-full h-40 bg-black relative border-b border-brandGray flex items-center justify-center overflow-hidden">
                    {cert.image_url ? (
                      <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="font-mono text-gray-500">NO_VISUAL_DATA</span>
                    )}
                    <div className="absolute top-2 right-2 bg-black/80 text-brandRed border border-brandRed/50 px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm">
                      {cert.category}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold uppercase text-sm mb-1 line-clamp-2">{cert.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase">ORG: {cert.issuing_organization}</p>
                  </div>
                  <div className="flex border-t border-brandGray">
                    <button onClick={() => handleEdit(cert)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-brandGray/30 transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-brandRed hover:bg-red-950/30 transition-colors border-l border-brandGray">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {certs.length === 0 && <div className="col-span-full py-8 text-center text-gray-500 font-mono">NO_CERTIFICATES_FOUND</div>}
            </div>
          )}
        </div>
      )}

      {viewMode === "add" && (
        <form onSubmit={handleDeployCert} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Certification Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Title" />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Classification Tier</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors uppercase font-bold">
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="State">State</option>
                <option value="Inter-University">Inter-University</option>
                <option value="Intra-University">Intra-University</option>
                <option value="Workshop">Workshop</option>
                <option value="Courses">Courses</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Issuing Organization</label>
              <input required type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="organization" />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Verification URL (Optional)</label>
              <input type="url" value={verificationUrl} onChange={(e) => setVerificationUrl(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-4 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Visual Evidence (Image File)</label>
            <div className="relative border-2 border-dashed border-brandGray hover:border-brandRed transition-colors bg-brandGray/10 p-12 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className={`mb-4 ${file ? "text-brandRed" : "text-gray-500"}`} size={32} />
              <span className="font-mono text-sm text-center text-gray-400">
                {file ? `[ATTACHED: ${file.name}]` : editId && existingImageUrl ? "[KEEPING EXISTING IMAGE - CLICK TO REPLACE]" : "CLICK TO BROWSE OR DRAG IMAGE HERE"}
              </span>
            </div>
          </div>

          <button disabled={isUploading} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isUploading ? "OPTIMIZING & TRANSMITTING..." : editId ? "UPDATE RECORD" : "INJECT INTO DATABASE"}
          </button>
        </form>
      )}
    </div>
  );
}