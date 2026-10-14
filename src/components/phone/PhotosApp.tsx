import React, { useState } from 'react';
import { ArrowLeft, Grid, Image as ImageIcon, Calendar, Filter } from 'lucide-react';
import photosData from '../../data/photos.json';
import { PhonePhoto } from '../../types';
import { PhotoModal } from './PhotoModal';

interface PhotosAppProps {
  onBack: () => void;
}

export const PhotosApp: React.FC<PhotosAppProps> = ({ onBack }) => {
  const photos = photosData as PhonePhoto[];
  const [selectedPhoto, setSelectedPhoto] = useState<PhonePhoto | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>('ALL');

  const albums = ['ALL', ...Array.from(new Set(photos.map((p) => p.album)))];

  const filteredPhotos = activeAlbum === 'ALL'
    ? photos
    : photos.filter((p) => p.album === activeAlbum);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-medium font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h2 className="text-sm font-semibold tracking-wide">Ảnh & Video</h2>

        <div className="text-xs text-slate-400 font-mono">
          {photos.length} mục
        </div>
      </div>

      {/* Album filter tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-900 overflow-x-auto no-scrollbar bg-slate-950/80 text-xs">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
              activeAlbum === album
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {album === 'ALL' ? 'Tất cả ảnh' : album}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-1.5 auto-rows-[90px] sm:auto-rows-[110px] custom-scrollbar">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative overflow-hidden rounded bg-slate-900 cursor-pointer border border-slate-800/80 hover:border-cyan-500/80 transition-all"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay with subtle timestamp */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-end">
              <span className="text-[9px] font-mono text-cyan-300 truncate font-medium">
                {photo.title}
              </span>
              <span className="text-[8px] font-mono text-slate-300">
                {photo.date.split(' ')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer album status */}
      <div className="py-2 px-4 bg-slate-900/60 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono">
        Thư viện ảnh đồng bộ lưu trữ đám mây // Trương Nguyên Minh
      </div>

      {/* Fullscreen Photo Modal */}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
};
