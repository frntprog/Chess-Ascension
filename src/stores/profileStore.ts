/**
 * Profile Store
 * 
 * Manages persistent user data (XP, level, rank, unlocks).
 * Syncs with localStorage via profileStorage utility (Story 1.2) in Epic 2+.
 * 
 * Store structure is placeholder-only in Epic 1; implementation deferred to Epic 2+.
 */

import { create } from 'zustand';
import { calculateLevel } from '@/utils/calculateLevel';
import { getRankFromLevel } from '@/utils/rankMapping';

/**
 * Profile state interface matching Architecture section 3 (Profile Layer)
 * Aligns with Profile data model from PRD section 8
 */
export interface ProfileState {
  /** User identifier */
  nickname: string;
  
  /** Accumulated XP */
  xp: number;
  
  /** Current level */
  level: number;
  
  /** Current rank */
  rank: string;
  
  /** Array of unlocked skin names */
  unlockedSkins: string[];
  
  /** Currently active skin */
  selectedSkin: string;
  
  /** Array of unlocked ability names */
  unlockedAbilities: string[];
  
  /** Highest score achieved */
  bestScore: number;
  
  /** Match statistics */
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
  };
}

/**
 * Profile store actions interface
 */
interface ProfileStoreActions {
  /**
   * Update profile state (used after profile creation or updates)
   */
  updateProfile: (profile: ProfileState) => void
  
  /**
   * Reset profile to initial state
   */
  resetProfile: () => void
  
  /**
   * Add XP to profile and recalculate level/rank
   * Per Story 4.0 AC1
   */
  addXP: (xp: number) => void
  
  /**
   * Recalculate level and rank from current XP
   * Helper function for manual recalculation
   */
  updateLevelAndRank: () => void
  
  /**
   * Increment games played counter
   * Per Story 4.0 AC2
   */
  incrementGamesPlayed: () => void
  
  /**
   * Update best score if current score is higher
   * Per Story 4.0 AC2
   */
  updateBestScore: (score: number) => void
  
  /**
   * Increment wins counter
   * Per Story 4.0 AC2
   */
  incrementWins: () => void
  
  /**
   * Increment losses counter
   * Per Story 4.0 AC2
   */
  incrementLosses: () => void
}

/**
 * Initial profile state
 */
const initialState: ProfileState = {
  nickname: '',
  xp: 0,
  level: 1,
  rank: 'Pawn',
  unlockedSkins: ['Classic'],
  selectedSkin: 'Classic',
  unlockedAbilities: [],
  bestScore: 0,
  stats: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
  },
}

/**
 * Profile store slice with actions
 * 
 * Integrates with profileStorage.ts service for localStorage operations.
 * Store state is synced with localStorage after profile creation/updates.
 * 
 * @example
 * ```typescript
 * import { useProfileStore } from '@/stores/profileStore';
 * 
 * // Access profile state
 * const { nickname, level, rank } = useProfileStore();
 * 
 * // Update profile state
 * useProfileStore.getState().updateProfile(newProfileState);
 * ```
 */
export const useProfileStore = create<ProfileState & ProfileStoreActions>()((set, get) => ({
  ...initialState,
  
  updateProfile: (profile: ProfileState) => {
    set(profile)
  },
  
  resetProfile: () => {
    set(initialState)
  },
  
  addXP: (xp: number) => {
    const currentState = get();
    const newXP = currentState.xp + xp;
    const newLevel = calculateLevel(newXP);
    const newRank = getRankFromLevel(newLevel);
    
    set({
      xp: newXP,
      level: newLevel,
      rank: newRank,
    });
  },
  
  updateLevelAndRank: () => {
    const currentState = get();
    const newLevel = calculateLevel(currentState.xp);
    const newRank = getRankFromLevel(newLevel);
    
    set({
      level: newLevel,
      rank: newRank,
    });
  },
  
  incrementGamesPlayed: () => {
    set((state) => ({
      stats: {
        ...state.stats,
        gamesPlayed: state.stats.gamesPlayed + 1,
      },
    }));
  },
  
  updateBestScore: (score: number) => {
    const currentState = get();
    if (score > currentState.bestScore) {
      set({ bestScore: score });
    }
  },
  
  incrementWins: () => {
    set((state) => ({
      stats: {
        ...state.stats,
        wins: state.stats.wins + 1,
      },
    }));
  },
  
  incrementLosses: () => {
    set((state) => ({
      stats: {
        ...state.stats,
        losses: state.stats.losses + 1,
      },
    }));
  },
}));

