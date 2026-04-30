"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
type Event = {
  id: string;
  event_name: string;
  role: string;
  organization_name: string;
  event_date: string;
};

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <section id="events" className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10 pt-24">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-l-4 border-brandRed pl-4">
          Events Organized
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
          // Operational Leadership Record
        </p>
      </div>

      <div className="w-full overflow-x-auto brutal-border bg-brandGray/10 backdrop-blur-sm">
        {loading ? (
          <div className="p-8 text-center font-mono text-brandRed animate-pulse">
            [ACCESSING_EVENT_LOGS...]
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-brandGray/50 font-mono text-xs text-gray-400 uppercase tracking-widest border-b-2 border-brandGray">
                <th className="p-4 w-1/3">Event Name</th>
                <th className="p-4 border-l border-brandGray/30">Assigned Role</th>
                <th className="p-4 border-l border-brandGray/30">Organization</th>
                <th className="p-4 border-l border-brandGray/30">Date / Cycle</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-600 font-mono text-sm border-dashed border-t border-brandGray">
                    NO_EVENTS_FOUND_IN_DATABASE
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr 
                    key={event.id} 
                    className="border-b border-brandGray/30 hover:bg-brandRed/10 transition-colors group"
                  >
                    <td className="p-4 font-bold text-white group-hover:text-brandRed transition-colors">
                      {event.event_name}
                    </td>
                    <td className="p-4 text-sm text-gray-300 border-l border-brandGray/30">
                      {event.role}
                    </td>
                    <td className="p-4 text-sm text-gray-300 border-l border-brandGray/30">
                      {event.organization_name}
                    </td>
                    <td className="p-4 font-mono text-xs text-brandRed border-l border-brandGray/30 uppercase">
                      {event.event_date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}