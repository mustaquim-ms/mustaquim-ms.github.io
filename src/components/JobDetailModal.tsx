import React, { useEffect } from 'react';
import { CareerExperience } from '../types/portfolio';
import { soundFx } from '../utils/audio';
import { X, Building2, Calendar, CheckCircle2, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface JobDetailModalProps {
  job: CareerExperience | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (job) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={() => {
        soundFx.playTick(700, 0.02);
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#050914] border border-[#00F0FF]/40 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 sm:px-8 py-6 border-b border-white/10 bg-[#080d1a]/90 relative">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF88] px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>{job.period}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                <Building2 className="w-4 h-4 text-[#ffb423]" />
                <span className="font-bold">{job.company}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {job.role}
            </h3>
          </div>

          <button
            onClick={() => {
              soundFx.playTick(700, 0.02);
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Key Impact Card */}
          {job.keyHighlight && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#7ed957]/10 via-[#00F0FF]/5 to-transparent border border-[#7ed957]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#7ed957] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono text-[#7ed957] uppercase tracking-wider font-bold mb-1">
                  Core Operational Milestone
                </div>
                <div className="text-sm font-mono text-white leading-relaxed">
                  {job.keyHighlight}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Responsibilities List */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <span>Executed Responsibilities & Operations ({job.responsibilities.length})</span>
            </div>

            <div className="space-y-3">
              {job.responsibilities.map((resp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#02040A] border border-white/5 hover:border-white/15 transition-colors flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#7ed957] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                    {resp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          {job.techStack && job.techStack.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                <Layers className="w-4 h-4 text-[#ffb423]" />
                <span>Associated Environments & Tooling</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg text-xs font-mono text-slate-200 bg-white/5 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-[#080d1a] flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Esc to dismiss</span>
          <button
            onClick={() => {
              soundFx.playTick(700, 0.02);
              onClose();
            }}
            className="btn-cyber text-xs px-5 py-2"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
