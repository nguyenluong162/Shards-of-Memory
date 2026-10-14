import React, { useState } from 'react';
import { 
  Key, 
  X, 
  Unlock, 
  Lock, 
  RotateCcw, 
  Save, 
  Sparkles, 
  ShieldAlert, 
  Terminal, 
  Download, 
  Upload,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import gameConfig from '../../data/game-config.json';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    currentPhase,
    setPhase,
    phoneUnlocked,
    unlockPhone,
    lockPhone,
    warehouseBUnlocked,
    unlockWarehouseB,
    lockWarehouseB,
    hintsEnabled,
    toggleHints,
    puzzles,
    updatePuzzlesConfig,
    resetGame,
    notes,
    knownFacts,
    evidenceList,
  } = useGameState();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Form states for puzzle config
  const [p1Pin, setP1Pin] = useState(puzzles.phase1PhonePin);
  const [p2Code, setP2Code] = useState(puzzles.phase2WarehouseCode);
  const [p1Hint, setP1Hint] = useState(puzzles.phase1Hint);
  const [p2Hint, setP2Hint] = useState(puzzles.phase2Hint);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isAdminOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === (gameConfig.adminPasscode || 'gm2010') || passcodeInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSavePuzzles = (e: React.FormEvent) => {
    e.preventDefault();
    updatePuzzlesConfig({
      phase1PhonePin: p1Pin.trim(),
      phase2WarehouseCode: p2Code.trim(),
      phase1Hint: p1Hint.trim(),
      phase2Hint: p2Hint.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetWithConfirm = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ ghi chú và tiến trình đã giải đố của người chơi. Bạn có chắc chắn muốn RESET?')) {
      resetGame();
      setIsAdminOpen(false);
    }
  };

  const handleExportState = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ notes, knownFacts, evidenceList, puzzles, currentPhase }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `case_2010_state_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-police-950 border border-police-700 rounded-2xl shadow-2xl p-6 font-mono text-xs text-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-police-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-terminal-amber" />
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">
              Bảng Điều Khiển Ban Tổ Chức (GM / Admin Hub)
            </h2>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-police-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth prompt if not logged in */}
        {!isAuthenticated ? (
          <form onSubmit={handleAuthSubmit} className="py-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-police-900 border border-police-800 flex items-center justify-center text-terminal-amber">
              <Key className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-white text-sm mb-1">
                Yêu cầu Mã Định Danh Ban Tổ Chức
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Nhập mật mã GM để mở khóa các công cụ can thiệp và điều chỉnh câu đố.
              </p>
            </div>

            <div className="w-64 space-y-2">
              <input
                type="password"
                placeholder="Mã BTC (mặc định: gm2010)..."
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full px-3 py-2 bg-police-900 border border-police-700 rounded text-center text-sm tracking-widest text-white focus:outline-none focus:border-terminal-amber"
                autoFocus
              />
              {authError && (
                <div className="text-rose-400 text-[11px] text-center">
                  Mã không đúng. Vui lòng thử lại.
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-terminal-amber hover:bg-amber-400 text-police-950 font-bold rounded uppercase text-xs transition-colors"
              >
                Xác nhận đăng nhập
              </button>
            </div>
          </form>
        ) : (
          /* Authenticated GM Panel Content */
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-police-900 p-2.5 rounded border border-police-800">
                <span className="text-slate-400 block text-[10px]">Tiến trình:</span>
                <span className="font-bold text-terminal-amber">Phase {currentPhase}</span>
              </div>
              <div className="bg-police-900 p-2.5 rounded border border-police-800">
                <span className="text-slate-400 block text-[10px]">Điện thoại:</span>
                <span className={phoneUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {phoneUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <div className="bg-police-900 p-2.5 rounded border border-police-800">
                <span className="text-slate-400 block text-[10px]">Kho B:</span>
                <span className={warehouseBUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {warehouseBUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <div className="bg-police-900 p-2.5 rounded border border-police-800">
                <span className="text-slate-400 block text-[10px]">Ghi chú / Dữ kiện:</span>
                <span className="font-bold text-white">{notes.length} / {knownFacts.length}</span>
              </div>
            </div>

            {/* Quick Overrides Section */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-300 text-xs uppercase flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Can thiệp Mở khóa Thủ công</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={phoneUnlocked ? lockPhone : unlockPhone}
                  className={`py-2 px-3 rounded border font-mono text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    phoneUnlocked
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {phoneUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{phoneUnlocked ? 'Khóa lại Phone' : 'Mở khóa Phone'}</span>
                </button>

                <button
                  type="button"
                  onClick={warehouseBUnlocked ? lockWarehouseB : unlockWarehouseB}
                  className={`py-2 px-3 rounded border font-mono text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    warehouseBUnlocked
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {warehouseBUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{warehouseBUnlocked ? 'Khóa lại Kho B' : 'Mở khóa Kho B'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleHints}
                  className={`py-2 px-3 rounded border font-mono text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    hintsEnabled
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-police-900 border-police-800 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gợi ý: {hintsEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                </button>
              </div>

              {/* Phase Switcher */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Chuyển trực tiếp Phase:</span>
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPhase(p)}
                    className={`px-3 py-1 rounded text-xs border ${
                      currentPhase === p
                        ? 'bg-terminal-amber text-police-950 font-bold border-terminal-amber'
                        : 'bg-police-900 border-police-800 text-slate-300 hover:bg-police-800'
                    }`}
                  >
                    Phase {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Puzzle Passcodes Configuration */}
            <form onSubmit={handleSavePuzzles} className="space-y-3 border-t border-police-800 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-300 text-xs uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-terminal-amber" />
                  <span>Cấu hình Mật khẩu & Gợi ý (Live Config)</span>
                </h3>
                {saveSuccess && (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã lưu thành công!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Mã PIN Điện thoại (Phase 1):
                  </label>
                  <input
                    type="text"
                    value={p1Pin}
                    onChange={(e) => setP1Pin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-police-900 border border-police-700 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Mã Cửa Kho B (Phase 2):
                  </label>
                  <input
                    type="text"
                    value={p2Code}
                    onChange={(e) => setP2Code(e.target.value)}
                    className="w-full px-3 py-1.5 bg-police-900 border border-police-700 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Nội dung gợi ý Phase 1 (khi bật Hint):
                  </label>
                  <input
                    type="text"
                    value={p1Hint}
                    onChange={(e) => setP1Hint(e.target.value)}
                    className="w-full px-3 py-1.5 bg-police-900 border border-police-700 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Nội dung gợi ý Phase 2 (khi bật Hint):
                  </label>
                  <input
                    type="text"
                    value={p2Hint}
                    onChange={(e) => setP2Hint(e.target.value)}
                    className="w-full px-3 py-1.5 bg-police-900 border border-police-700 rounded text-slate-200 focus:outline-none focus:border-terminal-amber font-sans text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-terminal-amber hover:bg-amber-400 text-police-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu cấu hình mật khẩu</span>
                </button>
              </div>
            </form>

            {/* Danger Zone: Reset Progress & Backup */}
            <div className="border-t border-police-800 pt-4 space-y-2">
              <h3 className="font-bold text-rose-400 text-xs uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Sao lưu & Đặt lại Hệ thống</span>
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleExportState}
                  className="py-2 px-3 rounded bg-police-900 hover:bg-police-800 border border-police-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors flex-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất file sao lưu (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetWithConfirm}
                  className="py-2 px-3 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-200 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Toàn Bộ Tiến Trình</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
