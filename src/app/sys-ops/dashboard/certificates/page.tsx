"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, ShieldCheck, AlertTriangle, Database, Trash2, Edit3, Star, X } from "lucide-react";

export default function CertificatesModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [allCerts, setAllCerts] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("National");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fetchAllCerts = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    if (data) setAllCerts(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllCerts();
  }, [viewMode]);

  const handleDeployCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editId && !existingImageUrl) return setStatusMsg({ text: "ERROR: NO VISUAL DATA ATTACHED", type: "error" });

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

      const payload = {
        title,
        issuing_organization: organization,
        category,
        verification_url: verificationUrl || null,
        image_url: finalImageUrl,
      };

      if (editId) {
        const { error } = await supabase.from('certificates').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "RECORD UPDATED SUCCESSFULLY", type: "success" });
      } else {
        const { error } = await supabase.from('certificates').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "TRANSMISSION SUCCESSFUL: CREDENTIAL LOGGED", type: "success" });
      }

      resetForm();
      setViewMode("manage");
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ text: "TRANSMISSION FAILED: CHECK CONSOLE", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete this record?")) return;
    await supabase.from('certificates').delete().eq('id', id);
    fetchAllCerts(); 
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    if (!currentStatus) {
      const featuredCount = allCerts.filter(c => c.is_featured).length;
      if (featuredCount >= 6) {
        alert("MAXIMUM REACHED: You can only feature 6 certificates on the homepage. Un-feature one first.");
        return;
      }
    }
    await supabase.from('certificates').update({ is_featured: !currentStatus }).eq('id', id);
    fetchAllCerts();
  };

  const handleEdit = (cert: any) => {
    setEditId(cert.id);
    setTitle(cert.title);
    setOrganization(cert.issuing_organization);
    setCategory(cert.category);
    setVerificationUrl(cert.verification_url || "");
    setExistingImageUrl(cert.image_url);
    setFile(null);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setTitle(""); setOrganization(""); setVerificationUrl(""); setFile(null); setExistingImageUrl("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <ShieldCheck className="text-brandRed" /> Certificates Data_Core
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
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_RECORDS...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCerts.map(cert => (
                <div key={cert.id} className="brutal-border bg-brandGray/10 flex flex-col group relative">
                  <div className="w-full h-32 overflow-hidden relative border-b border-brandGray">
                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover opacity-60" />
                    <button 
                      onClick={() => handleToggleFeature(cert.id, cert.is_featured)}
                      className={`absolute top-2 left-2 p-2 brutal-border backdrop-blur-sm transition-colors ${cert.is_featured ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "bg-black/50 text-gray-400 hover:text-yellow-500"}`}
                      title={cert.is_featured ? "Featured on Home" : "Feature on Home"}
                    >
                      <Star size={14} className={cert.is_featured ? "fill-black" : ""} />
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold uppercase text-sm mb-1 line-clamp-1">{cert.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase">{cert.issuing_organization}</p>
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
              {allCerts.length === 0 && <div className="col-span-full py-8 text-center text-gray-500 font-mono">NO_RECORDS_FOUND</div>}
            </div>
          )}
        </div>
      )}
      {viewMode === "add" && (
        <form onSubmit={handleDeployCertificate} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>EDITING RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Credential Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Issuing Organization</label>
              <input required type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Classification Level</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors uppercase">
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="State">State</option>
                <option value="District">District</option>
                <option value="Inter-University">Inter-University</option>
                <option value="Intra-University">Intra-University</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Verification URL (Optional)</label>
              <input type="url" value={verificationUrl} onChange={(e) => setVerificationUrl(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Visual Evidence (Image File)</label>
            <div className="relative border-2 border-dashed border-brandGray hover:border-brandRed transition-colors bg-brandGray/10 p-8 flex flex-col items-center justify-center cursor-pointer">
              <input type={editId ? "file" : "file"} required={!editId && !existingImageUrl} accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className={`mb-2 ${file ? "text-brandRed" : "text-gray-500"}`} />
              <span className="font-mono text-xs text-center text-gray-400">
                {file ? `[ATTACHED: ${file.name}]` : editId ? "[KEEPING EXISTING IMAGE - CLICK TO REPLACE]" : "CLICK TO BROWSE OR DRAG FILE HERE"}
              </span>
            </div>
          </div>

          <button disabled={isUploading} type="submit" className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-4">
            {isUploading ? "TRANSMITTING DATA..." : editId ? "UPDATE RECORD" : "DEPLOY RECORD"}
          </button>
        </form>
      )}
    </div>
  );
}