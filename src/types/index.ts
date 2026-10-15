export type ModuleId = 'phone' | 'warehouse' | 'b19' | 'personnel';

export interface KnownFact {
  id: string;
  phase: number;
  title: string;
  description: string;
  source: string;
  unlockedAt?: string;
  isImportant?: boolean;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'device' | 'document' | 'photo' | 'location' | 'audio' | 'cctv';
  phase: number;
  description: string;
  locationFound: string;
  isUnlocked: boolean;
  thumbnailUrl?: string;
}

export interface PhonePhoto {
  id: string;
  title: string;
  filename: string;
  url: string;
  date: string;
  device: string;
  album: string;
  resolution?: string;
  isClue: boolean;
  notes?: string;
}

export interface PhoneNote {
  id: string;
  title: string;
  date: string;
  content: string;
  isClue: boolean;
  tags?: string[];
}

export interface PuzzlesConfig {
  phase1PhonePin: string;
  phase2WarehouseCode: string;
  phase2AcceptedCodes: string[];
  phase1Hint: string;
  phase2Hint: string;
  phase3B19Code: string;
}

export interface Player {
  id: string;
  displayName: string;
  avatarPath: string;
}

export interface Role {
  id: string;
  title: string;
  publicDescription: string;
}

export interface Assignment {
  playerId: string;
  roleId: string;
}

export interface ToastMessage {
  id: string;
  tone: 'success' | 'error' | 'info';
  title: string;
  detail: string;
}

export interface GameState {
  currentPhase: number;
  phoneUnlocked: boolean;
  warehouseBUnlocked: boolean;
  b19Unlocked: boolean;
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  knownFacts: KnownFact[];
  evidenceList: EvidenceItem[];
  puzzles: PuzzlesConfig;
  hasEnteredCase: boolean;
}
