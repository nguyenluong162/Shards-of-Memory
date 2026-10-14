import React, { useState } from 'react';
import { ArrowLeft, Search, Folder, ChevronRight, Share2, Star } from 'lucide-react';
import notesData from '../../data/notes.json';
import { PhoneNote } from '../../types';

interface NotesAppProps {
  onBack: () => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ onBack }) => {
  const notes = notesData as PhoneNote[];
  const [selectedNote, setSelectedNote] = useState<PhoneNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter((n) => {
    const q = searchTerm.toLowerCase();
    return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-10">
        {selectedNote ? (
          <button
            onClick={() => setSelectedNote(null)}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ghi chú</span>
          </button>
        ) : (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
        )}

        <h2 className="text-sm font-semibold tracking-wide">
          {selectedNote ? 'Chi tiết ghi chú' : 'Ghi chú iCloud'}
        </h2>

        <div className="text-xs text-slate-400 font-mono">
          {selectedNote ? '' : `${notes.length} ghi chú`}
        </div>
      </div>

      {/* Note Detail View */}
      {selectedNote ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div className="space-y-1 border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono text-slate-400">{selectedNote.date}</span>
            <h1 className="text-base font-bold text-slate-100 font-sans">{selectedNote.title}</h1>
            {selectedNote.tags && selectedNote.tags.length > 0 && (
              <div className="flex gap-1 pt-1">
                {selectedNote.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap py-2">
            {selectedNote.content}
          </div>
        </div>
      ) : (
        /* Notes List View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar inside notes */}
          <div className="p-3 border-b border-slate-900 bg-slate-950">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Notes list items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-900 custom-scrollbar">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-3.5 hover:bg-slate-900/70 cursor-pointer transition-colors flex items-start justify-between gap-2"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-xs text-slate-200 truncate">
                    {note.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {note.date}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
