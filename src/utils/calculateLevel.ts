/**
 * Level Calculation Utility
 * 
 * Calculates level from total XP using thresholds: 2 XP per level (demo mode)
 * Per Story 4.0 AC1
 * 
 * Level thresholds:
 * - Level 1: 0-1 XP
 * - Level 2: 2-3 XP
 * - Level 3: 4-5 XP
 * - Level 4: 6-7 XP
 * - Level 5: 8-9 XP
 * - Level 6: 10-11 XP
 * - Level 7: 12-13 XP
 * - Level 8: 14-15 XP
 * - Level 9: 16-17 XP
 * - Level 10: 18+ XP (and beyond, progressive thresholds)
 */

/**
 * Calculate level from total XP
 * 
 * Formula: Level = floor(totalXP / 2) + 1
 * Handles edge case: 0 XP = Level 1
 * 
 * @param totalXP - Accumulated total XP
 * @returns Current level (minimum 1)
 * 
 * @example
 * ```typescript
 * calculateLevel(0)   // 1
 * calculateLevel(1)   // 1
 * calculateLevel(2)   // 2
 * calculateLevel(3)   // 2
 * calculateLevel(4)   // 3
 * calculateLevel(18)  // 10
 * ```
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) {
    return 1;
  }
  return Math.floor(totalXP / 2) + 1;
}

