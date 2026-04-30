import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import WhatIBring from "@/components/WhatIBring";
import AtAGlance from "@/components/AtAGlance";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import EventsTable from "@/components/EventsTable";
import CertificationsPreview from "@/components/CertificationsPreview";
import Achievements from "@/components/Achievements";
import Gallery from "@/components/Gallery";             
import Testimonials from "@/components/Testimonials";    
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-darkBg text-white selection:bg-brandRed selection:text-white font-sans pt-16">
      <Navbar />
      <div id="home"><LandingHero /></div>
      <div id="about"><WhatIBring /></div>
      <div id="experience"><AtAGlance /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <div id="events"><EventsTable /></div>
      <div id="certifications"><CertificationsPreview /></div>
      <div id="achievements"><Achievements /></div>
      <div id="gallery"><Gallery /></div>
      <div id="testimonials"><Testimonials /></div>
      <ContactFooter />
    </main>
  );
}