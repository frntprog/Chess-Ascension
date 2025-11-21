/**
 * ChessBoard Component
 * 
 * Visual chess board using react-chessboard.
 * Integrates with session store for board state management.
 * 
 * Features:
 * - Piece selection and highlighting
 * - Available moves highlighting
 * - Classic Chess theme styling
 * - Board orientation: user plays white (bottom)
 */

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useSessionStore } from '@/stores/sessionStore';

// Standard chess starting position (FEN)
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function ChessBoard() {
  const { boardState, setBoardState } = useSessionStore();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);

  // Initialize board state with starting position if empty
  useEffect(() => {
    if (!boardState) {
      setBoardState(STARTING_FEN);
    }
  }, [boardState, setBoardState]);

  // Get current position from session store or use starting position
  const currentPosition = boardState || STARTING_FEN;

  // Handle piece drop (move attempt)
  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    // Placeholder: Accept all moves for now
    // Full validation will be implemented in Story 3.5 with chess.js
    
    // For now, just update the board state with a simple FEN update
    // This is a placeholder - proper FEN generation will be in Story 3.5
    // We'll just mark that a move was attempted
    console.log('Move attempted:', sourceSquare, 'to', targetSquare);
    
    // Clear selection after move attempt
    setSelectedSquare(null);
    setAvailableMoves([]);
    
    // Return true to accept the move (placeholder)
    // In Story 3.5, this will validate with chess.js first
    return true;
  };

  // Handle square click (piece selection)
  const handleSquareClick = (square: string) => {
    // If no piece selected, try to select this square
    if (!selectedSquare) {
      // For now, allow selecting any square
      // In Story 3.5, we'll validate that it's a white piece and user's turn
      setSelectedSquare(square);
      
      // Placeholder: Calculate available moves
      // In Story 3.5, this will use chess.js to get legal moves
      // For now, show some example moves (this is just for visual testing)
      const exampleMoves = getExampleMoves(square);
      setAvailableMoves(exampleMoves);
    } else {
      // Piece already selected - attempt move
      if (selectedSquare === square) {
        // Clicked same square - deselect
        setSelectedSquare(null);
        setAvailableMoves([]);
      } else {
        // Attempt move to clicked square
        handlePieceDrop(selectedSquare, square);
      }
    }
  };

  // Placeholder function to get example moves for a square
  // This will be replaced with chess.js validation in Story 3.5
  const getExampleMoves = (square: string): string[] => {
    // Simple placeholder: return some adjacent squares
    // Real implementation will use chess.js to get legal moves
    const file = square[0];
    const rank = parseInt(square[1]);
    const moves: string[] = [];
    
    // Add some example adjacent squares (not real chess logic)
    if (rank < 8) moves.push(`${file}${rank + 1}`);
    if (rank > 1) moves.push(`${file}${rank - 1}`);
    
    return moves;
  };

  // Build custom square styles for highlighting
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  
  // Highlight selected square
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(245, 158, 11, 0.4)', // Accent color with opacity
      border: '2px solid #f59e0b', // Accent color outline
    };
  }
  
  // Highlight available move squares
  availableMoves.forEach((square) => {
    if (square !== selectedSquare) {
      customSquareStyles[square] = {
        backgroundColor: 'rgba(245, 158, 11, 0.3)', // Subtle accent highlight
      };
    }
  });

  return (
    <div className="flex justify-center items-center w-full">
      <div style={{ width: '600px', height: '600px' }}>
        <Chessboard
          options={{
            position: currentPosition,
            boardOrientation: 'white',
            darkSquareStyle: { backgroundColor: '#475569' }, // Slate 600
            lightSquareStyle: { backgroundColor: '#f8fafc' }, // Slate 50
            squareStyles: customSquareStyles,
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              return handlePieceDrop(sourceSquare, targetSquare || '');
            },
            onSquareClick: ({ square }) => {
              handleSquareClick(square);
            },
          }}
        />
      </div>
    </div>
  );
}

