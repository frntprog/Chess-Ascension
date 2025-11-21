/**
 * Match End Processor Utility
 * 
 * Processes match end: calculates XP, updates profile, detects level-ups and unlocks.
 * Per Story 4.0 AC1-AC5
 */

import { calculateXP } from './calculateXP';
import { getSkinsUnlockedAtLevel } from './skinUnlocks';
import { getAbilitiesUnlockedAtLevel } from './abilityUnlocks';
import { useProfileStore } from '@/stores/profileStore';

export interface LevelUpInfo {
  leveledUp: boolean;
  newLevel: number;
  newRank: string;
  previousLevel: number;
  previousRank: string;
  unlockedSkins: string[];
  unlockedAbilities: string[];
}

/**
 * Process match end: calculate XP, update profile, detect level-ups and unlocks
 * 
 * @param score - Final match score
 * @param result - Match result: 'win' | 'loss' | 'draw'
 * @returns Level-up information for notification display
 * 
 * @example
 * ```typescript
 * const levelUpInfo = processMatchEnd(150, 'win');
 * if (levelUpInfo.leveledUp) {
 *   // Show level-up modal
 * }
 * ```
 */
export function processMatchEnd(score: number, result: 'win' | 'loss' | 'draw'): LevelUpInfo {
  const profileStore = useProfileStore.getState();
  
  // Store previous level and rank for comparison
  const previousLevel = profileStore.level;
  const previousRank = profileStore.rank;
  
  // Calculate XP from score
  const xpGained = calculateXP(score);
  
  // Add XP to profile (this recalculates level and rank automatically)
  profileStore.addXP(xpGained);
  
  // Get updated state after XP addition
  const updatedState = useProfileStore.getState();
  const newLevel = updatedState.level;
  const newRank = updatedState.rank;
  
  // Detect level-up
  const leveledUp = newLevel > previousLevel;
  
  // Get unlocked skins and abilities for new level
  const allUnlockedSkins = getSkinsUnlockedAtLevel(newLevel);
  const allUnlockedAbilities = getAbilitiesUnlockedAtLevel(newLevel);
  
  // Find newly unlocked skins (not in previous unlockedSkins)
  const previousUnlockedSkins = profileStore.unlockedSkins;
  const newlyUnlockedSkins = allUnlockedSkins.filter(
    skin => !previousUnlockedSkins.includes(skin)
  );
  
  // Find newly unlocked abilities (not in previous unlockedAbilities)
  const previousUnlockedAbilities = profileStore.unlockedAbilities;
  const newlyUnlockedAbilities = allUnlockedAbilities.filter(
    ability => !previousUnlockedAbilities.includes(ability)
  );
  
  // Update unlockedSkins and unlockedAbilities in profile store
  // (These will be persisted to localStorage in Play.tsx)
  useProfileStore.setState({
    unlockedSkins: allUnlockedSkins,
    unlockedAbilities: allUnlockedAbilities,
  });
  
  // Update stats
  profileStore.incrementGamesPlayed();
  profileStore.updateBestScore(score);
  
  if (result === 'win') {
    profileStore.incrementWins();
  } else if (result === 'loss') {
    profileStore.incrementLosses();
  }
  
  return {
    leveledUp,
    newLevel,
    newRank,
    previousLevel,
    previousRank,
    unlockedSkins: newlyUnlockedSkins,
    unlockedAbilities: newlyUnlockedAbilities,
  };
}

