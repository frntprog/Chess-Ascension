/**
 * Match Result Modal Component
 * 
 * Displays match result (Win/Loss/Draw) with final score and XP gained.
 * Uses shadcn/ui Dialog component with Classic Chess theme styling.
 * 
 * Features:
 * - Result message based on gameStatus and currentTurn
 * - Final score display
 * - XP gained calculation: floor(score / 10)
 * - "Play Again" button (primary) - navigates to mode selection
 * - "Home" button (secondary) - navigates to landing page
 * - Modal cannot be dismissed by clicking outside (user must choose action)
 * - Centered, max-width 600px (UX Design Specification section 7.3)
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { useSessionStore } from '@/stores/sessionStore';

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function MatchResultModal({
  isOpen,
  onClose: _onClose, // Required prop but not used (modal cannot be dismissed by clicking outside)
  onPlayAgain,
  onHome,
}: MatchResultModalProps) {
  const { gameStatus, sessionScore, currentTurn } = useSessionStore();

  // Calculate XP gained: floor(score / 10)
  const xpGained = Math.floor(sessionScore / 10);

  // Determine result message based on gameStatus and currentTurn
  let resultMessage: string;
  let resultColor: string;

  if (gameStatus === 'checkmate') {
    // If currentTurn === 'black', user won (AI's turn but checkmated = user checkmated AI)
    // If currentTurn === 'white', user lost (user's turn but checkmated = AI checkmated user)
    if (currentTurn === 'black') {
      resultMessage = 'You Win!';
      resultColor = 'text-green-600'; // Green for win
    } else {
      resultMessage = 'You Lose!';
      resultColor = 'text-red-600'; // Red for loss
    }
  } else if (gameStatus === 'stalemate' || gameStatus === 'draw') {
    resultMessage = 'Draw';
    resultColor = 'text-slate-600'; // Gray for draw
  } else {
    // Fallback (should not happen in normal flow)
    resultMessage = 'Game Ended';
    resultColor = 'text-slate-600';
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => {
        // Prevent modal dismissal - onOpenChange is a no-op
        // Modal can only be closed through explicit button actions (onPlayAgain, onHome)
        // which call onClose in the parent component
      }}
    >
      <DialogContent 
        className="max-w-[600px] [&>button]:hidden"
        onInteractOutside={(e) => {
          // Prevent modal dismissal by clicking outside
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent modal dismissal by pressing ESC
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className={`text-3xl font-bold text-center ${resultColor}`}>
            {resultMessage}
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-700">
                Final Score: <span className="text-[#78350f]">{sessionScore}</span>
              </div>
              <div className="text-base text-slate-600">
                XP Gained: <span className="font-semibold text-[#78350f]">{xpGained}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
          <Button
            variant="secondary"
            onClick={onHome}
            className="w-full sm:w-auto"
          >
            Home
          </Button>
          <Button
            variant="default"
            onClick={onPlayAgain}
            className="w-full sm:w-auto"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

