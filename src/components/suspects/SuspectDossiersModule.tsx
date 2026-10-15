import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, Award, CheckCircle2, AlertCircle, Gavel, FileCheck, HelpCircle } from 'lucide-react';
import suspectsData from '../../data/suspects.json';
import { SuspectProfile, EvidenceItem } from '../../types';
import { useGameState } from '../../context/GameStateContext';

export const SuspectDossiersModule: React.FC = () => {
  const { evidenceList, submitVerdict, verdictResult, phase4Complete } = useGameState();
  const suspects = suspectsData as SuspectProfile[];

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('SUS-02');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('EV-07');
  const [motiveInput, setMotiveInput] = useState<string>(
    'Lê Thanh Bình bí mật đột nhập Kho B và B-19 để lấy lại ổ cứng và dữ liệu thiết kế kỷ yếu, sau đó tẩu thoát bằng xe bán tải lúc 20:08.'
  );

  const activeSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];

  const handleVerdictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerdict(selectedSuspectId, selectedEvidenceId, motiveInput);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto font-mono text-xs text-slate-200">
      {/* Top Banner */}
      <div className="bg-police-900/80 border border-police-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-terminal-amber" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Hồ Sơ Đối Tượng & Phán Quyết Cuối Cùng (Phase 4)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Đối chiếu lời khai, bằng chứng ngoại phạm và đưa ra kết luận chuyên án 20:10.
          </p>
        </div>

        {phase4Complete ? (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>VỤ ÁN ĐÃ PHÁ THÀNH CÔNG!</span>
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
            GIAI ĐOẠN PHÁN QUYẾT // ACTIVE
          </span>
        )}
      </div>

      {/* Case Solved Ending Banner if Completed */}
      {phase4Complete && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-police-900 to-emerald-950/90 border-2 border-emerald-500/60 shadow-2xl text-emerald-100 space-y-2"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
            <Award className="w-5 h-5" />
            <span>BÁO CÁO KẾT LUẬN CHUYÊN ÁN: CASE 20:10 — SHARDS OF MEMORY HOÀN TẤT</span>
          </div>
          <p className="font-sans text-xs leading-relaxed text-slate-200">
            Bằng việc xâu chuỗi thông tin từ chiếc điện thoại bị thu giữ của Trương Nguyên Minh (Phase 1), giải mã dấu thời gian trên hình ảnh trích xuất để mở cửa Nhà kho B (Phase 2), mở khóa két lưu trữ phân khu B-19 và hệ thống camera CCTV (Phase 3), lực lượng điều tra đã phát hiện bằng chứng không thể chối cãi về chiếc xe bán tải Ford Ranger của <strong>Lê Thanh Bình</strong> rời khỏi hiện trường lúc 20:08 (Phase 4). Toàn bộ các mảnh ký ức (shards) đã được ghép lại thành công!
          </p>
        </motion.div>
      )}

      {/* Suspects Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suspects.map((suspect) => {
          const isSelected = selectedSuspectId === suspect.id;
          return (
            <div
              key={suspect.id}
              onClick={() => setSelectedSuspectId(suspect.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-police-900 border-terminal-amber shadow-lg shadow-amber-950/30'
                  : 'bg-police-950/60 border-police-850 hover:border-police-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white uppercase">{suspect.id}</span>
                  <span className="text-[10px] text-slate-400">{suspect.age} tuổi</span>
                </div>
                <h3 className="font-bold text-slate-100 text-sm">{suspect.name}</h3>
                <p className="text-[11px] text-terminal-amber/90 font-sans line-clamp-1">{suspect.role}</p>
              </div>

              <div className="text-[11px] font-sans text-slate-400 line-clamp-2 border-t border-police-800/80 pt-2">
                {suspect.relationship}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Suspect Dossier Details */}
      <div className="bg-police-900/60 border border-police-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-police-800 pb-3 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hồ Sơ Thẩm Vấn:</span>
            <h3 className="text-lg font-bold text-white uppercase">{activeSuspect.name}</h3>
            <span className="text-xs text-slate-300 font-sans">{activeSuspect.role}</span>
          </div>

          <div className="text-xs font-mono px-3 py-1 rounded bg-police-950 border border-police-700 text-slate-300">
            Mã đối tượng: {activeSuspect.id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-police-950/80 border border-police-850 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Lời khai ngoại phạm:</span>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">{activeSuspect.alibi}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-police-950/80 border border-police-850 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Lời khai trực tiếp:</span>
            <p className="font-sans text-xs text-slate-300 leading-relaxed italic">"{activeSuspect.statement}"</p>
          </div>

          <div className="p-3.5 rounded-lg bg-police-950/80 border border-police-850 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase block font-bold">Ghi chú điều tra:</span>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">{activeSuspect.notes}</p>
          </div>
        </div>
      </div>

      {/* Final Verdict Submission Form */}
      <form
        onSubmit={handleVerdictSubmit}
        className="bg-gradient-to-br from-police-900 to-police-950 border-2 border-police-700/80 rounded-2xl p-6 space-y-5 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-police-800 pb-3">
          <Gavel className="w-5 h-5 text-terminal-amber" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Đệ Trình Phán Quyết Điều Tra (Final Case Verdict)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-bold">
              1. Chọn Đối Tượng Bị Cáo Buộc:
            </label>
            <select
              value={selectedSuspectId}
              onChange={(e) => setSelectedSuspectId(e.target.value)}
              className="w-full px-3 py-2 bg-police-950 border border-police-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-terminal-amber"
            >
              {suspects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}: {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-bold">
              2. Chọn Vật Chứng Mang Tính Then Chốt:
            </label>
            <select
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              className="w-full px-3 py-2 bg-police-950 border border-police-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-terminal-amber"
            >
              {evidenceList.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.id}: {ev.name} {ev.isUnlocked ? '(Đã mở)' : '(Chưa mở)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1 font-bold">
            3. Động Cơ & Tóm Tắt Diễn Biến Sự Việc:
          </label>
          <textarea
            rows={3}
            value={motiveInput}
            onChange={(e) => setMotiveInput(e.target.value)}
            className="w-full px-3 py-2 bg-police-950 border border-police-700 rounded-lg text-xs font-sans text-slate-200 focus:outline-none focus:border-terminal-amber"
            placeholder="Mô tả suy luận và động cơ của đối tượng..."
          />
        </div>

        {verdictResult && !verdictResult.isCorrect && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Phán quyết chưa chính xác. Hãy kiểm tra kỹ lời khai và dữ liệu xe bán tải rời lối sau lúc 20:08.</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-terminal-amber to-amber-600 hover:from-amber-400 hover:to-amber-500 text-police-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-950/50 transition-all"
          >
            <FileCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Đệ Trình Phán Quyết Cuối Cùng</span>
          </button>
        </div>
      </form>
    </div>
  );
};
