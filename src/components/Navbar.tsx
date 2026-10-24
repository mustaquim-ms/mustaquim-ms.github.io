import React, { useState, useRef } from 'react';
import { soundFx } from '../utils/audio';
import { Shield, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
  onOpenBlogs: () => void;
  onOpenProducts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  onOpenBlogs,
  onOpenProducts,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const navLinksRef = useRef<HTMLUListElement>(null);

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    soundFx.playTick(1200, 0.015);
    const target = e.currentTarget;
    const parent = navLinksRef.current;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    setSliderStyle({
      left: `${targetRect.left - parentRect.left}px`,
      width: `${targetRect.width}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSliderStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const navItems = [
    { label: 'Home', href: '#about', type: 'link' },
    { label: 'Skills', href: '#skills', type: 'link' },
    { label: 'Deployments', href: '#projects', type: 'link' },
    { label: 'Research', href: '#research', type: 'link' },
    { label: 'Career', href: '#experience', type: 'link' },
    { label: 'Certs', href: '#certifications', type: 'link' },
    { label: 'Blogs', onClick: onOpenBlogs, type: 'action' },
    { label: 'Products', href: '/product.html', target: '_blank', type: 'external' },
  ];

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'top-4 w-14 h-14 p-1 rounded-full bg-[#010308]/95 border-2 border-[#7ed957] shadow-[0_0_30px_rgba(126,217,87,0.4)] flex items-center justify-center'
            : 'top-6 w-[94%] max-w-[1240px] px-6 py-3.5 rounded-full bg-[#010308]/75 backdrop-blur-xl border border-[#00F0FF]/25 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,240,255,0.06)] flex items-center justify-between'
        }`}
      >
        {/* Subtle decorative cyber corner notches (visible when expanded) */}
        {!isScrolled && (
          <>
            <span className="absolute -top-[2px] -left-[2px] w-3 h-3 border-t-2 border-l-2 border-[#00F0FF] pointer-events-none rounded-tl-sm" />
            <span className="absolute -bottom-[2px] -right-[2px] w-3 h-3 border-b-2 border-r-2 border-[#00F0FF] pointer-events-none rounded-br-sm" />
          </>
        )}

        {/* LOGO AREA */}
        <a
          href="#about"
          className="flex items-center gap-3 text-white no-underline group focus-visible:outline-none"
          title="Mustaquim Ahmad — Return to Top"
          onClick={() => soundFx.playTick(800, 0.03)}
        >
          {/* Logo Emblem Icon / Image */}
          <div
            className={`relative flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-[#050914] to-[#0d1627] border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-500 ${
              isScrolled ? 'w-11 h-11 rotate-360 border-[#7ed957] shadow-[0_0_20px_rgba(126,217,87,0.6)]' : 'w-9 h-9 group-hover:scale-105'
            }`}
          >
            {!logoError ? (
              <img
                src="./assets/logo.png"
                alt="Mustaquim Logo"
                className="w-full h-full object-contain p-0.5"
                onError={() => setLogoError(true)}
              />
            ) : (
              <>
                <Shield className={`text-[#7ed957] transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-4 h-4'}`} />
                {/* Center Monogram */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-white">
                  M
                </span>
              </>
            )}
          </div>

          {/* Logo Text (hidden when scrolled into compact circular token) */}
          {!isScrolled && (
            <div className="flex flex-col">
              <span className="font-mono font-black text-sm tracking-wider text-white group-hover:text-[#7ed957] transition-colors whitespace-nowrap">
                MUSTAQUIM
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#8B9BB4] -mt-0.5">
                CYBER & IT OPS
              </span>
            </div>
          )}
        </a>

        {/* DESKTOP NAVIGATION LINKS */}
        {!isScrolled && (
          <nav className="hidden lg:flex items-center relative">
            <ul
              ref={navLinksRef}
              onMouseLeave={handleMouseLeave}
              className="flex items-center gap-1 list-none m-0 p-0 relative"
            >
              {/* Dynamic Sliding Hover Underline / Capsule */}
              <div
                className="absolute top-0 bottom-0 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 transition-all duration-300 pointer-events-none -z-0"
                style={sliderStyle}
              />

              {navItems.map((item) => (
                <li key={item.label}>
                  {item.type === 'link' ? (
                    <a
                      href={item.href}
                      onMouseEnter={handleLinkHover}
                      className="px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-[#00F0FF] transition-colors whitespace-nowrap relative z-10 block"
                    >
                      {item.label}
                    </a>
                  ) : item.type === 'external' ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={handleLinkHover}
                      className="px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#7ed957] hover:text-[#00F0FF] transition-colors whitespace-nowrap relative z-10 flex items-center gap-1 block"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-70" />
                    </a>
                  ) : (
                    <button
                      onClick={item.onClick}
                      onMouseEnter={handleLinkHover}
                      className="px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-[#7ed957] transition-colors whitespace-nowrap relative z-10 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* PRIMARY CTA & MOBILE TOGGLE */}
        {!isScrolled && (
          <div className="flex items-center gap-3">
            <a
              href="mailto:mustaquimmahmad@gmail.com"
              className="btn-cyber hidden sm:inline-flex"
              onClick={() => soundFx.playTick(1000, 0.03)}
            >
              Connect
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundFx.playTick(750, 0.02);
              }}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#7ed957]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </header>

      {/* MOBILE FULL-SCREEN / DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#010308]/95 backdrop-blur-2xl flex flex-col justify-center items-center p-8 lg:hidden animate-fade-in">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#050914] border-2 border-[#7ed957] shadow-[0_0_25px_rgba(126,217,87,0.4)] flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-[#7ed957]" />
          </div>

          <h2 className="text-xl font-mono font-black tracking-wider text-white mb-8">MUSTAQUIM AHMAD</h2>

          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {navItems.map((item) =>
              item.type === 'link' ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    soundFx.playTick(900, 0.02);
                  }}
                  className="w-full text-center py-2.5 text-base font-mono font-bold tracking-widest text-slate-200 hover:text-[#7ed957] border-b border-white/5"
                >
                  {item.label}
                </a>
              ) : item.type === 'external' ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-base font-mono font-bold tracking-widest text-[#7ed957] border-b border-white/5 flex items-center justify-center gap-1.5"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.onClick?.();
                  }}
                  className="w-full text-center py-2.5 text-base font-mono font-bold tracking-widest text-[#00F0FF] border-b border-white/5 bg-transparent"
                >
                  {item.label}
                </button>
              )
            )}

            <a
              href="mailto:mustaquimmahmad@gmail.com"
              className="btn-cyber w-full mt-4 text-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connect Directly
            </a>
          </div>
        </div>
      )}
    </>
  );
};
