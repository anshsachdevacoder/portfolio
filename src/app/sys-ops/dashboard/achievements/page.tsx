"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trophy, AlertTriangle, Database, Trash2, Edit3, X } from "lucide-react";

export default function AchievementsModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fetchAllAchievements = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
    if (data) setAchievements(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllAchievements();
  }, [viewMode]);
  const handleDeployAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setStatusMsg(null);

    try {
      const payload = {
        title,
        date,
        description,
      };

      if (editId) {
        const { error } = await supabase.from('achievements').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "MILESTONE LOG UPDATED SUCCESSFULLY", type: "success" });
      } else {
        const { error } = await supabase.from('achievements').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW MILESTONE LOGGED TO DATABASE", type: "success" });
      }

      resetForm();
      setViewMode("manage");
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ text: "TRANSMISSION FAILED: CHECK CONSOLE", type: "error" });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently erase this milestone?")) return;
    await supabase.from('achievements').delete().eq('id', id);
    fetchAllAchievements(); 
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setDescription(item.description);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setTitle(""); setDate(""); setDescription("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Trophy className="text-brandRed" /> Achievements Data_Core
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
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_MILESTONE_LOGS...</div>
          ) : (
            <div className="space-y-4">
              {achievements.length === 0 ? (
                <div className="p-8 text-center text-gray-600 font-mono text-sm border-dashed border border-brandGray">
                  NO_MILESTONES_FOUND_IN_DATABASE
                </div>
              ) : (
                achievements.map((item) => (
                  <div key={item.id} className="brutal-border bg-brandGray/10 flex flex-col md:flex-row group hover:border-brandRed transition-colors">
                                        <div className="p-6 flex-1">
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="font-mono text-xs text-brandRed font-bold uppercase tracking-widest shrink-0">
                          {item.date}
                        </span>
                        <h3 className="font-black text-white uppercase text-lg group-hover:text-brandRed transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 md:w-5/6">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex md:flex-col border-t md:border-t-0 md:border-l border-brandGray w-full md:w-32 shrink-0">
                      <button onClick={() => handleEdit(item)} className="flex-1 py-3 md:py-0 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-brandGray/30 transition-colors border-r md:border-r-0 md:border-b border-brandGray">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="flex-1 py-3 md:py-0 flex justify-center items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-brandRed hover:bg-red-950/30 transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
      {viewMode === "add" && (
        <form onSubmit={handleDeployAchievement} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING MILESTONE RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Milestone Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Title" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Timestamp / Date</label>
              <input required type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors font-mono" placeholder="Date or timestamp" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-gray-400">Event Debrief (Description)</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors leading-relaxed" placeholder="Explain the achievement, impact, or role..." />
          </div>

          <button disabled={isDeploying} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isDeploying ? "TRANSMITTING DATA..." : editId ? "UPDATE MILESTONE RECORD" : "INJECT NEW MILESTONE"}
          </button>
        </form>
      )}
    </div>
  );
}