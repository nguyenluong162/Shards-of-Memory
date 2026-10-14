import React from 'react';
import { FolderLock, FolderCheck, ExternalLink, ShieldAlert, FileText, Image as ImageIcon, MapPin } from 'lucide-react';
import { useGameState, NavModuleId } from '../../context/GameStateContext';
import { EvidenceItem } from '../../types';

export const EvidenceListPanel: React.FC = () => {
  const { evidenceList, setActiveModule, currentPhase } = useGameState();

  const handleEvidenceClick = (ev: EvidenceItem) => {
    if (!ev.isUnlocked) return;
    if (ev.id === 'EV-01' || ev.id === 'EV-02' || ev.id === 'EV-03') {
      setActiveModule('phone');
    } else if (ev.id === 'EV-04' || ev.id === 'EV-05') {
      setActiveModule('warehouse');
    }
  };

  const getEvidenceIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="w-3.5 h-3.5" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-police-900/60 border border-police-800 rounded-xl p-4 flex flex-col h-full font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-police-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-100 uppercase tracking-wider">
            Hồ Sơ Vật Chứng (Evidence Log)
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {evidenceList.filter((e) => e.isUnlocked).length} / {evidenceList.length} MỞ KHÓA
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {evidenceList.map((ev) => (
          <div
            key={ev.id}
            onClick={() => handleEvidenceClick(ev)}
            className={`p-3 rounded-lg border transition-all ${
              ev.isUnlocked
                ? 'bg-police-950/80 border-police-700/80 hover:border-terminal-amber/60 cursor-pointer group'
                : 'bg-police-950/30 border-police-900/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`p-1 rounded ${
                    ev.isUnlocked ? 'bg-police-800 text-cyan-400' : 'bg-police-900 text-slate-600'
                  }`}
                >
                  {getEvidenceIcon(ev.type)}
                </span>
                <span className="font-semibold text-slate-200 text-xs truncate">
                  {ev.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    ev.isUnlocked
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-police-900 text-slate-500 border border-police-850'
                  }`}
                >
                  {ev.isUnlocked ? 'MỞ' : 'KHÓA'}
                </span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-slate-300 leading-relaxed mb-2 line-clamp-2">
              {ev.description}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-police-900 pt-1.5">
              <span className="truncate">Nơi tìm: {ev.locationFound}</span>
              {ev.isUnlocked && (
                <span className="text-terminal-amber flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Xem</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
