"use client";
import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_link: string;
  github_link: string;
  tech_stack: string[];
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10 pt-24 border-b-2 border-brandGray">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-l-4 border-brandRed pl-4">
          Deployed Projects
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">
          // Execution & Architecture
        </p>
      </div>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center font-mono text-brandRed animate-pulse">
          [LOADING_PROJECT_DATA...]
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.length === 0 ? (
            <div className="col-span-full p-8 text-center font-mono text-gray-500 border border-dashed border-gray-600">
              NO_PROJECTS_FOUND
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="group brutal-border bg-brandGray/10 flex flex-col hover:border-brandRed transition-colors">
                <div className="relative w-full h-64 bg-darkBg overflow-hidden border-b-2 border-brandGray">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-gray-600 text-xs">NO_IMAGE_DATA</div>
                  )}
                  <div className="absolute top-0 left-0 bg-brandRed text-white px-3 py-1 text-xs font-black uppercase">
                    SYS_BUILD
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black uppercase mb-3 text-white group-hover:text-brandRed transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                    {project.tech_stack?.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-black border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    {project.live_link && (
                      <a href={project.live_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 justify-center py-3 bg-white text-black font-black text-xs uppercase hover:bg-brandRed hover:text-white transition-colors">
                        <ExternalLink size={16} /> Live Deployment
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 justify-center py-3 border border-white/20 text-white font-black text-xs uppercase hover:bg-white/10 transition-colors">
                        <Star size={16} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}