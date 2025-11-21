/**
 * Skin Unlock Utility
 * 
 * Defines skin unlock mappings based on level thresholds.
 * Per Story 4.0 AC3:
 * - Level 1: "Classic" (initial)
 * - Level 3: "Monochrome"
 * - Level 5: "Neon"
 * - Level 7: "Gold"
 */

/**
 * Skin unlock mappings: level threshold -> skin name
 */
export const SKIN_UNLOCK_MAPPINGS: Array<{ level: number; skin: string }> = [
  { level: 1, skin: 'Classic' },
  { level: 3, skin: 'Monochrome' },
  { level: 5, skin: 'Neon' },
  { level: 7, skin: 'Gold' },
];

/**
 * Get all skins unlocked at a given level (includes all previous unlocks)
 * 
 * Returns array of all skins that should be unlocked at the specified level,
 * including all skins from previous level thresholds.
 * 
 * @param level - Current level
 * @returns Array of unlocked skin names
 * 
 * @example
 * ```typescript
 * getSkinsUnlockedAtLevel(1) // ["Classic"]
 * getSkinsUnlockedAtLevel(3) // ["Classic", "Monochrome"]
 * getSkinsUnlockedAtLevel(5) // ["Classic", "Monochrome", "Neon"]
 * getSkinsUnlockedAtLevel(7) // ["Classic", "Monochrome", "Neon", "Gold"]
 * ```
 */
export function getSkinsUnlockedAtLevel(level: number): string[] {
  if (level < 1) {
    return [];
  }
  
  // Filter mappings where level threshold <= current level
  // Sort by level to ensure correct order
  const unlockedSkins = SKIN_UNLOCK_MAPPINGS
    .filter(mapping => mapping.level <= level)
    .sort((a, b) => a.level - b.level)
    .map(mapping => mapping.skin);
  
  return unlockedSkins;
}

