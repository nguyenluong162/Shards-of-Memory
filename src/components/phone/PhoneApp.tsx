import React, { useState } from 'react';
import { ArrowLeft, PhoneCall, PhoneMissed, Phone, Delete, Hash } from 'lucide-react';
import { playAudio } from '../../utils/audio';

interface PhoneAppProps {
  onBack: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'recents' | 'keypad'>('recents');
  const [dialedNumber, setDialedNumber] = useState('');

  const handleKeyPress = (num: string) => {
    playAudio.keypadBeep(600 + parseInt(num || '0', 10) * 40);
    setDialedNumber((prev) => (prev.length < 15 ? prev + num : prev));
  };

  const handleDelete = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

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
        <h2 className="text-sm font-semibold tracking-wide">Điện thoại</h2>
        <div className="w-8" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 bg-slate-950 text-xs font-mono">
        <button
          onClick={() => setTab('recents')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'recents'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Gần đây
        </button>
        <button
          onClick={() => setTab('keypad')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            tab === 'keypad'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Bàn phím
        </button>
      </div>

      {/* Content */}
      {tab === 'recents' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <PhoneMissed className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300 mb-1">
            Không có cuộc gọi gần đây
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Lịch sử cuộc gọi đã được xóa sạch hoặc không có dữ liệu mới.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="h-12 flex items-center justify-center text-xl font-mono tracking-widest text-emerald-400 mb-4 min-w-[200px] border-b border-slate-800">
            {dialedNumber || '—'}
          </div>

          <div className="grid grid-cols-3 gap-3 w-56">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                className="w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-lg font-mono font-semibold flex items-center justify-center border border-slate-800 transition-colors shadow-sm"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 w-56">
            <div className="w-10" />
            <button
              onClick={() => playAudio.errorBuzz()}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <Phone className="w-6 h-6 fill-current" />
            </button>
            {dialedNumber ? (
              <button
                onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <Delete className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
