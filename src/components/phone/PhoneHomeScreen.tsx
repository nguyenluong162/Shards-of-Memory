import React from 'react';
import { 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  MessageSquare, 
  Camera, 
  Clock, 
  Settings, 
  FolderLock,
  Compass,
  Music
} from 'lucide-react';
import photosData from '../../data/photos.json';
import notesData from '../../data/notes.json';

interface PhoneHomeScreenProps {
  onOpenApp: (appName: 'photos' | 'notes' | 'phone' | 'messages') => void;
}

export const PhoneHomeScreen: React.FC<PhoneHomeScreenProps> = ({ onOpenApp }) => {
  const photoCount = (photosData as unknown[]).length;
  const noteCount = (notesData as unknown[]).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-police-900 to-police-950 text-white select-none relative overflow-hidden">
      {/* Background wallpaper subtle gradient & particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />

      {/* Top Grid of Apps */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-2 pt-6">
        {/* Photos App */}
        <button
          onClick={() => onOpenApp('photos')}
          className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 p-0.5 shadow-lg group-hover:shadow-cyan-500/30 transition-shadow relative">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
              {photoCount}
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-200">
            Ảnh
          </span>
        </button>

        {/* Notes App */}
        <button
          onClick={() => onOpenApp('notes')}
          className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-400 p-0.5 shadow-lg group-hover:shadow-amber-500/30 transition-shadow relative">
            <div className="w-full h-full bg-amber-400 rounded-[14px] flex items-center justify-center text-slate-900">
              <FileText className="w-7 h-7 text-slate-900" />
            </div>
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
              {noteCount}
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-200">
            Ghi chú
          </span>
        </button>

        {/* Decorative Clock */}
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <div className="w-14 h-14 rounded-2xl bg-black border border-white/20 p-2 flex flex-col items-center justify-center shadow">
            <Clock className="w-6 h-6 text-white" />
            <span className="text-[9px] font-mono mt-0.5">20:10</span>
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-400">
            Đồng hồ
          </span>
        </div>

        {/* Decorative Camera */}
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow">
            <Camera className="w-7 h-7 text-slate-300" />
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-400">
            Máy ảnh
          </span>
        </div>

        {/* Decorative Compass */}
        <div className="flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-14 h-14 rounded-2xl bg-black border border-slate-800 flex items-center justify-center shadow">
            <Compass className="w-6 h-6 text-slate-400" />
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-500">
            La bàn
          </span>
        </div>

        {/* Decorative Music */}
        <div className="flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-500">
            Nhạc
          </span>
        </div>

        {/* Decorative Files */}
        <div className="flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-14 h-14 rounded-2xl bg-cyan-800/80 border border-cyan-600/40 flex items-center justify-center shadow">
            <FolderLock className="w-6 h-6 text-cyan-200" />
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-500">
            Tập tin
          </span>
        </div>

        {/* Decorative Settings */}
        <div className="flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center shadow">
            <Settings className="w-6 h-6 text-slate-300" />
          </div>
          <span className="text-[11px] font-medium tracking-tight text-slate-500">
            Cài đặt
          </span>
        </div>
      </div>

      {/* Dock Bar at Bottom */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex items-center justify-around mb-2 shadow-2xl">
        {/* Phone App */}
        <button
          onClick={() => onOpenApp('phone')}
          className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          title="Điện thoại"
        >
          <Phone className="w-6 h-6 fill-white text-white" />
        </button>

        {/* Messages App */}
        <button
          onClick={() => onOpenApp('messages')}
          className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          title="Tin nhắn"
        >
          <MessageSquare className="w-6 h-6 fill-white text-white" />
        </button>

        {/* Quick Photos */}
        <button
          onClick={() => onOpenApp('photos')}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          title="Bộ sưu tập ảnh"
        >
          <ImageIcon className="w-6 h-6 text-white" />
        </button>

        {/* Quick Notes */}
        <button
          onClick={() => onOpenApp('notes')}
          className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          title="Ghi chú cá nhân"
        >
          <FileText className="w-6 h-6 text-slate-900" />
        </button>
      </div>
    </div>
  );
};
