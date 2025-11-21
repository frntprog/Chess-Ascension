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

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ChessBoard } from "@/components/Board/ChessBoard"
import { ScoreDisplay } from "@/components/Board/ScoreDisplay"
import { ComboDisplay } from "@/components/Board/ComboDisplay"
import { GameInfoPanel } from "@/components/Board/GameInfoPanel"
import MatchResultModal from "@/components/Board/MatchResultModal"
import { LevelUpModal } from "@/components/LevelUpModal"
import { useSessionStore } from "@/stores/sessionStore"
import { useProfileStore } from "@/stores/profileStore"
import { processMatchEnd } from "@/utils/matchEndProcessor"
import { saveProfile } from "@/services/profileStorage"
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
  const { gameStatus, resetSession, difficulty, sessionScore, currentTurn } = useSessionStore();
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{
    level: number;
    rank: string;
    unlockedSkins: string[];
    unlockedAbilities: string[];
    previousRank?: string;
  } | null>(null);
  
  // Track if match end has been processed (prevent duplicate processing)
  const matchEndProcessedRef = useRef(false);

  // Watch gameStatus changes to trigger match end processing
  useEffect(() => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw') {
      // Process match end only once
      if (!matchEndProcessedRef.current) {
        matchEndProcessedRef.current = true;
        
        // Determine match result
        let result: 'win' | 'loss' | 'draw' = 'draw';
        if (gameStatus === 'checkmate') {
          // If currentTurn === 'black', user won (AI's turn but checkmated = user checkmated AI)
          // If currentTurn === 'white', user lost (user's turn but checkmated = AI checkmated user)
          result = currentTurn === 'black' ? 'win' : 'loss';
        } else {
          result = 'draw';
        }
        
        // Process match end: calculate XP, update profile, detect level-ups and unlocks
        const levelUpInfo = processMatchEnd(sessionScore, result);
        
        // Update localStorage profile (get fresh state after processing)
        try {
          const currentProfile = useProfileStore.getState();
          const profileToSave = {
            nickname: currentProfile.nickname,
            xp: currentProfile.xp,
            level: currentProfile.level,
            rank: currentProfile.rank,
            unlockedSkins: currentProfile.unlockedSkins,
            selectedSkin: currentProfile.selectedSkin,
            unlockedAbilities: currentProfile.unlockedAbilities,
            gamesPlayed: currentProfile.stats.gamesPlayed,
            bestScore: currentProfile.bestScore,
            wins: currentProfile.stats.wins,
            losses: currentProfile.stats.losses,
          };
          saveProfile(profileToSave);
        } catch (error) {
          // Handle localStorage errors (quota exceeded, etc.)
          console.error('Failed to save profile to localStorage:', error);
          // Show error message to user (could use toast notification)
          if (error instanceof Error) {
            alert(`Failed to save progress: ${error.message}`);
          }
        }
        
        // Show level-up modal if leveled up
        if (levelUpInfo.leveledUp) {
          setLevelUpData({
            level: levelUpInfo.newLevel,
            rank: levelUpInfo.newRank,
            unlockedSkins: levelUpInfo.unlockedSkins,
            unlockedAbilities: levelUpInfo.unlockedAbilities,
            previousRank: levelUpInfo.previousRank !== levelUpInfo.newRank ? levelUpInfo.previousRank : undefined,
          });
          setShowLevelUpModal(true);
        } else {
          // No level-up, show match result modal directly
          setShowMatchResult(true);
        }
      }
    } else {
      // Reset match end processed flag when game status changes back to normal
      matchEndProcessedRef.current = false;
    }
  }, [gameStatus, sessionScore, currentTurn]);

  // Handle level-up modal close
  const handleLevelUpModalClose = () => {
    setShowLevelUpModal(false);
    setLevelUpData(null);
    // After level-up modal closes, show match result modal
    setShowMatchResult(true);
  };

  // Handle "Play Again" button click
  const handlePlayAgain = () => {
    resetSession();
    navigate('/mode-selection');
    setShowMatchResult(false);
    setShowLevelUpModal(false);
    setLevelUpData(null);
    matchEndProcessedRef.current = false;
  };

  // Handle "Home" button click
  const handleHome = () => {
    resetSession();
    navigate('/');
    setShowMatchResult(false);
    setShowLevelUpModal(false);
    setLevelUpData(null);
    matchEndProcessedRef.current = false;
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
      
      {/* Level-Up Modal */}
      {levelUpData && (
        <LevelUpModal
          open={showLevelUpModal}
          onClose={handleLevelUpModalClose}
          level={levelUpData.level}
          rank={levelUpData.rank}
          unlockedSkins={levelUpData.unlockedSkins}
          unlockedAbilities={levelUpData.unlockedAbilities}
          previousRank={levelUpData.previousRank}
        />
      )}
      
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

