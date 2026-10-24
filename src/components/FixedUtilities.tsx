import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { Volume2, VolumeX, Skull, ChevronUp } from 'lucide-react';

interface FixedUtilitiesProps {
  isScrolled: boolean;
  onTriggerDefcon: () => void;
}

export const FixedUtilities: React.FC<FixedUtilitiesProps> = ({
  isScrolled,
  onTriggerDefcon,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFx.getSoundEnabled());

  const handleToggleSound = () => {
    const next = soundFx.toggleMute();
    setSoundEnabled(next);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundFx.playTick(1200, 0.03);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Return To Top Button (shown when scrolled) */}
      {isScrolled && (
        <button
          onClick={handleScrollToTop}
          className="w-12 h-12 rounded-full bg-[#050914]/90 text-white border border-[#00F0FF]/40 hover:bg-[#00F0FF] hover:text-black backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
          title="Return to Top"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* DEFCON 1 Button */}
      <button
        onClick={() => {
          soundFx.playTick(300, 0.1);
          onTriggerDefcon();
        }}
        className="w-12 h-12 rounded-full bg-[#050914]/90 text-[#FF003C] border border-[#FF003C]/40 hover:bg-[#FF003C] hover:text-white hover:border-[#FF003C] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,0,60,0.25)] hover:shadow-[0_0_25px_rgba(255,0,60,0.6)] cursor-pointer"
        title="DEFCON 1 Protocol (System Lockdown)"
        aria-label="Trigger DEFCON 1 protocol"
      >
        <Skull className="w-5 h-5" />
      </button>

      {/* Sound Toggle */}
      <button
        onClick={handleToggleSound}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg cursor-pointer ${
          soundEnabled
            ? 'bg-[#7ed957] text-black border-[#7ed957] shadow-[0_0_20px_rgba(126,217,87,0.5)] scale-105'
            : 'bg-[#050914]/90 text-[#7ed957] border-[#7ed957]/40 hover:border-[#7ed957] backdrop-blur-md'
        }`}
        title={soundEnabled ? 'Mute Procedural Sound' : 'Enable Cyber Synthesizer'}
        aria-label="Toggle sound"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </div>
  );
};
