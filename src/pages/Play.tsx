/**
 * Play Page Component
 * 
 * Game board page displaying the chess board and score display.
 * Implements centered layout per UX Design Specification section 4.1.
 * Integrates MatchResultModal for match end detection and result display.
 * 
 * Features:
 * - Difficulty indicator badge
 * - Back button navigation
 * - Game info panel (turn indicator, game status)
 * - Responsive layout (desktop: sidebar, mobile: stacked)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ChessBoard } from "@/components/Board/ChessBoard"
import { ScoreDisplay } from "@/components/Board/ScoreDisplay"
import { ComboDisplay } from "@/components/Board/ComboDisplay"
import { GameInfoPanel } from "@/components/Board/GameInfoPanel"
import MatchResultModal from "@/components/Board/MatchResultModal"
import { useSessionStore } from "@/stores/sessionStore"
import { Button } from "@/components/UI/button"
import { Badge } from "@/components/UI/badge"

/**
 * Helper function to get difficulty display name
 */
function getDifficultyDisplayName(difficulty: string | null): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Unknown';
  }
}

export function Play() {
  const navigate = useNavigate();
  const { gameStatus, resetSession, difficulty } = useSessionStore();
  const [showMatchResult, setShowMatchResult] = useState(false);

  // Watch gameStatus changes to trigger modal
  useEffect(() => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw') {
      setShowMatchResult(true);
    }
  }, [gameStatus]);

  // Handle "Play Again" button click
  const handlePlayAgain = () => {
    resetSession();
    navigate('/mode-selection');
    setShowMatchResult(false);
  };

  // Handle "Home" button click
  const handleHome = () => {
    resetSession();
    navigate('/');
    setShowMatchResult(false);
  };

  // Handle "Back" button click
  const handleBack = () => {
    navigate('/mode-selection');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Top Bar: Back Button and Difficulty Badge */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Difficulty Badge */}
          {difficulty && (
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              {getDifficultyDisplayName(difficulty)}
            </Badge>
          )}
        </div>

        {/* Main Layout: Board and Sidebar */}
        <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-8 py-8">
          {/* Chess Board - Centered */}
          <div className="flex justify-center w-full lg:w-auto">
            <ChessBoard />
          </div>
          
          {/* Sidebar: Score Display, Combo Display, and Game Info Panel */}
          <div className="flex flex-col justify-center lg:justify-start gap-4 w-full lg:w-auto">
            <ScoreDisplay />
            <ComboDisplay />
            <GameInfoPanel />
          </div>
        </div>
      </div>
      
      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={showMatchResult}
        onClose={() => setShowMatchResult(false)}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
      />
    </div>
  )
}

