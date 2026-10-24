import React, { useState } from 'react';
import { PRODUCTS_LIST, BLOG_POSTS } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { X, Package, BookOpen, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductsBlogsModalProps {
  isOpen: boolean;
  initialTab?: 'products' | 'blogs';
  onClose: () => void;
}

export const ProductsBlogsModal: React.FC<ProductsBlogsModalProps> = ({
  isOpen,
  initialTab = 'products',
  onClose,
}) => {
  const [tab, setTab] = useState<'products' | 'blogs'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#010308]/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#050914] border border-[#00F0FF]/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-[#080d1a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-[#010308] border border-white/10 rounded-xl">
              <button
                onClick={() => {
                  setTab('products');
                  soundFx.playTick(1000, 0.02);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  tab === 'products'
                    ? 'bg-[#7ed957] text-black shadow-md shadow-[#7ed957]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Engineered Products</span>
              </button>

              <button
                onClick={() => {
                  setTab('blogs');
                  soundFx.playTick(1000, 0.02);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  tab === 'blogs'
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Technical Insights</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              soundFx.playTick(700, 0.02);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {tab === 'products' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRODUCTS_LIST.map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-[#02040A] border border-white/10 hover:border-[#7ed957] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7ed957]/10 text-[#7ed957] border border-[#7ed957]/30 font-bold">
                        {prod.status}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-slate-500" />
                    </div>

                    <h4 className="text-lg font-bold font-mono text-white mb-1">
                      {prod.title}
                    </h4>
                    <div className="text-xs font-mono text-[#ffb423] mb-3">{prod.tagline}</div>

                    <p className="text-xs font-mono text-slate-400 leading-relaxed mb-4">
                      {prod.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {prod.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {prod.url && prod.url !== '#' ? (
                    <a
                      href={prod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber w-full text-center justify-center text-xs"
                    >
                      <span>Explore Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="w-full text-center py-2 text-xs font-mono text-slate-500 border border-white/10 rounded-lg">
                      Internal Enterprise Tool
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.id}
                  className="p-6 rounded-2xl bg-[#02040A] border border-white/10 hover:border-[#00F0FF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] mb-2">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{post.date}</span>
                      <span>·</span>
                      <span className="text-slate-400">{post.readTime}</span>
                    </div>

                    <h4 className="text-lg font-bold font-mono text-white mb-2">
                      {post.title}
                    </h4>

                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <a
                    href="https://medium.com/@mustaquim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber alt shrink-0 flex items-center gap-2 text-xs"
                    onClick={() => soundFx.playTick(1100, 0.02)}
                  >
                    <span>Read on Medium</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
