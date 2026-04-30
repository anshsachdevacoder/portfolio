"use client";
import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "events", label: "Events" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-darkBg/90 backdrop-blur-md border-b-2 border-brandGray">
        <div className="max-w-[100vw] mx-auto px-4 h-16 flex items-center justify-between overflow-hidden">
                    <div className="font-black tracking-widest uppercase text-lg shrink-0 mr-6 text-white cursor-pointer" onClick={() => scrollToSection("home")}>
            ANSH<span className="text-brandRed">.EXE</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar flex-nowrap">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 py-2 border-b-2 ${
                  activeSection === item.id
                    ? "text-brandRed border-brandRed"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-4">
            <a
              href="/resume.pdf" 
              download
              className="hidden md:flex items-center gap-2 brutal-border bg-brandRed text-white px-4 py-2 text-xs font-bold uppercase hover:bg-white hover:text-brandRed transition-colors"
            >
              <Download size={14} /> Resume
            </a>
            
            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-darkBg pt-20 px-6 flex flex-col h-screen overflow-y-auto pb-10">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-2xl font-black uppercase tracking-widest border-l-4 pl-4 transition-all ${
                  activeSection === item.id
                    ? "text-brandRed border-brandRed"
                    : "text-gray-500 border-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="/resume.pdf"
              download
              className="mt-8 flex justify-center items-center gap-2 brutal-border bg-brandRed text-white p-4 text-lg font-black uppercase w-full"
            >
              <Download size={20} /> Download Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}