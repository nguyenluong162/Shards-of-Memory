import React from 'react';
import { ArrowLeft, MessageSquareOff, MessageSquare } from 'lucide-react';

interface MessagesAppProps {
  onBack: () => void;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-medium font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <h2 className="text-sm font-semibold tracking-wide">Tin nhắn</h2>
        <div className="w-8" />
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
          <MessageSquareOff className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">
          Hộp thư trống
        </h3>
        <p className="text-xs text-slate-500 font-mono max-w-xs leading-relaxed">
          Không có tin nhắn SMS hoặc iMessage nào được lưu trong bộ nhớ tạm thời của thiết bị.
        </p>
      </div>
    </div>
  );
};
