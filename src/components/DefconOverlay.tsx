import React, { useState, useEffect, useRef } from 'react';
import { validateDefconOverride } from '../utils/math';
import { soundFx } from '../utils/audio';
import { AlertTriangle, Terminal, ShieldAlert } from 'lucide-react';

interface DefconOverlayProps {
  isActive: boolean;
  onDeactivate: () => void;
}

export const DefconOverlay: React.FC<DefconOverlayProps> = ({ isActive, onDeactivate }) => {
  const [inputVal, setInputVal] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      soundFx.startDefconSiren();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      soundFx.stopDefconSiren();
    }
  }, [isActive]);

  if (!isActive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDefconOverride(inputVal)) {
      soundFx.stopDefconSiren();
      soundFx.playChime(880, 0.3);
      setHasError(false);
      setInputVal('');
      onDeactivate();
    } else {
      setHasError(true);
      setInputVal('');
      soundFx.playTick(200, 0.1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl p-8 sm:p-12 rounded-2xl bg-[#0c0002] border-2 border-[#FF003C] shadow-[0_0_80px_rgba(255,0,60,0.6),inset_0_0_40px_rgba(255,0,60,0.25)] text-center font-mono relative z-10">
        {/* Siren Header Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF003C]/20 border border-[#FF003C] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-[#FF003C] animate-bounce" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-widest text-[#FF003C] drop-shadow-[0_0_20px_#FF003C] mb-3">
          DEFCON 1 ACTIVE
        </h2>
        <div className="text-sm text-[#FF4500] font-bold tracking-wider uppercase mb-8">
          CRITICAL PERIMETER THREAT PROTOCOL ENGAGED
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          System telemetry is currently throttled under emergency protocol. To restore baseline operational status, enter override credentials.
        </p>

        {/* Command Line Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-[#FF003C]/10 border border-dashed border-[#FF003C] rounded-lg">
            <span className="text-[#FF003C] font-bold flex items-center gap-1">
              <Terminal className="w-4 h-4" />
              <span>root@auth:~#</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setHasError(false);
              }}
              placeholder="type 'override' or 'exit'"
              className="flex-1 bg-transparent border-none text-white font-mono text-base outline-none placeholder:text-[#FF003C]/40"
              autoComplete="off"
              autoFocus
            />
          </div>
        </form>

        {hasError && (
          <div className="text-[#FF003C] text-xs font-bold tracking-widest mb-4 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>ACCESS DENIED. INVALID CRYPTOGRAPHIC TOKEN.</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => {
              soundFx.stopDefconSiren();
              onDeactivate();
            }}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Emergency Disengage (Exit Lockdown)
          </button>
        </div>
      </div>
    </div>
  );
};
