/**
 * Rank Mapping Utility
 * 
 * Maps level to rank based on Story 4.0 AC1:
 * - Level 1-2: "Pawn"
 * - Level 3-4: "Knight"
 * - Level 5-6: "Bishop"
 * - Level 7-8: "Rook"
 * - Level 9-10: "Queen"
 * - Level 11+: "Queen" (default for levels beyond 10)
 */

/**
 * Get rank from level
 * 
 * @param level - Current level
 * @returns Rank string
 * 
 * @example
 * ```typescript
 * getRankFromLevel(1)  // "Pawn"
 * getRankFromLevel(2)  // "Pawn"
 * getRankFromLevel(3)  // "Knight"
 * getRankFromLevel(5)  // "Bishop"
 * getRankFromLevel(7)  // "Rook"
 * getRankFromLevel(9)  // "Queen"
 * getRankFromLevel(10) // "Queen"
 * getRankFromLevel(15) // "Queen" (default for levels beyond 10)
 * ```
 */
export function getRankFromLevel(level: number): string {
  if (level < 1) {
    return 'Pawn';
  }
  
  if (level <= 2) {
    return 'Pawn';
  } else if (level <= 4) {
    return 'Knight';
  } else if (level <= 6) {
    return 'Bishop';
  } else if (level <= 8) {
    return 'Rook';
  } else {
    // Level 9+ (including levels beyond 10)
    return 'Queen';
  }
}

