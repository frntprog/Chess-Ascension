/**
 * Level Calculation Utility
 * 
 * Calculates level from total XP using thresholds: 100 XP per level
 * Per Story 4.0 AC1
 * 
 * Level thresholds:
 * - Level 1: 0-99 XP
 * - Level 2: 100-199 XP
 * - Level 3: 200-299 XP
 * - Level 4: 300-399 XP
 * - Level 5: 400-499 XP
 * - Level 6: 500-599 XP
 * - Level 7: 600-699 XP
 * - Level 8: 700-799 XP
 * - Level 9: 800-899 XP
 * - Level 10: 900+ XP (and beyond, progressive thresholds)
 */

/**
 * Calculate level from total XP
 * 
 * Formula: Level = floor(totalXP / 100) + 1
 * Handles edge case: 0 XP = Level 1
 * 
 * @param totalXP - Accumulated total XP
 * @returns Current level (minimum 1)
 * 
 * @example
 * ```typescript
 * calculateLevel(0)   // 1
 * calculateLevel(99)  // 1
 * calculateLevel(100) // 2
 * calculateLevel(199) // 2
 * calculateLevel(200) // 3
 * calculateLevel(900) // 10
 * ```
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) {
    return 1;
  }
  return Math.floor(totalXP / 100) + 1;
}

