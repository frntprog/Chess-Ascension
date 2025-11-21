/**
 * XP Calculation Utility
 * 
 * Calculates XP from match score using formula: XP = floor(score / 10)
 * Per PRD section 7 and Story 4.0 AC1
 */

/**
 * Calculate XP from match score
 * 
 * Formula: XP = floor(score / 10)
 * 
 * @param score - Final match score
 * @returns Calculated XP (always non-negative integer)
 * 
 * @example
 * ```typescript
 * calculateXP(0)   // 0
 * calculateXP(9)   // 0 (floor)
 * calculateXP(10)  // 1
 * calculateXP(99)  // 9
 * calculateXP(100) // 10
 * ```
 */
export function calculateXP(score: number): number {
  if (score < 0) {
    return 0;
  }
  return Math.floor(score / 10);
}

