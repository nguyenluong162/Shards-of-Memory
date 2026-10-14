import React from 'react';
import { Shield, Sparkles, Key, Menu, HelpCircle, HardDrive } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import gameConfig from '../../data/game-config.json';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const { currentPhase, hintsEnabled, toggleHints, setIsAdminOpen, phoneUnlocked, warehouseBUnlocked } = useGameState();

  const getPhaseName = (p: number) => {
    switch (p) {
      case 1:
        return 'PHASE 1 // ĐIỆN THOẠI THU GIỮ';
      case 2:
        return 'PHASE 2 // CỬA NHÀ KHO B';
      case 3:
        return 'PHASE 3 // TRÍCH XUẤT CHỨNG CỨ';
      default:
        return `PHASE ${p} // CHUYÊN ÁN`;
    }
  };

  return (
    <header className="h-16 border-b border-police-800 bg-police-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & Case branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-police-900 rounded-md transition-colors"
          title="Mở menu khu vực"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-police-800 border border-terminal-amber/40 flex items-center justify-center text-terminal-amber shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white tracking-wider text-sm sm:text-base">
                {gameConfig.caseId}
              </span>
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">•</span>
              <span className="font-mono text-terminal-amber text-xs tracking-wider hidden sm:inline">
                {gameConfig.caseTitle}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden md:block">
              {gameConfig.department}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Phase status badge */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-police-900 border border-police-700/80 flex items-center gap-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-terminal-amber animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-slate-200 uppercase font-semibold">
            {getPhaseName(currentPhase)}
          </span>
        </div>
      </div>

      {/* Right: Hint, Status indicators & Discreet Admin Trigger */}
      <div className="flex items-center gap-2">
        {/* Quick status pill for unlocked progress */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono mr-2">
          <span className={`px-2 py-0.5 rounded border ${phoneUnlocked ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-police-900 border-police-800 text-slate-500'}`}>
            Phone: {phoneUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
          <span className={`px-2 py-0.5 rounded border ${warehouseBUnlocked ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-police-900 border-police-800 text-slate-500'}`}>
            Kho B: {warehouseBUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>

        {/* Toggle Hints button */}
        <button
          onClick={toggleHints}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
            hintsEnabled
              ? 'bg-terminal-amber/20 border-terminal-amber text-terminal-amber shadow-sm shadow-amber-900/30'
              : 'bg-police-900/80 border-police-800 text-slate-400 hover:text-slate-200 hover:border-police-700'
          }`}
          title={hintsEnabled ? 'Gợi ý đang BẬT' : 'Bật gợi ý từ BTC'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{hintsEnabled ? 'Gợi ý: BẬT' : 'Gợi ý'}</span>
        </button>

        {/* Admin button (discreet) */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-police-900/80 border border-police-800 text-slate-400 hover:text-terminal-amber hover:border-terminal-amber/40 transition-colors text-xs font-mono"
          title="Bảng điều khiển Ban Tổ Chức (GM / Admin)"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GM Panel</span>
        </button>
      </div>
    </header>
  );
};
