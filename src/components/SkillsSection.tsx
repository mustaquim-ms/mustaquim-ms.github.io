import React, { useState } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { getSkillStrokeOffset } from '../utils/math';
import { soundFx } from '../utils/audio';
import {
  Laptop,
  Cloud,
  Network,
  Settings,
  Shield,
  Terminal,
  Server,
  Activity,
  Database,
  Cpu,
  Code,
  Fingerprint,
  FileCode,
  Workflow,
  Crosshair,
  Lock,
  HardDrive,
  Archive,
  ShieldAlert,
  PhoneCall,
  Tv,
  Eye,
  Wrench,
  Search,
  ClipboardCheck,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Laptop,
  Cloud,
  Network,
  Settings,
  Shield,
  Terminal,
  Server,
  Activity,
  Database,
  Cpu,
  Code,
  Fingerprint,
  FileCode,
  Workflow,
  Crosshair,
  Lock,
  HardDrive,
  Archive,
  ShieldAlert,
  PhoneCall,
  Tv,
  Eye,
  Wrench,
  Search,
  ClipboardCheck,
};

export const SkillsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Infrastructure' | 'Cybersecurity' | 'AIOps' | 'Cloud'>('All');

  const filtered = activeFilter === 'All'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === activeFilter);

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="text-xs font-mono text-[#7ed957] uppercase tracking-widest mb-2">
            5×5 Engineered Competency Matrix (25 Capabilities)
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
            Sys <span className="text-[#7ed957]">Capabilities</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050914]/80 backdrop-blur-md border border-white/10 rounded-xl">
          {(['All', 'Infrastructure', 'Cybersecurity', 'AIOps', 'Cloud'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                soundFx.playTick(1000, 0.02);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#7ed957] text-black font-bold shadow-md shadow-[#7ed957]/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5x5 Grid Layout (5 columns on large desktop, responsive on smaller viewports) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {filtered.map((skill) => {
          const IconComp = iconMap[skill.iconName] || Terminal;
          const strokeOffset = getSkillStrokeOffset(skill.percentage, 42);

          return (
            <div
              key={skill.id}
              className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#050914]/70 backdrop-blur-sm border border-white/10 hover:border-[#7ed957]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,240,255,0.12)] relative overflow-hidden"
              onMouseEnter={() => soundFx.playTick(1100, 0.012)}
            >
              {/* Circular Gauge Ring */}
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#cap-gradient)"
                    strokeWidth="5"
                    strokeDasharray="263.89"
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Percentage Text (default) */}
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-black text-white group-hover:scale-125 group-hover:opacity-0 transition-all duration-300">
                  {skill.percentage}
                  <span className="text-[10px] text-[#7ed957] font-semibold -mt-2">%</span>
                </div>

                {/* Hover Icon Reveal */}
                <div className="absolute inset-0 flex items-center justify-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 text-[#ffb423]">
                  <IconComp className="w-8 h-8 drop-shadow-[0_0_15px_rgba(255,180,35,0.6)]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-[#ffb423] transition-colors mb-2 line-clamp-2 min-h-[32px] flex items-center justify-center">
                {skill.name}
              </h3>

              {/* Tags */}
              <div className="flex flex-col gap-0.5 text-[10px] font-mono text-slate-400">
                {skill.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="truncate max-w-[140px]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Corner tech notch */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#7ed957]/30" />
            </div>
          );
        })}
      </div>

      {/* SVG Gradient Definition */}
      <svg className="w-0 h-0 absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="cap-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ed957" />
            <stop offset="100%" stopColor="#ffb423" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};
