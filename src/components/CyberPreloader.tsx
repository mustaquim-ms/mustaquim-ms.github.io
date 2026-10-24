import React, { useState, useEffect } from 'react';

interface CyberPreloaderProps {
  onComplete: () => void;
}

export const CyberPreloader: React.FC<CyberPreloaderProps> = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const messages = [
    'Establishing Secure Tunnel...',
    'Bypassing Mainframe...',
    'Loading Neural Assets...',
    'Access Granted.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 600);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-[#010308] flex flex-col items-center justify-center transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Core pulsing orb */}
        <div className="w-6 h-6 rounded-full bg-[#7ed957] shadow-[0_0_40px_#7ed957,0_0_80px_#7ed957] animate-ping" />

        {/* Ring 1 */}
        <div
          className="absolute w-20 h-20 rounded-full border-t-2 border-b-2 border-[#7ed957] animate-spin"
          style={{ animationDuration: '1.2s' }}
        />

        {/* Ring 2 */}
        <div
          className="absolute w-28 h-28 rounded-full border-l-2 border-r-2 border-[#00F0FF] animate-spin"
          style={{ animationDuration: '2.2s', animationDirection: 'reverse' }}
        />
      </div>

      <div className="mt-8 font-mono text-xs uppercase tracking-widest text-[#7ed957] drop-shadow-[0_0_10px_rgba(126,217,87,0.6)]">
        {messages[msgIndex]}
      </div>
    </div>
  );
};
