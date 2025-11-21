/**
 * ChessBoard Component
 * 
 * Visual chess board using react-chessboard.
 * Integrates with chess.js for move validation and session store for board state management.
 * 
 * Features:
 * - Piece selection and highlighting
 * - Available moves highlighting (from chess.js)
 * - Move validation with chess.js
 * - Error feedback for invalid moves
 * - Turn management (user plays white)
 * - Check/checkmate detection
 * - Classic Chess theme styling
 * - Board orientation: user plays white (bottom)
 */

import { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { useSessionStore } from '@/stores/sessionStore';
import { ChessEngine } from '@/core/chess/engine';
import { useToast } from '@/components/UI/toast';
import { getBestMove, getDepthForDifficulty, terminateWorker } from '@/core/chess/stockfishWorker';
import { loadStockfishWorker } from '@/core/chess/stockfishLoader';
import { Badge } from '@/components/UI/badge';
import { Loader2 } from 'lucide-react';

// Standard chess starting position (FEN)
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function ChessBoard() {
  const { 
    boardState, 
    setBoardState, 
    setGameStatus, 
    setCurrentTurn,
    difficulty
  } = useSessionStore();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const { showToast, ToastContainer } = useToast();
  
  // Persist chess engine instance across re-renders
  const chessEngineRef = useRef<ChessEngine | null>(null);
  // Persist Stockfish worker instance
  const stockfishWorkerRef = useRef<Worker | null>(null);

  // Initialize chess engine and Stockfish worker
  useEffect(() => {
    // Initialize engine with boardState if available, otherwise starting position
    const initialFEN = boardState || STARTING_FEN;
    chessEngineRef.current = new ChessEngine(initialFEN);
    
    // If boardState exists, sync engine with it
    if (boardState && boardState !== STARTING_FEN) {
      chessEngineRef.current.loadFEN(boardState);
    } else if (!boardState) {
      // Initialize session store with starting position
      setBoardState(STARTING_FEN);
    }

    // Initialize Stockfish worker
    loadStockfishWorker()
      .then((worker) => {
        stockfishWorkerRef.current = worker;
      })
      .catch((error) => {
        console.error('Failed to load Stockfish worker:', error);
        showToast({
          message: 'Failed to load AI engine. AI moves will be disabled.',
          variant: 'error',
          duration: 5000,
        });
      });

    // Cleanup: terminate worker on unmount
    return () => {
      if (stockfishWorkerRef.current) {
        terminateWorker(stockfishWorkerRef.current);
        stockfishWorkerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Sync engine with boardState changes (e.g., from external updates)
  useEffect(() => {
    if (chessEngineRef.current && boardState) {
      const currentFEN = chessEngineRef.current.getFEN();
      if (boardState !== currentFEN) {
        chessEngineRef.current.loadFEN(boardState);
      }
    }
  }, [boardState]);

  // Get current position from session store or use starting position
  const currentPosition = boardState || STARTING_FEN;

  // Handle piece drop (move attempt)
  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (!chessEngineRef.current) {
      return false;
    }

    // Disable moves during AI thinking
    if (isAIThinking) {
      setMoveError("AI is thinking, please wait...");
      showToast({
        message: "AI is thinking, please wait...",
        variant: "error",
        duration: 2000,
      });
      return false;
    }

    const engine = chessEngineRef.current;

    // Check if it's user's turn (user plays white)
    if (engine.getTurn() !== 'w') {
      setMoveError("It's not your turn");
      showToast({
        message: "It's not your turn",
        variant: "error",
        duration: 2000,
      });
      return false;
    }

    // Validate move with chess.js
    if (!engine.validateMove(sourceSquare, targetSquare)) {
      setMoveError("Invalid move");
      showToast({
        message: "Invalid move",
        variant: "error",
        duration: 2000,
      });
      
      // Clear error after 2 seconds
      setTimeout(() => {
        setMoveError(null);
      }, 2000);
      
      return false;
    }

    // Execute move
    const moveResult = engine.makeMove(sourceSquare, targetSquare);
    
    if (!moveResult || !moveResult.success) {
      setMoveError("Move failed");
      showToast({
        message: "Move failed",
        variant: "error",
        duration: 2000,
      });
      return false;
    }

    // Update session store with new FEN
    setBoardState(moveResult.fen);

    // Update game status in session store (for Story 3.9 match end detection)
    if (moveResult.isCheckmate) {
      setGameStatus('checkmate');
      console.log('Checkmate detected');
    } else if (moveResult.isStalemate) {
      setGameStatus('stalemate');
      console.log('Stalemate detected');
    } else if (moveResult.isDraw) {
      setGameStatus('draw');
      console.log('Draw detected');
    } else if (moveResult.inCheck) {
      setGameStatus('check');
      console.log('Check detected');
    } else {
      setGameStatus('normal');
    }

    // Update current turn in session store (for UI display)
    setCurrentTurn(moveResult.turn === 'w' ? 'white' : 'black');

    // Clear error state and selection
    setMoveError(null);
    setSelectedSquare(null);
    setAvailableMoves([]);

    // Check if it's AI's turn (black) and trigger AI move
    if (moveResult.turn === 'b' && stockfishWorkerRef.current && difficulty) {
      triggerAIMove();
    }

    // Move successful - return true to allow react-chessboard to update
    return true;
  };

  // Trigger AI move after user move
  const triggerAIMove = async () => {
    if (!chessEngineRef.current || !stockfishWorkerRef.current || !difficulty) {
      return;
    }

    setIsAIThinking(true);
    const engine = chessEngineRef.current;
    const currentFEN = engine.getFEN();
    const depth = getDepthForDifficulty(difficulty);

    try {
      // Get best move from Stockfish
      const bestMove = await getBestMove(stockfishWorkerRef.current, currentFEN, depth);
      
      // Parse move (format: "e2e4" -> from: "e2", to: "e4")
      const from = bestMove.substring(0, 2);
      const to = bestMove.substring(2, 4);
      const promotion = bestMove.length > 4 ? bestMove.substring(4, 5) : undefined;

      // Execute AI move
      const moveResult = engine.makeMove(from, to, promotion);
      
      if (!moveResult || !moveResult.success) {
        console.error('AI move execution failed');
        showToast({
          message: 'AI move failed',
          variant: 'error',
          duration: 2000,
        });
        setIsAIThinking(false);
        return;
      }

      // Update session store with new FEN
      setBoardState(moveResult.fen);

      // Update game status
      if (moveResult.isCheckmate) {
        setGameStatus('checkmate');
        console.log('Checkmate detected');
      } else if (moveResult.isStalemate) {
        setGameStatus('stalemate');
        console.log('Stalemate detected');
      } else if (moveResult.isDraw) {
        setGameStatus('draw');
        console.log('Draw detected');
      } else if (moveResult.inCheck) {
        setGameStatus('check');
        console.log('Check detected');
      } else {
        setGameStatus('normal');
      }

      // Update current turn
      setCurrentTurn(moveResult.turn === 'w' ? 'white' : 'black');
    } catch (error) {
      console.error('AI move calculation failed:', error);
      showToast({
        message: 'AI move calculation failed',
        variant: 'error',
        duration: 3000,
      });
    } finally {
      setIsAIThinking(false);
    }
  };

  // Handle square click (piece selection)
  const handleSquareClick = (square: string) => {
    if (!chessEngineRef.current) {
      return;
    }

    // Disable selection during AI thinking
    if (isAIThinking) {
      return;
    }

    const engine = chessEngineRef.current;

    // Check if it's user's turn (user plays white)
    if (engine.getTurn() !== 'w') {
      return; // Don't allow selection when it's not user's turn
    }

    // If no piece selected, try to select this square
    if (!selectedSquare) {
      // Get legal moves for this square using chess.js
      const legalMoves = engine.getLegalMoves(square);
      
      // Only select if there are legal moves (indicates a piece is on this square)
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setAvailableMoves(legalMoves);
      }
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

  // Highlight invalid move attempt (if error exists)
  if (moveError) {
    // Could add visual feedback here (e.g., red border on last attempted square)
  }

  // Get difficulty display name
  const getDifficultyDisplayName = (diff: typeof difficulty): string => {
    if (!diff) return 'Unknown';
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-4">
      {/* AI Thinking Indicator */}
      {isAIThinking && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
          <span className="text-sm font-medium text-slate-700">AI thinking...</span>
          {difficulty && (
            <Badge variant="secondary" className="ml-2">
              {getDifficultyDisplayName(difficulty)}
            </Badge>
          )}
        </div>
      )}

      {/* Error message display (optional inline feedback) */}
      {moveError && (
        <div className="text-destructive text-sm font-medium">
          {moveError}
        </div>
      )}
      
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
      
      {/* Toast container for error notifications */}
      <ToastContainer />
    </div>
  );
}

