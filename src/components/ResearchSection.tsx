import React from 'react';
import { RESEARCH_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { BookOpen, ArrowUpRight, Award } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  return (
    <section id="research" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <div className="text-xs font-mono text-[#ffb423] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ffb423]" />
            <span>Academic & Scientific Publications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
            Published <span className="text-[#ffb423]">Research</span>
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Archived with permanent Zenodo DOIs
        </div>
      </div>

      {/* Hologram Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESEARCH_DATA.map((paper) => (
          <a
            key={paper.id}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#050914] border border-white/10 border-t-2 border-t-[#7ed957] hover:border-[#7ed957] hover:-translate-y-2 transition-all duration-300 shadow-xl overflow-hidden no-underline"
            onClick={() => soundFx.playTick(1300, 0.03)}
          >
            {/* Hologram grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            <div>
              <div className="inline-block px-2.5 py-1 rounded bg-[#B026FF]/10 border border-[#B026FF]/30 text-[#d8b4fe] text-xs font-mono mb-4 uppercase">
                {paper.badge}
              </div>

              <h3 className="text-lg font-bold font-mono text-white group-hover:text-[#7ed957] transition-colors leading-snug mb-4">
                {paper.title}
              </h3>

              <p className="text-slate-400 font-mono text-xs leading-relaxed mb-6">
                {paper.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 font-semibold">{paper.doi || 'Zenodo Open Access'}</span>
              <span className="flex items-center gap-1 text-[#7ed957] group-hover:translate-x-1 transition-transform">
                <span>Access Paper</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
