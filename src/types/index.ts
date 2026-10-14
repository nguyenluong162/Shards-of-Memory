export type CaseNoteCategory = 
  | 'Suspect' 
  | 'Timeline' 
  | 'Evidence' 
  | 'Puzzle' 
  | 'Vehicle' 
  | 'Theory' 
  | 'General';

export interface CaseNote {
  id: string;
  title: string;
  content: string;
  category: CaseNoteCategory;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  thumbnailUrl?: string;
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
  phase2AcceptedCodes?: string[];
  phase1Hint: string;
  phase2Hint: string;
}

export interface GameState {
  currentPhase: number;
  phoneUnlocked: boolean;
  warehouseBUnlocked: boolean;
  phase1Complete: boolean;
  phase2Complete: boolean;
  hintsEnabled: boolean;
  notes: CaseNote[];
  knownFacts: KnownFact[];
  evidenceList: EvidenceItem[];
  puzzles: PuzzlesConfig;
  hasEnteredCase: boolean;
}
