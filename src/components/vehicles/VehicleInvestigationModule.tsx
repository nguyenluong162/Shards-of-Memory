import React, { useState } from 'react';
import { Car, Search, MapPin, AlertTriangle, ShieldCheck, Clock, CheckCircle2, Copy, FilePlus } from 'lucide-react';
import vehiclesData from '../../data/vehicles.json';
import { VehicleRecord } from '../../types';
import { useGameState } from '../../context/GameStateContext';

export const VehicleInvestigationModule: React.FC = () => {
  const { addNote } = useGameState();
  const vehicles = vehiclesData as VehicleRecord[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(vehicles[1]); // Default suspicious Ford Ranger

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      v.licensePlate.toLowerCase().includes(q) ||
      v.ownerName.toLowerCase().includes(q) ||
      v.vehicleType.toLowerCase().includes(q)
    );
  });

  const handleAddVehicleNote = (v: VehicleRecord) => {
    addNote({
      title: `Giám định xe [${v.licensePlate}] - ${v.ownerName}`,
      content: `Chủ phương tiện: ${v.ownerName}\nDòng xe: ${v.vehicleType} (${v.color})\nThời điểm & vị trí: ${v.seenAt} tại ${v.location}\nGhi chú giám định: ${v.notes}\nĐánh giá: ${v.isSuspicious ? 'KHẢ NGHI CAO' : 'Bình thường'}`,
      category: 'Vehicle',
      isPinned: v.isSuspicious,
    });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto font-mono text-xs text-slate-200">
      {/* Top Banner */}
      <div className="bg-police-900/80 border border-police-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Hệ Thống Giám Định & Truy Vết Phương Tiện (Phase 4)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Dữ liệu trạm thu phí, camera quét biển số tự động (ANPR) và lịch trình phương tiện liên quan đến đêm 14/10.
          </p>
        </div>

        <div className="text-xs text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded border border-indigo-500/40 font-semibold">
          ANPR DATABASE // 3 BẢN GHI
        </div>
      </div>

      {/* Main vehicle layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Search & Vehicles List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo biển số, chủ sở hữu, loại xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-police-900 border border-police-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* List items */}
          <div className="space-y-2">
            {filteredVehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-police-900 border-indigo-400/80 shadow-md'
                      : 'bg-police-950/60 border-police-850 hover:border-police-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-bold text-white tracking-widest px-2 py-0.5 rounded bg-police-950 border border-police-750">
                      {v.licensePlate}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        v.isSuspicious
                          ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {v.isSuspicious ? 'ĐỐI TƯỢNG NGHI VẤN' : 'ĐÃ ĐỐI CHIẾU'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">{v.ownerName}</span>
                    <span className="text-slate-400 font-sans">{v.vehicleType}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Ghi nhận: {v.seenAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Vehicle Forensics Detail */}
        {selectedVehicle && (
          <div className="lg:col-span-7 bg-police-900/60 border border-police-800 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-police-800 pb-3">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                    HỒ SƠ GIÁM ĐỊNH KỸ THUẬT
                  </span>
                  <h3 className="font-mono text-xl font-bold text-white tracking-wider">
                    {selectedVehicle.licensePlate}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    Chủ phương tiện đăng ký: <strong className="text-white">{selectedVehicle.ownerName}</strong>
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                    selectedVehicle.isSuspicious
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {selectedVehicle.isSuspicious ? 'KHẢ NGHI CAO' : 'NGOẠI PHẠM'}
                </span>
              </div>

              {/* Data table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-police-950/80 p-3.5 rounded-lg border border-police-850">
                <div>
                  <span className="text-[10px] text-slate-500 block">Dòng xe:</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.vehicleType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Màu sơn:</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.color}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Thời điểm phát hiện:</span>
                  <span className="text-terminal-amber font-semibold">{selectedVehicle.seenAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Vị trí ghi nhận:</span>
                  <span className="text-cyan-300 font-semibold">{selectedVehicle.location}</span>
                </div>
              </div>

              {/* Forensics analysis notes */}
              <div className="p-3.5 rounded-lg bg-police-950 border border-police-800 space-y-2">
                <span className="text-terminal-amber font-bold text-xs uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  KẾT QUẢ GIÁM ĐỊNH HIỆN TRƯỜNG:
                </span>
                <p className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedVehicle.notes}
                </p>
              </div>
            </div>

            {/* Actions button */}
            <div className="pt-2 border-t border-police-800 flex justify-end">
              <button
                onClick={() => handleAddVehicleNote(selectedVehicle)}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <FilePlus className="w-4 h-4" />
                <span>Thêm Dữ Liệu Xe Vào Case Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
