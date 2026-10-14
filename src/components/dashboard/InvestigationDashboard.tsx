import React, { useState } from 'react';
import { CaseNotesPanel } from './CaseNotesPanel';
import { KnownInfoPanel } from './KnownInfoPanel';
import { EvidenceListPanel } from './EvidenceListPanel';
import { FileSpreadsheet, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

export const InvestigationDashboard: React.FC = () => {
  const { currentPhase, notes, knownFacts, evidenceList, phoneUnlocked, warehouseBUnlocked } = useGameState();
  const [mobileTab, setMobileTab] = useState<'notes' | 'evidence' | 'known'>('notes');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-6 space-y-4">
      {/* Top Dossier Header Banner */}
      <div className="bg-police-900/80 border border-police-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              Bảng Phân Tích & Điều Tra Vụ Án (Investigation Hub)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30 uppercase">
              Active Dossier
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Không gian lưu trữ chứng cứ số, ghi chú phân tích, giả thuyết và dữ kiện mở khóa theo thời gian thực.
          </p>
        </div>

        {/* Quick counts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-police-950/80 border border-police-800 flex flex-col items-center">
            <span className="text-slate-400 text-[10px]">Ghi chú</span>
            <span className="text-white font-bold">{notes.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-police-950/80 border border-police-800 flex flex-col items-center">
            <span className="text-slate-400 text-[10px]">Dữ kiện</span>
            <span className="text-cyan-400 font-bold">{knownFacts.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-police-950/80 border border-police-800 flex flex-col items-center">
            <span className="text-slate-400 text-[10px]">Vật chứng</span>
            <span className="text-emerald-400 font-bold">
              {evidenceList.filter((e) => e.isUnlocked).length}/{evidenceList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Tab switcher (only visible on small screens < lg) */}
      <div className="flex lg:hidden bg-police-900 p-1 rounded-lg border border-police-800 text-xs font-mono">
        <button
          onClick={() => setMobileTab('notes')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'notes' ? 'bg-police-700 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Ghi Chú ({notes.length})
        </button>
        <button
          onClick={() => setMobileTab('evidence')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'evidence' ? 'bg-police-700 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Vật Chứng ({evidenceList.filter((e) => e.isUnlocked).length})
        </button>
        <button
          onClick={() => setMobileTab('known')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'known' ? 'bg-police-700 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Dữ Kiện ({knownFacts.length})
        </button>
      </div>

      {/* Main 3-column layout on Desktop */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
        {/* Left Column: Evidence Log (Desktop only or active on mobile) */}
        <div
          className={`lg:col-span-3 h-full overflow-hidden ${
            mobileTab === 'evidence' ? 'block' : 'hidden lg:block'
          }`}
        >
          <EvidenceListPanel />
        </div>

        {/* Center Column: Case Notes (Main workspace) */}
        <div
          className={`lg:col-span-6 h-full overflow-hidden ${
            mobileTab === 'notes' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-police-950/60 border border-police-800 rounded-xl p-4 h-full flex flex-col">
            <CaseNotesPanel />
          </div>
        </div>

        {/* Right Column: Known Information & Facts */}
        <div
          className={`lg:col-span-3 h-full overflow-hidden ${
            mobileTab === 'known' ? 'block' : 'hidden lg:block'
          }`}
        >
          <KnownInfoPanel />
        </div>
      </div>
    </div>
  );
};
