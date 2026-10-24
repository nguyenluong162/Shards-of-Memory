import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import evidenceData from '../data/evidence.json';
import gameConfig from '../data/game-config.json';
import playersData from '../data/players.json';
import puzzlesData from '../data/puzzles.json';
import type {
  Assignment,
  GameState,
  KnownFact,
  ModuleId,
  Player,
  PuzzlesConfig,
  ToastMessage,
} from '../types';

const STATE_KEY = 'CASE_20_10_V2_STATE';
const ASSIGNMENT_KEY = 'CASE_20_10_PERSONNEL_V1';
const PLAYER_NAMES_KEY = 'CASE_20_10_PLAYER_NAMES_V1';
const basePlayers = playersData as Player[];

const initialState: GameState = {
  currentPhase: 1,
  phoneUnlocked: false,
  warehouseBUnlocked: false,
  b19Unlocked: false,
  phase1Complete: false,
  phase2Complete: false,
  phase3Complete: false,
  secretEndingUnlocked: false,
  hintsEnabled: false,
  soundEnabled: true,
  knownFacts: gameConfig.initialKnownFacts as KnownFact[],
  evidenceList: evidenceData as GameState['evidenceList'],
  puzzles: puzzlesData as PuzzlesConfig,
  hasEnteredCase: false,
};

interface GameContextValue extends GameState {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  assignments: Assignment[];
  setAssignments: (assignments: Assignment[]) => void;
  players: Player[];
  setPlayerNames: (names: Record<string, string>) => void;
  enterCase: () => void;
  returnToOpening: () => void;
  unlockPhone: () => void;
  lockPhone: () => void;
  unlockWarehouseB: () => void;
  lockWarehouseB: () => void;
  unlockB19: () => void;
  lockB19: () => void;
  resetPhase3: () => void;
  setSecretEndingUnlocked: (unlocked: boolean) => void;
  setPhase: (phase: number) => void;
  setHintsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  updatePuzzlesConfig: (config: Partial<PuzzlesConfig>) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const loadState = (): GameState => {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved) as Partial<GameState>;
    const savedState = { ...parsed } as Partial<GameState> & { notes?: unknown };
    delete savedState.notes;
    return {
      ...initialState,
      ...savedState,
      knownFacts: parsed.knownFacts ?? initialState.knownFacts,
      evidenceList: parsed.evidenceList ?? initialState.evidenceList,
      puzzles: { ...initialState.puzzles, ...(parsed.puzzles ?? {}) },
    };
  } catch {
    return initialState;
  }
};

const loadPlayerNames = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(PLAYER_NAMES_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const loadAssignments = (): Assignment[] => {
  try {
    const saved = localStorage.getItem(ASSIGNMENT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);
  const [activeModule, setActiveModule] = useState<ModuleId>('phone');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [assignments, setAssignmentState] = useState<Assignment[]>(loadAssignments);
  const [playerNames, setPlayerNameState] = useState<Record<string, string>>(loadPlayerNames);

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(PLAYER_NAMES_KEY, JSON.stringify(playerNames));
  }, [playerNames]);

  const players = useMemo(
    () => basePlayers.map((player) => ({ ...player, displayName: playerNames[player.id]?.trim() || player.displayName })),
    [playerNames],
  );

  const notify = useCallback((tone: ToastMessage['tone'], title: string, detail: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((items) => [...items, { id, tone, title, detail }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const enterCase = () => setState((prev) => ({ ...prev, hasEnteredCase: true }));

  const unlockPhone = () => {
    setState((prev) => {
      const facts = prev.knownFacts.some((fact) => fact.id === 'fact_phone_unlock')
        ? prev.knownFacts
        : [
            {
              id: 'fact_phone_unlock',
              phase: 1,
              title: 'Điện thoại đã được mở khóa',
              description: 'Dữ liệu hình ảnh và ghi chú trên thiết bị thu giữ đã sẵn sàng để kiểm tra.',
              source: 'Khai thác thiết bị số',
              unlockedAt: new Date().toISOString(),
              isImportant: true,
            },
            ...prev.knownFacts,
          ];
      return {
        ...prev,
        phoneUnlocked: true,
        phase1Complete: true,
        currentPhase: Math.max(prev.currentPhase, 2),
        knownFacts: facts,
        evidenceList: prev.evidenceList.map((item) =>
          ['EV-02', 'EV-03', 'EV-04'].includes(item.id) ? { ...item, isUnlocked: true } : item,
        ),
      };
    });
    notify('success', 'DEVICE ACCESS GRANTED', 'Dữ liệu điện thoại và Phase 2 đã được mở.');
  };

  const lockPhone = () => setState((prev) => ({
    ...prev,
    currentPhase: 1,
    phoneUnlocked: false,
    warehouseBUnlocked: false,
    b19Unlocked: false,
    phase1Complete: false,
    phase2Complete: false,
    phase3Complete: false,
    secretEndingUnlocked: false,
    knownFacts: prev.knownFacts.filter((fact) => !['fact_phone_unlock', 'fact_warehouse_unlock', 'fact_b19_log'].includes(fact.id)),
    evidenceList: prev.evidenceList.map((item) => ['EV-02', 'EV-03', 'EV-04', 'EV-05', 'TL-02'].includes(item.id) ? { ...item, isUnlocked: false } : item),
  }));

  const unlockWarehouseB = () => {
    setState((prev) => {
      const facts = prev.knownFacts.some((fact) => fact.id === 'fact_warehouse_unlock')
        ? prev.knownFacts
        : [
            {
              id: 'fact_warehouse_unlock',
              phase: 2,
              title: 'Đã tiếp cận Nhà kho B',
              description: 'Khóa điện tử của cửa kho đã được vô hiệu hóa. Hành lang dẫn tới khu lưu trữ B-19 đã xuất hiện.',
              source: 'Trạm kiểm soát Kho B',
              unlockedAt: new Date().toISOString(),
              isImportant: true,
            },
            ...prev.knownFacts,
          ];
      return {
        ...prev,
        warehouseBUnlocked: true,
        phase2Complete: true,
        currentPhase: Math.max(prev.currentPhase, 3),
        knownFacts: facts,
        evidenceList: prev.evidenceList.map((item) => item.id === 'EV-05' ? { ...item, isUnlocked: true } : item),
      };
    });
    notify('success', 'WAREHOUSE ACCESS GRANTED', 'Archive B-19 hiện đã khả dụng.');
  };

  const lockWarehouseB = () => setState((prev) => ({
    ...prev,
    currentPhase: prev.phoneUnlocked ? 2 : 1,
    warehouseBUnlocked: false,
    b19Unlocked: false,
    phase2Complete: false,
    phase3Complete: false,
    secretEndingUnlocked: false,
    knownFacts: prev.knownFacts.filter((fact) => !['fact_warehouse_unlock', 'fact_b19_log'].includes(fact.id)),
    evidenceList: prev.evidenceList.map((item) => ['EV-05', 'TL-02'].includes(item.id) ? { ...item, isUnlocked: false } : item),
  }));

  const unlockB19 = () => {
    setState((prev) => {
      const facts = prev.knownFacts.some((fact) => fact.id === 'fact_b19_log')
        ? prev.knownFacts
        : [
            {
              id: 'fact_b19_log',
              phase: 3,
              title: 'TL-02 — Nhật ký truy cập B-19',
              description: 'Terminal B-19 lưu năm lượt truy cập từ 19:36 đến 20:04. Dữ liệu chỉ ghi nhận thời gian và mã thẻ.',
              source: 'Phòng lưu trữ B-19',
              unlockedAt: new Date().toISOString(),
              isImportant: true,
            },
            ...prev.knownFacts,
          ];
      return {
        ...prev,
        b19Unlocked: true,
        phase3Complete: true,
        currentPhase: Math.max(prev.currentPhase, 4),
        knownFacts: facts,
        evidenceList: prev.evidenceList.map((item) => item.id === 'TL-02' ? { ...item, isUnlocked: true } : item),
      };
    });
    notify('success', 'B-19 ACCESS GRANTED', 'TL-02 đã được thêm vào Evidence Log.');
  };

  const resetPhase3 = () => setState((prev) => ({
    ...prev,
    b19Unlocked: false,
    phase3Complete: false,
    secretEndingUnlocked: false,
    currentPhase: prev.warehouseBUnlocked ? 3 : prev.phoneUnlocked ? 2 : 1,
    knownFacts: prev.knownFacts.filter((fact) => fact.id !== 'fact_b19_log'),
    evidenceList: prev.evidenceList.map((item) => item.id === 'TL-02' ? { ...item, isUnlocked: false } : item),
  }));

  const setAssignments = (next: Assignment[]) => {
    const usedPlayers = new Set<string>();
    const usedRoles = new Set<string>();
    const safe = next.filter((item) => {
      if (!item.playerId || !item.roleId || usedPlayers.has(item.playerId) || usedRoles.has(item.roleId)) return false;
      usedPlayers.add(item.playerId);
      usedRoles.add(item.roleId);
      return true;
    });
    setAssignmentState(safe);
    notify('success', 'Đã lưu phân vai', `${safe.length}/15 hồ sơ đã được gán.`);
  };

  const setPlayerNames = (names: Record<string, string>) => {
    const cleaned = Object.fromEntries(
      Object.entries(names)
        .map(([id, name]) => [id, name.trim()] as const)
        .filter(([id, name]) => name && name !== basePlayers.find((player) => player.id === id)?.displayName),
    );
    setPlayerNameState(cleaned);
  };

  const value = useMemo<GameContextValue>(() => ({
    ...state,
    activeModule,
    setActiveModule,
    isAdminOpen,
    setIsAdminOpen,
    toasts,
    dismissToast,
    assignments,
    setAssignments,
    players,
    setPlayerNames,
    enterCase,
    returnToOpening: () => {
      setState((prev) => ({ ...prev, hasEnteredCase: false }));
      setIsAdminOpen(false);
    },
    unlockPhone,
    lockPhone,
    unlockWarehouseB,
    lockWarehouseB,
    unlockB19,
    lockB19: resetPhase3,
    resetPhase3,
    setSecretEndingUnlocked: (unlocked) => setState((prev) => ({ ...prev, secretEndingUnlocked: unlocked })),
    setPhase: (phase) => setState((prev) => ({ ...prev, currentPhase: phase })),
    setHintsEnabled: (enabled) => setState((prev) => ({ ...prev, hintsEnabled: enabled })),
    setSoundEnabled: (enabled) => setState((prev) => ({ ...prev, soundEnabled: enabled })),
    updatePuzzlesConfig: (config) => setState((prev) => ({ ...prev, puzzles: { ...prev.puzzles, ...config } })),
    resetGame: () => {
      setState({ ...initialState, knownFacts: [...initialState.knownFacts], evidenceList: [...initialState.evidenceList] });
      setActiveModule('phone');
      setIsAdminOpen(false);
      notify('info', 'Đã reset game', 'Toàn bộ tiến trình đã trở về mặc định.');
    },
  }), [state, activeModule, isAdminOpen, toasts, dismissToast, assignments, players, notify]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameState must be used within GameStateProvider');
  return context;
}
