import React from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Warehouse, 
  Video, 
  Car, 
  Users, 
  Binary, 
  Lock, 
  Unlock, 
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useGameState, NavModuleId } from '../../context/GameStateContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavModuleId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  isLocked: boolean;
  phaseRequired: number;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeModule, setActiveModule, phoneUnlocked, warehouseBUnlocked, currentPhase } = useGameState();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Bảng Điều Tra',
      sublabel: 'Investigation Board & Notes',
      icon: <LayoutDashboard className="w-4 h-4" />,
      isLocked: false,
      phaseRequired: 1,
    },
    {
      id: 'phone',
      label: 'Điện Thoại Thu Giữ',
      sublabel: 'Trương Nguyên Minh // Smartphone',
      icon: <Smartphone className="w-4 h-4" />,
      isLocked: false,
      phaseRequired: 1,
      badge: phoneUnlocked ? 'ĐÃ MỞ' : 'PHASE 1',
    },
    {
      id: 'warehouse',
      label: 'Cửa Nhà Kho B',
      sublabel: 'Keypad an ninh phân khu B',
      icon: <Warehouse className="w-4 h-4" />,
      isLocked: false, // Accessible to attempt puzzle
      phaseRequired: 2,
      badge: warehouseBUnlocked ? 'ĐÃ MỞ' : 'PHASE 2',
    },
    {
      id: 'b19',
      label: 'Phân Khu B-19',
      sublabel: 'Khu lưu trữ mật B-19',
      icon: <Binary className="w-4 h-4" />,
      isLocked: !warehouseBUnlocked,
      phaseRequired: 3,
      badge: 'LOCKED',
    },
    {
      id: 'cctv',
      label: 'Lưu Trữ CCTV',
      sublabel: 'Bản ghi an ninh hành lang',
      icon: <Video className="w-4 h-4" />,
      isLocked: currentPhase < 3,
      phaseRequired: 3,
      badge: 'PHASE 3',
    },
    {
      id: 'vehicles',
      label: 'Giám Định Xe Cộ',
      sublabel: 'Biển số & Lịch trình xe',
      icon: <Car className="w-4 h-4" />,
      isLocked: currentPhase < 4,
      phaseRequired: 4,
      badge: 'PHASE 4',
    },
    {
      id: 'suspects',
      label: 'Hồ Sơ Nhân Vật',
      sublabel: 'Dossier đối tượng liên quan',
      icon: <Users className="w-4 h-4" />,
      isLocked: currentPhase < 4,
      phaseRequired: 4,
      badge: 'PHASE 4',
    },
  ];

  const handleSelect = (item: NavItem) => {
    setActiveModule(item.id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-72 bg-police-950 border-r border-police-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Section Title */}
        <div className="p-4 border-b border-police-900 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-widest text-[11px] font-semibold text-slate-400">
            Khu vực chuyên án
          </span>
          <span className="text-[10px] text-slate-500">v1.0-MODULAR</span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 relative group ${
                  isActive
                    ? 'bg-police-900 border-terminal-amber/60 text-white shadow-md'
                    : item.isLocked
                    ? 'bg-police-950/60 border-police-900/60 text-slate-500 hover:border-police-800'
                    : 'bg-police-900/40 border-police-800/80 text-slate-300 hover:bg-police-900 hover:text-white hover:border-police-700'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-terminal-amber rounded-r" />
                )}

                <div
                  className={`p-2 rounded mt-0.5 ${
                    isActive
                      ? 'bg-terminal-amber/20 text-terminal-amber'
                      : item.isLocked
                      ? 'bg-police-900 text-slate-600'
                      : 'bg-police-800 text-slate-400 group-hover:text-cyan-400'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`font-mono text-xs font-semibold truncate ${
                        isActive
                          ? 'text-white'
                          : item.isLocked
                          ? 'text-slate-500'
                          : 'text-slate-200'
                      }`}
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${
                          item.badge === 'ĐÃ MỞ'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : item.isLocked
                            ? 'bg-police-900 text-slate-600 border border-police-850'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.sublabel}
                  </p>
                </div>

                <div className="mt-1 text-slate-600">
                  {item.isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-terminal-amber" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info panel */}
        <div className="p-3 border-t border-police-900 bg-police-950/80">
          <div className="p-2.5 rounded bg-police-900/60 border border-police-850 text-slate-400 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Trạng thái hệ thống:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Chuyên án: CASE 20:10 SHARDS
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
