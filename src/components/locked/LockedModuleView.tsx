import React from 'react';
import { Lock, ShieldAlert, ArrowLeft, Terminal, Key } from 'lucide-react';
import { useGameState, NavModuleId } from '../../context/GameStateContext';

interface LockedModuleViewProps {
  moduleId: NavModuleId;
}

export const LockedModuleView: React.FC<LockedModuleViewProps> = ({ moduleId }) => {
  const { setActiveModule, setIsAdminOpen, currentPhase } = useGameState();

  const getModuleInfo = (id: NavModuleId) => {
    switch (id) {
      case 'b19':
        return {
          title: 'PHÂN KHU B-19 // KHO LƯU TRỮ MẬT',
          phase: 'PHASE 3',
          desc: 'Khu vực lưu trữ hồ sơ tài liệu bảo mật phân khu B-19 đang bị niêm phong. Cần giải mã xong Cửa Nhà kho B và trích xuất thêm dữ liệu.',
          code: 'AUTH-SEC-B19',
        };
      case 'cctv':
        return {
          title: 'HỆ THỐNG LƯU TRỮ CAMERA CCTV',
          phase: 'PHASE 3',
          desc: 'Dữ liệu băng ghi hình an ninh khu vực khuôn viên và hành lang. Quyền truy cập bị khóa cấp độ 3.',
          code: 'CCTV-STREAM-44X',
        };
      case 'vehicles':
        return {
          title: 'HỆ THỐNG GIÁM ĐỊNH PHƯƠNG TIỆN',
          phase: 'PHASE 4',
          desc: 'Cơ sở dữ liệu biển số xe, định vị GPS và lịch trình phương tiện liên quan đến thời điểm 20:10. Yêu cầu mở Phase 4.',
          code: 'VEHICLE-TRACK-V4',
        };
      case 'suspects':
        return {
          title: 'HỒ SƠ NHÂN VẬT & ĐỐI TƯỢNG (DOSSIER)',
          phase: 'PHASE 4',
          desc: 'Hồ sơ lai lịch, lời khai và kết luận đối tượng nghi vấn. Phân hệ kết án sẽ được kích hoạt tại Phase cuối.',
          code: 'SUSPECT-DOSSIER-FINAL',
        };
      default:
        return {
          title: 'KHU VỰC BẢO MẬT ĐANG KHÓA',
          phase: 'LOCKED',
          desc: 'Module này chưa được kích hoạt trong tiến trình hiện tại của vụ án.',
          code: 'SEC-RESTRICTED',
        };
    }
  };

  const info = getModuleInfo(moduleId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none font-mono">
      <div className="max-w-md w-full bg-police-900/80 border border-police-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden space-y-5">
        {/* Top security tape */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

        <div className="w-16 h-16 rounded-full bg-police-950 border border-police-700/80 mx-auto flex items-center justify-center text-rose-500 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/40 uppercase">
            {info.phase} // TRUY CẬP BỊ HẠN CHẾ
          </span>
          <h2 className="text-base font-bold text-white tracking-wide uppercase pt-2">
            {info.title}
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
            {info.desc}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-police-950 border border-police-850 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Mã định danh:</span>
            <span className="text-slate-300 font-semibold">{info.code}</span>
          </div>
          <div className="flex justify-between">
            <span>Giai đoạn hiện tại:</span>
            <span className="text-terminal-amber">Phase {currentPhase}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={() => setActiveModule('dashboard')}
            className="w-full sm:flex-1 py-2.5 rounded-lg bg-police-800 hover:bg-police-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều tra</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-lg bg-police-950 hover:bg-police-850 border border-police-800 text-slate-400 hover:text-terminal-amber text-xs flex items-center justify-center gap-1 transition-colors"
            title="Mở khóa thủ công qua quyền Admin BTC"
          >
            <Key className="w-3.5 h-3.5" />
            <span>GM Override</span>
          </button>
        </div>
      </div>
    </div>
  );
};
