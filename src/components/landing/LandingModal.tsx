import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, Lock, ChevronRight, FileSearch, Fingerprint } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import gameConfig from '../../data/game-config.json';

export const LandingModal: React.FC = () => {
  const { enterCase } = useGameState();

  return (
    <div className="fixed inset-0 z-50 bg-police-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Background scanline & grid effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,34,50,0.6),rgba(0,0,0,0.9))] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative max-w-2xl w-full bg-police-900/90 border border-police-700/60 rounded-xl shadow-2xl p-6 sm:p-10 text-slate-200 overflow-hidden"
      >
        {/* Top classified strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-cyan-500" />

        <div className="flex items-center justify-between border-b border-police-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase font-semibold">
              Hệ thống Điều tra Trực tuyến // Ready
            </span>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 bg-police-800 text-slate-300 rounded border border-police-700">
            CONFIDENTIAL // BẢO MẬT
          </span>
        </div>

        {/* Case Badge & Header */}
        <div className="text-center my-6 space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex p-3 rounded-2xl bg-police-800/80 border border-terminal-amber/30 text-terminal-amber shadow-lg"
          >
            <Fingerprint className="w-12 h-12" />
          </motion.div>

          <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase flex items-center justify-center gap-3">
            <span>{gameConfig.caseId}</span>
            <span className="text-terminal-amber">—</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {gameConfig.caseTitle}
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 font-mono text-xs text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{gameConfig.department}</span>
          </div>
        </div>

        {/* Mission Briefing Box */}
        <div className="bg-police-950/70 border border-police-800/80 rounded-lg p-5 font-mono text-xs text-slate-300 space-y-3 my-6 relative">
          <div className="text-terminal-amber font-semibold tracking-wider flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            <span>CHỈ THỊ ĐIỀU TRA ĐẶC BIỆT</span>
          </div>
          <p className="font-sans leading-relaxed text-slate-300">
            Chào mừng Điều tra viên. Đây là trung tâm phân tích bằng chứng số cho Chuyên án 20:10.
            Bạn sẽ truy cập dữ liệu thiết bị thu giữ, giải mã các mốc thời gian, đối chiếu hình ảnh kỷ niệm
            và mở khóa các khu vực an ninh niêm phong.
          </p>
          <div className="pt-2 border-t border-police-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Giai đoạn kích hoạt: <strong className="text-emerald-400">Phase 1 (Điện thoại cá nhân)</strong></span>
            <span>Trạng thái: <strong className="text-terminal-amber">Đang thụ lý</strong></span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={enterCase}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-terminal-amber to-amber-600 hover:from-amber-400 hover:to-amber-500 text-police-950 font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all text-sm uppercase"
          >
            <span>Enter Case</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </div>

        {/* Subtle footer */}
        <div className="mt-6 text-center text-[10px] font-mono text-slate-500">
          Dữ liệu điều tra được đồng bộ tự động cục bộ (Local Persistence) // Shards of Memory Investigation Hub
        </div>
      </motion.div>
    </div>
  );
};
