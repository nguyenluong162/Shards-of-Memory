import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Delete, CornerDownLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { playAudio } from '../../utils/audio';

interface NumericKeypadProps {
  onCodeSubmit: (code: string) => boolean;
  isUnlocked: boolean;
  disabled?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onCodeSubmit,
  isUnlocked,
  disabled = false,
}) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [isShaking, setIsShaking] = useState(false);

  const handleKeyPress = (char: string) => {
    if (disabled || isUnlocked || status === 'granted') return;
    if (code.length >= 10) return;
    playAudio.keypadBeep(520);
    setCode((prev) => prev + char);
    setStatus('idle');
  };

  const handleClear = () => {
    if (disabled || isUnlocked) return;
    playAudio.keypadBeep(350);
    setCode('');
    setStatus('idle');
  };

  const handleSubmit = () => {
    if (disabled || isUnlocked || !code.trim()) return;

    const isValid = onCodeSubmit(code.trim());
    if (isValid) {
      setStatus('granted');
      playAudio.accessGranted();
    } else {
      setStatus('denied');
      playAudio.errorBuzz();
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setCode('');
      }, 700);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleKeyPress(e.key);
    } else if (e.key === 'Backspace') {
      setCode((prev) => prev.slice(0, -1));
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-xs bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md font-mono select-none focus:outline-none ring-1 ring-white/5"
    >
      {/* Brand & Security Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-terminal-amber" />
          <span className="text-xs font-bold text-slate-300 tracking-wider">
            SECURITY KEYPAD // B
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Status LED */}
          <span
            className={`w-3 h-3 rounded-full border transition-all ${
              isUnlocked || status === 'granted'
                ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10b981]'
                : status === 'denied'
                ? 'bg-rose-500 border-rose-400 shadow-[0_0_10px_#ef4444] animate-pulse'
                : 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]'
            }`}
          />
        </div>
      </div>

      {/* Digital LCD Display Screen */}
      <div className="bg-black/90 border border-slate-800 rounded-lg p-3 mb-4 text-right shadow-inner">
        <div className="text-[10px] uppercase text-slate-500 tracking-widest text-left flex items-center justify-between mb-1">
          <span>Trạng thái:</span>
          <span
            className={`font-semibold ${
              isUnlocked || status === 'granted'
                ? 'text-emerald-400'
                : status === 'denied'
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}
          >
            {isUnlocked || status === 'granted'
              ? 'ACCESS GRANTED'
              : status === 'denied'
              ? 'ACCESS DENIED'
              : 'ENTER ACCESS CODE'}
          </span>
        </div>

        <div className="text-2xl font-mono tracking-widest min-h-[32px] text-terminal-amber">
          {code
            ? code.split('').map(() => '*').join(' ')
            : isUnlocked
            ? 'UNLOCKED'
            : '------'}
        </div>
      </div>

      {/* Industrial Keypad Matrix */}
      <div className="grid grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleKeyPress(digit)}
            disabled={disabled || isUnlocked}
            className="h-13 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-bold text-lg font-mono flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || isUnlocked}
          className="h-13 py-3 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs font-bold font-mono flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
        >
          CLEAR
        </button>

        {/* 0 Button */}
        <button
          type="button"
          onClick={() => handleKeyPress('0')}
          disabled={disabled || isUnlocked}
          className="h-13 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-bold text-lg font-mono flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
          0
        </button>

        {/* Enter / Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || isUnlocked}
          className="h-13 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-500 text-white border border-emerald-500/60 text-xs font-bold font-mono flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-950/40"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 text-center text-[10px] text-slate-500 font-mono">
        Hỗ trợ nhập trực tiếp từ phím số & nhấn ENTER
      </div>
    </motion.div>
  );
};
