import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Lock, FileText, CheckCircle2, AlertTriangle, ArrowRight, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

export const WarehouseInterior: React.FC = () => {
  const { lockWarehouseB, setActiveModule } = useGameState();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto"
    >
      {/* Top Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-bold text-white uppercase">
                Bên Trong Nhà Kho B // ĐÃ TRUY CẬP THÀNH CÔNG
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PHASE 2 COMPLETED
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Chốt từ đã mở. Toàn bộ phân khu lưu trữ hồ sơ của Nhà kho B đã được bảo đảm.
            </p>
          </div>
        </div>

        <button
          onClick={lockWarehouseB}
          className="px-3 py-1.5 rounded bg-police-900 border border-police-700 hover:border-amber-400 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
          title="Khóa lại cửa kho B để thử nghiệm lại keypad"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Khóa cửa lại</span>
        </button>
      </div>

      {/* Discovered Items & Dossiers inside Warehouse B */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Document 1: Kệ tài liệu lưu trữ A-04 */}
        <div className="bg-police-900/70 border border-police-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-terminal-amber/50 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-terminal-amber font-semibold">TÀI LIỆU #01</span>
              <span>KỆ A-04</span>
            </div>
            <h3 className="font-mono font-bold text-slate-100 text-sm mb-1.5">
              Hồ sơ Bàn giao Thiết bị Phòng máy A2
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Biên bản kiểm kê thiết bị ghi nhận đợt thu hồi hệ thống lưu trữ camera trước ngày bế giảng năm 2023. Một ổ cứng di động đã được chuyển vào Phân khu B-19.
            </p>
          </div>
          <button
            onClick={() => setSelectedDoc('doc1')}
            className="w-full py-2 rounded bg-police-950 border border-police-800 hover:border-terminal-amber/60 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xem chi tiết hồ sơ</span>
          </button>
        </div>

        {/* Document 2: Bản vẽ hành lang kỹ thuật */}
        <div className="bg-police-900/70 border border-police-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-terminal-amber/50 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-semibold">SƠ ĐỒ #02</span>
              <span>PHÂN KHU B</span>
            </div>
            <h3 className="font-mono font-bold text-slate-100 text-sm mb-1.5">
              Sơ đồ Kết nối Camera Giám sát Hành lang
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Sơ đồ kỹ thuật cho thấy camera số 03 ghi lại toàn bộ lối ra vào giữa Kho B và khu nhà xưởng phía sau. Dữ liệu trích xuất CCTV thuộc về Phase 3.
            </p>
          </div>
          <button
            onClick={() => setSelectedDoc('doc2')}
            className="w-full py-2 rounded bg-police-950 border border-police-800 hover:border-cyan-400/60 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xem sơ đồ kết nối</span>
          </button>
        </div>

        {/* Transition box to Next Phase */}
        <div className="bg-gradient-to-br from-police-900 to-police-950 border border-police-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">TIẾP NỐI ĐIỀU TRA</span>
            </div>
            <h3 className="font-mono font-bold text-white text-sm mb-1.5">
              Tiến trình Chuyên án Mở rộng
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Các dữ kiện mới từ Kho B đã được tự động thêm vào Bảng Điều Tra (Investigation Hub). Người chơi có thể ghi chép thêm giả thuyết hoặc chờ mở Phase 3.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('dashboard')}
            className="w-full py-2 rounded bg-terminal-amber hover:bg-amber-400 text-police-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md uppercase"
          >
            <span>Về Bảng Điều Tra</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-police-900 border border-police-700 rounded-xl p-6 font-mono text-xs text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-police-800 pb-2">
              <span className="text-terminal-amber font-bold uppercase">
                {selectedDoc === 'doc1'
                  ? 'TRÍCH SAO BIÊN BẢN KIỂM KÊ THIẾT BỊ'
                  : 'SƠ ĐỒ MẠNG GIÁM SÁT HÀNH LANG KHO B'}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedDoc === 'doc1' ? (
                <>
                  <p className="font-mono font-semibold text-white mb-2">
                    BIÊN BẢN SỐ: 84/BB-CS2010
                  </p>
                  <p className="mb-2">
                    Vào hồi 16:30 ngày 15/03/2023, tổ công tác đã tiến hành niêm phong lô hồ sơ tại dãy tủ số 04 thuộc Kho B.
                  </p>
                  <p className="mb-2">
                    - Danh mục bàn giao: 02 tập hồ sơ nhân sự, 01 thẻ nhớ SD dung lượng 64GB ghi nhãn "A2-K49", 01 cuốn sổ tay công tác.
                  </p>
                  <p>
                    - Tình trạng: Các niêm phong cơ học nguyên vẹn. Dữ liệu trích xuất chỉ ra đối tượng Trương Nguyên Minh có mặt tại vị trí này trước thời điểm xảy ra sự cố 20:10.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono font-semibold text-white mb-2">
                    KỸ THUẬT AN NINH: PHÂN KHU B
                  </p>
                  <p className="mb-2">
                    - Camera CCTV-03: Góc quay bao quát hành lang chính và cửa thoát hiểm sau.
                  </p>
                  <p className="mb-2">
                    - Cơ chế khóa cửa: Khóa điện tử đồng bộ mã theo timestamp giây cuối cùng của bản ghi hình ảnh.
                  </p>
                  <p>
                    - Lối thông tiếp theo: Hành lang phụ dẫn trực tiếp tới Cụm Lưu Trữ B-19 (Đang yêu cầu lệnh truy cập Phase 3).
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-police-800">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded bg-police-800 hover:bg-police-700 text-slate-200 font-mono text-xs"
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
