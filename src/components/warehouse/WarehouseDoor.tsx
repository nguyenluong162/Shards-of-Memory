import React from 'react';
import { motion } from 'framer-motion';
import { WarehouseInterior } from './WarehouseInterior';
import { NumericKeypad } from './NumericKeypad';
import { useGameState } from '../../context/GameStateContext';
import { ShieldAlert, AlertTriangle, Video, Lock, Radio, Sparkles } from 'lucide-react';

export const WarehouseDoor: React.FC = () => {
  const { warehouseBUnlocked, unlockWarehouseB, puzzles, hintsEnabled } = useGameState();

  const handleCodeSubmit = (inputCode: string): boolean => {
    const cleanInput = inputCode.trim().replace(/[:\s-]/g, '');
    const cleanTarget = (puzzles.phase2WarehouseCode || '160349').trim().replace(/[:\s-]/g, '');
    const accepted = (puzzles.phase2AcceptedCodes || ['160349', '1603', '12031603']).map((c) =>
      c.replace(/[:\s-]/g, '')
    );

    if (cleanInput === cleanTarget || accepted.includes(cleanInput)) {
      unlockWarehouseB();
      return true;
    }
    return false;
  };

  // If already unlocked, display the interior view!
  if (warehouseBUnlocked) {
    return <WarehouseInterior />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-police-950 select-none">
      {/* CCTV Ambient Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.3),transparent_80%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] opacity-70" />

      {/* CCTV HUD Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-400 z-10">
        <div className="flex items-center gap-2 bg-police-950/80 px-3 py-1.5 rounded border border-police-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-white font-semibold">CAM-B04 // LỐI VÀO KHO B</span>
          <span className="text-slate-500">• LIVE</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-police-950/80 px-3 py-1.5 rounded border border-police-800 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>TÍN HIỆU KHÓA TỪ: ACTIVE</span>
        </div>
      </div>

      {/* Heavy Industrial Door Container */}
      <div className="relative w-full max-w-4xl min-h-[520px] rounded-2xl border-4 border-slate-800 bg-gradient-to-b from-slate-900 via-police-900 to-black p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mt-10">
        {/* Metal door texture lines and industrial rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 shadow-inner" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 shadow-inner" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 shadow-inner" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 shadow-inner" />

        {/* Left: Industrial Door Decals & Hazard Warning */}
        <div className="flex-1 space-y-5 text-slate-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Khu vực niêm phong an ninh</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight uppercase">
              NHÀ KHO B // CỬA THÉP SỐ 02
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Hệ thống chốt khóa điện từ tự động ngắt khi nhập đúng mã định danh phiên an ninh.
            </p>
          </div>

          {/* Warning notice box */}
          <div className="p-4 rounded-xl bg-police-950/80 border border-police-800 font-mono text-xs space-y-2 text-slate-300">
            <div className="text-terminal-amber font-semibold flex items-center gap-1.5 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>CHỈ DẪN KHÓA TRUY CẬP (PHASE 2)</span>
            </div>
            <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
              Mã truy cập được mã hóa theo dấu vết thời gian (timestamp) lưu trong dữ liệu hình ảnh hoặc bản ghi trích xuất từ điện thoại của đối tượng.
            </p>
            {hintsEnabled && (
              <div className="pt-2 border-t border-police-800 text-amber-300 text-[11px] flex items-start gap-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>Gợi ý: {puzzles.phase2Hint}</span>
              </div>
            )}
          </div>

          {/* Hazard stripe line */}
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_10px,#0f172a_10px,#0f172a_20px)] rounded opacity-80" />
        </div>

        {/* Right: Keypad Device mounted on door */}
        <div className="shrink-0 flex items-center justify-center">
          <NumericKeypad
            onCodeSubmit={handleCodeSubmit}
            isUnlocked={warehouseBUnlocked}
          />
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 font-mono mt-4">
        Cổng An ninh Nhà kho Phân khu B // Shards of Memory Investigation Terminal
      </div>
    </div>
  );
};
