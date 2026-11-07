import React, { useRef, useState } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
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

/**
 * Lucide icons are used for the competency cards.
 * Brand logos in the infrastructure showcase use Simple Icons' SVG CDN.
 * If a logo cannot load, its short fallback label is displayed instead.
 */
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

type TechItem = {
  name: string;
  icon: string;
  fallback: string;
};

const techIcons: TechItem[] = [
  { name: 'VS Code', icon: 'visualstudiocode', fallback: 'VS' },
  { name: 'Docker', icon: 'docker', fallback: 'DK' },
  { name: 'GitHub', icon: 'github', fallback: 'GH' },
  { name: 'Azure', icon: 'microsoftazure', fallback: 'AZ' },
  { name: 'Linux', icon: 'linux', fallback: 'LX' },
  { name: 'Networking', icon: 'cisco', fallback: 'NET' },
  { name: 'Figma', icon: 'figma', fallback: 'FG' },
  { name: 'Next.js', icon: 'nextdotjs', fallback: 'N' },
  { name: 'Node.js', icon: 'nodedotjs', fallback: 'JS' },
  { name: 'Python', icon: 'python', fallback: 'PY' },
  { name: 'Supabase', icon: 'supabase', fallback: 'SB' },
  { name: 'Vercel', icon: 'vercel', fallback: 'VC' },

  { name: 'Windows Server', icon: 'windows', fallback: 'WS' },
  { name: 'Active Directory', icon: 'microsoft', fallback: 'AD' },
  { name: 'PowerShell', icon: 'powershell', fallback: 'PS' },
  { name: 'Bash', icon: 'gnubash', fallback: 'SH' },
  { name: 'Proxmox', icon: 'proxmox', fallback: 'PX' },
  { name: 'VMware', icon: 'vmware', fallback: 'VM' },
  { name: 'MikroTik', icon: 'mikrotik', fallback: 'MT' },
  { name: 'Cisco', icon: 'cisco', fallback: 'CS' },
  { name: 'pfSense', icon: 'pfsense', fallback: 'PF' },
  { name: 'Wireshark', icon: 'wireshark', fallback: 'WS' },
  { name: 'Nmap', icon: 'nmap', fallback: 'NM' },
  { name: 'PRTG', icon: 'paessler', fallback: 'PR' },
  { name: 'GitLab', icon: 'gitlab', fallback: 'GL' },
  { name: 'Git', icon: 'git', fallback: 'GT' },
  { name: 'Nginx', icon: 'nginx', fallback: 'NG' },
  { name: 'MySQL', icon: 'mysql', fallback: 'MY' },
  { name: 'PostgreSQL', icon: 'postgresql', fallback: 'PG' },
  { name: 'Power BI', icon: 'powerbi', fallback: 'BI' },
  { name: 'Microsoft 365', icon: 'microsoft365', fallback: 'M365' },
  { name: 'Intune', icon: 'microsoftintune', fallback: 'IN' },
  { name: 'Microsoft Entra ID', icon: 'microsoftentra', fallback: 'ID' },
  { name: 'SCCM / MECM', icon: 'microsoft', fallback: 'MECM' },
  { name: 'ServiceNow', icon: 'servicenow', fallback: 'SN' },
  { name: 'Kali Linux', icon: 'kalilinux', fallback: 'KL' },
  { name: 'Vite', icon: 'vite', fallback: 'VT' },
  { name: 'React', icon: 'react', fallback: 'RE' },
  { name: 'Vue.js', icon: 'vuedotjs', fallback: 'VUE' },
  { name: 'TypeScript', icon: 'typescript', fallback: 'TS' },
  { name: 'JavaScript', icon: 'javascript', fallback: 'JS' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', fallback: 'TW' },
  { name: 'FastAPI', icon: 'fastapi', fallback: 'FA' },
];

/**
 * Separate child components keep Framer Motion hooks inside valid React
 * component boundaries while preserving the original scroll-driven effect.
 */
const ScrollCharacter: React.FC<{
  char: string;
  index: number;
  centerIndex: number;
  progress: MotionValue<number>;
}> = ({ char, index, centerIndex, progress }) => {
  const distanceFromCenter = index - centerIndex;
  const x = useTransform(
    progress,
    [0, 0.6],
    [distanceFromCenter * 35, 0],
  );
  const rotateX = useTransform(
    progress,
    [0, 0.6],
    [distanceFromCenter * 30, 0],
  );

  return (
    <motion.span
      className={`inline-block text-[#7ed957] ${
        char === ' ' ? 'w-3 sm:w-6' : ''
      }`}
      style={{ x, rotateX }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

const TechStackCard: React.FC<{
  item: TechItem;
  index: number;
  centerIndex: number;
  progress: MotionValue<number>;
}> = ({ item, index, centerIndex, progress }) => {
  const distanceFromCenter = index - centerIndex;
  const x = useTransform(
    progress,
    [0, 0.6],
    [distanceFromCenter * 45, 0],
  );
  const scale = useTransform(progress, [0, 0.6], [0.7, 1]);
  const y = useTransform(
    progress,
    [0, 0.6],
    [Math.abs(distanceFromCenter) * 20, 0],
  );

  return (
    <motion.div
      onMouseEnter={() => soundFx.playTick(1200, 0.01)}
      className="group flex h-24 w-[104px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#080f1e]/90 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7ed957]/60 hover:bg-[#0c1729] hover:shadow-[0_12px_32px_rgba(126,217,87,0.10)] sm:h-28 sm:w-28"
      style={{ x, scale, y, transformOrigin: 'center' }}
      title={item.name}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] p-1.5 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
        <img
          src={`https://cdn.simpleicons.org/${item.icon}`}
          alt={`${item.name} logo`}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <span className="hidden h-full w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] font-mono text-xs font-bold text-[#7ed957]">
          {item.fallback}
        </span>
      </div>
      <span className="max-w-full text-center font-mono text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-300 transition-colors group-hover:text-white sm:text-[10px]">
        {item.name}
      </span>
    </motion.div>
  );
};

export const SkillsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Infrastructure' | 'Cybersecurity' | 'AIOps' | 'Cloud'
  >('All');

  // Scroll references for the existing scroll-driven animations.
  const targetRef1 = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: progress1 } = useScroll({
    target: targetRef1,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: progress2 } = useScroll({
    target: targetRef2,
    offset: ['start end', 'end start'],
  });

  // Text setup for the original 3D scroll animation.
  const scrollText = 'see more from infrastructure stack';
  const characters = scrollText.split('');
  const centerIndex = Math.floor(characters.length / 2);
  const iconCenterIndex = Math.floor(techIcons.length / 2);

  const filtered =
    activeFilter === 'All'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((skill) => skill.category === activeFilter);

  return (
    <section
      id="skills"
      className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-6 sm:py-24"
    >
      {/* Subtle ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7ed957]/[0.06] blur-[100px]"
      />

      {/* Section Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#7ed957] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7ed957] shadow-[0_0_10px_#7ed957]" />
            5×5 Engineered Competency Matrix · 25 Capabilities
          </div>
          <h2 className="font-mono text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Sys <span className="text-[#7ed957]">Capabilities</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Core technologies, platforms, and operational capabilities across
            infrastructure, networking, cloud, and security.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start rounded-xl border border-white/10 bg-[#050914]/80 p-1.5 shadow-lg shadow-black/10 backdrop-blur-md md:self-auto">
          {(
            ['All', 'Infrastructure', 'Cybersecurity', 'AIOps', 'Cloud'] as const
          ).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveFilter(category);
                soundFx.playTick(1000, 0.02);
              }}
              aria-pressed={activeFilter === category}
              className={`cursor-pointer rounded-lg px-3 py-2 font-mono text-[10px] transition-all duration-200 sm:text-xs ${
                activeFilter === category
                  ? 'bg-[#7ed957] font-bold text-[#07100a] shadow-md shadow-[#7ed957]/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Competency Grid */}
      <div className="mb-24 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((skill) => {
          const IconComp = iconMap[skill.iconName] || Terminal;
          const strokeOffset = getSkillStrokeOffset(skill.percentage, 42);

          return (
            <div
              key={skill.id}
              onMouseEnter={() => soundFx.playTick(1100, 0.012)}
              className="group relative flex min-h-[218px] flex-col items-center overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#0b1424]/95 to-[#050914]/95 p-4 text-center shadow-[0_8px_25px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7ed957]/50 hover:shadow-[0_14px_35px_rgba(126,217,87,0.09)] sm:min-h-[230px] sm:p-5"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#7ed957]/0 blur-2xl transition-all duration-500 group-hover:bg-[#7ed957]/10" />

              {/* Circular Gauge Ring */}
              <div className="relative mb-3 flex h-24 w-24 items-center justify-center">
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
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

                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-black text-white transition-all duration-300 group-hover:scale-75 group-hover:opacity-0">
                  {skill.percentage}
                  <span className="-mt-2 text-[10px] font-semibold text-[#7ed957]">
                    %
                  </span>
                </div>

                {/* Hover Icon Reveal */}
                <div className="absolute inset-0 flex scale-50 items-center justify-center text-[#ffb423] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <IconComp className="h-9 w-9 drop-shadow-[0_0_15px_rgba(255,180,35,0.55)]" />
                </div>
              </div>

              {/* Skill Title */}
              <h3 className="mb-2 flex min-h-[34px] items-center justify-center font-mono text-[11px] font-bold uppercase leading-5 tracking-wider text-white transition-colors group-hover:text-[#7ed957] sm:text-xs">
                {skill.name}
              </h3>

              {/* Skill Tags */}
              <div className="flex flex-col gap-1 font-mono text-[9px] text-slate-400 sm:text-[10px]">
                {skill.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="max-w-[150px] truncate">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Corner accents */}
              <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#7ed957]/40" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#7ed957]/20" />
            </div>
          );
        })}
      </div>

      {/* --- SCROLL ANIMATION & INFRASTRUCTURE TECH STACK SHOWCASE --- */}

      {/* 1. Scroll-driven 3D Text Reveal — original scroll effect retained */}
      <div
        ref={targetRef1}
        className="my-16 flex flex-col items-center justify-center border-t border-white/10 px-2 py-16 sm:py-20"
      >
        <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B9BB4] sm:text-xs">
          <span className="h-px w-8 bg-[#7ed957]/50" />
          <span>Scroll to expand telemetry matrix</span>
          <span className="h-px w-8 bg-[#7ed957]/50" />
        </div>

        <div
          className="w-full max-w-4xl text-center font-mono text-2xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
          style={{ perspective: '600px' }}
        >
          {characters.map((char, index) => (
            <ScrollCharacter
              key={`${char}-${index}`}
              char={char}
              index={index}
              centerIndex={centerIndex}
              progress={progress1}
            />
          ))}
        </div>
        <p className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
          Infrastructure · Cloud · Security · Development
        </p>
      </div>

      {/* 2. Scroll-driven Tech Stack Icon Convergence — original effect retained */}
      <div
        ref={targetRef2}
        className="my-12 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0a1424]/70 to-[#050914]/50 px-4 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:px-8 sm:py-16"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#7ed957] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7ed957] shadow-[0_0_10px_#7ed957]" />
            Technology Ecosystem
          </div>
          <h3 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
            Integrated With My <span className="text-[#7ed957]">Tech Stack</span>
          </h3>
          <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
            A selection of platforms and tools used across infrastructure,
            networking, cloud engineering, automation, and software development.
          </p>
        </div>

        <div
          className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4"
          style={{ perspective: '800px' }}
        >
          {techIcons.map((item, index) => (
            <TechStackCard
              key={item.name}
              item={item}
              index={index}
              centerIndex={iconCenterIndex}
              progress={progress2}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
          <span className="h-px w-6 bg-white/10" />
          Tools · Platforms · Technologies
          <span className="h-px w-6 bg-white/10" />
        </div>
      </div>

      {/* SVG Gradient Definition */}
      <svg
        className="absolute h-0 w-0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="cap-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7ed957" />
            <stop offset="100%" stopColor="#ffb423" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};
