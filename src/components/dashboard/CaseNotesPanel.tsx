import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  Clock, 
  Check, 
  X, 
  FolderPlus,
  StickyNote
} from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import { CaseNote, CaseNoteCategory } from '../../types';

const CATEGORIES: CaseNoteCategory[] = [
  'Suspect',
  'Timeline',
  'Evidence',
  'Puzzle',
  'Vehicle',
  'Theory',
  'General',
];

export const CaseNotesPanel: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useGameState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New note form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CaseNoteCategory>('General');
  const [newIsPinned, setNewIsPinned] = useState(false);

  // Edit note form state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<CaseNoteCategory>('General');

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesCat = selectedCategory === 'ALL' || note.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.category.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        // Pinned notes come first, then latest updated
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchQuery, selectedCategory]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;

    addNote({
      title: newTitle.trim() || 'Ghi chú mới',
      content: newContent.trim(),
      category: newCategory,
      isPinned: newIsPinned,
    });

    setNewTitle('');
    setNewContent('');
    setNewCategory('General');
    setNewIsPinned(false);
    setIsCreating(false);
  };

  const handleStartEdit = (note: CaseNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
  };

  const handleSaveEdit = (id: string) => {
    updateNote(id, {
      title: editTitle.trim() || 'Không có tiêu đề',
      content: editContent.trim(),
      category: editCategory,
    });
    setEditingId(null);
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN');
    } catch {
      return isoStr;
    }
  };

  const getCategoryColor = (cat: CaseNoteCategory) => {
    switch (cat) {
      case 'Suspect':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      case 'Timeline':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'Evidence':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'Puzzle':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Vehicle':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40';
      case 'Theory':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header controls: Search & Category filter */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm manh mối, ghi chú, nghi phạm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-police-900 border border-police-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-terminal-amber"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-2 bg-terminal-amber hover:bg-amber-400 text-police-950 font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 uppercase"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Ghi Chú</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 ${
            selectedCategory === 'ALL'
              ? 'bg-police-700 text-white font-semibold'
              : 'bg-police-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          Tất cả ({notes.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = notes.filter((n) => n.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 flex items-center gap-1 ${
                selectedCategory === cat
                  ? 'bg-police-700 text-white font-semibold'
                  : 'bg-police-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{cat}</span>
              {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Create note drawer / form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-police-900 border border-terminal-amber/50 rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-police-800 pb-2">
            <span className="text-terminal-amber font-semibold uppercase flex items-center gap-1.5">
              <StickyNote className="w-4 h-4" />
              Tạo ghi chú mới
            </span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tiêu đề ghi chú..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 bg-police-950 border border-police-800 rounded text-slate-200 focus:outline-none focus:border-terminal-amber"
              autoFocus
            />

            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CaseNoteCategory)}
                className="flex-1 px-3 py-2 bg-police-950 border border-police-800 rounded text-slate-200 focus:outline-none focus:border-terminal-amber"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Phân loại: {cat}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setNewIsPinned(!newIsPinned)}
                className={`p-2 rounded border transition-colors ${
                  newIsPinned
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-police-950 border-police-800 text-slate-500 hover:text-slate-300'
                }`}
                title="Ghim ghi chú quan trọng"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Nội dung ghi chú điều tra, giả thuyết, mật mã nghi vấn..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full px-3 py-2 bg-police-950 border border-police-800 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-sans"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded bg-police-800 hover:bg-police-700 text-slate-300 font-mono text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-terminal-amber hover:bg-amber-400 text-police-950 font-bold font-mono text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Lưu bản ghi
            </button>
          </div>
        </form>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[300px]">
        {filteredNotes.length === 0 ? (
          <div className="h-48 border border-dashed border-police-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
            <StickyNote className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <p>Chưa có ghi chú nào trong mục này.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Nhấn "Thêm Ghi Chú" để ghi lại các suy luận và mốc thời gian của bạn.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl border transition-all relative ${
                  note.isPinned
                    ? 'bg-police-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : 'bg-police-900/50 border-police-800 hover:border-police-700'
                }`}
              >
                {/* Note pinned ribbon */}
                {note.isPinned && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    <Pin className="w-2.5 h-2.5" />
                    <span>PINNED</span>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-police-950 border border-police-800 rounded text-slate-200 focus:outline-none focus:border-terminal-amber"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as CaseNoteCategory)}
                        className="px-2.5 py-1.5 bg-police-950 border border-police-800 rounded text-slate-200"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-1.5 bg-police-950 border border-police-800 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-sans"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded bg-police-800 text-slate-300"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-3 py-1 rounded bg-terminal-amber text-police-950 font-bold"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Note title & category */}
                    <div className="flex items-center gap-2 mb-2 pr-20 flex-wrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${getCategoryColor(
                          note.category
                        )}`}
                      >
                        {note.category}
                      </span>
                      <h3 className="font-mono font-semibold text-slate-100 text-sm">
                        {note.title}
                      </h3>
                    </div>

                    {/* Note content */}
                    <p className="font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>

                    {/* Footer: timestamp & actions */}
                    <div className="flex items-center justify-between border-t border-police-800/60 pt-2.5 mt-3 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Cập nhật: {formatTimestamp(note.updatedAt)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className={`p-1.5 rounded hover:bg-police-800 transition-colors ${
                            note.isPinned ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title={note.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 rounded hover:bg-police-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Sửa ghi chú"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Xóa ghi chú"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
