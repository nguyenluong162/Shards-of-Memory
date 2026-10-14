import React, { useState, useEffect } from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationToast } from './components/common/NotificationToast';
import { LandingModal } from './components/landing/LandingModal';
import { InvestigationDashboard } from './components/dashboard/InvestigationDashboard';
import { PhoneMockup } from './components/phone/PhoneMockup';
import { WarehouseDoor } from './components/warehouse/WarehouseDoor';
import { LockedModuleView } from './components/locked/LockedModuleView';
import { AdminModal } from './components/admin/AdminModal';

const AppContent: React.FC = () => {
  const { hasEnteredCase, activeModule, setIsAdminOpen } = useGameState();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Shortcut Ctrl+Shift+A for Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  return (
    <div className="min-h-screen bg-police-950 text-slate-100 flex flex-col relative overflow-x-hidden select-text">
      {/* Landing Modal for First-time entry */}
      {!hasEnteredCase && <LandingModal />}

      {/* Main App Shell */}
      <Header onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-police-900/30 via-police-950 to-black relative">
          {activeModule === 'dashboard' ? (
            <InvestigationDashboard />
          ) : activeModule === 'phone' ? (
            <PhoneMockup />
          ) : activeModule === 'warehouse' ? (
            <WarehouseDoor />
          ) : (
            <LockedModuleView moduleId={activeModule} />
          )}
        </main>
      </div>

      {/* Floating System Notification Toasts */}
      <NotificationToast />

      {/* GM / Admin Control Panel Modal */}
      <AdminModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
};

export default App;
