import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, CaseNote, KnownFact, EvidenceItem, PuzzlesConfig, CaseNoteCategory } from '../types';
import puzzlesData from '../data/puzzles.json';
import evidenceData from '../data/evidence.json';
import gameConfig from '../data/game-config.json';
import { playAudio } from '../utils/audio';

const STORAGE_KEY = 'CASE_20_10_GAME_STATE_V1';

export type NavModuleId = 'dashboard' | 'phone' | 'warehouse' | 'b19' | 'cctv' | 'vehicles' | 'suspects';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'alert';
  title: string;
  description: string;
}

interface GameStateContextType extends GameState {
  activeModule: NavModuleId;
  setActiveModule: (module: NavModuleId) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  enterCase: () => void;
  // Note actions
  addNote: (note: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Omit<CaseNote, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  // Puzzle actions
  unlockPhone: () => void;
  lockPhone: () => void;
  unlockWarehouseB: () => void;
  lockWarehouseB: () => void;
  updatePuzzlesConfig: (config: Partial<PuzzlesConfig>) => void;
  toggleHints: () => void;
  setPhase: (phase: number) => void;
  // Admin actions
  resetGame: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const defaultPuzzles: PuzzlesConfig = puzzlesData as PuzzlesConfig;
const defaultEvidence: EvidenceItem[] = evidenceData as EvidenceItem[];
const initialFacts: KnownFact[] = gameConfig.initialKnownFacts;
const initialNotes: CaseNote[] = gameConfig.initialNotes as CaseNote[];

const defaultState: GameState = {
  currentPhase: 1,
  phoneUnlocked: false,
  warehouseBUnlocked: false,
  phase1Complete: false,
  phase2Complete: false,
  hintsEnabled: false,
  notes: initialNotes,
  knownFacts: initialFacts,
  evidenceList: defaultEvidence,
  puzzles: defaultPuzzles,
  hasEnteredCase: false,
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          puzzles: { ...defaultState.puzzles, ...parsed.puzzles },
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return defaultState;
  });

  const [activeModule, setActiveModule] = useState<NavModuleId>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  const addToast = (type: ToastMessage['type'], title: string, description: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const enterCase = () => {
    setState((prev) => ({ ...prev, hasEnteredCase: true }));
    playAudio.accessGranted();
  };

  // Notes actions
  const addNote = (noteData: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: CaseNote = {
      id: 'note_' + Date.now().toString(),
      ...noteData,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
    addToast('info', 'Đã lưu ghi chú', `Ghi chú "${newNote.title || 'Không có tiêu đề'}" đã được ghi nhận.`);
  };

  const updateNote = (id: string, updates: Partial<Omit<CaseNote, 'id' | 'createdAt'>>) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)),
    }));
  };

  const deleteNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
    addToast('warning', 'Đã xóa ghi chú', 'Bản ghi chú đã được xóa khỏi hồ sơ vụ án.');
  };

  const togglePinNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }));
  };

  // Puzzle Actions
  const unlockPhone = () => {
    if (state.phoneUnlocked) return;
    playAudio.accessGranted();

    const newFact1: KnownFact = {
      id: 'fact_phone_unlock',
      phase: 1,
      title: 'Mở khóa điện thoại Trương Nguyên Minh',
      description: 'Đã giải mã thành công mã PIN 4 số. Khôi phục toàn bộ quyền truy cập album ảnh và tệp ghi chú bảo mật.',
      source: 'Khai thác thiết bị số di động',
      unlockedAt: new Date().toLocaleTimeString('vi-VN'),
      isImportant: true,
    };

    const newFact2: KnownFact = {
      id: 'fact_warehouse_hint',
      phase: 2,
      title: 'Quy tắc mã khóa Nhà kho B',
      description: 'Ghi chú an ninh của Minh hé lộ: Mã khóa cửa kho B đồng bộ theo dấu thời gian (giờ:phút:giây) trích xuất từ dữ liệu hình ảnh giám sát.',
      source: 'Ghi chú điện thoại của Minh',
      unlockedAt: new Date().toLocaleTimeString('vi-VN'),
      isImportant: true,
    };

    setState((prev) => {
      const alreadyHasFact1 = prev.knownFacts.some((f) => f.id === newFact1.id);
      const alreadyHasFact2 = prev.knownFacts.some((f) => f.id === newFact2.id);
      const factsToAdd = [];
      if (!alreadyHasFact1) factsToAdd.push(newFact1);
      if (!alreadyHasFact2) factsToAdd.push(newFact2);

      const updatedEvidence = prev.evidenceList.map((ev) => {
        if (ev.id === 'EV-02' || ev.id === 'EV-03' || ev.id === 'EV-04') {
          return { ...ev, isUnlocked: true };
        }
        return ev;
      });

      return {
        ...prev,
        phoneUnlocked: true,
        phase1Complete: true,
        currentPhase: Math.max(prev.currentPhase, 2),
        knownFacts: [...factsToAdd, ...prev.knownFacts],
        evidenceList: updatedEvidence,
      };
    });

    addToast('success', 'PHASE 1 HOÀN TẤT', 'Mở khóa điện thoại thành công! Dữ liệu mới đã được thêm vào Bảng điều tra.');
  };

  const lockPhone = () => {
    setState((prev) => ({ ...prev, phoneUnlocked: false, phase1Complete: false }));
    addToast('warning', 'Khóa điện thoại', 'Thiết bị điện thoại đã được khóa lại.');
  };

  const unlockWarehouseB = () => {
    if (state.warehouseBUnlocked) return;
    playAudio.heavyDoorUnlock();

    const newFact: KnownFact = {
      id: 'fact_warehouse_unlock',
      phase: 2,
      title: 'Thâm nhập thành công Nhà kho B',
      description: 'Chốt điện từ cửa kho B đã được giải mã bằng dấu thời gian camera giám sát (16:03:49). Đã tiếp cận khu vực lưu trữ bên trong.',
      source: 'Trạm kiểm soát an ninh Kho B',
      unlockedAt: new Date().toLocaleTimeString('vi-VN'),
      isImportant: true,
    };

    setState((prev) => {
      const alreadyHas = prev.knownFacts.some((f) => f.id === newFact.id);
      const updatedEvidence = prev.evidenceList.map((ev) => {
        if (ev.id === 'EV-05') {
          return { ...ev, isUnlocked: true };
        }
        return ev;
      });

      return {
        ...prev,
        warehouseBUnlocked: true,
        phase2Complete: true,
        currentPhase: Math.max(prev.currentPhase, 3),
        knownFacts: alreadyHas ? prev.knownFacts : [newFact, ...prev.knownFacts],
        evidenceList: updatedEvidence,
      };
    });

    addToast('success', 'PHASE 2 HOÀN TẤT', 'Cửa Nhà kho B đã mở khóa! Đã tìm thấy tài liệu lưu trữ nội bộ.');
  };

  const lockWarehouseB = () => {
    setState((prev) => ({ ...prev, warehouseBUnlocked: false, phase2Complete: false }));
    addToast('warning', 'Khóa cửa kho B', 'Cửa kho B đã được khóa lại.');
  };

  const updatePuzzlesConfig = (config: Partial<PuzzlesConfig>) => {
    setState((prev) => ({
      ...prev,
      puzzles: { ...prev.puzzles, ...config },
    }));
    addToast('info', 'Cập nhật cấu hình', 'Đã lưu cấu hình mật mã puzzle mới.');
  };

  const toggleHints = () => {
    setState((prev) => ({ ...prev, hintsEnabled: !prev.hintsEnabled }));
    addToast('info', 'Trợ giúp Puzzle', `Đã ${!state.hintsEnabled ? 'BẬT' : 'TẮT'} hiển thị gợi ý.`);
  };

  const setPhase = (phase: number) => {
    setState((prev) => ({ ...prev, currentPhase: phase }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultState });
    setActiveModule('dashboard');
    addToast('alert', 'RESET HỆ THỐNG', 'Toàn bộ tiến trình điều tra và ghi chú đã được khôi phục về mặc định.');
  };

  return (
    <GameStateContext.Provider
      value={{
        ...state,
        activeModule,
        setActiveModule,
        toasts,
        dismissToast,
        enterCase,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        unlockPhone,
        lockPhone,
        unlockWarehouseB,
        lockWarehouseB,
        updatePuzzlesConfig,
        toggleHints,
        setPhase,
        resetGame,
        isAdminOpen,
        setIsAdminOpen,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
