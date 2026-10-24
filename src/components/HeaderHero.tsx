import React from 'react';
import { RubiksCube3D } from './RubiksCube3D';
import { soundFx } from '../utils/audio';
import { ShieldCheck, FileDown, ArrowRight, Package, Terminal } from 'lucide-react';

interface HeaderHeroProps {
  scrollY: number;
  onOpenProducts: () => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({ scrollY, onOpenProducts }) => {
  return (
    <section
      id="about"
      className="relative min-h-[92vh] pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Background cyber grid & ambient lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="w-full h-full opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7ed957]/10 rounded-full blur-[140px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & Action Area */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050914] border border-[#7ed957]/30 text-xs font-mono text-[#7ed957] mb-6 shadow-[0_0_15px_rgba(126,217,87,0.15)]">
            <ShieldCheck className="w-4 h-4 text-[#7ed957]" />
            <span>IT Infrastructure Engineer & Cyber Operations</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08] mb-6 font-mono">
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.85)' }}>
              Building Secure,
            </span>
            <br />
            <span className="text-white">Cyber-Resilient &</span>
            <br />
            <span className="text-[#7ed957] drop-shadow-[0_0_35px_rgba(126,217,87,0.5)]">
              Reliable Systems.
            </span>
          </h1>

          {/* Subtitle / Bio */}
          <p className="text-slate-300 text-base sm:text-lg font-mono leading-relaxed max-w-2xl border-l-2 border-[#ffb423] pl-4 py-1 mb-8">
            Specializing in combining modern defensive cybersecurity, self-healing AIOps models, and enterprise IT strategy. Focused on architecting zero-trust infrastructure that maintains uptime, protects telemetry, and scales reliably.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#projects"
              className="btn-cyber flex items-center gap-2"
              onClick={() => soundFx.playTick(1000, 0.03)}
            >
              <span>View Deployments</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/product.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playTick(1100, 0.03)}
              className="btn-cyber alt flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#ffb423]" />
              <span>Digital Storefront</span>
            </a>

            <a
              href="mailto:mustaquimmahmad@gmail.com"
              className="px-4 py-2 text-xs font-mono font-bold tracking-wider text-slate-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => soundFx.playTick(750, 0.02)}
            >
              <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Quick Dispatch</span>
            </a>
          </div>

          {/* Quantitative Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-white/10 font-mono">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">500+</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Active Nodes</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#7ed957]">99.98%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Uptime Rate</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#00F0FF]">3 Papers</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Zenodo DOI</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#ffb423]">Zero-Trust</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Architecture</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Rubik's Cube with Quantum Core */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <RubiksCube3D scrollY={scrollY} />
        </div>
      </div>
    </section>
  );
};
