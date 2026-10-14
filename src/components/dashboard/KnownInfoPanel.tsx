import React from 'react';
import { Database, Sparkles, CheckCircle2, Bookmark, ShieldCheck, HelpCircle } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

export const KnownInfoPanel: React.FC = () => {
  const { knownFacts, currentPhase, hintsEnabled, puzzles } = useGameState();

  return (
    <div className="bg-police-900/60 border border-police-800 rounded-xl p-4 flex flex-col h-full font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-police-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-100 uppercase tracking-wider">
            Dữ Kiện Hệ Thống (Known Facts)
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-police-800 border border-police-700 text-slate-400 text-[10px]">
          CHỈ ĐỌC // {knownFacts.length} DỮ KIỆN
        </span>
      </div>

      {/* Hints Banner if enabled by BTC */}
      {hintsEnabled && (
        <div className="mb-3 p-3 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GỢI Ý TỪ BAN TỔ CHỨC:</span>
          </div>
          <p className="font-sans text-[11px] leading-relaxed text-amber-100/90">
            {currentPhase === 1 ? puzzles.phase1Hint : puzzles.phase2Hint}
          </p>
        </div>
      )}

      {/* Known facts list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {knownFacts.map((fact) => (
          <div
            key={fact.id}
            className={`p-3 rounded-lg border transition-all ${
              fact.isImportant
                ? 'bg-police-950/80 border-cyan-500/40 shadow-sm shadow-cyan-950/20'
                : 'bg-police-950/50 border-police-850'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    fact.isImportant ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                <h4 className="font-semibold text-slate-200 text-xs">
                  {fact.title}
                </h4>
              </div>

              <span className="text-[9px] px-1.5 py-0.5 rounded bg-police-900 border border-police-800 text-slate-400 shrink-0">
                Phase {fact.phase}
              </span>
            </div>

            <p className="font-sans text-[11px] text-slate-300 leading-relaxed mb-2">
              {fact.description}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-police-900 pt-1.5">
              <span>Nguồn: {fact.source}</span>
              {fact.unlockedAt && <span>{fact.unlockedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
