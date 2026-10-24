import React, { useState, useEffect } from 'react';
import { CyberPreloader } from './components/CyberPreloader';
import { InteractiveBackground } from './components/InteractiveBackground';
import { Navbar } from './components/Navbar';
import { HeaderHero } from './components/HeaderHero';
import { SkillsSection } from './components/SkillsSection';
import { DeploymentsSection } from './components/DeploymentsSection';
import { ResearchSection } from './components/ResearchSection';
import { DefenseGlobe3D } from './components/DefenseGlobe3D';
import { ExperienceSection } from './components/ExperienceSection';
import { CertificationsSection } from './components/CertificationsSection';
import { Footer } from './components/Footer';
import { FixedUtilities } from './components/FixedUtilities';
import { DefconOverlay } from './components/DefconOverlay';
import { ProductsBlogsModal } from './components/ProductsBlogsModal';
import { SpiralCanvas } from './components/SpiralCanvas';
import { calculateScrollProgress } from './utils/math';

export default function App() {
  // Ultra-mode autostart bypass support
  const isAutoStart = typeof window !== 'undefined' && window.location.search.includes('autostart=1');
  const [loading, setLoading] = useState(!isAutoStart);

  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Modals & Protocols
  const [isDefcon, setIsDefcon] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; tab: 'products' | 'blogs' }>({
    isOpen: false,
    tab: 'products',
  });

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setIsScrolled(y > 140);

      const totalH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const progress = calculateScrollProgress(y, totalH, winH);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-[#010308] text-[#F8FAFC] relative selection:bg-[#7ed957] selection:text-black ${isDefcon ? 'defcon-active' : ''}`}>
      {/* Preloader */}
      {loading && <CyberPreloader onComplete={() => setLoading(false)} />}

      {/* Top Scroll Progress Laser Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#7ed957] via-[#00F0FF] to-[#ffb423] z-[99999] shadow-[0_0_12px_#7ed957] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mouse Hovered Animated Cyber Background Canvas */}
      <InteractiveBackground isDefcon={isDefcon} />

      {/* Interactive Cursor Trail Canvas */}
      <SpiralCanvas isDefcon={isDefcon} />

      {/* Ghost-Blade Navbar */}
      <Navbar
        isScrolled={isScrolled}
        onOpenBlogs={() => setModalState({ isOpen: true, tab: 'blogs' })}
        onOpenProducts={() => setModalState({ isOpen: true, tab: 'products' })}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Header Hero with 3D Rubik's Cube */}
        <HeaderHero
          scrollY={scrollY}
          onOpenProducts={() => setModalState({ isOpen: true, tab: 'products' })}
        />

        {/* 2. Sys Capabilities (5x5 Grid with 25 Capabilities) */}
        <SkillsSection />

        {/* 3. Live Deployments (Sticky Stacking Cards) */}
        <DeploymentsSection />

        {/* 4. Published Research (Zenodo DOIs) */}
        <ResearchSection />

        {/* 5. Active Defense Mesh (3D WebGL Globe & Live Threat Feed) */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-2">
              Autonomous Infrastructure Sentinel
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
              Active <span className="text-[#00F0FF]">Defense Mesh</span>
            </h2>
          </div>
          <DefenseGlobe3D isDefcon={isDefcon} />
        </section>

        {/* 6. Career Path (Timeline with Interactive Job Details Popup) */}
        <ExperienceSection />

        {/* 7. Professional Certifications */}
        <CertificationsSection />
      </main>

      {/* 8. Footer with Massive Glitch Name */}
      <Footer />

      {/* Fixed Utilities (Sound Synthesizer, DEFCON button, Return to top) */}
      <FixedUtilities
        isScrolled={isScrolled}
        onTriggerDefcon={() => setIsDefcon(true)}
      />

      {/* DEFCON 1 Emergency Lockdown Terminal Overlay */}
      <DefconOverlay
        isActive={isDefcon}
        onDeactivate={() => setIsDefcon(false)}
      />

      {/* Products & Blogs Showcase Modal */}
      <ProductsBlogsModal
        isOpen={modalState.isOpen}
        initialTab={modalState.tab}
        onClose={() => setModalState({ isOpen: false, tab: 'products' })}
      />
    </div>
  );
}
