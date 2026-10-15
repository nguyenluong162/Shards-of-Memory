import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Pause, FastForward, Camera, Radio, AlertTriangle, Eye, ShieldCheck, Clock } from 'lucide-react';
import cctvData from '../../data/cctv.json';
import { CCTVCamera } from '../../types';
import { useGameState } from '../../context/GameStateContext';

export const CCTVArchiveModule: React.FC = () => {
  const { addNote } = useGameState();
  const cameras = cctvData as CCTVCamera[];
  const [selectedCam, setSelectedCam] = useState<CCTVCamera>(cameras[2]); // Default to CAM-03 (Kho B)
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const handleTakeSnapshot = () => {
    addNote({
      title: `Trích xuất CCTV [${selectedCam.id}] - ${selectedCam.name}`,
      content: `Dữ liệu ghi hình tại: ${selectedCam.location}\nThời điểm: ${selectedCam.timestamp}\nChi tiết: ${selectedCam.description}\nManh mối: ${selectedCam.clueInfo || 'N/A'}`,
      category: 'Evidence',
      isPinned: false,
    });
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto font-mono text-xs text-slate-200">
      {/* Top Banner */}
      <div className="bg-police-900/80 border border-police-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Hệ Thống Trích Xuất & Giám Sát CCTV (Phase 3)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Bản ghi an ninh 4 kênh camera kỹ thuật số tại khuôn viên vụ án 20:10.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">4 KÊNH HOẠT ĐỘNG // SYNCED</span>
        </div>
      </div>

      {/* Main Player & Camera Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left/Main: CCTV Player Screen */}
        <div className="lg:col-span-8 flex flex-col bg-black rounded-xl border border-police-700/80 overflow-hidden shadow-2xl relative">
          {/* CCTV HUD Overlay */}
          <div className="p-3 bg-black/60 border-b border-white/10 flex items-center justify-between z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold text-white tracking-widest uppercase">
                {selectedCam.id} // {selectedCam.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedCam.timestamp}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-police-800 text-[10px] text-slate-400">
                {playbackSpeed}x REC
              </span>
            </div>
          </div>

          {/* Video Viewport with Scanline Overlay */}
          <div className="relative aspect-video w-full flex items-center justify-center bg-slate-950 overflow-hidden">
            <img
              src={selectedCam.imageUrl}
              alt={selectedCam.name}
              className={`w-full h-full object-cover select-none transition-transform duration-700 ${
                isPlaying ? 'scale-[1.01]' : 'scale-100 grayscale-[20%]'
              }`}
            />

            {/* Scanlines filter */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_2px)] pointer-events-none" />

            {/* Crosshair target overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full pointer-events-none" />

            {/* Bottom info banner */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md p-2.5 rounded border border-white/10 text-[11px] space-y-1">
              <div className="text-terminal-amber font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PHÁT HIỆN DẤU VẾT TRỌNG TÂM:</span>
              </div>
              <p className="font-sans text-slate-200 leading-relaxed">
                {selectedCam.clueInfo || selectedCam.description}
              </p>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="p-3 bg-police-950 border-t border-police-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded bg-police-800 hover:bg-police-700 text-white flex items-center gap-1.5 transition-colors font-semibold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Tạm Dừng' : 'Phát'}</span>
              </button>

              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="px-2.5 py-1.5 rounded bg-police-800 hover:bg-police-700 text-slate-300 flex items-center gap-1 transition-colors"
                title="Tốc độ tua lại"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{playbackSpeed}x</span>
              </button>
            </div>

            {/* Snapshot to Notes button */}
            <button
              onClick={handleTakeSnapshot}
              className={`px-3.5 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all ${
                snapshotTaken
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-terminal-amber hover:bg-amber-400 text-police-950 shadow-md'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{snapshotTaken ? 'ĐÃ LƯU VÀO GHI CHÚ!' : 'Chụp Lưu Bằng Chứng'}</span>
            </button>
          </div>
        </div>

        {/* Right: Camera Channel Grid Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-slate-400 uppercase tracking-widest text-[11px] font-semibold px-1">
            Chọn kênh camera giám sát:
          </div>

          <div className="grid grid-cols-1 gap-2">
            {cameras.map((cam) => {
              const isSelected = selectedCam.id === cam.id;
              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCam(cam)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-police-900 border-terminal-amber/80 shadow-md'
                      : 'bg-police-950/60 border-police-850 hover:border-police-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-terminal-amber animate-pulse' : 'bg-slate-600'
                        }`}
                      />
                      <span className="font-bold text-white text-xs">{cam.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{cam.timestamp}</span>
                  </div>

                  <h4 className="font-semibold text-slate-200 text-xs mb-1">{cam.name}</h4>
                  <p className="font-sans text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {cam.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
