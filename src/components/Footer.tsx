import React from 'react';
import { soundFx } from '../utils/audio';
import { Linkedin, Github, Mail, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="pt-24 pb-12 px-6 max-w-7xl mx-auto border-t border-white/10 mt-20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 relative z-10">
        <div>
          <h3 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white mb-6">
            Start A{' '}
            <span className="text-[#7ed957] font-serif italic font-normal">
              Conversation.
            </span>
          </h3>
          <p className="text-slate-400 font-mono text-sm max-w-md mb-8">
            Available for mission-critical IT infrastructure engineering, defensive cybersecurity architecture, and AIOps consultancy.
          </p>
          <a
            href="mailto:mustaquimmahmad@gmail.com"
            className="btn-cyber text-sm px-8 py-3.5 inline-flex"
            onClick={() => soundFx.playTick(1200, 0.03)}
          >
            <span>Reach Out Directly</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/mustaquimahmad/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#050914] border border-white/10 hover:border-[#00F0FF] hover:text-[#00F0FF] text-slate-300 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            title="LinkedIn Profile"
            onClick={() => soundFx.playTick(1000, 0.02)}
          >
            <Linkedin className="w-5 h-5" />
          </a>

          <a
            href="https://github.com/mustaquim-ms"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#050914] border border-white/10 hover:border-[#7ed957] hover:text-[#7ed957] text-slate-300 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(126,217,87,0.4)]"
            title="GitHub Repositories"
            onClick={() => soundFx.playTick(1000, 0.02)}
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            href="https://medium.com/@mustaquim"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#050914] border border-white/10 hover:border-[#ffb423] hover:text-[#ffb423] text-slate-300 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,180,35,0.4)]"
            title="Medium Publications"
            onClick={() => soundFx.playTick(1000, 0.02)}
          >
            <Globe className="w-5 h-5" />
          </a>

          <a
            href="mailto:mustaquimmahmad@gmail.com"
            className="w-12 h-12 rounded-full bg-[#050914] border border-white/10 hover:border-white hover:text-white text-slate-300 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            title="Send Email"
            onClick={() => soundFx.playTick(1000, 0.02)}
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Giant Glitch Signature Name (Bigger, Centered, Mesmerizing Hover Effect) */}
      <div className="w-full flex justify-center items-center overflow-hidden py-6 select-none">
        <h1
          className="giant-glitch-name font-mono font-black tracking-tight uppercase"
          data-text="MUSTAQUIM"
          onMouseEnter={() => soundFx.playChime(780, 0.2)}
        >
          MUSTAQUIM
        </h1>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
        <div>© {new Date().getFullYear()} Mustaquim Ahmad. All rights reserved.</div>
        <div>Zero-Trust Architecture · AIOps Operations · ISO 27001 Aligned</div>
      </div>
    </footer>
  );
};
