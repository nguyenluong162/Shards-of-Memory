import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, Lock, Unlock, HardDrive, FileText, CheckCircle2, AlertCircle, Sparkles, Terminal, CornerDownLeft } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import { playAudio } from '../../utils/audio';

export const B19ArchiveModule: React.FC = () => {
  const { b19Unlocked, unlockB19, lockB19, puzzles, hintsEnabled, setActiveModule } = useGameState();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passcode.trim().toUpperCase().replace(/[-\s]/g, '');
    const cleanTarget = (puzzles.phase3B19Passcode || 'A2K49').trim().toUpperCase().replace(/[-\s]/g, '');
    const accepted = (puzzles.phase3AcceptedCodes || ['A2K49', 'A2-K49', 'B19-A2K49', 'A2', 'K49']).map((c) =>
      c.toUpperCase().replace(/[-\s]/g, '')
    );

    if (cleanInput === cleanTarget || accepted.includes(cleanInput)) {
      unlockB19();
      setErrorMsg('');
    } else {
      playAudio.errorBuzz();
      setIsShaking(true);
      setErrorMsg('MÃ ĐỊNH DANH BẢO MẬT KHÔNG HỢP LỆ');
      setTimeout(() => {
        setIsShaking(false);
        setPasscode('');
      }, 600);
    }
  };

  if (!b19Unlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-police-950 font-mono select-none">
        <motion.div
          animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-police-900/90 border border-police-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-police-800 pb-3">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                PHÂN KHU B-19 // SECURE VAULT
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40">
              ENCRYPTED
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-police-950 border border-police-800 mx-auto flex items-center justify-center text-cyan-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase">
              Yêu cầu Khóa Định Danh Lưu Trữ
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Két dữ liệu B-19 yêu cầu nhập chuỗi định danh niêm phong (được ghi nhận trong biên bản bàn giao thiết bị phòng máy ở Kho B).
            </p>
          </div>

          {hintsEnabled && (
            <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GỢI Ý TỪ BAN TỔ CHỨC:</span>
              </div>
              <p className="font-sans text-[11px] text-amber-100/90">
                {puzzles.phase3Hint}
              </p>
            </div>
          )}

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nhập mã định danh (Ví dụ: A2K49)..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 bg-police-950 border border-police-700 rounded-lg text-center text-sm tracking-widest text-white uppercase focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                autoFocus
              />
              {errorMsg && (
                <div className="text-rose-400 text-[11px] text-center mt-1.5 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>Giải Mã Két Lưu Trữ</span>
            </button>
          </form>

          <div className="text-center text-[10px] text-slate-500">
            Gợi ý: Kiểm tra mục tài liệu kiểm kê phòng máy đã mở trong Nhà kho B
          </div>
        </motion.div>
      </div>
    );
  }

  // Unlocked B-19 Vault view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto"
    >
      {/* Banner */}
      <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-bold text-white uppercase">
                Phân Khu B-19 // KÉT LƯU TRỮ DỮ LIỆU ĐÃ MỞ
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PHASE 3 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Đã trích xuất ổ cứng số EV-06 và danh sách phương tiện nghi vấn. Phase 4 đã sẵn sàng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('cctv')}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs transition-colors"
          >
            Mở Camera CCTV →
          </button>
          <button
            onClick={lockB19}
            className="px-3 py-1.5 rounded bg-police-900 border border-police-700 hover:border-amber-400 text-slate-300 text-xs font-mono transition-colors"
          >
            Khóa lại
          </button>
        </div>
      </div>

      {/* Recovered files list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File 1 */}
        <div className="bg-police-900/70 border border-police-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">TỆP KHÔI PHỤC #01</span>
            <span>SEC_LOG_2010.DAT</span>
          </div>
          <h3 className="font-mono font-bold text-slate-100 text-sm">
            Nhật Ký Cảm Biến Cửa Thoát Hiểm Phía Sau
          </h3>
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            - 19:55: Cửa thoát hiểm kích hoạt cảm biến từ trường.<br/>
            - 20:08: Phát hiện rung chấn mạnh tại cổng sau.<br/>
            - 20:08:15: Phương tiện tăng tốc rời đi về hướng Quốc lộ 1A.
          </p>
          <button
            onClick={() => setSelectedFile('log')}
            className="w-full py-2 rounded bg-police-950 border border-police-800 hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xem đầy đủ bản ghi cảm biến</span>
          </button>
        </div>

        {/* File 2 */}
        <div className="bg-police-900/70 border border-police-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">TỆP KHÔI PHỤC #02</span>
            <span>INVOICE_STUDIO_BINH.PDF</span>
          </div>
          <h3 className="font-mono font-bold text-slate-100 text-sm">
            Hóa Đơn Thuê Thiết Bị Đo Đạc & In Ấn
          </h3>
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            Hợp đồng bàn giao mẫu in kỷ yếu có chữ ký của Lê Thanh Bình. Đính kèm biên nhận mượn chìa khóa cửa kho phụ ngày 12/10.
          </p>
          <button
            onClick={() => setSelectedFile('invoice')}
            className="w-full py-2 rounded bg-police-950 border border-police-800 hover:border-amber-400 text-amber-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xem chi tiết hợp đồng</span>
          </button>
        </div>
      </div>

      {/* Modal View for File */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-police-900 border border-police-700 rounded-xl p-6 font-mono text-xs text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-police-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase">
                {selectedFile === 'log' ? 'BẢN GHI CẢM BIẾN TỪ TRƯỜNG KHO B-19' : 'HỢP ĐỒNG BÀN GIAO THIẾT BỊ SỐ 12/HĐ'}
              </span>
              <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedFile === 'log' ? (
                <>
                  <p className="font-mono font-semibold text-white mb-2">HỆ THỐNG AN NINH TẬP TRUNG B-19</p>
                  <p className="mb-2">Ghi nhận sự cố tại khu vực lối thoát hiểm sau lúc 20:08:15 ngày 14/10.</p>
                  <p className="mb-2">Dấu bánh xe tải trọng lớn để lại trên nền đất bùn phía sau nhà kho.</p>
                  <p>Khuyến nghị: Chuyển dữ liệu sang Hệ thống Giám định Phương tiện (Phase 4) để truy vết biển số xe 30F-512.98.</p>
                </>
              ) : (
                <>
                  <p className="font-mono font-semibold text-white mb-2">STUDIO THIẾT KẾ & IN ẤN BÌNH AN</p>
                  <p className="mb-2">Đại diện ký nhận: Lê Thanh Bình</p>
                  <p className="mb-2">Mục đích: Lấy lại các tập tin gốc thiết kế kỷ yếu và dữ liệu lưu trữ phòng máy.</p>
                  <p>Ghi chú: Đối tượng có sở hữu xe bán tải Ford Ranger đen nhám (Biển số: 30F-512.98).</p>
                </>
              )}
            </div>
            <div className="flex justify-end pt-2 border-t border-police-800">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-1.5 rounded bg-police-800 hover:bg-police-700 text-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
