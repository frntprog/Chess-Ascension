/**
 * Chess Engine Wrapper
 * 
 * Wraps chess.js library to provide a clean API for move validation,
 * game state management, and special move handling.
 * 
 * Architecture: Game Engine Layer (Architecture section 3)
 * Location: /src/core/chess/engine.ts (Architecture section 8)
 */

import { Chess, Move, Square } from 'chess.js';

/**
 * Result of a move execution
 */
export interface MoveResult {
  /** Whether the move was successful */
  success: boolean;
  /** Updated FEN string after move */
  fen: string;
  /** Move object from chess.js (null if move failed) */
  move: Move | null;
  /** Whether current player is in check */
  inCheck: boolean;
  /** Whether current player is checkmated */
  isCheckmate: boolean;
  /** Whether game is stalemate */
  isStalemate: boolean;
  /** Whether game is draw */
  isDraw: boolean;
  /** Current turn ('w' for white, 'b' for black) */
  turn: 'w' | 'b';
}

/**
 * Chess Engine class wrapping chess.js
 * 
 * Provides methods for:
 * - Move validation
 * - Move execution
 * - Game state queries (check, checkmate, stalemate, draw)
 * - FEN string management
 */
export class ChessEngine {
  private chess: Chess;

  /**
   * Initialize chess engine with starting position or provided FEN
   * @param fen Optional FEN string to initialize from (defaults to starting position)
   */
  constructor(fen?: string) {
    if (fen) {
      this.chess = new Chess(fen);
    } else {
      this.chess = new Chess();
    }
  }

  /**
   * Validate if a move is legal
   * @param from Source square (e.g., "e2")
   * @param to Target square (e.g., "e4")
   * @param promotion Optional promotion piece ('q', 'r', 'b', 'n') for pawn promotion
   * @returns true if move is legal, false otherwise
   */
  validateMove(from: string, to: string, promotion?: string): boolean {
    try {
      // Check if move is legal without executing it
      const moves = this.chess.moves({ square: from as Square, verbose: true });
      return moves.some(move => 
        move.to === to && 
        (!promotion || move.promotion === promotion)
      );
    } catch {
      return false;
    }
  }

  /**
   * Execute a move and return result
   * @param from Source square (e.g., "e2")
   * @param to Target square (e.g., "e4")
   * @param promotion Optional promotion piece ('q', 'r', 'b', 'n') for pawn promotion
   * @returns MoveResult object with move details, or null if move is invalid
   */
  makeMove(from: string, to: string, promotion?: string): MoveResult | null {
    try {
      const move = this.chess.move({
        from: from as Square,
        to: to as Square,
        promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined,
      });

      if (!move) {
        return null;
      }

      return {
        success: true,
        fen: this.chess.fen(),
        move,
        inCheck: this.chess.inCheck(),
        isCheckmate: this.chess.isCheckmate(),
        isStalemate: this.chess.isStalemate(),
        isDraw: this.chess.isDraw(),
        turn: this.chess.turn(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Get current board state as FEN string
   * @returns FEN string representing current position
   */
  getFEN(): string {
    return this.chess.fen();
  }

  /**
   * Check if current player is in check
   * @returns true if current player is in check
   */
  isCheck(): boolean {
    return this.chess.inCheck();
  }

  /**
   * Check if current player is checkmated
   * @returns true if current player is checkmated
   */
  isCheckmate(): boolean {
    return this.chess.isCheckmate();
  }

  /**
   * Check if game is stalemate
   * @returns true if game is stalemate
   */
  isStalemate(): boolean {
    return this.chess.isStalemate();
  }

  /**
   * Check if game is draw
   * @returns true if game is draw
   */
  isDraw(): boolean {
    return this.chess.isDraw();
  }

  /**
   * Get current turn
   * @returns 'w' for white, 'b' for black
   */
  getTurn(): 'w' | 'b' {
    return this.chess.turn();
  }

  /**
   * Reset board to starting position
   */
  reset(): void {
    this.chess.reset();
  }

  /**
   * Load position from FEN string
   * @param fen FEN string to load
   * @returns true if FEN is valid and loaded, false otherwise
   */
  loadFEN(fen: string): boolean {
    try {
      this.chess.load(fen);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get legal moves for a square
   * @param square Square to get moves for (e.g., "e2")
   * @returns Array of target squares that are legal moves
   */
  getLegalMoves(square: string): string[] {
    try {
      const moves = this.chess.moves({
        square: square as Square,
        verbose: true,
      });
      return moves.map((move) => move.to);
    } catch {
      return [];
    }
  }

  /**
   * Get all legal moves for current position
   * @returns Array of move objects with from/to squares
   */
  getAllLegalMoves(): Array<{ from: string; to: string }> {
    try {
      const moves = this.chess.moves({ verbose: true });
      return moves.map((move) => ({
        from: move.from,
        to: move.to,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get move history with verbose information
   * @returns Array of move objects with detailed information including captured pieces
   */
  history(): Move[] {
    return this.chess.history({ verbose: true });
  }
}

/**
 * Create a new chess engine instance
 * @param fen Optional FEN string to initialize from
 * @returns ChessEngine instance
 */
export function createChessEngine(fen?: string): ChessEngine {
  return new ChessEngine(fen);
}

