import React from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { ExternalLink, Github, Lock, CheckCircle2 } from 'lucide-react';

export const DeploymentsSection: React.FC = () => {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-2">
          Production Architecture & Tools
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
          Live <span className="text-[#00F0FF]">Deployments</span>
        </h2>
        <p className="text-slate-400 font-mono text-sm max-w-xl mt-3">
          Scroll down to inspect production-ready defensive security scripts, high-performance web applications, and healthcare telemetry suites.
        </p>
      </div>

      {/* Stacking Project Cards Container */}
      <div className="relative pb-24">
        {PROJECTS_DATA.map((project, idx) => {
          // Offsets for sticky stacking effect
          const topOffset = 100 + idx * 25;

          return (
            <article
              key={project.id}
              className="sticky rounded-3xl p-8 sm:p-12 mb-10 bg-[#050914] border border-[#00F0FF]/25 border-t-2 border-t-[#00F0FF] shadow-[0_-20px_50px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden transition-all duration-300"
              style={{
                top: `${topOffset}px`,
                zIndex: idx + 1,
              }}
            >
              {/* Background index number watermark */}
              <div className="absolute right-8 top-4 font-mono font-black text-6xl sm:text-8xl text-white/[0.04] select-none pointer-events-none">
                {project.index}
              </div>

              {/* Left Column: Project Details */}
              <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono font-bold text-[#7ed957] px-2 py-0.5 rounded bg-[#7ed957]/10 border border-[#7ed957]/20">
                    DEPLOYMENT #{project.index}
                  </span>
                  {project.isPrivate && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Lock className="w-3 h-3 text-[#ffb423]" />
                      <span>Enterprise Restricted</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-4">
                  {project.title}
                </h3>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono text-[#00F0FF] bg-[#00F0FF]/5 border border-[#00F0FF]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Metrics / Architecture highlights */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-[#02040A] border border-white/5 font-mono text-xs">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-slate-400 text-[10px] uppercase tracking-wider">{m.label}</div>
                        <div className="text-white font-bold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber flex items-center gap-2"
                      onClick={() => soundFx.playTick(1200, 0.03)}
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber alt flex items-center gap-2"
                      onClick={() => soundFx.playTick(1000, 0.02)}
                    >
                      <span>View on GitHub</span>
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.isPrivate && (
                    <div className="px-4 py-2 text-xs font-mono text-slate-500 border border-white/10 rounded-lg flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Proprietary / Under NDA</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Project Visual / Snapshot */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#040816] group shadow-inner flex items-center justify-center">
                {/* Visual Image with multi-layer fallback */}
                <img
                  src={project.image.replace(/^\.\/public/, '').replace(/^\/public/, '')}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 relative z-10"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // If /assets/projects/ path fails, attempt fallback to /assets/images/projects/
                    if (target.src.includes('/assets/projects/')) {
                      target.src = target.src.replace('/assets/projects/', '/assets/images/projects/');
                    }
                  }}
                />

                {/* Subtle tech grid overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-transparent opacity-50 z-20 pointer-events-none" />

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#010308]/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300 z-30 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7ed957]" />
                  <span>Verified Architecture</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
