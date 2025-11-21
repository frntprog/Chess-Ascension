/**
 * Ability Unlock Utility
 * 
 * Defines ability unlock mappings based on level thresholds.
 * Per Story 4.0 AC4:
 * - Level 5: "Shield"
 */

/**
 * Ability unlock mappings: level threshold -> ability name
 */
export const ABILITY_UNLOCK_MAPPINGS: Array<{ level: number; ability: string }> = [
  { level: 5, ability: 'Shield' },
];

/**
 * Get all abilities unlocked at a given level (includes all previous unlocks)
 * 
 * Returns array of all abilities that should be unlocked at the specified level,
 * including all abilities from previous level thresholds.
 * 
 * @param level - Current level
 * @returns Array of unlocked ability names
 * 
 * @example
 * ```typescript
 * getAbilitiesUnlockedAtLevel(4) // []
 * getAbilitiesUnlockedAtLevel(5) // ["Shield"]
 * getAbilitiesUnlockedAtLevel(10) // ["Shield"]
 * ```
 */
export function getAbilitiesUnlockedAtLevel(level: number): string[] {
  if (level < 1) {
    return [];
  }
  
  // Filter mappings where level threshold <= current level
  // Sort by level to ensure correct order
  const unlockedAbilities = ABILITY_UNLOCK_MAPPINGS
    .filter(mapping => mapping.level <= level)
    .sort((a, b) => a.level - b.level)
    .map(mapping => mapping.ability);
  
  return unlockedAbilities;
}

