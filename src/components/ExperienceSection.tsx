import React, { useState } from 'react';
import { CAREER_DATA } from '../data/portfolioData';
import { CareerExperience } from '../types/portfolio';
import { JobDetailModal } from './JobDetailModal';
import { soundFx } from '../utils/audio';
import { Briefcase, Building2, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<CareerExperience | null>(null);

  const handleOpenJob = (job: CareerExperience) => {
    soundFx.playChime(620, 0.15);
    setSelectedJob(job);
  };

  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <div className="text-xs font-mono text-[#00FF88] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#00FF88]" />
            <span>Operational Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
            Career <span className="text-[#00FF88]">Path</span>
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Click any role to inspect detailed responsibilities & operations
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-gradient space-y-10 before:absolute before:top-0 before:bottom-0 before:left-[-2px] before:w-[2px] before:bg-gradient-to-b before:from-[#7ed957] before:via-[#00F0FF] before:to-transparent">
        {CAREER_DATA.map((exp, idx) => (
          <div
            key={exp.id}
            onClick={() => handleOpenJob(exp)}
            className="group relative flex flex-col sm:flex-row sm:items-start gap-4 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => soundFx.playTick(900 + idx * 50, 0.015)}
          >
            {/* Glowing Node Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-[#010308] border-2 border-[#7ed957] shadow-[0_0_12px_rgba(126,217,87,0.8)] group-hover:scale-125 group-hover:bg-[#7ed957] transition-all duration-300" />

            {/* Content Card with hover elevation */}
            <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#050914]/80 backdrop-blur-md border border-white/10 group-hover:border-[#00F0FF]/50 group-hover:shadow-[0_15px_35px_rgba(0,240,255,0.12)] transition-all duration-300 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF88] px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20">
                  <Calendar className="w-3 h-3" />
                  <span>{exp.period}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-[#ffb423]" />
                  <span className="text-slate-300 font-semibold">{exp.company}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                {exp.role}
              </h3>

              <p className="text-slate-300 font-mono text-sm leading-relaxed mb-4">
                {exp.description}
              </p>

              {/* Action Prompt */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#7ed957]" />
                  <span>{exp.responsibilities.length} verified operational duties</span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#7ed957] group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pop up Modal showing full responsibilities */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </section>
  );
};
