/**
 * Session Store
 * 
 * Manages temporary game state (board, score, abilities, flags).
 * Never writes to persistence directly (Architecture section 3 - Session Layer).
 * 
 * Store structure is placeholder-only in Epic 1; implementation deferred to Epic 3+.
 */

import { create } from 'zustand';

/**
 * Session state interface matching Architecture section 3 (Session Layer)
 */
export interface SessionState {
  /** FEN string representing current board state (not implemented in Epic 1) */
  boardState: string;
  
  /** Session-only score (not implemented in Epic 1) */
  sessionScore: number;
  
  /** Session abilities array (not implemented in Epic 1) */
  sessionAbilities: unknown[];
  
  /** RPG mode flags (not implemented in Epic 1) */
  rpgFlags: {
    doubleMoveActive: boolean;
    hintModeActive: boolean;
    shieldActive: boolean;
    shieldedPieceSquare: string | null;
  };
  
  /** AI difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  
  /** Selected game mode */
  mode: 'classic' | 'rpg' | null;
  
  /** Match lifecycle state */
  sessionLifecycle: 'idle' | 'active' | 'ended';
  
  /** Game status (optional, for Story 3.9 match end detection) */
  gameStatus: 'normal' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  
  /** Current turn (optional, for UI display) */
  currentTurn: 'white' | 'black';
  
  /** Action: Set selected game mode */
  setMode: (mode: 'classic' | 'rpg' | null) => void;
  
  /** Action: Set AI difficulty level */
  setDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced' | null) => void;
  
  /** Action: Set board state (FEN string) */
  setBoardState: (boardState: string) => void;
  
  /** Action: Set game status (optional, for Story 3.9) */
  setGameStatus: (status: 'normal' | 'check' | 'checkmate' | 'stalemate' | 'draw') => void;
  
  /** Action: Set current turn (optional, for UI display) */
  setCurrentTurn: (turn: 'white' | 'black') => void;
}

/**
 * Session store slice (placeholder implementation)
 * 
 * Implementation deferred to Epic 3+ when game board and session logic are added.
 * 
 * @example
 * ```typescript
 * import { useSessionStore } from '@/stores/sessionStore';
 * 
 * // Store will be implemented in Epic 3+
 * const sessionState = useSessionStore();
 * ```
 */
export const useSessionStore = create<SessionState>()((set) => ({
  boardState: '',
  sessionScore: 0,
  sessionAbilities: [],
  rpgFlags: {
    doubleMoveActive: false,
    hintModeActive: false,
    shieldActive: false,
    shieldedPieceSquare: null,
  },
  difficulty: null,
  mode: null,
  sessionLifecycle: 'idle',
  gameStatus: 'normal',
  currentTurn: 'white',
  setMode: (mode: 'classic' | 'rpg' | null) => set({ mode }),
  setDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced' | null) => set({ difficulty }),
  setBoardState: (boardState: string) => set({ boardState }),
  setGameStatus: (status: 'normal' | 'check' | 'checkmate' | 'stalemate' | 'draw') => set({ gameStatus: status }),
  setCurrentTurn: (turn: 'white' | 'black') => set({ currentTurn: turn }),
}));

