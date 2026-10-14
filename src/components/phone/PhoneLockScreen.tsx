import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, Unlock, AlertCircle } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import { playAudio } from '../../utils/audio';

interface PhoneLockScreenProps {
  onUnlockSuccess: () => void;
}

export const PhoneLockScreen: React.FC<PhoneLockScreenProps> = ({ onUnlockSuccess }) => {
  const { puzzles, unlockPhone } = useGameState();
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const targetPin = (puzzles.phase1PhonePin || '2010').trim();

  const handleDigit = (digit: string) => {
    if (pin.length >= 8) return;
    playAudio.keypadBeep(700);
    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMessage('');

    // If matches target length (e.g. 4) or user continues, we check
    if (nextPin.length === targetPin.length) {
      validatePin(nextPin);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const validatePin = (inputPin: string) => {
    if (inputPin === targetPin) {
      setErrorMessage('');
      playAudio.accessGranted();
      unlockPhone();
      onUnlockSuccess();
    } else {
      playAudio.errorBuzz();
      setIsShaking(true);
      setErrorMessage('Mật khẩu không chính xác');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleDelete();
    } else if (e.key === 'Enter') {
      validatePin(pin);
    }
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.4 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-900 via-police-950 to-black text-white select-none focus:outline-none"
    >
      {/* Top Lock Icon & Clock */}
      <div className="flex flex-col items-center pt-8 space-y-2">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-2">
          <Lock className="w-5 h-5 text-slate-300" />
        </div>
        <div className="text-4xl font-light tracking-tight font-mono">
          20:10
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Thứ Tư, 14 tháng 10
        </div>
      </div>

      {/* PIN Dots & Error message */}
      <div className="flex flex-col items-center space-y-3 my-4">
        <div className="text-xs font-mono text-slate-300">
          Nhập mật khẩu thiết bị
        </div>

        {/* PIN indicator circles */}
        <div className="flex items-center gap-4 h-6">
          {Array.from({ length: Math.max(targetPin.length, 4) }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                idx < pin.length
                  ? 'bg-white border-white scale-110 shadow-glow'
                  : 'border-white/40 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Error text */}
        <div className="h-4 text-center">
          {errorMessage && (
            <span className="text-[11px] font-mono text-rose-400 animate-pulse flex items-center gap-1 justify-center">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </span>
          )}
        </div>
      </div>

      {/* Keypad Grid (3x4) */}
      <div className="w-full max-w-[260px] pb-6">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="w-16 h-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center transition-all active:scale-95 text-xl font-light font-mono shadow-sm"
            >
              <span>{digit}</span>
            </button>
          ))}

          {/* Bottom row: empty, 0, delete */}
          <div className="w-16 h-16 mx-auto" />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-16 h-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center transition-all active:scale-95 text-xl font-light font-mono shadow-sm"
          >
            <span>0</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-16 mx-auto rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
            title="Xóa ký tự"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-500 font-mono mt-4">
          Hỗ trợ phím số và Backspace trên bàn phím máy tính
        </div>
      </div>
    </motion.div>
  );
};
