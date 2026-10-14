import React, { useState } from 'react';
import { Wifi, Battery, Signal, Lock, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import { PhoneLockScreen } from './PhoneLockScreen';
import { PhoneHomeScreen } from './PhoneHomeScreen';
import { PhotosApp } from './PhotosApp';
import { NotesApp } from './NotesApp';
import { PhoneApp } from './PhoneApp';
import { MessagesApp } from './MessagesApp';

type ActiveApp = 'none' | 'photos' | 'notes' | 'phone' | 'messages';

export const PhoneMockup: React.FC = () => {
  const { phoneUnlocked, lockPhone } = useGameState();
  const [activeApp, setActiveApp] = useState<ActiveApp>('none');

  const handleOpenApp = (app: ActiveApp) => {
    setActiveApp(app);
  };

  const handleBackToHome = () => {
    setActiveApp('none');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Evidence Tag Info Banner */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs font-mono text-slate-400 bg-police-900/60 border border-police-800 px-3 py-1.5 rounded-lg shadow">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-semibold text-slate-200">VẬT CHỨNG: EV-01</span>
        </div>
        <span>Thiết bị: Trương Nguyên Minh</span>
        {phoneUnlocked && (
          <button
            onClick={() => lockPhone()}
            className="text-[10px] text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            title="Khóa lại để thử lại mã PIN"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>Khóa</span>
          </button>
        )}
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Outer Titanium Bezel Accent */}
        <div className="absolute inset-0 rounded-[44px] border border-white/10 pointer-events-none" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-black rounded-[36px] overflow-hidden flex flex-col shadow-inner">
          {/* Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between text-white font-mono text-xs z-30 select-none bg-transparent">
            {/* Clock */}
            <span className="font-semibold text-[13px] tracking-tight">20:10</span>

            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
            </div>

            {/* Icons: Signal, Wifi, Battery */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">78%</span>
                <Battery className="w-4 h-4 fill-white" />
              </div>
            </div>
          </div>

          {/* Active Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {!phoneUnlocked ? (
              <PhoneLockScreen onUnlockSuccess={() => setActiveApp('none')} />
            ) : activeApp === 'photos' ? (
              <PhotosApp onBack={handleBackToHome} />
            ) : activeApp === 'notes' ? (
              <NotesApp onBack={handleBackToHome} />
            ) : activeApp === 'phone' ? (
              <PhoneApp onBack={handleBackToHome} />
            ) : activeApp === 'messages' ? (
              <MessagesApp onBack={handleBackToHome} />
            ) : (
              <PhoneHomeScreen onOpenApp={handleOpenApp} />
            )}
          </div>

          {/* iOS / Modern Home Indicator Bar */}
          {phoneUnlocked && (
            <div
              onClick={handleBackToHome}
              className="h-5 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent z-30"
              title="Về màn hình chính (Home)"
            >
              <div className="w-32 h-1 bg-white/40 hover:bg-white/80 rounded-full transition-colors" />
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] font-mono text-slate-500 mt-3">
        Mã số vật chứng: CS-2010-NAND-01 // Phân tích bộ nhớ điện thoại
      </div>
    </div>
  );
};
