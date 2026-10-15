import { useEffect } from 'react';
import {
  Archive,
  ChevronRight,
  Database,
  Fingerprint,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Smartphone,
  Volume2,
  VolumeX,
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

const navModules = [
  { id: 'phone' as const, label: 'Seized Phone', icon: Smartphone },
  { id: 'warehouse' as const, label: 'Warehouse B', icon: Warehouse },
  { id: 'b19' as const, label: 'Archive B-19', icon: Archive },
  { id: 'personnel' as const, label: 'Personnel Database', icon: Database },
];

function Landing() {
  const { enterCase } = useGameState();
  return (
    <main className="entry-screen">
      <div className="entry-grid" aria-hidden="true" />
      <section className="entry-card">
        <div className="entry-classification">RESTRICTED // INVESTIGATION USE ONLY</div>
        <Fingerprint className="entry-mark" strokeWidth={1.2} />
        <p className="eyebrow">DIGITAL CASEWORK ENVIRONMENT</p>
        <h1>CASE <span>20:10</span></h1>
        <p className="entry-subtitle">SHARDS OF MEMORY</p>
        <div className="entry-rule" />
        <p className="entry-copy">Hệ thống tổng hợp vật chứng và điều phối điều tra. Mọi hoạt động truy cập được lưu trên thiết bị này.</p>
        <button className="primary-action" onClick={enterCase}><ShieldCheck size={18} />ENTER CASE FILE<ChevronRight size={18} /></button>
        <p className="microcopy">SESSION 01 · LOCAL EVIDENCE NODE</p>
      </section>
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
    return game.b19Unlocked ? 'UNLOCKED' : game.warehouseBUnlocked ? 'ACTIVE PUZZLE' : 'RESTRICTED';
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
      default:
        return <PhoneModule />;
    }
  };

  if (!game.hasEnteredCase) return <Landing />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={() => game.setActiveModule('phone')}>
          <span className="brand-seal">20:10</span>
          <span><strong>SHARDS OF MEMORY</strong><small>INVESTIGATION CONTROL</small></span>
        </button>
        <div className="case-status"><span /> CASE OPEN · PHASE {String(game.currentPhase).padStart(2, '0')}</div>
        <button className="sound-button" title={game.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'} onClick={() => game.setSoundEnabled(!game.soundEnabled)}>{game.soundEnabled ? <Volume2/> : <VolumeX/>}</button>
      </header>

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
