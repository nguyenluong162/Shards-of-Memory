import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, Info, Calendar, Camera, HardDrive, Maximize2 } from 'lucide-react';
import { PhonePhoto } from '../../types';

interface PhotoModalProps {
  photo: PhonePhoto | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMetadata, setShowMetadata] = useState(false);

  if (!photo) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white font-mono text-xs">
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
            <span className="font-semibold">{photo.title}</span>
            <span className="opacity-50">•</span>
            <span className="opacity-70">{photo.album}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/10">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-30 transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-semibold min-w-[40px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-30 transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-amber-400"
                  title="Đặt lại kích thước"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Info Toggle */}
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-2 rounded-full border transition-colors ${
                showMetadata
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-black/60 border-white/10 hover:bg-white/10 text-white'
              }`}
              title="Thông tin chi tiết (Metadata EXIF)"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-white/20 border border-white/10 rounded-full transition-colors text-white"
              title="Đóng ảnh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image viewport */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.img
            src={photo.url}
            alt={photo.title}
            drag={zoomLevel > 1}
            dragConstraints={{ left: -300 * zoomLevel, right: 300 * zoomLevel, top: -200 * zoomLevel, bottom: 200 * zoomLevel }}
            style={{
              scale: zoomLevel,
              maxHeight: '85vh',
              maxWidth: '90vw',
              objectFit: 'contain',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded select-none pointer-events-auto shadow-2xl"
          />
        </div>

        {/* Metadata Drawer / Panel */}
        {showMetadata && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-20 right-4 w-80 bg-police-950/95 border border-police-700/80 rounded-xl p-4 text-xs font-mono text-slate-200 shadow-2xl space-y-3 z-20 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-police-800 pb-2">
              <span className="font-semibold text-terminal-amber uppercase">
                Thông tin tập tin (EXIF)
              </span>
              <span className="text-[10px] text-slate-400">Trích xuất bộ nhớ</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Thời gian chụp:</span>
                <strong className="text-white ml-auto">{photo.date}</strong>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Thiết bị chụp:</span>
                <strong className="text-white ml-auto">{photo.device}</strong>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Tên tệp:</span>
                <span className="text-white ml-auto font-semibold">{photo.filename}</span>
              </div>

              {photo.resolution && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Độ phân giải:</span>
                  <span className="text-white ml-auto">{photo.resolution}</span>
                </div>
              )}
            </div>

            {photo.notes && (
              <div className="border-t border-police-800 pt-2 text-[11px] text-slate-400 font-sans leading-relaxed">
                <span className="font-mono font-semibold text-slate-300 block mb-0.5">
                  Ghi chú hồ sơ:
                </span>
                {photo.notes}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
