import React from 'react';
import { CERTIFICATIONS_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { ShieldCheck, ExternalLink, Award } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certifications" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="text-xs font-mono text-[#7ed957] uppercase tracking-widest mb-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#7ed957]" />
          <span>Industry Validation</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-white">
          Professional <span className="text-[#7ed957]">Certifications</span>
        </h2>
        <p className="text-slate-400 font-mono text-sm max-w-xl mt-3">
          Direct verification links for Google, IBM, MikroTik, and CompTIA certifications.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CERTIFICATIONS_DATA.map((cert) => (
          <a
            key={cert.id}
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#050914] border border-white/10 hover:border-[#7ed957] hover:-translate-y-1.5 transition-all duration-300 shadow-xl overflow-hidden no-underline"
            onClick={() => soundFx.playTick(1150, 0.02)}
          >
            {/* Visual badge preview */}
            <div className="h-44 w-full mb-5 rounded-xl bg-[#040816] border border-white/10 flex items-center justify-center p-3 overflow-hidden relative group-hover:border-[#7ed957]/50 transition-colors">
              <img
                src={cert.image.replace(/^\.\/public/, '').replace(/^\/public/, '')}
                alt={cert.title}
                className="w-full h-full object-cover rounded-lg opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 relative z-10"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/assets/certs/')) {
                    target.src = target.src.replace('/assets/certs/', '/assets/images/certs/');
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-transparent to-transparent opacity-60 z-20 pointer-events-none" />
              <ShieldCheck className="absolute top-3 right-3 w-5 h-5 text-[#7ed957] drop-shadow-[0_0_10px_rgba(126,217,87,0.5)] z-30" />
            </div>

            <div>
              <div className="text-xs font-mono text-slate-400 mb-1">{cert.issuer}</div>
              <h3 className="text-base font-bold font-mono text-white group-hover:text-[#7ed957] transition-colors leading-snug mb-4">
                {cert.title}
              </h3>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#7ed957]">
              <span>Verify Credential</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
