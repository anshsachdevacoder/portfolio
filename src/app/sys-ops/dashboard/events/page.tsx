"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Calendar, AlertTriangle, Database, Trash2, Edit3, X } from "lucide-react";

export default function EventsModule() {
  const [viewMode, setViewMode] = useState<"add" | "manage">("manage");
  const [events, setEvents] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fetchAllEvents = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (viewMode === "manage") fetchAllEvents();
  }, [viewMode]);
  const handleDeployEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setStatusMsg(null);
    try {
      const payload = {
        event_name: eventName,
        role: role,
        organization_name: organization,
        event_date: eventDate,
      };

      if (editId) {
        const { error } = await supabase.from('events').update(payload).eq('id', editId);
        if (error) throw error;
        setStatusMsg({ text: "EVENT LEDGER UPDATED SUCCESSFULLY", type: "success" });
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        setStatusMsg({ text: "NEW EVENT LOGGED TO DATABASE", type: "success" });
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
    if (!window.confirm("WARNING: Are you sure you want to permanently erase this event record?")) return;
    await supabase.from('events').delete().eq('id', id);
    fetchAllEvents(); 
  };

  const handleEdit = (ev: any) => {
    setEditId(ev.id);
    setEventName(ev.event_name);
    setRole(ev.role);
    setOrganization(ev.organization_name);
    setEventDate(ev.event_date);
    setViewMode("add");
  };

  const resetForm = () => {
    setEditId(null); setEventName(""); setRole(""); setOrganization(""); setEventDate("");
  };

  return (
    <div className="brutal-border bg-darkBg p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brandGray pb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Calendar className="text-brandRed" /> Events Data_Core
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
            <div className="py-12 text-center font-mono text-brandRed animate-pulse">EXTRACTING_OPERATIONAL_LOGS...</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-brandGray/30 font-mono text-xs text-gray-400 uppercase tracking-widest border-b-2 border-brandGray">
                    <th className="p-4">Event Name</th>
                    <th className="p-4 border-l border-brandGray/30">Role</th>
                    <th className="p-4 border-l border-brandGray/30">Organization</th>
                    <th className="p-4 border-l border-brandGray/30">Date</th>
                    <th className="p-4 border-l border-brandGray/30 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-sans">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-600 font-mono text-sm border-dashed border-t border-brandGray">
                        NO_EVENTS_FOUND_IN_DATABASE
                      </td>
                    </tr>
                  ) : (
                    events.map((ev) => (
                      <tr key={ev.id} className="border-b border-brandGray/30 hover:bg-brandGray/10 transition-colors group">
                        <td className="p-4 font-bold text-white group-hover:text-brandRed transition-colors">{ev.event_name}</td>
                        <td className="p-4 text-sm text-gray-300 border-l border-brandGray/30">{ev.role}</td>
                        <td className="p-4 text-sm text-gray-300 border-l border-brandGray/30">{ev.organization_name}</td>
                        <td className="p-4 font-mono text-xs text-brandRed border-l border-brandGray/30 uppercase">{ev.event_date}</td>
                        <td className="p-0 border-l border-brandGray/30">
                          <div className="flex h-full min-h-[50px]">
                            <button onClick={() => handleEdit(ev)} className="flex-1 flex justify-center items-center text-gray-500 hover:text-white hover:bg-brandGray/30 transition-colors px-2">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleDelete(ev.id)} className="flex-1 flex justify-center items-center text-gray-500 hover:text-brandRed hover:bg-red-950/30 transition-colors px-2 border-l border-brandGray/30">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {viewMode === "add" && (
        <form onSubmit={handleDeployEvent} className="space-y-6">
          {editId && (
            <div className="bg-brandRed/20 border border-brandRed p-3 text-brandRed font-mono text-xs uppercase flex justify-between items-center">
              <span>OVERWRITING EVENT RECORD_{editId.slice(0,8)}</span>
              <button type="button" onClick={() => {resetForm(); setViewMode("manage");}} className="hover:text-white"><X size={16}/></button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Event Name</label>
              <input required type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Event Name" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Assigned Role</label>
              <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Role or responsibility" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Organization / Institute</label>
              <input required type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors" placeholder="Institution Name" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-gray-400">Date / Operational Cycle</label>
              <input required type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-brandGray/20 brutal-border border-white/10 p-3 text-sm focus:outline-none focus:border-brandRed transition-colors font-mono" placeholder="Date" />
            </div>
          </div>
          <button disabled={isDeploying} type="submit" className="w-full py-5 bg-brandRed text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brandRed transition-all duration-300 disabled:opacity-50 mt-8">
            {isDeploying ? "TRANSMITTING DATA..." : editId ? "UPDATE EVENT RECORD" : "INJECT NEW EVENT"}
          </button>
        </form>
      )}
    </div>
  );
}