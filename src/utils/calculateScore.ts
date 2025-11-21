/**
 * Score Calculation Utility
 * 
 * Calculates score points for captured chess pieces.
 * Used by session store and components to update score on piece capture.
 * 
 * Architecture: Utility function (Architecture section 8 - File & Folder Structure)
 * Location: /src/utils/calculateScore.ts
 * 
 * Scoring rules (from PRD section 6 - Scoring Rules):
 * - Pawn: +10
 * - Knight/Bishop: +20
 * - Rook: +40
 * - Queen: +60
 */

/**
 * Piece type representation from chess.js
 * Lowercase for black pieces, uppercase for white pieces
 */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'P' | 'N' | 'B' | 'R' | 'Q';

/**
 * Calculate score points for a captured piece
 * 
 * @param piece Piece type from chess.js (e.g., 'p' for pawn, 'q' for queen)
 *              Can be lowercase (black) or uppercase (white)
 * @returns Score points for the captured piece (0 if piece type is invalid)
 * 
 * @example
 * ```typescript
 * calculateScoreForPiece('p') // Returns 10 (pawn)
 * calculateScoreForPiece('q') // Returns 60 (queen)
 * calculateScoreForPiece('n') // Returns 20 (knight)
 * ```
 */
export function calculateScoreForPiece(piece: string): number {
  // Normalize to lowercase for case-insensitive matching
  const normalizedPiece = piece.toLowerCase();

  switch (normalizedPiece) {
    case 'p': // Pawn
      return 10;
    case 'n': // Knight
    case 'b': // Bishop
      return 20;
    case 'r': // Rook
      return 40;
    case 'q': // Queen
      return 60;
    case 'k': // King (should not be captured, but handle gracefully)
      return 0;
    default:
      // Unknown piece type - return 0 (should not happen in normal gameplay)
      console.warn(`Unknown piece type for score calculation: ${piece}`);
      return 0;
  }
}

