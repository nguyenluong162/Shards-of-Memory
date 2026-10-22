import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Archive,
  ChevronRight,
  Database,
  FileText,
  Fingerprint,
  LockKeyhole,
  Settings2,
  Smartphone,
  Warehouse,
} from 'lucide-react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import type { ModuleId } from './types';
import { AdminPanel } from './components/AdminPanel';
import { B19Module } from './components/B19Module';
import { PersonnelDatabase } from './components/PersonnelDatabase';
import { PhoneModule } from './components/PhoneModule';
import { LockedModule, ToastStack } from './components/ui';
import { WarehouseModule } from './components/WarehouseModule';
import { CaseDocumentsModule } from './components/CaseDocumentsModule';

const navModules = [
  { id: 'phone' as const, label: 'Seized Phone', icon: Smartphone },
  { id: 'warehouse' as const, label: 'Warehouse B', icon: Warehouse },
  { id: 'b19' as const, label: 'Archive B-19', icon: Archive },
  { id: 'personnel' as const, label: 'Personnel Database', icon: Database },
  { id: 'case-documents' as const, label: 'Case Documents', icon: FileText },
];

const posterUrl = `${import.meta.env.BASE_URL}evidence/poster/Poster.png`;

function Landing() {
  const { enterCase } = useGameState();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isExiting) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(enterCase, reducedMotion ? 40 : 950);
    return () => window.clearTimeout(timer);
  }, [enterCase, isExiting]);

  useEffect(() => {
    const startWithSpace = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isExiting) return;
      event.preventDefault();
      setIsExiting(true);
    };
    window.addEventListener('keydown', startWithSpace);
    return () => window.removeEventListener('keydown', startWithSpace);
  }, [isExiting]);

  return (
    <main className={`entry-screen ${isExiting ? 'is-exiting' : ''}`}>
      <img className="entry-poster" src={posterUrl} alt="Shards of Memory — Investigation Board" />
      <div className="entry-atmosphere" aria-hidden="true" />
      <div className="entry-scanline" aria-hidden="true" />
      <div className="entry-transition-shards" aria-hidden="true"><i/><i/><i/><i/></div>
      <header className="entry-hud">
        <div className="entry-classification"><Fingerprint strokeWidth={1.4} />CONFIDENTIAL // CASE 20:10</div>
        <div className="entry-system"><span /> MEMORY ARCHIVE ONLINE</div>
      </header>
      <div className="entry-start">
        <button onClick={() => setIsExiting(true)} disabled={isExiting} aria-label="Nhấn Space để bắt đầu điều tra">
          <span>SPACE</span><strong>NHẤN ĐỂ BẮT ĐẦU ĐIỀU TRA</strong><ChevronRight />
        </button>
      </div>
    </main>
  );
}

function AppShell() {
  const game = useGameState();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        game.setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [game.setIsAdminOpen]);

  const moduleStatus = (id: ModuleId) => {
    if (id === 'personnel') return 'AVAILABLE';
    if (id === 'phone') return game.phoneUnlocked ? 'UNLOCKED' : 'ACTIVE PUZZLE';
    if (id === 'warehouse') return game.warehouseBUnlocked ? 'UNLOCKED' : game.phoneUnlocked ? 'ACTIVE PUZZLE' : 'RESTRICTED';
    if (id === 'b19') return game.b19Unlocked ? 'UNLOCKED' : game.warehouseBUnlocked ? 'ACTIVE PUZZLE' : 'RESTRICTED';
    return game.b19Unlocked ? 'UNLOCKED' : 'RESTRICTED';
  };

  const renderModule = () => {
    switch (game.activeModule) {
      case 'phone':
        return <PhoneModule />;
      case 'warehouse':
        return game.phoneUnlocked
          ? <WarehouseModule />
          : <LockedModule title="Warehouse B" detail="Thông tin định vị và cơ chế mã khóa chưa được thu hồi." requirement="Mở khóa Seized Phone ở Phase 01" onBack={() => game.setActiveModule('phone')} />;
      case 'b19':
        return game.warehouseBUnlocked
          ? <B19Module />
          : <LockedModule title="Archive B-19" detail="Khu vực này nằm phía trong Warehouse B và chưa thể tiếp cận." requirement="Hoàn tất Warehouse B ở Phase 02" onBack={() => game.setActiveModule('phone')} />;
      case 'personnel':
        return <PersonnelDatabase />;
      case 'case-documents':
        return game.b19Unlocked
          ? <CaseDocumentsModule />
          : <LockedModule title="Case Documents" detail="Tập tài liệu vụ án chỉ được mở sau khi hoàn tất kho lưu trữ B-19." requirement="Hoàn tất Archive B-19 ở Phase 03" onBack={() => game.setActiveModule('b19')} />;
      default:
        return <PhoneModule />;
    }
  };

  if (!game.hasEnteredCase) return <Landing />;

  return (
    <div
      className={`app-shell phase-${game.currentPhase}`}
      style={{ '--case-poster': `url("${posterUrl}")` } as CSSProperties}
    >
      <nav className="module-rail" aria-label="Case modules">
        <p className="rail-label">CASE MODULES</p>
        {navModules.map((module, index) => {
          const Icon = module.icon;
          const status = moduleStatus(module.id);
          return (
            <button key={module.id} className={`module-link ${game.activeModule === module.id ? 'active' : ''}`} onClick={() => game.setActiveModule(module.id)}>
              <span className="module-index">{String(index + 1).padStart(2, '0')}</span>
              <Icon size={18} strokeWidth={1.6} />
              <span className="module-name">{module.label}<small>{status}</small></span>
              {status === 'RESTRICTED' ? <LockKeyhole size={13} /> : <ChevronRight size={14} />}
            </button>
          );
        })}
        <div className="rail-foot">
          <span>NODE</span><strong>HCM-2010-A</strong><small>Encrypted local session</small>
          <button onClick={() => game.setIsAdminOpen(true)}><Settings2/> GM ACCESS</button>
        </div>
      </nav>

      <main className="workspace">{renderModule()}</main>
      <ToastStack />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return <GameStateProvider><AppShell /></GameStateProvider>;
}
