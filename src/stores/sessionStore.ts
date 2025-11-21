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
  
  /** Turn number counter (increments for each user move) */
  turnNumber: number;
  
  /** Capture history for combo tracking (last 3 turns) */
  captureHistory: Array<{ turn: number; piece: string; timestamp: number }>;
  
  /** Feature flag: Enable/disable combo bonuses */
  comboBonusesEnabled: boolean;
  
  /** Current combo info for display (streak and bonus) */
  currentCombo: { streak: number; bonus: number } | null;
  
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
  
  /** Action: Set session score directly */
  setSessionScore: (score: number) => void;
  
  /** Action: Increment session score by points */
  incrementSessionScore: (points: number) => void;
  
  /** Action: Reset session score to 0 */
  resetSessionScore: () => void;
  
  /** Action: Increment turn number */
  incrementTurnNumber: () => void;
  
  /** Action: Reset turn number to 0 */
  resetTurnNumber: () => void;
  
  /** Action: Add capture to history for combo tracking */
  addCaptureToHistory: (piece: string) => void;
  
  /** Action: Reset capture history (clears combo streak) */
  resetCaptureHistory: () => void;
  
  /** Action: Check combo streak (returns 2 or 3, or 0 if no combo) */
  checkComboStreak: () => number;
  
  /** Action: Calculate combo bonus based on streak (returns bonus points: 10 for 2x, 20 for 3x, 0 otherwise) */
  calculateComboBonus: () => number;
  
  /** Action: Set current combo info for display */
  setCurrentCombo: (combo: { streak: number; bonus: number } | null) => void;
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
  turnNumber: 0,
  captureHistory: [],
  comboBonusesEnabled: true,
  currentCombo: null,
  setMode: (mode: 'classic' | 'rpg' | null) => set({ mode }),
  setDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced' | null) => set({ difficulty }),
  setBoardState: (boardState: string) => set({ boardState }),
  setGameStatus: (status: 'normal' | 'check' | 'checkmate' | 'stalemate' | 'draw') => set({ gameStatus: status }),
  setCurrentTurn: (turn: 'white' | 'black') => set({ currentTurn: turn }),
  setSessionScore: (score: number) => set({ sessionScore: score }),
  incrementSessionScore: (points: number) => set((state) => ({ sessionScore: state.sessionScore + points })),
  resetSessionScore: () => set({ sessionScore: 0 }),
  incrementTurnNumber: () => set((state) => ({ turnNumber: state.turnNumber + 1 })),
  resetTurnNumber: () => set({ turnNumber: 0 }),
  addCaptureToHistory: (piece: string) => set((state) => {
    const newHistory = [
      ...state.captureHistory,
      { turn: state.turnNumber, piece, timestamp: Date.now() }
    ];
    // Keep only last 3 turns
    return { captureHistory: newHistory.slice(-3) };
  }),
  resetCaptureHistory: () => set({ captureHistory: [], currentCombo: null }),
  checkComboStreak: () => {
    const state = useSessionStore.getState();
    const history = state.captureHistory;
    
    if (history.length < 2) {
      return 0;
    }
    
    // Check if last 2-3 captures are consecutive turns
    // For 2x combo: last 2 captures in consecutive turns (e.g., turn 1 and turn 2)
    // For 3x combo: last 3 captures in consecutive turns (e.g., turn 1, turn 2, turn 3)
    const lastTurn = history[history.length - 1]?.turn;
    const secondLastTurn = history[history.length - 2]?.turn;
    const thirdLastTurn = history[history.length - 3]?.turn;
    
    // Check for 3x combo first (more valuable)
    if (history.length >= 3 && thirdLastTurn !== undefined) {
      // All 3 captures must be in consecutive turns (differ by exactly 1)
      if (thirdLastTurn === secondLastTurn - 1 && 
          secondLastTurn === lastTurn - 1) {
        return 3;
      }
    }
    
    // Check for 2x combo
    if (history.length >= 2 && secondLastTurn !== undefined) {
      // Last 2 captures must be in consecutive turns (differ by exactly 1)
      if (secondLastTurn === lastTurn - 1) {
        return 2;
      }
    }
    
    return 0;
  },
  calculateComboBonus: () => {
    const state = useSessionStore.getState();
    if (!state.comboBonusesEnabled) {
      return 0;
    }
    
    const streak = state.checkComboStreak();
    if (streak === 2) {
      return 10;
    } else if (streak === 3) {
      return 20;
    }
    return 0;
  },
  setCurrentCombo: (combo: { streak: number; bonus: number } | null) => set({ currentCombo: combo }),
}));

